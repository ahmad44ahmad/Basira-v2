import { useState } from 'react'
import { Sparkles, Heart, Plus, ChevronDown, ChevronUp, TrendingUp, Award } from 'lucide-react'
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
  type GoalStatus, type GoalDomain,
} from '../types'
import { useRehabGoals, useDignityProfile, useCreateRehabGoal } from '../api/empowerment-queries'
import { DEMO_LOGS } from '../api/demo-data'

// ─── Main Page ──────────────────────────────────────────────────

export function EmpowermentPage() {
  const [activeTab, setActiveTab] = useState('goals')

  const tabs = [
    { id: 'goals', label: 'الأهداف التأهيلية' },
    { id: 'dignity', label: 'ملف الكرامة' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="التمكين وجودة الحياة"
        description="الأهداف التأهيلية SMART وملف الكرامة (إحسان)"
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
                <Card className={cn(goal.status === 'achieved' && 'border-r-4 border-r-emerald-500')}>
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
                      <button className="mt-1 text-slate-400">
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

function AddGoalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [domain, setDomain] = useState<GoalDomain | ''>('')
  const [form, setForm] = useState({ goalTitle: '', goalDescription: '', measurementType: 'numeric', measurementUnit: '', baselineValue: '', targetValue: '', startDate: '', targetDate: '', assignedTo: '' })
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const createGoal = useCreateRehabGoal()
  const handleSubmit = () => {
    createGoal.mutate({
      beneficiary_id: '',
      domain: domain || 'physical',
      goal_title: form.goalTitle,
      goal_description: form.goalDescription || null,
      measurement_type: form.measurementType || null,
      measurement_unit: form.measurementUnit || null,
      baseline_value: form.baselineValue ? Number(form.baselineValue) : null,
      target_value: form.targetValue ? Number(form.targetValue) : null,
      current_value: null,
      quality_of_life_dimension: null,
      start_date: form.startDate || null,
      target_date: form.targetDate || null,
      assigned_to: form.assignedTo || null,
      assigned_department: null,
      status: 'active',
      progress_percentage: 0,
      achievement_evidence: null,
      barriers_notes: null,
      family_involvement: null,
      linked_national_goal: null,
    })
    toast.success('تم إنشاء الهدف التأهيلي')
    onClose()
    setStep(1)
    setDomain('')
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
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={REHAB_DOMAINS.find((d) => d.value === domain)!.color}>
              {REHAB_DOMAINS.find((d) => d.value === domain)!.emoji} {REHAB_DOMAINS.find((d) => d.value === domain)!.label}
            </Badge>
            <button onClick={() => setStep(1)} className="text-xs text-teal hover:underline">تغيير</button>
          </div>

          <Input label="عنوان الهدف" value={form.goalTitle} onChange={(e) => update('goalTitle', e.target.value)} placeholder="مثال: المشي باستقلالية لمسافة 50 متر" />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">وصف الهدف</label>
            <textarea value={form.goalDescription} onChange={(e) => update('goalDescription', e.target.value)} rows={2} placeholder="وصف تفصيلي للهدف..." className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select label="نوع القياس" value={form.measurementType} onChange={(e) => update('measurementType', e.target.value)} options={MEASUREMENT_TYPES.map((m) => ({ value: m.value, label: `${m.label} (${m.example})` }))} />
            <Input label="وحدة القياس" value={form.measurementUnit} onChange={(e) => update('measurementUnit', e.target.value)} placeholder="متر، كلمة، دقيقة..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="القيمة الأساسية" type="number" value={form.baselineValue} onChange={(e) => update('baselineValue', e.target.value)} />
            <Input label="القيمة المستهدفة" type="number" value={form.targetValue} onChange={(e) => update('targetValue', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="تاريخ البداية" type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} />
            <Input label="تاريخ الإنجاز المستهدف" type="date" value={form.targetDate} onChange={(e) => update('targetDate', e.target.value)} />
          </div>
          <Input label="الأخصائي المسؤول" value={form.assignedTo} onChange={(e) => update('assignedTo', e.target.value)} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>رجوع</Button>
            <Button variant="gold" onClick={handleSubmit} disabled={!form.goalTitle.trim() || !form.targetDate}>إنشاء الهدف</Button>
          </div>
        </div>
      )}
    </Modal>
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
      <Card className="border-r-4 border-r-gold">
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
