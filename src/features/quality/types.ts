// ─── NCR (تقارير عدم المطابقة) ──────────────────────────────────

export type NcrSeverity = 'critical' | 'major' | 'minor' | 'observation'
export type NcrStatus = 'open' | 'investigating' | 'action_planned' | 'in_progress' | 'verification' | 'closed'

export interface NCR {
  id: string
  title: string
  description: string
  isoClause: string
  department: string
  severity: NcrSeverity
  status: NcrStatus
  reportedBy: string
  reportedDate: string
  dueDate: string
  rootCause?: string
  capas: CAPA[]
}

export const NCR_SEVERITY_CONFIG: Record<NcrSeverity, { label: string; color: string; emoji: string }> = {
  critical: { label: 'حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', emoji: '🔴' },
  major: { label: 'رئيسي', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', emoji: '🟠' },
  minor: { label: 'بسيط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', emoji: '🟡' },
  observation: { label: 'ملاحظة', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', emoji: '🔵' },
}

export const NCR_STATUS_CONFIG: Record<NcrStatus, { label: string; color: string }> = {
  open: { label: 'مفتوح', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  investigating: { label: 'تحقيق', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  action_planned: { label: 'خطة إجراء', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  verification: { label: 'تحقق', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
  closed: { label: 'مغلق', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
}

// ─── CAPA (الإجراءات التصحيحية والوقائية) ───────────────────────

export type CapaType = 'corrective' | 'preventive'
export type CapaStatus = 'pending' | 'in_progress' | 'completed' | 'verified'

export interface CAPA {
  id: string
  type: CapaType
  description: string
  assignedTo: string
  dueDate: string
  status: CapaStatus
  completionDate?: string
  evidence?: string
}

export const CAPA_TYPE_CONFIG: Record<CapaType, { label: string; emoji: string }> = {
  corrective: { label: 'تصحيحي', emoji: '🔧' },
  preventive: { label: 'وقائي', emoji: '🛡️' },
}

export const CAPA_STATUS_CONFIG: Record<CapaStatus, { label: string; color: string }> = {
  pending: { label: 'معلق', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  in_progress: { label: 'جاري', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  verified: { label: 'تم التحقق', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
}

// ─── Internal Audit (التدقيق الداخلي) ──────────────────────────

export type AuditStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled'
export type FindingType = 'major_nc' | 'minor_nc' | 'observation' | 'opportunity' | 'strength'

export interface AuditCycle {
  id: string
  cycleName: string
  cycleYear: number
  cycleQuarter: number
  leadAuditor: string
  status: AuditStatus
  plannedStartDate: string
  plannedEndDate: string
  scope?: string
  findings: AuditFinding[]
}

export interface AuditFinding {
  id: string
  findingType: FindingType
  isoClause: string
  department: string
  description: string
  status: 'open' | 'action_planned' | 'in_progress' | 'completed' | 'verified' | 'closed'
  responsiblePerson?: string
  dueDate?: string
  correctiveAction?: string
}

export const FINDING_TYPE_CONFIG: Record<FindingType, { label: string; color: string; emoji: string }> = {
  major_nc: { label: 'عدم مطابقة رئيسي', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', emoji: '🔴' },
  minor_nc: { label: 'عدم مطابقة بسيط', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', emoji: '🟠' },
  observation: { label: 'ملاحظة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', emoji: '🟡' },
  opportunity: { label: 'فرصة تحسين', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', emoji: '💡' },
  strength: { label: 'نقطة قوة', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', emoji: '⭐' },
}

export const AUDIT_STATUS_CONFIG: Record<AuditStatus, { label: string; color: string }> = {
  planned: { label: 'مخطط', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

// ─── OVR (تقرير الانحراف) ───────────────────────────────────────

export type OvrCategory = 'medication_error' | 'fall' | 'behavioral' | 'equipment' | 'other'
export type OvrSeverity = 'near_miss' | 'minor' | 'moderate' | 'major' | 'sentinel'

export interface OvrReport {
  id: string
  incidentDate: string
  description: string
  category: OvrCategory
  severity: OvrSeverity
  isAnonymous: boolean
  reporterName?: string
  status: 'open' | 'investigating' | 'closed'
  justCultureCategory?: 'human_error' | 'at_risk_behavior' | 'reckless_behavior'
  lessonsLearned?: string
}

export const OVR_CATEGORY_CONFIG: Record<OvrCategory, { label: string; emoji: string }> = {
  medication_error: { label: 'خطأ دوائي', emoji: '💊' },
  fall: { label: 'سقوط', emoji: '🦽' },
  behavioral: { label: 'سلوكي', emoji: '⚠️' },
  equipment: { label: 'معدات', emoji: '🔧' },
  other: { label: 'أخرى', emoji: '📋' },
}

export const OVR_SEVERITY_CONFIG: Record<OvrSeverity, { label: string; color: string }> = {
  near_miss: { label: 'وشيك', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  minor: { label: 'بسيط', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  moderate: { label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  major: { label: 'جسيم', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  sentinel: { label: 'حدث جسيم', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

// ─── ISO 9001 Clauses ───────────────────────────────────────────

export const ISO_CLAUSES = [
  { id: '4', label: 'سياق المنظمة' },
  { id: '5', label: 'القيادة' },
  { id: '6', label: 'التخطيط' },
  { id: '7', label: 'الدعم' },
  { id: '8', label: 'العمليات التشغيلية' },
  { id: '9', label: 'تقييم الأداء' },
  { id: '10', label: 'التحسين' },
] as const

export const DEPARTMENTS = [
  'الإدارة العليا', 'الخدمات الطبية', 'الخدمات الاجتماعية', 'خدمات التأهيل',
  'الشؤون الإدارية', 'الخدمات المساندة', 'الإعاشة والتغذية', 'مكافحة العدوى',
  'الصيانة والتشغيل', 'الموارد البشرية',
] as const
