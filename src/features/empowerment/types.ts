// ─── Dignity File (ملف الكرامة / إحسان) ─────────────────────────

export interface DignityProfile {
  id: string
  beneficiaryId: string
  preferredName?: string
  preferredTitle?: string
  communicationStyle: 'verbal' | 'sign_language' | 'gestures' | 'pictures' | 'mixed'
  personalityType: 'social' | 'introverted' | 'energetic' | 'calm' | 'observer'
  preferredActivities: string[]
  hobbies: string[]
  calmingStrategies: string[]
  motivators: string[]
  favoriteFoods: string[]
  whatMakesMeHappy?: string
  whatMakesMeUpset?: string
  myDreams?: string
  wakeUpTime?: string
  sleepTime?: string
  lastUpdated: string
}

export const PERSONALITY_TYPES = [
  { value: 'social', label: 'اجتماعي', emoji: '🤝' },
  { value: 'introverted', label: 'انطوائي', emoji: '🤫' },
  { value: 'energetic', label: 'نشيط', emoji: '⚡' },
  { value: 'calm', label: 'هادئ', emoji: '😌' },
  { value: 'observer', label: 'مراقب', emoji: '👀' },
] as const

export const COMMUNICATION_STYLES = [
  { value: 'verbal', label: 'لفظي', emoji: '🗣️' },
  { value: 'sign_language', label: 'لغة إشارة', emoji: '🤟' },
  { value: 'gestures', label: 'إيماءات', emoji: '👋' },
  { value: 'pictures', label: 'صور', emoji: '🖼️' },
  { value: 'mixed', label: 'مختلط', emoji: '🔄' },
] as const

export const PRESET_ACTIVITIES = ['القراءة', 'المشي', 'الرسم', 'الموسيقى', 'الحرف اليدوية', 'البستنة', 'مشاهدة التلفاز', 'زيارة الأصدقاء', 'الصلاة', 'التأمل']
export const PRESET_CALMING = ['التنفس العميق', 'الاستماع للقرآن', 'المشي الهادئ', 'التحدث مع شخص مقرب', 'الموسيقى الهادئة', 'العزلة المؤقتة', 'التدليك']
export const PRESET_MOTIVATORS = ['الثناء اللفظي', 'المكافآت الصغيرة', 'النقاط/الجوائز', 'التقدير أمام الآخرين', 'الخروج في نزهة', 'مكالمة العائلة']

// ─── SMART Goals (الأهداف التأهيلية) ────────────────────────────

export type GoalStatus = 'planned' | 'in_progress' | 'achieved' | 'partially_achieved' | 'on_hold' | 'abandoned'
export type GoalDomain = 'medical' | 'physical' | 'occupational' | 'speech' | 'psychological' | 'social' | 'educational' | 'self_care' | 'vocational'
export type MeasurementType = 'numeric' | 'frequency' | 'duration' | 'percentage' | 'milestone' | 'scale'

export interface RehabGoal {
  id: string
  beneficiaryId: string
  beneficiaryName?: string
  domain: GoalDomain
  goalTitle: string
  goalDescription: string
  measurementType: MeasurementType
  measurementUnit?: string
  baselineValue?: number
  targetValue?: number
  currentValue?: number
  qualityOfLifeDimension?: string
  startDate: string
  targetDate: string
  assignedTo?: string
  assignedDepartment?: string
  status: GoalStatus
  progressPercentage: number
  achievementEvidence?: string
  barriersNotes?: string
  familyInvolvement?: string
  createdAt: string
  updatedAt: string
}

export interface GoalProgressLog {
  id: string
  goalId: string
  recordedValue?: number
  previousValue?: number
  progressNote?: string
  sessionType: 'individual' | 'group' | 'home'
  sessionDurationMinutes?: number
  beneficiaryFeedback?: string
  familyFeedback?: string
  recordedBy: string
  recordedAt: string
}

export const REHAB_DOMAINS: { value: GoalDomain; label: string; emoji: string; color: string }[] = [
  { value: 'medical', label: 'طبي/صحي', emoji: '🏥', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'physical', label: 'علاج طبيعي', emoji: '🦿', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'occupational', label: 'علاج وظيفي', emoji: '🤲', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'speech', label: 'نطق وتخاطب', emoji: '🗣️', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400' },
  { value: 'psychological', label: 'نفسي/سلوكي', emoji: '🧠', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { value: 'social', label: 'اجتماعي/دمج', emoji: '👥', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'educational', label: 'تربية خاصة', emoji: '📚', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'self_care', label: 'العناية الذاتية', emoji: '🪥', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
  { value: 'vocational', label: 'تأهيل مهني', emoji: '💼', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
]

export const GOAL_STATUS_CONFIG: Record<GoalStatus, { label: string; color: string }> = {
  planned: { label: 'مخطط', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  achieved: { label: 'مُحقق', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  partially_achieved: { label: 'جزئي', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  on_hold: { label: 'معلق', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  abandoned: { label: 'متروك', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

export const QOL_DIMENSIONS = [
  { value: 'physical_wellbeing', label: 'الرفاه الجسدي' },
  { value: 'emotional_wellbeing', label: 'الرفاه العاطفي' },
  { value: 'social_inclusion', label: 'الاندماج الاجتماعي' },
  { value: 'interpersonal_relations', label: 'العلاقات الشخصية' },
  { value: 'personal_development', label: 'التطور الشخصي' },
  { value: 'self_determination', label: 'تقرير المصير' },
  { value: 'material_wellbeing', label: 'الرفاه المادي' },
  { value: 'rights', label: 'الحقوق' },
] as const

export const MEASUREMENT_TYPES = [
  { value: 'numeric', label: 'قياس رقمي', example: 'مسافة، عدد' },
  { value: 'frequency', label: 'تكرار', example: 'مرات/يوم' },
  { value: 'duration', label: 'مدة', example: 'دقائق، ساعات' },
  { value: 'percentage', label: 'نسبة مئوية', example: '0-100%' },
  { value: 'milestone', label: 'إنجاز محدد', example: 'نعم/لا' },
  { value: 'scale', label: 'مقياس', example: '1-10' },
] as const

export const SESSION_TYPES = [
  { value: 'individual', label: 'فردي', emoji: '👤' },
  { value: 'group', label: 'جماعي', emoji: '👥' },
  { value: 'home', label: 'منزلي', emoji: '🏠' },
] as const
