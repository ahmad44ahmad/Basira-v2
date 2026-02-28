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
      icf_assessments: {
        Row: IcfAssessment
        Insert: IcfAssessmentInsert
        Update: Partial<IcfAssessmentInsert>
      }
      individual_life_plans: {
        Row: IndividualLifePlan
        Insert: IndividualLifePlanInsert
        Update: Partial<IndividualLifePlanInsert>
      }
      rights_realization_log: {
        Row: RightsRealizationLog
        Insert: RightsRealizationLogInsert
        Update: Partial<RightsRealizationLogInsert>
      }
      visual_survey_responses: {
        Row: VisualSurveyResponse
        Insert: VisualSurveyResponseInsert
        Update: Partial<VisualSurveyResponseInsert>
      }
      emergency_peep_plans: {
        Row: EmergencyPeepPlan
        Insert: EmergencyPeepPlanInsert
        Update: Partial<EmergencyPeepPlanInsert>
      }
      emergency_equipment_readiness: {
        Row: EmergencyEquipmentReadiness
        Insert: EmergencyEquipmentReadinessInsert
        Update: Partial<EmergencyEquipmentReadinessInsert>
      }
      staff_wellbeing_scores: {
        Row: StaffWellbeingScore
        Insert: StaffWellbeingScoreInsert
        Update: Partial<StaffWellbeingScoreInsert>
      }
      stress_alerts: {
        Row: StressAlert
        Insert: StressAlertInsert
        Update: Partial<StressAlertInsert>
      }
      social_followups: {
        Row: SocialFollowup
        Insert: SocialFollowupInsert
        Update: Partial<SocialFollowupInsert>
      }
      referrals: {
        Row: Referral
        Insert: ReferralInsert
        Update: Partial<ReferralInsert>
      }
      family_notifications: {
        Row: FamilyNotification
        Insert: FamilyNotificationInsert
        Update: Partial<FamilyNotificationInsert>
      }
      incident_reports: {
        Row: IncidentReport
        Insert: IncidentReportInsert
        Update: Partial<IncidentReportInsert>
      }
      daily_monitor_rounds: {
        Row: DailyMonitorRound
        Insert: DailyMonitorRoundInsert
        Update: Partial<DailyMonitorRoundInsert>
      }
      clothing_inventory: {
        Row: ClothingInventory
        Insert: ClothingInventoryInsert
        Update: Partial<ClothingInventoryInsert>
      }
      clothing_transactions: {
        Row: ClothingTransaction
        Insert: ClothingTransactionInsert
        Update: Partial<ClothingTransactionInsert>
      }
      visit_records: {
        Row: VisitRecord
        Insert: VisitRecordInsert
        Update: Partial<VisitRecordInsert>
      }
      family_counseling_cases: {
        Row: FamilyCounselingCase
        Insert: FamilyCounselingCaseInsert
        Update: Partial<FamilyCounselingCaseInsert>
      }
      training_referrals: {
        Row: TrainingReferral
        Insert: TrainingReferralInsert
        Update: Partial<TrainingReferralInsert>
      }
      training_evaluations: {
        Row: TrainingEvaluation
        Insert: TrainingEvaluationInsert
        Update: Partial<TrainingEvaluationInsert>
      }
      abuse_reports: {
        Row: AbuseReport
        Insert: AbuseReportInsert
        Update: Partial<AbuseReportInsert>
      }
      activity_advances: {
        Row: ActivityAdvance
        Insert: ActivityAdvanceInsert
        Update: Partial<ActivityAdvanceInsert>
      }
      maintenance_checklists: {
        Row: MaintenanceChecklist
        Insert: MaintenanceChecklistInsert
        Update: Partial<MaintenanceChecklistInsert>
      }
      medical_examinations: {
        Row: MedicalExamination
        Insert: MedicalExaminationInsert
        Update: Partial<MedicalExaminationInsert>
      }
      prescriptions: {
        Row: Prescription
        Insert: PrescriptionInsert
        Update: Partial<PrescriptionInsert>
      }
      clinical_notes: {
        Row: ClinicalNote
        Insert: ClinicalNoteInsert
        Update: Partial<ClinicalNoteInsert>
      }
      lab_orders: {
        Row: LabOrder
        Insert: LabOrderInsert
        Update: Partial<LabOrderInsert>
      }
      multidisciplinary_rounds: {
        Row: MultidisciplinaryRound
        Insert: MultidisciplinaryRoundInsert
        Update: Partial<MultidisciplinaryRoundInsert>
      }
      disease_notifications: {
        Row: DiseaseNotification
        Insert: DiseaseNotificationInsert
        Update: Partial<DiseaseNotificationInsert>
      }
      patient_transfers: {
        Row: PatientTransfer
        Insert: PatientTransferInsert
        Update: Partial<PatientTransferInsert>
      }
      therapy_sessions: {
        Row: TherapySession
        Insert: TherapySessionInsert
        Update: Partial<TherapySessionInsert>
      }
      psych_assessments: {
        Row: PsychAssessment
        Insert: PsychAssessmentInsert
        Update: Partial<PsychAssessmentInsert>
      }
      nursing_assessments: {
        Row: NursingAssessment
        Insert: NursingAssessmentInsert
        Update: Partial<NursingAssessmentInsert>
      }
      vital_sign_charts: {
        Row: VitalSignChart
        Insert: VitalSignChartInsert
        Update: Partial<VitalSignChartInsert>
      }
      epilepsy_tracking: {
        Row: EpilepsyTracking
        Insert: EpilepsyTrackingInsert
        Update: Partial<EpilepsyTrackingInsert>
      }
      menstrual_tracking: {
        Row: MenstrualTracking
        Insert: MenstrualTrackingInsert
        Update: Partial<MenstrualTrackingInsert>
      }
      weight_tracking: {
        Row: WeightTracking
        Insert: WeightTrackingInsert
        Update: Partial<WeightTrackingInsert>
      }
      hygiene_followup: {
        Row: HygieneFollowup
        Insert: HygieneFollowupInsert
        Update: Partial<HygieneFollowupInsert>
      }
      nursing_notes: {
        Row: NursingNote
        Insert: NursingNoteInsert
        Update: Partial<NursingNoteInsert>
      }
      appointments: {
        Row: Appointment
        Insert: AppointmentInsert
        Update: Partial<AppointmentInsert>
      }
      isolation_records: {
        Row: IsolationRecord
        Insert: IsolationRecordInsert
        Update: Partial<IsolationRecordInsert>
      }
      ambulance_checks: {
        Row: AmbulanceCheck
        Insert: AmbulanceCheckInsert
        Update: Partial<AmbulanceCheckInsert>
      }
      dental_records: {
        Row: DentalRecord
        Insert: DentalRecordInsert
        Update: Partial<DentalRecordInsert>
      }
      dental_hygiene_logs: {
        Row: DentalHygieneLog
        Insert: DentalHygieneLogInsert
        Update: Partial<DentalHygieneLogInsert>
      }
      dental_sterilization: {
        Row: DentalSterilization
        Insert: DentalSterilizationInsert
        Update: Partial<DentalSterilizationInsert>
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
  // I-PASS fields (Chapter 6)
  staff_fatigue_index: number | null
  assigned_high_acuity_cases: number | null
  critical_information_flag: boolean | null
  handover_compliance_score: number | null
  illness_severity: 'stable' | 'monitoring' | 'immediate' | null
  action_list: Record<string, unknown>[] | null
  situation_awareness: string | null
  synthesis_confirmed: boolean | null
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

// ===== ICF Assessments =====
export interface IcfAssessment {
  id: string
  beneficiary_id: string
  assessment_date: string
  assessor_id: string
  component: 'b' | 's' | 'd' | 'e'
  icf_code: string
  qualifier: number | null
  capacity_qualifier: number | null
  performance_qualifier: number | null
  qualifier_type: 'facilitator' | 'barrier' | 'neutral' | null
  qualifier_magnitude: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type IcfAssessmentInsert = Omit<IcfAssessment, 'id' | 'created_at' | 'updated_at'>

// ===== Individual Life Plans =====
export interface IndividualLifePlan {
  id: string
  beneficiary_id: string
  plan_period_start: string
  plan_period_end: string
  co_designed_with: string[]
  beneficiary_participated: boolean
  guardian_participated: boolean
  emotional_wellbeing_goals: Record<string, unknown>[]
  interpersonal_relations_goals: Record<string, unknown>[]
  material_wellbeing_goals: Record<string, unknown>[]
  personal_development_goals: Record<string, unknown>[]
  physical_wellbeing_goals: Record<string, unknown>[]
  self_determination_goals: Record<string, unknown>[]
  social_inclusion_goals: Record<string, unknown>[]
  rights_goals: Record<string, unknown>[]
  status: 'active' | 'completed' | 'cancelled' | 'draft'
  review_date: string | null
  created_at: string
  updated_at: string
}

export type IndividualLifePlanInsert = Omit<IndividualLifePlan, 'id' | 'created_at' | 'updated_at'>

// ===== Rights Realization Log =====
export interface RightsRealizationLog {
  id: string
  beneficiary_id: string
  crpd_article: string
  right_domain: string
  status: 'realized' | 'partially_realized' | 'barrier_identified' | 'not_applicable'
  barrier_description: string | null
  action_required: string | null
  logged_by: string | null
  logged_at: string
  created_at: string
}

export type RightsRealizationLogInsert = Omit<RightsRealizationLog, 'id' | 'created_at'>

// ===== Visual Survey Responses =====
export interface VisualSurveyResponse {
  id: string
  beneficiary_id: string
  survey_date: string
  food_rating: number | null
  comfort_rating: number | null
  staff_rating: number | null
  activities_rating: number | null
  overall_mood: 'happy' | 'neutral' | 'sad' | null
  notes: string | null
  recorded_by: string | null
  created_at: string
}

export type VisualSurveyResponseInsert = Omit<VisualSurveyResponse, 'id' | 'created_at'>

// ===== Emergency PEEP Plans =====
export interface EmergencyPeepPlan {
  id: string
  beneficiary_id: string
  evacuation_mobility_level: 'independent' | 'assisted' | 'wheelchair' | 'stretcher' | 'defend_in_place' | null
  alarm_comprehension: 'full' | 'partial' | 'none' | null
  evacuation_method: 'self_evacuate' | 'assisted_walk' | 'evac_chair' | 'stretcher_carry' | 'defend_in_place' | null
  primary_escort: string | null
  secondary_escort: string | null
  primary_route: string | null
  alternative_route: string | null
  special_equipment: string[]
  behavioral_considerations: string | null
  communication_method: string | null
  medical_equipment_needed: string[]
  last_drill_date: string | null
  last_review_date: string | null
  next_review_date: string | null
  status: 'active' | 'needs_review' | 'expired' | 'draft'
  created_at: string
  updated_at: string
}

export type EmergencyPeepPlanInsert = Omit<EmergencyPeepPlan, 'id' | 'created_at' | 'updated_at'>

// ===== Emergency Equipment Readiness =====
export interface EmergencyEquipmentReadiness {
  id: string
  equipment_name: string
  equipment_type: 'evac_chair' | 'fire_extinguisher' | 'first_aid' | 'aed' | 'alarm_system' | 'emergency_lighting' | 'fire_blanket' | 'other'
  location: string
  section: string | null
  last_inspection_date: string | null
  next_inspection_date: string | null
  status: 'operational' | 'needs_maintenance' | 'out_of_service' | 'expired'
  inspector_name: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type EmergencyEquipmentReadinessInsert = Omit<EmergencyEquipmentReadiness, 'id' | 'created_at' | 'updated_at'>

// ===== Staff Wellbeing Scores =====
export interface StaffWellbeingScore {
  id: string
  employee_id: string
  employee_name: string
  assessment_date: string
  mbi_ee_score: number | null
  mbi_dp_score: number | null
  overtime_ratio: number | null
  consecutive_shifts: number | null
  sick_leave_count: number | null
  proqol_burnout_score: number | null
  case_severity_exposure: number | null
  composite_score: number | null
  risk_level: 'green' | 'yellow' | 'orange' | 'red' | null
  intervention_notes: string | null
  created_at: string
}

export type StaffWellbeingScoreInsert = Omit<StaffWellbeingScore, 'id' | 'created_at'>

// ===== Stress Alerts =====
export interface StressAlert {
  id: string
  beneficiary_id: string
  alert_type: 'eda_spike' | 'heart_rate' | 'combined_stress' | 'behavioral' | 'manual'
  severity: 'low' | 'medium' | 'high' | 'critical'
  eda_value: number | null
  hr_value: number | null
  trigger_description: string | null
  status: 'active' | 'acknowledged' | 'resolved'
  acknowledged_by: string | null
  resolved_at: string | null
  created_at: string
}

export type StressAlertInsert = Omit<StressAlert, 'id' | 'created_at'>

// ===== Social Followups (نموذج 13) =====
export interface SocialFollowup {
  id: string
  beneficiary_id: string
  period: string
  assessor_name: string
  clothing_self: 'self' | 'partial' | 'others' | null
  eating_self: 'self' | 'partial' | 'others' | null
  mobility: 'natural' | 'wheelchair_electric' | 'wheelchair_manual' | 'bedridden' | 'with_help' | null
  hygiene: 'self' | 'partial' | 'others' | null
  peer_relations: 'good' | 'partial' | 'unaware' | null
  other_relations: 'good' | 'partial' | 'unaware' | null
  family_cooperation: 'cooperative' | 'partial' | 'uncooperative' | null
  family_bond: 'good' | 'partial' | 'none' | null
  actions_taken: Record<string, unknown>[]
  internal_visits: number
  external_visits: number
  family_calls: number
  social_reports: number
  participates_in_activities: boolean
  activity_types: string[]
  hobbies: string[]
  has_talent: boolean
  talent_description: string | null
  recommendations: string | null
  created_at: string
}

export type SocialFollowupInsert = Omit<SocialFollowup, 'id' | 'created_at'>

// ===== Referrals (نموذج 15) =====
export interface Referral {
  id: string
  beneficiary_id: string
  referral_type: 'internal' | 'external'
  specialty: 'medical' | 'behavioral' | 'training' | null
  urgency: 'urgent_critical' | 'urgent' | 'important' | 'normal' | 'info'
  referred_to_department: string | null
  referred_to_section: string | null
  description: string | null
  current_needs: string | null
  expected_outcomes: string | null
  receiving_opinion: string | null
  intervention_description: string | null
  status: 'pending' | 'in_treatment' | 'needs_plan' | 'team_meeting' | 'resolved'
  specialist_name: string | null
  supervisor_name: string | null
  created_at: string
}

export type ReferralInsert = Omit<Referral, 'id' | 'created_at'>

// ===== Family Notifications (نموذج 16) =====
export interface FamilyNotification {
  id: string
  beneficiary_id: string
  notification_type: 'injury' | 'hospitalization' | 'appointment' | 'death' | 'other'
  notification_detail: string | null
  contact_number: string | null
  contacted_relation: 'father' | 'mother' | 'brother' | 'sister' | 'grandparent' | 'uncle' | 'aunt' | 'other' | null
  contacted_name: string | null
  call_summary: string | null
  notes: string | null
  notified_by: string
  created_at: string
}

export type FamilyNotificationInsert = Omit<FamilyNotification, 'id' | 'created_at'>

// ===== Incident Reports (نموذج 17) =====
export interface IncidentReport {
  id: string
  beneficiary_id: string
  incident_date: string
  incident_time: string | null
  incident_type: 'approved' | 'unapproved' | 'negligence' | 'other'
  incident_type_detail: string | null
  worker_name: string | null
  worker_id: string | null
  worker_statement: string | null
  action_taken_on_worker: string | null
  specialist_opinion: string | null
  social_worker_opinion: string | null
  reported_by: string
  created_at: string
}

export type IncidentReportInsert = Omit<IncidentReport, 'id' | 'created_at'>

// ===== Daily Monitor Rounds (نموذج 22) =====
export interface DailyMonitorRound {
  id: string
  unit_number: string
  round_date: string
  shift: 'morning' | 'evening' | 'night'
  rooms: Record<string, unknown>[]
  monitor_name: string
  supervisor_name: string | null
  general_notes: string | null
  created_at: string
}

export type DailyMonitorRoundInsert = Omit<DailyMonitorRound, 'id' | 'created_at'>

// ===== Clothing Inventory =====
export interface ClothingInventory {
  id: string
  beneficiary_id: string
  season_type: 'summer' | 'winter' | 'eid_fitr' | 'eid_adha'
  fiscal_year: string
  item_name: string
  item_size: string | null
  quantity: number
  condition: 'good' | 'damaged' | 'disposed'
  notes: string | null
  created_at: string
}

export type ClothingInventoryInsert = Omit<ClothingInventory, 'id' | 'created_at'>

// ===== Clothing Transactions =====
export interface ClothingTransaction {
  id: string
  transaction_type: 'purchase' | 'issue' | 'additional_issue' | 'return_damaged' | 'disposal' | 'inventory_count'
  beneficiary_id: string | null
  season_type: 'summer' | 'winter' | 'eid_fitr' | 'eid_adha' | null
  fiscal_year: string | null
  items: Record<string, unknown>[]
  total_cost: number | null
  warehouse_keeper: string | null
  committee_head: string | null
  notes: string | null
  created_at: string
}

export type ClothingTransactionInsert = Omit<ClothingTransaction, 'id' | 'created_at'>

// ===== Visit Records (نماذج 19-21) =====
export interface VisitRecord {
  id: string
  beneficiary_id: string
  visit_type: 'internal' | 'external'
  visit_date: string
  arrival_time: string | null
  departure_time: string | null
  visitor_name: string
  visitor_national_id: string | null
  visitor_relation: 'father' | 'mother' | 'brother' | 'sister' | 'grandparent_m' | 'grandparent_f' | 'uncle_paternal' | 'uncle_maternal' | 'aunt_paternal' | 'aunt_maternal' | 'other' | null
  companion_count: number
  checklist_medical_exam: boolean
  checklist_personal_hygiene: boolean
  checklist_medications_delivered: boolean
  checklist_clothing_sufficient: boolean
  checklist_weight_monitored: boolean
  checklist_medications_given: boolean
  checklist_clothing_returned: boolean
  checklist_care_instructions: boolean
  checklist_diet_followed: boolean
  checklist_hospital_appointments: boolean
  checklist_development_plans: boolean
  family_integration: 'good' | 'partial' | 'poor' | null
  therapy_plan_trained: boolean
  visit_purpose: string | null
  guardian_notes: string | null
  specialist_name: string | null
  monitor_name: string | null
  nurse_name: string | null
  doctor_name: string | null
  created_at: string
}

export type VisitRecordInsert = Omit<VisitRecord, 'id' | 'created_at'>

// ===== Family Counseling Cases (نماذج 25-30) =====
export interface FamilyCounselingCase {
  id: string
  beneficiary_id: string
  referral_date: string
  medical_diagnosis: string | null
  psychological_diagnosis: string | null
  target_plan_duration: '1month' | '3months' | '6months' | '1year' | 'other' | null
  independence_target: string | null
  cognitive_target: string | null
  social_target: string | null
  vocational_target: string | null
  pt_target: string | null
  ot_target: string | null
  speech_target: string | null
  psych_target: string | null
  nutrition_target: string | null
  medical_target: string | null
  beneficiary_engagement: 'engaged' | 'partial' | 'not_engaged' | null
  family_acceptance: string | null
  family_center_communication: string | null
  plan_phases: Record<string, unknown>[]
  aftercare_visits: Record<string, unknown>[]
  housing_type: string | null
  housing_ownership: string | null
  employment_status: string | null
  family_disability_count: number
  disability_in_family_details: string | null
  interview_date: string | null
  interview_location: string | null
  interview_parties: string | null
  interview_duration: string | null
  interview_results: string | null
  satisfaction_score: number | null
  visits_score: number | null
  integration_score: number | null
  programs_score: number | null
  interviews_score: number | null
  initiatives_score: number | null
  status: 'active' | 'completed' | 'closed'
  counselor_name: string | null
  created_at: string
}

export type FamilyCounselingCaseInsert = Omit<FamilyCounselingCase, 'id' | 'created_at'>

// ===== Training Referrals (نموذج 4) =====
export interface TrainingReferral {
  id: string
  beneficiary_id: string
  referral_date: string
  medical_diagnosis: string | null
  psychological_diagnosis: string | null
  assistive_devices: string | null
  referral_goals: string[]
  skills_assessment: Record<string, unknown>
  referred_by: string | null
  received_by: string | null
  supervisor_name: string | null
  created_at: string
}

export type TrainingReferralInsert = Omit<TrainingReferral, 'id' | 'created_at'>

// ===== Training Evaluations (نماذج 7-11) =====
export interface TrainingEvaluation {
  id: string
  beneficiary_id: string
  evaluation_type: 'semi_annual' | 'training_performance' | 'vocational'
  evaluation_date: string
  evaluator_name: string
  sections: Record<string, unknown>[]
  total_score: number | null
  max_total: number | null
  percentage: number | null
  notes: string | null
  created_at: string
}

export type TrainingEvaluationInsert = Omit<TrainingEvaluation, 'id' | 'created_at'>

// ===== Abuse Reports =====
export interface AbuseReport {
  id: string
  beneficiary_id: string
  report_date: string
  report_time: string | null
  abuse_type: 'physical' | 'psychological' | 'neglect' | 'sexual' | 'other'
  severity: 'minor' | 'moderate' | 'severe' | 'critical'
  description: string | null
  location_in_facility: string | null
  perpetrator_type: 'staff' | 'other_resident' | 'visitor' | 'family' | 'unknown' | null
  perpetrator_name: string | null
  immediate_actions: string[]
  medical_examination_done: boolean
  medical_report: string | null
  beneficiary_separated: boolean
  investigation_status: 'reported' | 'investigating' | 'resolved' | 'referred_to_authorities'
  investigator_name: string | null
  investigation_notes: string | null
  follow_up_actions: Record<string, unknown>[]
  authority_notified: boolean
  authority_reference: string | null
  reported_by: string
  witness_names: string[]
  created_at: string
}

export type AbuseReportInsert = Omit<AbuseReport, 'id' | 'created_at'>

// ===== Activity Advances =====
export interface ActivityAdvance {
  id: string
  fiscal_year: string
  advance_type: 'imprest' | 'reimbursement'
  amount_requested: number
  amount_approved: number | null
  amount_spent: number | null
  purpose: string
  budget_line: string | null
  approval_status: 'pending' | 'approved' | 'rejected' | 'settled'
  receipts: Record<string, unknown>[]
  requested_by: string
  approved_by: string | null
  settlement_date: string | null
  settlement_notes: string | null
  created_at: string
}

export type ActivityAdvanceInsert = Omit<ActivityAdvance, 'id' | 'created_at'>

// ===== Maintenance Checklists =====
export interface MaintenanceChecklist {
  id: string
  checklist_code: string | null
  category: 'hvac' | 'electrical' | 'plumbing' | 'fire_safety' | 'elevators' | 'security' | 'cleaning' | 'pest_control' | 'waste' | 'gardens' | 'communications' | 'bms'
  facility_type: 'office' | 'healthcare'
  title_ar: string
  checklist_items: Record<string, unknown>[]
  inspection_date: string
  inspector_name: string
  compliance_percentage: number | null
  status: 'pending' | 'in_progress' | 'completed'
  notes: string | null
  created_at: string
}

export type MaintenanceChecklistInsert = Omit<MaintenanceChecklist, 'id' | 'created_at'>

// ===== Medical Examinations — DR-0001 =====
export interface MedicalExamination {
  id: string
  beneficiary_id: string
  exam_date: string
  exam_time: string | null
  chief_complaint: string | null
  physical_findings: Record<string, unknown>
  vital_signs: Record<string, unknown>
  diagnosis: string | null
  recommendations: string | null
  examiner_name: string
  signature_date: string | null
  created_at: string
}
export type MedicalExaminationInsert = Omit<MedicalExamination, 'id' | 'created_at'>

// ===== Prescriptions — DR-0005 + DR-0007 =====
export interface Prescription {
  id: string
  beneficiary_id: string
  prescription_date: string
  prescription_type: 'medication' | 'standing_orders'
  items: Record<string, unknown>[]
  prescriber_name: string
  pharmacy_notes: string | null
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
}
export type PrescriptionInsert = Omit<Prescription, 'id' | 'created_at'>

// ===== Clinical Notes — DR-0003 + DR-0008 =====
export interface ClinicalNote {
  id: string
  beneficiary_id: string
  note_date: string
  note_time: string | null
  note_type: 'progress' | 'consultation' | 'follow_up' | 'soap'
  discipline: 'doctor' | 'nursing' | 'pt' | 'ot' | 'speech' | 'psychology' | 'social'
  subjective: string | null
  objective: string | null
  assessment: string | null
  plan: string | null
  diagnosis: string | null
  recommendations: string | null
  author_name: string
  author_role: string | null
  created_at: string
}
export type ClinicalNoteInsert = Omit<ClinicalNote, 'id' | 'created_at'>

// ===== Lab Orders — DR-0006 + RN-0013 =====
export interface LabOrder {
  id: string
  beneficiary_id: string
  order_date: string
  tests: Record<string, unknown>[]
  ordered_by: string
  collected_by: string | null
  collection_date: string | null
  status: 'ordered' | 'collected' | 'resulted'
  physician_notified: boolean
  notified_date: string | null
  created_at: string
}
export type LabOrderInsert = Omit<LabOrder, 'id' | 'created_at'>

// ===== Multidisciplinary Rounds — DR-0002 + DR-0004 =====
export interface MultidisciplinaryRound {
  id: string
  beneficiary_id: string
  round_date: string
  round_type: 'planning' | 'review' | 'passport'
  disciplines: Record<string, unknown>[]
  active_diagnoses: string[] | null
  current_medications_summary: string | null
  goals: string | null
  action_items: Record<string, unknown>[]
  coordinator_name: string
  created_at: string
}
export type MultidisciplinaryRoundInsert = Omit<MultidisciplinaryRound, 'id' | 'created_at'>

// ===== Disease Notifications — DR-0013 =====
export interface DiseaseNotification {
  id: string
  beneficiary_id: string
  notification_date: string
  disease_name: string
  onset_date: string | null
  symptoms: string[] | null
  contacts: Record<string, unknown>[]
  authority_notified: boolean
  authority_reference: string | null
  precautions_taken: string[] | null
  notifier_name: string
  created_at: string
}
export type DiseaseNotificationInsert = Omit<DiseaseNotification, 'id' | 'created_at'>

// ===== Patient Transfers — DR-0011 + RN-0018/19 =====
export interface PatientTransfer {
  id: string
  beneficiary_id: string
  transfer_date: string
  transfer_type: 'internal' | 'external'
  from_location: string
  to_location: string
  reason: string | null
  clinical_summary: string | null
  diagnosis: string | null
  medications_at_transfer: Record<string, unknown>[]
  medical_record_attached: boolean
  discharge_diagnosis: string | null
  follow_up_instructions: string | null
  sending_physician: string
  receiving_physician: string | null
  created_at: string
}
export type PatientTransferInsert = Omit<PatientTransfer, 'id' | 'created_at'>

// ===== Therapy Sessions — PT + Speech + Psych =====
export interface TherapySession {
  id: string
  beneficiary_id: string
  session_date: string
  session_time: string | null
  therapy_type: 'physical_therapy' | 'speech_therapy' | 'occupational_therapy' | 'psychology'
  session_type: 'initial_evaluation' | 'follow_up' | 'discharge' | 'soap_note'
  assessment_data: Record<string, unknown>
  goals: string[] | null
  recommendations: string | null
  duration_minutes: number | null
  therapist_name: string
  therapist_role: string | null
  created_at: string
}
export type TherapySessionInsert = Omit<TherapySession, 'id' | 'created_at'>

// ===== Psych Assessments — Psychology Forms #10-15 =====
export interface PsychAssessment {
  id: string
  beneficiary_id: string
  assessment_date: string
  assessment_type: 'comprehensive_exam' | 'treatment_plan' | 'behavior_observation' | 'behavior_modification' | 'progress_review'
  mental_status_exam: Record<string, unknown> | null
  cognitive_assessment: Record<string, unknown> | null
  psychological_testing: Record<string, unknown> | null
  problem_statement: string | null
  short_term_goals: string[] | null
  long_term_goals: string[] | null
  strategies: string[] | null
  timeline: string | null
  behavior_type: string | null
  antecedent: string | null
  consequence: string | null
  frequency: string | null
  intervention_applied: string | null
  result: string | null
  clinical_observations: string | null
  behavioral_improvements: string | null
  goals_progress: Record<string, unknown> | null
  current_challenges: string | null
  therapist_name: string
  review_date: string | null
  status: 'active' | 'completed' | 'reviewed'
  created_at: string
}
export type PsychAssessmentInsert = Omit<PsychAssessment, 'id' | 'created_at'>

// ===== Nursing Assessments — RN-0001 + RN-0009 + RN-0011 =====
export interface NursingAssessment {
  id: string
  beneficiary_id: string
  assessment_date: string
  assessment_type: 'admission' | 'periodic' | 'daily_report'
  chief_complaint: string | null
  medical_history: string | null
  physical_findings: Record<string, unknown>
  vital_signs: Record<string, unknown>
  functional_status: string | null
  daily_activities: string | null
  medication_summary: string | null
  clinical_changes: string | null
  shift_summary: string | null
  assessor_name: string
  assessor_role: string | null
  created_at: string
}
export type NursingAssessmentInsert = Omit<NursingAssessment, 'id' | 'created_at'>

// ===== Vital Sign Charts — RN-0002 + RN-0003 + RN-0007 =====
export interface VitalSignChart {
  id: string
  beneficiary_id: string
  chart_date: string
  chart_type: 'observation' | 'floor' | 'blood_sugar'
  readings: Record<string, unknown>[]
  unit_number: string | null
  shift: string | null
  insulin_dose: string | null
  nurse_name: string
  created_at: string
}
export type VitalSignChartInsert = Omit<VitalSignChart, 'id' | 'created_at'>

// ===== Epilepsy Tracking — RN-0004 + RN-0005 =====
export interface EpilepsyTracking {
  id: string
  beneficiary_id: string
  record_date: string
  record_type: 'follow_up' | 'episode'
  seizure_date: string | null
  seizure_time: string | null
  seizure_type: string | null
  duration_minutes: number | null
  medication_given: string | null
  complications: string | null
  medication_compliance: boolean | null
  seizure_frequency: string | null
  trigger_factors: string[] | null
  nursing_actions: string[] | null
  recorded_by: string
  created_at: string
}
export type EpilepsyTrackingInsert = Omit<EpilepsyTracking, 'id' | 'created_at'>

// ===== Menstrual Tracking — RN-0006 =====
export interface MenstrualTracking {
  id: string
  beneficiary_id: string
  cycle_start_date: string
  cycle_end_date: string | null
  duration_days: number | null
  flow_amount: 'light' | 'normal' | 'heavy' | null
  regularity: 'regular' | 'irregular' | null
  notes: string | null
  recorded_by: string
  created_at: string
}
export type MenstrualTrackingInsert = Omit<MenstrualTracking, 'id' | 'created_at'>

// ===== Weight Tracking — RN-0008 =====
export interface WeightTracking {
  id: string
  beneficiary_id: string
  measurement_date: string
  weight_kg: number
  height_cm: number | null
  bmi: number | null
  notes: string | null
  recorded_by: string
  created_at: string
}
export type WeightTrackingInsert = Omit<WeightTracking, 'id' | 'created_at'>

// ===== Hygiene Followup — RN-0010 =====
export interface HygieneFollowup {
  id: string
  beneficiary_id: string
  followup_date: string
  items: Record<string, unknown>
  overall_independence: 'self' | 'partial' | 'dependent'
  notes: string | null
  recorded_by: string
  created_at: string
}
export type HygieneFollowupInsert = Omit<HygieneFollowup, 'id' | 'created_at'>

// ===== Nursing Notes — RN-0014 =====
export interface NursingNote {
  id: string
  beneficiary_id: string
  note_date: string
  note_time: string | null
  shift: 'morning' | 'evening' | 'night' | null
  narrative_note: string
  patient_condition: string | null
  vital_signs_summary: string | null
  nurse_name: string
  created_at: string
}
export type NursingNoteInsert = Omit<NursingNote, 'id' | 'created_at'>

// ===== Appointments — RN-0015 =====
export interface Appointment {
  id: string
  beneficiary_id: string
  appointment_date: string
  appointment_time: string | null
  department: string | null
  service_type: string | null
  reason: string | null
  confirmation_status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  companion_needed: boolean
  transport_needed: boolean
  notes: string | null
  scheduled_by: string
  created_at: string
}
export type AppointmentInsert = Omit<Appointment, 'id' | 'created_at'>

// ===== Isolation Records — RN-0016 + PC-01/02/03 =====
export interface IsolationRecord {
  id: string
  beneficiary_id: string
  isolation_type: 'infection_control' | 'psychiatric'
  start_date: string
  start_time: string | null
  end_date: string | null
  end_time: string | null
  reason: string
  precautions: string[] | null
  authorization_physician: string | null
  medical_justification: string | null
  observations: Record<string, unknown>[]
  status: 'active' | 'terminated'
  termination_reason: string | null
  duration_hours: number | null
  created_at: string
}
export type IsolationRecordInsert = Omit<IsolationRecord, 'id' | 'created_at'>

// ===== Ambulance Checks — RN-0017 =====
export interface AmbulanceCheck {
  id: string
  check_date: string
  vehicle_id: string
  vehicle_plate: string | null
  equipment_status: Record<string, unknown>[]
  fuel_level: string | null
  mileage: number | null
  safety_items_ok: boolean
  cleanliness_ok: boolean
  inspector_name: string
  created_at: string
}
export type AmbulanceCheckInsert = Omit<AmbulanceCheck, 'id' | 'created_at'>

// ===== Dental Records =====
export interface DentalRecord {
  id: string
  beneficiary_id: string
  record_date: string
  record_type: 'charting' | 'treatment'
  tooth_chart: Record<string, unknown>[]
  ohis_score: number | null
  cpitn_score: number | null
  treatment_phase: 'emergency' | 'preventive' | 'surgical' | 'restorative' | 'prosthetic' | 'follow_up' | null
  treatment_performed: string | null
  tooth_numbers: number[] | null
  materials_used: string | null
  complications: string | null
  dentist_name: string
  created_at: string
}
export type DentalRecordInsert = Omit<DentalRecord, 'id' | 'created_at'>

// ===== Dental Hygiene Logs =====
export interface DentalHygieneLog {
  id: string
  beneficiary_id: string
  log_date: string
  brushing_done: boolean
  brushing_time: 'morning' | 'evening' | 'both' | null
  training_session: boolean
  training_notes: string | null
  oral_health_status: 'good' | 'fair' | 'poor'
  recorded_by: string
  created_at: string
}
export type DentalHygieneLogInsert = Omit<DentalHygieneLog, 'id' | 'created_at'>

// ===== Dental Sterilization =====
export interface DentalSterilization {
  id: string
  log_date: string
  equipment_name: string
  sterilization_method: 'autoclave' | 'chemical' | 'dry_heat'
  cycle_number: number | null
  temperature: number | null
  pressure: number | null
  duration_minutes: number | null
  biological_indicator_result: 'pass' | 'fail' | null
  operator_name: string
  created_at: string
}
export type DentalSterilizationInsert = Omit<DentalSterilization, 'id' | 'created_at'>
