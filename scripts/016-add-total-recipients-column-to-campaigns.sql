-- Migration to ensure total_recipients column exists in campaigns table
-- This addresses the issue where the total_recipients column was missing from the campaigns table

-- Add the column if it doesn't exist
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS total_recipients INTEGER DEFAULT 0;

-- Update any existing records that might not have a total_recipients value set
UPDATE campaigns SET total_recipients = 0 WHERE total_recipients IS NULL;