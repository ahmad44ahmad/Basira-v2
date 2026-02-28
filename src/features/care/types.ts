export type Shift = 'صباحي' | 'مسائي' | 'ليلي'

export type MobilityStatus = 'active' | 'limited' | 'bedridden'

export type MoodStatus = 'stable' | 'happy' | 'anxious' | 'aggressive' | 'depressed' | 'confused'

export interface DailyCareLogForm {
  beneficiaryId: string
  shift: Shift
  logDate: string
  logTime: string
  // Vitals
  temperature: number | null
  pulse: number | null
  bloodPressureSystolic: number | null
  bloodPressureDiastolic: number | null
  oxygenSaturation: number | null
  bloodSugar: number | null
  weight: number | null
  // Assessment
  mobilityToday: MobilityStatus
  mood: MoodStatus
  // Documentation
  notes: string
  incidents: string
  requiresFollowup: boolean
}

export type HandoverCategory = 'critical' | 'medication' | 'care' | 'pending'

export type HandoverPriority = 'high' | 'medium' | 'low'

export interface ShiftHandoverItem {
  id: string
  category: HandoverCategory
  title: string
  description: string
  beneficiaryId?: string
  beneficiaryName?: string
  priority: HandoverPriority
  shiftType: Shift
  status: 'active' | 'completed'
  createdAt: string
  createdBy: string
}

export interface ShiftSummary {
  shiftType: Shift
  startTime: string
  endTime: string
  staffName: string
  totalBeneficiaries: number
  medicationsGiven: number
  incidentsReported: number
  assessmentsCompleted: number
}

export const SHIFT_CONFIG: Record<Shift, { label: string; time: string; color: string }> = {
  'صباحي': { label: 'الوردية الصباحية', time: '07:00 - 15:00', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'مسائي': { label: 'الوردية المسائية', time: '15:00 - 23:00', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'ليلي': { label: 'الوردية الليلية', time: '23:00 - 07:00', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
}

export const MOBILITY_OPTIONS = [
  { value: 'active', label: 'نشط (مشي مستقل)' },
  { value: 'limited', label: 'محدود (يحتاج مساعدة)' },
  { value: 'bedridden', label: 'طريح فراش' },
] as const

export const MOOD_OPTIONS = [
  { value: 'stable', label: 'مستقر' },
  { value: 'happy', label: 'سعيد' },
  { value: 'anxious', label: 'قلق' },
  { value: 'aggressive', label: 'عدواني' },
  { value: 'depressed', label: 'مكتئب' },
  { value: 'confused', label: 'مشوش' },
] as const

export const CATEGORY_CONFIG: Record<HandoverCategory, { label: string; color: string; emoji: string }> = {
  critical: { label: 'حرج', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', emoji: '🔴' },
  medication: { label: 'أدوية', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', emoji: '💊' },
  care: { label: 'رعاية', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400', emoji: '💗' },
  pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', emoji: '⏱️' },
}

// ===== Nursing Assessment Types =====

export const ASSESSMENT_TYPE_CONFIG = {
  admission: { label: 'تقييم قبول', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  periodic: { label: 'فحص دوري', color: 'text-teal-700 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  daily_report: { label: 'تقرير يومي', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
} as const

export const CHART_TYPE_CONFIG = {
  observation: { label: 'وحدة ملاحظة', color: 'text-purple-700 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  floor: { label: 'جناح', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  blood_sugar: { label: 'سكر الدم', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
} as const

export const EPILEPSY_RECORD_TYPE = {
  follow_up: { label: 'متابعة', color: 'text-teal-700 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  episode: { label: 'نوبة', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
} as const

export const FLOW_AMOUNT_CONFIG = {
  light: { label: 'خفيف', color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  normal: { label: 'طبيعي', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  heavy: { label: 'غزير', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
} as const

export const INDEPENDENCE_CONFIG = {
  self: { label: 'مستقل', color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  partial: { label: 'جزئي', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  dependent: { label: 'معتمد على الغير', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
} as const

export const APPOINTMENT_STATUS_CONFIG = {
  scheduled: { label: 'مجدول', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  confirmed: { label: 'مؤكد', color: 'text-teal-700 dark:text-teal-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
  completed: { label: 'مكتمل', color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  cancelled: { label: 'ملغي', color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-800' },
  no_show: { label: 'لم يحضر', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
} as const

export const ISOLATION_TYPE_CONFIG = {
  infection_control: { label: 'مكافحة عدوى', color: 'text-orange-700 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  psychiatric: { label: 'عزل نفسي', color: 'text-purple-700 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
} as const

export const ISOLATION_STATUS_CONFIG = {
  active: { label: 'نشط', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  terminated: { label: 'منتهي', color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' },
} as const

export const NURSING_SHIFT_CONFIG = {
  morning: { label: 'صباحي', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  evening: { label: 'مسائي', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  night: { label: 'ليلي', color: 'text-purple-700 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
} as const
