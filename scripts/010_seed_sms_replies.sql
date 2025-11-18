-- Seed demo SMS replies data
-- Note: You'll need to be logged in for this to work due to RLS

-- Insert unmatched SMS replies (from phone numbers not in system)
INSERT INTO public.sms_messages (phone_number, message, direction, status, source, created_at, user_id)
VALUES 
  ('+44 7700 900123', 'Hi, I''m interested in the US College pathway. What are the requirements?', 'inbound', 'unmatched', 'clicksend', now() - interval '2 hours', auth.uid()),
  ('+44 7700 900456', 'I''ve submitted my application. Can someone confirm it was received?', 'inbound', 'unmatched', 'twilio', now() - interval '1 day', auth.uid()),
  ('+44 7851 234567', 'What training programs do you offer for goalkeepers?', 'inbound', 'unmatched', 'clicksend', now() - interval '3 hours', auth.uid()),
  ('+1 555 0198', 'Is there still space in the summer camp?', 'inbound', 'unmatched', 'clicksend', now() - interval '5 hours', auth.uid())
ON CONFLICT DO NOTHING;

-- Insert matched SMS replies (linked to existing leads)
INSERT INTO public.sms_messages (phone_number, message, direction, status, lead_id, matched_at, matched_by_user_id, source, created_at, user_id)
SELECT 
  l.phone,
  'Thanks for the info! When does the next recruitment camp start?',
  'inbound',
  'matched',
  l.id,
  now() - interval '2 days',
  auth.uid(),
  'twilio',
  now() - interval '3 days',
  auth.uid()
FROM public.leads l
WHERE l.name = 'Emma Johnson' AND l.user_id = auth.uid()
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.sms_messages (phone_number, message, direction, status, lead_id, matched_at, matched_by_user_id, source, created_at, user_id)
SELECT 
  l.phone,
  'Perfect! I''ll be there on Saturday.',
  'inbound',
  'matched',
  l.id,
  now() - interval '1 day',
  auth.uid(),
  'clicksend',
  now() - interval '2 days',
  auth.uid()
FROM public.leads l
WHERE l.name = 'Michael Chen' AND l.user_id = auth.uid()
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert spam SMS replies
INSERT INTO public.sms_messages (phone_number, message, direction, status, source, created_at, user_id)
VALUES 
  ('+1 800 SPAM', 'URGENT: Your account needs verification. Click here now!', 'inbound', 'spam', 'unknown', now() - interval '4 days', auth.uid()),
  ('+44 7000 111222', 'Win a free iPhone! Text WIN to claim your prize today!', 'inbound', 'spam', 'unknown', now() - interval '7 days', auth.uid())
ON CONFLICT DO NOTHING;

-- Add corresponding activities for matched replies
INSERT INTO public.activities (type, description, lead_id, metadata, created_at, user_id)
SELECT 
  'sms_reply',
  'Inbound SMS: Thanks for the info! When does the next recruitment...',
  sm.lead_id,
  jsonb_build_object('smsReplyId', sm.id, 'phoneNumber', sm.phone_number),
  sm.matched_at,
  auth.uid()
FROM public.sms_messages sm
WHERE sm.status = 'matched' AND sm.lead_id IS NOT NULL AND sm.user_id = auth.uid()
ON CONFLICT DO NOTHING;
