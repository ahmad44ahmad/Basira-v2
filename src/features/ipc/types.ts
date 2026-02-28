// ─── IPC Inspection (جولة التفتيش اليومية) ──────────────────────

export type InspectionCategory = '5_moments' | 'supplies' | 'ppe' | 'waste' | 'environment'
export type InspectionShift = 'morning' | 'evening' | 'night'

export interface ChecklistItem {
  id: string
  label: string
  category: InspectionCategory
  weight: number
  isCompliant: boolean | null
}

export interface IPCInspection {
  id: string
  date: string
  shift: InspectionShift
  inspector: string
  location: string
  complianceScore: number
  items: ChecklistItem[]
  notes?: string
  followUpRequired: boolean
}

export const INSPECTION_CATEGORY_CONFIG: Record<InspectionCategory, { label: string; emoji: string }> = {
  '5_moments': { label: 'اللحظات الخمس لنظافة الأيدي', emoji: '🤲' },
  supplies: { label: 'المستلزمات', emoji: '📦' },
  ppe: { label: 'معدات الوقاية الشخصية', emoji: '🧤' },
  waste: { label: 'إدارة النفايات', emoji: '🗑️' },
  environment: { label: 'البيئة والتنظيف', emoji: '🧹' },
}

export const SHIFT_CONFIG: Record<InspectionShift, { label: string; emoji: string }> = {
  morning: { label: 'صباحي', emoji: '🌅' },
  evening: { label: 'مسائي', emoji: '🌇' },
  night: { label: 'ليلي', emoji: '🌙' },
}

export const IPC_LOCATIONS = [
  'جناح الذكور أ', 'جناح الذكور ب', 'جناح الإناث أ', 'جناح الإناث ب',
  'العيادة الطبية', 'الصيدلية', 'المطبخ', 'غرفة الغسيل', 'قسم التأهيل',
] as const

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'hh1', label: 'قبل ملامسة المستفيد', category: '5_moments', weight: 5, isCompliant: null },
  { id: 'hh2', label: 'قبل الإجراء المعقم', category: '5_moments', weight: 5, isCompliant: null },
  { id: 'hh3', label: 'بعد التعرض لسوائل الجسم', category: '5_moments', weight: 5, isCompliant: null },
  { id: 'hh4', label: 'بعد ملامسة المستفيد', category: '5_moments', weight: 4, isCompliant: null },
  { id: 'hh5', label: 'بعد ملامسة محيط المستفيد', category: '5_moments', weight: 4, isCompliant: null },
  { id: 'sup1', label: 'توفر صابون سائل ومعقم', category: 'supplies', weight: 3, isCompliant: null },
  { id: 'sup2', label: 'توفر مناشف ورقية', category: 'supplies', weight: 2, isCompliant: null },
  { id: 'sup3', label: 'توفر حاويات نفايات مناسبة', category: 'supplies', weight: 3, isCompliant: null },
  { id: 'ppe1', label: 'توفر قفازات بمقاسات مختلفة', category: 'ppe', weight: 3, isCompliant: null },
  { id: 'ppe2', label: 'توفر كمامات طبية', category: 'ppe', weight: 3, isCompliant: null },
  { id: 'ppe3', label: 'الالتزام بارتداء PPE المناسب', category: 'ppe', weight: 4, isCompliant: null },
  { id: 'wst1', label: 'فصل النفايات حسب اللون', category: 'waste', weight: 4, isCompliant: null },
  { id: 'wst2', label: 'عدم امتلاء الحاويات', category: 'waste', weight: 3, isCompliant: null },
  { id: 'env1', label: 'نظافة الأسطح والأرضيات', category: 'environment', weight: 3, isCompliant: null },
  { id: 'env2', label: 'تطهير الأسطح عالية اللمس', category: 'environment', weight: 4, isCompliant: null },
]

export function calculateComplianceScore(items: ChecklistItem[]): number {
  const assessed = items.filter((i) => i.isCompliant !== null)
  if (assessed.length === 0) return 0
  const totalWeight = assessed.reduce((a, i) => a + i.weight, 0)
  const achievedWeight = assessed.filter((i) => i.isCompliant).reduce((a, i) => a + i.weight, 0)
  return totalWeight > 0 ? Math.round((achievedWeight / totalWeight) * 100) : 0
}

// ─── IPC Incident (حوادث مكافحة العدوى) ─────────────────────────

export type IPCIncidentCategory = 'infection_confirmed' | 'infection_suspected' | 'needle_stick' | 'blood_exposure' | 'outbreak_alert' | 'colonization'
export type IPCIncidentSeverity = 'mild' | 'moderate' | 'severe' | 'critical'
export type IPCIncidentStatus = 'open' | 'investigating' | 'containment' | 'resolved' | 'closed'

export interface IPCIncident {
  id: string
  category: IPCIncidentCategory
  detectionDate: string
  affectedType: 'beneficiary' | 'staff' | 'visitor'
  reportedBy: string
  location: string
  infectionSite?: string
  severity: IPCIncidentSeverity
  status: IPCIncidentStatus
  isolationRequired: boolean
  description: string
  immediateActions?: string
}

export const IPC_INCIDENT_CATEGORY_CONFIG: Record<IPCIncidentCategory, { label: string; emoji: string }> = {
  infection_confirmed: { label: 'عدوى مؤكدة', emoji: '🦠' },
  infection_suspected: { label: 'اشتباه عدوى', emoji: '🔍' },
  needle_stick: { label: 'وخز إبرة', emoji: '💉' },
  blood_exposure: { label: 'تعرض للدم', emoji: '🩸' },
  outbreak_alert: { label: 'تنبيه تفشي', emoji: '🚨' },
  colonization: { label: 'استعمار ميكروبي', emoji: '🧫' },
}

export const IPC_SEVERITY_CONFIG: Record<IPCIncidentSeverity, { label: string; color: string }> = {
  mild: { label: 'خفيف', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  moderate: { label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  severe: { label: 'شديد', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  critical: { label: 'حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

export const IPC_STATUS_CONFIG: Record<IPCIncidentStatus, { label: string; color: string }> = {
  open: { label: 'مفتوح', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  investigating: { label: 'قيد التحقيق', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  containment: { label: 'احتواء', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  resolved: { label: 'تم الحل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  closed: { label: 'مغلق', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
}

export const INFECTION_SITES = ['تنفسي', 'بولي', 'جلدي', 'دم', 'جهاز هضمي', 'عين', 'أذن', 'جرح', 'أخرى'] as const

// ─── Immunization (التحصينات) ───────────────────────────────────

export type ImmunityStatus = 'immune' | 'pending' | 'expired' | 'non_responder' | 'declined'

export interface ImmunizationRecord {
  id: string
  personType: 'beneficiary' | 'staff'
  personName: string
  vaccineCode: string
  vaccineName: string
  doseNumber: number
  totalDoses: number
  dateAdministered: string
  nextDueDate?: string
  immunityStatus: ImmunityStatus
  adverseReaction: boolean
}

export const VACCINE_TYPES = [
  { code: 'HBV', name: 'التهاب الكبد B', totalDoses: 3 },
  { code: 'FLU', name: 'الإنفلونزا', totalDoses: 1 },
  { code: 'COVID', name: 'كوفيد-19', totalDoses: 2 },
  { code: 'TDAP', name: 'الكزاز والدفتيريا', totalDoses: 1 },
  { code: 'MMR', name: 'الحصبة والنكاف والحميراء', totalDoses: 2 },
  { code: 'VAR', name: 'الجدري المائي', totalDoses: 2 },
] as const

export const IMMUNITY_STATUS_CONFIG: Record<ImmunityStatus, { label: string; color: string; emoji: string }> = {
  immune: { label: 'محصّن', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', emoji: '✅' },
  pending: { label: 'قيد الاكتمال', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', emoji: '⏳' },
  expired: { label: 'منتهي', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', emoji: '⚠️' },
  non_responder: { label: 'غير مستجيب', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', emoji: '❓' },
  declined: { label: 'رفض', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', emoji: '🚫' },
}

// ─── Outbreak (إدارة التفشي) ────────────────────────────────────

export type OutbreakSeverity = 'low' | 'moderate' | 'high' | 'critical'
export type ContainmentStatus = 'active' | 'contained' | 'resolved'

export interface Outbreak {
  id: string
  code: string
  pathogen: string
  severity: OutbreakSeverity
  location: string
  staffAffected: number
  beneficiariesAffected: number
  containmentStatus: ContainmentStatus
  mohNotified: boolean
  detectionDate: string
  description?: string
}

export const OUTBREAK_SEVERITY_CONFIG: Record<OutbreakSeverity, { label: string; color: string }> = {
  low: { label: 'منخفض', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  moderate: { label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  high: { label: 'عالي', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  critical: { label: 'حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

export const CONTAINMENT_STATUS_CONFIG: Record<ContainmentStatus, { label: string; color: string; emoji: string }> = {
  active: { label: 'نشط', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', emoji: '🔴' },
  contained: { label: 'محتوى', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', emoji: '🟡' },
  resolved: { label: 'تم الحل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', emoji: '🟢' },
}
