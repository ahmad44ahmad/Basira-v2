import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Building2, Wrench, Trash2, Plus, Search, CheckCircle, AlertTriangle, Eye, Play, ChevronDown, ChevronUp, ClipboardCheck, CircleCheck, CircleX, CircleMinus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, Badge, Input, Select, Modal, Tabs, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn, formatCurrency } from '@/lib/utils'
import {
  ASSET_STATUS_CONFIG, ASSET_CONDITION_CONFIG,
  MAINTENANCE_TYPE_CONFIG, MAINTENANCE_PRIORITY_CONFIG, MAINTENANCE_STATUS_CONFIG,
  WASTE_TYPE_CONFIG, DISPOSAL_METHODS,
  CHECKLIST_CATEGORY_CONFIG, CHECKLIST_STATUS_CONFIG, CHECKLIST_ITEM_STATUS,
  type Asset, type AssetStatus, type AssetCondition,
  type MaintenanceRequest, type MaintenanceStatus, type MaintenanceType, type MaintenancePriority,
  type WasteRecord, type WasteType,
  type ChecklistCategory,
} from '../types'
import { useAssets, useMaintenanceRequests, useCreateMaintenanceRequest, useUpdateMaintenanceStatus, useWasteRecords } from '../api/operations-queries'
import { useMaintenanceChecklists, useChecklistStats } from '../api/checklist-queries'

// ─── Main Page ──────────────────────────────────────────────────

export function OperationsPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'لوحة التحكم' },
    { id: 'assets', label: 'الأصول' },
    { id: 'maintenance', label: 'الصيانة' },
    { id: 'checklists', label: 'قوائم التدقيق' },
    { id: 'waste', label: 'النفايات' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="إدارة العمليات"
        description="الأصول والصيانة وإدارة النفايات"
        icon={<Building2 className="h-5 w-5" />}
      />

      <Tabs tabs={tabs.map((t) => ({ id: t.id, label: t.label }))} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'dashboard' && <DashboardSection />}
        {activeTab === 'assets' && <AssetsSection />}
        {activeTab === 'maintenance' && <MaintenanceSection />}
        {activeTab === 'checklists' && <ChecklistsSection />}
        {activeTab === 'waste' && <WasteSection />}
      </div>
    </div>
  )
}

// ─── Dashboard Section ──────────────────────────────────────────

function DashboardSection() {
  const { data: assets = [], isLoading: isLoadingAssets, error: errorAssets } = useAssets()
  const { data: maintenance = [], isLoading: isLoadingMaintenance, error: errorMaintenance } = useMaintenanceRequests()
  const { data: waste = [], isLoading: isLoadingWaste, error: errorWaste } = useWasteRecords()

  const isLoading = isLoadingAssets || isLoadingMaintenance || isLoadingWaste
  const error = errorAssets || errorMaintenance || errorWaste

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (assets.length === 0 && maintenance.length === 0 && waste.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد بيانات في لوحة التحكم حاليا" />

  const activeAssets = assets.filter((a) => a.status === 'active').length
  const totalValue = assets.reduce((s, a) => s + a.currentBookValue, 0)
  const pendingMaintenance = maintenance.filter((m) => m.status === 'pending' || m.status === 'in_progress').length
  const completedThisMonth = maintenance.filter((m) => m.status === 'completed').length
  const wasteThisMonth = waste.reduce((s, w) => s + w.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard title="الأصول النشطة" value={activeAssets} accent="teal" />
        <StatCard title="القيمة الدفترية" value={formatCurrency(totalValue)} accent="navy" />
        <StatCard title="صيانة معلقة" value={pendingMaintenance} accent="gold" />
        <StatCard title="مكتملة هذا الشهر" value={completedThisMonth} accent="teal" />
        <StatCard title="النفايات (كجم)" value={wasteThisMonth} accent="navy" />
      </div>

      {/* Recent maintenance */}
      <Card>
        <h3 className="mb-3 font-bold text-slate-900 dark:text-white">آخر طلبات الصيانة</h3>
        <div className="space-y-2">
          {maintenance.slice(0, 4).map((req) => {
            const typeConfig = MAINTENANCE_TYPE_CONFIG[req.requestType]
            const statusConfig = MAINTENANCE_STATUS_CONFIG[req.status]
            const priorityConfig = MAINTENANCE_PRIORITY_CONFIG[req.priority]
            return (
              <div key={req.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{typeConfig.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{req.title}</p>
                    <p className="text-xs text-slate-500">{req.requestNumber} · {req.reportedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={priorityConfig.color}>{priorityConfig.label}</Badge>
                  <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Asset condition breakdown */}
      <Card>
        <h3 className="mb-3 font-bold text-slate-900 dark:text-white">حالة الأصول</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(Object.entries(ASSET_CONDITION_CONFIG) as [AssetCondition, { label: string; color: string }][]).map(([cond, config]) => {
            const count = assets.filter((a) => a.condition === cond).length
            return (
              <div key={cond} className={cn('rounded-xl p-3 text-center', config.color)}>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs">{config.label}</p>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ─── Assets Section ─────────────────────────────────────────────

function AssetsSection() {
  const { data: assets = [], isLoading, error } = useAssets()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<AssetStatus | 'all'>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (assets.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد أصول مسجلة حاليا" />

  const filtered = assets.filter((a) =>
    (filterStatus === 'all' || a.status === filterStatus) &&
    (a.nameAr.includes(search) || a.assetCode.includes(search)),
  )

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الأصول" value={assets.length} accent="navy" />
        <StatCard title="نشط" value={assets.filter((a) => a.status === 'active').length} accent="teal" />
        <StatCard title="تحت الصيانة" value={assets.filter((a) => a.status === 'under_maintenance').length} accent="gold" />
        <StatCard title="القيمة الإجمالية" value={formatCurrency(assets.reduce((s, a) => s + a.currentBookValue, 0))} accent="navy" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-[200px] flex-1">
          <Input placeholder="بحث بالاسم أو الرمز..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="h-4 w-4" />} />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'under_maintenance', 'out_of_service'] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterStatus === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
              {s === 'all' ? 'الكل' : ASSET_STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((asset) => {
          const statusConfig = ASSET_STATUS_CONFIG[asset.status]
          const condConfig = ASSET_CONDITION_CONFIG[asset.condition]
          return (
            <Card key={asset.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400">{asset.assetCode}</code>
                    <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    <Badge className={condConfig.color}>{condConfig.label}</Badge>
                  </div>
                  <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{asset.nameAr}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>🏢 {asset.building}{asset.room ? ` — ${asset.room}` : ''}</span>
                    <span>📂 {asset.category}</span>
                    <span>💰 {formatCurrency(asset.currentBookValue)}</span>
                    {asset.warrantyEnd && <span>🛡️ ضمان حتى {asset.warrantyEnd}</span>}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد أصول</div>}
      </div>
    </>
  )
}

// ─── Maintenance Section ────────────────────────────────────────

function MaintenanceSection() {
  const { data: fetchedRequests = [], isLoading, error } = useMaintenanceRequests()
  const [localRequests, setLocalRequests] = useState<MaintenanceRequest[]>([])
  const requests = localRequests.length > 0 ? localRequests : fetchedRequests
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (fetchedRequests.length === 0 && localRequests.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد طلبات صيانة مسجلة حاليا" />

  const filtered = filterStatus === 'all' ? requests : requests.filter((r) => r.status === filterStatus)

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    inProgress: requests.filter((r) => r.status === 'in_progress').length,
    completed: requests.filter((r) => r.status === 'completed').length,
  }

  const updateStatus = (id: string, newStatus: MaintenanceStatus) => {
    const current = localRequests.length > 0 ? localRequests : fetchedRequests
    setLocalRequests(current.map((r) => r.id === id ? { ...r, status: newStatus } : r))
    toast.success(`تم تحديث الحالة إلى: ${MAINTENANCE_STATUS_CONFIG[newStatus].label}`)
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الطلبات" value={stats.total} accent="navy" />
        <StatCard title="قيد الانتظار" value={stats.pending} accent="gold" />
        <StatCard title="قيد التنفيذ" value={stats.inProgress} accent="teal" />
        <StatCard title="مكتمل" value={stats.completed} accent="teal" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'approved', 'in_progress', 'completed'] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterStatus === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
              {s === 'all' ? 'الكل' : MAINTENANCE_STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
          طلب صيانة
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((req) => {
            const typeConfig = MAINTENANCE_TYPE_CONFIG[req.requestType]
            const priorityConfig = MAINTENANCE_PRIORITY_CONFIG[req.priority]
            const statusConfig = MAINTENANCE_STATUS_CONFIG[req.status]
            return (
              <motion.div key={req.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card className={cn(req.priority === 'critical' && 'border-s-4 border-s-red-500')}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg">{typeConfig.emoji}</span>
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                        <Badge className={priorityConfig.color}>{priorityConfig.label}</Badge>
                        <code className="text-xs text-slate-500">{req.requestNumber}</code>
                      </div>
                      <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{req.title}</h3>
                      {req.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{req.description}</p>}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        {req.assetName && <span>🏗️ {req.assetName}</span>}
                        <span>📅 {req.reportedDate}</span>
                        <span>👤 {req.reportedBy}</span>
                        {req.assignedTo && <span>🔧 {req.assignedTo}</span>}
                        {req.estimatedCost && <span>💰 {formatCurrency(req.estimatedCost)}</span>}
                        {req.qualityRating && <span>⭐ {req.qualityRating}/5</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {req.status === 'pending' && (
                        <Button variant="primary" size="sm" icon={<CheckCircle className="h-3.5 w-3.5" />} onClick={() => updateStatus(req.id, 'approved')}>اعتماد</Button>
                      )}
                      {req.status === 'approved' && (
                        <Button variant="gold" size="sm" icon={<Play className="h-3.5 w-3.5" />} onClick={() => updateStatus(req.id, 'in_progress')}>بدء</Button>
                      )}
                      {req.status === 'in_progress' && (
                        <Button variant="primary" size="sm" icon={<CheckCircle className="h-3.5 w-3.5" />} onClick={() => updateStatus(req.id, 'completed')}>إتمام</Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد طلبات صيانة</div>}
      </div>

      <AddMaintenanceModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={(data) => {
        const newReq: MaintenanceRequest = {
          id: `m${Date.now()}`, requestNumber: `MR-${new Date().getFullYear()}-${String(requests.length + 44).padStart(4, '0')}`,
          ...data, status: 'pending', reportedBy: 'المستخدم الحالي', reportedDate: new Date().toISOString().split('T')[0],
        }
        const current = localRequests.length > 0 ? localRequests : fetchedRequests
        setLocalRequests([newReq, ...current])
        toast.success('تم إنشاء طلب الصيانة')
        setShowAddModal(false)
      }} />
    </>
  )
}

const maintenanceSchema = z.object({
  title: z.string().min(3, 'العنوان مطلوب (3 أحرف على الأقل)'),
  description: z.string().optional(),
  requestType: z.enum(['corrective', 'preventive', 'emergency']).default('corrective'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  targetCompletion: z.string().optional(),
  estimatedCost: z.string().optional(),
})

type MaintenanceFormData = z.infer<typeof maintenanceSchema>

function AddMaintenanceModal({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void
  onAdd: (data: Pick<MaintenanceRequest, 'title' | 'description' | 'requestType' | 'priority' | 'targetCompletion' | 'estimatedCost'>) => void
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: { title: '', description: '', requestType: 'corrective', priority: 'medium', targetCompletion: '', estimatedCost: '' },
  })

  const onSubmit = (data: MaintenanceFormData) => {
    onAdd({
      ...data,
      estimatedCost: Number(data.estimatedCost) || 0,
    })
    reset()
  }

  return (
    <Modal open={open} onClose={onClose} title="طلب صيانة جديد" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="العنوان" {...register('title')} placeholder="وصف مختصر للمشكلة..." error={errors.title?.message} />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">التفاصيل</label>
          <textarea {...register('description')} rows={2} placeholder="تفاصيل إضافية..." className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="النوع" {...register('requestType')} options={Object.entries(MAINTENANCE_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: `${c.emoji} ${c.label}` }))} error={errors.requestType?.message} />
          <Select label="الأولوية" {...register('priority')} options={Object.entries(MAINTENANCE_PRIORITY_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))} error={errors.priority?.message} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="تاريخ الإنجاز المستهدف" type="date" {...register('targetCompletion')} error={errors.targetCompletion?.message} />
          <Input label="التكلفة المقدرة (ر.س)" type="number" {...register('estimatedCost')} error={errors.estimatedCost?.message} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>إلغاء</Button>
          <Button type="submit" variant="gold">إنشاء الطلب</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Checklists Section ─────────────────────────────────────────

function ChecklistsSection() {
  const { data: checklists = [], isLoading, error } = useMaintenanceChecklists()
  const stats = useChecklistStats()
  const [filterCategory, setFilterCategory] = useState<ChecklistCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (checklists.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد قوائم تدقيق صيانة مسجلة حاليا" />

  const filtered = checklists.filter((c) =>
    (filterCategory === 'all' || c.category === filterCategory) &&
    (filterStatus === 'all' || c.status === filterStatus),
  )

  const getComplianceColor = (pct: number) => {
    if (pct >= 80) return 'bg-emerald-500'
    if (pct >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getComplianceTextColor = (pct: number) => {
    if (pct >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (pct >= 50) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي القوائم" value={stats.total} accent="navy" />
        <StatCard title="مكتمل" value={stats.completed} accent="teal" />
        <StatCard title="قيد التنفيذ" value={stats.inProgress} accent="gold" />
        <StatCard title="متوسط الامتثال" value={`${stats.avgCompliance}%`} accent="teal" />
      </div>

      {/* Category filter chips */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button onClick={() => setFilterCategory('all')} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterCategory === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
          الكل
        </button>
        {(Object.entries(CHECKLIST_CATEGORY_CONFIG) as [ChecklistCategory, { label: string; emoji: string }][]).map(([key, config]) => (
          <button key={key} onClick={() => setFilterCategory(key)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterCategory === key ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
            {config.emoji} {config.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(['all', 'pending', 'in_progress', 'completed'] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterStatus === s ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
            {s === 'all' ? 'كل الحالات' : CHECKLIST_STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* Checklist cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((checklist) => {
            const categoryConfig = CHECKLIST_CATEGORY_CONFIG[checklist.category]
            const statusConfig = CHECKLIST_STATUS_CONFIG[checklist.status]
            const compliance = checklist.compliance_percentage ?? 0
            const isExpanded = expandedId === checklist.id

            return (
              <motion.div key={checklist.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg">{categoryConfig.emoji}</span>
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                        <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{categoryConfig.label}</Badge>
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-slate-600 dark:bg-slate-800 dark:text-slate-400">{checklist.checklist_code}</code>
                      </div>
                      <h3 className="mt-1 font-bold text-slate-900 dark:text-white">{checklist.title_ar}</h3>

                      {/* Compliance bar */}
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div className={cn('h-full rounded-full transition-all', getComplianceColor(compliance))} style={{ width: `${compliance}%` }} />
                        </div>
                        <span className={cn('text-sm font-bold', getComplianceTextColor(compliance))}>{compliance}%</span>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>👤 {checklist.inspector_name}</span>
                        <span>📅 {checklist.inspection_date}</span>
                        {checklist.notes && <span>📝 {checklist.notes}</span>}
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <button onClick={() => setExpandedId(isExpanded ? null : checklist.id)} className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Expanded checklist items */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                          <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">بنود الفحص</h4>
                          <div className="space-y-2">
                            {checklist.checklist_items.map((item, idx) => {
                              const itemStatus = (item as Record<string, unknown>).status as string
                              const itemConfig = CHECKLIST_ITEM_STATUS[itemStatus as keyof typeof CHECKLIST_ITEM_STATUS] ?? CHECKLIST_ITEM_STATUS.na
                              const itemNotes = (item as Record<string, unknown>).notes as string
                              const itemDesc = (item as Record<string, unknown>).description as string
                              const itemFreq = (item as Record<string, unknown>).frequency as string
                              const itemInspector = (item as Record<string, unknown>).inspector as string

                              const itemBadgeColor = itemStatus === 'pass'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : itemStatus === 'fail'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'

                              return (
                                <div key={idx} className={cn('rounded-lg p-3', itemStatus === 'fail' ? 'bg-red-50 dark:bg-red-950/20' : 'bg-slate-50 dark:bg-slate-800/50')}>
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2">
                                      {itemStatus === 'pass' && <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />}
                                      {itemStatus === 'fail' && <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
                                      {itemStatus === 'na' && <CircleMinus className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}
                                      <div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{itemDesc}</p>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                          <span>🔄 {itemFreq}</span>
                                          <span>👤 {itemInspector}</span>
                                        </div>
                                        {itemStatus === 'fail' && itemNotes && (
                                          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">⚠️ {itemNotes}</p>
                                        )}
                                        {itemStatus === 'na' && itemNotes && (
                                          <p className="mt-1 text-xs text-slate-400">{itemNotes}</p>
                                        )}
                                      </div>
                                    </div>
                                    <Badge className={cn('shrink-0 text-xs', itemBadgeColor)}>
                                      {itemConfig.label}
                                    </Badge>
                                  </div>
                                </div>
                              )
                            })}
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
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد قوائم تدقيق</div>}
      </div>
    </>
  )
}

// ─── Waste Section ──────────────────────────────────────────────

function WasteSection() {
  const { data: records = [], isLoading, error } = useWasteRecords()
  const [filterType, setFilterType] = useState<WasteType | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (records.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد سجلات نفايات مسجلة حاليا" />

  const filtered = filterType === 'all' ? records : records.filter((r) => r.wasteType === filterType)

  const totalKg = records.reduce((s, r) => s + (r.unit === 'kg' ? r.quantity : r.quantity * 1000), 0)
  const recyclableKg = records.filter((r) => r.wasteType === 'recyclable').reduce((s, r) => s + r.quantity, 0)
  const hazardousKg = records.filter((r) => r.wasteType === 'hazardous' || r.wasteType === 'medical').reduce((s, r) => s + r.quantity, 0)

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="الإجمالي (كجم)" value={totalKg} accent="navy" />
        <StatCard title="قابل للتدوير" value={`${recyclableKg} كجم`} accent="teal" />
        <StatCard title="خطر/طبي" value={`${hazardousKg} كجم`} accent="danger" />
        <StatCard title="سجلات" value={records.length} accent="gold" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterType('all')} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>الكل</button>
          {Object.entries(WASTE_TYPE_CONFIG).map(([key, config]) => (
            <button key={key} onClick={() => setFilterType(key as WasteType)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === key ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
              {config.emoji} {config.label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
          تسجيل نفايات
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.map((record) => {
          const typeConfig = WASTE_TYPE_CONFIG[record.wasteType]
          const disposal = DISPOSAL_METHODS.find((d) => d.value === record.disposalMethod)
          return (
            <Card key={record.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={typeConfig.color}>{typeConfig.emoji} {typeConfig.label}</Badge>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{record.quantity} {record.unit === 'kg' ? 'كجم' : record.unit}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>📅 {record.recordDate}</span>
                    <span>📍 {record.sourceLocation}</span>
                    <span>🔄 {disposal?.label}</span>
                    {record.contractorName && <span>🏭 {record.contractorName}</span>}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد سجلات نفايات</div>}
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="تسجيل نفايات">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="التاريخ" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            <Select label="النوع" defaultValue="general" options={Object.entries(WASTE_TYPE_CONFIG).map(([v, c]) => ({ value: v, label: `${c.emoji} ${c.label}` }))} />
          </div>
          <Input label="المصدر/الموقع" placeholder="المطبخ المركزي، العيادة..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="الكمية" type="number" placeholder="0" />
            <Select label="الوحدة" defaultValue="kg" options={[{ value: 'kg', label: 'كيلوغرام' }, { value: 'ton', label: 'طن' }, { value: 'liter', label: 'لتر' }]} />
          </div>
          <Select label="طريقة التخلص" defaultValue="landfill" options={DISPOSAL_METHODS.map((d) => ({ value: d.value, label: d.label }))} />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>إلغاء</Button>
            <Button variant="gold" onClick={() => { toast.success('تم تسجيل النفايات'); setShowAddModal(false) }}>تسجيل</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
