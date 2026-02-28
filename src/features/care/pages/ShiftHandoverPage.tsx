import { useState } from 'react'
import { FileText, Plus, Check, Clock, AlertTriangle, Activity, UserCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge, Input, Select, Modal, Spinner, Tabs } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import { SHIFT_CONFIG, CATEGORY_CONFIG, type Shift, type ShiftHandoverItem, type HandoverCategory, type HandoverPriority } from '../types'
import { useHandoverItems } from '../api/care-queries'
import { useStaffWellbeing, useWellbeingStats } from '../api/wellbeing-queries'

function getCurrentShift(): Shift {
  const hour = new Date().getHours()
  if (hour >= 7 && hour < 15) return 'صباحي'
  if (hour >= 15 && hour < 23) return 'مسائي'
  return 'ليلي'
}

const WELLBEING_RISK_CONFIG = {
  green: { label: 'مراقبة روتينية', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', barColor: 'bg-emerald-500' },
  yellow: { label: 'مقابلة شهرية', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', barColor: 'bg-amber-500' },
  orange: { label: 'تنبيه المشرف', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', barColor: 'bg-orange-500' },
  red: { label: 'تدخّل فوري', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', barColor: 'bg-red-500' },
} as const

export function ShiftHandoverPage() {
  const currentShift = getCurrentShift()
  const shiftInfo = SHIFT_CONFIG[currentShift]
  const { data: fetchedItems = [], isLoading, error } = useHandoverItems()
  const [localItems, setLocalItems] = useState<ShiftHandoverItem[]>([])
  const items = [...localItems, ...fetchedItems]
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterCategory, setFilterCategory] = useState<HandoverCategory | 'all'>('all')
  const [activeTab, setActiveTab] = useState<'handover' | 'wellbeing'>('handover')

  const filtered = filterCategory === 'all' ? items.filter((i) => i.status === 'active') : items.filter((i) => i.status === 'active' && i.category === filterCategory)

  const stats = {
    total: items.filter((i) => i.status === 'active').length,
    critical: items.filter((i) => i.status === 'active' && i.category === 'critical').length,
    medication: items.filter((i) => i.status === 'active' && i.category === 'medication').length,
    pending: items.filter((i) => i.status === 'active' && i.category === 'pending').length,
  }

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (fetchedItems.length === 0 && localItems.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد بنود تسليم مسجلة للورديات حالياً" />

  const markDone = (id: string) => {
    setLocalItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'completed' as const } : i)))
    toast.success('تم إتمام البند')
  }

  const handleAdd = (data: { title: string; description: string; category: HandoverCategory; priority: HandoverPriority }) => {
    const newItem: ShiftHandoverItem = {
      id: `h${Date.now()}`,
      ...data,
      shiftType: currentShift,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'المستخدم الحالي',
    }
    setLocalItems((prev) => [newItem, ...prev])
    toast.success('تمت إضافة بند التسليم')
    setShowAddModal(false)
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="تسليم الورديات (I-PASS)"
        description="نقل المناوبات بإطار I-PASS ومتابعة رفاهية الموظفين"
        icon={<FileText className="h-5 w-5" />}
        actions={
          <div className="flex items-center gap-2">
            <Badge className={shiftInfo.color}>{shiftInfo.label}</Badge>
            <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
              إضافة بند
            </Button>
          </div>
        }
      />

      <Tabs
        tabs={[
          { id: 'handover', label: 'بنود التسليم' },
          { id: 'wellbeing', label: 'رفاهية الموظفين' },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as 'handover' | 'wellbeing')}
        className="mb-6"
      />

      {activeTab === 'wellbeing' ? (
        <StaffWellbeingSection />
      ) : (
      <>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي البنود" value={stats.total} accent="navy" />
        <StatCard title="حرج" value={stats.critical} accent="danger" />
        <StatCard title="أدوية" value={stats.medication} accent="teal" />
        <StatCard title="معلق" value={stats.pending} accent="gold" />
      </div>

      {/* Category Filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'critical', 'medication', 'care', 'pending'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filterCategory === cat ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {cat === 'all' ? 'الكل' : `${CATEGORY_CONFIG[cat].emoji} ${CATEGORY_CONFIG[cat].label}`}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((item) => {
            const catConfig = CATEGORY_CONFIG[item.category]
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card className={cn(item.priority === 'high' && 'border-r-4 border-r-danger')}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={catConfig.color}>{catConfig.emoji} {catConfig.label}</Badge>
                        {item.priority === 'high' && <Badge variant="danger">أولوية عالية</Badge>}
                        <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                        {item.beneficiaryName && <span>👤 {item.beneficiaryName}</span>}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.createdBy}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" icon={<Check className="h-4 w-4" />} onClick={() => markDone(item.id)}>
                      تم
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-400">لا توجد بنود نشطة</div>
        )}
      </div>

      {/* Add Modal */}
      <AddHandoverModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
      </>
      )}
    </div>
  )
}

function StaffWellbeingSection() {
  const { data: scores = [], isLoading, error } = useStaffWellbeing()
  const stats = useWellbeingStats()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (scores.length === 0) return <EmptyState title="لا توجد تقييمات" description="لم يتم إجراء تقييمات رفاهية للموظفين بعد" />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي التقييمات" value={stats.totalAssessed} accent="teal" />
        <StatCard title="متوسط النقاط" value={stats.avgScore} accent="navy" />
        <StatCard title="تنبيه (برتقالي)" value={stats.orangeCount} accent="gold" />
        <StatCard title="تدخّل فوري (أحمر)" value={stats.redCount} accent="danger" />
      </div>

      <div className="space-y-3">
        {scores.map((score) => {
          const config = WELLBEING_RISK_CONFIG[score.risk_level ?? 'green']
          const compositeScore = score.composite_score ?? 0

          return (
            <Card key={score.id} className={cn(
              score.risk_level === 'red' && 'border-r-4 border-r-red-500',
              score.risk_level === 'orange' && 'border-r-4 border-r-orange-500',
            )}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold',
                      config.color,
                    )}>
                      {compositeScore}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{score.employee_name}</h3>
                      <p className="text-xs text-slate-500">{score.assessment_date}</p>
                    </div>
                  </div>
                  <Badge className={config.color}>{config.label}</Badge>
                </div>

                {/* Composite score bar */}
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <motion.div
                    className={cn('h-full rounded-full', config.barColor)}
                    initial={{ width: 0 }}
                    animate={{ width: `${compositeScore}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                  {/* Threshold markers */}
                  <div className="absolute top-0 left-[40%] h-full w-px bg-amber-400" />
                  <div className="absolute top-0 left-[60%] h-full w-px bg-orange-400" />
                  <div className="absolute top-0 left-[80%] h-full w-px bg-red-400" />
                </div>

                {/* Component scores */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-xs">
                  {score.mbi_ee_score != null && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                      <span className="text-slate-500">MBI-EE</span>
                      <p className={cn('font-bold', (score.mbi_ee_score ?? 0) >= 27 ? 'text-red-600' : 'text-slate-900 dark:text-white')}>
                        {score.mbi_ee_score}
                      </p>
                    </div>
                  )}
                  {score.mbi_dp_score != null && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                      <span className="text-slate-500">MBI-DP</span>
                      <p className={cn('font-bold', (score.mbi_dp_score ?? 0) >= 10 ? 'text-red-600' : 'text-slate-900 dark:text-white')}>
                        {score.mbi_dp_score}
                      </p>
                    </div>
                  )}
                  {score.overtime_ratio != null && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                      <span className="text-slate-500">ساعات إضافية</span>
                      <p className="font-bold text-slate-900 dark:text-white">{Math.round((score.overtime_ratio ?? 0) * 100)}%</p>
                    </div>
                  )}
                  {score.consecutive_shifts != null && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                      <span className="text-slate-500">ورديات متتالية</span>
                      <p className={cn('font-bold', (score.consecutive_shifts ?? 0) >= 5 ? 'text-amber-600' : 'text-slate-900 dark:text-white')}>
                        {score.consecutive_shifts}
                      </p>
                    </div>
                  )}
                  {score.sick_leave_count != null && (
                    <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2 text-center">
                      <span className="text-slate-500">إجازات مرضية</span>
                      <p className="font-bold text-slate-900 dark:text-white">{score.sick_leave_count}</p>
                    </div>
                  )}
                </div>

                {score.intervention_notes && (
                  <div className={cn(
                    'rounded-lg p-3 text-xs',
                    score.risk_level === 'red' ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300'
                    : 'bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300'
                  )}>
                    <AlertTriangle className="inline h-3.5 w-3.5 ml-1" />
                    {score.intervention_notes}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function AddHandoverModal({ open, onClose, onAdd }: {
  open: boolean
  onClose: () => void
  onAdd: (data: { title: string; description: string; category: HandoverCategory; priority: HandoverPriority }) => void
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<HandoverCategory>('care')
  const [priority, setPriority] = useState<HandoverPriority>('medium')

  const handleSubmit = () => {
    if (!title.trim()) return
    onAdd({ title, description, category, priority })
    setTitle('')
    setDescription('')
  }

  return (
    <Modal open={open} onClose={onClose} title="إضافة بند تسليم">
      <div className="space-y-4">
        <Input label="العنوان" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="وصف مختصر للبند..." />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">التفاصيل</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="تفاصيل إضافية..."
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="التصنيف" value={category} onChange={(e) => setCategory(e.target.value as HandoverCategory)} options={[
            { value: 'critical', label: '🔴 حرج' },
            { value: 'medication', label: '💊 أدوية' },
            { value: 'care', label: '💗 رعاية' },
            { value: 'pending', label: '⏱️ معلق' },
          ]} />
          <Select label="الأولوية" value={priority} onChange={(e) => setPriority(e.target.value as HandoverPriority)} options={[
            { value: 'high', label: 'عالية' },
            { value: 'medium', label: 'متوسطة' },
            { value: 'low', label: 'منخفضة' },
          ]} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button variant="gold" onClick={handleSubmit} disabled={!title.trim()}>إضافة</Button>
        </div>
      </div>
    </Modal>
  )
}
