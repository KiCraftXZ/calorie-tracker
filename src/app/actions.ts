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

export interface Profile {
    id: number;
    name: string;
    daily_goal: number;
    avatar_color: string;
}

async function getProfileId() {
    const cookieStore = await cookies();
    const id = cookieStore.get('active_profile_id')?.value;
    return id ? parseInt(id) : 1;
}

export async function getProfiles() {
    await ensureDbInitialized();
    const result = await db.execute("SELECT * FROM profiles ORDER BY id");
    return result.rows as unknown as Profile[];
}

export async function createProfile(name: string) {
    await ensureDbInitialized();
    // Premium Organic avatars
    const colors = ['#4F5D48', '#8A9A81', '#C07A55', '#E6C288', '#AAB0A6', '#5C6157', '#8C7662'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    await db.execute({
        sql: "INSERT INTO profiles (name, daily_goal, avatar_color) VALUES (?, 2000, ?)",
        args: [name, randomColor]
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
