import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Sparkles, Heart, Plus, ChevronDown, ChevronUp, TrendingUp, Award, Brain, ScrollText, Scale, GraduationCap, ClipboardList, Handshake, Wallet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge, Modal, Input, Select, Tabs, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  REHAB_DOMAINS, GOAL_STATUS_CONFIG, MEASUREMENT_TYPES,
  PERSONALITY_TYPES, COMMUNICATION_STYLES,
  ICF_COMPONENT_CONFIG, ICF_QUALIFIER_LABELS, ENVIRONMENTAL_QUALIFIER_TYPES,
  RIGHTS_STATUS_CONFIG, CRPD_ARTICLES,
  LIFE_PLAN_STATUS_CONFIG, LIFE_PLAN_DOMAINS,
  EVALUATION_TYPES, SKILLS_LEVELS,
  type GoalStatus, type GoalDomain, type IcfComponent,
} from '../types'
import { useRehabGoals, useDignityProfile, useCreateRehabGoal } from '../api/empowerment-queries'
import { useIcfAssessments, useIcfStats } from '../api/icf-queries'
import { useLifePlans } from '../api/life-plan-queries'
import { useRightsLog, useRightsStats } from '../api/rights-queries'
import { useTrainingReferrals, useTrainingEvaluations } from '../api/training-queries'
import { useCRPDAssessments, useIndependenceBudgets } from '../api/crpd-queries'
import { DEMO_LOGS } from '../api/demo-data'

// ─── Main Page ──────────────────────────────────────────────────

export function EmpowermentPage() {
  const [activeTab, setActiveTab] = useState('goals')

  const tabs = [
    { id: 'goals', label: 'الأهداف التأهيلية' },
    { id: 'dignity', label: 'ملف الكرامة' },
    { id: 'icf', label: 'تقييم ICF' },
    { id: 'lifePlans', label: 'خطة الحياة' },
    { id: 'rights', label: 'رصد الحقوق' },
    { id: 'training', label: 'البرامج التدريبية' },
    { id: 'codesign', label: 'التصميم المشترك' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="التمكين وجودة الحياة"
        description="الأهداف التأهيلية، تقييم ICF، خطط الحياة الفردية، ورصد الحقوق (CRPD)"
        icon={<Sparkles className="h-5 w-5" />}
      />

      <Tabs
        tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'goals' && <GoalsSection />}
        {activeTab === 'dignity' && <DignitySection />}
        {activeTab === 'icf' && <IcfSection />}
        {activeTab === 'lifePlans' && <LifePlansSection />}
        {activeTab === 'rights' && <RightsSection />}
        {activeTab === 'training' && <TrainingSection />}
        {activeTab === 'codesign' && <CoDesignSection />}
      </div>
    </div>
  )
}

// ─── Goals Section ──────────────────────────────────────────────

function GoalsSection() {
  const { data: goals = [], isLoading, error } = useRehabGoals()
  const [filterDomain, setFilterDomain] = useState<GoalDomain | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all')
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (goals.length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم إنشاء أي أهداف تأهيلية بعد" />

  const filtered = goals.filter((g) =>
    (filterDomain === 'all' || g.domain === filterDomain) &&
    (filterStatus === 'all' || g.status === filterStatus),
  )

  const stats = {
    total: goals.length,
    inProgress: goals.filter((g) => g.status === 'active').length,
    achieved: goals.filter((g) => g.status === 'achieved').length,
    avgProgress: Math.round(goals.reduce((sum, g) => sum + g.progress_percentage, 0) / (goals.length || 1)),
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الأهداف" value={stats.total} accent="navy" />
        <StatCard title="قيد التنفيذ" value={stats.inProgress} accent="teal" />
        <StatCard title="محقق" value={stats.achieved} accent="gold" />
        <StatCard title="متوسط التقدم" value={`${stats.avgProgress}%`} accent="navy" />
      </div>

      {/* Domain filter */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterDomain('all')}
          className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterDomain === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
        >
          الكل
        </button>
        {REHAB_DOMAINS.map((d) => (
          <button
            key={d.value}
            onClick={() => setFilterDomain(d.value)}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterDomain === d.value ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
          >
            {d.emoji} {d.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['all', 'in_progress', 'achieved', 'planned', 'on_hold'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterStatus === s ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
            >
              {s === 'all' ? 'جميع الحالات' : GOAL_STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
          هدف جديد
        </Button>
      </div>

      {/* Goal Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((goal) => {
            const domainConfig = REHAB_DOMAINS.find((d) => d.value === goal.domain)
            const statusConfig = GOAL_STATUS_CONFIG[goal.status as GoalStatus]
            const isExpanded = expandedGoal === goal.id
            const goalLogs = DEMO_LOGS.filter((l) => l.goalId === goal.id)

            return (
              <motion.div key={goal.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card className={cn(goal.status === 'achieved' && 'border-s-4 border-s-emerald-500')}>
                  <div className="cursor-pointer" onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {domainConfig && <Badge className={domainConfig.color}>{domainConfig.emoji} {domainConfig.label}</Badge>}
                          {statusConfig && <Badge className={statusConfig.color}>{statusConfig.label}</Badge>}
                          {goal.status === 'achieved' && <Award className="h-4 w-4 text-amber-500" />}
                        </div>
                        <h3 className="mt-1.5 font-bold text-slate-900 dark:text-white">{goal.goal_title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{goal.beneficiary_id}</p>

                        {/* Progress bar */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <motion.div
                              className={cn('h-full rounded-full', goal.progress_percentage >= 100 ? 'bg-emerald-500' : goal.progress_percentage >= 50 ? 'bg-teal' : 'bg-gold')}
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progress_percentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{goal.progress_percentage}%</span>
                        </div>

                        {/* Measurement info */}
                        {goal.baseline_value != null && goal.target_value != null && (
                          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                            <span>📏 الأساسي: {goal.baseline_value} {goal.measurement_unit}</span>
                            <span>📊 الحالي: {goal.current_value} {goal.measurement_unit}</span>
                            <span>🎯 المستهدف: {goal.target_value} {goal.measurement_unit}</span>
                          </div>
                        )}
                      </div>
                      <button className="mt-1 text-slate-400" aria-label="عرض التفاصيل">
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                          <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{goal.goal_description}</p>
                          <div className="mb-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <span className="text-slate-500">الأخصائي</span>
                              <p className="font-medium">{goal.assigned_to || '—'}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <span className="text-slate-500">القسم</span>
                              <p className="font-medium">{goal.assigned_department || '—'}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <span className="text-slate-500">تاريخ البداية</span>
                              <p className="font-medium">{goal.start_date}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <span className="text-slate-500">تاريخ الإنجاز</span>
                              <p className="font-medium">{goal.target_date}</p>
                            </div>
                          </div>

                          {/* Progress logs */}
                          <h4 className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <TrendingUp className="h-4 w-4" /> سجل الجلسات
                          </h4>
                          <div className="space-y-2">
                            {goalLogs.map((log) => (
                              <div key={log.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="font-medium">{log.recordedBy}</span>
                                  </div>
                                  <span className="text-xs text-slate-500">{log.date}</span>
                                </div>
                                {log.note && <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{log.note}</p>}
                              </div>
                            ))}
                            {goalLogs.length === 0 && (
                              <p className="text-xs text-slate-400">لا توجد جلسات مسجلة</p>
                            )}
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
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد أهداف</div>}
      </div>

      <AddGoalModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  )
}

const goalSchema = z.object({
  goalTitle: z.string().min(3, 'العنوان مطلوب (3 أحرف على الأقل)'),
  goalDescription: z.string().optional(),
  measurementType: z.string().default('numeric'),
  measurementUnit: z.string().optional(),
  baselineValue: z.string().optional(),
  targetValue: z.string().optional(),
  startDate: z.string().optional(),
  targetDate: z.string().min(1, 'تاريخ الإنجاز مطلوب'),
  assignedTo: z.string().optional(),
})

type GoalFormData = z.infer<typeof goalSchema>

function AddGoalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [domain, setDomain] = useState<GoalDomain | ''>('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: { measurementType: 'numeric' },
  })

  const createGoal = useCreateRehabGoal()
  const onSubmit = (data: GoalFormData) => {
    createGoal.mutate({
      beneficiary_id: '',
      domain: domain || 'physical',
      goal_title: data.goalTitle,
      goal_description: data.goalDescription || null,
      measurement_type: data.measurementType || null,
      measurement_unit: data.measurementUnit || null,
      baseline_value: data.baselineValue ? Number(data.baselineValue) : null,
      target_value: data.targetValue ? Number(data.targetValue) : null,
      current_value: null,
      quality_of_life_dimension: null,
      start_date: data.startDate || null,
      target_date: data.targetDate || null,
      assigned_to: data.assignedTo || null,
      assigned_department: null,
      status: 'active',
      progress_percentage: 0,
      achievement_evidence: null,
      barriers_notes: null,
      family_involvement: null,
      linked_national_goal: null,
    })
    toast.success('تم إنشاء الهدف التأهيلي')
    reset()
    setStep(1)
    setDomain('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="إنشاء هدف تأهيلي SMART" size="lg">
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">اختر المجال التأهيلي</h3>
          <div className="grid grid-cols-3 gap-2">
            {REHAB_DOMAINS.map((d) => (
              <button
                key={d.value}
                onClick={() => { setDomain(d.value); setStep(2) }}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:shadow-md',
                  domain === d.value ? 'border-teal bg-teal/5' : 'border-slate-200 dark:border-slate-700',
                )}
              >
                <span className="text-2xl">{d.emoji}</span>
                <span className="text-xs font-medium">{d.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && domain && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center gap-2">
            {(() => { const dc = REHAB_DOMAINS.find((d) => d.value === domain); return dc ? (
            <Badge className={dc.color}>
              {dc.emoji} {dc.label}
            </Badge>
            ) : null })()}
            <button type="button" onClick={() => setStep(1)} className="text-xs text-teal hover:underline">تغيير</button>
          </div>

          <Input label="عنوان الهدف" {...register('goalTitle')} error={errors.goalTitle?.message} placeholder="مثال: المشي باستقلالية لمسافة 50 متر" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">وصف الهدف</label>
            <textarea {...register('goalDescription')} rows={2} placeholder="وصف تفصيلي للهدف..." className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="نوع القياس" {...register('measurementType')} error={errors.measurementType?.message} options={MEASUREMENT_TYPES.map((m) => ({ value: m.value, label: `${m.label} (${m.example})` }))} />
            <Input label="وحدة القياس" {...register('measurementUnit')} error={errors.measurementUnit?.message} placeholder="متر، كلمة، دقيقة..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="القيمة الأساسية" type="number" {...register('baselineValue')} error={errors.baselineValue?.message} />
            <Input label="القيمة المستهدفة" type="number" {...register('targetValue')} error={errors.targetValue?.message} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="تاريخ البداية" type="date" {...register('startDate')} error={errors.startDate?.message} />
            <Input label="تاريخ الإنجاز المستهدف" type="date" {...register('targetDate')} error={errors.targetDate?.message} />
          </div>
          <Input label="الأخصائي المسؤول" {...register('assignedTo')} error={errors.assignedTo?.message} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setStep(1)}>رجوع</Button>
            <Button variant="gold" type="submit">إنشاء الهدف</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

// ─── ICF Assessment Section ─────────────────────────────────────

function IcfSection() {
  const { data: assessments = [], isLoading, error } = useIcfAssessments()
  const stats = useIcfStats()
  const [filterComponent, setFilterComponent] = useState<IcfComponent | 'all'>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (assessments.length === 0) return <EmptyState title="لا توجد تقييمات ICF" description="لم يتم إجراء أي تقييم بإطار التصنيف الدولي للأداء بعد" />

  const filtered = filterComponent === 'all' ? assessments : assessments.filter((a) => a.component === filterComponent)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي التقييمات" value={stats.total} accent="teal" />
        <StatCard title="وظائف الجسم (b)" value={stats.byComponent.b} accent="navy" />
        <StatCard title="الأنشطة والمشاركة (d)" value={stats.byComponent.d} accent="gold" />
        <StatCard title="فجوات بيئية" value={stats.environmentalGaps} accent="danger" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterComponent('all')}
          className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterComponent === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')}
        >
          الكل
        </button>
        {(Object.entries(ICF_COMPONENT_CONFIG) as [IcfComponent, typeof ICF_COMPONENT_CONFIG[IcfComponent]][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilterComponent(key)}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterComponent === key ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')}
          >
            {config.labelAr} ({key})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a) => {
          const compConfig = ICF_COMPONENT_CONFIG[a.component]
          const hasGap = a.component === 'd' && a.capacity_qualifier != null && a.performance_qualifier != null && a.capacity_qualifier !== a.performance_qualifier

          return (
            <Card key={a.id} className={cn(hasGap && 'border-s-4 border-s-amber-500')}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={compConfig.color}>{compConfig.labelAr}</Badge>
                    <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{a.icf_code}</span>
                    {hasGap && <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">فجوة بيئية</Badge>}
                  </div>

                  {a.component === 'd' && (a.capacity_qualifier != null || a.performance_qualifier != null) && (
                    <div className="mt-2 flex gap-4 text-xs">
                      {a.capacity_qualifier != null && (
                        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5">
                          <span className="text-blue-600 dark:text-blue-400">القدرة: </span>
                          <span className="font-bold">{ICF_QUALIFIER_LABELS[a.capacity_qualifier]?.label ?? a.capacity_qualifier}</span>
                        </div>
                      )}
                      {a.performance_qualifier != null && (
                        <div className="rounded-lg bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5">
                          <span className="text-teal-600 dark:text-teal-400">الأداء: </span>
                          <span className="font-bold">{ICF_QUALIFIER_LABELS[a.performance_qualifier]?.label ?? a.performance_qualifier}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {a.component === 'e' && a.qualifier_type && (
                    <div className="mt-2 flex gap-2 text-xs">
                      <Badge className={
                        a.qualifier_type === 'facilitator' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : a.qualifier_type === 'barrier' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }>
                        {ENVIRONMENTAL_QUALIFIER_TYPES.find((t) => t.value === a.qualifier_type)?.label}
                        {a.qualifier_magnitude != null && ` (${a.qualifier_magnitude})`}
                      </Badge>
                    </div>
                  )}

                  {(a.component === 'b' || a.component === 's') && a.qualifier != null && (
                    <div className="mt-2 text-xs">
                      <span className="text-slate-500">المُحدِّد: </span>
                      <span className="font-medium">{ICF_QUALIFIER_LABELS[a.qualifier]?.label ?? a.qualifier}</span>
                    </div>
                  )}

                  {a.notes && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{a.notes}</p>}
                </div>
                <div className="text-left text-xs text-slate-400 shrink-0">
                  <p>{a.assessor_id}</p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Life Plans Section ─────────────────────────────────────────

function LifePlansSection() {
  const { data: plans = [], isLoading, error } = useLifePlans()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (plans.length === 0) return <EmptyState title="لا توجد خطط حياة" description="لم يتم إنشاء خطط حياة فردية بعد" />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي الخطط" value={plans.length} accent="teal" />
        <StatCard title="خطط نشطة" value={plans.filter((p) => p.status === 'active').length} accent="success" />
        <StatCard title="تصميم مشترك" value={plans.filter((p) => p.beneficiary_participated).length} accent="gold" />
        <StatCard title="مشاركة الأسرة" value={plans.filter((p) => p.guardian_participated).length} accent="navy" />
      </div>

      {plans.map((plan) => {
        const statusConfig = LIFE_PLAN_STATUS_CONFIG[plan.status]
        return (
          <Card key={plan.id}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    خطة {plan.plan_period_start} — {plan.plan_period_end}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    التصميم المشترك: {plan.co_designed_with.join('، ') || 'غير محدد'}
                  </p>
                </div>
                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {plan.beneficiary_participated && <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">مشاركة المستفيد</Badge>}
                {plan.guardian_participated && <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">مشاركة ولي الأمر</Badge>}
                {plan.review_date && <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">المراجعة: {plan.review_date}</Badge>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {LIFE_PLAN_DOMAINS.map((domain) => {
                  const goals = plan[domain.key as keyof typeof plan] as Record<string, unknown>[]
                  if (!goals || goals.length === 0) return null
                  return (
                    <div key={domain.key} className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                      <div className="flex items-center gap-1 mb-2">
                        <span>{domain.emoji}</span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{domain.label}</span>
                      </div>
                      {goals.map((g, i) => (
                        <p key={i} className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                          {(g as Record<string, string>).goal ?? JSON.stringify(g)}
                        </p>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ─── Rights Realization Section ─────────────────────────────────

function RightsSection() {
  const { data: log = [], isLoading, error } = useRightsLog()
  const stats = useRightsStats()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (log.length === 0) return <EmptyState title="لا توجد سجلات حقوق" description="لم يتم تسجيل أي إدخالات في سجل تحقّق الحقوق بعد" />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي السجلات" value={stats.totalEntries} accent="teal" />
        <StatCard title="حقوق محققة" value={stats.realized} accent="success" />
        <StatCard title="محققة جزئياً" value={stats.partial} accent="gold" />
        <StatCard title="عوائق محددة" value={stats.barriers} accent="danger" />
      </div>

      <div className="space-y-3">
        {log.map((entry) => {
          const statusConfig = RIGHTS_STATUS_CONFIG[entry.status]
          const article = CRPD_ARTICLES.find((a) => a.value === entry.crpd_article)

          return (
            <Card key={entry.id} className={cn(
              entry.status === 'barrier_identified' && 'border-s-4 border-s-red-500',
              entry.status === 'realized' && 'border-s-4 border-s-emerald-500',
            )}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-slate-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {article?.label ?? `المادة ${entry.crpd_article}`}
                    </span>
                  </div>
                  <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300">{entry.right_domain}</p>

                {entry.barrier_description && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-3">
                    <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">العائق:</p>
                    <p className="text-xs text-red-600 dark:text-red-300">{entry.barrier_description}</p>
                  </div>
                )}

                {entry.action_required && (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/10 p-3">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">الإجراء المطلوب:</p>
                    <p className="text-xs text-blue-600 dark:text-blue-300">{entry.action_required}</p>
                  </div>
                )}

                <p className="text-xs text-slate-400">بواسطة: {entry.logged_by}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── Dignity Section ────────────────────────────────────────────

function DignitySection() {
  const { data: profile, isLoading, error } = useDignityProfile('b1')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (!profile) return <EmptyState title="لا يوجد ملف كرامة" description="لم يتم إنشاء ملف كرامة لهذا المستفيد بعد" />

  const personalityConfig = PERSONALITY_TYPES.find((p) => p.value === profile.personalityType)
  const commConfig = COMMUNICATION_STYLES.find((c) => c.value === profile.communicationStyle)

  return (
    <div className="space-y-6">
      {/* Header card */}
      <Card className="border-s-4 border-s-gold">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 text-3xl">
            <Heart className="h-8 w-8 text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {profile.preferredName || 'أحمد محمد السالم'}
            </h2>
            <p className="text-sm text-slate-500">
              {profile.preferredTitle && `يفضل أن يُنادى: ${profile.preferredTitle}`}
            </p>
            <div className="mt-1 flex items-center gap-2">
              {personalityConfig && <Badge variant="outline">{personalityConfig.emoji} {personalityConfig.label}</Badge>}
              {commConfig && <Badge variant="outline">{commConfig.emoji} {commConfig.label}</Badge>}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Routine */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">الروتين اليومي</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-900/20">
              <p className="text-xs text-slate-500">وقت الاستيقاظ</p>
              <p className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-400">☀️ {profile.wakeUpTime ?? '—'}</p>
            </div>
            <div className="rounded-lg bg-indigo-50 p-3 text-center dark:bg-indigo-900/20">
              <p className="text-xs text-slate-500">وقت النوم</p>
              <p className="mt-1 text-lg font-bold text-indigo-700 dark:text-indigo-400">🌙 {profile.sleepTime ?? '—'}</p>
            </div>
          </div>
        </Card>

        {/* Favorites */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">الأطعمة المفضلة</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {(profile.favoriteFoods ?? []).map((food) => (
              <Badge key={food} variant="outline">🍽️ {food}</Badge>
            ))}
          </div>
        </Card>

        {/* Activities & Hobbies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">الأنشطة والهوايات</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-500">الأنشطة المفضلة</p>
              <div className="flex flex-wrap gap-2">
                {(profile.preferredActivities ?? []).map((a) => (
                  <Badge key={a} className="bg-teal/10 text-teal">{a}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-500">الهوايات</p>
              <div className="flex flex-wrap gap-2">
                {(profile.hobbies ?? []).map((h) => (
                  <Badge key={h} className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">{h}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Calming & Motivators */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ما يساعدني</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-500">استراتيجيات التهدئة</p>
              <div className="flex flex-wrap gap-2">
                {(profile.calmingStrategies ?? []).map((c) => (
                  <Badge key={c} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">😌 {c}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-500">المحفزات</p>
              <div className="flex flex-wrap gap-2">
                {(profile.motivators ?? []).map((m) => (
                  <Badge key={m} className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">⭐ {m}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Emotional insights */}
      <div className="grid gap-6 md:grid-cols-3">
        {profile.whatMakesMeHappy && (
          <Card className="border-t-4 border-t-emerald-500">
            <h3 className="mb-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">😊 ما يسعدني</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{profile.whatMakesMeHappy}</p>
          </Card>
        )}
        {profile.whatMakesMeUpset && (
          <Card className="border-t-4 border-t-red-500">
            <h3 className="mb-2 text-sm font-bold text-red-700 dark:text-red-400">😟 ما يزعجني</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{profile.whatMakesMeUpset}</p>
          </Card>
        )}
        {profile.myDreams && (
          <Card className="border-t-4 border-t-gold">
            <h3 className="mb-2 text-sm font-bold text-gold">✨ أحلامي وتطلعاتي</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{profile.myDreams}</p>
          </Card>
        )}
      </div>
    </div>
  )
}

// ─── Training Section (البرامج التدريبية) ────────────────────────

function TrainingSection() {
  const { data: referrals = [], isLoading: loadingReferrals, error: errorReferrals } = useTrainingReferrals()
  const { data: evaluations = [], isLoading: loadingEvaluations, error: errorEvaluations } = useTrainingEvaluations()

  const isLoading = loadingReferrals || loadingEvaluations
  const error = errorReferrals || errorEvaluations

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (referrals.length === 0 && evaluations.length === 0) return <EmptyState title="لا توجد بيانات تدريبية" description="لم يتم إنشاء أي إحالات أو تقييمات تدريبية بعد" />

  const avgPercentage = evaluations.length
    ? Math.round(evaluations.reduce((sum, e) => sum + (e.percentage ?? 0), 0) / evaluations.length)
    : 0

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إحالات التدريب" value={referrals.length} accent="navy" />
        <StatCard title="التقييمات" value={evaluations.length} accent="teal" />
        <StatCard title="متوسط الأداء" value={`${avgPercentage}%`} accent={avgPercentage >= 70 ? 'teal' : avgPercentage >= 50 ? 'gold' : 'danger'} />
        <StatCard title="أهداف الإحالة" value={referrals.reduce((sum, r) => sum + r.referral_goals.length, 0)} accent="gold" />
      </div>

      {/* Training Referrals */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <ClipboardList className="h-5 w-5 text-teal" />
          إحالات التدريب والتأهيل
        </h3>
        <div className="space-y-3">
          {referrals.map((ref) => (
            <Card key={ref.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-bold text-slate-900 dark:text-white">إحالة تدريبية</span>
                    <span className="text-xs text-slate-500">{ref.referral_date}</span>
                  </div>
                  {ref.supervisor_name && (
                    <span className="text-xs text-slate-500">المشرف: {ref.supervisor_name}</span>
                  )}
                </div>

                {/* Diagnosis info */}
                {(ref.medical_diagnosis || ref.psychological_diagnosis) && (
                  <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    {ref.medical_diagnosis && (
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                        <span className="text-slate-500">التشخيص الطبي: </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{ref.medical_diagnosis}</span>
                      </div>
                    )}
                    {ref.psychological_diagnosis && (
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                        <span className="text-slate-500">التشخيص النفسي: </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{ref.psychological_diagnosis}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Referral Goals */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-slate-500">أهداف الإحالة</p>
                  <div className="flex flex-wrap gap-2">
                    {ref.referral_goals.map((goal) => (
                      <Badge key={goal} className="bg-teal/10 text-teal dark:bg-teal/20">{goal}</Badge>
                    ))}
                  </div>
                </div>

                {/* Skills Assessment */}
                <div>
                  <p className="mb-1.5 text-xs font-medium text-slate-500">تقييم المهارات</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(ref.skills_assessment as Record<string, string>).map(([skill, level]) => {
                      const skillLabels: Record<string, string> = {
                        self_care: 'العناية الذاتية',
                        communication: 'التواصل',
                        cognitive: 'المعرفي',
                        performance: 'الأداء',
                      }
                      const levelConfig = SKILLS_LEVELS.find((l) => l.value === level)
                      return (
                        <div key={skill} className="flex items-center gap-1">
                          <span className="text-xs text-slate-500">{skillLabels[skill] ?? skill}:</span>
                          <Badge className={levelConfig?.color ?? 'bg-slate-100 text-slate-700'}>
                            {levelConfig?.label ?? level}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Referral staff */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  {ref.referred_by && <span>المُحيل: {ref.referred_by}</span>}
                  {ref.received_by && <span>المستقبِل: {ref.received_by}</span>}
                  {ref.assistive_devices && <span>الأجهزة المساعدة: {ref.assistive_devices}</span>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Training Evaluations */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <GraduationCap className="h-5 w-5 text-gold" />
          التقييمات التدريبية
        </h3>
        <div className="space-y-3">
          {evaluations.map((eval_item) => {
            const evalTypeConfig = EVALUATION_TYPES.find((t) => t.value === eval_item.evaluation_type)
            const pct = eval_item.percentage ?? 0

            return (
              <Card key={eval_item.id} className={cn(pct >= 70 && 'border-s-4 border-s-emerald-500')}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {evalTypeConfig?.label ?? eval_item.evaluation_type}
                      </Badge>
                      <span className="text-xs text-slate-500">{eval_item.evaluation_date}</span>
                    </div>
                    <span className="text-xs text-slate-500">المقيِّم: {eval_item.evaluator_name}</span>
                  </div>

                  {/* Overall Score Progress */}
                  <div className="flex items-center gap-3">
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        className={cn(
                          'h-full rounded-full',
                          pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500',
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="min-w-[4rem] text-left text-sm font-bold text-slate-700 dark:text-slate-300">
                      {eval_item.total_score}/{eval_item.max_total} ({pct}%)
                    </span>
                  </div>

                  {/* Sections Breakdown */}
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {(eval_item.sections as Array<{ section_name: string; max_score: number; items: Array<{ name: string; score: number; max: number }> }>).map((section, idx) => {
                      const sectionTotal = section.items.reduce((s, item) => s + item.score, 0)
                      const sectionPct = section.max_score > 0 ? Math.round((sectionTotal / section.max_score) * 100) : 0

                      return (
                        <div key={idx} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{section.section_name}</span>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{sectionTotal}/{section.max_score}</span>
                          </div>
                          <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className={cn('h-full rounded-full', sectionPct >= 70 ? 'bg-emerald-500' : sectionPct >= 50 ? 'bg-amber-500' : 'bg-red-500')}
                              style={{ width: `${sectionPct}%` }}
                            />
                          </div>
                          <div className="space-y-1">
                            {section.items.map((item, iIdx) => (
                              <div key={iIdx} className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">{item.name}</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{item.score}/{item.max}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Notes */}
                  {eval_item.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      📝 {eval_item.notes}
                    </p>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Co-Design (CRPD) Section ─────────────────────────────────

function CoDesignSection() {
  const { data: assessments = [], isLoading: loadingAssessments, error: errorAssessments } = useCRPDAssessments()
  const { data: budgets = [], isLoading: loadingBudgets, error: errorBudgets } = useIndependenceBudgets()

  const isLoading = loadingAssessments || loadingBudgets
  const error = errorAssessments || errorBudgets

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (assessments.length === 0 && budgets.length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم إنشاء أي تقييمات تصميم مشترك أو ميزانيات استقلالية بعد" />

  const coDesignedCount = assessments.filter((a) => a.is_plan_codesigned).length
  const totalBarriers = assessments.reduce(
    (sum, a) => sum + a.environmental_barriers.length + a.attitudinal_barriers.length + a.institutional_barriers.length,
    0,
  )
  const latestBudget = budgets[0]
  const latestRatio = latestBudget ? Math.round(latestBudget.independence_ratio * 100) : 0

  const barrierColor: Record<string, string> = {
    environmental: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    attitudinal: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    institutional: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="التقييمات" value={assessments.length} accent="navy" />
        <StatCard title="مُصمّم مشتركاً" value={coDesignedCount} accent="teal" />
        <StatCard title="عوائق محددة" value={totalBarriers} accent="gold" />
        <StatCard title="نسبة الاستقلالية" value={`${latestRatio}%`} accent={latestRatio >= 50 ? 'teal' : latestRatio >= 30 ? 'gold' : 'danger'} />
      </div>

      {/* CRPD Assessments */}
      <div>
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Handshake className="h-5 w-5 text-teal" />
          تقييمات التصميم المشترك (CRPD)
        </h3>
        <div className="space-y-3">
          {assessments.map((assessment) => (
            <motion.div key={assessment.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-bold text-slate-900 dark:text-white">{assessment.assessor_name}</span>
                      <span className="text-xs text-slate-500">{assessment.assessment_date}</span>
                    </div>
                    <Badge className={assessment.is_plan_codesigned ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}>
                      {assessment.is_plan_codesigned ? 'تصميم مشترك' : 'غير مشترك'}
                    </Badge>
                  </div>

                  {/* Barriers */}
                  {(assessment.environmental_barriers.length > 0 || assessment.attitudinal_barriers.length > 0 || assessment.institutional_barriers.length > 0) && (
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-slate-500">العوائق المحددة</p>
                      <div className="flex flex-wrap gap-2">
                        {assessment.environmental_barriers.map((b, i) => (
                          <Badge key={`env-${i}`} className={barrierColor.environmental}>بيئي: {(b as Record<string, string>).description}</Badge>
                        ))}
                        {assessment.attitudinal_barriers.map((b, i) => (
                          <Badge key={`att-${i}`} className={barrierColor.attitudinal}>سلوكي: {(b as Record<string, string>).description}</Badge>
                        ))}
                        {assessment.institutional_barriers.map((b, i) => (
                          <Badge key={`inst-${i}`} className={barrierColor.institutional}>مؤسسي: {(b as Record<string, string>).description}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Aspirations & Support */}
                  <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    {assessment.personal_aspirations && (
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                        <span className="text-slate-500">الطموحات: </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{assessment.personal_aspirations}</span>
                      </div>
                    )}
                    {assessment.required_support_services && (
                      <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                        <span className="text-slate-500">الخدمات المطلوبة: </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">{assessment.required_support_services}</span>
                      </div>
                    )}
                  </div>

                  {/* Stakeholders */}
                  {assessment.participating_stakeholders && (
                    <p className="text-xs text-slate-500">المشاركون: {assessment.participating_stakeholders}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Independence Budget Comparison */}
      {budgets.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Wallet className="h-5 w-5 text-gold" />
            تحليل ميزانية الاستقلالية
          </h3>
          <div className="space-y-3">
            {budgets.map((budget) => {
              const ratio = Math.round(budget.independence_ratio * 100)
              return (
                <motion.div key={budget.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Card className={cn(ratio >= 50 && 'border-s-4 border-s-emerald-500')}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">{budget.fiscal_year}</Badge>
                          <span className="text-xs text-slate-500">{budget.analysis_date}</span>
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                          {budget.total_budget.toLocaleString('ar-SA')} ر.س
                        </span>
                      </div>

                      {/* Independence Ratio Progress */}
                      <div className="flex items-center gap-3">
                        <span className="min-w-[5rem] text-xs text-slate-500">نسبة الاستقلالية</span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <motion.div
                            className={cn(
                              'h-full rounded-full',
                              ratio >= 50 ? 'bg-emerald-500' : ratio >= 30 ? 'bg-amber-500' : 'bg-red-500',
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${ratio}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="min-w-[3rem] text-left text-sm font-bold text-slate-700 dark:text-slate-300">{ratio}%</span>
                      </div>

                      {/* Spending Breakdown */}
                      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                          <span className="text-slate-500">إنفاق الاعتماد</span>
                          <p className="font-bold text-slate-700 dark:text-slate-300">{budget.dependency_spending.toLocaleString('ar-SA')}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                          <span className="text-slate-500">إنفاق الاستقلالية</span>
                          <p className="font-bold text-slate-700 dark:text-slate-300">{budget.independence_spending.toLocaleString('ar-SA')}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                          <span className="text-slate-500">ميزانية التدريب</span>
                          <p className="font-bold text-slate-700 dark:text-slate-300">{budget.training_budget.toLocaleString('ar-SA')}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                          <span className="text-slate-500">الدمج المجتمعي</span>
                          <p className="font-bold text-slate-700 dark:text-slate-300">{budget.community_integration_budget.toLocaleString('ar-SA')}</p>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {budget.recommendations && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          التوصيات: {budget.recommendations}
                        </p>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
