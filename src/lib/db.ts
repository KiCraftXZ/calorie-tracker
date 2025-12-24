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

  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      calories INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default goal if not exists
  const result = await db.execute("SELECT value FROM settings WHERE key = 'daily_goal'");
  if (result.rows.length === 0) {
    await db.execute("INSERT INTO settings (key, value) VALUES ('daily_goal', '2000')");
  }

  initialized = true;
}

export default db;
