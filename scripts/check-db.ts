import { neon } from '@neondatabase/serverless';

// Get the database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set in environment variables');
  process.exit(1);
}

async function checkDatabase() {
  try {
    console.log('Creating database connection...');
    const sql = neon(DATABASE_URL);
    
    console.log('Checking if users table exists...');
    const result = await sql(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      ) AS table_exists;
    `);
    
    console.log('Users table exists:', result[0]?.table_exists);
    
    if (result[0]?.table_exists) {
      console.log('Checking user count...');
      const userCount = await sql('SELECT COUNT(*) FROM users;');
      console.log('Number of users:', userCount[0]?.count || 0);
    } else {
      console.log('Users table does not exist. You need to run database migrations.');
    }
    
    // Also check for tenants table
    const tenantResult = await sql(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tenants'
      ) AS table_exists;
    `);
    
    console.log('Tenants table exists:', tenantResult[0]?.table_exists);
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database error:', error);
  }
}

checkDatabase();