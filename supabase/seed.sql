-- Seed Data for Property Renovation Tracker
-- Run this AFTER the schema has been created

-- ============================================================
-- Stage Templates (18 ordered renovation stages)
-- ============================================================
INSERT INTO stage_templates (name, trade, sort_order) VALUES
  ('Demolition', 'General', 1),
  ('Rough Plumbing', 'Plumbing', 2),
  ('Electrical', 'Electrical', 3),
  ('HVAC', 'HVAC', 4),
  ('Insulation', 'General', 5),
  ('Drywall', 'General', 6),
  ('Painting', 'Painting', 7),
  ('Tile', 'Tile/Flooring', 8),
  ('Flooring', 'Tile/Flooring', 9),
  ('Cabinets', 'Carpentry', 10),
  ('Countertops', 'Carpentry', 11),
  ('Appliances', 'General', 12),
  ('Plumbing Fixtures', 'Plumbing', 13),
  ('Electrical Fixtures', 'Electrical', 14),
  ('Baseboards & Trim', 'Carpentry', 15),
  ('Final Punch', 'General', 16),
  ('Cleaning', 'General', 17),
  ('Final Inspection', 'General', 18);

-- ============================================================
-- Subcontractors (6, one per major trade)
-- ============================================================
INSERT INTO subcontractors (name, company, trade, phone, email, is_active) VALUES
  ('Mike Rodriguez', 'Rodriguez Plumbing Co.', 'Plumbing', '(512) 555-0101', 'mike@rodriguezplumbing.com', true),
  ('Sarah Chen', 'Spark Electric LLC', 'Electrical', '(512) 555-0102', 'sarah@sparkelectric.com', true),
  ('James Wilson', 'Wilson HVAC Services', 'HVAC', '(512) 555-0103', 'james@wilsonhvac.com', true),
  ('Maria Garcia', 'Garcia Painting & Drywall', 'Painting', '(512) 555-0104', 'maria@garciapaint.com', true),
  ('Tom Baker', 'Baker Tile & Floor', 'Tile/Flooring', '(512) 555-0105', 'tom@bakertile.com', true),
  ('Dave Thompson', 'Thompson Carpentry', 'Carpentry', '(512) 555-0106', 'dave@thompsoncarpentry.com', true);

-- ============================================================
-- Buildings (6 in Austin, TX)
-- ============================================================
INSERT INTO buildings (id, name, address, city, state, zip) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'The Riverside', '1200 S Congress Ave', 'Austin', 'TX', '78704'),
  ('b0000001-0000-0000-0000-000000000002', 'Oak Valley Apartments', '4500 N Lamar Blvd', 'Austin', 'TX', '78756'),
  ('b0000001-0000-0000-0000-000000000003', 'Mueller Heights', '1900 Aldrich St', 'Austin', 'TX', '78723'),
  ('b0000001-0000-0000-0000-000000000004', 'South Lamar Lofts', '3100 S Lamar Blvd', 'Austin', 'TX', '78704'),
  ('b0000001-0000-0000-0000-000000000005', 'Domain Edge', '11200 Domain Dr', 'Austin', 'TX', '78758'),
  ('b0000001-0000-0000-0000-000000000006', 'East Side Flats', '2800 E 12th St', 'Austin', 'TX', '78702');

-- ============================================================
-- Units (3-6 per building, various statuses)
-- ============================================================

-- The Riverside (5 units)
INSERT INTO units (id, building_id, unit_number, floor, bedrooms, bathrooms, sqft, status, target_date) VALUES
  ('u0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', '101', 1, 2, 1, 850, 'completed', '2026-02-15'),
  ('u0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', '102', 1, 1, 1, 650, 'in_progress', '2026-04-01'),
  ('u0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', '201', 2, 2, 2, 950, 'in_progress', '2026-04-15'),
  ('u0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', '202', 2, 3, 2, 1100, 'not_started', '2026-05-01'),
  ('u0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000001', '301', 3, 2, 2, 950, 'blocked', '2026-04-30');

-- Oak Valley Apartments (4 units)
INSERT INTO units (id, building_id, unit_number, floor, bedrooms, bathrooms, sqft, status, target_date) VALUES
  ('u0000001-0000-0000-0000-000000000006', 'b0000001-0000-0000-0000-000000000002', 'A1', 1, 1, 1, 600, 'completed', '2026-01-30'),
  ('u0000001-0000-0000-0000-000000000007', 'b0000001-0000-0000-0000-000000000002', 'A2', 1, 2, 1, 800, 'completed', '2026-02-15'),
  ('u0000001-0000-0000-0000-000000000008', 'b0000001-0000-0000-0000-000000000002', 'B1', 2, 2, 2, 900, 'in_progress', '2026-04-10'),
  ('u0000001-0000-0000-0000-000000000009', 'b0000001-0000-0000-0000-000000000002', 'B2', 2, 1, 1, 600, 'not_started', '2026-05-15');

-- Mueller Heights (6 units)
INSERT INTO units (id, building_id, unit_number, floor, bedrooms, bathrooms, sqft, status, target_date) VALUES
  ('u0000001-0000-0000-0000-000000000010', 'b0000001-0000-0000-0000-000000000003', '100', 1, 1, 1, 550, 'in_progress', '2026-04-01'),
  ('u0000001-0000-0000-0000-000000000011', 'b0000001-0000-0000-0000-000000000003', '101', 1, 2, 1, 750, 'in_progress', '2026-04-15'),
  ('u0000001-0000-0000-0000-000000000012', 'b0000001-0000-0000-0000-000000000003', '200', 2, 2, 2, 900, 'blocked', '2026-04-20'),
  ('u0000001-0000-0000-0000-000000000013', 'b0000001-0000-0000-0000-000000000003', '201', 2, 3, 2, 1050, 'not_started', '2026-05-30'),
  ('u0000001-0000-0000-0000-000000000014', 'b0000001-0000-0000-0000-000000000003', '300', 3, 1, 1, 550, 'not_started', '2026-06-01'),
  ('u0000001-0000-0000-0000-000000000015', 'b0000001-0000-0000-0000-000000000003', '301', 3, 2, 1, 750, 'not_started', '2026-06-15');

-- South Lamar Lofts (3 units)
INSERT INTO units (id, building_id, unit_number, floor, bedrooms, bathrooms, sqft, status, target_date) VALUES
  ('u0000001-0000-0000-0000-000000000016', 'b0000001-0000-0000-0000-000000000004', '1A', 1, 2, 2, 1000, 'completed', '2026-02-01'),
  ('u0000001-0000-0000-0000-000000000017', 'b0000001-0000-0000-0000-000000000004', '2A', 2, 2, 2, 1000, 'in_progress', '2026-04-01'),
  ('u0000001-0000-0000-0000-000000000018', 'b0000001-0000-0000-0000-000000000004', '3A', 3, 3, 2, 1200, 'not_started', '2026-05-15');

-- Domain Edge (4 units)
INSERT INTO units (id, building_id, unit_number, floor, bedrooms, bathrooms, sqft, status, target_date) VALUES
  ('u0000001-0000-0000-0000-000000000019', 'b0000001-0000-0000-0000-000000000005', '110', 1, 1, 1, 650, 'in_progress', '2026-03-30'),
  ('u0000001-0000-0000-0000-000000000020', 'b0000001-0000-0000-0000-000000000005', '210', 2, 2, 1, 800, 'blocked', '2026-04-15'),
  ('u0000001-0000-0000-0000-000000000021', 'b0000001-0000-0000-0000-000000000005', '310', 3, 2, 2, 950, 'not_started', '2026-05-01'),
  ('u0000001-0000-0000-0000-000000000022', 'b0000001-0000-0000-0000-000000000005', '410', 4, 3, 2, 1100, 'not_started', '2026-06-01');

-- East Side Flats (4 units)
INSERT INTO units (id, building_id, unit_number, floor, bedrooms, bathrooms, sqft, status, target_date) VALUES
  ('u0000001-0000-0000-0000-000000000023', 'b0000001-0000-0000-0000-000000000006', '1', 1, 1, 1, 500, 'completed', '2026-01-15'),
  ('u0000001-0000-0000-0000-000000000024', 'b0000001-0000-0000-0000-000000000006', '2', 1, 2, 1, 700, 'in_progress', '2026-03-30'),
  ('u0000001-0000-0000-0000-000000000025', 'b0000001-0000-0000-0000-000000000006', '3', 2, 2, 2, 850, 'in_progress', '2026-04-15'),
  ('u0000001-0000-0000-0000-000000000026', 'b0000001-0000-0000-0000-000000000006', '4', 2, 1, 1, 500, 'not_started', '2026-05-30');

-- ============================================================
-- Unit Stages (create stages for each unit using stage templates)
-- We'll use a DO block to generate these
-- ============================================================
DO $$
DECLARE
  v_unit RECORD;
  v_template RECORD;
  v_sub_plumbing uuid;
  v_sub_electrical uuid;
  v_sub_hvac uuid;
  v_sub_painting uuid;
  v_sub_flooring uuid;
  v_sub_carpentry uuid;
  v_stage_count int;
  v_completed_stages int;
  v_status text;
BEGIN
  -- Get subcontractor IDs
  SELECT id INTO v_sub_plumbing FROM subcontractors WHERE trade = 'Plumbing' LIMIT 1;
  SELECT id INTO v_sub_electrical FROM subcontractors WHERE trade = 'Electrical' LIMIT 1;
  SELECT id INTO v_sub_hvac FROM subcontractors WHERE trade = 'HVAC' LIMIT 1;
  SELECT id INTO v_sub_painting FROM subcontractors WHERE trade = 'Painting' LIMIT 1;
  SELECT id INTO v_sub_flooring FROM subcontractors WHERE trade = 'Tile/Flooring' LIMIT 1;
  SELECT id INTO v_sub_carpentry FROM subcontractors WHERE trade = 'Carpentry' LIMIT 1;

  FOR v_unit IN SELECT * FROM units LOOP
    -- Determine how many stages to complete based on unit status
    IF v_unit.status = 'completed' THEN
      v_completed_stages := 18;
    ELSIF v_unit.status = 'in_progress' THEN
      -- Random progress: between 3 and 12 stages completed
      v_completed_stages := 3 + floor(random() * 10)::int;
    ELSIF v_unit.status = 'blocked' THEN
      -- Some progress but blocked on current stage
      v_completed_stages := 2 + floor(random() * 6)::int;
    ELSE
      v_completed_stages := 0;
    END IF;

    v_stage_count := 0;
    FOR v_template IN SELECT * FROM stage_templates ORDER BY sort_order LOOP
      v_stage_count := v_stage_count + 1;

      -- Determine stage status
      IF v_stage_count <= v_completed_stages THEN
        v_status := 'completed';
      ELSIF v_stage_count = v_completed_stages + 1 AND v_unit.status = 'blocked' THEN
        v_status := 'blocked';
      ELSIF v_stage_count = v_completed_stages + 1 AND v_unit.status = 'in_progress' THEN
        v_status := 'in_progress';
      ELSE
        v_status := 'not_started';
      END IF;

      INSERT INTO unit_stages (unit_id, stage_template_id, status, assigned_subcontractor_id, started_at, completed_at)
      VALUES (
        v_unit.id,
        v_template.id,
        v_status,
        CASE v_template.trade
          WHEN 'Plumbing' THEN v_sub_plumbing
          WHEN 'Electrical' THEN v_sub_electrical
          WHEN 'HVAC' THEN v_sub_hvac
          WHEN 'Painting' THEN v_sub_painting
          WHEN 'Tile/Flooring' THEN v_sub_flooring
          WHEN 'Carpentry' THEN v_sub_carpentry
          ELSE NULL
        END,
        CASE WHEN v_status IN ('in_progress', 'completed', 'blocked') THEN now() - interval '30 days' + (v_stage_count * interval '2 days') ELSE NULL END,
        CASE WHEN v_status = 'completed' THEN now() - interval '25 days' + (v_stage_count * interval '2 days') ELSE NULL END
      );
    END LOOP;
  END LOOP;
END $$;

-- ============================================================
-- Daily Updates (sample updates)
-- Using a placeholder author_id — replace with a real user ID after creating an account
-- ============================================================
INSERT INTO daily_updates (unit_id, notes, author_id, created_at) VALUES
  ('u0000001-0000-0000-0000-000000000002', 'Demolition completed ahead of schedule. Ready for rough plumbing.', '00000000-0000-0000-0000-000000000000', now() - interval '14 days'),
  ('u0000001-0000-0000-0000-000000000002', 'Rough plumbing started. Mike''s crew on site.', '00000000-0000-0000-0000-000000000000', now() - interval '12 days'),
  ('u0000001-0000-0000-0000-000000000003', 'Electrical rough-in about 60% done. Should finish by tomorrow.', '00000000-0000-0000-0000-000000000000', now() - interval '10 days'),
  ('u0000001-0000-0000-0000-000000000005', 'Blocked on HVAC — waiting for replacement condenser unit. ETA 5 days.', '00000000-0000-0000-0000-000000000000', now() - interval '7 days'),
  ('u0000001-0000-0000-0000-000000000008', 'Drywall going up. Looking good so far.', '00000000-0000-0000-0000-000000000000', now() - interval '5 days'),
  ('u0000001-0000-0000-0000-000000000010', 'Painting crew started on unit today.', '00000000-0000-0000-0000-000000000000', now() - interval '4 days'),
  ('u0000001-0000-0000-0000-000000000012', 'Blocked: discovered asbestos tile under old flooring. Abatement crew called.', '00000000-0000-0000-0000-000000000000', now() - interval '3 days'),
  ('u0000001-0000-0000-0000-000000000017', 'Cabinets installed. Countertop templating scheduled for Thursday.', '00000000-0000-0000-0000-000000000000', now() - interval '2 days'),
  ('u0000001-0000-0000-0000-000000000019', 'Tile work in bathroom complete. Moving to kitchen backsplash.', '00000000-0000-0000-0000-000000000000', now() - interval '1 day'),
  ('u0000001-0000-0000-0000-000000000024', 'HVAC system passed inspection. Moving to insulation.', '00000000-0000-0000-0000-000000000000', now() - interval '6 hours'),
  ('u0000001-0000-0000-0000-000000000020', 'Blocked on electrical: panel upgrade needed. Waiting on permit approval.', '00000000-0000-0000-0000-000000000000', now() - interval '8 days'),
  ('u0000001-0000-0000-0000-000000000025', 'Flooring material arrived. Installation begins Monday.', '00000000-0000-0000-0000-000000000000', now() - interval '2 days');
