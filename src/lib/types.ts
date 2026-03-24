export interface Building {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: string;
  building_id: string;
  unit_number: string;
  floor: number | null;
  bedrooms: number;
  bathrooms: number;
  sqft: number | null;
  status: "not_started" | "in_progress" | "blocked" | "completed";
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface StageTemplate {
  id: string;
  name: string;
  trade: string;
  sort_order: number;
  created_at: string;
}

export interface UnitStage {
  id: string;
  unit_id: string;
  stage_template_id: string;
  status: "not_started" | "in_progress" | "blocked" | "completed";
  assigned_subcontractor_id: string | null;
  notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subcontractor {
  id: string;
  name: string;
  company: string | null;
  trade: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyUpdate {
  id: string;
  unit_id: string;
  unit_stage_id: string | null;
  author_id: string;
  notes: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  daily_update_id: string;
  file_url: string;
  file_name: string;
  file_type: string | null;
  created_at: string;
}

// Extended types with joins
export interface UnitWithBuilding extends Unit {
  buildings: Building;
}

export interface UnitStageWithDetails extends UnitStage {
  stage_templates: StageTemplate;
  subcontractors: Subcontractor | null;
}

export interface DailyUpdateWithDetails extends DailyUpdate {
  units: Unit & { buildings: Building };
  unit_stages: (UnitStage & { stage_templates: StageTemplate }) | null;
}

export interface BuildingWithUnits extends Building {
  units: Unit[];
}

export interface UnitStageForQueue extends UnitStage {
  stage_templates: StageTemplate;
  subcontractors: Subcontractor | null;
  units: Unit & { buildings: Building };
}
