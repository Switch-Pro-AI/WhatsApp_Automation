-- Migration to ensure role column exists in users table
-- This addresses the issue where the role column was missing from the users table

-- First, add the column if it doesn't exist (with a temporary nullable definition)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50);

-- Update any existing records that might not have a role set
UPDATE users SET role = 'agent' WHERE role IS NULL OR role = '';

-- Now, set the default value and make the column NOT NULL
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'agent';
ALTER TABLE users ALTER COLUMN role SET NOT NULL;