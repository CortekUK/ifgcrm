# IFG CRM Dashboard

A modern, full-stack CRM system for International Football Academy with Supabase backend integration.

## Features

- **User Authentication**: Email/password authentication with Supabase
- **Admin Portal**: Separate admin login with role-based access control
- **Dashboard**: Real-time stats, unmatched SMS replies, leads by program, and activity feed
- **Database Integration**: Full Supabase integration with Row Level Security (RLS)

## Getting Started

### Quick Start - Super Admin Login

**Want to login as admin immediately?**

1. Go to `/auth/sign-up` and create account with:
   - Email: `admin@ifgcrm.com`
   - Password: `SuperAdmin123!`
2. Verify your email
3. Run script `004_create_super_admin.sql` in the Scripts panel
4. Login at `/admin/login` with the same credentials

**Full instructions**: See [ADMIN_LOGIN.md](./ADMIN_LOGIN.md)

### 1. Database Setup

First, run the SQL scripts to set up your database tables:

1. Navigate to the Scripts panel in v0
2. Run `001_create_schema.sql` - Creates all tables with RLS policies
3. Run `002_seed_data.sql` - Adds sample data for testing
4. Run `003_add_admin_role.sql` - Adds role column to profiles

### 2. Create Your First User

1. Visit `/auth/sign-up` to create a regular user account
2. Check your email to verify your account
3. Login at `/auth/login`

### 3. Create Admin Account

To access the admin portal:

1. Sign up with your admin email (e.g., admin@ifg.com)
2. After signup, go to your Supabase dashboard
3. Navigate to Table Editor → profiles
4. Find your user and update the `role` column to `'admin'`
5. Now you can access `/admin/login` with admin privileges

## Routes

### Public Routes
- `/` - Redirects to dashboard
- `/auth/login` - User login
- `/auth/sign-up` - User registration
- `/auth/verify-email` - Email verification

### Protected Routes (Requires Authentication)
- `/dashboard` - Main CRM dashboard

### Admin Routes (Requires Admin Role)
- `/admin/login` - Admin login portal
- `/admin/dashboard` - System-wide admin dashboard

## Database Schema

### Tables

1. **profiles** - User profiles with role-based access
2. **programs** - Training programs (e.g., Youth Academy, Elite Training)
3. **leads** - Potential recruits and their information
4. **sms_messages** - SMS communication history with match tracking
5. **activities** - Activity log for all CRM actions

All tables have Row Level Security (RLS) enabled, ensuring users can only access their own data.

## Environment Variables

The following environment variables are automatically configured through the Supabase integration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4

## Security Features

- Row Level Security (RLS) on all tables
- Server-side authentication checks
- Middleware protection for all routes
- Admin role verification for admin portal
- Secure session management with automatic token refresh
