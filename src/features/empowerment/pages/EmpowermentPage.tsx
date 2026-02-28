import { useState } from 'react'
import { Sparkles, Target, Heart, Plus, ChevronDown, ChevronUp, TrendingUp, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge, Modal, Input, Select, Tabs } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  REHAB_DOMAINS, GOAL_STATUS_CONFIG, QOL_DIMENSIONS, MEASUREMENT_TYPES, SESSION_TYPES,
  PERSONALITY_TYPES, COMMUNICATION_STYLES, PRESET_ACTIVITIES, PRESET_CALMING, PRESET_MOTIVATORS,
  type RehabGoal, type GoalStatus, type GoalDomain, type GoalProgressLog, type DignityProfile,
} from '../types'

// ─── Demo Data ──────────────────────────────────────────────────

const DEMO_GOALS: RehabGoal[] = [
  { id: 'g1', beneficiaryId: 'b1', beneficiaryName: 'أحمد محمد السالم', domain: 'physical', goalTitle: 'المشي باستقلالية لمسافة 50 متر', goalDescription: 'تحسين القدرة على المشي المستقل باستخدام المشاية ثم بدونها', measurementType: 'numeric', measurementUnit: 'متر', baselineValue: 10, targetValue: 50, currentValue: 35, startDate: '2026-01-15', targetDate: '2026-04-15', assignedTo: 'أ. سعيد', assignedDepartment: 'العلاج الطبيعي', status: 'in_progress', progressPercentage: 70, qualityOfLifeDimension: 'physical_wellbeing', createdAt: '2026-01-15', updatedAt: '2026-02-28' },
  { id: 'g2', beneficiaryId: 'b1', beneficiaryName: 'أحمد محمد السالم', domain: 'speech', goalTitle: 'نطق 20 كلمة جديدة بوضوح', goalDescription: 'تحسين النطق والتواصل اللفظي من خلال جلسات تخاطب مكثفة', measurementType: 'numeric', measurementUnit: 'كلمة', baselineValue: 5, targetValue: 20, currentValue: 14, startDate: '2026-01-20', targetDate: '2026-05-20', assignedTo: 'أ. هند', assignedDepartment: 'التخاطب', status: 'in_progress', progressPercentage: 60, qualityOfLifeDimension: 'interpersonal_relations', createdAt: '2026-01-20', updatedAt: '2026-02-25' },
  { id: 'g3', beneficiaryId: 'b2', beneficiaryName: 'فاطمة عبدالله الزهراني', domain: 'self_care', goalTitle: 'ارتداء الملابس باستقلالية', goalDescription: 'القدرة على ارتداء الملابس الأساسية بدون مساعدة', measurementType: 'milestone', startDate: '2026-02-01', targetDate: '2026-06-01', assignedTo: 'أ. نورة', assignedDepartment: 'العلاج الوظيفي', status: 'in_progress', progressPercentage: 40, qualityOfLifeDimension: 'self_determination', createdAt: '2026-02-01', updatedAt: '2026-02-20' },
  { id: 'g4', beneficiaryId: 'b3', beneficiaryName: 'خالد سعيد الغامدي', domain: 'psychological', goalTitle: 'تقليل نوبات القلق الأسبوعية', goalDescription: 'خفض عدد نوبات القلق من 5 إلى 1 أسبوعياً', measurementType: 'frequency', measurementUnit: 'مرات/أسبوع', baselineValue: 5, targetValue: 1, currentValue: 2, startDate: '2026-01-10', targetDate: '2026-04-10', assignedTo: 'د. سارة', assignedDepartment: 'الطب النفسي', status: 'in_progress', progressPercentage: 75, createdAt: '2026-01-10', updatedAt: '2026-02-28' },
  { id: 'g5', beneficiaryId: 'b2', beneficiaryName: 'فاطمة عبدالله الزهراني', domain: 'social', goalTitle: 'المشاركة في 3 أنشطة جماعية شهرياً', goalDescription: 'تعزيز الدمج الاجتماعي عبر المشاركة الفعالة في الأنشطة', measurementType: 'frequency', measurementUnit: 'نشاط/شهر', baselineValue: 0, targetValue: 3, currentValue: 3, startDate: '2026-01-01', targetDate: '2026-03-01', assignedTo: 'أ. هند', status: 'achieved', progressPercentage: 100, createdAt: '2026-01-01', updatedAt: '2026-02-28' },
]

const DEMO_DIGNITY: DignityProfile = {
  id: 'd1', beneficiaryId: 'b1', preferredName: 'أبو خالد', preferredTitle: 'أبو خالد',
  communicationStyle: 'verbal', personalityType: 'social',
  preferredActivities: ['المشي', 'مشاهدة التلفاز', 'الصلاة'],
  hobbies: ['الرسم', 'القراءة'],
  calmingStrategies: ['الاستماع للقرآن', 'المشي الهادئ'],
  motivators: ['الثناء اللفظي', 'مكالمة العائلة'],
  favoriteFoods: ['كبسة', 'مندي', 'حلويات'],
  whatMakesMeHappy: 'زيارة العائلة والتحدث مع الأبناء',
  whatMakesMeUpset: 'الضوضاء العالية والتأخر في المواعيد',
  myDreams: 'أن أمشي بدون مساعدة وأزور الحرم',
  wakeUpTime: '06:00', sleepTime: '22:00',
  lastUpdated: '2026-02-20',
}

const DEMO_LOGS: GoalProgressLog[] = [
  { id: 'pl1', goalId: 'g1', recordedValue: 35, previousValue: 30, progressNote: 'تحسن ملحوظ في التوازن أثناء المشي', sessionType: 'individual', sessionDurationMinutes: 45, beneficiaryFeedback: 'أشعر بتحسن', recordedBy: 'أ. سعيد', recordedAt: '2026-02-28' },
  { id: 'pl2', goalId: 'g1', recordedValue: 30, previousValue: 25, progressNote: 'استطاع المشي بالمشاية بثقة أكبر', sessionType: 'individual', sessionDurationMinutes: 40, recordedBy: 'أ. سعيد', recordedAt: '2026-02-21' },
  { id: 'pl3', goalId: 'g1', recordedValue: 25, previousValue: 15, progressNote: 'بدأ باستخدام المشاية بشكل مستقل', sessionType: 'individual', sessionDurationMinutes: 30, recordedBy: 'أ. سعيد', recordedAt: '2026-02-14' },
]

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
  const [goals] = useState(DEMO_GOALS)
  const [filterDomain, setFilterDomain] = useState<GoalDomain | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('all')
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = goals.filter((g) =>
    (filterDomain === 'all' || g.domain === filterDomain) &&
    (filterStatus === 'all' || g.status === filterStatus),
  )

  const stats = {
    total: goals.length,
    inProgress: goals.filter((g) => g.status === 'in_progress').length,
    achieved: goals.filter((g) => g.status === 'achieved').length,
    avgProgress: Math.round(goals.reduce((sum, g) => sum + g.progressPercentage, 0) / (goals.length || 1)),
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
            const domainConfig = REHAB_DOMAINS.find((d) => d.value === goal.domain)!
            const statusConfig = GOAL_STATUS_CONFIG[goal.status]
            const isExpanded = expandedGoal === goal.id

            return (
              <motion.div key={goal.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card className={cn(goal.status === 'achieved' && 'border-r-4 border-r-emerald-500')}>
                  <div className="cursor-pointer" onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={domainConfig.color}>{domainConfig.emoji} {domainConfig.label}</Badge>
                          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                          {goal.status === 'achieved' && <Award className="h-4 w-4 text-amber-500" />}
                        </div>
                        <h3 className="mt-1.5 font-bold text-slate-900 dark:text-white">{goal.goalTitle}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{goal.beneficiaryName}</p>

                        {/* Progress bar */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <motion.div
                              className={cn('h-full rounded-full', goal.progressPercentage >= 100 ? 'bg-emerald-500' : goal.progressPercentage >= 50 ? 'bg-teal' : 'bg-gold')}
                              initial={{ width: 0 }}
                              animate={{ width: `${goal.progressPercentage}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{goal.progressPercentage}%</span>
                        </div>

                        {/* Measurement info */}
                        {goal.baselineValue !== undefined && goal.targetValue !== undefined && (
                          <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                            <span>📏 الأساسي: {goal.baselineValue} {goal.measurementUnit}</span>
                            <span>📊 الحالي: {goal.currentValue} {goal.measurementUnit}</span>
                            <span>🎯 المستهدف: {goal.targetValue} {goal.measurementUnit}</span>
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
                          <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{goal.goalDescription}</p>
                          <div className="mb-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <span className="text-slate-500">الأخصائي</span>
                              <p className="font-medium">{goal.assignedTo || '—'}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <span className="text-slate-500">القسم</span>
                              <p className="font-medium">{goal.assignedDepartment || '—'}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <span className="text-slate-500">تاريخ البداية</span>
                              <p className="font-medium">{goal.startDate}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                              <span className="text-slate-500">تاريخ الإنجاز</span>
                              <p className="font-medium">{goal.targetDate}</p>
                            </div>
                          </div>

                          {/* Progress logs */}
                          <h4 className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                            <TrendingUp className="h-4 w-4" /> سجل الجلسات
                          </h4>
                          <div className="space-y-2">
                            {DEMO_LOGS.filter((l) => l.goalId === goal.id).map((log) => (
                              <div key={log.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="font-medium">{log.recordedBy}</span>
                                    <Badge variant="outline">{SESSION_TYPES.find((s) => s.value === log.sessionType)?.label}</Badge>
                                    {log.sessionDurationMinutes && <span className="text-slate-500">{log.sessionDurationMinutes} دقيقة</span>}
                                  </div>
                                  <span className="text-xs text-slate-500">{log.recordedAt}</span>
                                </div>
                                {log.recordedValue !== undefined && log.previousValue !== undefined && (
                                  <div className="mt-1 flex items-center gap-2 text-xs">
                                    <span className="text-slate-500">{log.previousValue} → {log.recordedValue}</span>
                                    <span className={log.recordedValue > log.previousValue ? 'text-emerald-600' : 'text-red-600'}>
                                      {log.recordedValue > log.previousValue ? '↑' : '↓'} {Math.abs(log.recordedValue - log.previousValue)}
                                    </span>
                                  </div>
                                )}
                                {log.progressNote && <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{log.progressNote}</p>}
                                {log.beneficiaryFeedback && (
                                  <p className="mt-1 text-xs italic text-teal">💬 {log.beneficiaryFeedback}</p>
                                )}
                              </div>
                            ))}
                            {DEMO_LOGS.filter((l) => l.goalId === goal.id).length === 0 && (
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

  const handleSubmit = () => {
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
  const [profile] = useState(DEMO_DIGNITY)

  const personalityConfig = PERSONALITY_TYPES.find((p) => p.value === profile.personalityType)!
  const commConfig = COMMUNICATION_STYLES.find((c) => c.value === profile.communicationStyle)!

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
              <Badge variant="outline">{personalityConfig.emoji} {personalityConfig.label}</Badge>
              <Badge variant="outline">{commConfig.emoji} {commConfig.label}</Badge>
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
              <p className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-400">☀️ {profile.wakeUpTime}</p>
            </div>
            <div className="rounded-lg bg-indigo-50 p-3 text-center dark:bg-indigo-900/20">
              <p className="text-xs text-slate-500">وقت النوم</p>
              <p className="mt-1 text-lg font-bold text-indigo-700 dark:text-indigo-400">🌙 {profile.sleepTime}</p>
            </div>
          </div>
        </Card>

        {/* Favorites */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">الأطعمة المفضلة</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {profile.favoriteFoods.map((food) => (
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
                {profile.preferredActivities.map((a) => (
                  <Badge key={a} className="bg-teal/10 text-teal">{a}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-500">الهوايات</p>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((h) => (
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
                {profile.calmingStrategies.map((c) => (
                  <Badge key={c} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">😌 {c}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-slate-500">المحفزات</p>
              <div className="flex flex-wrap gap-2">
                {profile.motivators.map((m) => (
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
