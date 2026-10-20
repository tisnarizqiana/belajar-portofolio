import { createClient } from '@libsql/client/web';

let clientInstance = null;

/**
 * Returns a singleton LibSQL client connected to Turso or local SQLite.
 */
export function getDb() {
  if (clientInstance) {
    return clientInstance;
  }

  const url = process.env.TURSO_DATABASE_URL || 'file:portfolio.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  clientInstance = createClient({
    url,
    authToken,
  });

  return clientInstance;
}

/**
 * Helper to run a parameterized query.
 * @param {string} sql 
 * @param {any[]} args 
 */
export async function query(sql, args = []) {
  const db = getDb();
  return await db.execute({ sql, args });
}

/**
 * Helper to execute multiple statements in a transaction or batch.
 * @param {Array<{sql: string, args?: any[]}>} statements 
 */
export async function batch(statements) {
  const db = getDb();
  return await db.batch(statements);
}
