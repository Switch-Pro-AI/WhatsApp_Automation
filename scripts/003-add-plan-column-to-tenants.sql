-- Migration to add missing plan column to tenants table
-- This addresses the issue where the plan column was missing from the tenants table

ALTER TABLE tenants ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'free';

-- Update any existing records that might not have a plan set
UPDATE tenants SET plan = 'free' WHERE plan IS NULL;