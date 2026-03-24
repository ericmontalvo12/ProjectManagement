-- Property Renovation Tracker Schema (Correct Order)
-- Run this in the Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. Independent tables first
-- ============================================================

create table if not exists buildings (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  city text not null default 'Austin',
  state text not null default 'TX',
  zip text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subcontractors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  company text,
  trade text not null,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stage_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  trade text not null,
  sort_order integer not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- 2. Dependent tables
-- ============================================================

create table if not exists units (
  id uuid primary key default uuid_generate_v4(),
  building_id uuid not null references buildings(id) on delete cascade,
  unit_number text not null,
  floor integer,
  bedrooms integer not null default 1,
  bathrooms integer not null default 1,
  sqft integer,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'blocked', 'completed')),
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists unit_stages (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references units(id) on delete cascade,
  stage_template_id uuid not null references stage_templates(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'blocked', 'completed')),
  assigned_subcontractor_id uuid references subcontractors(id) on delete set null,
  notes text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists daily_updates (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references units(id) on delete cascade,
  unit_stage_id uuid references unit_stages(id) on delete set null,
  author_id uuid not null,
  notes text not null,
  created_at timestamptz not null default now()
);

create table if not exists attachments (
  id uuid primary key default uuid_generate_v4(),
  daily_update_id uuid not null references daily_updates(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_type text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table buildings enable row level security;
alter table units enable row level security;
alter table stage_templates enable row level security;
alter table unit_stages enable row level security;
alter table subcontractors enable row level security;
alter table daily_updates enable row level security;
alter table attachments enable row level security;

create policy "auth_all" on buildings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all" on units for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all" on stage_templates for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all" on unit_stages for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all" on subcontractors for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all" on daily_updates for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_all" on attachments for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists idx_units_building_id on units(building_id);
create index if not exists idx_unit_stages_unit_id on unit_stages(unit_id);
create index if not exists idx_unit_stages_template on unit_stages(stage_template_id);
create index if not exists idx_unit_stages_sub on unit_stages(assigned_subcontractor_id);
create index if not exists idx_daily_updates_unit on daily_updates(unit_id);
create index if not exists idx_daily_updates_stage on daily_updates(unit_stage_id);
create index if not exists idx_attachments_update on attachments(daily_update_id);
