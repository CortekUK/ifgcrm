-- Create contact_lists table for storing marketing lists
CREATE TABLE IF NOT EXISTS contact_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'static' CHECK (type IN ('static', 'smart')),
  filters_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES profiles(id)
);

-- Create junction table for static list membership
CREATE TABLE IF NOT EXISTS list_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES contact_lists(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, lead_id)
);

-- Add RLS policies
ALTER TABLE contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_lists_select_own" ON contact_lists FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "contact_lists_insert_own" ON contact_lists FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "contact_lists_update_own" ON contact_lists FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "contact_lists_delete_own" ON contact_lists FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "list_contacts_select_own" ON list_contacts FOR SELECT USING (
  list_id IN (SELECT id FROM contact_lists WHERE user_id = auth.uid())
);
CREATE POLICY "list_contacts_insert_own" ON list_contacts FOR INSERT WITH CHECK (
  list_id IN (SELECT id FROM contact_lists WHERE user_id = auth.uid())
);
CREATE POLICY "list_contacts_delete_own" ON list_contacts FOR DELETE USING (
  list_id IN (SELECT id FROM contact_lists WHERE user_id = auth.uid())
);
