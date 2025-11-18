-- Create enum for list type
DO $$ BEGIN
  CREATE TYPE list_type AS ENUM ('STATIC', 'SMART');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create lists table for marketing lists
CREATE TABLE IF NOT EXISTS public.lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type list_type DEFAULT 'STATIC',
  filters_json jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on lists
ALTER TABLE public.lists ENABLE ROW LEVEL SECURITY;

-- RLS policies for lists
CREATE POLICY "lists_select_own"
  ON public.lists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "lists_insert_own"
  ON public.lists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lists_update_own"
  ON public.lists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "lists_delete_own"
  ON public.lists FOR DELETE
  USING (auth.uid() = user_id);

-- Create list_memberships table to link leads to lists
CREATE TABLE IF NOT EXISTS public.list_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid REFERENCES public.lists(id) ON DELETE CASCADE NOT NULL,
  lead_id uuid REFERENCES public.leads(id) ON DELETE CASCADE NOT NULL,
  added_at timestamp with time zone DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(list_id, lead_id)
);

-- Enable RLS on list_memberships
ALTER TABLE public.list_memberships ENABLE ROW LEVEL SECURITY;

-- RLS policies for list_memberships
CREATE POLICY "list_memberships_select_own"
  ON public.list_memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "list_memberships_insert_own"
  ON public.list_memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "list_memberships_delete_own"
  ON public.list_memberships FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_list_memberships_list_id ON public.list_memberships(list_id);
CREATE INDEX IF NOT EXISTS idx_list_memberships_lead_id ON public.list_memberships(lead_id);

-- Create trigger to update updated_at on lists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lists_updated_at BEFORE UPDATE ON public.lists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
