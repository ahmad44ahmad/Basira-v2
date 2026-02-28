import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  Target, TrendingUp, TrendingDown, ArrowLeft, Shield, HeartPulse, Smile, Settings,
  Calculator, Leaf, BarChart3, ChevronDown, ChevronUp, FileText, Minus,
} from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge, Tabs } from '@/components/ui'
import {
  STRATEGIC_KPIS, TREND_MONTHS, KPI_CATEGORY_CONFIG, KPI_STATUS_CONFIG,
  REPORT_TYPE_CONFIG, evaluateKpiStatus, calculateSroi,
  type KpiCategory, type SroiScenario, type StrategicKPI,
} from '../types'

// ── Strategic KPIs Tab ──────────────────────────────────────────

function StrategicSection() {
  const [categoryFilter, setCategoryFilter] = useState<KpiCategory | 'all'>('all')
  const [expandedKpi, setExpandedKpi] = useState<string | null>(null)

  const filtered = useMemo(
    () => categoryFilter === 'all' ? STRATEGIC_KPIS : STRATEGIC_KPIS.filter((k) => k.category === categoryFilter),
    [categoryFilter],
  )

  const statusSummary = useMemo(() => {
    const counts = { excellent: 0, good: 0, needs_improvement: 0, poor: 0 }
    STRATEGIC_KPIS.forEach((k) => { counts[evaluateKpiStatus(k)]++ })
    return counts
  }, [])

  const overallScore = useMemo(() => {
    return Math.round(
      (statusSummary.excellent * 100 + statusSummary.good * 75 + statusSummary.needs_improvement * 50 + statusSummary.poor * 25) / STRATEGIC_KPIS.length,
    )
  }, [statusSummary])

  const categoryIcon = (cat: KpiCategory) => {
    const icons = { care: HeartPulse, safety: Shield, satisfaction: Smile, operations: Settings }
    const Icon = icons[cat]
    return <Icon className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="الأداء العام" value={`${overallScore}%`} subtitle="درجة مركبة" icon={<Target className="h-6 w-6" />} accent="teal" />
        <StatCard title="ممتاز" value={String(statusSummary.excellent)} subtitle="مؤشرات" icon={<TrendingUp className="h-6 w-6" />} accent="success" />
        <StatCard title="يحتاج تحسين" value={String(statusSummary.needs_improvement)} subtitle="مؤشرات" icon={<TrendingDown className="h-6 w-6" />} accent="gold" />
        <StatCard title="ضعيف" value={String(statusSummary.poor)} subtitle="مؤشرات" icon={<TrendingDown className="h-6 w-6" />} accent="danger" />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${categoryFilter === 'all' ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
        >
          الكل ({STRATEGIC_KPIS.length})
        </button>
        {(Object.keys(KPI_CATEGORY_CONFIG) as KpiCategory[]).map((cat) => {
          const cfg = KPI_CATEGORY_CONFIG[cat]
          const count = STRATEGIC_KPIS.filter((k) => k.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${categoryFilter === cat ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              {cfg.emoji} {cfg.label} ({count})
            </button>
          )
        })}
      </div>

      {/* KPI Cards */}
      <AnimatePresence mode="popLayout">
        {filtered.map((kpi) => {
          const status = evaluateKpiStatus(kpi)
          const statusCfg = KPI_STATUS_CONFIG[status]
          const isExpanded = expandedKpi === kpi.code
          const change = kpi.currentValue - kpi.previousValue
          const isImproving = kpi.direction === 'higher_is_better' ? change > 0 : change < 0
          const progressPct = kpi.direction === 'higher_is_better'
            ? Math.min(100, (kpi.currentValue / kpi.target) * 100)
            : Math.min(100, (kpi.target / Math.max(kpi.currentValue, 0.01)) * 100)

          return (
            <motion.div
              key={kpi.code}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="overflow-hidden">
                <button
                  onClick={() => setExpandedKpi(isExpanded ? null : kpi.code)}
                  className="flex w-full items-center justify-between p-4 text-right"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                      {categoryIcon(kpi.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{kpi.nameAr}</h3>
                        <Badge className={statusCfg.color}>{statusCfg.emoji} {statusCfg.label}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{kpi.code} · {KPI_CATEGORY_CONFIG[kpi.category].label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <div className="text-lg font-bold text-slate-900 dark:text-white">
                        {kpi.currentValue}{kpi.unit === '%' ? '%' : ` ${kpi.unitAr}`}
                      </div>
                      <div className={`text-xs ${isImproving ? 'text-emerald-600' : 'text-red-600'}`}>
                        {isImproving ? '↑' : '↓'} {Math.abs(change).toFixed(1)} عن الفترة السابقة
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-slate-100 dark:border-slate-700"
                    >
                      <div className="space-y-4 p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">{kpi.description}</p>

                        {/* Progress to target */}
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-slate-500">
                            <span>التقدم نحو الهدف ({kpi.target}{kpi.unit === '%' ? '%' : ` ${kpi.unitAr}`})</span>
                            <span>{Math.round(progressPct)}%</span>
                          </div>
                          <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPct}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`h-full rounded-full ${status === 'excellent' ? 'bg-emerald-500' : status === 'good' ? 'bg-teal-500' : status === 'needs_improvement' ? 'bg-amber-500' : 'bg-red-500'}`}
                            />
                          </div>
                        </div>

                        {/* Mini trend */}
                        <div>
                          <h4 className="mb-2 text-xs font-medium text-slate-500">الاتجاه (آخر 6 أشهر)</h4>
                          <ResponsiveContainer width="100%" height={48}>
                            <BarChart data={kpi.monthlyTrend.map((v, i) => ({ value: v, month: TREND_MONTHS[i]?.slice(0, 3) ?? '' }))} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                              <Bar dataKey="value" radius={[2, 2, 0, 0]} animationDuration={500}>
                                {kpi.monthlyTrend.map((_, i) => (
                                  <Cell key={i} fill={i === kpi.monthlyTrend.length - 1 ? '#1E6B5C' : '#e2e8f0'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Thresholds */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-900/20">
                            <div className="font-bold text-emerald-700 dark:text-emerald-400">
                              {kpi.direction === 'higher_is_better' ? '≥' : '≤'} {kpi.thresholds.excellent}{kpi.unit === '%' ? '%' : ''}
                            </div>
                            <div className="text-emerald-600 dark:text-emerald-500">ممتاز</div>
                          </div>
                          <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
                            <div className="font-bold text-amber-700 dark:text-amber-400">
                              {kpi.direction === 'higher_is_better' ? '≥' : '≤'} {kpi.thresholds.good}{kpi.unit === '%' ? '%' : ''}
                            </div>
                            <div className="text-amber-600 dark:text-amber-500">جيد</div>
                          </div>
                          <div className="rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                            <div className="font-bold text-red-700 dark:text-red-400">
                              {kpi.direction === 'higher_is_better' ? '<' : '>'} {kpi.thresholds.needsImprovement}{kpi.unit === '%' ? '%' : ''}
                            </div>
                            <div className="text-red-600 dark:text-red-500">ضعيف</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ── SROI Tab ────────────────────────────────────────────────────

function SroiSection() {
  const [scenario, setScenario] = useState<SroiScenario>({
    beneficiaryCount: 310,
    avgCostPerMonth: 12000,
    rehabSuccessRate: 45,
    employmentRate: 15,
    avgSalary: 4000,
  })

  const result = useMemo(() => calculateSroi(scenario), [scenario])

  const fields: { key: keyof SroiScenario; label: string; unit: string; min: number; max: number; step: number }[] = [
    { key: 'beneficiaryCount', label: 'عدد المستفيدين', unit: 'مستفيد', min: 50, max: 1000, step: 10 },
    { key: 'avgCostPerMonth', label: 'متوسط التكلفة الشهرية', unit: 'ريال', min: 5000, max: 30000, step: 500 },
    { key: 'rehabSuccessRate', label: 'نسبة نجاح التأهيل', unit: '%', min: 10, max: 90, step: 5 },
    { key: 'employmentRate', label: 'نسبة التوظيف', unit: '%', min: 5, max: 50, step: 5 },
    { key: 'avgSalary', label: 'متوسط الراتب', unit: 'ريال', min: 2000, max: 10000, step: 500 },
  ]

  return (
    <div className="space-y-6">
      {/* SROI Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-hrsd-teal to-emerald-600 p-6 text-white">
          <div className="text-sm opacity-80">نسبة العائد الاجتماعي</div>
          <div className="mt-1 text-4xl font-bold">{result.ratio}x</div>
          <div className="mt-1 text-xs opacity-70">لكل ريال مستثمر = {result.ratio} ريال قيمة اجتماعية</div>
        </Card>
        <StatCard
          title="الوفورات الشهرية"
          value={`${(result.savings / 1000).toFixed(0)}K`}
          subtitle="ريال سعودي"
          icon={<TrendingUp className="h-6 w-6" />}
          accent="success"
        />
        <StatCard
          title="القيمة الاقتصادية"
          value={`${(result.economicValue / 1000).toFixed(0)}K`}
          subtitle="ريال شهرياً"
          icon={<BarChart3 className="h-6 w-6" />}
          accent="gold"
        />
      </div>

      {/* Scenario Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" /> حاسبة السيناريو
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                {f.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={scenario[f.key]}
                  onChange={(e) => setScenario((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
                  className="flex-1"
                />
                <span className="w-20 text-left text-sm font-bold text-slate-900 dark:text-white">
                  {scenario[f.key].toLocaleString()} {f.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 12-Month Projection Chart */}
      <Card>
        <CardHeader>
          <CardTitle>الإسقاط المالي لـ 12 شهراً</CardTitle>
        </CardHeader>
        <div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={result.projections.filter((_, i) => i % 3 === 0)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} width={40} />
              <Tooltip formatter={(value: number) => [`${(value / 1000).toFixed(0)}K ريال`, '']} />
              <Bar dataKey="traditionalCost" name="التكلفة التقليدية" fill="#f87171" radius={[2, 2, 0, 0]} />
              <Bar dataKey="empowermentCost" name="نموذج التمكين" fill="#2dd4bf" radius={[2, 2, 0, 0]} />
              <Bar dataKey="economicValue" name="القيمة الاقتصادية" fill="#fbbf24" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: '#f87171' }} /> التكلفة التقليدية</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: '#2dd4bf' }} /> نموذج التمكين</span>
            <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: '#fbbf24' }} /> القيمة الاقتصادية</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ── Sustainability Tab ──────────────────────────────────────────

function SustainabilitySection() {
  const impactAreas = [
    {
      title: 'الأثر الاجتماعي',
      metric: 'تحقيق أهداف التأهيل',
      value: '68%',
      icon: Leaf,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      details: [
        { label: 'طبي', total: 45, achieved: 32, rate: 71 },
        { label: 'اجتماعي', total: 38, achieved: 25, rate: 66 },
        { label: 'نفسي', total: 30, achieved: 19, rate: 63 },
        { label: 'علاج طبيعي', total: 28, achieved: 20, rate: 71 },
      ],
    },
    {
      title: 'الكفاءة التشغيلية',
      metric: 'نسبة استغلال الأصول',
      value: '84%',
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      details: [
        { label: 'قيمة الأصول الكلية', total: 1, achieved: 1, rate: 2_450_000 },
        { label: 'الأصول المتضررة', total: 1, achieved: 1, rate: 392_000 },
      ],
    },
    {
      title: 'السلامة المهنية',
      metric: 'معدل الاستجابة للحوادث',
      value: '92%',
      icon: Shield,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      details: [
        { label: 'حوادث مغلقة', total: 24, achieved: 22, rate: 92 },
        { label: 'متوسط وقت الإغلاق', total: 1, achieved: 1, rate: 4.2 },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Impact Highlights */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {impactAreas.map((area) => {
          const Icon = area.icon
          return (
            <motion.div key={area.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={`${area.bg} border-0`}>
                <div className="p-5">
                  <Icon className={`mb-3 h-8 w-8 ${area.color}`} />
                  <h3 className="font-bold text-slate-900 dark:text-white">{area.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{area.metric}</p>
                  <div className={`mt-2 text-3xl font-bold ${area.color}`}>{area.value}</div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* QoL Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>تحسين جودة الحياة — تحليل حسب النوع</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-3 py-2 text-right text-slate-500">النوع</th>
                <th className="px-3 py-2 text-center text-slate-500">إجمالي الأهداف</th>
                <th className="px-3 py-2 text-center text-slate-500">المحققة</th>
                <th className="px-3 py-2 text-center text-slate-500">نسبة النجاح</th>
              </tr>
            </thead>
            <tbody>
              {impactAreas[0].details.map((row) => (
                <tr key={row.label} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">{row.label}</td>
                  <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">{row.total}</td>
                  <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">{row.achieved}</td>
                  <td className="px-3 py-2 text-center">
                    <Badge className={row.rate >= 70 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}>
                      {row.rate}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Financial Governance */}
      <Card>
        <CardHeader>
          <CardTitle>الحوكمة المالية</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500">إجمالي قيمة الأصول</div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">2,450,000 ر.س</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500">نسبة الاستغلال</div>
            <div className="mt-1 text-xl font-bold text-emerald-600">84%</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
            <div className="text-xs text-slate-500">التكلفة اليومية/مستفيد</div>
            <div className="mt-1 text-xl font-bold text-slate-900 dark:text-white">380 ر.س</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ── ISO Compliance Tab ──────────────────────────────────────────

function IsoComplianceSection() {
  const auditFindings = [
    { id: '1', area: 'العيادة الطبية', criterion: 'ISO 9001 — البند 8.5.1', isCompliant: true },
    { id: '2', area: 'التأهيل', criterion: 'ISO 9001 — البند 7.1.6', isCompliant: true },
    { id: '3', area: 'الصيدلية', criterion: 'ISO 9001 — البند 8.5.2', isCompliant: false, severity: 'major' as const, evidence: 'عدم توثيق بعض الأدوية المنتهية' },
    { id: '4', area: 'التغذية', criterion: 'ISO 9001 — البند 8.6', isCompliant: true },
    { id: '5', area: 'الإدارة', criterion: 'ISO 9001 — البند 5.2', isCompliant: true },
    { id: '6', area: 'مكافحة العدوى', criterion: 'ISO 9001 — البند 8.5.3', isCompliant: false, severity: 'minor' as const, evidence: 'نقص في سجلات التعقيم اليومية' },
    { id: '7', area: 'السلامة', criterion: 'ISO 9001 — البند 6.1.1', isCompliant: true },
  ]

  const capaLog = [
    { id: 'CA-001', description: 'توثيق الأدوية المنتهية', action: 'تحديث نظام إدارة المخزون الدوائي', assignedTo: 'د. سارة المحمد', dueDate: '2026-03-15', status: 'in_progress' as const },
    { id: 'CA-002', description: 'سجلات التعقيم', action: 'إنشاء نموذج رقمي للتعقيم اليومي', assignedTo: 'أ. ريم العتيبي', dueDate: '2026-03-10', status: 'open' as const },
    { id: 'CA-003', description: 'تدريب الموظفين على ISO', action: 'عقد ورش عمل تدريبية', assignedTo: 'إدارة الجودة', dueDate: '2026-04-01', status: 'open' as const },
  ]

  const compliantCount = auditFindings.filter((f) => f.isCompliant).length
  const complianceRate = Math.round((compliantCount / auditFindings.length) * 100)
  const nonCompliantCount = auditFindings.length - compliantCount
  const openCapas = capaLog.filter((c) => c.status === 'open').length

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="نسبة الامتثال العام" value={`${complianceRate}%`} subtitle="من البنود المفحوصة" icon={<FileText className="h-6 w-6" />} accent="teal" />
        <StatCard title="حالات عدم المطابقة" value={String(nonCompliantCount)} subtitle="تحتاج معالجة" icon={<TrendingDown className="h-6 w-6" />} accent="danger" />
        <StatCard title="إجراءات تصحيحية مفتوحة" value={String(openCapas)} subtitle="CAPA مفتوح" icon={<Settings className="h-6 w-6" />} accent="gold" />
      </div>

      {/* Audit Findings */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل التدقيق الداخلي</CardTitle>
        </CardHeader>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {auditFindings.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${f.isCompliant ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-red-100 text-red-600 dark:bg-red-900/30'}`}>
                  {f.isCompliant ? '✓' : '✗'}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{f.area}</p>
                  <p className="text-xs text-slate-500">{f.criterion}</p>
                </div>
              </div>
              {!f.isCompliant && f.severity && (
                <Badge className={f.severity === 'major' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'}>
                  {f.severity === 'major' ? 'رئيسي' : 'بسيط'}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* CAPA Log */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الإجراءات التصحيحية (CAPA)</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-3 py-2 text-right text-slate-500">الرمز</th>
                <th className="px-3 py-2 text-right text-slate-500">المشكلة</th>
                <th className="px-3 py-2 text-right text-slate-500">الإجراء</th>
                <th className="px-3 py-2 text-right text-slate-500">المسؤول</th>
                <th className="px-3 py-2 text-center text-slate-500">الموعد</th>
                <th className="px-3 py-2 text-center text-slate-500">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {capaLog.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{c.id}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{c.description}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{c.action}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{c.assignedTo}</td>
                  <td className="px-3 py-2 text-center text-xs text-slate-500">{c.dueDate}</td>
                  <td className="px-3 py-2 text-center">
                    <Badge className={c.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}>
                      {c.status === 'in_progress' ? 'جاري' : 'مفتوح'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────

export function ReportsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="التقارير والتحليلات"
        description="مؤشرات الأداء الاستراتيجية والتقارير المتكاملة"
      />

      <Tabs
        defaultTab="strategic"
        tabs={[
          { id: 'strategic', label: 'المؤشرات الاستراتيجية', icon: <Target className="h-4 w-4" />, content: <StrategicSection /> },
          { id: 'sroi', label: 'العائد الاجتماعي', icon: <BarChart3 className="h-4 w-4" />, content: <SroiSection /> },
          { id: 'iso', label: 'تقرير ISO', icon: <FileText className="h-4 w-4" />, content: <IsoComplianceSection /> },
          { id: 'sustainability', label: 'الاستدامة', icon: <Leaf className="h-4 w-4" />, content: <SustainabilitySection /> },
        ]}
      />
    </div>
  )
}
