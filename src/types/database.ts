/** Supabase Database types — matches the existing v1 schema */

export type Database = {
  public: {
    Tables: {
      beneficiaries: {
        Row: Beneficiary
        Insert: BeneficiaryInsert
        Update: Partial<BeneficiaryInsert>
      }
      employees: {
        Row: Employee
        Insert: EmployeeInsert
        Update: Partial<EmployeeInsert>
      }
      daily_care_logs: {
        Row: DailyCareLog
        Insert: DailyCareLogInsert
        Update: Partial<DailyCareLogInsert>
      }
      medical_profiles: {
        Row: MedicalProfile
        Insert: MedicalProfileInsert
        Update: Partial<MedicalProfileInsert>
      }
      fall_risk_assessments: {
        Row: FallRiskAssessment
        Insert: FallRiskAssessmentInsert
        Update: Partial<FallRiskAssessmentInsert>
      }
      shift_handover_reports: {
        Row: ShiftHandoverReport
        Insert: ShiftHandoverReportInsert
        Update: Partial<ShiftHandoverReportInsert>
      }
      risk_alerts: {
        Row: RiskAlert
        Insert: RiskAlertInsert
        Update: Partial<RiskAlertInsert>
      }
      strategic_kpis: {
        Row: StrategicKPI
        Insert: StrategicKPIInsert
        Update: Partial<StrategicKPIInsert>
      }
      audit_logs: {
        Row: AuditLog
        Insert: AuditLogInsert
        Update: Partial<AuditLogInsert>
      }
      grc_risks: {
        Row: GrcRisk
        Insert: GrcRiskInsert
        Update: Partial<GrcRiskInsert>
      }
      grc_compliance_requirements: {
        Row: GrcComplianceRequirement
        Insert: GrcComplianceRequirementInsert
        Update: Partial<GrcComplianceRequirementInsert>
      }
      catering_raw_materials: {
        Row: CateringRawMaterial
        Insert: CateringRawMaterialInsert
        Update: Partial<CateringRawMaterialInsert>
      }
      daily_meals: {
        Row: DailyMeal
        Insert: DailyMealInsert
        Update: Partial<DailyMealInsert>
      }
      dietary_plans: {
        Row: DietaryPlan
        Insert: DietaryPlanInsert
        Update: Partial<DietaryPlanInsert>
      }
      om_assets: {
        Row: OmAsset
        Insert: OmAssetInsert
        Update: Partial<OmAssetInsert>
      }
      om_asset_categories: {
        Row: OmAssetCategory
        Insert: OmAssetCategoryInsert
        Update: Partial<OmAssetCategoryInsert>
      }
      om_maintenance_requests: {
        Row: OmMaintenanceRequest
        Insert: OmMaintenanceRequestInsert
        Update: Partial<OmMaintenanceRequestInsert>
      }
      om_preventive_schedules: {
        Row: OmPreventiveSchedule
        Insert: OmPreventiveScheduleInsert
        Update: Partial<OmPreventiveScheduleInsert>
      }
      ipc_incidents: {
        Row: IpcIncident
        Insert: IpcIncidentInsert
        Update: Partial<IpcIncidentInsert>
      }
      ipc_inspections: {
        Row: IpcInspection
        Insert: IpcInspectionInsert
        Update: Partial<IpcInspectionInsert>
      }
      ipc_locations: {
        Row: IpcLocation
        Insert: IpcLocationInsert
        Update: Partial<IpcLocationInsert>
      }
      ipc_checklist_templates: {
        Row: IpcChecklistTemplate
        Insert: IpcChecklistTemplateInsert
        Update: Partial<IpcChecklistTemplateInsert>
      }
      immunizations: {
        Row: IpcImmunization
        Insert: IpcImmunizationInsert
        Update: Partial<IpcImmunizationInsert>
      }
      rehab_goals: {
        Row: RehabGoal
        Insert: RehabGoalInsert
        Update: Partial<RehabGoalInsert>
      }
      goal_progress_logs: {
        Row: GoalProgressLog
        Insert: GoalProgressLogInsert
        Update: Partial<GoalProgressLogInsert>
      }
      goal_templates: {
        Row: GoalTemplate
        Insert: GoalTemplateInsert
        Update: Partial<GoalTemplateInsert>
      }
      beneficiary_preferences: {
        Row: BeneficiaryPreferences
        Insert: BeneficiaryPreferencesInsert
        Update: Partial<BeneficiaryPreferencesInsert>
      }
      grc_audits: {
        Row: GrcAudit
        Insert: GrcAuditInsert
        Update: Partial<GrcAuditInsert>
      }
      grc_ncrs: {
        Row: GrcNcr
        Insert: GrcNcrInsert
        Update: Partial<GrcNcrInsert>
      }
      social_research: {
        Row: SocialResearch
        Insert: SocialResearchInsert
        Update: Partial<SocialResearchInsert>
      }
    }
    Functions: Record<string, unknown>
    Enums: Record<string, unknown>
  }
}

// ===== Beneficiaries =====
export interface Beneficiary {
  id: string
  file_number: string
  full_name: string
  national_id: string
  gender: 'ذكر' | 'أنثى'
  date_of_birth: string
  nationality: string
  section: 'ذكور' | 'إناث' | 'أطفال'
  room_number: string | null
  bed_number: string | null
  admission_date: string
  discharge_date: string | null
  status: 'نشط' | 'غير نشط' | 'متوفى' | 'مخرج'
  evacuation_category: string | null
  guardian_name: string | null
  guardian_phone: string | null
  guardian_relation: string | null
  medical_diagnosis: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type BeneficiaryInsert = Omit<Beneficiary, 'id' | 'created_at' | 'updated_at'>

// ===== Employees =====
export interface Employee {
  id: string
  user_id: string | null
  employee_number: string
  full_name: string
  job_title: string
  department: string
  section: string | null
  role: EmployeeRole
  email: string | null
  phone: string | null
  is_active: boolean
  created_at: string
}

export type EmployeeRole =
  | 'موظف'
  | 'مشرف'
  | 'مدير_قسم'
  | 'مدير_مركز'
  | 'admin'
  | 'doctor'
  | 'nurse'
  | 'social_worker'
  | 'specialist'

export type EmployeeInsert = Omit<Employee, 'id' | 'created_at'>

// ===== Daily Care Logs =====
export interface DailyCareLog {
  id: string
  beneficiary_id: string
  shift: 'صباحي' | 'مسائي' | 'ليلي'
  shift_date: string
  temperature: number | null
  pulse: number | null
  blood_pressure_systolic: number | null
  blood_pressure_diastolic: number | null
  oxygen_saturation: number | null
  blood_sugar: number | null
  meals: Record<string, unknown> | null
  medications: Record<string, unknown> | null
  care_activities: string[] | null
  incidents: string | null
  mood: string | null
  sleep_quality: string | null
  notes: string | null
  recorded_by: string
  created_at: string
}

export type DailyCareLogInsert = Omit<DailyCareLog, 'id' | 'created_at'>

// ===== Medical Profiles =====
export interface MedicalProfile {
  id: string
  beneficiary_id: string
  primary_diagnosis: string | null
  secondary_diagnoses: string[] | null
  chronic_diseases: string[] | null
  allergies: string[] | null
  surgeries: string[] | null
  family_history: string | null
  epilepsy: boolean
  current_medications: Record<string, unknown>[] | null
  disability_type: string | null
  disability_degree: string | null
  created_at: string
  updated_at: string
}

export type MedicalProfileInsert = Omit<MedicalProfile, 'id' | 'created_at' | 'updated_at'>

// ===== Fall Risk Assessments =====
export interface FallRiskAssessment {
  id: string
  beneficiary_id: string
  fall_history: number
  medications_risk: number
  cognitive_level: number
  mobility_level: number
  risk_score: number
  risk_level: 'حرج' | 'عالي' | 'متوسط' | 'منخفض'
  preventive_measures: string[] | null
  next_assessment_date: string | null
  assessed_by: string
  created_at: string
}

export type FallRiskAssessmentInsert = Omit<FallRiskAssessment, 'id' | 'created_at'>

// ===== Shift Handover Reports =====
export interface ShiftHandoverReport {
  id: string
  shift_date: string
  outgoing_shift: string
  incoming_shift: string
  section: string
  stable_count: number
  needs_attention_count: number
  critical_count: number
  summary_incidents: string | null
  created_at: string
}

export type ShiftHandoverReportInsert = Omit<ShiftHandoverReport, 'id' | 'created_at'>

// ===== Risk Alerts =====
export interface RiskAlert {
  id: string
  beneficiary_id: string
  alert_type: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  status: 'نشط' | 'resolved'
  acknowledged_by: string | null
  resolved_at: string | null
  created_at: string
}

export type RiskAlertInsert = Omit<RiskAlert, 'id' | 'created_at'>

// ===== Strategic KPIs =====
export interface StrategicKPI {
  id: string
  kpi_date: string
  occupancy_rate: number | null
  critical_cases: number | null
  fall_incidents_count: number | null
  staff_compliance: number | null
  calculated_at: string
}

export type StrategicKPIInsert = Omit<StrategicKPI, 'id' | 'calculated_at'>

// ===== Audit Logs =====
export interface AuditLog {
  id: string
  user_id: string
  action: string
  table_name: string
  record_id: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export type AuditLogInsert = Omit<AuditLog, 'id' | 'created_at'>

// ===== GRC Risks =====
export interface GrcRisk {
  id: string
  title: string
  description: string
  category: string
  likelihood: number
  impact: number
  risk_score: number
  risk_level: string
  response_strategy: 'avoid' | 'mitigate' | 'transfer' | 'accept'
  mitigation_plan: string | null
  owner: string | null
  status: 'open' | 'mitigated' | 'closed'
  created_at: string
  updated_at: string
}

export type GrcRiskInsert = Omit<GrcRisk, 'id' | 'created_at' | 'updated_at'>

// ===== GRC Compliance =====
export interface GrcComplianceRequirement {
  id: string
  standard: string
  clause: string
  requirement: string
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable'
  evidence: string | null
  gap_analysis: string | null
  remediation_plan: string | null
  due_date: string | null
  created_at: string
}

export type GrcComplianceRequirementInsert = Omit<GrcComplianceRequirement, 'id' | 'created_at'>

// ===== Catering =====
export interface CateringRawMaterial {
  id: string
  code: string
  name: string
  category: string
  unit: string
  min_stock: number
  max_stock: number
  daily_quota: number | null
  current_stock: number
  created_at: string
}

export type CateringRawMaterialInsert = Omit<CateringRawMaterial, 'id' | 'created_at'>

// ===== Daily Meals =====
export interface DailyMeal {
  id: string
  beneficiary_id: string
  meal_date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  status: 'scheduled' | 'delivered' | 'skipped' | 'special'
  delivered_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type DailyMealInsert = Omit<DailyMeal, 'id' | 'created_at' | 'updated_at'>

// ===== Dietary Plans =====
export interface DietaryPlan {
  id: string
  beneficiary_id: string
  plan_type: string
  dietary_restrictions: string[] | null
  allergies: string[] | null
  calorie_target: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type DietaryPlanInsert = Omit<DietaryPlan, 'id' | 'created_at' | 'updated_at'>

// ===== Operations — Assets =====
export interface OmAsset {
  id: string
  asset_code: string
  name_ar: string
  category_id: string | null
  location: string | null
  status: 'operational' | 'maintenance' | 'retired' | 'out_of_service'
  purchase_date: string | null
  warranty_expiry: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type OmAssetInsert = Omit<OmAsset, 'id' | 'created_at' | 'updated_at'>

// ===== Operations — Asset Categories =====
export interface OmAssetCategory {
  id: string
  name_ar: string
  description: string | null
  created_at: string
}

export type OmAssetCategoryInsert = Omit<OmAssetCategory, 'id' | 'created_at'>

// ===== Operations — Maintenance Requests =====
export interface OmMaintenanceRequest {
  id: string
  request_number: string
  asset_id: string | null
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  requested_by: string | null
  assigned_to: string | null
  completed_at: string | null
  cost: number | null
  created_at: string
  updated_at: string
}

export type OmMaintenanceRequestInsert = Omit<OmMaintenanceRequest, 'id' | 'created_at' | 'updated_at'>

// ===== Operations — Preventive Schedules =====
export interface OmPreventiveSchedule {
  id: string
  asset_id: string
  task_name: string
  frequency: string
  next_due_date: string
  last_performed: string | null
  status: 'scheduled' | 'overdue' | 'completed'
  assigned_to: string | null
  created_at: string
}

export type OmPreventiveScheduleInsert = Omit<OmPreventiveSchedule, 'id' | 'created_at'>

// ===== IPC — Incidents =====
export interface IpcIncident {
  id: string
  incident_category: string
  detection_date: string
  detection_time: string | null
  affected_type: string | null
  beneficiary_id: string | null
  reported_by: string | null
  location_id: string | null
  infection_site: string | null
  pathogen_identified: string | null
  symptoms: string[] | null
  onset_date: string | null
  severity_level: 'low' | 'medium' | 'high' | 'critical'
  immediate_actions: string[] | null
  isolation_required: boolean
  isolation_type: string | null
  status: 'reported' | 'investigating' | 'contained' | 'resolved' | 'closed'
  assigned_to: string | null
  investigation_notes: string | null
  root_cause: string | null
  outcome: string | null
  created_at: string
}

export type IpcIncidentInsert = Omit<IpcIncident, 'id' | 'created_at'>

// ===== IPC — Inspections =====
export interface IpcInspection {
  id: string
  inspection_date: string
  inspection_time: string | null
  shift: string | null
  inspector_name: string | null
  location_id: string | null
  location_name: string | null
  checklist_template_id: string | null
  checklist_data: Record<string, unknown> | null
  total_items: number
  compliant_items: number
  compliance_score: number
  non_compliance_details: string | null
  corrective_actions: string | null
  follow_up_required: boolean
  evidence_photos: string[] | null
  created_at: string
}

export type IpcInspectionInsert = Omit<IpcInspection, 'id' | 'created_at'>

// ===== IPC — Locations =====
export interface IpcLocation {
  id: string
  name: string
  name_en: string | null
  section: string | null
  building: string | null
  floor: string | null
  capacity: number | null
  is_high_risk: boolean
}

export type IpcLocationInsert = Omit<IpcLocation, 'id'>

// ===== IPC — Checklist Templates =====
export interface IpcChecklistTemplate {
  id: string
  template_name: string
  template_name_ar: string | null
  category: string | null
  checklist_items: Record<string, unknown>[] | null
  is_active: boolean
  created_at: string
}

export type IpcChecklistTemplateInsert = Omit<IpcChecklistTemplate, 'id' | 'created_at'>

// ===== IPC — Immunizations =====
export interface IpcImmunization {
  id: string
  person_type: 'beneficiary' | 'staff'
  beneficiary_id: string | null
  staff_name: string | null
  vaccine_code: string
  vaccine_name: string
  vaccine_name_ar: string | null
  dose_number: number
  total_doses: number
  date_administered: string
  next_due_date: string | null
  immunity_status: 'incomplete' | 'complete' | 'booster_needed'
  adverse_reaction: string | null
  created_at: string
}

export type IpcImmunizationInsert = Omit<IpcImmunization, 'id' | 'created_at'>

// ===== Empowerment — Rehab Goals =====
export interface RehabGoal {
  id: string
  beneficiary_id: string
  domain: string
  goal_title: string
  goal_description: string | null
  measurement_type: string | null
  measurement_unit: string | null
  baseline_value: number | null
  target_value: number | null
  current_value: number | null
  quality_of_life_dimension: string | null
  start_date: string | null
  target_date: string | null
  assigned_to: string | null
  assigned_department: string | null
  status: 'active' | 'achieved' | 'paused' | 'cancelled'
  progress_percentage: number
  achievement_evidence: string | null
  barriers_notes: string | null
  family_involvement: string | null
  linked_national_goal: string | null
  created_at: string
  updated_at: string
}

export type RehabGoalInsert = Omit<RehabGoal, 'id' | 'created_at' | 'updated_at'>

// ===== Empowerment — Goal Progress Logs =====
export interface GoalProgressLog {
  id: string
  goal_id: string
  recorded_value: number | null
  previous_value: number | null
  progress_note: string | null
  session_type: string | null
  session_duration_minutes: number | null
  beneficiary_feedback: string | null
  family_feedback: string | null
  recorded_by: string | null
  recorded_at: string
}

export type GoalProgressLogInsert = Omit<GoalProgressLog, 'id'>

// ===== Empowerment — Goal Templates =====
export interface GoalTemplate {
  id: string
  domain: string
  goal_title: string
  goal_description: string | null
  measurement_type: string | null
  measurement_unit: string | null
  typical_duration_weeks: number | null
  difficulty_level: string | null
  age_group: string | null
  success_criteria: string | null
}

export type GoalTemplateInsert = Omit<GoalTemplate, 'id'>

// ===== Empowerment — Beneficiary Preferences =====
export interface BeneficiaryPreferences {
  id: string
  beneficiary_id: string
  preferred_name: string | null
  preferred_title: string | null
  communication_style: string | null
  preferred_activities: string[] | null
  hobbies: string[] | null
  strengths: string[] | null
  favorite_foods: string[] | null
  calming_strategies: string[] | null
  motivators: string[] | null
  what_makes_me_happy: string | null
  what_makes_me_upset: string | null
  my_dreams: string | null
  wake_up_time: string | null
  sleep_time: string | null
  created_at: string
  updated_at: string
}

export type BeneficiaryPreferencesInsert = Omit<BeneficiaryPreferences, 'id' | 'created_at' | 'updated_at'>

// ===== Quality — Internal Audit Cycles =====
export interface GrcAudit {
  id: string
  audit_code: string | null
  standard_id: string | null
  audit_type: string | null
  audit_date: string | null
  scope: string | null
  findings: string | null
  non_conformities: number | null
  observations: number | null
  opportunities_for_improvement: number | null
  overall_score: number | null
  auditor_name: string | null
  auditor_organization: string | null
  report_url: string | null
  next_audit_date: string | null
  created_at: string
}

export type GrcAuditInsert = Omit<GrcAudit, 'id' | 'created_at'>

// ===== Quality — GRC NCRs =====
export interface GrcNcr {
  id: string
  title: string
  description: string | null
  category: string | null
  severity: string | null
  status: string | null
  progress: number | null
  root_cause: string | null
  corrective_action: string | null
  due_date: string | null
  assigned_to: string | null
  created_at: string
  closed_at: string | null
}

export type GrcNcrInsert = Omit<GrcNcr, 'id' | 'created_at'>

// ===== Social Research =====
export interface SocialResearch {
  id: string
  beneficiary_id: string
  national_id: string | null
  research_date: string | null
  social_status: string | null
  family_size: number | null
  income_source: string | null
  housing_type: string | null
  education_level: string | null
  social_worker: string | null
  recommendations: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type SocialResearchInsert = Omit<SocialResearch, 'id' | 'created_at' | 'updated_at'>
