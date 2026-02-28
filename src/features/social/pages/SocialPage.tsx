import { useState } from 'react'
import { Users, FileText, Calendar, ClipboardList, Plus, Search, Eye, CheckCircle, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, Badge, Input, Select, Modal, Tabs } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  LEAVE_STATUS_CONFIG, LEAVE_TYPES, TARGET_GROUPS, FOLLOW_UP_STATUS,
  type LeaveRequest, type LeaveStatus, type SocialActivity,
} from '../types'
import { useLeaveRequests, useSocialResearches, useSocialActivities } from '../api/social-queries'

// ─── Main Page ──────────────────────────────────────────────────

export function SocialPage() {
  const [activeTab, setActiveTab] = useState('leaves')

  const tabs = [
    { id: 'leaves', label: 'طلبات الإجازات', icon: <Calendar className="h-4 w-4" /> },
    { id: 'research', label: 'البحث الاجتماعي', icon: <FileText className="h-4 w-4" /> },
    { id: 'activities', label: 'الأنشطة', icon: <ClipboardList className="h-4 w-4" /> },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="الخدمات الاجتماعية"
        description="إدارة البحوث الاجتماعية والإجازات والأنشطة"
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
      </div>
    </div>
  )
}

// ─── Leaves Section ─────────────────────────────────────────────

function LeavesSection() {
  const { data: fetchedLeaves = [] } = useLeaveRequests()
  const [localLeaves, setLocalLeaves] = useState<LeaveRequest[] | null>(null)
  const leaves = localLeaves ?? fetchedLeaves
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null)

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

function AddLeaveModal({ open, onClose, onAdd }: {
  open: boolean
  onClose: () => void
  onAdd: (data: Pick<LeaveRequest, 'beneficiaryId' | 'beneficiaryName' | 'leaveType' | 'startDate' | 'endDate' | 'guardianName' | 'guardianContact' | 'reason'>) => void
}) {
  const [form, setForm] = useState({ beneficiaryName: '', leaveType: 'home_visit' as const, startDate: '', endDate: '', guardianName: '', guardianContact: '', reason: '' })
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <Modal open={open} onClose={onClose} title="طلب إجازة جديد" size="lg">
      <div className="space-y-4">
        <Input label="اسم المستفيد" value={form.beneficiaryName} onChange={(e) => update('beneficiaryName', e.target.value)} placeholder="اختر المستفيد..." />
        <Select label="نوع الإجازة" value={form.leaveType} onChange={(e) => update('leaveType', e.target.value)} options={LEAVE_TYPES.map((t) => ({ value: t.value, label: `${t.emoji} ${t.label}` }))} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="تاريخ الخروج" type="date" value={form.startDate} onChange={(e) => update('startDate', e.target.value)} />
          <Input label="تاريخ العودة" type="date" value={form.endDate} onChange={(e) => update('endDate', e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="اسم المرافق" value={form.guardianName} onChange={(e) => update('guardianName', e.target.value)} />
          <Input label="رقم التواصل" value={form.guardianContact} onChange={(e) => update('guardianContact', e.target.value)} dir="ltr" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">سبب الإجازة</label>
          <textarea value={form.reason} onChange={(e) => update('reason', e.target.value)} rows={2} placeholder="سبب الطلب..." className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button variant="gold" onClick={() => onAdd({ beneficiaryId: `b${Date.now()}`, ...form })} disabled={!form.beneficiaryName.trim() || !form.startDate}>إنشاء الطلب</Button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Research Section ───────────────────────────────────────────

function ResearchSection() {
  const { data: researches = [] } = useSocialResearches()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- DB type differs from local type; will unify later
  const [selectedResearch, setSelectedResearch] = useState<Record<string, unknown> | null>(null)
  const [search, setSearch] = useState('')

  const filtered = researches.filter((r) => {
    const worker = (r as Record<string, unknown>).social_worker as string | undefined
    return worker?.includes(search) || r.id?.includes(search)
  })

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard title="إجمالي البحوث" value={researches.length} accent="navy" />
        <StatCard title="هذا الشهر" value={researches.filter((r) => r.research_date?.startsWith('2026-02')).length} accent="teal" />
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
  const { data: activities = [] } = useSocialActivities()
  const [filterStatus, setFilterStatus] = useState<'all' | 'achieved' | 'not_achieved'>('all')

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
