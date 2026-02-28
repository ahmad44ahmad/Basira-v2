export type FallRiskLevel = 'low' | 'medium' | 'high'

export type AmbulatoryAid = 'none' | 'crutches' | 'furniture'

export type GaitType = 'normal' | 'weak' | 'impaired'

export type MentalStatus = 'oriented' | 'forgets'

export interface FallRiskFormData {
  beneficiaryId: string
  assessmentDate: string
  historyOfFalls: boolean
  secondaryDiagnosis: boolean
  ambulatoryAid: AmbulatoryAid
  ivTherapy: boolean
  gait: GaitType
  mentalStatus: MentalStatus
}

export interface FallRiskResult {
  riskScore: number
  riskLevel: FallRiskLevel
  preventiveMeasures: string[]
}

/** Morse Fall Scale scoring */
export function calculateFallRisk(data: FallRiskFormData): FallRiskResult {
  let score = 0

  if (data.historyOfFalls) score += 25
  if (data.secondaryDiagnosis) score += 15
  if (data.ambulatoryAid === 'crutches') score += 15
  if (data.ambulatoryAid === 'furniture') score += 30
  if (data.ivTherapy) score += 20
  if (data.gait === 'weak') score += 10
  if (data.gait === 'impaired') score += 20
  if (data.mentalStatus === 'forgets') score += 15

  let riskLevel: FallRiskLevel
  const preventiveMeasures: string[] = []

  if (score > 50) {
    riskLevel = 'high'
    preventiveMeasures.push(
      'سوار تعريفي أصفر',
      'حواجز السرير مرفوعة',
      'مراقبة عند الحمام',
      'تطبيق بروتوكول السقوط',
      'مراجعة الأدوية',
    )
  } else if (score >= 25) {
    riskLevel = 'medium'
    preventiveMeasures.push(
      'الوقاية القياسية',
      'مراجعة الأدوية المؤثرة',
      'إضاءة ليلية',
      'تقييم شهري',
    )
  } else {
    riskLevel = 'low'
    preventiveMeasures.push(
      'رعاية تمريضية أساسية',
      'تقييم كل 3 أشهر',
    )
  }

  return { riskScore: score, riskLevel, preventiveMeasures }
}

export const RISK_LEVEL_CONFIG: Record<FallRiskLevel, { label: string; color: string; bgColor: string }> = {
  low: { label: 'منخفض', color: 'text-emerald-700', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  medium: { label: 'متوسط', color: 'text-amber-700', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  high: { label: 'عالي', color: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-900/30' },
}
