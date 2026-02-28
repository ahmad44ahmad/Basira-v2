// ─── Social Research (بحث اجتماعي) ─────────────────────────────

export interface SocialResearch {
  id: string
  beneficiaryId: string
  beneficiaryName?: string
  researcherName: string
  researchDate: string

  // Guardian (ولي الأمر)
  guardianName?: string
  guardianRelation?: string
  guardianMobile?: string
  guardianProfession?: string
  guardianEducation?: string

  // Family Status (الوضع الأسري)
  isFatherAlive?: 'alive' | 'deceased' | 'unknown'
  isMotherAlive?: 'alive' | 'deceased' | 'unknown'
  familyComposition?: string
  familyAdaptation?: string
  disabilityCause?: string
  hasChronicIllness?: boolean
  chronicIllnessDetails?: string

  // Housing & Economic (السكن والاقتصاد)
  housingType?: 'owned' | 'rented' | 'popular' | 'other'
  economicStatus?: 'good' | 'average' | 'poor'
  incomeDetails?: string

  // Professional Opinion (الرأي المهني)
  socialResearchSummary?: string
  recommendations?: string

  createdAt: string
  updatedAt?: string
}

export const FATHER_MOTHER_STATUS = [
  { value: 'alive', label: 'على قيد الحياة' },
  { value: 'deceased', label: 'متوفى' },
  { value: 'unknown', label: 'مجهول' },
] as const

export const HOUSING_TYPES = [
  { value: 'owned', label: 'ملك' },
  { value: 'rented', label: 'إيجار' },
  { value: 'popular', label: 'شعبي' },
  { value: 'other', label: 'أخرى' },
] as const

export const ECONOMIC_STATUS = [
  { value: 'good', label: 'جيد', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'average', label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'poor', label: 'ضعيف', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
] as const

// ─── Leave Requests (طلبات الإجازات) ────────────────────────────

export type LeaveType = 'home_visit' | 'hospital' | 'event' | 'other'
export type LeaveStatus = 'pending_medical' | 'pending_director' | 'approved' | 'rejected' | 'active' | 'completed' | 'overdue'

export interface LeaveRequest {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  guardianName: string
  guardianContact: string
  reason: string
  status: LeaveStatus
  medicalClearance?: {
    clearedBy: string
    clearedAt: string
    isFit: boolean
    precautions?: string
  }
  history: LeaveHistoryEntry[]
  createdAt: string
  createdBy: string
}

export interface LeaveHistoryEntry {
  action: 'request' | 'medical_clear' | 'approve' | 'reject' | 'return'
  actionBy: string
  role: string
  date: string
  notes?: string
}

export const LEAVE_TYPES = [
  { value: 'home_visit', label: 'زيارة منزلية', emoji: '🏠' },
  { value: 'hospital', label: 'مستشفى', emoji: '🏥' },
  { value: 'event', label: 'حدث', emoji: '🎉' },
  { value: 'other', label: 'أخرى', emoji: '📋' },
] as const

export const LEAVE_STATUS_CONFIG: Record<LeaveStatus, { label: string; color: string }> = {
  pending_medical: { label: 'بانتظار الطبي', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  pending_director: { label: 'بانتظار المدير', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  approved: { label: 'معتمد', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  active: { label: 'خارج المركز', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  completed: { label: 'مكتمل', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  overdue: { label: 'متأخر', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse' },
}

// ─── Activities (أنشطة) ─────────────────────────────────────────

export type ActivityTargetGroup = 'employees' | 'beneficiaries' | 'community' | 'both'
export type ActivityFollowUpStatus = 'achieved' | 'not_achieved'

export interface SocialActivity {
  id: string
  activityName: string
  supervisor: string
  date: string
  targetGroup: ActivityTargetGroup
  location?: string
  objectives?: string
  outcomes?: string
  internalParticipants: number
  externalParticipants: number
  cost?: number
  status: ActivityFollowUpStatus
  images?: string[]
  notes?: string
}

export const TARGET_GROUPS = [
  { value: 'employees', label: 'موظفي المركز', emoji: '👔' },
  { value: 'beneficiaries', label: 'المستفيدين', emoji: '👥' },
  { value: 'community', label: 'المجتمع الخارجي', emoji: '🌍' },
  { value: 'both', label: 'مشترك', emoji: '🤝' },
] as const

export const FOLLOW_UP_STATUS = [
  { value: 'achieved', label: 'تم', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'not_achieved', label: 'لم يتم', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
] as const

// ─── Social Monitoring (المتابعة الاجتماعية) ────────────────────

export const INDEPENDENCE_LEVELS = [
  { value: 'self', label: 'ذاتي', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'partial', label: 'بمساعدة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'others', label: 'يعتمد على الآخرين', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
] as const

export const MOBILITY_TYPES = [
  { value: 'natural', label: 'طبيعي' },
  { value: 'wheelchair_electric', label: 'كرسي كهربائي' },
  { value: 'wheelchair_manual', label: 'كرسي يدوي' },
  { value: 'bedridden', label: 'طريح الفراش' },
  { value: 'with_help', label: 'بمساعدة' },
] as const

export const RELATION_LEVELS = [
  { value: 'good', label: 'جيدة', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'partial', label: 'متوسطة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'unaware', label: 'غير مدرك', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
] as const

export const SHIFT_TYPES = [
  { value: 'morning', label: 'صباحي' },
  { value: 'evening', label: 'مسائي' },
  { value: 'night', label: 'ليلي' },
] as const

// ─── Referrals (التحويلات) ──────────────────────────────────────

export const REFERRAL_TYPES = [
  { value: 'internal', label: 'داخلي' },
  { value: 'external', label: 'خارجي' },
] as const

export const REFERRAL_SPECIALTIES = [
  { value: 'medical', label: 'طبي' },
  { value: 'behavioral', label: 'سلوكي' },
  { value: 'training', label: 'تدريبي' },
] as const

export const URGENCY_LEVELS = [
  { value: 'urgent_critical', label: 'عاجل حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'urgent', label: 'عاجل', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  { value: 'important', label: 'مهم', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'normal', label: 'عادي', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'info', label: 'إعلامي', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
] as const

export const REFERRAL_STATUS_CONFIG = {
  pending: { label: 'قيد الانتظار', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  in_treatment: { label: 'قيد العلاج', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  needs_plan: { label: 'يحتاج خطة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  team_meeting: { label: 'اجتماع فريق', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  resolved: { label: 'تم الحل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
} as const

export const NOTIFICATION_TYPES = [
  { value: 'injury', label: 'إصابة', emoji: '🤕' },
  { value: 'hospitalization', label: 'تنويم', emoji: '🏥' },
  { value: 'appointment', label: 'موعد', emoji: '📅' },
  { value: 'death', label: 'وفاة', emoji: '🕊️' },
  { value: 'other', label: 'أخرى', emoji: '📋' },
] as const

export const INCIDENT_TYPES = [
  { value: 'approved', label: 'مأذون بها' },
  { value: 'unapproved', label: 'غير مأذون بها' },
  { value: 'negligence', label: 'إهمال' },
  { value: 'other', label: 'أخرى' },
] as const

// ─── Clothing (الكسوة) ──────────────────────────────────────────

export const SEASON_TYPES = [
  { value: 'summer', label: 'صيفية' },
  { value: 'winter', label: 'شتوية' },
  { value: 'eid_fitr', label: 'عيد الفطر' },
  { value: 'eid_adha', label: 'عيد الأضحى' },
] as const

export const CLOTHING_CONDITIONS = [
  { value: 'good', label: 'جيدة', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'damaged', label: 'تالفة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'disposed', label: 'مُتلَفة', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
] as const

export const TRANSACTION_TYPES = [
  { value: 'purchase', label: 'شراء', emoji: '🛒' },
  { value: 'issue', label: 'صرف', emoji: '📤' },
  { value: 'additional_issue', label: 'صرف إضافي', emoji: '➕' },
  { value: 'return_damaged', label: 'إرجاع تالف', emoji: '🔄' },
  { value: 'disposal', label: 'إتلاف', emoji: '🗑️' },
  { value: 'inventory_count', label: 'جرد', emoji: '📋' },
] as const

// ─── Activity Advance (السلفة) ──────────────────────────────────

export const ADVANCE_TYPES = [
  { value: 'imprest', label: 'سلفة مستديمة' },
  { value: 'reimbursement', label: 'استرداد' },
] as const

export const ADVANCE_STATUS_CONFIG = {
  pending: { label: 'قيد الانتظار', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  approved: { label: 'معتمد', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  settled: { label: 'تمت التسوية', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
} as const
