-- Migration 025: CRPD Support Assessments, Independence Budget, Mood Bracelet Telemetry, Catering Suppliers
-- Covers requirements from: Chapter 2 (CRPD Empowerment), Chapter 3 (IoT Mood), Chapter 6 (Suppliers)

-- ============================================================
-- 1. crpd_support_assessments (Chapter 2 — Co-Design & Empowerment)
-- ============================================================
CREATE TABLE IF NOT EXISTS crpd_support_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  assessment_date date NOT NULL DEFAULT CURRENT_DATE,
  assessor_name text NOT NULL,
  environmental_barriers jsonb NOT NULL DEFAULT '[]',
  attitudinal_barriers jsonb NOT NULL DEFAULT '[]',
  institutional_barriers jsonb NOT NULL DEFAULT '[]',
  personal_aspirations text,
  required_support_services text,
  is_plan_codesigned boolean NOT NULL DEFAULT false,
  participating_stakeholders text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE crpd_support_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY crpd_support_assessments_select ON crpd_support_assessments FOR SELECT USING (true);
CREATE POLICY crpd_support_assessments_insert ON crpd_support_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY crpd_support_assessments_update ON crpd_support_assessments FOR UPDATE USING (true);

CREATE INDEX idx_crpd_support_assessments_beneficiary ON crpd_support_assessments(beneficiary_id);
CREATE INDEX idx_crpd_support_assessments_date ON crpd_support_assessments(assessment_date);

GRANT SELECT, INSERT, UPDATE ON crpd_support_assessments TO anon, authenticated;

-- ============================================================
-- 2. independence_budget_analysis (Chapter 2 — Budget Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS independence_budget_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  fiscal_year text NOT NULL,
  analysis_date date NOT NULL DEFAULT CURRENT_DATE,
  dependency_spending numeric NOT NULL DEFAULT 0,
  independence_spending numeric NOT NULL DEFAULT 0,
  training_budget numeric NOT NULL DEFAULT 0,
  community_integration_budget numeric NOT NULL DEFAULT 0,
  total_budget numeric GENERATED ALWAYS AS (
    dependency_spending + independence_spending + training_budget + community_integration_budget
  ) STORED,
  independence_ratio numeric GENERATED ALWAYS AS (
    CASE WHEN (dependency_spending + independence_spending + training_budget + community_integration_budget) > 0
         THEN (independence_spending + training_budget + community_integration_budget)::numeric
              / (dependency_spending + independence_spending + training_budget + community_integration_budget)::numeric
         ELSE 0 END
  ) STORED,
  recommendations text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE independence_budget_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY independence_budget_analysis_select ON independence_budget_analysis FOR SELECT USING (true);
CREATE POLICY independence_budget_analysis_insert ON independence_budget_analysis FOR INSERT WITH CHECK (true);
CREATE POLICY independence_budget_analysis_update ON independence_budget_analysis FOR UPDATE USING (true);

CREATE INDEX idx_independence_budget_beneficiary ON independence_budget_analysis(beneficiary_id);
CREATE INDEX idx_independence_budget_year ON independence_budget_analysis(fiscal_year);

GRANT SELECT, INSERT, UPDATE ON independence_budget_analysis TO anon, authenticated;

-- ============================================================
-- 3. mood_bracelet_telemetry (Chapter 3 — IoT Mood Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS mood_bracelet_telemetry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
  recorded_timestamp timestamptz NOT NULL DEFAULT now(),
  voluntary_button_press text CHECK (voluntary_button_press IN ('green', 'yellow', 'red', 'blue', 'none')),
  heart_rate_bpm smallint CHECK (heart_rate_bpm BETWEEN 30 AND 250),
  skin_conductance decimal(8, 4),
  calculated_stress_anomaly text CHECK (calculated_stress_anomaly IN ('normal', 'elevated', 'critical_warning')),
  emotional_valence text CHECK (emotional_valence IN ('positive', 'neutral', 'negative')),
  current_activity_context text,
  location_context text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT unique_telemetry_reading UNIQUE (beneficiary_id, recorded_timestamp)
);

ALTER TABLE mood_bracelet_telemetry ENABLE ROW LEVEL SECURITY;
CREATE POLICY mood_bracelet_telemetry_select ON mood_bracelet_telemetry FOR SELECT USING (true);
CREATE POLICY mood_bracelet_telemetry_insert ON mood_bracelet_telemetry FOR INSERT WITH CHECK (true);

CREATE INDEX idx_mood_telemetry_beneficiary_time ON mood_bracelet_telemetry(beneficiary_id, recorded_timestamp DESC);

GRANT SELECT, INSERT ON mood_bracelet_telemetry TO anon, authenticated;

-- ============================================================
-- 4. catering_suppliers (Chapter 6 — Supplier Resilience)
-- ============================================================
CREATE TABLE IF NOT EXISTS catering_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_name text NOT NULL,
  contract_number text,
  service_type text,
  contract_start date,
  contract_end date,
  is_emergency_backup boolean NOT NULL DEFAULT false,
  mobilization_time_hours int,
  capacity_limit int,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'terminated')),
  contact_name text,
  contact_phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE catering_suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY catering_suppliers_select ON catering_suppliers FOR SELECT USING (true);
CREATE POLICY catering_suppliers_insert ON catering_suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY catering_suppliers_update ON catering_suppliers FOR UPDATE USING (true);

CREATE INDEX idx_catering_suppliers_status ON catering_suppliers(status);

GRANT SELECT, INSERT, UPDATE ON catering_suppliers TO anon, authenticated;
