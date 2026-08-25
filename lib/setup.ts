import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { getDb, query, execute } from './db';

let setupPromise: Promise<void> | null = null;

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS products (
    id           TEXT PRIMARY KEY,
    name         TEXT NOT NULL,
    description  TEXT NOT NULL,
    category     TEXT NOT NULL,
    priceBs      REAL NOT NULL,
    priceUsd     REAL NOT NULL,
    image        TEXT NOT NULL,
    stock        INTEGER NOT NULL DEFAULT 0,
    badge        TEXT,
    rating       REAL,
    presentation TEXT,
    ingredients  TEXT,
    benefits     TEXT,
    usage        TEXT,
    createdAt    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS admins (
    id           TEXT PRIMARY KEY,
    username     TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    createdAt    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
  `CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)`,
];

async function createTables(): Promise<void> {
  const db = getDb();
  for (const sql of SCHEMA_STATEMENTS) {
    await db.execute(sql);
  }
}

async function createInitialAdmin(): Promise<string | null> {
  const username = process.env.INITIAL_ADMIN_USER;
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!username || !password) return null;

  const existing = await query<{ count: number }>(
    'SELECT COUNT(*) as count FROM admins'
  );
  const count = Number(existing[0]?.count ?? 0);

  if (count > 0) return null;

  const id = randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);

  await execute(
    'INSERT INTO admins (id, username, passwordHash) VALUES (?, ?, ?)',
    [id, username, passwordHash]
  );

  return username;
}

async function runSetup(): Promise<void> {
  await createTables();
  const createdAdmin = await createInitialAdmin();

  if (createdAdmin) {
    console.log(
      `[setup] Tablas creadas + admin inicial "${createdAdmin}" creado desde INITIAL_ADMIN_USER.`
    );
  } else {
    console.log('[setup] Tablas verificadas. Admin inicial: ya existe o INITIAL_ADMIN_* no están definidas.');
  }
}

/**
 * Idempotente: corre una vez por proceso. Llamadas concurrentes comparten la misma promesa.
 * Llamalo desde cualquier Route Handler / Server Component / script CLI.
 */
export function ensureSetup(): Promise<void> {
  if (!setupPromise) {
    setupPromise = runSetup().catch((err) => {
      setupPromise = null; // reset para permitir retry
      throw err;
    });
  }
  return setupPromise;
}