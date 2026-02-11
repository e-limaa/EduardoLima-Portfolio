-- Create a table for newsletter subscribers
create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  email text not null
);

-- Enable Row Level Security (RLS)
alter table public.newsletter_subscribers enable row level security;

-- Create a policy that allows anyone to insert data (subscribe)
create policy "Enable insert for all users" on public.newsletter_subscribers
  for insert with check (true);

-- Create a policy that allows only authenticated users (or specific roles) to read data
-- Adjust this based on your specific security needs. For now, allowing read if needed by admin or service role
create policy "Enable read access for service role" on public.newsletter_subscribers
  for select using (auth.role() = 'service_role');
