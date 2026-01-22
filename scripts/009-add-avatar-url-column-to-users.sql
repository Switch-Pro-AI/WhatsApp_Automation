-- Migration to ensure avatar_url column exists in users table
-- This addresses the issue where the avatar_url column was missing from the users table

-- Add the column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update any existing records that might not have an avatar_url set (set to NULL which is acceptable)
-- No need to set a default value as it's typically NULL for new users