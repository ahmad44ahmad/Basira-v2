// ─── Visit Management (إدارة الزيارات) ─────────────────────────

export type VisitType = 'internal' | 'behavioral' | 'emergency' | 'external' | 'phone'

export interface Visit {
  id: string
  beneficiaryId: string
  beneficiaryName?: string
  type: VisitType
  date: string
  time: string
  visitorName: string
  relation: string
  notes: string
  employeeName: string
  duration?: number
}

export const VISIT_TYPES: { value: VisitType; label: string; emoji: string; color: string }[] = [
  { value: 'internal', label: 'زيارة عائلية', emoji: '👨‍👩‍👦', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'behavioral', label: 'سلوكية', emoji: '📋', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'emergency', label: 'طارئة', emoji: '🚨', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'external', label: 'خارجية', emoji: '🚗', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'phone', label: 'اتصال هاتفي', emoji: '📞', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
]

// ─── Family Media Feed (البث الإعلامي) ──────────────────────────

export type FeedPostType = 'image' | 'video' | 'milestone'

export interface FeedPost {
  id: string
  type: FeedPostType
  author: {
    name: string
    role: string
    avatar: string
  }
  content: string
  mediaColor?: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
}

export const FEED_TYPE_CONFIG: Record<FeedPostType, { label: string; emoji: string }> = {
  image: { label: 'صورة', emoji: '📸' },
  video: { label: 'فيديو', emoji: '🎥' },
  milestone: { label: 'إنجاز', emoji: '🏆' },
}

// ─── Family Portal ──────────────────────────────────────────────

export interface FamilyMember {
  name: string
  relation: string
  beneficiaryName: string
  lastVisit: string
  nextVisit?: string
}

export interface FamilyUpdate {
  id: string
  type: 'progress' | 'activity' | 'social' | 'health'
  title: string
  description: string
  date: string
}

export const UPDATE_TYPE_CONFIG: Record<FamilyUpdate['type'], { label: string; emoji: string; color: string }> = {
  progress: { label: 'تقدم', emoji: '📈', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  activity: { label: 'نشاط', emoji: '🎨', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  social: { label: 'اجتماعي', emoji: '😊', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  health: { label: 'صحة', emoji: '❤️', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

// ─── Visit Records (سجل الزيارات الشامل) ─────────────────────────

export const VISITOR_RELATIONS = [
  { value: 'father', label: 'الأب' },
  { value: 'mother', label: 'الأم' },
  { value: 'brother', label: 'أخ' },
  { value: 'sister', label: 'أخت' },
  { value: 'grandparent_m', label: 'جد' },
  { value: 'grandparent_f', label: 'جدة' },
  { value: 'uncle_paternal', label: 'عم' },
  { value: 'uncle_maternal', label: 'خال' },
  { value: 'aunt_paternal', label: 'عمة' },
  { value: 'aunt_maternal', label: 'خالة' },
  { value: 'other', label: 'أخرى' },
] as const

export const VISIT_RECORD_TYPES = [
  { value: 'internal', label: 'زيارة داخلية', emoji: '🏠', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'external', label: 'زيارة خارجية', emoji: '🚗', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
] as const

export const FAMILY_INTEGRATION_LEVELS = [
  { value: 'good', label: 'جيد', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'partial', label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'poor', label: 'ضعيف', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
] as const

export const EXTERNAL_VISIT_CHECKLIST = [
  { key: 'checklist_medical_exam', label: 'الفحص الطبي' },
  { key: 'checklist_personal_hygiene', label: 'النظافة الشخصية' },
  { key: 'checklist_medications_delivered', label: 'تسليم الأدوية' },
  { key: 'checklist_clothing_sufficient', label: 'كفاية الملابس' },
  { key: 'checklist_weight_monitored', label: 'متابعة الوزن' },
  { key: 'checklist_medications_given', label: 'إعطاء الأدوية' },
  { key: 'checklist_clothing_returned', label: 'إعادة الملابس' },
  { key: 'checklist_care_instructions', label: 'تعليمات العناية' },
  { key: 'checklist_diet_followed', label: 'اتباع الحمية' },
  { key: 'checklist_hospital_appointments', label: 'مواعيد المستشفى' },
  { key: 'checklist_development_plans', label: 'خطط التطوير' },
] as const

// ─── Family Counseling (الإرشاد الأسري) ────────────────────────

export const PLAN_DURATIONS = [
  { value: '1month', label: 'شهر واحد' },
  { value: '3months', label: '3 أشهر' },
  { value: '6months', label: '6 أشهر' },
  { value: '1year', label: 'سنة' },
  { value: 'other', label: 'أخرى' },
] as const

export const ENGAGEMENT_LEVELS = [
  { value: 'engaged', label: 'متفاعل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'partial', label: 'جزئي', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'not_engaged', label: 'غير متفاعل', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
] as const

export const COUNSELING_STATUS_CONFIG = {
  active: { label: 'نشطة', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  completed: { label: 'مكتملة', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  closed: { label: 'مغلقة', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
} as const
