// ─── Risk Register (سجل المخاطر) ────────────────────────────────

export type RiskCategory = 'operational' | 'financial' | 'compliance' | 'strategic' | 'reputational' | 'safety'
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
export type RiskStatus = 'identified' | 'analyzing' | 'mitigating' | 'monitoring' | 'closed' | 'escalated'
export type RiskResponse = 'avoid' | 'mitigate' | 'transfer' | 'accept'

export interface Risk {
  id: string
  riskCode: string
  titleAr: string
  description: string
  category: RiskCategory
  likelihood: number
  impact: number
  riskScore: number
  riskLevel: RiskLevel
  riskOwner: string
  department: string
  responseStrategy: RiskResponse
  mitigationAction?: string
  status: RiskStatus
  reviewFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annual'
  nextReviewDate?: string
  lastReviewDate?: string
}

export function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 20) return 'critical'
  if (score >= 12) return 'high'
  if (score >= 6) return 'medium'
  return 'low'
}

export const RISK_CATEGORY_CONFIG: Record<RiskCategory, { label: string; emoji: string }> = {
  operational: { label: 'تشغيلية', emoji: '⚙️' },
  financial: { label: 'مالية', emoji: '💰' },
  compliance: { label: 'امتثال', emoji: '📋' },
  strategic: { label: 'استراتيجية', emoji: '🎯' },
  reputational: { label: 'سمعة', emoji: '🏛️' },
  safety: { label: 'سلامة', emoji: '🛡️' },
}

export const RISK_LEVEL_CONFIG: Record<RiskLevel, { label: string; color: string }> = {
  critical: { label: 'حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  high: { label: 'عالي', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  medium: { label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  low: { label: 'منخفض', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
}

export const RISK_STATUS_CONFIG: Record<RiskStatus, { label: string; color: string }> = {
  identified: { label: 'تم التحديد', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  analyzing: { label: 'قيد التحليل', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  mitigating: { label: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  monitoring: { label: 'تحت المراقبة', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
  closed: { label: 'مغلق', color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500' },
  escalated: { label: 'تم التصعيد', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

export const RISK_RESPONSE_CONFIG: Record<RiskResponse, { label: string; emoji: string }> = {
  avoid: { label: 'تجنب', emoji: '🚫' },
  mitigate: { label: 'تخفيف', emoji: '📉' },
  transfer: { label: 'نقل', emoji: '🔄' },
  accept: { label: 'قبول', emoji: '✅' },
}

export const LIKELIHOOD_LABELS = ['', 'نادر جداً', 'نادر', 'ممكن', 'محتمل', 'مؤكد تقريباً']
export const IMPACT_LABELS = ['', 'ضئيل', 'طفيف', 'متوسط', 'كبير', 'كارثي']

// ─── Compliance (الامتثال) ──────────────────────────────────────

export type ComplianceStatus = 'compliant' | 'partial' | 'non_compliant' | 'pending' | 'not_applicable'

export interface ComplianceRequirement {
  id: string
  requirementCode: string
  titleAr: string
  description?: string
  standardName: string
  section: string
  complianceStatus: ComplianceStatus
  complianceScore: number
  responsibleDepartment: string
  responsiblePerson?: string
  dueDate?: string
  evidenceNotes?: string
  gapDescription?: string
  remediationPlan?: string
  lastAuditDate?: string
}

export const COMPLIANCE_STATUS_CONFIG: Record<ComplianceStatus, { label: string; color: string; emoji: string }> = {
  compliant: { label: 'ممتثل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', emoji: '✅' },
  partial: { label: 'جزئي', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', emoji: '⚠️' },
  non_compliant: { label: 'غير ممتثل', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', emoji: '❌' },
  pending: { label: 'قيد المراجعة', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', emoji: '🔄' },
  not_applicable: { label: 'لا ينطبق', color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500', emoji: '➖' },
}

// ─── Safety (السلامة) ───────────────────────────────────────────

export type SafetyIncidentType = 'injury' | 'near_miss' | 'property_damage' | 'environmental' | 'fire' | 'other'
export type SafetyIncidentSeverity = 'minor' | 'moderate' | 'major' | 'critical' | 'fatal'
export type SafetyIncidentStatus = 'reported' | 'investigating' | 'action_required' | 'closed'

export interface SafetyIncident {
  id: string
  incidentDate: string
  incidentType: SafetyIncidentType
  severity: SafetyIncidentSeverity
  location: string
  description: string
  reportedBy: string
  status: SafetyIncidentStatus
  rootCause?: string
  correctiveActions?: string
  injuries?: number
}

export const SAFETY_INCIDENT_TYPE_CONFIG: Record<SafetyIncidentType, { label: string; emoji: string }> = {
  injury: { label: 'إصابة', emoji: '🤕' },
  near_miss: { label: 'حادث وشيك', emoji: '⚡' },
  property_damage: { label: 'تلف ممتلكات', emoji: '🏚️' },
  environmental: { label: 'بيئي', emoji: '🌿' },
  fire: { label: 'حريق', emoji: '🔥' },
  other: { label: 'أخرى', emoji: '📋' },
}

export const SAFETY_SEVERITY_CONFIG: Record<SafetyIncidentSeverity, { label: string; color: string }> = {
  minor: { label: 'بسيط', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  moderate: { label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  major: { label: 'كبير', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  critical: { label: 'حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  fatal: { label: 'مميت', color: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300' },
}

export const SAFETY_STATUS_CONFIG: Record<SafetyIncidentStatus, { label: string; color: string }> = {
  reported: { label: 'مُبلّغ', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  investigating: { label: 'قيد التحقيق', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  action_required: { label: 'يتطلب إجراء', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  closed: { label: 'مُغلق', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
}
