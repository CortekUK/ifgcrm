-- Create Super Admin User
-- This script promotes a user to super admin after they sign up

-- Step 1: First sign up with these credentials:
-- Email: admin@ifgcrm.com
-- Password: SuperAdmin123!

-- Step 2: After signup and email verification, run this script
-- It will find your user by email and set them as admin

-- Update user to admin role by email
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users 
  where email = 'admin@ifgcrm.com'
  limit 1
);

-- Verify the admin was created
select 
  p.id,
  u.email,
  p.role,
  p.full_name
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'admin';
