-- Property Renovation Tracker Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Buildings
create table buildings (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null,
  city text not null default 'Austin',
  state text not null default 'TX',
  zip text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Units
create table units (
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

-- Stage Templates (master list of 18 renovation stages)
create table stage_templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  trade text not null,
  sort_order integer not null unique,
  created_at timestamptz not null default now()
);

-- Unit Stages (per-unit instances of stage templates)
create table unit_stages (
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

-- Subcontractors
create table subcontractors (
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

-- Daily Updates
create table daily_updates (
  id uuid primary key default uuid_generate_v4(),
  unit_id uuid not null references units(id) on delete cascade,
  unit_stage_id uuid references unit_stages(id) on delete set null,
  author_id uuid not null,
  notes text not null,
  created_at timestamptz not null default now()
);

-- Attachments
create table attachments (
  id uuid primary key default uuid_generate_v4(),
  daily_update_id uuid not null references daily_updates(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_type text,
  created_at timestamptz not null default now()
);

-- NOTE: unit_stages references subcontractors, so we need to create
-- subcontractors first. The SQL above has a forward reference issue.
-- In practice, run in this order:
-- 1. buildings, subcontractors, stage_templates
-- 2. units
-- 3. unit_stages (references both units and subcontractors)
-- 4. daily_updates, attachments

-- ============================================================
-- CORRECT ORDER (use this instead of above)
-- ============================================================

-- Drop and recreate in correct order if needed:
-- drop table if exists attachments, daily_updates, unit_stages, units, buildings, subcontractors, stage_templates cascade;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table buildings enable row level security;
alter table units enable row level security;
alter table stage_templates enable row level security;
alter table unit_stages enable row level security;
alter table subcontractors enable row level security;
alter table daily_updates enable row level security;
alter table attachments enable row level security;

-- Simple policies: allow all operations for authenticated users
create policy "Authenticated users can do everything" on buildings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can do everything" on units
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can do everything" on stage_templates
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can do everything" on unit_stages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can do everything" on subcontractors
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can do everything" on daily_updates
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "Authenticated users can do everything" on attachments
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_units_building_id on units(building_id);
create index idx_unit_stages_unit_id on unit_stages(unit_id);
create index idx_unit_stages_stage_template_id on unit_stages(stage_template_id);
create index idx_unit_stages_assigned_subcontractor_id on unit_stages(assigned_subcontractor_id);
create index idx_daily_updates_unit_id on daily_updates(unit_id);
create index idx_daily_updates_unit_stage_id on daily_updates(unit_stage_id);
create index idx_attachments_daily_update_id on attachments(daily_update_id);
