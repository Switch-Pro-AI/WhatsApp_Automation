-- Migration to ensure whatsapp_accounts table exists
-- This addresses the issue where the whatsapp_accounts table was missing from the database

-- Create the whatsapp_accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  phone_number_id VARCHAR(100),
  waba_id VARCHAR(100),
  access_token TEXT,
  webhook_verify_token VARCHAR(255),
  display_name VARCHAR(255),
  quality_rating VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_whatsapp_accounts_tenant ON whatsapp_accounts(tenant_id);