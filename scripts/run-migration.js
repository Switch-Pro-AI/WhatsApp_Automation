import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env if .env.local doesn't exist

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in environment variables');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  const migrationFilePath = './scripts/008-add-avatar-url-column-to-contacts.sql';

  console.log('Running database migration...');
  console.log('Migration file:', migrationFilePath);

  try {
    // Read the migration SQL file
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');

    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`\nExecuting ${statements.length} migration statements...`);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
      await sql.query(statement);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error.message);
  } finally {
    // Close the connection pool if needed
    if (sql.end) {
      await sql.end();
    }
  }
}

// Run the migration
runMigration().catch(console.error);