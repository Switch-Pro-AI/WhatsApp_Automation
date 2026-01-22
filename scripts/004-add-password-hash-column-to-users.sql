-- Migration to ensure password_hash column exists in users table
-- This addresses the issue where the password_hash column was missing from the users table

-- First, add the column if it doesn't exist (with a temporary nullable definition)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Update any existing records that might not have a password_hash set
UPDATE users SET password_hash = '$2a$10$placeholder_password_hash_for_existing_users_that_should_never_work' WHERE password_hash IS NULL OR password_hash = '';

-- Now, make the column NOT NULL
ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;