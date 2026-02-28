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
