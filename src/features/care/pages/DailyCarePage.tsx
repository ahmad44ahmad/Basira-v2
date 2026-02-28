import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  HeartPulse, Save, AlertTriangle, Thermometer, Activity as ActivityIcon,
  Clipboard, Heart, Scale, Calendar, Shield, Truck, Brain, Droplets,
  ShowerHead, FileText, Clock, CheckCircle, XCircle, Eye,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Input, Select, Card, CardHeader, CardTitle, Badge, Spinner, Tabs } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  SHIFT_CONFIG, MOBILITY_OPTIONS, MOOD_OPTIONS,
  ASSESSMENT_TYPE_CONFIG, CHART_TYPE_CONFIG, EPILEPSY_RECORD_TYPE,
  FLOW_AMOUNT_CONFIG, INDEPENDENCE_CONFIG, APPOINTMENT_STATUS_CONFIG,
  ISOLATION_TYPE_CONFIG, ISOLATION_STATUS_CONFIG, NURSING_SHIFT_CONFIG,
  type Shift,
} from '../types'
import { useCreateDailyCareLog } from '../api/care-queries'
import { useBeneficiaryOptions, useBeneficiaries } from '@/features/beneficiaries'
import { useNursingAssessments, useVitalSignCharts, useNursingNotes } from '../api/nursing-queries'
import { useEpilepsyTracking, useMenstrualTracking, useWeightTracking, useHygieneFollowup } from '../api/health-tracking-queries'
import { useAppointments, useIsolationRecords, useAmbulanceChecks } from '../api/scheduling-queries'
import type {
  NursingAssessment, VitalSignChart, NursingNote,
  EpilepsyTracking as EpilepsyTrackingType, MenstrualTracking as MenstrualTrackingType,
  WeightTracking as WeightTrackingType, HygieneFollowup as HygieneFollowupType,
  Appointment, IsolationRecord, AmbulanceCheck,
} from '@/types/database'

// ===== Zod Schema =====

const careLogSchema = z.object({
  beneficiaryId: z.string().min(1, 'اختر المستفيد'),
  shift: z.enum(['صباحي', 'مسائي', 'ليلي']),
  temperature: z.number().min(35).max(42).nullable().optional(),
  pulse: z.number().min(40).max(180).nullable().optional(),
  bloodPressureSystolic: z.number().min(70).max(200).nullable().optional(),
  bloodPressureDiastolic: z.number().min(40).max(130).nullable().optional(),
  oxygenSaturation: z.number().min(70).max(100).nullable().optional(),
  bloodSugar: z.number().min(20).max(600).nullable().optional(),
  weight: z.number().min(10).max(300).nullable().optional(),
  mobilityToday: z.enum(['active', 'limited', 'bedridden']),
  mood: z.enum(['stable', 'happy', 'anxious', 'aggressive', 'depressed', 'confused']),
  notes: z.string().optional(),
  incidents: z.string().optional(),
  requiresFollowup: z.boolean().default(false),
})

type CareLogForm = z.infer<typeof careLogSchema>

function getCurrentShift(): Shift {
  const hour = new Date().getHours()
  if (hour >= 7 && hour < 15) return 'صباحي'
  if (hour >= 15 && hour < 23) return 'مسائي'
  return 'ليلي'
}

// ─── Main Page ──────────────────────────────────────────────────

export function DailyCarePage() {
  const [activeTab, setActiveTab] = useState('daily-care')

  const tabs = [
    { id: 'daily-care', label: 'الرعاية اليومية' },
    { id: 'nursing', label: 'التقييمات التمريضية' },
    { id: 'health-charts', label: 'الرسوم البيانية الصحية' },
    { id: 'followup', label: 'المتابعة والمواعيد' },
    { id: 'isolation', label: 'العزل والإسعاف' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="سجل الرعاية اليومية"
        description="تسجيل الرعاية والتقييمات التمريضية والرسوم البيانية والمتابعة"
        icon={<HeartPulse className="h-5 w-5" />}
      />

      <Tabs
        tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'daily-care' && <DailyCareFormSection />}
        {activeTab === 'nursing' && <NursingSection />}
        {activeTab === 'health-charts' && <HealthChartsSection />}
        {activeTab === 'followup' && <FollowupSection />}
        {activeTab === 'isolation' && <IsolationSection />}
      </div>
    </div>
  )
}

// ─── Tab 1: Daily Care Form (existing) ──────────────────────────

function DailyCareFormSection() {
  const { isLoading, error } = useBeneficiaries()
  const beneficiaryOptions = useBeneficiaryOptions()
  const createLog = useCreateDailyCareLog()
  const currentShift = getCurrentShift()
  const shiftInfo = SHIFT_CONFIG[currentShift]

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CareLogForm>({
    resolver: zodResolver(careLogSchema),
    defaultValues: {
      shift: currentShift,
      mobilityToday: 'active',
      mood: 'stable',
      requiresFollowup: false,
    },
  })

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (beneficiaryOptions.length === 0) return <EmptyState title="لا توجد بيانات" description="لا يوجد مستفيدون نشطون لتسجيل الرعاية اليومية لهم" />

  const temp = watch('temperature')
  const systolic = watch('bloodPressureSystolic')
  const hasAbnormalVitals = (temp && (temp < 36 || temp > 37.5)) || (systolic && (systolic > 140 || systolic < 90))

  const onSubmit = async (data: CareLogForm) => {
    try {
      await createLog.mutateAsync({
        beneficiary_id: data.beneficiaryId,
        shift: data.shift,
        shift_date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
        temperature: data.temperature ?? null,
        pulse: data.pulse ?? null,
        blood_pressure_systolic: data.bloodPressureSystolic ?? null,
        blood_pressure_diastolic: data.bloodPressureDiastolic ?? null,
        oxygen_saturation: data.oxygenSaturation ?? null,
        blood_sugar: data.bloodSugar ?? null,
        meals: null,
        medications: null,
        care_activities: null,
        incidents: data.incidents || null,
        mood: data.mood,
        sleep_quality: null,
        notes: data.notes || null,
        recorded_by: 'المستخدم الحالي',
      })
      toast.success('تم حفظ سجل الرعاية بنجاح')
    } catch (err) {
      console.error(err)
      toast.error('فشل حفظ سجل الرعاية')
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Badge className={shiftInfo.color}>
          {shiftInfo.label} ({shiftInfo.time})
        </Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Beneficiary + Shift */}
        <Card>
          <CardHeader><CardTitle>معلومات أساسية</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="المستفيد"
              placeholder="اختر المستفيد..."
              options={beneficiaryOptions}
              {...register('beneficiaryId')}
              error={errors.beneficiaryId?.message}
            />
            <Select
              label="الوردية"
              options={[
                { value: 'صباحي', label: 'صباحي (07:00 - 15:00)' },
                { value: 'مسائي', label: 'مسائي (15:00 - 23:00)' },
                { value: 'ليلي', label: 'ليلي (23:00 - 07:00)' },
              ]}
              {...register('shift')}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">التاريخ والوقت</label>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {new Date().toLocaleDateString('ar-SA')} — {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-teal" />
              العلامات الحيوية
            </CardTitle>
          </CardHeader>

          {hasAbnormalVitals && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <span className="text-sm font-medium text-danger">تم رصد قراءات غير طبيعية — يُرجى التوثيق في الملاحظات</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <Input label="الحرارة (°C)" type="number" step="0.1" placeholder="36.5" min="35" max="42" {...register('temperature', { valueAsNumber: true })} error={errors.temperature?.message} />
            <Input label="النبض (BPM)" type="number" placeholder="72" min="40" max="180" {...register('pulse', { valueAsNumber: true })} error={errors.pulse?.message} />
            <Input label="الضغط الانقباضي" type="number" placeholder="120" min="70" max="200" {...register('bloodPressureSystolic', { valueAsNumber: true })} error={errors.bloodPressureSystolic?.message} />
            <Input label="الضغط الانبساطي" type="number" placeholder="80" min="40" max="130" {...register('bloodPressureDiastolic', { valueAsNumber: true })} error={errors.bloodPressureDiastolic?.message} />
            <Input label="الأكسجين (%)" type="number" placeholder="98" min="70" max="100" {...register('oxygenSaturation', { valueAsNumber: true })} error={errors.oxygenSaturation?.message} />
            <Input label="السكر (mg/dL)" type="number" placeholder="100" min="20" max="600" {...register('bloodSugar', { valueAsNumber: true })} error={errors.bloodSugar?.message} />
            <Input label="الوزن (kg)" type="number" step="0.1" placeholder="65" min="10" max="300" {...register('weight', { valueAsNumber: true })} error={errors.weight?.message} />
          </div>
        </Card>

        {/* Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-teal" />
              التقييم العام
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="الحالة الحركية اليوم"
              options={MOBILITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              {...register('mobilityToday')}
            />
            <Select
              label="المزاج والحالة النفسية"
              options={MOOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              {...register('mood')}
            />
          </div>
        </Card>

        {/* Notes & Incidents */}
        <Card>
          <CardHeader><CardTitle>الملاحظات والمتابعة</CardTitle></CardHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">ملاحظات التمريض</label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="سجل ملاحظاتك حول حالة المستفيد..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">حوادث (إن وجدت)</label>
              <textarea
                {...register('incidents')}
                rows={2}
                placeholder="وصف الحادثة إن وجدت..."
                className={cn(
                  'w-full rounded-lg border bg-white p-3 text-sm dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50',
                  'border-slate-300 dark:border-slate-600',
                )}
              />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('requiresFollowup')} className="h-4 w-4 rounded border-slate-300 text-teal" />
              <span className="text-sm text-slate-700 dark:text-slate-300">يتطلب متابعة في الوردية القادمة</span>
            </label>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" variant="gold" size="lg" loading={createLog.isPending} icon={<Save className="h-4 w-4" />}>
            حفظ سجل الرعاية
          </Button>
        </div>
      </form>
    </>
  )
}

// ─── Tab 2: Nursing Assessments & Notes ─────────────────────────

function NursingSection() {
  const { data: assessments = [], isLoading: loadingAssessments } = useNursingAssessments()
  const { data: notes = [], isLoading: loadingNotes } = useNursingNotes()
  const [filterType, setFilterType] = useState<NursingAssessment['assessment_type'] | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const isLoading = loadingAssessments || loadingNotes
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  const filteredAssessments = filterType === 'all'
    ? assessments
    : assessments.filter((a) => a.assessment_type === filterType)

  const stats = {
    totalAssessments: assessments.length,
    admissions: assessments.filter((a) => a.assessment_type === 'admission').length,
    periodic: assessments.filter((a) => a.assessment_type === 'periodic').length,
    totalNotes: notes.length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي التقييمات" value={stats.totalAssessments} icon={<Clipboard className="h-5 w-5" />} accent="navy" />
        <StatCard title="تقييمات قبول" value={stats.admissions} icon={<Heart className="h-5 w-5" />} accent="teal" />
        <StatCard title="فحوصات دورية" value={stats.periodic} icon={<ActivityIcon className="h-5 w-5" />} accent="gold" />
        <StatCard title="ملاحظات تمريضية" value={stats.totalNotes} icon={<FileText className="h-5 w-5" />} accent="success" />
      </div>

      {/* Filter chips */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'admission', 'periodic', 'daily_report'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filterType === t ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t === 'all' ? 'الكل' : ASSESSMENT_TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>

      {/* Assessments */}
      {filteredAssessments.length === 0 ? (
        <EmptyState title="لا توجد تقييمات" description="لم يتم تسجيل تقييمات تمريضية بعد" icon={<Clipboard className="h-8 w-8 text-slate-400" />} />
      ) : (
        <div className="space-y-3 mb-8">
          <AnimatePresence>
            {filteredAssessments.map((a) => {
              const typeConf = ASSESSMENT_TYPE_CONFIG[a.assessment_type]
              const isExpanded = expandedId === a.id
              return (
                <motion.div key={a.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className="cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : a.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={cn(typeConf.bgColor, typeConf.color)}>{typeConf.label}</Badge>
                          <span className="text-xs text-slate-500 dark:text-slate-400">{a.assessment_date}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{a.assessor_name}</p>
                        {a.chief_complaint && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">الشكوى: {a.chief_complaint}</p>
                        )}
                        {a.shift_summary && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{a.shift_summary}</p>
                        )}
                      </div>
                      <Eye className={cn('h-4 w-4 transition-transform', isExpanded ? 'text-teal rotate-180' : 'text-slate-400')} />
                    </div>

                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {a.vital_signs && Object.keys(a.vital_signs).length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 mb-2">العلامات الحيوية</h4>
                              <div className="space-y-1">
                                {Object.entries(a.vital_signs).map(([key, val]) => (
                                  <p key={key} className="text-xs text-slate-700 dark:text-slate-300">
                                    <span className="font-medium">{key}:</span> {String(val)}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          {a.physical_findings && Object.keys(a.physical_findings).length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 mb-2">الفحص البدني</h4>
                              <div className="space-y-1">
                                {Object.entries(a.physical_findings).map(([key, val]) => (
                                  <p key={key} className="text-xs text-slate-700 dark:text-slate-300">
                                    <span className="font-medium">{key}:</span> {String(val)}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                          {a.functional_status && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 mb-1">الحالة الوظيفية</h4>
                              <p className="text-xs text-slate-700 dark:text-slate-300">{a.functional_status}</p>
                            </div>
                          )}
                          {a.medication_summary && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 mb-1">ملخص الأدوية</h4>
                              <p className="text-xs text-slate-700 dark:text-slate-300">{a.medication_summary}</p>
                            </div>
                          )}
                          {a.clinical_changes && (
                            <div className="sm:col-span-2">
                              <h4 className="text-xs font-semibold text-slate-500 mb-1">تغييرات سريرية</h4>
                              <p className="text-xs text-slate-700 dark:text-slate-300">{a.clinical_changes}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Nursing Notes */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <FileText className="h-4 w-4 text-teal" />
        الملاحظات التمريضية ({notes.length})
      </h3>
      {notes.length === 0 ? (
        <EmptyState title="لا توجد ملاحظات" description="لم يتم تسجيل ملاحظات تمريضية بعد" />
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <Card key={n.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{n.nurse_name}</span>
                    {n.shift && <Badge className={cn(NURSING_SHIFT_CONFIG[n.shift].bgColor, NURSING_SHIFT_CONFIG[n.shift].color)}>{NURSING_SHIFT_CONFIG[n.shift].label}</Badge>}
                    <span className="text-xs text-slate-500 dark:text-slate-400">{n.note_date} {n.note_time ?? ''}</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{n.narrative_note}</p>
                  {n.patient_condition && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">حالة المريض: {n.patient_condition}</p>
                  )}
                  {n.vital_signs_summary && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{n.vital_signs_summary}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

// ─── Tab 3: Health Charts ───────────────────────────────────────

function HealthChartsSection() {
  const { data: charts = [], isLoading: loadingCharts } = useVitalSignCharts()
  const { data: epilepsy = [], isLoading: loadingEpilepsy } = useEpilepsyTracking()
  const { data: menstrual = [], isLoading: loadingMenstrual } = useMenstrualTracking()
  const { data: weights = [], isLoading: loadingWeight } = useWeightTracking()
  const [filterChart, setFilterChart] = useState<VitalSignChart['chart_type'] | 'all'>('all')

  const isLoading = loadingCharts || loadingEpilepsy || loadingMenstrual || loadingWeight
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  const filteredCharts = filterChart === 'all' ? charts : charts.filter((c) => c.chart_type === filterChart)

  const stats = {
    totalCharts: charts.length,
    epilepsyEpisodes: epilepsy.filter((e) => e.record_type === 'episode').length,
    menstrualRecords: menstrual.length,
    weightRecords: weights.length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="رسوم بيانية" value={stats.totalCharts} icon={<ActivityIcon className="h-5 w-5" />} accent="navy" />
        <StatCard title="نوبات صرع" value={stats.epilepsyEpisodes} icon={<Brain className="h-5 w-5" />} accent="danger" />
        <StatCard title="سجلات الدورة" value={stats.menstrualRecords} icon={<Droplets className="h-5 w-5" />} accent="gold" />
        <StatCard title="قياسات الوزن" value={stats.weightRecords} icon={<Scale className="h-5 w-5" />} accent="teal" />
      </div>

      {/* Vital Sign Charts */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ActivityIcon className="h-4 w-4 text-teal" />
        رسوم العلامات الحيوية
      </h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'observation', 'floor', 'blood_sugar'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterChart(t)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filterChart === t ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t === 'all' ? 'الكل' : CHART_TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>
      {filteredCharts.length === 0 ? (
        <EmptyState title="لا توجد رسوم بيانية" description="لم يتم تسجيل رسوم بيانية بعد" className="mb-8" />
      ) : (
        <div className="space-y-3 mb-8">
          {filteredCharts.map((c) => {
            const chartConf = CHART_TYPE_CONFIG[c.chart_type]
            return (
              <Card key={c.id}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn(chartConf.bgColor, chartConf.color)}>{chartConf.label}</Badge>
                      <span className="text-xs text-slate-500">{c.chart_date}</span>
                      {c.unit_number && <span className="text-xs text-slate-400">الوحدة: {c.unit_number}</span>}
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{c.nurse_name}</p>
                    {c.insulin_dose && <p className="text-xs text-slate-500 mt-0.5">جرعة الأنسولين: {c.insulin_dose}</p>}
                  </div>
                </div>
                {/* Readings table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        {c.readings.length > 0 && Object.keys(c.readings[0]).map((key) => (
                          <th key={key} className="px-2 py-1.5 text-right font-medium text-slate-500">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.readings.map((reading, idx) => (
                        <tr key={`reading-${idx}-${Object.values(reading).join('-')}`} className="border-b border-slate-100 dark:border-slate-800">
                          {Object.entries(reading).map(([colKey, val]) => (
                            <td key={colKey} className="px-2 py-1.5 text-slate-700 dark:text-slate-300">{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Epilepsy Tracking */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Brain className="h-4 w-4 text-teal" />
        متابعة الصرع ({epilepsy.length})
      </h3>
      {epilepsy.length === 0 ? (
        <EmptyState title="لا توجد سجلات صرع" description="لم يتم تسجيل متابعة صرع بعد" className="mb-8" />
      ) : (
        <div className="space-y-3 mb-8">
          {epilepsy.map((e) => {
            const recConf = EPILEPSY_RECORD_TYPE[e.record_type]
            return (
              <Card key={e.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn(recConf.bgColor, recConf.color)}>{recConf.label}</Badge>
                  <span className="text-xs text-slate-500">{e.record_date}</span>
                  <span className="text-xs text-slate-400">{e.recorded_by}</span>
                </div>
                {e.record_type === 'episode' && (
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-slate-700 dark:text-slate-300">
                    {e.seizure_type && <p><span className="font-medium">نوع النوبة:</span> {e.seizure_type}</p>}
                    {e.seizure_date && e.seizure_time && <p><span className="font-medium">الوقت:</span> {e.seizure_date} {e.seizure_time}</p>}
                    {e.duration_minutes != null && <p><span className="font-medium">المدة:</span> {e.duration_minutes} دقائق</p>}
                    {e.medication_given && <p><span className="font-medium">العلاج:</span> {e.medication_given}</p>}
                    {e.complications && <p><span className="font-medium">المضاعفات:</span> {e.complications}</p>}
                    {e.trigger_factors && e.trigger_factors.length > 0 && <p><span className="font-medium">المحفزات:</span> {e.trigger_factors.join('، ')}</p>}
                    {e.nursing_actions && e.nursing_actions.length > 0 && (
                      <div className="sm:col-span-2">
                        <span className="font-medium">الإجراءات التمريضية:</span>
                        <ul className="mt-1 list-disc list-inside me-2">
                          {e.nursing_actions.map((a) => <li key={a}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {e.record_type === 'follow_up' && (
                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {e.seizure_frequency && <p><span className="font-medium">معدل النوبات:</span> {e.seizure_frequency}</p>}
                    <p><span className="font-medium">الالتزام بالعلاج:</span> {e.medication_compliance ? 'ملتزم' : 'غير ملتزم'}</p>
                    {e.nursing_actions && e.nursing_actions.length > 0 && <p><span className="font-medium">المتابعة:</span> {e.nursing_actions.join('، ')}</p>}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Menstrual Tracking */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Droplets className="h-4 w-4 text-teal" />
        متابعة الدورة الشهرية ({menstrual.length})
      </h3>
      {menstrual.length === 0 ? (
        <EmptyState title="لا توجد سجلات" description="لم يتم تسجيل متابعة الدورة الشهرية بعد" className="mb-8" />
      ) : (
        <div className="space-y-3 mb-8">
          {menstrual.map((m) => (
            <Card key={m.id}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-900 dark:text-white">{m.cycle_start_date} — {m.cycle_end_date ?? 'جارية'}</span>
                {m.flow_amount && <Badge className={cn(FLOW_AMOUNT_CONFIG[m.flow_amount].bgColor, FLOW_AMOUNT_CONFIG[m.flow_amount].color)}>{FLOW_AMOUNT_CONFIG[m.flow_amount].label}</Badge>}
                {m.regularity && <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{m.regularity === 'regular' ? 'منتظمة' : 'غير منتظمة'}</Badge>}
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                {m.duration_days != null && <p>المدة: {m.duration_days} أيام</p>}
                {m.notes && <p>{m.notes}</p>}
                <p className="text-slate-400">{m.recorded_by}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Weight Tracking */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Scale className="h-4 w-4 text-teal" />
        متابعة الوزن ({weights.length})
      </h3>
      {weights.length === 0 ? (
        <EmptyState title="لا توجد قياسات" description="لم يتم تسجيل قياسات وزن بعد" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-3 py-2 text-right font-medium text-slate-500">التاريخ</th>
                <th className="px-3 py-2 text-right font-medium text-slate-500">الوزن (كجم)</th>
                <th className="px-3 py-2 text-right font-medium text-slate-500">الطول (سم)</th>
                <th className="px-3 py-2 text-right font-medium text-slate-500">BMI</th>
                <th className="px-3 py-2 text-right font-medium text-slate-500">ملاحظات</th>
                <th className="px-3 py-2 text-right font-medium text-slate-500">المسجل</th>
              </tr>
            </thead>
            <tbody>
              {weights.map((w) => (
                <tr key={w.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{w.measurement_date}</td>
                  <td className="px-3 py-2 font-medium text-slate-900 dark:text-white">{w.weight_kg}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{w.height_cm ?? '—'}</td>
                  <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{w.bmi ?? '—'}</td>
                  <td className="px-3 py-2 text-xs text-slate-500">{w.notes ?? '—'}</td>
                  <td className="px-3 py-2 text-xs text-slate-400">{w.recorded_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── Tab 4: Followup & Appointments ─────────────────────────────

function FollowupSection() {
  const { data: hygiene = [], isLoading: loadingHygiene } = useHygieneFollowup()
  const { data: appointments = [], isLoading: loadingAppt } = useAppointments()
  const [filterStatus, setFilterStatus] = useState<Appointment['confirmation_status'] | 'all'>('all')

  const isLoading = loadingHygiene || loadingAppt
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  const filteredAppts = filterStatus === 'all' ? appointments : appointments.filter((a) => a.confirmation_status === filterStatus)

  const stats = {
    totalHygiene: hygiene.length,
    selfCount: hygiene.filter((h) => h.overall_independence === 'self').length,
    totalAppts: appointments.length,
    upcoming: appointments.filter((a) => a.confirmation_status === 'scheduled' || a.confirmation_status === 'confirmed').length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="متابعة النظافة" value={stats.totalHygiene} icon={<ShowerHead className="h-5 w-5" />} accent="teal" />
        <StatCard title="مستقل" value={stats.selfCount} icon={<CheckCircle className="h-5 w-5" />} accent="success" />
        <StatCard title="إجمالي المواعيد" value={stats.totalAppts} icon={<Calendar className="h-5 w-5" />} accent="navy" />
        <StatCard title="مواعيد قادمة" value={stats.upcoming} icon={<Clock className="h-5 w-5" />} accent="gold" />
      </div>

      {/* Hygiene Followup */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <ShowerHead className="h-4 w-4 text-teal" />
        متابعة النظافة الشخصية ({hygiene.length})
      </h3>
      {hygiene.length === 0 ? (
        <EmptyState title="لا توجد سجلات" description="لم يتم تسجيل متابعة نظافة شخصية بعد" className="mb-8" />
      ) : (
        <div className="space-y-3 mb-8">
          {hygiene.map((h) => {
            const indConf = INDEPENDENCE_CONFIG[h.overall_independence]
            return (
              <Card key={h.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{h.followup_date}</span>
                  <Badge className={cn(indConf.bgColor, indConf.color)}>{indConf.label}</Badge>
                  <span className="text-xs text-slate-400">{h.recorded_by}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 text-xs">
                  {Object.entries(h.items).map(([key, val]) => {
                    const valStr = String(val)
                    const itemConf = valStr in INDEPENDENCE_CONFIG
                      ? INDEPENDENCE_CONFIG[valStr as keyof typeof INDEPENDENCE_CONFIG]
                      : null
                    return (
                      <div key={key} className="flex items-center gap-1">
                        <span className="text-slate-500">{key}:</span>
                        {itemConf ? (
                          <span className={itemConf.color}>{itemConf.label}</span>
                        ) : (
                          <span className="text-slate-700 dark:text-slate-300">{valStr}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
                {h.notes && <p className="text-xs text-slate-500 mt-2">{h.notes}</p>}
              </Card>
            )
          })}
        </div>
      )}

      {/* Appointments */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-teal" />
        المواعيد ({appointments.length})
      </h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filterStatus === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {s === 'all' ? 'الكل' : APPOINTMENT_STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>
      {filteredAppts.length === 0 ? (
        <EmptyState title="لا توجد مواعيد" description="لا توجد مواعيد مسجلة" />
      ) : (
        <div className="space-y-3">
          {filteredAppts.map((a) => {
            const statusConf = APPOINTMENT_STATUS_CONFIG[a.confirmation_status]
            return (
              <Card key={a.id}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn(statusConf.bgColor, statusConf.color)}>{statusConf.label}</Badge>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{a.appointment_date}</span>
                      {a.appointment_time && <span className="text-xs text-slate-500">{a.appointment_time}</span>}
                    </div>
                    {a.department && <p className="text-sm text-slate-700 dark:text-slate-300">{a.department}</p>}
                    {a.service_type && <p className="text-xs text-slate-500">{a.service_type}</p>}
                    {a.reason && <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{a.reason}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      {a.companion_needed && <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> يحتاج مرافق</span>}
                      {a.transport_needed && <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> يحتاج نقل</span>}
                      <span>{a.scheduled_by}</span>
                    </div>
                    {a.notes && <p className="text-xs text-slate-500 mt-1">{a.notes}</p>}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}

// ─── Tab 5: Isolation & Ambulance ───────────────────────────────

function IsolationSection() {
  const { data: isolation = [], isLoading: loadingIso } = useIsolationRecords()
  const { data: ambulance = [], isLoading: loadingAmb } = useAmbulanceChecks()
  const [filterIsoStatus, setFilterIsoStatus] = useState<IsolationRecord['status'] | 'all'>('all')
  const [expandedIso, setExpandedIso] = useState<string | null>(null)

  const isLoading = loadingIso || loadingAmb
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  const filteredIso = filterIsoStatus === 'all' ? isolation : isolation.filter((i) => i.status === filterIsoStatus)

  const stats = {
    totalIsolation: isolation.length,
    activeIsolation: isolation.filter((i) => i.status === 'active').length,
    totalAmbulance: ambulance.length,
    issuesFound: ambulance.filter((a) => !a.cleanliness_ok || !a.safety_items_ok).length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="سجلات العزل" value={stats.totalIsolation} icon={<Shield className="h-5 w-5" />} accent="navy" />
        <StatCard title="عزل نشط" value={stats.activeIsolation} icon={<AlertTriangle className="h-5 w-5" />} accent="danger" />
        <StatCard title="فحوصات الإسعاف" value={stats.totalAmbulance} icon={<Truck className="h-5 w-5" />} accent="teal" />
        <StatCard title="تحتاج إصلاح" value={stats.issuesFound} icon={<XCircle className="h-5 w-5" />} accent="gold" />
      </div>

      {/* Isolation Records */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Shield className="h-4 w-4 text-teal" />
        سجلات العزل ({isolation.length})
      </h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'active', 'terminated'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterIsoStatus(s)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filterIsoStatus === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {s === 'all' ? 'الكل' : ISOLATION_STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>
      {filteredIso.length === 0 ? (
        <EmptyState title="لا توجد سجلات عزل" description="لا توجد حالات عزل مسجلة" className="mb-8" />
      ) : (
        <div className="space-y-3 mb-8">
          <AnimatePresence>
            {filteredIso.map((iso) => {
              const typeConf = ISOLATION_TYPE_CONFIG[iso.isolation_type]
              const statusConf = ISOLATION_STATUS_CONFIG[iso.status]
              const isExpanded = expandedIso === iso.id
              return (
                <motion.div key={iso.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className="cursor-pointer" onClick={() => setExpandedIso(isExpanded ? null : iso.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={cn(typeConf.bgColor, typeConf.color)}>{typeConf.label}</Badge>
                          <Badge className={cn(statusConf.bgColor, statusConf.color)}>{statusConf.label}</Badge>
                          <span className="text-xs text-slate-500">{iso.start_date} {iso.start_time ?? ''}</span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{iso.reason}</p>
                        {iso.authorization_physician && (
                          <p className="text-xs text-slate-400 mt-1">الطبيب المعتمد: {iso.authorization_physician}</p>
                        )}
                      </div>
                      <Eye className={cn('h-4 w-4 transition-transform', isExpanded ? 'text-teal rotate-180' : 'text-slate-400')} />
                    </div>

                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                          {iso.medical_justification && <p><span className="font-medium">المبرر الطبي:</span> {iso.medical_justification}</p>}
                          {iso.precautions && iso.precautions.length > 0 && (
                            <div>
                              <span className="font-medium">الاحتياطات:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {iso.precautions.map((p) => (
                                  <Badge key={p} className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-xs">{p}</Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {iso.status === 'terminated' && (
                            <>
                              <p><span className="font-medium">تاريخ الإنهاء:</span> {iso.end_date} {iso.end_time ?? ''}</p>
                              {iso.duration_hours != null && <p><span className="font-medium">المدة:</span> {iso.duration_hours} ساعة</p>}
                              {iso.termination_reason && <p><span className="font-medium">سبب الإنهاء:</span> {iso.termination_reason}</p>}
                            </>
                          )}
                          {iso.observations.length > 0 && (
                            <div>
                              <span className="font-medium">الملاحظات:</span>
                              <div className="mt-2 space-y-1.5 border-s-2 border-teal/30 ps-3">
                                {iso.observations.map((obs) => {
                                  const obsR = obs as Record<string, unknown>
                                  const obsKey = `${String(obsR.date ?? '')}-${String(obsR.time ?? '')}-${String(obsR.note ?? '').slice(0, 20)}`
                                  return (
                                  <div key={obsKey} className="flex items-start gap-2">
                                    <span className="text-slate-400 whitespace-nowrap">{String(obsR.date ?? '')} {String(obsR.time ?? '')}</span>
                                    <span>{String(obsR.note ?? '')}</span>
                                  </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Ambulance Checks */}
      <h3 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Truck className="h-4 w-4 text-teal" />
        فحوصات سيارات الإسعاف ({ambulance.length})
      </h3>
      {ambulance.length === 0 ? (
        <EmptyState title="لا توجد فحوصات" description="لم يتم تسجيل فحوصات سيارات إسعاف بعد" />
      ) : (
        <div className="space-y-3">
          {ambulance.map((amb) => (
            <Card key={amb.id}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{amb.vehicle_id}</span>
                    {amb.vehicle_plate && <span className="text-xs text-slate-500">({amb.vehicle_plate})</span>}
                    <span className="text-xs text-slate-400">{amb.check_date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={amb.safety_items_ok ? 'text-green-600' : 'text-red-600'}>
                      {amb.safety_items_ok ? 'السلامة: جيد' : 'السلامة: يحتاج مراجعة'}
                    </span>
                    <span className={amb.cleanliness_ok ? 'text-green-600' : 'text-red-600'}>
                      {amb.cleanliness_ok ? 'النظافة: جيد' : 'النظافة: يحتاج تنظيف'}
                    </span>
                    {amb.fuel_level && <span className="text-slate-500">الوقود: {amb.fuel_level}</span>}
                    {amb.mileage != null && <span className="text-slate-500">العداد: {amb.mileage.toLocaleString('ar-SA')} كم</span>}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{amb.inspector_name}</p>
                </div>
              </div>

              {/* Equipment status table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="px-2 py-1.5 text-right font-medium text-slate-500">المعدة</th>
                      <th className="px-2 py-1.5 text-right font-medium text-slate-500">الحالة</th>
                      <th className="px-2 py-1.5 text-right font-medium text-slate-500">تفاصيل</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amb.equipment_status.map((eq) => {
                      const eqObj = eq as Record<string, unknown>
                      const isOk = eqObj.status === 'يعمل' || eqObj.status === 'مكتمل'
                      return (
                        <tr key={String(eqObj.item ?? '')} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="px-2 py-1.5 text-slate-700 dark:text-slate-300">{String(eqObj.item ?? '')}</td>
                          <td className={cn('px-2 py-1.5 font-medium', isOk ? 'text-green-600' : 'text-red-600')}>{String(eqObj.status ?? '')}</td>
                          <td className="px-2 py-1.5 text-slate-500">
                            {eqObj.level ? `المستوى: ${String(eqObj.level)}` : ''}
                            {eqObj.expiry ? `انتهاء: ${String(eqObj.expiry)}` : ''}
                            {eqObj.last_refill ? `آخر تعبئة: ${String(eqObj.last_refill)}` : ''}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
