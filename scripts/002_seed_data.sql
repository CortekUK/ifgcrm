-- This script will seed initial data for testing
-- Note: You'll need to be logged in for this to work due to RLS

-- Insert sample programs
insert into public.programs (name, description, color, user_id)
values 
  ('Premier League Academy', 'Elite training program for aspiring professionals', '#3b82f6', auth.uid()),
  ('Youth Development', 'Foundation skills for young players', '#10b981', auth.uid()),
  ('Goalkeeper Training', 'Specialized goalkeeper coaching', '#f59e0b', auth.uid()),
  ('Summer Camps', 'Intensive summer training sessions', '#ef4444', auth.uid())
on conflict do nothing;

-- Insert sample leads
insert into public.leads (name, email, phone, program_id, status, notes, user_id)
select 
  'John Smith',
  'john.smith@example.com',
  '+1234567890',
  p.id,
  'new',
  'Interested in joining the academy',
  auth.uid()
from public.programs p
where p.name = 'Premier League Academy' and p.user_id = auth.uid()
limit 1;

insert into public.leads (name, email, phone, program_id, status, notes, user_id)
select 
  'Emma Johnson',
  'emma.j@example.com',
  '+1234567891',
  p.id,
  'contacted',
  'Parent inquired about training schedule',
  auth.uid()
from public.programs p
where p.name = 'Youth Development' and p.user_id = auth.uid()
limit 1;

insert into public.leads (name, email, phone, program_id, status, notes, user_id)
select 
  'Michael Chen',
  'mchen@example.com',
  '+1234567892',
  p.id,
  'qualified',
  'Ready to enroll for next season',
  auth.uid()
from public.programs p
where p.name = 'Goalkeeper Training' and p.user_id = auth.uid()
limit 1;

-- Insert sample SMS messages
insert into public.sms_messages (lead_id, message, direction, is_matched, user_id)
select 
  l.id,
  'Hi, I am interested in the Premier League Academy program',
  'inbound',
  false,
  auth.uid()
from public.leads l
where l.name = 'John Smith' and l.user_id = auth.uid()
limit 1;

insert into public.sms_messages (lead_id, message, direction, is_matched, user_id)
select 
  l.id,
  'Thanks for your interest! We will get back to you shortly.',
  'outbound',
  true,
  auth.uid()
from public.leads l
where l.name = 'John Smith' and l.user_id = auth.uid()
limit 1;

-- Insert sample activities
insert into public.activities (type, description, lead_id, user_id)
select 
  'lead_created',
  'New lead added to system',
  l.id,
  auth.uid()
from public.leads l
where l.user_id = auth.uid()
limit 3;

insert into public.activities (type, description, user_id)
values 
  ('program_created', 'Premier League Academy program created', auth.uid()),
  ('sms_sent', 'SMS campaign sent to 15 leads', auth.uid());
