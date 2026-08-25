import { createClient, Client, InValue } from '@libsql/client';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Auto-load .env.local for standalone scripts (no-op in Next.js where env is already loaded).
for (const file of ['.env.local', '.env']) {
  const path = resolve(process.cwd(), file);
  if (existsSync(path)) {
    try {
      process.loadEnvFile(path);
    } catch {
      // process.loadEnvFile requires Node 20.12+; ignore if unavailable
    }
    break;
  }
}

let cachedClient: Client | null = null;

function buildClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      'TURSO_DATABASE_URL no está definida. Para desarrollo local usá "file:./data/products.db" en .env.local.'
    );
  }

  const isLocalFile = url.startsWith('file:');
  const authToken = process.env.TURSO_AUTH_TOKEN;

  return createClient({
    url,
    authToken: isLocalFile ? undefined : authToken,
  });
}

export function getDb(): Client {
  if (!cachedClient) {
    cachedClient = buildClient();
  }
  return cachedClient;
}

export type QueryResult<T = Record<string, unknown>> = {
  rows: T[];
  rowsAffected: number;
  lastInsertRowid?: number | bigint;
};

export async function query<T = Record<string, unknown>>(
  sql: string,
  args: InValue[] = []
): Promise<T[]> {
  const result = await getDb().execute({ sql, args });
  return result.rows as unknown as T[];
}

export async function execute(
  sql: string,
  args: InValue[] = []
): Promise<QueryResult> {
  const result = await getDb().execute({ sql, args });
  return {
    rows: result.rows as unknown as Record<string, unknown>[],
    rowsAffected: result.rowsAffected,
    lastInsertRowid: result.lastInsertRowid,
  };
}

export async function executeBatch(
  statements: Array<{ sql: string; args: InValue[] }>
): Promise<void> {
  await getDb().batch(statements);
}