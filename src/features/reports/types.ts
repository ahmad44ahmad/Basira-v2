// ─── Strategic KPI (مؤشرات الأداء الاستراتيجية) ────────────────

export type KpiCategory = 'care' | 'safety' | 'satisfaction' | 'operations'
export type KpiDirection = 'higher_is_better' | 'lower_is_better'
export type KpiThresholdStatus = 'excellent' | 'good' | 'needs_improvement' | 'poor'

export interface StrategicKPI {
  code: string
  nameAr: string
  category: KpiCategory
  categoryAr: string
  target: number
  unit: string
  unitAr: string
  direction: KpiDirection
  thresholds: { excellent: number; good: number; needsImprovement: number }
  currentValue: number
  previousValue: number
  description: string
  monthlyTrend: number[]
}

export function evaluateKpiStatus(kpi: StrategicKPI): KpiThresholdStatus {
  const v = kpi.currentValue
  const higher = kpi.direction === 'higher_is_better'
  if (higher) {
    if (v >= kpi.thresholds.excellent) return 'excellent'
    if (v >= kpi.thresholds.good) return 'good'
    if (v >= kpi.thresholds.needsImprovement) return 'needs_improvement'
    return 'poor'
  }
  if (v <= kpi.thresholds.excellent) return 'excellent'
  if (v <= kpi.thresholds.good) return 'good'
  if (v <= kpi.thresholds.needsImprovement) return 'needs_improvement'
  return 'poor'
}

export const KPI_CATEGORY_CONFIG: Record<KpiCategory, { label: string; color: string; emoji: string }> = {
  care: { label: 'الرعاية', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400', emoji: '❤️' },
  safety: { label: 'السلامة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', emoji: '🛡️' },
  satisfaction: { label: 'الرضا', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', emoji: '😊' },
  operations: { label: 'العمليات', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300', emoji: '⚙️' },
}

export const KPI_STATUS_CONFIG: Record<KpiThresholdStatus, { label: string; color: string; emoji: string }> = {
  excellent: { label: 'ممتاز', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', emoji: '🟢' },
  good: { label: 'جيد', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400', emoji: '🔵' },
  needs_improvement: { label: 'يحتاج تحسين', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', emoji: '🟡' },
  poor: { label: 'ضعيف', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', emoji: '🔴' },
}

// ─── SROI (العائد الاجتماعي على الاستثمار) ───────────────────

export interface SroiScenario {
  beneficiaryCount: number
  avgCostPerMonth: number
  rehabSuccessRate: number
  employmentRate: number
  avgSalary: number
}

export interface SroiProjection {
  month: string
  traditionalCost: number
  empowermentCost: number
  economicValue: number
}

export function calculateSroi(scenario: SroiScenario): { ratio: number; savings: number; economicValue: number; projections: SroiProjection[] } {
  const monthlySavings = (scenario.beneficiaryCount * (scenario.rehabSuccessRate / 100)) * (scenario.avgCostPerMonth * 0.4)
  const monthlyEconomic = (scenario.beneficiaryCount * (scenario.employmentRate / 100)) * scenario.avgSalary
  const totalInvestment = scenario.beneficiaryCount * scenario.avgCostPerMonth
  const ratio = totalInvestment > 0 ? (monthlySavings + monthlyEconomic) / totalInvestment : 0

  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
  const projections = months.map((month, i) => {
    const factor = 1 + i * 0.02
    return {
      month,
      traditionalCost: totalInvestment * factor,
      empowermentCost: totalInvestment * factor - monthlySavings * (i + 1) * 0.1,
      economicValue: monthlyEconomic * (i + 1) * 0.15,
    }
  })

  return { ratio: Math.round(ratio * 10) / 10, savings: monthlySavings, economicValue: monthlyEconomic, projections }
}

// ─── Report Types ───────────────────────────────────────────────

export type ReportType = 'strategic' | 'iso_compliance' | 'sroi' | 'sustainability'
export type ReportStatus = 'draft' | 'final' | 'archived'

export const REPORT_TYPE_CONFIG: Record<ReportType, { label: string; emoji: string; description: string }> = {
  strategic: { label: 'التقرير الاستراتيجي', emoji: '🎯', description: 'مؤشرات الأداء الرئيسية ومتابعة الأهداف' },
  iso_compliance: { label: 'تقرير الامتثال ISO', emoji: '📋', description: 'تقرير الامتثال لمعايير ISO 9001' },
  sroi: { label: 'العائد الاجتماعي', emoji: '📈', description: 'تحليل العائد الاجتماعي على الاستثمار' },
  sustainability: { label: 'تقرير الاستدامة', emoji: '🌿', description: 'الأثر الاجتماعي والكفاءة التشغيلية' },
}

// ─── Strategic KPI Definitions ──────────────────────────────────

export const STRATEGIC_KPIS: StrategicKPI[] = [
  {
    code: 'CARE-COMP', nameAr: 'نسبة إتمام خطة الرعاية', category: 'care', categoryAr: 'الرعاية',
    target: 95, unit: '%', unitAr: 'نسبة مئوية', direction: 'higher_is_better',
    thresholds: { excellent: 95, good: 85, needsImprovement: 75 },
    currentValue: 88, previousValue: 82,
    description: 'نسبة المستفيدين الذين تم إتمام خطط رعايتهم اليومية بالكامل',
    monthlyTrend: [80, 82, 83, 85, 86, 88],
  },
  {
    code: 'FALL-RATE', nameAr: 'معدل السقوط', category: 'safety', categoryAr: 'السلامة',
    target: 2, unit: '/1000', unitAr: 'لكل 1000 يوم', direction: 'lower_is_better',
    thresholds: { excellent: 2, good: 3.5, needsImprovement: 5 },
    currentValue: 3.2, previousValue: 4.5,
    description: 'معدل حالات السقوط لكل 1000 يوم رعاية',
    monthlyTrend: [4.5, 4.2, 3.8, 3.5, 3.3, 3.2],
  },
  {
    code: 'HAND-HYG', nameAr: 'امتثال نظافة الأيدي', category: 'safety', categoryAr: 'السلامة',
    target: 90, unit: '%', unitAr: 'نسبة مئوية', direction: 'higher_is_better',
    thresholds: { excellent: 90, good: 80, needsImprovement: 70 },
    currentValue: 85, previousValue: 78,
    description: 'نسبة امتثال الموظفين لبروتوكول نظافة الأيدي',
    monthlyTrend: [78, 80, 82, 83, 84, 85],
  },
  {
    code: 'ALERT-RESP', nameAr: 'وقت الاستجابة للتنبيه', category: 'care', categoryAr: 'الرعاية',
    target: 15, unit: 'min', unitAr: 'دقيقة', direction: 'lower_is_better',
    thresholds: { excellent: 15, good: 25, needsImprovement: 35 },
    currentValue: 18, previousValue: 22,
    description: 'متوسط وقت الاستجابة للتنبيهات الصحية والأمنية بالدقائق',
    monthlyTrend: [22, 21, 20, 19, 18.5, 18],
  },
  {
    code: 'FAM-SAT', nameAr: 'رضا الأسر', category: 'satisfaction', categoryAr: 'الرضا',
    target: 85, unit: '%', unitAr: 'نسبة مئوية', direction: 'higher_is_better',
    thresholds: { excellent: 85, good: 75, needsImprovement: 65 },
    currentValue: 78, previousValue: 72,
    description: 'نسبة رضا أسر المستفيدين بناءً على الاستبيانات الدورية',
    monthlyTrend: [72, 73, 75, 76, 77, 78],
  },
  {
    code: 'COST-DAY', nameAr: 'التكلفة اليومية/مستفيد', category: 'operations', categoryAr: 'العمليات',
    target: 350, unit: 'SAR', unitAr: 'ريال', direction: 'lower_is_better',
    thresholds: { excellent: 350, good: 400, needsImprovement: 450 },
    currentValue: 380, previousValue: 395,
    description: 'متوسط التكلفة اليومية لكل مستفيد بالريال السعودي',
    monthlyTrend: [395, 390, 388, 385, 382, 380],
  },
  {
    code: 'HANDOVER', nameAr: 'تسليم المناوبة بالوقت', category: 'operations', categoryAr: 'العمليات',
    target: 95, unit: '%', unitAr: 'نسبة مئوية', direction: 'higher_is_better',
    thresholds: { excellent: 95, good: 85, needsImprovement: 75 },
    currentValue: 91, previousValue: 87,
    description: 'نسبة عمليات تسليم المناوبة التي تمت في الوقت المحدد',
    monthlyTrend: [87, 88, 89, 90, 90, 91],
  },
]

// ─── Monthly Trend Labels ───────────────────────────────────────

export const TREND_MONTHS = ['سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر', 'يناير', 'فبراير']
