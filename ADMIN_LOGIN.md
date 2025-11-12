# Super Admin Login Instructions

## Quick Setup (2 Steps)

### Step 1: Create Super Admin Account

1. Go to `/auth/sign-up`
2. Sign up with these credentials:
   - **Email**: `admin@ifgcrm.com`
   - **Password**: `SuperAdmin123!`
   - Full Name: `Super Admin`
3. Verify your email (check inbox for Supabase confirmation)

### Step 2: Promote to Admin

1. In v0, go to the Scripts panel
2. Run the script: `004_create_super_admin.sql`
3. This will automatically promote your account to admin role

### Step 3: Login as Admin

1. Go to `/admin/login`
2. Login with:
   - **Email**: `admin@ifgcrm.com`
   - **Password**: `SuperAdmin123!`
3. You now have full admin access

---

## Admin Credentials

**Super Admin Login:**
- Email: `admin@ifgcrm.com`
- Password: `SuperAdmin123!`
- Access: `/admin/login`

**Regular User Login:**
- Create your own at `/auth/sign-up`
- Access: `/auth/login`

---

## What Admin Can Do

The admin dashboard at `/admin/dashboard` provides:
- System-wide overview of all users and leads
- Complete user management
- All program statistics
- Full SMS message history
- System-wide activity log

Regular users at `/dashboard` can only see their own data due to Row Level Security policies.
