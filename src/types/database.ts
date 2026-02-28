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
  date: string
  occupancy_rate: number | null
  fall_incidents_count: number | null
  care_logs_completion_rate: number | null
  medication_compliance_rate: number | null
  staff_hours_saved: number | null
  paper_forms_eliminated: number | null
  cost_savings: number | null
  created_at: string
}

export type StrategicKPIInsert = Omit<StrategicKPI, 'id' | 'created_at'>

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
