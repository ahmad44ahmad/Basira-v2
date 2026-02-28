-- 024_medical_forms.sql
-- Part 2: Medical forms digitization — 22 tables
-- Covers: DR-0001→DR-0013, RN-0001→RN-0020, PT, Speech, Psychology, Dental

-- ============================================================
-- A. MEDICAL FEATURE — 9 tables (Doctor + Therapy forms)
-- ============================================================

-- 1. medical_examinations — DR-0001 Physical Examination
CREATE TABLE IF NOT EXISTS medical_examinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  exam_date date NOT NULL DEFAULT CURRENT_DATE,
  exam_time time,
  chief_complaint text,
  physical_findings jsonb DEFAULT '{}',
  vital_signs jsonb DEFAULT '{}',
  diagnosis text,
  recommendations text,
  examiner_name text NOT NULL,
  signature_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE medical_examinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY medical_examinations_select ON medical_examinations FOR SELECT USING (true);
CREATE POLICY medical_examinations_insert ON medical_examinations FOR INSERT WITH CHECK (true);
CREATE POLICY medical_examinations_update ON medical_examinations FOR UPDATE USING (true);
CREATE INDEX idx_medical_examinations_beneficiary ON medical_examinations(beneficiary_id);
CREATE INDEX idx_medical_examinations_date ON medical_examinations(exam_date);
GRANT SELECT, INSERT, UPDATE ON medical_examinations TO anon, authenticated;

-- 2. prescriptions — DR-0005 + DR-0007 + RN-0012
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  prescription_date date NOT NULL DEFAULT CURRENT_DATE,
  prescription_type text NOT NULL DEFAULT 'medication' CHECK (prescription_type IN ('medication', 'standing_orders')),
  items jsonb NOT NULL DEFAULT '[]',
  prescriber_name text NOT NULL,
  pharmacy_notes text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY prescriptions_select ON prescriptions FOR SELECT USING (true);
CREATE POLICY prescriptions_insert ON prescriptions FOR INSERT WITH CHECK (true);
CREATE POLICY prescriptions_update ON prescriptions FOR UPDATE USING (true);
CREATE INDEX idx_prescriptions_beneficiary ON prescriptions(beneficiary_id);
CREATE INDEX idx_prescriptions_date ON prescriptions(prescription_date);
GRANT SELECT, INSERT, UPDATE ON prescriptions TO anon, authenticated;

-- 3. clinical_notes — DR-0003 + DR-0008
CREATE TABLE IF NOT EXISTS clinical_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  note_date date NOT NULL DEFAULT CURRENT_DATE,
  note_time time,
  note_type text NOT NULL DEFAULT 'progress' CHECK (note_type IN ('progress', 'consultation', 'follow_up', 'soap')),
  discipline text NOT NULL DEFAULT 'doctor' CHECK (discipline IN ('doctor', 'nursing', 'pt', 'ot', 'speech', 'psychology', 'social')),
  subjective text,
  objective text,
  assessment text,
  plan text,
  diagnosis text,
  recommendations text,
  author_name text NOT NULL,
  author_role text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY clinical_notes_select ON clinical_notes FOR SELECT USING (true);
CREATE POLICY clinical_notes_insert ON clinical_notes FOR INSERT WITH CHECK (true);
CREATE POLICY clinical_notes_update ON clinical_notes FOR UPDATE USING (true);
CREATE INDEX idx_clinical_notes_beneficiary ON clinical_notes(beneficiary_id);
CREATE INDEX idx_clinical_notes_date ON clinical_notes(note_date);
GRANT SELECT, INSERT, UPDATE ON clinical_notes TO anon, authenticated;

-- 4. lab_orders — DR-0006 + RN-0013
CREATE TABLE IF NOT EXISTS lab_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  order_date date NOT NULL DEFAULT CURRENT_DATE,
  tests jsonb NOT NULL DEFAULT '[]',
  ordered_by text NOT NULL,
  collected_by text,
  collection_date date,
  status text NOT NULL DEFAULT 'ordered' CHECK (status IN ('ordered', 'collected', 'resulted')),
  physician_notified boolean DEFAULT false,
  notified_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY lab_orders_select ON lab_orders FOR SELECT USING (true);
CREATE POLICY lab_orders_insert ON lab_orders FOR INSERT WITH CHECK (true);
CREATE POLICY lab_orders_update ON lab_orders FOR UPDATE USING (true);
CREATE INDEX idx_lab_orders_beneficiary ON lab_orders(beneficiary_id);
CREATE INDEX idx_lab_orders_date ON lab_orders(order_date);
GRANT SELECT, INSERT, UPDATE ON lab_orders TO anon, authenticated;

-- 5. multidisciplinary_rounds — DR-0002 + DR-0004
CREATE TABLE IF NOT EXISTS multidisciplinary_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  round_date date NOT NULL DEFAULT CURRENT_DATE,
  round_type text NOT NULL DEFAULT 'planning' CHECK (round_type IN ('planning', 'review', 'passport')),
  disciplines jsonb NOT NULL DEFAULT '[]',
  active_diagnoses text[],
  current_medications_summary text,
  goals text,
  action_items jsonb DEFAULT '[]',
  coordinator_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE multidisciplinary_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY multidisciplinary_rounds_select ON multidisciplinary_rounds FOR SELECT USING (true);
CREATE POLICY multidisciplinary_rounds_insert ON multidisciplinary_rounds FOR INSERT WITH CHECK (true);
CREATE POLICY multidisciplinary_rounds_update ON multidisciplinary_rounds FOR UPDATE USING (true);
CREATE INDEX idx_multidisciplinary_rounds_beneficiary ON multidisciplinary_rounds(beneficiary_id);
CREATE INDEX idx_multidisciplinary_rounds_date ON multidisciplinary_rounds(round_date);
GRANT SELECT, INSERT, UPDATE ON multidisciplinary_rounds TO anon, authenticated;

-- 6. disease_notifications — DR-0013
CREATE TABLE IF NOT EXISTS disease_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  notification_date date NOT NULL DEFAULT CURRENT_DATE,
  disease_name text NOT NULL,
  onset_date date,
  symptoms text[],
  contacts jsonb DEFAULT '[]',
  authority_notified boolean DEFAULT false,
  authority_reference text,
  precautions_taken text[],
  notifier_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE disease_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY disease_notifications_select ON disease_notifications FOR SELECT USING (true);
CREATE POLICY disease_notifications_insert ON disease_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY disease_notifications_update ON disease_notifications FOR UPDATE USING (true);
CREATE INDEX idx_disease_notifications_beneficiary ON disease_notifications(beneficiary_id);
CREATE INDEX idx_disease_notifications_date ON disease_notifications(notification_date);
GRANT SELECT, INSERT, UPDATE ON disease_notifications TO anon, authenticated;

-- 7. patient_transfers — DR-0011 + RN-0018 + RN-0019
CREATE TABLE IF NOT EXISTS patient_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  transfer_date date NOT NULL DEFAULT CURRENT_DATE,
  transfer_type text NOT NULL DEFAULT 'internal' CHECK (transfer_type IN ('internal', 'external')),
  from_location text NOT NULL,
  to_location text NOT NULL,
  reason text,
  clinical_summary text,
  diagnosis text,
  medications_at_transfer jsonb DEFAULT '[]',
  medical_record_attached boolean DEFAULT false,
  discharge_diagnosis text,
  follow_up_instructions text,
  sending_physician text NOT NULL,
  receiving_physician text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE patient_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY patient_transfers_select ON patient_transfers FOR SELECT USING (true);
CREATE POLICY patient_transfers_insert ON patient_transfers FOR INSERT WITH CHECK (true);
CREATE POLICY patient_transfers_update ON patient_transfers FOR UPDATE USING (true);
CREATE INDEX idx_patient_transfers_beneficiary ON patient_transfers(beneficiary_id);
CREATE INDEX idx_patient_transfers_date ON patient_transfers(transfer_date);
GRANT SELECT, INSERT, UPDATE ON patient_transfers TO anon, authenticated;

-- 8. therapy_sessions — PT + Speech + Psych sessions (unified)
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  session_time time,
  therapy_type text NOT NULL CHECK (therapy_type IN ('physical_therapy', 'speech_therapy', 'occupational_therapy', 'psychology')),
  session_type text NOT NULL DEFAULT 'follow_up' CHECK (session_type IN ('initial_evaluation', 'follow_up', 'discharge', 'soap_note')),
  assessment_data jsonb DEFAULT '{}',
  goals text[],
  recommendations text,
  duration_minutes integer,
  therapist_name text NOT NULL,
  therapist_role text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY therapy_sessions_select ON therapy_sessions FOR SELECT USING (true);
CREATE POLICY therapy_sessions_insert ON therapy_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY therapy_sessions_update ON therapy_sessions FOR UPDATE USING (true);
CREATE INDEX idx_therapy_sessions_beneficiary ON therapy_sessions(beneficiary_id);
CREATE INDEX idx_therapy_sessions_date ON therapy_sessions(session_date);
CREATE INDEX idx_therapy_sessions_type ON therapy_sessions(therapy_type);
GRANT SELECT, INSERT, UPDATE ON therapy_sessions TO anon, authenticated;

-- 9. psych_assessments — Psychology Forms #10-15 + Behavior
CREATE TABLE IF NOT EXISTS psych_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  assessment_date date NOT NULL DEFAULT CURRENT_DATE,
  assessment_type text NOT NULL CHECK (assessment_type IN ('comprehensive_exam', 'treatment_plan', 'behavior_observation', 'behavior_modification', 'progress_review')),
  mental_status_exam jsonb,
  cognitive_assessment jsonb,
  psychological_testing jsonb,
  problem_statement text,
  short_term_goals text[],
  long_term_goals text[],
  strategies text[],
  timeline text,
  behavior_type text,
  antecedent text,
  consequence text,
  frequency text,
  intervention_applied text,
  result text,
  clinical_observations text,
  behavioral_improvements text,
  goals_progress jsonb,
  current_challenges text,
  therapist_name text NOT NULL,
  review_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'reviewed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE psych_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY psych_assessments_select ON psych_assessments FOR SELECT USING (true);
CREATE POLICY psych_assessments_insert ON psych_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY psych_assessments_update ON psych_assessments FOR UPDATE USING (true);
CREATE INDEX idx_psych_assessments_beneficiary ON psych_assessments(beneficiary_id);
CREATE INDEX idx_psych_assessments_date ON psych_assessments(assessment_date);
CREATE INDEX idx_psych_assessments_type ON psych_assessments(assessment_type);
GRANT SELECT, INSERT, UPDATE ON psych_assessments TO anon, authenticated;

-- ============================================================
-- B. CARE FEATURE — 10 tables (Nursing forms)
-- ============================================================

-- 10. nursing_assessments — RN-0001 + RN-0009 + RN-0011
CREATE TABLE IF NOT EXISTS nursing_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  assessment_date date NOT NULL DEFAULT CURRENT_DATE,
  assessment_type text NOT NULL DEFAULT 'periodic' CHECK (assessment_type IN ('admission', 'periodic', 'daily_report')),
  chief_complaint text,
  medical_history text,
  physical_findings jsonb DEFAULT '{}',
  vital_signs jsonb DEFAULT '{}',
  functional_status text,
  daily_activities text,
  medication_summary text,
  clinical_changes text,
  shift_summary text,
  assessor_name text NOT NULL,
  assessor_role text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE nursing_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY nursing_assessments_select ON nursing_assessments FOR SELECT USING (true);
CREATE POLICY nursing_assessments_insert ON nursing_assessments FOR INSERT WITH CHECK (true);
CREATE POLICY nursing_assessments_update ON nursing_assessments FOR UPDATE USING (true);
CREATE INDEX idx_nursing_assessments_beneficiary ON nursing_assessments(beneficiary_id);
CREATE INDEX idx_nursing_assessments_date ON nursing_assessments(assessment_date);
GRANT SELECT, INSERT, UPDATE ON nursing_assessments TO anon, authenticated;

-- 11. vital_sign_charts — RN-0002 + RN-0003 + RN-0007
CREATE TABLE IF NOT EXISTS vital_sign_charts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  chart_date date NOT NULL DEFAULT CURRENT_DATE,
  chart_type text NOT NULL DEFAULT 'floor' CHECK (chart_type IN ('observation', 'floor', 'blood_sugar')),
  readings jsonb NOT NULL DEFAULT '[]',
  unit_number text,
  shift text,
  insulin_dose text,
  nurse_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE vital_sign_charts ENABLE ROW LEVEL SECURITY;
CREATE POLICY vital_sign_charts_select ON vital_sign_charts FOR SELECT USING (true);
CREATE POLICY vital_sign_charts_insert ON vital_sign_charts FOR INSERT WITH CHECK (true);
CREATE POLICY vital_sign_charts_update ON vital_sign_charts FOR UPDATE USING (true);
CREATE INDEX idx_vital_sign_charts_beneficiary ON vital_sign_charts(beneficiary_id);
CREATE INDEX idx_vital_sign_charts_date ON vital_sign_charts(chart_date);
GRANT SELECT, INSERT, UPDATE ON vital_sign_charts TO anon, authenticated;

-- 12. epilepsy_tracking — RN-0004 + RN-0005
CREATE TABLE IF NOT EXISTS epilepsy_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  record_type text NOT NULL DEFAULT 'episode' CHECK (record_type IN ('follow_up', 'episode')),
  seizure_date date,
  seizure_time time,
  seizure_type text,
  duration_minutes integer,
  medication_given text,
  complications text,
  medication_compliance boolean,
  seizure_frequency text,
  trigger_factors text[],
  nursing_actions text[],
  recorded_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE epilepsy_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY epilepsy_tracking_select ON epilepsy_tracking FOR SELECT USING (true);
CREATE POLICY epilepsy_tracking_insert ON epilepsy_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY epilepsy_tracking_update ON epilepsy_tracking FOR UPDATE USING (true);
CREATE INDEX idx_epilepsy_tracking_beneficiary ON epilepsy_tracking(beneficiary_id);
CREATE INDEX idx_epilepsy_tracking_date ON epilepsy_tracking(record_date);
GRANT SELECT, INSERT, UPDATE ON epilepsy_tracking TO anon, authenticated;

-- 13. menstrual_tracking — RN-0006
CREATE TABLE IF NOT EXISTS menstrual_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  cycle_start_date date NOT NULL,
  cycle_end_date date,
  duration_days integer,
  flow_amount text CHECK (flow_amount IN ('light', 'normal', 'heavy')),
  regularity text CHECK (regularity IN ('regular', 'irregular')),
  notes text,
  recorded_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE menstrual_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY menstrual_tracking_select ON menstrual_tracking FOR SELECT USING (true);
CREATE POLICY menstrual_tracking_insert ON menstrual_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY menstrual_tracking_update ON menstrual_tracking FOR UPDATE USING (true);
CREATE INDEX idx_menstrual_tracking_beneficiary ON menstrual_tracking(beneficiary_id);
CREATE INDEX idx_menstrual_tracking_date ON menstrual_tracking(cycle_start_date);
GRANT SELECT, INSERT, UPDATE ON menstrual_tracking TO anon, authenticated;

-- 14. weight_tracking — RN-0008
CREATE TABLE IF NOT EXISTS weight_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  measurement_date date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg numeric(5,2) NOT NULL,
  height_cm numeric(5,1),
  bmi numeric(4,1),
  notes text,
  recorded_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE weight_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY weight_tracking_select ON weight_tracking FOR SELECT USING (true);
CREATE POLICY weight_tracking_insert ON weight_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY weight_tracking_update ON weight_tracking FOR UPDATE USING (true);
CREATE INDEX idx_weight_tracking_beneficiary ON weight_tracking(beneficiary_id);
CREATE INDEX idx_weight_tracking_date ON weight_tracking(measurement_date);
GRANT SELECT, INSERT, UPDATE ON weight_tracking TO anon, authenticated;

-- 15. hygiene_followup — RN-0010
CREATE TABLE IF NOT EXISTS hygiene_followup (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  followup_date date NOT NULL DEFAULT CURRENT_DATE,
  items jsonb NOT NULL DEFAULT '{}',
  overall_independence text NOT NULL DEFAULT 'partial' CHECK (overall_independence IN ('self', 'partial', 'dependent')),
  notes text,
  recorded_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE hygiene_followup ENABLE ROW LEVEL SECURITY;
CREATE POLICY hygiene_followup_select ON hygiene_followup FOR SELECT USING (true);
CREATE POLICY hygiene_followup_insert ON hygiene_followup FOR INSERT WITH CHECK (true);
CREATE POLICY hygiene_followup_update ON hygiene_followup FOR UPDATE USING (true);
CREATE INDEX idx_hygiene_followup_beneficiary ON hygiene_followup(beneficiary_id);
CREATE INDEX idx_hygiene_followup_date ON hygiene_followup(followup_date);
GRANT SELECT, INSERT, UPDATE ON hygiene_followup TO anon, authenticated;

-- 16. nursing_notes — RN-0014
CREATE TABLE IF NOT EXISTS nursing_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  note_date date NOT NULL DEFAULT CURRENT_DATE,
  note_time time,
  shift text CHECK (shift IN ('morning', 'evening', 'night')),
  narrative_note text NOT NULL,
  patient_condition text,
  vital_signs_summary text,
  nurse_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE nursing_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY nursing_notes_select ON nursing_notes FOR SELECT USING (true);
CREATE POLICY nursing_notes_insert ON nursing_notes FOR INSERT WITH CHECK (true);
CREATE POLICY nursing_notes_update ON nursing_notes FOR UPDATE USING (true);
CREATE INDEX idx_nursing_notes_beneficiary ON nursing_notes(beneficiary_id);
CREATE INDEX idx_nursing_notes_date ON nursing_notes(note_date);
GRANT SELECT, INSERT, UPDATE ON nursing_notes TO anon, authenticated;

-- 17. appointments — RN-0015
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  appointment_date date NOT NULL,
  appointment_time time,
  department text,
  service_type text,
  reason text,
  confirmation_status text NOT NULL DEFAULT 'scheduled' CHECK (confirmation_status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  companion_needed boolean DEFAULT false,
  transport_needed boolean DEFAULT false,
  notes text,
  scheduled_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY appointments_select ON appointments FOR SELECT USING (true);
CREATE POLICY appointments_insert ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY appointments_update ON appointments FOR UPDATE USING (true);
CREATE INDEX idx_appointments_beneficiary ON appointments(beneficiary_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
GRANT SELECT, INSERT, UPDATE ON appointments TO anon, authenticated;

-- 18. isolation_records — RN-0016 + PC-01/02/03
CREATE TABLE IF NOT EXISTS isolation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  isolation_type text NOT NULL CHECK (isolation_type IN ('infection_control', 'psychiatric')),
  start_date date NOT NULL,
  start_time time,
  end_date date,
  end_time time,
  reason text NOT NULL,
  precautions text[],
  authorization_physician text,
  medical_justification text,
  observations jsonb DEFAULT '[]',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'terminated')),
  termination_reason text,
  duration_hours numeric(6,1),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE isolation_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY isolation_records_select ON isolation_records FOR SELECT USING (true);
CREATE POLICY isolation_records_insert ON isolation_records FOR INSERT WITH CHECK (true);
CREATE POLICY isolation_records_update ON isolation_records FOR UPDATE USING (true);
CREATE INDEX idx_isolation_records_beneficiary ON isolation_records(beneficiary_id);
CREATE INDEX idx_isolation_records_start ON isolation_records(start_date);
GRANT SELECT, INSERT, UPDATE ON isolation_records TO anon, authenticated;

-- 19. ambulance_checks — RN-0017
CREATE TABLE IF NOT EXISTS ambulance_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  check_date date NOT NULL DEFAULT CURRENT_DATE,
  vehicle_id text NOT NULL,
  vehicle_plate text,
  equipment_status jsonb NOT NULL DEFAULT '[]',
  fuel_level text,
  mileage numeric(10,1),
  safety_items_ok boolean DEFAULT true,
  cleanliness_ok boolean DEFAULT true,
  inspector_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE ambulance_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY ambulance_checks_select ON ambulance_checks FOR SELECT USING (true);
CREATE POLICY ambulance_checks_insert ON ambulance_checks FOR INSERT WITH CHECK (true);
CREATE POLICY ambulance_checks_update ON ambulance_checks FOR UPDATE USING (true);
CREATE INDEX idx_ambulance_checks_date ON ambulance_checks(check_date);
GRANT SELECT, INSERT, UPDATE ON ambulance_checks TO anon, authenticated;

-- ============================================================
-- C. DENTAL FEATURE — 3 tables
-- ============================================================

-- 20. dental_records — Charting + Treatment
CREATE TABLE IF NOT EXISTS dental_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  record_date date NOT NULL DEFAULT CURRENT_DATE,
  record_type text NOT NULL DEFAULT 'charting' CHECK (record_type IN ('charting', 'treatment')),
  tooth_chart jsonb DEFAULT '[]',
  ohis_score numeric(3,1),
  cpitn_score numeric(3,1),
  treatment_phase text CHECK (treatment_phase IN ('emergency', 'preventive', 'surgical', 'restorative', 'prosthetic', 'follow_up')),
  treatment_performed text,
  tooth_numbers integer[],
  materials_used text,
  complications text,
  dentist_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE dental_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY dental_records_select ON dental_records FOR SELECT USING (true);
CREATE POLICY dental_records_insert ON dental_records FOR INSERT WITH CHECK (true);
CREATE POLICY dental_records_update ON dental_records FOR UPDATE USING (true);
CREATE INDEX idx_dental_records_beneficiary ON dental_records(beneficiary_id);
CREATE INDEX idx_dental_records_date ON dental_records(record_date);
GRANT SELECT, INSERT, UPDATE ON dental_records TO anon, authenticated;

-- 21. dental_hygiene_logs — Brushing + Training
CREATE TABLE IF NOT EXISTS dental_hygiene_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid NOT NULL REFERENCES beneficiaries(id),
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  brushing_done boolean DEFAULT false,
  brushing_time text CHECK (brushing_time IN ('morning', 'evening', 'both')),
  training_session boolean DEFAULT false,
  training_notes text,
  oral_health_status text DEFAULT 'fair' CHECK (oral_health_status IN ('good', 'fair', 'poor')),
  recorded_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE dental_hygiene_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY dental_hygiene_logs_select ON dental_hygiene_logs FOR SELECT USING (true);
CREATE POLICY dental_hygiene_logs_insert ON dental_hygiene_logs FOR INSERT WITH CHECK (true);
CREATE POLICY dental_hygiene_logs_update ON dental_hygiene_logs FOR UPDATE USING (true);
CREATE INDEX idx_dental_hygiene_logs_beneficiary ON dental_hygiene_logs(beneficiary_id);
CREATE INDEX idx_dental_hygiene_logs_date ON dental_hygiene_logs(log_date);
GRANT SELECT, INSERT, UPDATE ON dental_hygiene_logs TO anon, authenticated;

-- 22. dental_sterilization — Equipment Sterilization Chart
CREATE TABLE IF NOT EXISTS dental_sterilization (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date date NOT NULL DEFAULT CURRENT_DATE,
  equipment_name text NOT NULL,
  sterilization_method text NOT NULL CHECK (sterilization_method IN ('autoclave', 'chemical', 'dry_heat')),
  cycle_number integer,
  temperature numeric(5,1),
  pressure numeric(5,2),
  duration_minutes integer,
  biological_indicator_result text CHECK (biological_indicator_result IN ('pass', 'fail')),
  operator_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE dental_sterilization ENABLE ROW LEVEL SECURITY;
CREATE POLICY dental_sterilization_select ON dental_sterilization FOR SELECT USING (true);
CREATE POLICY dental_sterilization_insert ON dental_sterilization FOR INSERT WITH CHECK (true);
CREATE POLICY dental_sterilization_update ON dental_sterilization FOR UPDATE USING (true);
CREATE INDEX idx_dental_sterilization_date ON dental_sterilization(log_date);
GRANT SELECT, INSERT, UPDATE ON dental_sterilization TO anon, authenticated;
