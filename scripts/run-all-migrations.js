import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env if .env.local doesn't exist

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in environment variables');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);

  const migrationFiles = [
    './scripts/009-add-avatar-url-column-to-users.sql',
    './scripts/010-add-whatsapp-id-column-to-conversations.sql',
    './scripts/011-add-description-column-to-campaigns.sql',
    './scripts/012-create-quick-replies-table.sql'
  ];

  for (const migrationFile of migrationFiles) {
    console.log(`\nRunning migration: ${migrationFile}`);
    
    try {
      // Read the migration SQL file
      const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
      
      // Split the SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      console.log(`Executing ${statements.length} migration statements...`);
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log(`Executing: ${statement.substring(0, 100)}${statement.length > 100 ? '...' : ''}`);
          await sql.query(statement);
        }
      }
      
      console.log(`Migration completed: ${migrationFile}`);
    } catch (error) {
      console.error(`Error running migration ${migrationFile}:`, error.message);
      // Continue with other migrations even if one fails
    }
  }

  console.log('\nAll migrations completed!');
}

// Run the migrations
runMigrations().catch(console.error);