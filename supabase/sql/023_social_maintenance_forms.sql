-- Migration 023: Social & Maintenance Forms Digitization
-- Creates 14 new tables for digitized HRSD forms

-- ═══════════════════════════════════════════════════════════
-- 1. social_followups — نموذج 13 (المتابعة الاجتماعية)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS social_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  period text NOT NULL, -- e.g. '2026-H1', '2026-H2'
  assessor_name text NOT NULL,
  -- Independence
  clothing_self text CHECK (clothing_self IN ('self','partial','others')),
  eating_self text CHECK (eating_self IN ('self','partial','others')),
  mobility text CHECK (mobility IN ('natural','wheelchair_electric','wheelchair_manual','bedridden','with_help')),
  hygiene text CHECK (hygiene IN ('self','partial','others')),
  -- Behavior
  peer_relations text CHECK (peer_relations IN ('good','partial','unaware')),
  other_relations text CHECK (other_relations IN ('good','partial','unaware')),
  -- Family
  family_cooperation text CHECK (family_cooperation IN ('cooperative','partial','uncooperative')),
  family_bond text CHECK (family_bond IN ('good','partial','none')),
  actions_taken jsonb DEFAULT '[]',
  internal_visits int DEFAULT 0,
  external_visits int DEFAULT 0,
  family_calls int DEFAULT 0,
  social_reports int DEFAULT 0,
  -- Activities
  participates_in_activities boolean DEFAULT false,
  activity_types text[] DEFAULT '{}',
  hobbies text[] DEFAULT '{}',
  has_talent boolean DEFAULT false,
  talent_description text,
  recommendations text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social_followups_select" ON social_followups FOR SELECT USING (true);
CREATE POLICY "social_followups_insert" ON social_followups FOR INSERT WITH CHECK (true);
CREATE POLICY "social_followups_update" ON social_followups FOR UPDATE USING (true);
CREATE INDEX idx_social_followups_beneficiary ON social_followups(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON social_followups TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 2. referrals — نموذج 15 (استمارة تحويل)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  referral_type text NOT NULL CHECK (referral_type IN ('internal','external')),
  specialty text CHECK (specialty IN ('medical','behavioral','training')),
  urgency text NOT NULL CHECK (urgency IN ('urgent_critical','urgent','important','normal','info')),
  referred_to_department text,
  referred_to_section text,
  description text,
  current_needs text,
  expected_outcomes text,
  receiving_opinion text,
  intervention_description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_treatment','needs_plan','team_meeting','resolved')),
  specialist_name text,
  supervisor_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "referrals_select" ON referrals FOR SELECT USING (true);
CREATE POLICY "referrals_insert" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "referrals_update" ON referrals FOR UPDATE USING (true);
CREATE INDEX idx_referrals_beneficiary ON referrals(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON referrals TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 3. family_notifications — نموذج 16 (تبليغ الأسرة)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS family_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  notification_type text NOT NULL CHECK (notification_type IN ('injury','hospitalization','appointment','death','other')),
  notification_detail text,
  contact_number text,
  contacted_relation text CHECK (contacted_relation IN ('father','mother','brother','sister','grandparent','uncle','aunt','other')),
  contacted_name text,
  call_summary text,
  notes text,
  notified_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE family_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "family_notifications_select" ON family_notifications FOR SELECT USING (true);
CREATE POLICY "family_notifications_insert" ON family_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "family_notifications_update" ON family_notifications FOR UPDATE USING (true);
CREATE INDEX idx_family_notifications_beneficiary ON family_notifications(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON family_notifications TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 4. incident_reports — نموذج 17 (نموذج الإصابة)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS incident_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  incident_date date NOT NULL,
  incident_time time,
  incident_type text NOT NULL CHECK (incident_type IN ('approved','unapproved','negligence','other')),
  incident_type_detail text,
  worker_name text,
  worker_id text,
  worker_statement text,
  action_taken_on_worker text,
  specialist_opinion text,
  social_worker_opinion text,
  reported_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "incident_reports_select" ON incident_reports FOR SELECT USING (true);
CREATE POLICY "incident_reports_insert" ON incident_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "incident_reports_update" ON incident_reports FOR UPDATE USING (true);
CREATE INDEX idx_incident_reports_beneficiary ON incident_reports(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON incident_reports TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 5. daily_monitor_rounds — نموذج 22 (المتابعة اليومية)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS daily_monitor_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number text NOT NULL,
  round_date date NOT NULL,
  shift text NOT NULL CHECK (shift IN ('morning','evening','night')),
  rooms jsonb NOT NULL DEFAULT '[]',
  monitor_name text NOT NULL,
  supervisor_name text,
  general_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_monitor_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "daily_monitor_rounds_select" ON daily_monitor_rounds FOR SELECT USING (true);
CREATE POLICY "daily_monitor_rounds_insert" ON daily_monitor_rounds FOR INSERT WITH CHECK (true);
CREATE POLICY "daily_monitor_rounds_update" ON daily_monitor_rounds FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON daily_monitor_rounds TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 6. clothing_inventory — نماذج الكسوة (جرد + احتياج)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS clothing_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  season_type text NOT NULL CHECK (season_type IN ('summer','winter','eid_fitr','eid_adha')),
  fiscal_year text NOT NULL,
  item_name text NOT NULL,
  item_size text,
  quantity int NOT NULL DEFAULT 0,
  condition text DEFAULT 'good' CHECK (condition IN ('good','damaged','disposed')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clothing_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clothing_inventory_select" ON clothing_inventory FOR SELECT USING (true);
CREATE POLICY "clothing_inventory_insert" ON clothing_inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "clothing_inventory_update" ON clothing_inventory FOR UPDATE USING (true);
CREATE INDEX idx_clothing_inventory_beneficiary ON clothing_inventory(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON clothing_inventory TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 7. clothing_transactions — نماذج الكسوة (صرف/إتلاف/مشتريات)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS clothing_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase','issue','additional_issue','return_damaged','disposal','inventory_count')),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  season_type text CHECK (season_type IN ('summer','winter','eid_fitr','eid_adha')),
  fiscal_year text,
  items jsonb NOT NULL DEFAULT '[]',
  total_cost numeric(10,2),
  warehouse_keeper text,
  committee_head text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clothing_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clothing_transactions_select" ON clothing_transactions FOR SELECT USING (true);
CREATE POLICY "clothing_transactions_insert" ON clothing_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "clothing_transactions_update" ON clothing_transactions FOR UPDATE USING (true);
CREATE INDEX idx_clothing_transactions_beneficiary ON clothing_transactions(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON clothing_transactions TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 8. visit_records — نماذج 19-21 (استمارة الزيارات الشاملة)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS visit_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  visit_type text NOT NULL CHECK (visit_type IN ('internal','external')),
  visit_date date NOT NULL,
  arrival_time time,
  departure_time time,
  visitor_name text NOT NULL,
  visitor_national_id text,
  visitor_relation text CHECK (visitor_relation IN ('father','mother','brother','sister','grandparent_m','grandparent_f','uncle_paternal','uncle_maternal','aunt_paternal','aunt_maternal','other')),
  companion_count int DEFAULT 0,
  -- Pre-departure checklist (external visits)
  checklist_medical_exam boolean DEFAULT false,
  checklist_personal_hygiene boolean DEFAULT false,
  checklist_medications_delivered boolean DEFAULT false,
  checklist_clothing_sufficient boolean DEFAULT false,
  checklist_weight_monitored boolean DEFAULT false,
  checklist_medications_given boolean DEFAULT false,
  checklist_clothing_returned boolean DEFAULT false,
  checklist_care_instructions boolean DEFAULT false,
  checklist_diet_followed boolean DEFAULT false,
  checklist_hospital_appointments boolean DEFAULT false,
  checklist_development_plans boolean DEFAULT false,
  -- Assessment
  family_integration text CHECK (family_integration IN ('good','partial','poor')),
  therapy_plan_trained boolean DEFAULT false,
  visit_purpose text,
  guardian_notes text,
  specialist_name text,
  monitor_name text,
  nurse_name text,
  doctor_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE visit_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "visit_records_select" ON visit_records FOR SELECT USING (true);
CREATE POLICY "visit_records_insert" ON visit_records FOR INSERT WITH CHECK (true);
CREATE POLICY "visit_records_update" ON visit_records FOR UPDATE USING (true);
CREATE INDEX idx_visit_records_beneficiary ON visit_records(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON visit_records TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 9. family_counseling_cases — نماذج 25-30 (الإرشاد الأسري)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS family_counseling_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  referral_date date NOT NULL,
  medical_diagnosis text,
  psychological_diagnosis text,
  target_plan_duration text CHECK (target_plan_duration IN ('1month','3months','6months','1year','other')),
  -- Skill targets
  independence_target text,
  cognitive_target text,
  social_target text,
  vocational_target text,
  -- Therapy targets
  pt_target text, ot_target text, speech_target text,
  psych_target text, nutrition_target text, medical_target text,
  -- Family interaction
  beneficiary_engagement text CHECK (beneficiary_engagement IN ('engaged','partial','not_engaged')),
  family_acceptance text,
  family_center_communication text,
  -- 4-phase plan
  plan_phases jsonb DEFAULT '[]',
  -- Aftercare visits
  aftercare_visits jsonb DEFAULT '[]',
  -- Family case study
  housing_type text,
  housing_ownership text,
  employment_status text,
  family_disability_count int DEFAULT 0,
  disability_in_family_details text,
  interview_date date,
  interview_location text,
  interview_parties text,
  interview_duration text,
  interview_results text,
  -- Evaluation scores (% out of 100)
  satisfaction_score numeric(5,2),
  visits_score numeric(5,2),
  integration_score numeric(5,2),
  programs_score numeric(5,2),
  interviews_score numeric(5,2),
  initiatives_score numeric(5,2),
  -- Status
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','closed')),
  counselor_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE family_counseling_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "family_counseling_cases_select" ON family_counseling_cases FOR SELECT USING (true);
CREATE POLICY "family_counseling_cases_insert" ON family_counseling_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "family_counseling_cases_update" ON family_counseling_cases FOR UPDATE USING (true);
CREATE INDEX idx_family_counseling_beneficiary ON family_counseling_cases(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON family_counseling_cases TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 10. training_referrals — نموذج 4 (تحويل للبرامج التدريبية)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS training_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  referral_date date NOT NULL,
  medical_diagnosis text,
  psychological_diagnosis text,
  assistive_devices text,
  referral_goals text[] DEFAULT '{}',
  skills_assessment jsonb DEFAULT '{}',
  referred_by text,
  received_by text,
  supervisor_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "training_referrals_select" ON training_referrals FOR SELECT USING (true);
CREATE POLICY "training_referrals_insert" ON training_referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "training_referrals_update" ON training_referrals FOR UPDATE USING (true);
CREATE INDEX idx_training_referrals_beneficiary ON training_referrals(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON training_referrals TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 11. training_evaluations — نماذج 7-11 (تقييم الأداء)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS training_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  evaluation_type text NOT NULL CHECK (evaluation_type IN ('semi_annual','training_performance','vocational')),
  evaluation_date date NOT NULL,
  evaluator_name text NOT NULL,
  sections jsonb NOT NULL DEFAULT '[]',
  total_score numeric(6,2),
  max_total numeric(6,2),
  percentage numeric(5,2),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE training_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "training_evaluations_select" ON training_evaluations FOR SELECT USING (true);
CREATE POLICY "training_evaluations_insert" ON training_evaluations FOR INSERT WITH CHECK (true);
CREATE POLICY "training_evaluations_update" ON training_evaluations FOR UPDATE USING (true);
CREATE INDEX idx_training_evaluations_beneficiary ON training_evaluations(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON training_evaluations TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 12. abuse_reports — نماذج العنف والإيذاء
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS abuse_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id uuid REFERENCES beneficiaries(id),
  report_date date NOT NULL,
  report_time time,
  abuse_type text NOT NULL CHECK (abuse_type IN ('physical','psychological','neglect','sexual','other')),
  severity text NOT NULL CHECK (severity IN ('minor','moderate','severe','critical')),
  description text,
  location_in_facility text,
  perpetrator_type text CHECK (perpetrator_type IN ('staff','other_resident','visitor','family','unknown')),
  perpetrator_name text,
  -- Immediate actions
  immediate_actions text[] DEFAULT '{}',
  medical_examination_done boolean DEFAULT false,
  medical_report text,
  beneficiary_separated boolean DEFAULT false,
  -- Investigation
  investigation_status text NOT NULL DEFAULT 'reported' CHECK (investigation_status IN ('reported','investigating','resolved','referred_to_authorities')),
  investigator_name text,
  investigation_notes text,
  -- Follow-up
  follow_up_actions jsonb DEFAULT '[]',
  authority_notified boolean DEFAULT false,
  authority_reference text,
  reported_by text NOT NULL,
  witness_names text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE abuse_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "abuse_reports_select" ON abuse_reports FOR SELECT USING (true);
CREATE POLICY "abuse_reports_insert" ON abuse_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "abuse_reports_update" ON abuse_reports FOR UPDATE USING (true);
CREATE INDEX idx_abuse_reports_beneficiary ON abuse_reports(beneficiary_id);
GRANT SELECT, INSERT, UPDATE ON abuse_reports TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 13. activity_advances — نماذج السلفة
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS activity_advances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fiscal_year text NOT NULL,
  advance_type text NOT NULL CHECK (advance_type IN ('imprest','reimbursement')),
  amount_requested numeric(12,2) NOT NULL,
  amount_approved numeric(12,2),
  amount_spent numeric(12,2),
  purpose text NOT NULL,
  budget_line text,
  approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending','approved','rejected','settled')),
  receipts jsonb DEFAULT '[]',
  requested_by text NOT NULL,
  approved_by text,
  settlement_date date,
  settlement_notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_advances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_advances_select" ON activity_advances FOR SELECT USING (true);
CREATE POLICY "activity_advances_insert" ON activity_advances FOR INSERT WITH CHECK (true);
CREATE POLICY "activity_advances_update" ON activity_advances FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON activity_advances TO anon, authenticated;

-- ═══════════════════════════════════════════════════════════
-- 14. maintenance_checklists — نماذج الصيانة (56 GFM-ZM)
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS maintenance_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_code text,
  category text NOT NULL CHECK (category IN ('hvac','electrical','plumbing','fire_safety','elevators','security','cleaning','pest_control','waste','gardens','communications','bms')),
  facility_type text NOT NULL CHECK (facility_type IN ('office','healthcare')),
  title_ar text NOT NULL,
  checklist_items jsonb NOT NULL DEFAULT '[]',
  inspection_date date NOT NULL,
  inspector_name text NOT NULL,
  compliance_percentage numeric(5,2),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','completed')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "maintenance_checklists_select" ON maintenance_checklists FOR SELECT USING (true);
CREATE POLICY "maintenance_checklists_insert" ON maintenance_checklists FOR INSERT WITH CHECK (true);
CREATE POLICY "maintenance_checklists_update" ON maintenance_checklists FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON maintenance_checklists TO anon, authenticated;
