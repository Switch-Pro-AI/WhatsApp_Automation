-- Migration to ensure description column exists in campaigns table
-- This addresses the issue where the description column was missing from the campaigns table

-- Add the column if it doesn't exist
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS description TEXT;

-- Update any existing records that might not have a description set (set to NULL which is acceptable)
-- No need to set a default value as it's typically NULL for new campaigns