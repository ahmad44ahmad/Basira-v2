import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Users, FileText, Calendar, ClipboardList, Plus, Search, Eye,
  CheckCircle, XCircle, Send, Shirt, Wallet, AlertTriangle, Phone, MapPin,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, Badge, Input, Select, Modal, Tabs, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  LEAVE_STATUS_CONFIG, LEAVE_TYPES, TARGET_GROUPS, FOLLOW_UP_STATUS,
  INDEPENDENCE_LEVELS, MOBILITY_TYPES, RELATION_LEVELS, SHIFT_TYPES,
  REFERRAL_TYPES, URGENCY_LEVELS, REFERRAL_STATUS_CONFIG, NOTIFICATION_TYPES, INCIDENT_TYPES,
  SEASON_TYPES, CLOTHING_CONDITIONS, TRANSACTION_TYPES,
  ADVANCE_TYPES, ADVANCE_STATUS_CONFIG,
  type LeaveRequest, type LeaveStatus, type SocialActivity,
} from '../types'
import { useLeaveRequests, useSocialResearches, useSocialActivities } from '../api/social-queries'
import { useSocialFollowups, useDailyMonitorRounds } from '../api/monitoring-queries'
import { useReferrals, useFamilyNotifications, useIncidentReports } from '../api/referral-queries'
import { useClothingInventory, useClothingTransactions } from '../api/clothing-queries'
import { useActivityAdvances } from '../api/advance-queries'
import type { SocialFollowup, DailyMonitorRound, Referral, FamilyNotification, IncidentReport, ClothingInventory, ClothingTransaction, ActivityAdvance } from '@/types/database'

// ─── Main Page ──────────────────────────────────────────────────

export function SocialPage() {
  const [activeTab, setActiveTab] = useState('leaves')

  const tabs = [
    { id: 'leaves', label: 'طلبات الإجازات', icon: <Calendar className="h-4 w-4" /> },
    { id: 'research', label: 'البحث الاجتماعي', icon: <FileText className="h-4 w-4" /> },
    { id: 'activities', label: 'الأنشطة', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'monitoring', label: 'المتابعة والمراقبة', icon: <Eye className="h-4 w-4" /> },
    { id: 'referrals', label: 'التحويلات والتبليغات', icon: <Send className="h-4 w-4" /> },
    { id: 'clothing', label: 'الكسوة', icon: <Shirt className="h-4 w-4" /> },
    { id: 'advances', label: 'السلف والعهد', icon: <Wallet className="h-4 w-4" /> },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="الخدمات الاجتماعية"
        description="إدارة البحوث الاجتماعية والإجازات والأنشطة والتحويلات والكسوة"
        icon={<Users className="h-5 w-5" />}
      />

      <Tabs
        tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'leaves' && <LeavesSection />}
        {activeTab === 'research' && <ResearchSection />}
        {activeTab === 'activities' && <ActivitiesSection />}
        {activeTab === 'monitoring' && <MonitoringSection />}
        {activeTab === 'referrals' && <ReferralsSection />}
        {activeTab === 'clothing' && <ClothingSection />}
        {activeTab === 'advances' && <AdvancesSection />}
      </div>
    </div>
  )
}

// ─── Leaves Section ─────────────────────────────────────────────

function LeavesSection() {
  const { data: fetchedLeaves = [], isLoading, error } = useLeaveRequests()
  const [localLeaves, setLocalLeaves] = useState<LeaveRequest[] | null>(null)
  const leaves = localLeaves ?? fetchedLeaves
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (leaves.length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم تقديم أي طلبات إجازة بعد" />

  const filtered = filterStatus === 'all' ? leaves : leaves.filter((l) => l.status === filterStatus)

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === 'pending_medical' || l.status === 'pending_director').length,
    approved: leaves.filter((l) => l.status === 'approved').length,
    active: leaves.filter((l) => l.status === 'active').length,
  }

  const handleApprove = (id: string, step: 'medical' | 'director') => {
    const current = localLeaves ?? fetchedLeaves
    setLocalLeaves(
      current.map((l) => {
        if (l.id !== id) return l
        if (step === 'medical') {
          return { ...l, status: 'pending_director' as const, medicalClearance: { clearedBy: 'الطبيب', clearedAt: new Date().toISOString(), isFit: true }, history: [...(l.history ?? []), { action: 'medical_clear' as const, actionBy: 'الطبيب', role: 'طبيب', date: new Date().toISOString() }] }
        }
        return { ...l, status: 'approved' as const, history: [...(l.history ?? []), { action: 'approve' as const, actionBy: 'المدير', role: 'مدير', date: new Date().toISOString() }] }
      }),
    )
    toast.success(step === 'medical' ? 'تمت الموافقة الطبية' : 'تمت موافقة المدير')
  }

  const handleReject = (id: string) => {
    const current = localLeaves ?? fetchedLeaves
    setLocalLeaves(
      current.map((l) =>
        l.id === id ? { ...l, status: 'rejected' as const, history: [...(l.history ?? []), { action: 'reject' as const, actionBy: 'المستخدم', role: 'مسؤول', date: new Date().toISOString() }] } : l,
      ),
    )
    toast.error('تم رفض الطلب')
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الطلبات" value={stats.total} accent="navy" />
        <StatCard title="قيد الانتظار" value={stats.pending} accent="gold" />
        <StatCard title="معتمد" value={stats.approved} accent="teal" />
        <StatCard title="خارج المركز" value={stats.active} accent="danger" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending_medical', 'pending_director', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                filterStatus === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
              )}
            >
              {s === 'all' ? 'الكل' : LEAVE_STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
          طلب إجازة
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((leave) => {
            const typeConfig = LEAVE_TYPES.find((t) => t.value === leave.leaveType)!
            const statusConfig = LEAVE_STATUS_CONFIG[leave.status]
            return (
              <motion.div key={leave.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedLeave(leave)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg">{typeConfig.emoji}</span>
                        <h3 className="font-bold text-slate-900 dark:text-white">{leave.beneficiaryName}</h3>
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{leave.reason}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                        <span>📅 {leave.startDate} → {leave.endDate}</span>
                        <span>👤 {leave.guardianName}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {leave.status === 'pending_medical' && (
                        <>
                          <Button variant="primary" size="sm" icon={<CheckCircle className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); handleApprove(leave.id, 'medical') }}>طبي</Button>
                          <Button variant="danger" size="sm" icon={<XCircle className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); handleReject(leave.id) }} />
                        </>
                      )}
                      {leave.status === 'pending_director' && (
                        <>
                          <Button variant="primary" size="sm" icon={<CheckCircle className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); handleApprove(leave.id, 'director') }}>اعتماد</Button>
                          <Button variant="danger" size="sm" icon={<XCircle className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); handleReject(leave.id) }} />
                        </>
                      )}
                      {(leave.status !== 'pending_medical' && leave.status !== 'pending_director') && (
                        <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); setSelectedLeave(leave) }} />
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد طلبات</div>}
      </div>

      {/* Leave Detail Modal */}
      <Modal open={!!selectedLeave} onClose={() => setSelectedLeave(null)} title="تفاصيل طلب الإجازة" size="lg">
        {selectedLeave && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">المستفيد:</span> <strong>{selectedLeave.beneficiaryName}</strong></div>
              <div><span className="text-slate-500">النوع:</span> <strong>{LEAVE_TYPES.find((t) => t.value === selectedLeave.leaveType)?.label}</strong></div>
              <div><span className="text-slate-500">من:</span> <strong>{selectedLeave.startDate}</strong></div>
              <div><span className="text-slate-500">إلى:</span> <strong>{selectedLeave.endDate}</strong></div>
              <div><span className="text-slate-500">المرافق:</span> <strong>{selectedLeave.guardianName}</strong></div>
              <div><span className="text-slate-500">التواصل:</span> <strong dir="ltr">{selectedLeave.guardianContact ?? ''}</strong></div>
            </div>
            <div>
              <span className="text-sm text-slate-500">السبب:</span>
              <p className="mt-1 text-sm">{selectedLeave.reason}</p>
            </div>
            {selectedLeave.medicalClearance && (
              <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400">الموافقة الطبية</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-500">
                  ✅ بواسطة: {selectedLeave.medicalClearance.clearedBy}
                  {selectedLeave.medicalClearance.precautions && ` — ⚠️ ${selectedLeave.medicalClearance.precautions}`}
                </p>
              </div>
            )}
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">سجل المتابعة</h4>
              <div className="space-y-2">
                {(selectedLeave.history ?? []).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-teal" />
                    <span className="font-medium">{h.actionBy}</span>
                    <span>({h.role})</span>
                    <span className="text-slate-400">—</span>
                    <span>{h.action === 'request' ? 'إنشاء الطلب' : h.action === 'medical_clear' ? 'موافقة طبية' : h.action === 'approve' ? 'اعتماد' : h.action === 'reject' ? 'رفض' : 'عودة'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <AddLeaveModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={(data) => {
        const newLeave: LeaveRequest = {
          id: `l${Date.now()}`, ...data, status: 'pending_medical',
          history: [{ action: 'request', actionBy: 'المستخدم', role: 'أخصائي', date: new Date().toISOString() }],
          createdAt: new Date().toISOString(), createdBy: 'المستخدم الحالي',
        }
        const current = localLeaves ?? fetchedLeaves
        setLocalLeaves([newLeave, ...current])
        toast.success('تم إنشاء طلب الإجازة')
        setShowAddModal(false)
      }} />
    </>
  )
}

const leaveSchema = z.object({
  beneficiaryName: z.string().min(1, 'اسم المستفيد مطلوب'),
  leaveType: z.enum(['home_visit', 'medical', 'vacation', 'family_visit', 'other']).default('home_visit'),
  startDate: z.string().min(1, 'تاريخ البداية مطلوب'),
  endDate: z.string().optional(),
  guardianName: z.string().optional(),
  guardianContact: z.string().optional(),
  reason: z.string().optional(),
})

type LeaveFormData = z.infer<typeof leaveSchema>

function AddLeaveModal({ open, onClose, onAdd }: {
  open: boolean
  onClose: () => void
  onAdd: (data: Pick<LeaveRequest, 'beneficiaryId' | 'beneficiaryName' | 'leaveType' | 'startDate' | 'endDate' | 'guardianName' | 'guardianContact' | 'reason'>) => void
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: { leaveType: 'home_visit' },
  })

  const onSubmit = (data: LeaveFormData) => {
    onAdd({ beneficiaryId: `b${Date.now()}`, ...data })
    reset()
  }

  return (
    <Modal open={open} onClose={onClose} title="طلب إجازة جديد" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="اسم المستفيد" {...register('beneficiaryName')} error={errors.beneficiaryName?.message} placeholder="اختر المستفيد..." />
        <Select label="نوع الإجازة" {...register('leaveType')} error={errors.leaveType?.message} options={LEAVE_TYPES.map((t) => ({ value: t.value, label: `${t.emoji} ${t.label}` }))} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="تاريخ الخروج" type="date" {...register('startDate')} error={errors.startDate?.message} />
          <Input label="تاريخ العودة" type="date" {...register('endDate')} error={errors.endDate?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="اسم المرافق" {...register('guardianName')} error={errors.guardianName?.message} />
          <Input label="رقم التواصل" {...register('guardianContact')} error={errors.guardianContact?.message} dir="ltr" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">سبب الإجازة</label>
          <textarea {...register('reason')} rows={2} placeholder="سبب الطلب..." className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>إلغاء</Button>
          <Button variant="gold" type="submit">إنشاء الطلب</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Research Section ───────────────────────────────────────────

function ResearchSection() {
  const { data: researches = [], isLoading, error } = useSocialResearches()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- DB type differs from local type; will unify later
  const [selectedResearch, setSelectedResearch] = useState<Record<string, unknown> | null>(null)
  const [search, setSearch] = useState('')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (researches.length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم إجراء أي بحوث اجتماعية بعد" />

  const filtered = researches.filter((r) => {
    const worker = (r as Record<string, unknown>).social_worker as string | undefined
    return worker?.includes(search) || r.id?.includes(search)
  })

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard title="إجمالي البحوث" value={researches.length} accent="navy" />
        <StatCard title="هذا الشهر" value={researches.filter((r) => r.research_date?.startsWith(new Date().toISOString().slice(0, 7))).length} accent="teal" />
        <StatCard title="باحثون نشطون" value={new Set(researches.map((r) => r.social_worker)).size} accent="gold" />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="flex-1">
          <Input placeholder="بحث بالاسم..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="h-4 w-4" />} />
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />}>بحث جديد</Button>
      </div>

      <div className="space-y-3">
        {filtered.map((research) => {
          const rec = research as Record<string, unknown>
          return (
            <Card key={research.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedResearch(rec)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{research.beneficiary_id}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{research.social_status}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span>📝 {research.social_worker}</span>
                    <span>📅 {research.research_date}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); setSelectedResearch(rec) }} />
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد بحوث اجتماعية</div>}
      </div>

      <Modal open={!!selectedResearch} onClose={() => setSelectedResearch(null)} title="تفاصيل البحث الاجتماعي" size="lg">
        {selectedResearch && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-slate-500">المستفيد:</span> <strong>{String(selectedResearch.beneficiary_id ?? '')}</strong></div>
              <div><span className="text-slate-500">الباحث:</span> <strong>{String(selectedResearch.social_worker ?? '')}</strong></div>
              <div><span className="text-slate-500">التاريخ:</span> <strong>{String(selectedResearch.research_date ?? '')}</strong></div>
              <div><span className="text-slate-500">الحالة الاجتماعية:</span> <strong>{String(selectedResearch.social_status ?? '')}</strong></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><span className="text-slate-500">حجم الأسرة:</span> <strong>{String(selectedResearch.family_size ?? '')}</strong></div>
              <div><span className="text-slate-500">مصدر الدخل:</span> <strong>{String(selectedResearch.income_source ?? '')}</strong></div>
              <div><span className="text-slate-500">السكن:</span> <strong>{String(selectedResearch.housing_type ?? '')}</strong></div>
            </div>
            {selectedResearch.recommendations && (
              <div className="rounded-lg bg-teal/5 p-3 dark:bg-teal/10">
                <h4 className="mb-1 font-bold text-teal">التوصيات</h4>
                <p className="text-slate-600 dark:text-slate-400">{String(selectedResearch.recommendations)}</p>
              </div>
            )}
            {selectedResearch.notes && (
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <h4 className="mb-1 font-bold text-slate-700 dark:text-slate-300">ملاحظات</h4>
                <p className="text-slate-600 dark:text-slate-400">{String(selectedResearch.notes)}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}

// ─── Activities Section ─────────────────────────────────────────

function ActivitiesSection() {
  const { data: activities = [], isLoading, error } = useSocialActivities()
  const [filterStatus, setFilterStatus] = useState<'all' | 'achieved' | 'not_achieved'>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (activities.length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم تسجيل أي أنشطة اجتماعية بعد" />

  const filtered = filterStatus === 'all' ? activities : activities.filter((a) => a.status === filterStatus)

  const stats = {
    total: activities.length,
    achieved: activities.filter((a) => a.status === 'achieved').length,
    totalParticipants: activities.reduce((sum, a) => sum + (a.internalParticipants ?? 0) + (a.externalParticipants ?? 0), 0),
    totalCost: activities.reduce((sum, a) => sum + (a.cost || 0), 0),
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الأنشطة" value={stats.total} accent="navy" />
        <StatCard title="منجز" value={stats.achieved} accent="teal" />
        <StatCard title="المشاركون" value={stats.totalParticipants} accent="gold" />
        <StatCard title="التكلفة (ر.س)" value={stats.totalCost.toLocaleString('ar-SA')} accent="navy" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'achieved', 'not_achieved'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filterStatus === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {s === 'all' ? 'الكل' : FOLLOW_UP_STATUS.find((f) => f.value === s)?.label ?? s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((activity) => {
          const targetConfig = TARGET_GROUPS.find((t) => t.value === activity.targetGroup)
          const statusConfig = FOLLOW_UP_STATUS.find((f) => f.value === activity.status)
          return (
            <Card key={activity.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{activity.activityName}</h3>
                    {statusConfig && <Badge className={statusConfig.color}>{statusConfig.label}</Badge>}
                    {targetConfig && <Badge variant="outline">{targetConfig.emoji} {targetConfig.label}</Badge>}
                  </div>
                  {activity.objectives && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{activity.objectives}</p>}
                  {activity.outcomes && <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">{activity.outcomes}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{activity.date}</span>
                    {activity.location && <span>{activity.location}</span>}
                    {activity.supervisor && <span>{activity.supervisor}</span>}
                    <span>{(activity.internalParticipants ?? 0) + (activity.externalParticipants ?? 0)} مشارك</span>
                    {activity.cost != null && activity.cost > 0 && <span>{activity.cost.toLocaleString('ar-SA')} ر.س</span>}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد أنشطة</div>}
      </div>
    </>
  )
}

// ─── Monitoring Section (المتابعة والمراقبة) ──────────────────────

function MonitoringSection() {
  const { data: followups = [], isLoading: loadingFollowups, error: errorFollowups } = useSocialFollowups()
  const { data: rounds = [], isLoading: loadingRounds, error: errorRounds } = useDailyMonitorRounds()
  const [subTab, setSubTab] = useState<'followups' | 'rounds'>('followups')
  const [selectedFollowup, setSelectedFollowup] = useState<SocialFollowup | null>(null)
  const [selectedRound, setSelectedRound] = useState<DailyMonitorRound | null>(null)

  const isLoading = loadingFollowups || loadingRounds
  const error = errorFollowups || errorRounds

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="تقارير المتابعة" value={followups.length} accent="navy" />
        <StatCard title="جولات المراقبة" value={rounds.length} accent="teal" />
        <StatCard title="المقيّمون" value={new Set(followups.map((f) => f.assessor_name)).size} accent="gold" />
        <StatCard title="الوحدات" value={new Set(rounds.map((r) => r.unit_number)).size} accent="navy" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([{ id: 'followups' as const, label: 'تقارير المتابعة' }, { id: 'rounds' as const, label: 'جولات المراقبة اليومية' }]).map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              subTab === t.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'followups' && (
        <>
          {followups.length === 0 ? (
            <EmptyState title="لا توجد تقارير" description="لم يتم تسجيل أي تقارير متابعة اجتماعية بعد" />
          ) : (
            <div className="space-y-3">
              {followups.map((fu) => {
                const mobilityConfig = MOBILITY_TYPES.find((m) => m.value === fu.mobility)
                const peerConfig = RELATION_LEVELS.find((r) => r.value === fu.peer_relations)
                return (
                  <Card key={fu.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedFollowup(fu)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white">{fu.beneficiary_id}</h3>
                          <Badge variant="outline">{fu.period}</Badge>
                          {peerConfig && <Badge className={peerConfig.color}>{peerConfig.label}</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          المقيّم: {fu.assessor_name}
                          {mobilityConfig && <> — التنقل: {mobilityConfig.label}</>}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>زيارات داخلية: {fu.internal_visits}</span>
                          <span>زيارات خارجية: {fu.external_visits}</span>
                          <span>اتصالات: {fu.family_calls}</span>
                          {fu.has_talent && <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">موهوب</Badge>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); setSelectedFollowup(fu) }} />
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          <Modal open={!!selectedFollowup} onClose={() => setSelectedFollowup(null)} title="تفاصيل تقرير المتابعة الاجتماعية" size="lg">
            {selectedFollowup && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-500">المستفيد:</span> <strong>{selectedFollowup.beneficiary_id}</strong></div>
                  <div><span className="text-slate-500">الفترة:</span> <strong>{selectedFollowup.period}</strong></div>
                  <div><span className="text-slate-500">المقيّم:</span> <strong>{selectedFollowup.assessor_name}</strong></div>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-slate-700 dark:text-slate-300">مستوى الاستقلالية</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">اللبس:</span>
                      <Badge className={INDEPENDENCE_LEVELS.find((l) => l.value === selectedFollowup.clothing_self)?.color ?? ''}>{INDEPENDENCE_LEVELS.find((l) => l.value === selectedFollowup.clothing_self)?.label ?? '-'}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">الأكل:</span>
                      <Badge className={INDEPENDENCE_LEVELS.find((l) => l.value === selectedFollowup.eating_self)?.color ?? ''}>{INDEPENDENCE_LEVELS.find((l) => l.value === selectedFollowup.eating_self)?.label ?? '-'}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">النظافة:</span>
                      <Badge className={INDEPENDENCE_LEVELS.find((l) => l.value === selectedFollowup.hygiene)?.color ?? ''}>{INDEPENDENCE_LEVELS.find((l) => l.value === selectedFollowup.hygiene)?.label ?? '-'}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">التنقل:</span>
                      <strong>{MOBILITY_TYPES.find((m) => m.value === selectedFollowup.mobility)?.label ?? '-'}</strong>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-slate-700 dark:text-slate-300">العلاقات</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">مع الأقران:</span>
                      <Badge className={RELATION_LEVELS.find((r) => r.value === selectedFollowup.peer_relations)?.color ?? ''}>{RELATION_LEVELS.find((r) => r.value === selectedFollowup.peer_relations)?.label ?? '-'}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">مع الآخرين:</span>
                      <Badge className={RELATION_LEVELS.find((r) => r.value === selectedFollowup.other_relations)?.color ?? ''}>{RELATION_LEVELS.find((r) => r.value === selectedFollowup.other_relations)?.label ?? '-'}</Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
                    <div className="text-lg font-bold text-navy">{selectedFollowup.internal_visits}</div>
                    <div className="text-xs text-slate-500">زيارات داخلية</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
                    <div className="text-lg font-bold text-teal">{selectedFollowup.external_visits}</div>
                    <div className="text-xs text-slate-500">زيارات خارجية</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
                    <div className="text-lg font-bold text-gold">{selectedFollowup.family_calls}</div>
                    <div className="text-xs text-slate-500">اتصالات</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-2 text-center dark:bg-slate-800/50">
                    <div className="text-lg font-bold text-navy">{selectedFollowup.social_reports}</div>
                    <div className="text-xs text-slate-500">تقارير</div>
                  </div>
                </div>
                {selectedFollowup.activity_types.length > 0 && (
                  <div>
                    <span className="text-slate-500">أنواع الأنشطة:</span>
                    <div className="mt-1 flex flex-wrap gap-1">{selectedFollowup.activity_types.map((t, i) => <Badge key={i} variant="outline">{t}</Badge>)}</div>
                  </div>
                )}
                {selectedFollowup.has_talent && selectedFollowup.talent_description && (
                  <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                    <h4 className="text-sm font-bold text-purple-800 dark:text-purple-400">الموهبة</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-500">{selectedFollowup.talent_description}</p>
                  </div>
                )}
                {selectedFollowup.recommendations && (
                  <div className="rounded-lg bg-teal/5 p-3 dark:bg-teal/10">
                    <h4 className="mb-1 font-bold text-teal">التوصيات</h4>
                    <p className="text-slate-600 dark:text-slate-400">{selectedFollowup.recommendations}</p>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      )}

      {subTab === 'rounds' && (
        <>
          {rounds.length === 0 ? (
            <EmptyState title="لا توجد جولات" description="لم يتم تسجيل أي جولات مراقبة يومية بعد" />
          ) : (
            <div className="space-y-3">
              {rounds.map((round) => {
                const shiftConfig = SHIFT_TYPES.find((s) => s.value === round.shift)
                const rooms = round.rooms as Array<Record<string, unknown>>
                return (
                  <Card key={round.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRound(round)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white">{round.unit_number}</h3>
                          {shiftConfig && <Badge variant="outline">{shiftConfig.label}</Badge>}
                          <span className="text-xs text-slate-500">{round.round_date}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          المراقب: {round.monitor_name} — {rooms.length} غرف
                        </p>
                        {round.general_notes && <p className="mt-1 text-xs text-slate-500">{round.general_notes}</p>}
                      </div>
                      <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); setSelectedRound(round) }} />
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          <Modal open={!!selectedRound} onClose={() => setSelectedRound(null)} title="تفاصيل جولة المراقبة" size="lg">
            {selectedRound && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-500">الوحدة:</span> <strong>{selectedRound.unit_number}</strong></div>
                  <div><span className="text-slate-500">التاريخ:</span> <strong>{selectedRound.round_date}</strong></div>
                  <div><span className="text-slate-500">الفترة:</span> <strong>{SHIFT_TYPES.find((s) => s.value === selectedRound.shift)?.label}</strong></div>
                  <div><span className="text-slate-500">المراقب:</span> <strong>{selectedRound.monitor_name}</strong></div>
                  {selectedRound.supervisor_name && <div><span className="text-slate-500">المشرف:</span> <strong>{selectedRound.supervisor_name}</strong></div>}
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-slate-700 dark:text-slate-300">الغرف</h4>
                  <div className="space-y-2">
                    {(selectedRound.rooms as Array<Record<string, unknown>>).map((room, i) => (
                      <div key={i} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                        <div className="flex items-center gap-2 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          غرفة {String(room.room_number ?? '')}
                        </div>
                        <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <span>المظهر: {String(room.appearance ?? '-')}</span>
                          <span>النظافة: {String(room.cleanliness ?? '-')}</span>
                          <span>الحالة الصحية: {String(room.health_status ?? '-')}</span>
                          <span>استجابة العامل: {String(room.worker_response ?? '-')}</span>
                        </div>
                        {room.notes && <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{String(room.notes)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                {selectedRound.general_notes && (
                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                    <h4 className="mb-1 font-bold text-slate-700 dark:text-slate-300">ملاحظات عامة</h4>
                    <p className="text-slate-600 dark:text-slate-400">{selectedRound.general_notes}</p>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      )}
    </>
  )
}

// ─── Referrals Section (التحويلات والتبليغات) ──────────────────────

function ReferralsSection() {
  const { data: referrals = [], isLoading: loadingRef, error: errorRef } = useReferrals()
  const { data: notifications = [], isLoading: loadingNotif, error: errorNotif } = useFamilyNotifications()
  const { data: incidents = [], isLoading: loadingInc, error: errorInc } = useIncidentReports()
  const [subTab, setSubTab] = useState<'referrals' | 'notifications' | 'incidents'>('referrals')
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null)
  const [selectedNotification, setSelectedNotification] = useState<FamilyNotification | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const isLoading = loadingRef || loadingNotif || loadingInc
  const error = errorRef || errorNotif || errorInc

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="التحويلات" value={referrals.length} accent="navy" />
        <StatCard title="تبليغات الأسر" value={notifications.length} accent="gold" />
        <StatCard title="تقارير الحوادث" value={incidents.length} accent="danger" />
        <StatCard title="قيد المعالجة" value={referrals.filter((r) => r.status === 'in_treatment').length} accent="teal" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([
          { id: 'referrals' as const, label: 'التحويلات' },
          { id: 'notifications' as const, label: 'تبليغات الأسر' },
          { id: 'incidents' as const, label: 'تقارير الحوادث' },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => { setSubTab(t.id); setFilterStatus('all') }}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              subTab === t.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Referrals Sub-tab */}
      {subTab === 'referrals' && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {(['all', 'pending', 'in_treatment', 'resolved'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  filterStatus === s ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                )}
              >
                {s === 'all' ? 'الكل' : REFERRAL_STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>

          {referrals.length === 0 ? (
            <EmptyState title="لا توجد تحويلات" description="لم يتم تسجيل أي تحويلات بعد" />
          ) : (
            <div className="space-y-3">
              {referrals
                .filter((r) => filterStatus === 'all' || r.status === filterStatus)
                .map((ref) => {
                  const urgencyConfig = URGENCY_LEVELS.find((u) => u.value === ref.urgency)
                  const statusConfig = REFERRAL_STATUS_CONFIG[ref.status]
                  const typeConfig = REFERRAL_TYPES.find((t) => t.value === ref.referral_type)
                  return (
                    <Card key={ref.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedReferral(ref)}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">{ref.beneficiary_id}</h3>
                            {statusConfig && <Badge className={statusConfig.color}>{statusConfig.label}</Badge>}
                            {urgencyConfig && <Badge className={urgencyConfig.color}>{urgencyConfig.label}</Badge>}
                            {typeConfig && <Badge variant="outline">{typeConfig.label}</Badge>}
                          </div>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{ref.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            {ref.referred_to_department && <span>{ref.referred_to_department}</span>}
                            {ref.specialist_name && <span>الأخصائي: {ref.specialist_name}</span>}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); setSelectedReferral(ref) }} />
                      </div>
                    </Card>
                  )
                })}
            </div>
          )}

          <Modal open={!!selectedReferral} onClose={() => setSelectedReferral(null)} title="تفاصيل التحويل" size="lg">
            {selectedReferral && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-500">المستفيد:</span> <strong>{selectedReferral.beneficiary_id}</strong></div>
                  <div><span className="text-slate-500">النوع:</span> <strong>{REFERRAL_TYPES.find((t) => t.value === selectedReferral.referral_type)?.label}</strong></div>
                  <div><span className="text-slate-500">الأولوية:</span> <Badge className={URGENCY_LEVELS.find((u) => u.value === selectedReferral.urgency)?.color ?? ''}>{URGENCY_LEVELS.find((u) => u.value === selectedReferral.urgency)?.label}</Badge></div>
                  <div><span className="text-slate-500">الحالة:</span> <Badge className={REFERRAL_STATUS_CONFIG[selectedReferral.status].color}>{REFERRAL_STATUS_CONFIG[selectedReferral.status].label}</Badge></div>
                  {selectedReferral.referred_to_department && <div><span className="text-slate-500">الجهة:</span> <strong>{selectedReferral.referred_to_department}</strong></div>}
                  {selectedReferral.specialist_name && <div><span className="text-slate-500">الأخصائي:</span> <strong>{selectedReferral.specialist_name}</strong></div>}
                </div>
                {selectedReferral.description && <div><span className="text-slate-500">الوصف:</span><p className="mt-1">{selectedReferral.description}</p></div>}
                {selectedReferral.current_needs && <div><span className="text-slate-500">الاحتياجات الحالية:</span><p className="mt-1">{selectedReferral.current_needs}</p></div>}
                {selectedReferral.expected_outcomes && (
                  <div className="rounded-lg bg-teal/5 p-3 dark:bg-teal/10">
                    <h4 className="mb-1 font-bold text-teal">النتائج المتوقعة</h4>
                    <p className="text-slate-600 dark:text-slate-400">{selectedReferral.expected_outcomes}</p>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      )}

      {/* Family Notifications Sub-tab */}
      {subTab === 'notifications' && (
        <>
          {notifications.length === 0 ? (
            <EmptyState title="لا توجد تبليغات" description="لم يتم تسجيل أي تبليغات للأسر بعد" />
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => {
                const typeConfig = NOTIFICATION_TYPES.find((t) => t.value === notif.notification_type)
                return (
                  <Card key={notif.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedNotification(notif)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {typeConfig && <span className="text-lg">{typeConfig.emoji}</span>}
                          <h3 className="font-bold text-slate-900 dark:text-white">{notif.beneficiary_id}</h3>
                          {typeConfig && <Badge variant="outline">{typeConfig.label}</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{notif.notification_detail}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {notif.contacted_name && <span><Phone className="inline h-3 w-3" /> {notif.contacted_name}</span>}
                          <span>بواسطة: {notif.notified_by}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); setSelectedNotification(notif) }} />
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          <Modal open={!!selectedNotification} onClose={() => setSelectedNotification(null)} title="تفاصيل تبليغ الأسرة" size="lg">
            {selectedNotification && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-500">المستفيد:</span> <strong>{selectedNotification.beneficiary_id}</strong></div>
                  <div><span className="text-slate-500">نوع التبليغ:</span> <strong>{NOTIFICATION_TYPES.find((t) => t.value === selectedNotification.notification_type)?.label}</strong></div>
                  {selectedNotification.contacted_name && <div><span className="text-slate-500">اسم المتصل به:</span> <strong>{selectedNotification.contacted_name}</strong></div>}
                  {selectedNotification.contact_number && <div><span className="text-slate-500">رقم التواصل:</span> <strong dir="ltr">{selectedNotification.contact_number}</strong></div>}
                  <div><span className="text-slate-500">المبلّغ:</span> <strong>{selectedNotification.notified_by}</strong></div>
                </div>
                {selectedNotification.notification_detail && <div><span className="text-slate-500">التفاصيل:</span><p className="mt-1">{selectedNotification.notification_detail}</p></div>}
                {selectedNotification.call_summary && (
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <h4 className="mb-1 font-bold text-blue-800 dark:text-blue-400">ملخص الاتصال</h4>
                    <p className="text-blue-700 dark:text-blue-500">{selectedNotification.call_summary}</p>
                  </div>
                )}
                {selectedNotification.notes && (
                  <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                    <h4 className="mb-1 font-bold text-slate-700 dark:text-slate-300">ملاحظات</h4>
                    <p className="text-slate-600 dark:text-slate-400">{selectedNotification.notes}</p>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      )}

      {/* Incident Reports Sub-tab */}
      {subTab === 'incidents' && (
        <>
          {incidents.length === 0 ? (
            <EmptyState title="لا توجد تقارير حوادث" description="لم يتم تسجيل أي تقارير حوادث بعد" />
          ) : (
            <div className="space-y-3">
              {incidents.map((inc) => {
                const typeConfig = INCIDENT_TYPES.find((t) => t.value === inc.incident_type)
                return (
                  <Card key={inc.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedIncident(inc)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <h3 className="font-bold text-slate-900 dark:text-white">{inc.beneficiary_id}</h3>
                          {typeConfig && <Badge variant="outline">{typeConfig.label}</Badge>}
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{inc.incident_type_detail}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span>{inc.incident_date}{inc.incident_time && ` ${inc.incident_time}`}</span>
                          <span>بواسطة: {inc.reported_by}</span>
                          {inc.worker_name && <span>العامل: {inc.worker_name}</span>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" icon={<Eye className="h-3.5 w-3.5" />} onClick={(e) => { e.stopPropagation(); setSelectedIncident(inc) }} />
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          <Modal open={!!selectedIncident} onClose={() => setSelectedIncident(null)} title="تفاصيل تقرير الحادثة" size="lg">
            {selectedIncident && (
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-500">المستفيد:</span> <strong>{selectedIncident.beneficiary_id}</strong></div>
                  <div><span className="text-slate-500">نوع الحادثة:</span> <strong>{INCIDENT_TYPES.find((t) => t.value === selectedIncident.incident_type)?.label}</strong></div>
                  <div><span className="text-slate-500">التاريخ:</span> <strong>{selectedIncident.incident_date}</strong></div>
                  {selectedIncident.incident_time && <div><span className="text-slate-500">الوقت:</span> <strong>{selectedIncident.incident_time}</strong></div>}
                  <div><span className="text-slate-500">المبلّغ:</span> <strong>{selectedIncident.reported_by}</strong></div>
                </div>
                {selectedIncident.incident_type_detail && <div><span className="text-slate-500">تفاصيل الحادثة:</span><p className="mt-1">{selectedIncident.incident_type_detail}</p></div>}
                {selectedIncident.worker_name && (
                  <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                    <h4 className="mb-1 font-bold text-slate-700 dark:text-slate-300">بيانات العامل</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="text-slate-500">الاسم:</span> <strong>{selectedIncident.worker_name}</strong></div>
                      {selectedIncident.worker_statement && <div className="col-span-2"><span className="text-slate-500">إفادته:</span><p className="mt-1">{selectedIncident.worker_statement}</p></div>}
                      {selectedIncident.action_taken_on_worker && <div className="col-span-2"><span className="text-slate-500">الإجراء المتخذ:</span><p className="mt-1">{selectedIncident.action_taken_on_worker}</p></div>}
                    </div>
                  </div>
                )}
                {selectedIncident.specialist_opinion && (
                  <div className="rounded-lg bg-teal/5 p-3 dark:bg-teal/10">
                    <h4 className="mb-1 font-bold text-teal">رأي الأخصائي</h4>
                    <p className="text-slate-600 dark:text-slate-400">{selectedIncident.specialist_opinion}</p>
                  </div>
                )}
                {selectedIncident.social_worker_opinion && (
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <h4 className="mb-1 font-bold text-blue-800 dark:text-blue-400">رأي الأخصائي الاجتماعي</h4>
                    <p className="text-blue-700 dark:text-blue-500">{selectedIncident.social_worker_opinion}</p>
                  </div>
                )}
              </div>
            )}
          </Modal>
        </>
      )}
    </>
  )
}

// ─── Clothing Section (الكسوة) ──────────────────────────────────

function ClothingSection() {
  const { data: inventory = [], isLoading: loadingInv, error: errorInv } = useClothingInventory()
  const { data: transactions = [], isLoading: loadingTx, error: errorTx } = useClothingTransactions()
  const [subTab, setSubTab] = useState<'inventory' | 'transactions'>('inventory')
  const [filterSeason, setFilterSeason] = useState<string>('all')

  const isLoading = loadingInv || loadingTx
  const error = errorInv || errorTx

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const goodItems = inventory.filter((item) => item.condition === 'good').length
  const totalCost = transactions.reduce((sum, tx) => sum + (tx.total_cost ?? 0), 0)

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="أصناف المخزون" value={inventory.length} accent="navy" />
        <StatCard title="إجمالي القطع" value={totalItems} accent="teal" />
        <StatCard title="بحالة جيدة" value={goodItems} accent="gold" />
        <StatCard title="المعاملات" value={transactions.length} accent="navy" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([{ id: 'inventory' as const, label: 'المخزون' }, { id: 'transactions' as const, label: 'المعاملات' }]).map((t) => (
          <button
            key={t.id}
            onClick={() => { setSubTab(t.id); setFilterSeason('all') }}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              subTab === t.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Inventory Sub-tab */}
      {subTab === 'inventory' && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {(['all', ...SEASON_TYPES.map((s) => s.value)] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeason(s)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  filterSeason === s ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                )}
              >
                {s === 'all' ? 'الكل' : SEASON_TYPES.find((st) => st.value === s)?.label ?? s}
              </button>
            ))}
          </div>

          {inventory.length === 0 ? (
            <EmptyState title="لا توجد بيانات" description="لم يتم تسجيل أي أصناف في مخزون الكسوة بعد" />
          ) : (
            <div className="space-y-3">
              {inventory
                .filter((item) => filterSeason === 'all' || item.season_type === filterSeason)
                .map((item) => {
                  const seasonConfig = SEASON_TYPES.find((s) => s.value === item.season_type)
                  const conditionConfig = CLOTHING_CONDITIONS.find((c) => c.value === item.condition)
                  return (
                    <Card key={item.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Shirt className="h-4 w-4 text-slate-400" />
                            <h3 className="font-bold text-slate-900 dark:text-white">{item.item_name}</h3>
                            {seasonConfig && <Badge variant="outline">{seasonConfig.label}</Badge>}
                            {conditionConfig && <Badge className={conditionConfig.color}>{conditionConfig.label}</Badge>}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span>المستفيد: {item.beneficiary_id}</span>
                            <span>الكمية: {item.quantity}</span>
                            {item.item_size && <span>المقاس: {item.item_size}</span>}
                            <span>السنة المالية: {item.fiscal_year}</span>
                          </div>
                          {item.notes && <p className="mt-1 text-xs text-slate-500">{item.notes}</p>}
                        </div>
                      </div>
                    </Card>
                  )
                })}
            </div>
          )}
        </>
      )}

      {/* Transactions Sub-tab */}
      {subTab === 'transactions' && (
        <>
          {transactions.length === 0 ? (
            <EmptyState title="لا توجد معاملات" description="لم يتم تسجيل أي معاملات كسوة بعد" />
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => {
                const typeConfig = TRANSACTION_TYPES.find((t) => t.value === tx.transaction_type)
                const seasonConfig = tx.season_type ? SEASON_TYPES.find((s) => s.value === tx.season_type) : null
                const items = tx.items as Array<Record<string, unknown>>
                return (
                  <Card key={tx.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {typeConfig && <span className="text-lg">{typeConfig.emoji}</span>}
                          <h3 className="font-bold text-slate-900 dark:text-white">{typeConfig?.label}</h3>
                          {seasonConfig && <Badge variant="outline">{seasonConfig.label}</Badge>}
                          {tx.total_cost != null && tx.total_cost > 0 && (
                            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                              {tx.total_cost.toLocaleString('ar-SA')} ر.س
                            </Badge>
                          )}
                        </div>
                        {items.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {items.map((item, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {String(item.name ?? '')} {item.quantity ? `(${String(item.quantity)})` : ''}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          {tx.warehouse_keeper && <span>أمين المستودع: {tx.warehouse_keeper}</span>}
                          {tx.fiscal_year && <span>السنة المالية: {tx.fiscal_year}</span>}
                          {tx.beneficiary_id && <span>المستفيد: {tx.beneficiary_id}</span>}
                        </div>
                        {tx.notes && <p className="mt-1 text-xs text-slate-500">{tx.notes}</p>}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}
    </>
  )
}

// ─── Advances Section (السلف والعهد) ─────────────────────────────

function AdvancesSection() {
  const { data: advances = [], isLoading, error } = useActivityAdvances()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (advances.length === 0) return <EmptyState title="لا توجد سلف" description="لم يتم تسجيل أي سلف أو عهد بعد" />

  const filtered = filterStatus === 'all' ? advances : advances.filter((a) => a.approval_status === filterStatus)

  const totalRequested = advances.reduce((sum, a) => sum + a.amount_requested, 0)
  const totalApproved = advances.reduce((sum, a) => sum + (a.amount_approved ?? 0), 0)
  const totalSpent = advances.reduce((sum, a) => sum + (a.amount_spent ?? 0), 0)

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي السلف" value={advances.length} accent="navy" />
        <StatCard title="المطلوب (ر.س)" value={totalRequested.toLocaleString('ar-SA')} accent="gold" />
        <StatCard title="المعتمد (ر.س)" value={totalApproved.toLocaleString('ar-SA')} accent="teal" />
        <StatCard title="المصروف (ر.س)" value={totalSpent.toLocaleString('ar-SA')} accent="navy" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected', 'settled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filterStatus === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {s === 'all' ? 'الكل' : ADVANCE_STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((advance) => {
          const typeConfig = ADVANCE_TYPES.find((t) => t.value === advance.advance_type)
          const statusConfig = ADVANCE_STATUS_CONFIG[advance.approval_status]
          const receipts = advance.receipts as Array<Record<string, unknown>>
          return (
            <Card key={advance.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Wallet className="h-4 w-4 text-slate-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white">{advance.purpose}</h3>
                    {typeConfig && <Badge variant="outline">{typeConfig.label}</Badge>}
                    {statusConfig && <Badge className={statusConfig.color}>{statusConfig.label}</Badge>}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                      <div className="font-bold text-gold">{advance.amount_requested.toLocaleString('ar-SA')} ر.س</div>
                      <div className="text-slate-500">المطلوب</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                      <div className="font-bold text-teal">{(advance.amount_approved ?? 0).toLocaleString('ar-SA')} ر.س</div>
                      <div className="text-slate-500">المعتمد</div>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                      <div className="font-bold text-navy">{(advance.amount_spent ?? 0).toLocaleString('ar-SA')} ر.س</div>
                      <div className="text-slate-500">المصروف</div>
                    </div>
                  </div>
                  {receipts.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs font-medium text-slate-500">المرفقات ({receipts.length}):</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {receipts.map((r, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {String(r.description ?? '')} — {Number(r.amount ?? 0).toLocaleString('ar-SA')} ر.س
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>مقدم الطلب: {advance.requested_by}</span>
                    {advance.approved_by && <span>المعتمد: {advance.approved_by}</span>}
                    {advance.budget_line && <span>البند: {advance.budget_line}</span>}
                    <span>السنة المالية: {advance.fiscal_year}</span>
                  </div>
                  {advance.settlement_date && (
                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                      تمت التسوية: {advance.settlement_date}
                      {advance.settlement_notes && ` — ${advance.settlement_notes}`}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد سلف</div>}
      </div>
    </>
  )
}
