-- Migration: GDPR Requests Table
-- Creates table for tracking GDPR deletion requests with automatic scheduling

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create gdpr_requests table
CREATE TABLE IF NOT EXISTS gdpr_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL, -- contact_identifier from questionnaires table
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_delete_at TIMESTAMPTZ NOT NULL GENERATED ALWAYS AS (created_at + INTERVAL '7 days') STORED,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'deleted', 'failed')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_status ON gdpr_requests(status);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_scheduled_delete ON gdpr_requests(scheduled_delete_at);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_profile_id ON gdpr_requests(profile_id);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_pending_delete ON gdpr_requests(status, scheduled_delete_at) 
  WHERE status = 'pending';

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gdpr_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on gdpr_requests
DROP TRIGGER IF EXISTS update_gdpr_requests_updated_at_trigger ON gdpr_requests;
CREATE TRIGGER update_gdpr_requests_updated_at_trigger
  BEFORE UPDATE ON gdpr_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_gdpr_requests_updated_at();

-- Enable Row Level Security
ALTER TABLE gdpr_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only service role can access gdpr_requests
DROP POLICY IF EXISTS "Service role can manage GDPR requests" ON gdpr_requests;
CREATE POLICY "Service role can manage GDPR requests"
  ON gdpr_requests
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add comment to table
COMMENT ON TABLE gdpr_requests IS 'Stores GDPR deletion requests. Records are automatically scheduled for deletion 7 days (1 week) after creation.';
COMMENT ON COLUMN gdpr_requests.profile_id IS 'contact_identifier from questionnaires table - identifies the user profile to delete';
COMMENT ON COLUMN gdpr_requests.scheduled_delete_at IS 'Automatically calculated as created_at + 7 days (1 week). Cannot be manually set.';
COMMENT ON COLUMN gdpr_requests.status IS 'Status: pending (waiting for deletion), deleted (successfully deleted), failed (deletion failed)';
