# Quick Start Guide

## Step 1: Run Database Scripts

Execute these SQL scripts in order in your Supabase SQL Editor:

1. `scripts/001_create_schema.sql` - Creates tables and RLS policies
2. `scripts/002_seed_data.sql` - Adds sample data
3. `scripts/003_add_admin_role.sql` - Sets up admin role column

## Step 2: Create Your Admin Account

1. Go to `/auth/sign-up` in your app
2. Fill in the form:
   - **Full Name**: Super Admin
   - **Email**: admin@ifgcrm.com
   - **Password**: SuperAdmin123!
   - **Repeat Password**: SuperAdmin123!
3. Click "Sign up"
4. Check your email inbox for the verification email from Supabase
5. Click the verification link in the email

## Step 3: Promote to Admin

After verifying your email, run this script in Supabase SQL Editor:

\`\`\`sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@ifgcrm.com';
\`\`\`

## Step 4: Login

Now you can login at `/auth/login` with:
- **Email**: admin@ifgcrm.com
- **Password**: SuperAdmin123!

For admin access, go to `/admin/login` with the same credentials.

## Troubleshooting

**"Invalid login credentials" error:**
- Make sure you've completed Step 2 (signed up)
- Check that you verified your email (Step 2.5)
- Verify the password is exactly: SuperAdmin123!

**Can't access admin dashboard:**
- Make sure you ran the UPDATE query in Step 3
- Check your role in Supabase: `SELECT * FROM profiles WHERE email = 'admin@ifgcrm.com'`
- The role column should show 'admin', not 'user'
