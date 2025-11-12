# IFG CRM - Quick Setup Instructions

## Creating Your Admin Account (No Email Verification Required)

### Option 1: Use the Setup Admin Page (Recommended)

1. **Navigate to the setup page**: Go to `/setup-admin`
2. **Enter credentials**:
   - Email: `admin@ifgcrm.com` (or any email you prefer)
   - Password: `SuperAdmin123!` (or any secure password)
3. **Click "Create Admin Account"**
4. **You'll be redirected to login** with a success message
5. **Login immediately** with the credentials you just created

This method bypasses email verification and creates a ready-to-use admin account.

### Option 2: Manual SQL Setup

If you prefer to set up via SQL scripts:

1. Run the scripts in order:
   - `001_create_schema.sql` - Creates all database tables
   - `002_seed_data.sql` - Adds sample data
2. Sign up at `/auth/sign-up` with any email
3. Verify your email via Supabase
4. Run `004_create_super_admin.sql` to promote your account to admin

## Accessing the Dashboard

### Regular User Dashboard
- URL: `/dashboard`
- Access: Any authenticated user

### Admin Dashboard
- URL: `/admin/dashboard`
- Access: Only users with `role = 'admin'`

## Database Schema

The CRM includes these tables:
- **profiles** - User profiles with role-based access
- **programs** - Football academy programs
- **leads** - Potential students/recruits
- **sms_messages** - SMS communication tracking
- **activities** - Activity feed for all actions

All tables have Row Level Security (RLS) enabled.

## Quick Links

- Login: `/auth/login`
- Setup Admin: `/setup-admin`
- Sign Up: `/auth/sign-up`
- Dashboard: `/dashboard`
- Admin Dashboard: `/admin/dashboard`

## Troubleshooting

**"Invalid login credentials" error?**
- Make sure you created an account first via `/setup-admin`
- Check that you're using the exact email and password you set

**Can't access admin dashboard?**
- Verify your profile role is set to `'admin'` in the profiles table
- Try logging out and back in to refresh your session

**Database tables missing?**
- Run the SQL scripts from the `scripts/` folder in order
- Check your Supabase connection in the Connect section
