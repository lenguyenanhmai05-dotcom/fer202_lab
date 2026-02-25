-- Create orders table
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    total_price numeric not null,
    items jsonb not null,
    status text default 'pending' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: Ensure Row Level Security (RLS) is enabled and appropriate policies are set
-- for security, but for this lab, a simple table creation is usually sufficient.
-- Optional: Enable RLS and add basic policies
alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  to authenticated
  using ( auth.uid() = user_id );

create policy "Users can insert their own orders"
  on public.orders for insert
  to authenticated
  with check ( auth.uid() = user_id );
