-- Migration to ensure name column exists in users table
-- This addresses the issue where the name column was missing from the users table

-- First, add the column if it doesn't exist (with a temporary nullable definition)
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Update any existing records that might not have a name set
UPDATE users SET name = 'Unknown User' WHERE name IS NULL OR name = '';

-- Now, make the column NOT NULL
ALTER TABLE users ALTER COLUMN name SET NOT NULL;