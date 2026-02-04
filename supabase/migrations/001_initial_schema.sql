-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (CASCADE will automatically drop triggers, policies, and functions)
DROP TABLE IF EXISTS questionnaires CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS otp_codes CASCADE;

-- Drop existing functions if they still exist (in case they weren't dropped with tables)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS clean_expired_otp() CASCADE;
DROP FUNCTION IF EXISTS clean_expired_sessions() CASCADE;

-- Table for storing OTP codes
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_identifier TEXT NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('telegram', 'phone')),
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contact_identifier, code)
);

-- Index for faster lookups
CREATE INDEX idx_otp_contact ON otp_codes(contact_identifier);
CREATE INDEX idx_otp_expires ON otp_codes(expires_at);

-- Table for storing session tokens
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT NOT NULL UNIQUE,
  contact_identifier TEXT NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('telegram', 'phone')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_contact ON sessions(contact_identifier);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- Table for storing encrypted questionnaires
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  questionnaire_id TEXT NOT NULL, -- Original ID from client
  contact_identifier TEXT NOT NULL,
  contact_type TEXT NOT NULL CHECK (contact_type IN ('telegram', 'phone')),
  encrypted_data TEXT NOT NULL, -- AES-256-CBC encrypted JSON
  questionnaire_type TEXT NOT NULL,
  language TEXT NOT NULL,
  submitted_at BIGINT NOT NULL, -- Unix timestamp
  telegram_message_id BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contact_identifier, questionnaire_id)
);

-- Indexes for faster lookups
CREATE INDEX idx_questionnaires_contact ON questionnaires(contact_identifier);
CREATE INDEX idx_questionnaires_type ON questionnaires(questionnaire_type);
CREATE INDEX idx_questionnaires_submitted ON questionnaires(submitted_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on questionnaires
-- Note: No need to DROP here since table was just created
CREATE TRIGGER update_questionnaires_updated_at
  BEFORE UPDATE ON questionnaires
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired OTP codes (runs automatically)
CREATE OR REPLACE FUNCTION clean_expired_otp()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_codes WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- Function to clean expired sessions
CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- Enable Row Level Security
ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;

-- RLS Policies for otp_codes (only service role can access)
DROP POLICY IF EXISTS "Service role can manage OTP codes" ON otp_codes;
CREATE POLICY "Service role can manage OTP codes"
  ON otp_codes
  FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for sessions (only service role can access)
DROP POLICY IF EXISTS "Service role can manage sessions" ON sessions;
CREATE POLICY "Service role can manage sessions"
  ON sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policies for questionnaires (only service role can access)
DROP POLICY IF EXISTS "Service role can manage questionnaires" ON questionnaires;
CREATE POLICY "Service role can manage questionnaires"
  ON questionnaires
  FOR ALL
  USING (auth.role() = 'service_role');

-- Note: In production, you might want to use service role key for API access
-- and create more granular policies based on contact_identifier matching
