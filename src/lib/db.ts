import { createClient } from '@libsql/client';

// Check if we have Turso credentials
const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url) {
  throw new Error('TURSO_DATABASE_URL environment variable is required');
}

const db = createClient({
  url,
  authToken,
});

let initialized = false;

// Initialize Database - called lazily
export async function ensureDbInitialized() {
  if (initialized) return;

  // Create Profiles Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      daily_goal INTEGER DEFAULT 2000,
      avatar_color TEXT DEFAULT '#7cb342'
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      profile_id INTEGER DEFAULT 1
    )
  `);

  // Migration: Check if entries table has profile_id column, if not, we can't easily add it via IF NOT EXISTS on table creation.
  // SQLite doesn't throw if adding column that exists if using standard SQL, but let's be safe.
  try {
    await db.execute("ALTER TABLE entries ADD COLUMN profile_id INTEGER DEFAULT 1");
  } catch (e) {
    // Column likely exists
  }

  // Seed default profile
  const profiles = await db.execute("SELECT * FROM profiles LIMIT 1");
  if (profiles.rows.length === 0) {
    await db.execute("INSERT INTO profiles (name, daily_goal) VALUES ('Main User', 2000)");
  }

  initialized = true;
}

export default db;
