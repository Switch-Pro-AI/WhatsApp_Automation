-- Migration to ensure whatsapp_id column exists in conversations table
-- This addresses the issue where the whatsapp_id column was missing from the conversations table

-- Add the column if it doesn't exist
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS whatsapp_id VARCHAR(255);

-- Update any existing records that might not have a whatsapp_id set (set to NULL which is acceptable)
-- No need to set a default value as it's typically NULL for new conversations