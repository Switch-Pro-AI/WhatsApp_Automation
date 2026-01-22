-- Migration to ensure avatar_url column exists in contacts table
-- This addresses the issue where the avatar_url column was missing from the contacts table

-- Add the column if it doesn't exist
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update any existing records that might not have an avatar_url set (set to NULL which is acceptable)
-- No need to set a default value as it's typically NULL for new contacts