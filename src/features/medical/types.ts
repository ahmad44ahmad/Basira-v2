export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type VaccinationStatus = 'UpToDate' | 'Overdue' | 'Incomplete' | 'Pending'

export interface VitalSigns {
  temperature: number | null
  bloodPressureSystolic: number | null
  bloodPressureDiastolic: number | null
  pulse: number | null
  respiratoryRate: number | null
  oxygenSaturation: number | null
  bloodSugar: number | null
  weight: number | null
  measuredAt: string
}

export interface CurrentMedication {
  id?: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
}

export interface InfectionStatus {
  suspectedInfection: boolean
  isolationRecommended: boolean
  isolationReason?: string
  vaccinationStatus: VaccinationStatus
  lastVaccinationDate?: string
}

export interface MedicalProfileView {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  bloodType?: BloodType
  isEpileptic: boolean
  latestVitals?: VitalSigns
  currentMedications: CurrentMedication[]
  infectionStatus: InfectionStatus
  chronicDiseases: string[]
  allergies: string[]
  surgeries: string[]
}

export interface MedicalExamination {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  date: string
  doctorName: string
  diagnosis: string
  vitalSigns: {
    bloodPressure: string
    pulse: string
    temperature: string
    respiration: string
  }
  symptoms?: string
  treatment?: string
  physicalExamNotes: string
  recommendations: string
}

export interface MedicalStats {
  totalProfiles: number
  activeCases: number
  pendingVaccinations: number
  isolatedCount: number
  vaccinationRate: number
  medicationCompliance: number
}

// ─── Prescription Config ────────────────────────────────────────

export const PRESCRIPTION_TYPE_CONFIG = {
  medication: { label: 'وصفة دوائية', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  standing_orders: { label: 'أوامر طبية دائمة', color: 'text-purple-700 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
} as const

export const PRESCRIPTION_STATUS_CONFIG = {
  active: { label: 'نشط', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  completed: { label: 'مكتمل', color: 'text-slate-700 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-900/30' },
  cancelled: { label: 'ملغي', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
} as const

// ─── Clinical Note Config ───────────────────────────────────────

export const NOTE_TYPE_CONFIG = {
  progress: { label: 'ملاحظات تقدم', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  consultation: { label: 'استشارة', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  follow_up: { label: 'متابعة', color: 'text-teal-700 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  soap: { label: 'ملاحظة SOAP', color: 'text-purple-700 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
} as const

export const DISCIPLINE_CONFIG = {
  doctor: { label: 'طبيب', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  nursing: { label: 'تمريض', color: 'text-pink-700 dark:text-pink-400', bgColor: 'bg-pink-100 dark:bg-pink-900/30' },
  pt: { label: 'علاج طبيعي', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ot: { label: 'علاج وظيفي', color: 'text-orange-700 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  speech: { label: 'نطق وتخاطب', color: 'text-indigo-700 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  psychology: { label: 'خدمات نفسية', color: 'text-violet-700 dark:text-violet-400', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  social: { label: 'خدمات اجتماعية', color: 'text-cyan-700 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-900/30' },
} as const

// ─── Lab Order Config ───────────────────────────────────────────

export const LAB_STATUS_CONFIG = {
  ordered: { label: 'مطلوب', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  collected: { label: 'تم الجمع', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  resulted: { label: 'وردت النتائج', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
} as const

// ─── MDT Round Config ───────────────────────────────────────────

export const ROUND_TYPE_CONFIG = {
  planning: { label: 'تخطيط', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  review: { label: 'مراجعة', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  passport: { label: 'جواز مسار', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
} as const

// ─── Transfer Config ────────────────────────────────────────────

export const TRANSFER_TYPE_CONFIG = {
  internal: { label: 'داخلي', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  external: { label: 'خارجي', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
} as const

// ─── Therapy Config ─────────────────────────────────────────────

export const THERAPY_TYPE_CONFIG = {
  physical_therapy: { label: 'علاج طبيعي', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  speech_therapy: { label: 'نطق وتخاطب', color: 'text-indigo-700 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  occupational_therapy: { label: 'علاج وظيفي', color: 'text-orange-700 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  psychology: { label: 'خدمات نفسية', color: 'text-violet-700 dark:text-violet-400', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
} as const

export const SESSION_TYPE_CONFIG = {
  initial_evaluation: { label: 'تقييم أولي', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  follow_up: { label: 'متابعة', color: 'text-teal-700 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  discharge: { label: 'خروج', color: 'text-slate-700 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-900/30' },
  soap_note: { label: 'ملاحظة SOAP', color: 'text-purple-700 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
} as const

// ─── Psych Assessment Config ────────────────────────────────────

export const PSYCH_ASSESSMENT_TYPE_CONFIG = {
  comprehensive_exam: { label: 'فحص شامل', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  treatment_plan: { label: 'خطة علاجية', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  behavior_observation: { label: 'ملاحظة سلوك', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  behavior_modification: { label: 'تعديل سلوك', color: 'text-orange-700 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  progress_review: { label: 'مراجعة تقدم', color: 'text-teal-700 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
} as const

export const PSYCH_STATUS_CONFIG = {
  active: { label: 'نشط', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  completed: { label: 'مكتمل', color: 'text-slate-700 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-900/30' },
  reviewed: { label: 'تمت المراجعة', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
} as const
