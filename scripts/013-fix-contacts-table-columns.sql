-- Migration to add missing columns to contacts table
-- This addresses the issue where the contacts page expects phone_number and whatsapp_id columns

-- Add the phone_number column if it doesn't exist
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Add the whatsapp_id column if it doesn't exist
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS whatsapp_id VARCHAR(255);

-- Update any existing records that might not have a whatsapp_id set (set to NULL which is acceptable)
-- No need to set a default value as it's typically NULL for new contacts