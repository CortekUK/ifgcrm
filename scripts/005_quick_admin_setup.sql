-- Quick Admin Setup Script
-- This creates a test admin account directly in the profiles table
-- Note: You still need to sign up via /auth/sign-up first to create the auth user
-- Then run this script to promote the account to admin

-- Instructions:
-- 1. Go to /auth/sign-up and create an account with:
--    Email: admin@ifgcrm.com
--    Password: SuperAdmin123!
--    Full Name: Super Admin
-- 2. Check your email and click the verification link
-- 3. Then this account will be ready to use

-- If you've already signed up, this will update your role to admin
UPDATE profiles
SET role = 'admin',
    updated_at = NOW()
WHERE email = 'admin@ifgcrm.com';

-- Verify the admin was created
SELECT id, email, full_name, role, created_at
FROM profiles
WHERE email = 'admin@ifgcrm.com';
