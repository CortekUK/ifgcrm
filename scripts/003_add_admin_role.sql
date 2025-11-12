-- Add role column to profiles table
alter table public.profiles add column if not exists role text default 'user';

-- Create admin user (use this email to create an admin account)
-- You'll need to sign up with admin@ifg.com first, then run this to upgrade to admin
-- Update the role for admin users
-- Replace 'your-admin-user-id' with actual user ID after signup
-- or manually set role to 'admin' in Supabase dashboard

-- Create index for faster role lookups
create index if not exists profiles_role_idx on public.profiles(role);

-- Allow users to read their own role
create policy "profiles_select_own_role"
  on public.profiles for select
  using (auth.uid() = id);
