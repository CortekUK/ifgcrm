-- Enhance sms_messages table to support SMS replies functionality
-- Add new columns to the existing sms_messages table

-- Add phone_number column (nullable first to allow existing rows)
ALTER TABLE public.sms_messages 
ADD COLUMN IF NOT EXISTS phone_number text;

-- Add status column with proper constraint
ALTER TABLE public.sms_messages 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'unmatched' CHECK (status IN ('unmatched', 'matched', 'spam'));

-- Add matched_at timestamp
ALTER TABLE public.sms_messages 
ADD COLUMN IF NOT EXISTS matched_at timestamptz;

-- Add matched_by_user_id
ALTER TABLE public.sms_messages 
ADD COLUMN IF NOT EXISTS matched_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add source field
ALTER TABLE public.sms_messages 
ADD COLUMN IF NOT EXISTS source text;

-- Add updated_at timestamp
ALTER TABLE public.sms_messages 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_sms_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sms_messages_updated_at_trigger ON public.sms_messages;

CREATE TRIGGER sms_messages_updated_at_trigger
BEFORE UPDATE ON public.sms_messages
FOR EACH ROW
EXECUTE FUNCTION update_sms_messages_updated_at();

-- Enhance activities table with metadata column if it doesn't exist
ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Update existing sms_messages to set phone_number from associated lead if null
UPDATE public.sms_messages sm
SET phone_number = l.phone
FROM public.leads l
WHERE sm.lead_id = l.id AND sm.phone_number IS NULL;

-- Set default status based on is_matched for existing rows
UPDATE public.sms_messages
SET status = CASE 
  WHEN is_matched = true THEN 'matched'
  ELSE 'unmatched'
END
WHERE status IS NULL OR status = 'unmatched';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sms_messages_status ON public.sms_messages(status);
CREATE INDEX IF NOT EXISTS idx_sms_messages_phone ON public.sms_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_messages_created_at ON public.sms_messages(created_at DESC);
