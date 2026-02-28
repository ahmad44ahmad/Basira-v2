import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SmilePlus, ClipboardCheck, Wrench, Sparkles, ShieldCheck,
  CheckCircle, XCircle, Thermometer,
} from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Card, Badge, Tabs, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import {
  RECORD_TYPE_CONFIG, TREATMENT_PHASE_CONFIG, ORAL_HEALTH_CONFIG,
  BRUSHING_TIME_CONFIG, STERILIZATION_METHOD_CONFIG, INDICATOR_RESULT_CONFIG,
} from '../types'
import { useDentalRecords, useDentalHygieneLogs, useDentalSterilization } from '../api/dental-queries'

// ── Dental Records Tab ──────────────────────────────────────────

function DentalRecordsSection() {
  const { data: records = [], isLoading, error } = useDentalRecords()
  const [typeFilter, setTypeFilter] = useState<'all' | 'charting' | 'treatment'>('all')
  const [phaseFilter, setPhaseFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    let result = records
    if (typeFilter !== 'all') result = result.filter((r) => r.record_type === typeFilter)
    if (phaseFilter !== 'all') result = result.filter((r) => r.treatment_phase === phaseFilter)
    return result
  }, [records, typeFilter, phaseFilter])

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <EmptyState title="خطأ" description="خطأ في تحميل البيانات" />

  const chartingCount = records.filter((r) => r.record_type === 'charting').length
  const treatmentCount = records.filter((r) => r.record_type === 'treatment').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard title="إجمالي السجلات" value={String(records.length)} subtitle="سجل أسنان" icon={<SmilePlus className="h-6 w-6" />} accent="teal" />
        <StatCard title="تخطيط وتقييم" value={String(chartingCount)} subtitle="سجل" icon={<ClipboardCheck className="h-6 w-6" />} accent="success" />
        <StatCard title="سجلات علاج" value={String(treatmentCount)} subtitle="سجل" icon={<Wrench className="h-6 w-6" />} accent="gold" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'charting', 'treatment'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${typeFilter === t ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
          >
            {t === 'all' ? 'الكل' : RECORD_TYPE_CONFIG[t].label}
          </button>
        ))}
        {typeFilter === 'treatment' && (
          <>
            <span className="self-center text-sm text-slate-400">|</span>
            <button
              onClick={() => setPhaseFilter('all')}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${phaseFilter === 'all' ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              كل المراحل
            </button>
            {(Object.keys(TREATMENT_PHASE_CONFIG) as Array<keyof typeof TREATMENT_PHASE_CONFIG>).map((phase) => {
              const cfg = TREATMENT_PHASE_CONFIG[phase]
              return (
                <button
                  key={phase}
                  onClick={() => setPhaseFilter(phase)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${phaseFilter === phase ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                >
                  {cfg.label}
                </button>
              )
            })}
          </>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="لا توجد سجلات أسنان" description="لم يتم تسجيل أي سجلات أسنان بعد" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-2 text-right text-slate-500">المستفيد</th>
                  <th className="px-3 py-2 text-center text-slate-500">التاريخ</th>
                  <th className="px-3 py-2 text-center text-slate-500">النوع</th>
                  <th className="px-3 py-2 text-center text-slate-500">مرحلة العلاج</th>
                  <th className="px-3 py-2 text-center text-slate-500">طبيب الأسنان</th>
                  <th className="px-3 py-2 text-center text-slate-500">OHIS</th>
                  <th className="px-3 py-2 text-center text-slate-500">CPITN</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((rec) => {
                    const typeCfg = RECORD_TYPE_CONFIG[rec.record_type]
                    const phaseCfg = rec.treatment_phase ? TREATMENT_PHASE_CONFIG[rec.treatment_phase] : null
                    return (
                      <motion.tr
                        key={rec.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-3 py-2">
                          <div className="font-medium text-slate-700 dark:text-slate-300">{rec.beneficiary_id}</div>
                          {rec.treatment_performed && (
                            <div className="text-xs text-slate-400">{rec.treatment_performed}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center text-xs text-slate-500">{rec.record_date}</td>
                        <td className="px-3 py-2 text-center">
                          <Badge className={`${typeCfg.bgColor} ${typeCfg.color}`}>{typeCfg.label}</Badge>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {phaseCfg ? (
                            <Badge className={`${phaseCfg.bgColor} ${phaseCfg.color}`}>{phaseCfg.label}</Badge>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">{rec.dentist_name}</td>
                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">
                          {rec.ohis_score != null ? rec.ohis_score : '—'}
                        </td>
                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">
                          {rec.cpitn_score != null ? rec.cpitn_score : '—'}
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ── Hygiene Tab ─────────────────────────────────────────────────

function HygieneSection() {
  const { data: logs = [], isLoading, error } = useDentalHygieneLogs()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <EmptyState title="خطأ" description="خطأ في تحميل البيانات" />

  const brushingDone = logs.filter((l) => l.brushing_done).length
  const brushingRate = logs.length > 0 ? Math.round((brushingDone / logs.length) * 100) : 0
  const trainingCount = logs.filter((l) => l.training_session).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard title="إجمالي السجلات" value={String(logs.length)} subtitle="سجل نظافة" icon={<Sparkles className="h-6 w-6" />} accent="teal" />
        <StatCard title="نسبة تفريش الأسنان" value={`${brushingRate}%`} subtitle="من الإجمالي" icon={<CheckCircle className="h-6 w-6" />} accent="success" />
        <StatCard title="جلسات التدريب" value={String(trainingCount)} subtitle="جلسة" icon={<ClipboardCheck className="h-6 w-6" />} accent="gold" />
      </div>

      {logs.length === 0 ? (
        <EmptyState title="لا توجد سجلات نظافة" description="لم يتم تسجيل أي سجلات نظافة فم بعد" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-2 text-right text-slate-500">المستفيد</th>
                  <th className="px-3 py-2 text-center text-slate-500">التاريخ</th>
                  <th className="px-3 py-2 text-center text-slate-500">التفريش</th>
                  <th className="px-3 py-2 text-center text-slate-500">وقت التفريش</th>
                  <th className="px-3 py-2 text-center text-slate-500">جلسة تدريب</th>
                  <th className="px-3 py-2 text-center text-slate-500">صحة الفم</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {logs.map((log) => {
                    const healthCfg = ORAL_HEALTH_CONFIG[log.oral_health_status]
                    const timeCfg = log.brushing_time ? BRUSHING_TIME_CONFIG[log.brushing_time] : null
                    return (
                      <motion.tr
                        key={log.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">{log.beneficiary_id}</td>
                        <td className="px-3 py-2 text-center text-xs text-slate-500">{log.log_date}</td>
                        <td className="px-3 py-2 text-center">
                          {log.brushing_done ? (
                            <CheckCircle className="mx-auto h-5 w-5 text-emerald-500" />
                          ) : (
                            <XCircle className="mx-auto h-5 w-5 text-red-400" />
                          )}
                        </td>
                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">
                          {timeCfg ? timeCfg.label : '—'}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {log.training_session ? (
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30">تدريب</Badge>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Badge className={`${healthCfg.bgColor} ${healthCfg.color}`}>{healthCfg.label}</Badge>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ── Sterilization Tab ───────────────────────────────────────────

function SterilizationSection() {
  const { data: records = [], isLoading, error } = useDentalSterilization()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <EmptyState title="خطأ" description="خطأ في تحميل البيانات" />

  const passCount = records.filter((r) => r.biological_indicator_result === 'pass').length
  const passRate = records.length > 0 ? Math.round((passCount / records.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        <StatCard title="إجمالي الفحوصات" value={String(records.length)} subtitle="فحص تعقيم" icon={<ShieldCheck className="h-6 w-6" />} accent="teal" />
        <StatCard title="نسبة النجاح" value={`${passRate}%`} subtitle="من الفحوصات" icon={<Thermometer className="h-6 w-6" />} accent="success" />
      </div>

      {records.length === 0 ? (
        <EmptyState title="لا توجد سجلات تعقيم" description="لم يتم تسجيل أي سجلات تعقيم بعد" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-2 text-right text-slate-500">التاريخ</th>
                  <th className="px-3 py-2 text-right text-slate-500">الجهاز</th>
                  <th className="px-3 py-2 text-center text-slate-500">الطريقة</th>
                  <th className="px-3 py-2 text-center text-slate-500">الحرارة</th>
                  <th className="px-3 py-2 text-center text-slate-500">الضغط</th>
                  <th className="px-3 py-2 text-center text-slate-500">المدة (د)</th>
                  <th className="px-3 py-2 text-center text-slate-500">النتيجة</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {records.map((rec) => {
                    const methodCfg = STERILIZATION_METHOD_CONFIG[rec.sterilization_method]
                    const resultCfg = rec.biological_indicator_result ? INDICATOR_RESULT_CONFIG[rec.biological_indicator_result] : null
                    return (
                      <motion.tr
                        key={rec.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-3 py-2 text-xs text-slate-500">{rec.log_date}</td>
                        <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-300">{rec.equipment_name}</td>
                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">{methodCfg.label}</td>
                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">
                          {rec.temperature != null ? `${rec.temperature} C` : '—'}
                        </td>
                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">
                          {rec.pressure != null ? `${rec.pressure} bar` : '—'}
                        </td>
                        <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">
                          {rec.duration_minutes != null ? rec.duration_minutes : '—'}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {resultCfg ? (
                            <Badge className={`${resultCfg.bgColor} ${resultCfg.color}`}>{resultCfg.label}</Badge>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

// ── Main Dental Page ────────────────────────────────────────────

export function DentalPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="طب الأسنان"
        description="إدارة سجلات الأسنان ونظافة الفم والتعقيم"
      />

      <Tabs
        defaultTab="records"
        tabs={[
          { id: 'records', label: 'سجلات الأسنان', icon: <SmilePlus className="h-4 w-4" />, content: <DentalRecordsSection /> },
          { id: 'hygiene', label: 'نظافة الفم', icon: <Sparkles className="h-4 w-4" />, content: <HygieneSection /> },
          { id: 'sterilization', label: 'التعقيم', icon: <ShieldCheck className="h-4 w-4" />, content: <SterilizationSection /> },
        ]}
      />
    </div>
  )
}
