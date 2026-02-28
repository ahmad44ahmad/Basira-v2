-- Migration: Chapters 2, 3, 4, 6 + Compass Artifact features
-- ICF Assessments, Individual Life Plans, Rights Realization Log,
-- Visual Survey Responses, Emergency PEEP Plans, Equipment Readiness,
-- Staff Wellbeing Scores, Stress Alerts, Shift Handover I-PASS fields

-- ===== 1. ICF Assessments (Chapter 2 / Compass) =====

CREATE TABLE IF NOT EXISTS icf_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  assessment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  assessor_id TEXT NOT NULL,
  component TEXT NOT NULL CHECK (component IN ('b','s','d','e')),
  icf_code TEXT NOT NULL,
  qualifier SMALLINT CHECK (qualifier BETWEEN 0 AND 4),
  capacity_qualifier SMALLINT CHECK (capacity_qualifier BETWEEN 0 AND 4),
  performance_qualifier SMALLINT CHECK (performance_qualifier BETWEEN 0 AND 4),
  qualifier_type TEXT CHECK (qualifier_type IN ('facilitator','barrier','neutral')),
  qualifier_magnitude SMALLINT CHECK (qualifier_magnitude BETWEEN 0 AND 4),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE icf_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_icf_assessments" ON icf_assessments FOR SELECT USING (true);
CREATE POLICY "insert_icf_assessments" ON icf_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "update_icf_assessments" ON icf_assessments FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON icf_assessments TO anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_icf_assessments_beneficiary ON icf_assessments(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_icf_assessments_code ON icf_assessments(icf_code);

-- ===== 2. Individual Life Plans (Chapter 2 / Compass) =====

CREATE TABLE IF NOT EXISTS individual_life_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  plan_period_start DATE NOT NULL,
  plan_period_end DATE NOT NULL,
  co_designed_with TEXT[] NOT NULL DEFAULT '{}',
  beneficiary_participated BOOLEAN DEFAULT true,
  guardian_participated BOOLEAN DEFAULT false,
  emotional_wellbeing_goals JSONB DEFAULT '[]'::jsonb,
  interpersonal_relations_goals JSONB DEFAULT '[]'::jsonb,
  material_wellbeing_goals JSONB DEFAULT '[]'::jsonb,
  personal_development_goals JSONB DEFAULT '[]'::jsonb,
  physical_wellbeing_goals JSONB DEFAULT '[]'::jsonb,
  self_determination_goals JSONB DEFAULT '[]'::jsonb,
  social_inclusion_goals JSONB DEFAULT '[]'::jsonb,
  rights_goals JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','cancelled','draft')),
  review_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE individual_life_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_individual_life_plans" ON individual_life_plans FOR SELECT USING (true);
CREATE POLICY "insert_individual_life_plans" ON individual_life_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "update_individual_life_plans" ON individual_life_plans FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON individual_life_plans TO anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_individual_life_plans_beneficiary ON individual_life_plans(beneficiary_id);

-- ===== 3. Rights Realization Log (Chapter 2 / Compass - CRPD) =====

CREATE TABLE IF NOT EXISTS rights_realization_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  crpd_article TEXT NOT NULL,
  right_domain TEXT NOT NULL,
  status TEXT CHECK (status IN ('realized','partially_realized','barrier_identified','not_applicable')),
  barrier_description TEXT,
  action_required TEXT,
  logged_by TEXT,
  logged_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE rights_realization_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_rights_realization_log" ON rights_realization_log FOR SELECT USING (true);
CREATE POLICY "insert_rights_realization_log" ON rights_realization_log FOR INSERT WITH CHECK (true);
CREATE POLICY "update_rights_realization_log" ON rights_realization_log FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON rights_realization_log TO anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_rights_realization_log_beneficiary ON rights_realization_log(beneficiary_id);

-- ===== 4. Visual Survey Responses (Chapter 3 - Silent Echo) =====

CREATE TABLE IF NOT EXISTS visual_survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  survey_date DATE NOT NULL DEFAULT CURRENT_DATE,
  food_rating SMALLINT CHECK (food_rating BETWEEN 1 AND 3),
  comfort_rating SMALLINT CHECK (comfort_rating BETWEEN 1 AND 3),
  staff_rating SMALLINT CHECK (staff_rating BETWEEN 1 AND 3),
  activities_rating SMALLINT CHECK (activities_rating BETWEEN 1 AND 3),
  overall_mood TEXT CHECK (overall_mood IN ('happy','neutral','sad')),
  notes TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE visual_survey_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_visual_survey_responses" ON visual_survey_responses FOR SELECT USING (true);
CREATE POLICY "insert_visual_survey_responses" ON visual_survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "update_visual_survey_responses" ON visual_survey_responses FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON visual_survey_responses TO anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_visual_survey_responses_beneficiary ON visual_survey_responses(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_visual_survey_responses_date ON visual_survey_responses(survey_date);

-- ===== 5. Emergency PEEP Plans (Chapter 4) =====

CREATE TABLE IF NOT EXISTS emergency_peep_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  evacuation_mobility_level TEXT CHECK (evacuation_mobility_level IN ('independent','assisted','wheelchair','stretcher','defend_in_place')),
  alarm_comprehension TEXT CHECK (alarm_comprehension IN ('full','partial','none')),
  evacuation_method TEXT CHECK (evacuation_method IN ('self_evacuate','assisted_walk','evac_chair','stretcher_carry','defend_in_place')),
  primary_escort TEXT,
  secondary_escort TEXT,
  primary_route TEXT,
  alternative_route TEXT,
  special_equipment TEXT[] DEFAULT '{}',
  behavioral_considerations TEXT,
  communication_method TEXT,
  medical_equipment_needed TEXT[] DEFAULT '{}',
  last_drill_date DATE,
  last_review_date DATE,
  next_review_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','needs_review','expired','draft')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE emergency_peep_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_emergency_peep_plans" ON emergency_peep_plans FOR SELECT USING (true);
CREATE POLICY "insert_emergency_peep_plans" ON emergency_peep_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "update_emergency_peep_plans" ON emergency_peep_plans FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON emergency_peep_plans TO anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_emergency_peep_plans_beneficiary ON emergency_peep_plans(beneficiary_id);

-- ===== 6. Emergency Equipment Readiness (Chapter 4) =====

CREATE TABLE IF NOT EXISTS emergency_equipment_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_name TEXT NOT NULL,
  equipment_type TEXT CHECK (equipment_type IN ('evac_chair','fire_extinguisher','first_aid','aed','alarm_system','emergency_lighting','fire_blanket','other')),
  location TEXT NOT NULL,
  section TEXT,
  last_inspection_date DATE,
  next_inspection_date DATE,
  status TEXT DEFAULT 'operational' CHECK (status IN ('operational','needs_maintenance','out_of_service','expired')),
  inspector_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE emergency_equipment_readiness ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_emergency_equipment_readiness" ON emergency_equipment_readiness FOR SELECT USING (true);
CREATE POLICY "insert_emergency_equipment_readiness" ON emergency_equipment_readiness FOR INSERT WITH CHECK (true);
CREATE POLICY "update_emergency_equipment_readiness" ON emergency_equipment_readiness FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON emergency_equipment_readiness TO anon, authenticated;

-- ===== 7. Staff Wellbeing Scores (Chapter 6 / Compass) =====

CREATE TABLE IF NOT EXISTS staff_wellbeing_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mbi_ee_score DECIMAL(5,2),
  mbi_dp_score DECIMAL(5,2),
  overtime_ratio DECIMAL(5,2),
  consecutive_shifts INT DEFAULT 0,
  sick_leave_count INT DEFAULT 0,
  proqol_burnout_score DECIMAL(5,2),
  case_severity_exposure DECIMAL(5,2),
  composite_score DECIMAL(5,2),
  risk_level TEXT CHECK (risk_level IN ('green','yellow','orange','red')),
  intervention_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE staff_wellbeing_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_staff_wellbeing_scores" ON staff_wellbeing_scores FOR SELECT USING (true);
CREATE POLICY "insert_staff_wellbeing_scores" ON staff_wellbeing_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "update_staff_wellbeing_scores" ON staff_wellbeing_scores FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON staff_wellbeing_scores TO anon, authenticated;

-- ===== 8. Stress Alerts (Compass - IoT) =====

CREATE TABLE IF NOT EXISTS stress_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('eda_spike','heart_rate','combined_stress','behavioral','manual')),
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  eda_value DECIMAL(8,4),
  hr_value DECIMAL(6,2),
  trigger_description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','acknowledged','resolved')),
  acknowledged_by TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE stress_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_stress_alerts" ON stress_alerts FOR SELECT USING (true);
CREATE POLICY "insert_stress_alerts" ON stress_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "update_stress_alerts" ON stress_alerts FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON stress_alerts TO anon, authenticated;
CREATE INDEX IF NOT EXISTS idx_stress_alerts_beneficiary ON stress_alerts(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_stress_alerts_status ON stress_alerts(status);

-- ===== 9. ALTER shift_handover_reports — I-PASS fields (Chapter 6) =====

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shift_handover_reports' AND column_name='staff_fatigue_index') THEN
    ALTER TABLE shift_handover_reports ADD COLUMN staff_fatigue_index DECIMAL(5,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shift_handover_reports' AND column_name='assigned_high_acuity_cases') THEN
    ALTER TABLE shift_handover_reports ADD COLUMN assigned_high_acuity_cases INT DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shift_handover_reports' AND column_name='critical_information_flag') THEN
    ALTER TABLE shift_handover_reports ADD COLUMN critical_information_flag BOOLEAN DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shift_handover_reports' AND column_name='handover_compliance_score') THEN
    ALTER TABLE shift_handover_reports ADD COLUMN handover_compliance_score DECIMAL(5,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shift_handover_reports' AND column_name='illness_severity') THEN
    ALTER TABLE shift_handover_reports ADD COLUMN illness_severity TEXT CHECK (illness_severity IN ('stable','monitoring','immediate'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shift_handover_reports' AND column_name='action_list') THEN
    ALTER TABLE shift_handover_reports ADD COLUMN action_list JSONB DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shift_handover_reports' AND column_name='situation_awareness') THEN
    ALTER TABLE shift_handover_reports ADD COLUMN situation_awareness TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='shift_handover_reports' AND column_name='synthesis_confirmed') THEN
    ALTER TABLE shift_handover_reports ADD COLUMN synthesis_confirmed BOOLEAN DEFAULT false;
  END IF;
END $$;
