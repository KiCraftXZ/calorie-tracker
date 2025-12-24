'use server';

import db, { ensureDbInitialized } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface Entry {
    id: number;
    name: string;
    calories: number;
    created_at: string;
}

export async function getTodayEntries() {
    await ensureDbInitialized();

    const result = await db.execute(`
    SELECT * FROM entries 
    WHERE date(created_at, 'localtime') = date('now', 'localtime')
    ORDER BY created_at DESC
  `);

    return result.rows as unknown as Entry[];
}

export async function getAllEntries() {
    await ensureDbInitialized();

    const result = await db.execute(`
    SELECT * FROM entries 
    ORDER BY created_at DESC
  `);
    return result.rows as unknown as Entry[];
}

export async function addEntry(formData: FormData) {
    await ensureDbInitialized();

    const name = formData.get('name') as string;
    const calories = parseInt(formData.get('calories') as string);

    if (!name || isNaN(calories)) {
        throw new Error('Invalid input');
    }

    await db.execute({
        sql: 'INSERT INTO entries (name, calories) VALUES (?, ?)',
        args: [name, calories]
    });

    revalidatePath('/');
    revalidatePath('/history');
}

export async function deleteEntry(id: number) {
    await ensureDbInitialized();

    await db.execute({
        sql: 'DELETE FROM entries WHERE id = ?',
        args: [id]
    });
    revalidatePath('/');
    revalidatePath('/history');
}

export async function getGoal() {
    await ensureDbInitialized();

    const result = await db.execute("SELECT value FROM settings WHERE key = 'daily_goal'");
    const row = result.rows[0] as { value: string } | undefined;
    return parseInt(row?.value || '2000');
}

export async function updateGoal(newGoal: number) {
    await ensureDbInitialized();

    await db.execute({
        sql: "INSERT OR REPLACE INTO settings (key, value) VALUES ('daily_goal', ?)",
        args: [String(newGoal)]
    });
    revalidatePath('/');
    revalidatePath('/settings');
}
