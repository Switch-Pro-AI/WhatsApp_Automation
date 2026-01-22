-- Migration to create quick_replies table
-- This addresses the issue where the quick_replies table was missing from the database

-- Create the quick_replies table if it doesn't exist
CREATE TABLE IF NOT EXISTS quick_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  shortcut VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, shortcut)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_quick_replies_tenant ON quick_replies(tenant_id);