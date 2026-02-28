import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, ArrowLeft, AlertTriangle, TrendingUp, TrendingDown, Minus, Eye,
  ChevronDown, ChevronUp, BarChart3, Users,
} from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge, Tabs } from '@/components/ui'
import {
  INDICATOR_DOMAIN_CONFIG, INDICATOR_STATUS_CONFIG, TREND_CONFIG, BENCHMARK_EVAL_CONFIG,
  calculateOverallHealth, evaluateBenchmark,
  type SmartIndicator, type IndicatorStatus, type BenchmarkStandard, type DepartmentHrStats, type DiscrepancyAlert,
} from '../types'
import { DEMO_INDICATORS, DEMO_BENCHMARKS, DEMO_HR_STATS, DEMO_ALERTS } from '../api/demo-data'

// ── Health Gauge Component ──────────────────────────────────────

function HealthGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45
  const progress = (score / 100) * circumference
  const color = score >= 70 ? 'rgb(45, 180, 115)' : score >= 50 ? 'rgb(250, 180, 20)' : 'rgb(239, 68, 68)'

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
        <motion.circle
          cx="60" cy="60" r="45" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="55" textAnchor="middle" className="fill-slate-900 text-2xl font-bold dark:fill-white">{score}</text>
        <text x="60" y="72" textAnchor="middle" className="fill-slate-500 text-xs">/100</text>
      </svg>
      <span className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">صحة المركز</span>
    </div>
  )
}

// ── Sparkline Component ─────────────────────────────────────────

function Sparkline({ data, color = 'bg-hrsd-teal' }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <div className="flex items-end gap-px" style={{ height: 32 }}>
      {data.map((v, i) => {
        const h = ((v - min) / range) * 24 + 8
        return (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: h }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className={`flex-1 rounded-t ${i === data.length - 1 ? color : 'bg-slate-200 dark:bg-slate-600'}`}
          />
        )
      })}
    </div>
  )
}

// ── Smart Indicators Grid ───────────────────────────────────────

function IndicatorsGrid() {
  const [statusFilter, setStatusFilter] = useState<IndicatorStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = useMemo(
    () => statusFilter === 'all' ? DEMO_INDICATORS : DEMO_INDICATORS.filter((i) => i.status === statusFilter),
    [statusFilter],
  )

  const health = calculateOverallHealth(DEMO_INDICATORS)
  const counts = useMemo(() => {
    const c = { critical: 0, warning: 0, good: 0 }
    DEMO_INDICATORS.forEach((i) => c[i.status]++)
    return c
  }, [])

  const selected = DEMO_INDICATORS.find((i) => i.id === selectedId)

  return (
    <div className="space-y-6">
      {/* Health Gauge + Summary */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <Card className="flex items-center justify-center p-6 sm:col-span-1">
          <HealthGauge score={health} />
        </Card>
        <div className="grid grid-cols-3 gap-4 sm:col-span-3">
          <StatCard title="مؤشرات نشطة" value={String(DEMO_INDICATORS.length)} subtitle="مؤشر ذكي" icon={<Activity className="h-6 w-6" />} accent="teal" />
          <StatCard title="حرج" value={String(counts.critical)} subtitle="يحتاج تدخل" icon={<AlertTriangle className="h-6 w-6" />} accent="danger" />
          <StatCard title="تحذير" value={String(counts.warning)} subtitle="تحت المراقبة" icon={<Eye className="h-6 w-6" />} accent="gold" />
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${statusFilter === 'all' ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
        >
          الكل ({DEMO_INDICATORS.length})
        </button>
        {(Object.keys(INDICATOR_STATUS_CONFIG) as IndicatorStatus[]).map((s) => {
          const cfg = INDICATOR_STATUS_CONFIG[s]
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${statusFilter === s ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
              {cfg.label} ({counts[s]})
            </button>
          )
        })}
      </div>

      {/* Indicator Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((ind) => {
            const domainCfg = INDICATOR_DOMAIN_CONFIG[ind.domain]
            const statusCfg = INDICATOR_STATUS_CONFIG[ind.status]
            const trendCfg = TREND_CONFIG[ind.trend]
            return (
              <motion.div
                key={ind.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card
                  className="cursor-pointer transition-shadow hover:shadow-lg"
                  onClick={() => setSelectedId(selectedId === ind.id ? null : ind.id)}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${domainCfg.gradient} text-lg text-white`}>
                        {domainCfg.emoji}
                      </div>
                      <Badge className={statusCfg.color}>{statusCfg.label}</Badge>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ind.titleAr}</h3>
                    <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{ind.subtitleAr}</p>

                    {/* Value */}
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{ind.mainValue}</div>
                        <div className="text-xs text-slate-500">{ind.mainLabel}</div>
                      </div>
                      <div className={`flex items-center gap-0.5 text-xs font-medium ${trendCfg.color}`}>
                        {trendCfg.icon} {ind.trendValue}
                      </div>
                    </div>

                    {/* Sparkline */}
                    <Sparkline
                      data={ind.sparklineData}
                      color={ind.status === 'critical' ? 'bg-red-500' : ind.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}
                    />
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-hrsd-teal/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">{INDICATOR_DOMAIN_CONFIG[selected.domain].emoji}</span>
                    {selected.titleAr}
                  </CardTitle>
                  <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-slate-600">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>
              </CardHeader>
              <div className="space-y-3 p-4 pt-0">
                <p className="text-sm text-slate-600 dark:text-slate-400">{selected.description}</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="text-xs text-slate-500">القيمة الحالية</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selected.mainValue}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="text-xs text-slate-500">الاتجاه</div>
                    <div className={`text-lg font-bold ${TREND_CONFIG[selected.trend].color}`}>
                      {TREND_CONFIG[selected.trend].icon} {selected.trendValue}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="text-xs text-slate-500">الحالة</div>
                    <Badge className={INDICATOR_STATUS_CONFIG[selected.status].color}>{INDICATOR_STATUS_CONFIG[selected.status].label}</Badge>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                    <div className="text-xs text-slate-500">النطاق</div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selected.category === 'center' ? 'المركز' : selected.category === 'ministry' ? 'الوزارة' : 'مشترك'}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Benchmark Tab ───────────────────────────────────────────────

function BenchmarkSection() {
  const overallScore = useMemo(() => {
    const results = DEMO_BENCHMARKS.map(evaluateBenchmark)
    const scores = { excellent: 100, good: 75, acceptable: 50, poor: 25 }
    return Math.round(results.reduce((acc, r) => acc + scores[r], 0) / results.length)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="الأداء العام" value={`${overallScore}%`} subtitle="مقارنة بالوزارة" icon={<BarChart3 className="h-6 w-6" />} accent="teal" />
        <StatCard title="ممتاز" value={String(DEMO_BENCHMARKS.filter((b) => evaluateBenchmark(b) === 'excellent').length)} subtitle="مؤشرات" icon={<TrendingUp className="h-6 w-6" />} accent="success" />
        <StatCard title="مقبول" value={String(DEMO_BENCHMARKS.filter((b) => evaluateBenchmark(b) === 'acceptable').length)} subtitle="مؤشرات" icon={<Minus className="h-6 w-6" />} accent="gold" />
        <StatCard title="ضعيف" value={String(DEMO_BENCHMARKS.filter((b) => evaluateBenchmark(b) === 'poor').length)} subtitle="مؤشرات" icon={<TrendingDown className="h-6 w-6" />} accent="danger" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>مقارنة الأداء مع معايير الوزارة</CardTitle>
        </CardHeader>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {DEMO_BENCHMARKS.map((b) => {
            const evalResult = evaluateBenchmark(b)
            const evalCfg = BENCHMARK_EVAL_CONFIG[evalResult]
            const pct = b.isHigherBetter
              ? Math.min(100, (b.currentValue / b.ministryTarget) * 100)
              : Math.min(100, (b.ministryTarget / Math.max(b.currentValue, 0.01)) * 100)

            return (
              <div key={b.indicatorCode} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{b.indicatorName}</h4>
                    <span className="text-xs text-slate-500">{b.category} · الهدف: {b.ministryTarget} {b.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{b.currentValue} {b.unit}</span>
                    <Badge className={evalCfg.color}>{evalCfg.emoji} {evalCfg.label}</Badge>
                  </div>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${evalResult === 'excellent' ? 'bg-emerald-500' : evalResult === 'good' ? 'bg-teal-500' : evalResult === 'acceptable' ? 'bg-amber-500' : 'bg-red-500'}`}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ── HR Impact Tab ───────────────────────────────────────────────

function HrImpactSection() {
  const totalStaff = DEMO_HR_STATS.reduce((a, d) => a + d.totalStaff, 0)
  const totalAbsent = DEMO_HR_STATS.reduce((a, d) => a + d.absent, 0)
  const avgAttendance = Math.round(DEMO_HR_STATS.reduce((a, d) => a + d.attendanceRate, 0) / DEMO_HR_STATS.length)
  const criticalDepts = DEMO_HR_STATS.filter((d) => d.attendanceRate < 85).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="نسبة الحضور" value={`${avgAttendance}%`} subtitle="المتوسط العام" icon={<Users className="h-6 w-6" />} accent="teal" />
        <StatCard title="إجمالي الغياب" value={String(totalAbsent)} subtitle={`من ${totalStaff} موظف`} icon={<AlertTriangle className="h-6 w-6" />} accent="danger" />
        <StatCard title="أقسام حرجة" value={String(criticalDepts)} subtitle="حضور أقل من 85%" icon={<TrendingDown className="h-6 w-6" />} accent="gold" />
        <Card className="flex flex-col items-center justify-center p-4">
          <div className="text-xs text-slate-500">معامل الارتباط</div>
          <div className="text-2xl font-bold text-red-600">-0.78</div>
          <div className="text-center text-[10px] text-slate-400">كلما زاد الغياب انخفضت الجودة</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أداء الأقسام — الحضور مقابل جودة الرعاية</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {DEMO_HR_STATS.map((dept) => (
            <div key={dept.department} className="rounded-lg border border-slate-100 p-3 dark:border-slate-700">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">{dept.department}</h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-500">{dept.present}/{dept.totalStaff} حاضر</span>
                  <Badge className={dept.impactScore >= 70 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : dept.impactScore >= 50 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'}>
                    أثر: {dept.impactScore}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-0.5 flex justify-between text-xs text-slate-500">
                    <span>الحضور</span>
                    <span>{dept.attendanceRate}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.attendanceRate}%` }}
                      className={`h-full rounded-full ${dept.attendanceRate >= 90 ? 'bg-emerald-500' : dept.attendanceRate >= 85 ? 'bg-amber-500' : 'bg-red-500'}`}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-0.5 flex justify-between text-xs text-slate-500">
                    <span>جودة الرعاية</span>
                    <span>{dept.careCompletionRate}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.careCompletionRate}%` }}
                      className={`h-full rounded-full ${dept.careCompletionRate >= 85 ? 'bg-teal-500' : dept.careCompletionRate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── Biological Audit Tab ────────────────────────────────────────

function BiologicalAuditSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="فجوة المخزون" value="-24%" subtitle="فرق غير مفسر" icon={<AlertTriangle className="h-6 w-6" />} accent="danger" />
        <StatCard title="تنبيهات نشطة" value={String(DEMO_ALERTS.length)} subtitle="تحتاج تحقيق" icon={<Activity className="h-6 w-6" />} accent="gold" />
        <StatCard title="المستفيدين المتأثرين" value="12" subtitle="انخفاض هيموجلوبين" icon={<Users className="h-6 w-6" />} accent="teal" />
      </div>

      {/* Trend Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>اتجاه المخزون مقابل المؤشرات الصحية</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'].map((month, i) => {
            const inventory = [400, 420, 430, 445, 450, 460][i]
            const expected = [380, 390, 400, 410, 420, 430][i]
            const weight = [72, 71.5, 71, 70, 69, 68.5][i]
            return (
              <div key={month} className="flex items-center gap-3 text-xs">
                <span className="w-14 text-slate-500">{month}</span>
                <div className="flex flex-1 gap-1">
                  <div className="flex-1">
                    <div className="mb-0.5 text-slate-400">مخزون: {inventory} كجم</div>
                    <div className="h-2 rounded-full bg-red-200 dark:bg-red-900/30">
                      <div className="h-full rounded-full bg-red-500" style={{ width: `${(inventory / 500) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 text-slate-400">متوقع: {expected} كجم</div>
                    <div className="h-2 rounded-full bg-teal-200 dark:bg-teal-900/30">
                      <div className="h-full rounded-full bg-teal-500" style={{ width: `${(expected / 500) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 text-slate-400">وزن: {weight} كجم</div>
                    <div className="h-2 rounded-full bg-amber-200 dark:bg-amber-900/30">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: `${(weight / 80) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>تنبيهات التناقض</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {DEMO_ALERTS.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-lg border-r-4 p-4 ${alert.severity === 'critical' ? 'border-r-red-500 bg-red-50 dark:bg-red-900/10' : alert.severity === 'high' ? 'border-r-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-r-amber-500 bg-amber-50 dark:bg-amber-900/10'}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{alert.issue}</h4>
                <Badge className={alert.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : alert.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}>
                  {alert.severity === 'critical' ? 'حرج' : alert.severity === 'high' ? 'عالي' : 'متوسط'}
                </Badge>
              </div>
              <p className="mb-1 text-xs text-slate-600 dark:text-slate-400">{alert.details}</p>
              <p className="text-xs font-medium text-hrsd-teal dark:text-teal-400">التوصية: {alert.recommendation}</p>
              <span className="mt-1 text-[10px] text-slate-400">{alert.date}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────

export function IndicatorsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="المؤشرات الذكية"
        description="تحليل متقدم بالذكاء الاصطناعي لمراقبة أداء المركز"
      />

      <Tabs
        defaultTab="overview"
        tabs={[
          { id: 'overview', label: 'نظرة عامة', icon: <Activity className="h-4 w-4" />, content: <IndicatorsGrid /> },
          { id: 'benchmark', label: 'المقارنة المرجعية', icon: <BarChart3 className="h-4 w-4" />, content: <BenchmarkSection /> },
          { id: 'hr', label: 'أثر الموارد البشرية', icon: <Users className="h-4 w-4" />, content: <HrImpactSection /> },
          { id: 'biological', label: 'التدقيق البيولوجي', icon: <AlertTriangle className="h-4 w-4" />, content: <BiologicalAuditSection /> },
        ]}
      />
    </div>
  )
}
