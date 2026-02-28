// ─── Dental Feature Config Constants ────────────────────────────

export const RECORD_TYPE_CONFIG = {
  charting: { label: 'تخطيط وتقييم', color: 'text-blue-700', bgColor: 'bg-blue-100 dark:bg-blue-900/30', icon: 'ClipboardCheck' },
  treatment: { label: 'سجل علاج', color: 'text-emerald-700', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'Wrench' },
} as const

export const TREATMENT_PHASE_CONFIG = {
  emergency: { label: 'طوارئ', color: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  preventive: { label: 'وقائي', color: 'text-blue-700', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  surgical: { label: 'جراحي', color: 'text-orange-700', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  restorative: { label: 'ترميمي', color: 'text-emerald-700', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  prosthetic: { label: 'تعويضي', color: 'text-purple-700', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  follow_up: { label: 'متابعة', color: 'text-gray-700', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
} as const

export const ORAL_HEALTH_CONFIG = {
  good: { label: 'جيد', color: 'text-emerald-700', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  fair: { label: 'متوسط', color: 'text-amber-700', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  poor: { label: 'ضعيف', color: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-900/30' },
} as const

export const BRUSHING_TIME_CONFIG = {
  morning: { label: 'صباحا' },
  evening: { label: 'مساء' },
  both: { label: 'صباحا ومساء' },
} as const

export const STERILIZATION_METHOD_CONFIG = {
  autoclave: { label: 'أوتوكلاف' },
  chemical: { label: 'كيميائي' },
  dry_heat: { label: 'حرارة جافة' },
} as const

export const INDICATOR_RESULT_CONFIG = {
  pass: { label: 'ناجح', color: 'text-emerald-700', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  fail: { label: 'فاشل', color: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-900/30' },
} as const
