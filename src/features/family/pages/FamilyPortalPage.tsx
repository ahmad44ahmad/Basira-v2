import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Heart, Calendar, MessageCircle, Image, Video, Trophy, Phone, Send,
  ThumbsUp, Plus, Clock, ClipboardCheck, Users,
  FileText, Target, BarChart3, Star,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, Badge, Input, Modal, Tabs, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  VISIT_TYPES, UPDATE_TYPE_CONFIG,
  VISIT_RECORD_TYPES, VISITOR_RELATIONS, FAMILY_INTEGRATION_LEVELS, EXTERNAL_VISIT_CHECKLIST,
  PLAN_DURATIONS, ENGAGEMENT_LEVELS, COUNSELING_STATUS_CONFIG,
  type FeedPost, type FamilyUpdate, type VisitType,
} from '../types'
import { useVisits, useFamilyFeed, useFamilyUpdates } from '../api/family-queries'
import { useVisitRecords } from '../api/visit-queries'
import { useCounselingCases } from '../api/counseling-queries'
import type { VisitRecord, FamilyCounselingCase } from '@/types/database'

// ─── Main Page ──────────────────────────────────────────────────

const GOALS_PROGRESS = [
  { id: 'g1', title: 'المشي باستقلالية', domain: '🦿 علاج طبيعي', progress: 70 },
  { id: 'g2', title: 'نطق 20 كلمة جديدة', domain: '🗣️ تخاطب', progress: 60 },
  { id: 'g3', title: 'ارتداء الملابس', domain: '🪥 عناية ذاتية', progress: 40 },
]

export function FamilyPortalPage() {
  const [activeTab, setActiveTab] = useState('updates')
  const { data: visits = [] } = useVisits()
  const { data: updates = [] } = useFamilyUpdates()

  const tabs = [
    { id: 'updates', label: 'التحديثات' },
    { id: 'visits', label: 'الزيارات' },
    { id: 'visitRecords', label: 'سجل الزيارات' },
    { id: 'counseling', label: 'الإرشاد الأسري' },
    { id: 'feed', label: 'البث الإعلامي' },
    { id: 'goals', label: 'الأهداف' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="بوابة الأسرة"
        description="متابعة أحوال المستفيدين والتواصل مع المركز"
        icon={<Heart className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Phone className="h-4 w-4" />}>اتصال</Button>
            <Button variant="gold" size="sm" icon={<MessageCircle className="h-4 w-4" />}>رسالة</Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="الأهداف النشطة" value={GOALS_PROGRESS.length} accent="teal" />
        <StatCard title="الزيارات هذا الشهر" value={visits.filter((v) => v.date?.startsWith(new Date().toISOString().slice(0, 7))).length} accent="navy" />
        <StatCard title="متوسط التقدم" value={`${Math.round(GOALS_PROGRESS.reduce((s, g) => s + g.progress, 0) / GOALS_PROGRESS.length)}%`} accent="gold" />
        <StatCard title="التحديثات الجديدة" value={updates.length} accent="teal" />
      </div>

      <Tabs
        tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'updates' && <UpdatesSection />}
        {activeTab === 'visits' && <VisitsSection />}
        {activeTab === 'visitRecords' && <VisitRecordsSection />}
        {activeTab === 'counseling' && <CounselingSection />}
        {activeTab === 'feed' && <FeedSection />}
        {activeTab === 'goals' && <GoalsSection />}
      </div>
    </div>
  )
}

// ─── Updates Section ────────────────────────────────────────────

function UpdatesSection() {
  const { data: updates = [], isLoading, error } = useFamilyUpdates()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (updates.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد تحديثات جديدة حالياً" />

  return (
    <div className="space-y-3">
      {updates.map((update) => {
        const config = UPDATE_TYPE_CONFIG[update.type as FamilyUpdate['type']]
        return (
          <motion.div key={update.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <div className="flex items-start gap-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg', config.color)}>
                  {config.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{update.title}</h3>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{update.description ?? (update as Record<string, unknown>).content as string}</p>
                  <p className="mt-1 text-xs text-slate-400">{update.date}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Visits Section ─────────────────────────────────────────────

function VisitsSection() {
  const { data: visits = [], isLoading, error } = useVisits()
  const [filterType, setFilterType] = useState<VisitType | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (visits.length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم تسجيل أي زيارات بعد" />

  const filtered = filterType === 'all' ? visits : visits.filter((v) => v.type === filterType)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
          >
            الكل
          </button>
          {VISIT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === t.value ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
          تسجيل زيارة
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((visit) => {
            const typeConfig = VISIT_TYPES.find((t) => t.value === visit.type)
            return (
              <motion.div key={visit.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card>
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg', typeConfig?.color)}>
                      {typeConfig?.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{visit.beneficiaryName}</h3>
                        {typeConfig && <Badge className={typeConfig.color}>{typeConfig.label}</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{visit.notes}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>👤 {visit.visitorName} ({visit.relation})</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{visit.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{visit.time}</span>
                        {visit.duration && <span>⏱️ {visit.duration} دقيقة</span>}
                        <span>📝 {visit.employeeName}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد زيارات</div>}
      </div>

      <AddVisitModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  )
}

const visitSchema = z.object({
  beneficiaryName: z.string().min(1, 'اسم المستفيد مطلوب'),
  type: z.enum(['internal', 'external']).default('internal'),
  date: z.string().optional(),
  time: z.string().optional(),
  visitorName: z.string().optional(),
  relation: z.string().optional(),
  notes: z.string().optional(),
})

type VisitFormData = z.infer<typeof visitSchema>

function AddVisitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: { type: 'internal' },
  })

  const onSubmit = (_data: VisitFormData) => {
    toast.success('تم تسجيل الزيارة')
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="تسجيل زيارة جديدة">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="المستفيد" {...register('beneficiaryName')} error={errors.beneficiaryName?.message} placeholder="اسم المستفيد..." />
        <div className="grid grid-cols-3 gap-4">
          <Input label="اسم الزائر" {...register('visitorName')} error={errors.visitorName?.message} />
          <Input label="صلة القرابة" {...register('relation')} error={errors.relation?.message} placeholder="والد، أخ..." />
          <Input label="التاريخ" type="date" {...register('date')} error={errors.date?.message} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">ملاحظات</label>
          <textarea {...register('notes')} rows={2} placeholder="ملاحظات عن الزيارة..." className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>إلغاء</Button>
          <Button variant="gold" type="submit">تسجيل</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Visit Records Section (سجل الزيارات الشامل) ────────────────

function getChecklistCount(record: VisitRecord): number {
  const keys: (keyof VisitRecord)[] = [
    'checklist_medical_exam', 'checklist_personal_hygiene', 'checklist_medications_delivered',
    'checklist_clothing_sufficient', 'checklist_weight_monitored', 'checklist_medications_given',
    'checklist_clothing_returned', 'checklist_care_instructions', 'checklist_diet_followed',
    'checklist_hospital_appointments', 'checklist_development_plans',
  ]
  return keys.filter((k) => record[k] === true).length
}

function VisitRecordsSection() {
  const { data: records = [], isLoading, error } = useVisitRecords()
  const [filterType, setFilterType] = useState<'all' | 'internal' | 'external'>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (records.length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم تسجيل أي زيارات شاملة بعد" />

  const filtered = filterType === 'all' ? records : records.filter((r) => r.visit_type === filterType)
  const internalCount = records.filter((r) => r.visit_type === 'internal').length
  const externalCount = records.filter((r) => r.visit_type === 'external').length
  const avgCompanions = records.length > 0
    ? Math.round((records.reduce((sum, r) => sum + r.companion_count, 0) / records.length) * 10) / 10
    : 0

  return (
    <>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الزيارات" value={records.length} accent="navy" />
        <StatCard title="زيارات داخلية" value={internalCount} accent="teal" />
        <StatCard title="زيارات خارجية" value={externalCount} accent="gold" />
        <StatCard title="متوسط المرافقين" value={avgCompanions} accent="teal" />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilterType('all')}
          className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
        >
          الكل ({records.length})
        </button>
        {VISIT_RECORD_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setFilterType(t.value)}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === t.value ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Card List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((record) => {
            const typeConfig = VISIT_RECORD_TYPES.find((t) => t.value === record.visit_type)
            const relationConfig = VISITOR_RELATIONS.find((r) => r.value === record.visitor_relation)
            const integrationConfig = FAMILY_INTEGRATION_LEVELS.find((l) => l.value === record.family_integration)
            const checklistDone = getChecklistCount(record)

            return (
              <motion.div key={record.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card>
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg', typeConfig?.color)}>
                      {typeConfig?.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{record.visitor_name}</h3>
                        {typeConfig && <Badge className={typeConfig.color}>{typeConfig.label}</Badge>}
                        {relationConfig && (
                          <Badge variant="outline">{relationConfig.label}</Badge>
                        )}
                      </div>

                      {/* Purpose */}
                      {record.visit_purpose && (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{record.visit_purpose}</p>
                      )}

                      {/* Meta row */}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{record.visit_date}</span>
                        {record.arrival_time && (
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{record.arrival_time} - {record.departure_time}</span>
                        )}
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{record.companion_count} مرافقين</span>
                        {record.specialist_name && <span>📝 {record.specialist_name}</span>}
                      </div>

                      {/* External visit checklist progress */}
                      {record.visit_type === 'external' && (
                        <div className="mt-2 flex items-center gap-2">
                          <ClipboardCheck className="h-4 w-4 text-slate-400" />
                          <div className="h-2 flex-1 max-w-[200px] overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                            <div
                              className={cn('h-full rounded-full transition-all', checklistDone === 11 ? 'bg-emerald-500' : checklistDone >= 6 ? 'bg-teal' : 'bg-amber-500')}
                              style={{ width: `${(checklistDone / 11) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">{checklistDone}/11</span>
                        </div>
                      )}

                      {/* Family integration badge */}
                      {integrationConfig && (
                        <div className="mt-2">
                          <Badge className={integrationConfig.color}>
                            الدمج الأسري: {integrationConfig.label}
                          </Badge>
                        </div>
                      )}

                      {/* Guardian notes */}
                      {record.guardian_notes && (
                        <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                          💬 {record.guardian_notes}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد زيارات</div>}
      </div>
    </>
  )
}

// ─── Counseling Section (الإرشاد الأسري) ────────────────────────

function CounselingSection() {
  const { data: cases = [], isLoading, error } = useCounselingCases()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (cases.length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم تسجيل أي حالات إرشاد أسري بعد" />

  const activeCases = cases.filter((c) => c.status === 'active').length
  const completedCases = cases.filter((c) => c.status === 'completed').length
  const casesWithSatisfaction = cases.filter((c) => c.satisfaction_score != null)
  const avgSatisfaction = casesWithSatisfaction.length > 0
    ? Math.round((casesWithSatisfaction.reduce((sum, c) => sum + (c.satisfaction_score ?? 0), 0) / casesWithSatisfaction.length) * 10) / 10
    : 0

  return (
    <>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الحالات" value={cases.length} accent="navy" />
        <StatCard title="حالات نشطة" value={activeCases} accent="teal" />
        <StatCard title="حالات مكتملة" value={completedCases} accent="gold" />
        <StatCard title="متوسط الرضا" value={avgSatisfaction > 0 ? `${avgSatisfaction}/10` : '-'} accent="teal" />
      </div>

      {/* Case Cards */}
      <div className="space-y-4">
        {cases.map((counselingCase) => (
          <CounselingCaseCard key={counselingCase.id} counselingCase={counselingCase} />
        ))}
      </div>
    </>
  )
}

function CounselingCaseCard({ counselingCase }: { counselingCase: FamilyCounselingCase }) {
  const statusConfig = COUNSELING_STATUS_CONFIG[counselingCase.status]
  const engagementConfig = ENGAGEMENT_LEVELS.find((e) => e.value === counselingCase.beneficiary_engagement)
  const durationConfig = PLAN_DURATIONS.find((d) => d.value === counselingCase.target_plan_duration)

  // Collect therapy targets as small badges
  const targets: { label: string; value: string | null }[] = [
    { label: 'الاستقلالية', value: counselingCase.independence_target },
    { label: 'المعرفي', value: counselingCase.cognitive_target },
    { label: 'الاجتماعي', value: counselingCase.social_target },
    { label: 'المهني', value: counselingCase.vocational_target },
    { label: 'العلاج الطبيعي', value: counselingCase.pt_target },
    { label: 'العلاج الوظيفي', value: counselingCase.ot_target },
    { label: 'التخاطب', value: counselingCase.speech_target },
    { label: 'النفسي', value: counselingCase.psych_target },
    { label: 'التغذية', value: counselingCase.nutrition_target },
    { label: 'الطبي', value: counselingCase.medical_target },
  ]
  const activeTargets = targets.filter((t) => t.value)

  // Evaluation scores for completed cases
  const evalScores: { label: string; value: number | null }[] = [
    { label: 'الرضا', value: counselingCase.satisfaction_score },
    { label: 'الزيارات', value: counselingCase.visits_score },
    { label: 'الدمج', value: counselingCase.integration_score },
    { label: 'البرامج', value: counselingCase.programs_score },
    { label: 'المقابلات', value: counselingCase.interviews_score },
    { label: 'المبادرات', value: counselingCase.initiatives_score },
  ]
  const hasEvalScores = evalScores.some((s) => s.value != null)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <div className="space-y-3">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal/10 text-lg">
              <FileText className="h-5 w-5 text-teal" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {counselingCase.medical_diagnosis ?? 'حالة إرشاد أسري'}
                </h3>
                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />تاريخ الإحالة: {counselingCase.referral_date}</span>
                {counselingCase.counselor_name && <span>📝 {counselingCase.counselor_name}</span>}
              </div>
            </div>
          </div>

          {/* Engagement + Duration */}
          <div className="flex flex-wrap gap-2">
            {engagementConfig && (
              <Badge className={engagementConfig.color}>
                التفاعل: {engagementConfig.label}
              </Badge>
            )}
            {durationConfig && (
              <Badge variant="outline">
                <Clock className="ms-1 inline h-3 w-3" />
                {durationConfig.label}
              </Badge>
            )}
          </div>

          {/* Therapy Targets */}
          {activeTargets.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                <Target className="h-3.5 w-3.5" /> الأهداف العلاجية ({activeTargets.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeTargets.map((t) => (
                  <span
                    key={t.label}
                    className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    title={t.value ?? undefined}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Plan Phases */}
          {Array.isArray(counselingCase.plan_phases) && counselingCase.plan_phases.length > 0 && (
            <div>
              <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                <BarChart3 className="h-3.5 w-3.5" /> مراحل الخطة ({counselingCase.plan_phases.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {counselingCase.plan_phases.map((phase, idx) => {
                  const p = phase as { phase?: string; description?: string }
                  return (
                    <div
                      key={idx}
                      className="flex min-w-[140px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 dark:border-slate-700 dark:bg-slate-800/50"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal/10 text-[10px] font-bold text-teal">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300">{p.phase ?? `المرحلة ${idx + 1}`}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Evaluation Scores (completed cases) */}
          {hasEvalScores && (
            <div>
              <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                <Star className="h-3.5 w-3.5" /> درجات التقييم
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {evalScores.map((score) => (
                  <div
                    key={score.label}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <p className="text-[10px] text-slate-500">{score.label}</p>
                    <p className={cn(
                      'mt-0.5 text-sm font-bold',
                      score.value == null
                        ? 'text-slate-300 dark:text-slate-600'
                        : score.value >= 8
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : score.value >= 5
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400',
                    )}>
                      {score.value ?? '-'}
                    </p>
                    {score.value != null && (
                      <div className="mx-auto mt-1 h-1 w-full max-w-[40px] overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            score.value >= 8 ? 'bg-emerald-500' : score.value >= 5 ? 'bg-amber-500' : 'bg-red-500',
                          )}
                          style={{ width: `${(score.value / 10) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Family acceptance note */}
          {counselingCase.family_acceptance && (
            <p className="rounded-lg bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
              👨‍👩‍👦 {counselingCase.family_acceptance}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

// ─── Feed Section ───────────────────────────────────────────────

function FeedSection() {
  const { data: fetchedPosts = [], isLoading, error } = useFamilyFeed()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const displayPosts = posts.length > 0 ? posts : fetchedPosts

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (displayPosts.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد منشورات في البث الإعلامي حالياً" />

  const toggleLike = (id: string) => {
    const current = posts.length > 0 ? posts : fetchedPosts
    setPosts(current.map((p) =>
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p,
    ))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {displayPosts.map((post) => (
        <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            {/* Author */}
            <div className="flex items-center gap-3">
              {post.author && typeof post.author === 'object' && (
                <>
                  <span className="text-2xl">{post.author.avatar}</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{post.author.name}</p>
                    <p className="text-xs text-slate-500">{post.author.role} · {post.timestamp}</p>
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{post.content}</p>

            {/* Milestone highlight */}
            {post.type === 'milestone' && (
              <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400">
                  <Trophy className="h-4 w-4" /> إنجاز جديد!
                </div>
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">تم تحديث سجل الإنجازات في ملف التمكين</p>
              </div>
            )}

            {/* Media placeholder */}
            {post.mediaColor && post.type !== 'milestone' && (
              <div className={cn('mt-3 flex h-48 items-center justify-center rounded-xl', post.mediaColor)}>
                {post.type === 'video' ? (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 dark:bg-slate-800/80 shadow-lg">
                    <Video className="h-6 w-6 text-slate-700" />
                  </div>
                ) : (
                  <Image className="h-10 w-10 text-white/60" />
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={() => toggleLike(post.id)}
                className={cn('flex items-center gap-1 text-sm transition-colors', post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500')}
              >
                <ThumbsUp className={cn('h-4 w-4', post.isLiked && 'fill-current')} />
                {post.likes}
              </button>
              <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-teal">
                <MessageCircle className="h-4 w-4" />
                {post.comments ?? 0}
              </button>
              <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-teal">
                <Send className="h-4 w-4" />
                مشاركة
              </button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Goals Section ──────────────────────────────────────────────

function GoalsSection() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-l from-teal/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-xl">🎯</div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">متوسط التقدم الإجمالي</h3>
            <p className="text-sm text-slate-500">{GOALS_PROGRESS.length} أهداف نشطة</p>
          </div>
          <div className="ms-auto text-3xl font-bold text-teal">
            {Math.round(GOALS_PROGRESS.reduce((s, g) => s + g.progress, 0) / GOALS_PROGRESS.length)}%
          </div>
        </div>
      </Card>

      {GOALS_PROGRESS.map((goal) => (
        <Card key={goal.id}>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white">{goal.title}</h3>
                <Badge variant="outline">{goal.domain}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <motion.div
                    className={cn('h-full rounded-full', goal.progress >= 100 ? 'bg-emerald-500' : goal.progress >= 50 ? 'bg-teal' : 'bg-gold')}
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{goal.progress}%</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
