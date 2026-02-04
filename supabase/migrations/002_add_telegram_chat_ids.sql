-- Add table to store Telegram chat_ids for users
-- This allows sending OTP codes to users who have started conversation with bot
-- Only PRIVATE chats are stored to ensure OTP codes go to personal messages

CREATE TABLE IF NOT EXISTS telegram_chat_ids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_identifier TEXT NOT NULL UNIQUE, -- Normalized telegram username (without @)
  chat_id TEXT NOT NULL, -- For private chats, chat_id = user_id
  user_id TEXT, -- Telegram user ID for direct sending to personal messages
  username TEXT, -- Original username for reference
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add user_id column if table already exists (for existing installations)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'telegram_chat_ids' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE telegram_chat_ids ADD COLUMN user_id TEXT;
  END IF;
END $$;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_telegram_chat_ids_contact ON telegram_chat_ids(contact_identifier);
CREATE INDEX IF NOT EXISTS idx_telegram_chat_ids_chat_id ON telegram_chat_ids(chat_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_telegram_chat_ids_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_telegram_chat_ids_updated_at ON telegram_chat_ids;
CREATE TRIGGER update_telegram_chat_ids_updated_at
  BEFORE UPDATE ON telegram_chat_ids
  FOR EACH ROW
  EXECUTE FUNCTION update_telegram_chat_ids_updated_at();

-- Row Level Security: Only service_role can access
ALTER TABLE telegram_chat_ids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS service_role_all ON telegram_chat_ids;
CREATE POLICY service_role_all ON telegram_chat_ids
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
