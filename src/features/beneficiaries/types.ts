import type { Beneficiary } from '@/types/database'

/** Smart tag displayed on beneficiary profile */
export interface SmartTag {
  id: string
  label: string
  color: 'red' | 'orange' | 'yellow' | 'blue' | 'green' | 'gray' | 'purple'
  icon?: string
}

/** Risk level calculated from medical + alert data */
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

/** Beneficiary status in Arabic */
export type BeneficiaryStatus = 'نشط' | 'غير نشط' | 'متوفى' | 'مخرج'

/** Section/ward */
export type Section = 'ذكور' | 'إناث' | 'أطفال'

/** Filter state for beneficiary list */
export interface BeneficiaryFilters {
  search: string
  status: BeneficiaryStatus | 'all'
  section: Section | 'all'
  riskLevel: RiskLevel | 'all'
}

/** Unified profile aggregating all related data */
export interface UnifiedBeneficiaryProfile extends Beneficiary {
  smartTags: SmartTag[]
  riskLevel: RiskLevel
  isOrphan: boolean
  hasChronicCondition: boolean
  requiresIsolation: boolean
}

/** Alert tag configuration */
export interface AlertTag {
  id: string
  label: string
  color: string
  bgColor: string
}

export const ALERT_TAGS: Record<string, AlertTag> = {
  epilepsy: { id: 'epilepsy', label: 'صرع', color: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  diabetic: { id: 'diabetic', label: 'سكري', color: 'text-orange-700', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  fallRisk: { id: 'fallRisk', label: 'خطر سقوط', color: 'text-amber-700', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  bedridden: { id: 'bedridden', label: 'طريح فراش', color: 'text-purple-700', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  isolation: { id: 'isolation', label: 'عزل', color: 'text-blue-700', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  orphan: { id: 'orphan', label: 'يتيم', color: 'text-gray-700', bgColor: 'bg-gray-100 dark:bg-gray-900/30' },
}

/** Status config for display */
export const STATUS_CONFIG: Record<BeneficiaryStatus, { label: string; variant: 'success' | 'neutral' | 'danger' | 'warning' }> = {
  'نشط': { label: 'نشط', variant: 'success' },
  'غير نشط': { label: 'غير نشط', variant: 'neutral' },
  'متوفى': { label: 'متوفى', variant: 'danger' },
  'مخرج': { label: 'مخرج', variant: 'warning' },
}
