import { neon } from "@neondatabase/serverless"

// Create a factory function that initializes the connection when needed
let initializedSql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (!initializedSql) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set in environment variables");
    }
    initializedSql = neon(process.env.DATABASE_URL);
  }
  return initializedSql;
}

export async function query<T>(
  queryText: string,
  params: unknown[] = []
): Promise<T[]> {
  const sql = getSql();

  // For Neon serverless client, we need to use tagged template literals
  // Transform "SELECT * FROM table WHERE id = $1" with [value]
  // to sql`SELECT * FROM table WHERE id = ${value}`
  if (params.length === 0) {
    // If no parameters, execute as tagged template directly
    const result = await sql.unsafe(queryText);
    // Handle different response formats from Neon
    if (Array.isArray(result)) {
      return result as T[]
    }
    if (result && typeof result === 'object' && 'rows' in result) {
      return (result as { rows: T[] }).rows
    }
    return [];
  } else {
    // Use the unsafe method which properly handles parameterized queries
    const result = await sql.unsafe(queryText, params);
    // Handle different response formats from Neon
    if (Array.isArray(result)) {
      return result as T[]
    }
    if (result && typeof result === 'object' && 'rows' in result) {
      return (result as { rows: T[] }).rows
    }
    return [];
  }
}

export async function queryOne<T>(
  queryText: string,
  params: unknown[] = []
): Promise<T | null> {
  const result = await query<T>(queryText, params)
  return result && Array.isArray(result) && result.length > 0 ? result[0] : null
}

// Export a getter function instead of the direct instance
export function getDatabaseClient() {
  return getSql();
}

// For backward compatibility, export a lazy-loaded sql object
export const sql = {
  query: async <T>(queryText: string, params: unknown[] = []): Promise<T[]> => {
    return query<T>(queryText, params);
  }
};
