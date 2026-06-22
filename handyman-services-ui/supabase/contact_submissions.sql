create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  service_needed text not null,
  property_type text,
  preferred_timing text,
  message text not null,
  source text default 'website',
  status text default 'new',
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;
