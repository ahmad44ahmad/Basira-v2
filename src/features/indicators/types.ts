// ─── Smart Indicators (المؤشرات الذكية) ─────────────────────────

export type IndicatorStatus = 'critical' | 'warning' | 'good'
export type IndicatorTrend = 'up' | 'down' | 'stable'
export type IndicatorCategory = 'center' | 'ministry' | 'both'
export type IndicatorDomain =
  | 'early_warning'
  | 'biological'
  | 'satisfaction'
  | 'behavioral'
  | 'cost'
  | 'hr'
  | 'benchmark'
  | 'iso_22301'

export interface SmartIndicator {
  id: string
  domain: IndicatorDomain
  titleAr: string
  subtitleAr: string
  mainValue: string
  mainLabel: string
  trend: IndicatorTrend
  trendValue: string
  status: IndicatorStatus
  category: IndicatorCategory
  sparklineData: number[]
  description: string
}

export const INDICATOR_DOMAIN_CONFIG: Record<IndicatorDomain, { label: string; emoji: string; gradient: string }> = {
  early_warning: { label: 'الإنذار المبكر', emoji: '🚨', gradient: 'from-red-500 to-orange-500' },
  biological: { label: 'التدقيق البيولوجي', emoji: '🔬', gradient: 'from-emerald-500 to-teal-500' },
  satisfaction: { label: 'الرضا الآني', emoji: '😊', gradient: 'from-blue-500 to-cyan-500' },
  behavioral: { label: 'التنبؤ السلوكي', emoji: '🧠', gradient: 'from-purple-500 to-violet-500' },
  cost: { label: 'التكلفة/المستفيد', emoji: '💰', gradient: 'from-amber-500 to-yellow-500' },
  hr: { label: 'الموارد البشرية', emoji: '👥', gradient: 'from-sky-500 to-blue-500' },
  benchmark: { label: 'المقارنة المرجعية', emoji: '📊', gradient: 'from-teal-500 to-emerald-500' },
  iso_22301: { label: 'استمرارية الأعمال', emoji: '📋', gradient: 'from-slate-500 to-zinc-500' },
}

export const INDICATOR_STATUS_CONFIG: Record<IndicatorStatus, { label: string; color: string; dot: string }> = {
  critical: { label: 'حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' },
  warning: { label: 'تحذير', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
  good: { label: 'جيد', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
}

export const TREND_CONFIG: Record<IndicatorTrend, { label: string; icon: string; color: string }> = {
  up: { label: 'ارتفاع', icon: '↑', color: 'text-emerald-600 dark:text-emerald-400' },
  down: { label: 'انخفاض', icon: '↓', color: 'text-red-600 dark:text-red-400' },
  stable: { label: 'مستقر', icon: '→', color: 'text-slate-600 dark:text-slate-400' },
}

// ─── Benchmark Standards (المقارنة المرجعية) ────────────────────

export interface BenchmarkStandard {
  indicatorName: string
  indicatorCode: string
  ministryTarget: number
  excellentThreshold: number
  goodThreshold: number
  acceptableThreshold: number
  unit: string
  category: string
  isHigherBetter: boolean
  currentValue: number
}

export type BenchmarkEvaluation = 'excellent' | 'good' | 'acceptable' | 'poor'

export function evaluateBenchmark(std: BenchmarkStandard): BenchmarkEvaluation {
  const v = std.currentValue
  if (std.isHigherBetter) {
    if (v >= std.excellentThreshold) return 'excellent'
    if (v >= std.goodThreshold) return 'good'
    if (v >= std.acceptableThreshold) return 'acceptable'
    return 'poor'
  }
  if (v <= std.excellentThreshold) return 'excellent'
  if (v <= std.goodThreshold) return 'good'
  if (v <= std.acceptableThreshold) return 'acceptable'
  return 'poor'
}

export const BENCHMARK_EVAL_CONFIG: Record<BenchmarkEvaluation, { label: string; color: string; emoji: string }> = {
  excellent: { label: 'ممتاز', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', emoji: '🟢' },
  good: { label: 'جيد', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400', emoji: '🔵' },
  acceptable: { label: 'مقبول', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', emoji: '🟡' },
  poor: { label: 'ضعيف', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', emoji: '🔴' },
}

// ─── HR Impact (أثر الموارد البشرية) ────────────────────────────

export interface DepartmentHrStats {
  department: string
  totalStaff: number
  present: number
  absent: number
  onLeave: number
  attendanceRate: number
  careCompletionRate: number
  impactScore: number
}

// ─── Discrepancy Alert (تنبيه التناقض) ──────────────────────────

export interface DiscrepancyAlert {
  id: string
  date: string
  issue: string
  severity: 'critical' | 'high' | 'medium'
  details: string
  recommendation: string
}

export const ALERT_SEVERITY_CONFIG: Record<'critical' | 'high' | 'medium', { label: string; color: string }> = {
  critical: { label: 'حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  high: { label: 'عالي', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  medium: { label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
}

// ─── Health Score Calculation ───────────────────────────────────

export function calculateOverallHealth(indicators: SmartIndicator[]): number {
  if (indicators.length === 0) return 0
  const score = indicators.reduce((acc, ind) => {
    if (ind.status === 'good') return acc + 100
    if (ind.status === 'warning') return acc + 60
    return acc + 20
  }, 0)
  return Math.round(score / indicators.length)
}
