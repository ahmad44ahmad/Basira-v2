export type MedicationStatus = 'pending' | 'overdue' | 'administered' | 'skipped' | 'refused'

export interface Medication {
  id: string
  name: string
  dosage: string
  route: string
  frequency: string
  scheduledTime: string
  status: MedicationStatus
  beneficiaryName: string
  beneficiaryId: string
  room: string
  preRequirements?: string[]
  allergies?: string[]
  interactions?: string[]
  specialInstructions?: string
  delayMinutes?: number
}

export const STATUS_CONFIG: Record<MedicationStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'قيد الانتظار', color: 'text-blue-700', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  overdue: { label: 'متأخر', color: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  administered: { label: 'تم الإعطاء', color: 'text-emerald-700', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  skipped: { label: 'تم التخطي', color: 'text-yellow-700', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' },
  refused: { label: 'رفض', color: 'text-orange-700', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
}

export const FIVE_RIGHTS = [
  { id: 'patient', label: 'المريض الصحيح', icon: '👤' },
  { id: 'drug', label: 'الدواء الصحيح', icon: '💊' },
  { id: 'dose', label: 'الجرعة الصحيحة', icon: '📏' },
  { id: 'route', label: 'الطريق الصحيح', icon: '💉' },
  { id: 'time', label: 'الوقت الصحيح', icon: '⏰' },
] as const
