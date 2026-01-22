import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

const sql = neon(process.env.DATABASE_URL)

export async function query<T>(
  queryText: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await sql.query(queryText, params)
  // Handle different response formats from Neon
  if (Array.isArray(result)) {
    return result as T[]
  }
  if (result && typeof result === 'object' && 'rows' in result) {
    return (result as { rows: T[] }).rows
  }
  return []
}

export async function queryOne<T>(
  queryText: string,
  params: unknown[] = []
): Promise<T | null> {
  const result = await query<T>(queryText, params)
<<<<<<< HEAD
  return result && Array.isArray(result) && result.length > 0 ? result[0] : null
=======
  return result[0] || null
>>>>>>> aa992935bc6a2d96a9f1b8f1da60461b23f61d04
}

export { sql }
