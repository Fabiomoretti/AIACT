create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  company text not null,
  role text not null,
  phone text,
  privacy_consent boolean not null default false,
  marketing_consent boolean not null default false,
  contact_requested boolean not null default false,
  score integer not null check (score >= 0 and score <= 100),
  category text not null,
  recommended_offer text not null,
  risk_flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  answers jsonb not null,
  score integer not null check (score >= 0 and score <= 100),
  category text not null,
  risk_flags jsonb not null default '[]'::jsonb,
  missing_documents jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_email_idx on public.leads(email);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists assessments_lead_id_idx on public.assessments(lead_id);

alter table public.leads enable row level security;
alter table public.assessments enable row level security;

-- Server inserts use SUPABASE_SERVICE_ROLE_KEY and bypass RLS.
-- Add explicit admin policies only if you expose authenticated dashboards later.
