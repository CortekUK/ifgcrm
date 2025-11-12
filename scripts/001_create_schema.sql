-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Create programs table
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  color text default '#3b82f6',
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade
);

alter table public.programs enable row level security;

create policy "programs_select_own"
  on public.programs for select
  using (auth.uid() = user_id);

create policy "programs_insert_own"
  on public.programs for insert
  with check (auth.uid() = user_id);

create policy "programs_update_own"
  on public.programs for update
  using (auth.uid() = user_id);

create policy "programs_delete_own"
  on public.programs for delete
  using (auth.uid() = user_id);

-- Create leads table
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  program_id uuid references public.programs(id) on delete set null,
  status text default 'new',
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade
);

alter table public.leads enable row level security;

create policy "leads_select_own"
  on public.leads for select
  using (auth.uid() = user_id);

create policy "leads_insert_own"
  on public.leads for insert
  with check (auth.uid() = user_id);

create policy "leads_update_own"
  on public.leads for update
  using (auth.uid() = user_id);

create policy "leads_delete_own"
  on public.leads for delete
  using (auth.uid() = user_id);

-- Create sms_messages table
create table if not exists public.sms_messages (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  message text not null,
  direction text not null, -- 'inbound' or 'outbound'
  is_matched boolean default false,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade
);

alter table public.sms_messages enable row level security;

create policy "sms_messages_select_own"
  on public.sms_messages for select
  using (auth.uid() = user_id);

create policy "sms_messages_insert_own"
  on public.sms_messages for insert
  with check (auth.uid() = user_id);

create policy "sms_messages_update_own"
  on public.sms_messages for update
  using (auth.uid() = user_id);

create policy "sms_messages_delete_own"
  on public.sms_messages for delete
  using (auth.uid() = user_id);

-- Create activities table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  description text not null,
  lead_id uuid references public.leads(id) on delete set null,
  created_at timestamp with time zone default now(),
  user_id uuid references auth.users(id) on delete cascade
);

alter table public.activities enable row level security;

create policy "activities_select_own"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "activities_insert_own"
  on public.activities for insert
  with check (auth.uid() = user_id);
