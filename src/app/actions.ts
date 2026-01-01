'use server';

import db, { ensureDbInitialized } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface Entry {
    id: number;
    name: string;
    calories: number;
    created_at: string;
    profile_id?: number;
}

export interface WeightEntry {
    id: number;
    weight: number;
    date: string;
    created_at: string;
    profile_id?: number;
}

export interface Profile {
    id: number;
    name: string;
    daily_goal: number;
    avatar_color: string;
    display_order: number;
    age?: number;
    lifestyle?: string;
    current_weight?: number;
    target_weight?: number;
    gender?: string;
    height?: number; // in cm
    weekly_goal?: number; // kg per week
}

async function getProfileId() {
    const cookieStore = await cookies();
    const id = cookieStore.get('active_profile_id')?.value;
    return id ? parseInt(id) : 1;
}

export async function getProfiles() {
    await ensureDbInitialized();
    const result = await db.execute("SELECT * FROM profiles ORDER BY display_order ASC, id ASC");
    return result.rows as unknown as Profile[];
}

export async function createProfile(name: string) {
    await ensureDbInitialized();
    // Premium Organic avatars
    const colors = ['#4F5D48', '#8A9A81', '#C07A55', '#E6C288', '#AAB0A6', '#5C6157', '#8C7662'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Get max display_order
    const maxOrderResult = await db.execute("SELECT MAX(display_order) as max_order FROM profiles");
    const maxOrder = maxOrderResult.rows[0]?.max_order as number || 0;
    const nextOrder = maxOrder + 1;

    await db.execute({
        sql: "INSERT INTO profiles (name, daily_goal, avatar_color, display_order) VALUES (?, 2000, ?, ?)",
        args: [name, randomColor, nextOrder]
    });
    revalidatePath('/');
}

// Rename active profile
export async function renameProfile(newName: string) {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    await db.execute({
        sql: "UPDATE profiles SET name = ? WHERE id = ?",
        args: [newName, profileId]
    });
    revalidatePath('/');
}

export async function moveProfile(id: number, direction: 'up' | 'down') {
    await ensureDbInitialized();
    const profiles = await getProfiles(); // Already sorted by display_order
    const index = profiles.findIndex(p => p.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
        const currentProfile = profiles[index];
        const prevProfile = profiles[index - 1];

        // Swap display_order
        // If display_order is same (e.g. 0 due to migration), force a distinction
        // Actually, since we want to swap positions, we can just swap the display_order values.
        // But if values are equal, swapping does nothing.
        // So we should enforce unique display_order or just swap their entire order values.
        // Better strategy: Ensure they have valid orders first? 
        // Migration ensures they are id based if 0. So they should be distinct initially.

        const tempOrder = currentProfile.display_order;
        const otherOrder = prevProfile.display_order;

        await db.execute({
            sql: "UPDATE profiles SET display_order = ? WHERE id = ?",
            args: [otherOrder, currentProfile.id]
        });
        await db.execute({
            sql: "UPDATE profiles SET display_order = ? WHERE id = ?",
            args: [tempOrder, prevProfile.id]
        });
    } else if (direction === 'down' && index < profiles.length - 1) {
        const currentProfile = profiles[index];
        const nextProfile = profiles[index + 1];

        const tempOrder = currentProfile.display_order;
        const otherOrder = nextProfile.display_order;

        await db.execute({
            sql: "UPDATE profiles SET display_order = ? WHERE id = ?",
            args: [otherOrder, currentProfile.id]
        });
        await db.execute({
            sql: "UPDATE profiles SET display_order = ? WHERE id = ?",
            args: [tempOrder, nextProfile.id]
        });
    }

    revalidatePath('/');
}

// Ensure local date string YYYY-MM-DD
function getLocalDateString() {
    return new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
}

export async function getEntries(date?: string) {
    await ensureDbInitialized();
    const profileId = await getProfileId();
    const targetDate = date || getLocalDateString();

    const result = await db.execute({
        sql: `
      SELECT * FROM entries 
      WHERE date(created_at, 'localtime') = ?
      AND profile_id = ?
      ORDER BY created_at DESC
    `,
        args: [targetDate, profileId]
    });

    return result.rows as unknown as Entry[];
}

export async function getTodayEntries() {
    return getEntries();
}

export async function getAllEntries() {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    const result = await db.execute({
        sql: `
      SELECT * FROM entries 
      WHERE profile_id = ?
      ORDER BY created_at DESC
    `,
        args: [profileId]
    });
    return result.rows as unknown as Entry[];
}

export async function addEntry(formData: FormData) {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    const name = formData.get('name') as string;
    const calories = parseInt(formData.get('calories') as string);
    const dateStr = formData.get('date') as string || getLocalDateString();

    if (!name || isNaN(calories)) {
        throw new Error('Invalid input');
    }

    // If date is today, use current time. If past, use noon on that day.
    let timestamp;
    if (dateStr === getLocalDateString()) {
        timestamp = new Date().toISOString(); // Now
    } else {
        timestamp = new Date(dateStr + 'T12:00:00').toISOString(); // Noon
    }

    await db.execute({
        sql: 'INSERT INTO entries (name, calories, created_at, profile_id) VALUES (?, ?, ?, ?)',
        args: [name, calories, timestamp, profileId]
    });

    revalidatePath('/');
    revalidatePath('/overview');
}

export async function deleteEntry(id: number) {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    await db.execute({
        sql: 'DELETE FROM entries WHERE id = ? AND profile_id = ?',
        args: [id, profileId]
    });
    revalidatePath('/');
    revalidatePath('/overview');
}

export async function getGoal() {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    const result = await db.execute({
        sql: "SELECT daily_goal FROM profiles WHERE id = ?",
        args: [profileId]
    });
    const row = result.rows[0] as unknown as { daily_goal: number } | undefined;
    return row?.daily_goal || 2000;
}

export async function getProfileDetails() {
    await ensureDbInitialized();
    const profileId = await getProfileId();
    const result = await db.execute({
        sql: "SELECT * FROM profiles WHERE id = ?",
        args: [profileId]
    });
    return result.rows[0] as unknown as Profile;
}

export async function updateProfileDetails(formData: FormData) {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    const name = formData.get('name') as string;
    const age = formData.get('age') ? parseInt(formData.get('age') as string) : null;
    const lifestyle = formData.get('lifestyle') as string;
    const currentWeight = formData.get('current_weight') ? parseInt(formData.get('current_weight') as string) : null;
    const targetWeight = formData.get('target_weight') ? parseInt(formData.get('target_weight') as string) : null;
    const gender = formData.get('gender') as string;
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : null;
    const weeklyGoal = formData.get('weekly_goal') ? parseFloat(formData.get('weekly_goal') as string) : null;
    const dailyGoal = parseInt(formData.get('goal') as string);

    await db.execute({
        sql: `
            UPDATE profiles 
            SET name = ?, age = ?, lifestyle = ?, current_weight = ?, target_weight = ?, gender = ?, height = ?, weekly_goal = ?, daily_goal = ?
            WHERE id = ?
        `,
        args: [name, age, lifestyle, currentWeight, targetWeight, gender, height, weeklyGoal, dailyGoal, profileId]
    });

    revalidatePath('/');
    redirect('/');
}

export async function updateGoal(newGoal: number) {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    await db.execute({
        sql: "UPDATE profiles SET daily_goal = ? WHERE id = ?",
        args: [newGoal, profileId]
    });
    revalidatePath('/');
    redirect('/');
}

export async function getWeaklyData() {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    const result = await db.execute({
        sql: `
      SELECT date(created_at, 'localtime') as date, SUM(calories) as total
      FROM entries 
      WHERE profile_id = ? 
      AND created_at >= date('now', '-30 days', 'localtime')
      GROUP BY date(created_at, 'localtime')
      ORDER BY date
    `,
        args: [profileId]
    });

    return result.rows as unknown as { date: string; total: number }[];
}

export async function addWeightEntry(weight: number, date: string) {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    if (!weight || isNaN(weight)) {
        throw new Error('Invalid weight');
    }

    await db.execute({
        sql: 'INSERT INTO weight_entries (weight, date, profile_id) VALUES (?, ?, ?)',
        args: [weight, date, profileId]
    });

    revalidatePath('/weight'); // We will create this path
}

export async function getWeightHistory() {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    const result = await db.execute({
        sql: 'SELECT * FROM weight_entries WHERE profile_id = ? ORDER BY date DESC, created_at DESC',
        args: [profileId]
    });

    return result.rows as unknown as WeightEntry[];
}

export async function deleteWeightEntry(id: number) {
    await ensureDbInitialized();
    const profileId = await getProfileId();

    await db.execute({
        sql: 'DELETE FROM weight_entries WHERE id = ? AND profile_id = ?',
        args: [id, profileId]
    });

    revalidatePath('/weight');
}
