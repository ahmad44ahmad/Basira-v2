import { useState } from 'react'
import { z } from 'zod'
import { UtensilsCrossed, ClipboardCheck, Package, Plus, CheckCircle, XCircle, AlertTriangle, ThumbsUp, ThumbsDown, Truck, Phone, Calendar, Users, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge, Input, Select, Modal, Tabs, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  MEAL_TYPE_CONFIG, MEAL_STATUS_CONFIG, QUALITY_CATEGORIES, DEFAULT_CHECKLIST,
  TRANSACTION_TYPE_CONFIG,
  type DailyMeal, type MealType, type MealStatus,
  type QualityCheckItem, type ComplianceStatus,
  type InventoryItem, type InventoryTransaction,
} from '../types'
import { useDailyMeals, useUpdateMealStatus, useInventory, useInventoryTransactions } from '../api/catering-queries'
import { useCateringSuppliers } from '../api/supplier-queries'
import type { CateringSupplier } from '@/types/database'

// ─── Main Page ──────────────────────────────────────────────────

export function CateringPage() {
  const [activeTab, setActiveTab] = useState('daily')

  const tabs = [
    { id: 'daily', label: 'السجل اليومي' },
    { id: 'quality', label: 'مراقبة الجودة' },
    { id: 'inventory', label: 'المخزون' },
    { id: 'suppliers', label: 'الموردون' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="إدارة التغذية"
        description="السجل اليومي ومراقبة الجودة وإدارة المخزون"
        icon={<UtensilsCrossed className="h-5 w-5" />}
      />

      <Tabs tabs={tabs.map((t) => ({ id: t.id, label: t.label }))} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'daily' && <DailyLogSection />}
        {activeTab === 'quality' && <QualitySection />}
        {activeTab === 'inventory' && <InventorySection />}
        {activeTab === 'suppliers' && <SuppliersSection />}
      </div>
    </div>
  )
}

// ─── Daily Log Section ──────────────────────────────────────────

function DailyLogSection() {
  const { data: fetchedMeals = [], isLoading, error } = useDailyMeals()
  const [localMeals, setLocalMeals] = useState<DailyMeal[]>([])
  const meals = localMeals.length > 0 ? localMeals : fetchedMeals
  const [filterMealType, setFilterMealType] = useState<MealType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<MealStatus | 'all'>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (fetchedMeals.length === 0 && localMeals.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد وجبات مسجلة لهذا اليوم" />

  const filtered = meals.filter((m) =>
    (filterMealType === 'all' || m.mealType === filterMealType) &&
    (filterStatus === 'all' || m.status === filterStatus),
  )

  const todayMeals = meals
  const consumed = todayMeals.filter((m) => m.status === 'consumed').length
  const refused = todayMeals.filter((m) => m.status === 'refused').length
  const pending = todayMeals.filter((m) => m.status === 'pending').length
  const specialDiets = new Set(todayMeals.filter((m) => m.dietaryPlan !== 'قياسي').map((m) => m.beneficiaryId)).size

  const updateMealStatus = (id: string, status: MealStatus) => {
    const current = localMeals.length > 0 ? localMeals : fetchedMeals
    setLocalMeals(current.map((m) => m.id === id ? { ...m, status, deliveredAt: new Date().toISOString() } : m))
    toast.success(`تم تحديث الحالة: ${MEAL_STATUS_CONFIG[status].label}`)
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="تم الاستهلاك" value={consumed} accent="teal" />
        <StatCard title="قيد الانتظار" value={pending} accent="gold" />
        <StatCard title="رفض" value={refused} accent="danger" />
        <StatCard title="حميات خاصة" value={specialDiets} accent="navy" />
      </div>

      {/* Meal type filter */}
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => setFilterMealType('all')} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterMealType === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>الكل</button>
        {Object.entries(MEAL_TYPE_CONFIG).map(([key, config]) => (
          <button key={key} onClick={() => setFilterMealType(key as MealType)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterMealType === key ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
            {config.emoji} {config.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'pending', 'delivered', 'consumed', 'refused'] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterStatus === s ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
            {s === 'all' ? 'جميع الحالات' : MEAL_STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* Meal cards */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((meal) => {
            const typeConfig = MEAL_TYPE_CONFIG[meal.mealType]
            const statusConfig = MEAL_STATUS_CONFIG[meal.status]
            return (
              <motion.div key={meal.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{typeConfig.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{meal.beneficiaryName}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>{typeConfig.label}</span>
                        {meal.dietaryPlan !== 'قياسي' && (
                          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">{meal.dietaryPlan}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    {meal.status === 'pending' && (
                      <div className="flex gap-1">
                        <button onClick={() => updateMealStatus(meal.id, 'consumed')} className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400" title="تم الاستهلاك">
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button onClick={() => updateMealStatus(meal.id, 'refused')} className="rounded-lg bg-red-100 p-1.5 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400" title="رفض">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد وجبات</div>}
      </div>
    </>
  )
}

// ─── Quality Section ────────────────────────────────────────────

const qualitySubmissionSchema = z.object({
  checklist: z.array(z.object({
    id: z.string(),
    question: z.string(),
    category: z.string(),
    status: z.enum(['compliant', 'non_compliant'], { required_error: 'يجب تقييم هذا البند' }),
    observation: z.string().optional(),
    deductionAmount: z.number().min(0).default(0),
  })),
  notes: z.string().optional(),
})

function QualitySection() {
  const [checklist, setChecklist] = useState<QualityCheckItem[]>(
    DEFAULT_CHECKLIST.map((item) => ({ ...item, status: null, deductionAmount: 0 })),
  )
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const compliant = checklist.filter((c) => c.status === 'compliant').length
  const nonCompliant = checklist.filter((c) => c.status === 'non_compliant').length
  const totalPenalty = checklist.reduce((s, c) => s + c.deductionAmount, 0)
  const answered = checklist.filter((c) => c.status !== null).length

  const updateItem = (id: string, updates: Partial<QualityCheckItem>) => {
    setChecklist((prev) => prev.map((c) =>
      c.id === id ? { ...c, ...updates, deductionAmount: updates.status === 'compliant' ? 0 : c.deductionAmount } : c,
    ))
  }

  const handleSubmit = () => {
    if (answered < checklist.length) {
      toast.error('يرجى تقييم جميع البنود')
      return
    }

    const parseResult = qualitySubmissionSchema.safeParse({ checklist, notes })
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]
      toast.error(firstError.message)
      return
    }

    setSubmitted(true)
    toast.success('تم حفظ تقييم الجودة')
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="مطابق" value={compliant} accent="teal" />
        <StatCard title="غير مطابق" value={nonCompliant} accent="danger" />
        <StatCard title="إجمالي الحسم" value={`${totalPenalty} ر.س`} accent="gold" />
        <StatCard title="التقدم" value={`${answered}/${checklist.length}`} accent="navy" />
      </div>

      {submitted ? (
        <Card className="border-2 border-emerald-500">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">تم حفظ التقييم</h3>
            <p className="mt-1 text-sm text-slate-500">مطابق: {compliant} | غير مطابق: {nonCompliant} | الحسم: {totalPenalty} ر.س</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSubmitted(false); setChecklist(DEFAULT_CHECKLIST.map((item) => ({ ...item, status: null, deductionAmount: 0 }))); setNotes('') }}>
              تقييم جديد
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {QUALITY_CATEGORIES.map((cat) => {
            const items = checklist.filter((c) => c.category === cat.id)
            if (items.length === 0) return null
            return (
              <Card key={cat.id}>
                <CardHeader>
                  <CardTitle className="text-base">{cat.emoji} {cat.label}</CardTitle>
                </CardHeader>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className={cn('rounded-lg border p-3 transition-colors', item.status === 'compliant' ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10' : item.status === 'non_compliant' ? 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700')}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{item.question}</p>
                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => updateItem(item.id, { status: 'compliant' })}
                            className={cn('rounded-lg p-2 transition-colors', item.status === 'compliant' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-emerald-100 dark:bg-slate-800')}
                            title="مطابق"
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateItem(item.id, { status: 'non_compliant' })}
                            className={cn('rounded-lg p-2 transition-colors', item.status === 'non_compliant' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-red-100 dark:bg-slate-800')}
                            title="غير مطابق"
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {item.status === 'non_compliant' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-3 grid grid-cols-2 gap-3">
                          <Input label="ملاحظة المخالفة" value={item.observation || ''} onChange={(e) => updateItem(item.id, { observation: e.target.value })} placeholder="وصف المخالفة..." />
                          <Input label="قيمة الحسم (ر.س)" type="number" value={String(item.deductionAmount)} onChange={(e) => updateItem(item.id, { deductionAmount: Number(e.target.value) || 0 })} />
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}

          {/* Notes & Submit */}
          <Card>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">ملاحظات عامة</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="ملاحظات إضافية عن التقييم..." className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
            </div>

            {/* Summary bar */}
            {nonCompliant > 0 && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                  {nonCompliant} مخالفة — إجمالي الحسم: {totalPenalty} ر.س
                </span>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button variant="gold" onClick={handleSubmit} disabled={answered < checklist.length}>
                حفظ التقييم ({answered}/{checklist.length})
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

// ─── Inventory Section ──────────────────────────────────────────

function InventorySection() {
  const { data: inventory = [], isLoading: isLoadingInventory, error: errorInventory } = useInventory()
  const { data: transactions = [], isLoading: isLoadingTransactions, error: errorTransactions } = useInventoryTransactions()
  const [view, setView] = useState<'stock' | 'transactions'>('stock')

  const isLoading = isLoadingInventory || isLoadingTransactions
  const error = errorInventory || errorTransactions

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (inventory.length === 0 && transactions.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد أصناف أو حركات مخزون مسجلة حاليا" />

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length
  const totalItems = inventory.length

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الأصناف" value={totalItems} accent="navy" />
        <StatCard title="مخزون منخفض" value={lowStockCount} accent="danger" />
        <StatCard title="حركات اليوم" value={transactions.filter((t) => t.transactionDate === new Date().toISOString().split('T')[0]).length} accent="teal" />
        <StatCard title="الفئات" value={new Set(inventory.map((i) => i.category)).size} accent="gold" />
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setView('stock')} className={cn('rounded-full px-4 py-1.5 text-xs font-medium transition-colors', view === 'stock' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
          المخزون الحالي
        </button>
        <button onClick={() => setView('transactions')} className={cn('rounded-full px-4 py-1.5 text-xs font-medium transition-colors', view === 'transactions' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
          حركات المخزون
        </button>
      </div>

      {view === 'stock' ? (
        <div className="space-y-2">
          {inventory.map((item) => {
            const stockRatio = item.currentStock / item.maxStock
            const isLow = item.currentStock <= item.minStock
            return (
              <Card key={item.id} className={cn(isLow && 'border-r-4 border-r-red-500')}>
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">{item.nameAr}</h3>
                      <code className="text-xs text-slate-500">{item.code}</code>
                      <Badge variant="outline">{item.category}</Badge>
                      {isLow && <Badge variant="danger">مخزون منخفض</Badge>}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className={cn('h-full rounded-full transition-all', isLow ? 'bg-red-500' : stockRatio > 0.5 ? 'bg-emerald-500' : 'bg-amber-500')} style={{ width: `${Math.min(stockRatio * 100, 100)}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.currentStock} / {item.maxStock} {item.unit}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>الحد الأدنى: {item.minStock}</span>
                      <span>الاستهلاك اليومي: {item.dailyQuota}</span>
                      <span>يكفي لـ {Math.floor(item.currentStock / item.dailyQuota)} يوم</span>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const typeConfig = TRANSACTION_TYPE_CONFIG[tx.transactionType]
            return (
              <Card key={tx.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{typeConfig.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{tx.materialName}</p>
                        <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>📅 {tx.transactionDate}</span>
                        <span>👤 {tx.createdBy}</span>
                        {tx.supplierName && <span>🏭 {tx.supplierName}</span>}
                        {tx.invoiceNumber && <span>🧾 {tx.invoiceNumber}</span>}
                        {tx.reason && <span>📝 {tx.reason}</span>}
                      </div>
                    </div>
                  </div>
                  <span className={cn('text-lg font-bold', tx.transactionType === 'receipt' ? 'text-emerald-600' : 'text-red-600')}>
                    {tx.transactionType === 'receipt' ? '+' : '-'}{tx.quantity}
                  </span>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}

// ─── Suppliers Section ─────────────────────────────────────────

const SUPPLIER_STATUS_CONFIG: Record<CateringSupplier['status'], { label: string; color: string }> = {
  active: { label: 'نشط', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  suspended: { label: 'معلّق', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  terminated: { label: 'منتهي', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

function SuppliersSection() {
  const { data: suppliers = [], isLoading, error } = useCateringSuppliers()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (suppliers.length === 0) return <EmptyState title="لا يوجد موردون" description="لم يتم تسجيل أي موردين حتى الآن" />

  const today = new Date().toISOString().split('T')[0]
  const activeSuppliers = suppliers.filter((s) => s.status === 'active')
  const emergencyBackups = suppliers.filter((s) => s.is_emergency_backup && s.status === 'active')
  const totalCapacity = activeSuppliers.reduce((sum, s) => sum + (s.capacity_limit ?? 0), 0)
  const expiringContracts = activeSuppliers.filter((s) => {
    if (!s.contract_end) return false
    const daysLeft = Math.ceil((new Date(s.contract_end).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft >= 0 && daysLeft <= 90
  })

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="موردون نشطون" value={activeSuppliers.length} accent="teal" />
        <StatCard title="احتياطي طوارئ" value={emergencyBackups.length} accent="danger" />
        <StatCard title="السعة الإجمالية" value={totalCapacity} accent="navy" />
        <StatCard title="عقود قاربت الانتهاء" value={expiringContracts.length} accent="gold" />
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {suppliers.map((supplier) => {
            const statusConfig = SUPPLIER_STATUS_CONFIG[supplier.status]
            const daysLeft = supplier.contract_end
              ? Math.ceil((new Date(supplier.contract_end).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24))
              : null
            const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 90

            return (
              <motion.div key={supplier.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className={cn(supplier.is_emergency_backup && 'border-r-4 border-r-red-500')}>
                  <div className="space-y-3">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{supplier.supplier_name}</h3>
                          <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                          {supplier.is_emergency_backup && (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                              <Truck className="ml-1 inline h-3 w-3" />
                              احتياطي طوارئ
                            </Badge>
                          )}
                          {isExpiringSoon && supplier.status === 'active' && (
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                              <ShieldAlert className="ml-1 inline h-3 w-3" />
                              ينتهي خلال {daysLeft} يوم
                            </Badge>
                          )}
                        </div>
                        {supplier.contract_number && (
                          <p className="mt-0.5 text-xs text-slate-500">عقد رقم: {supplier.contract_number}</p>
                        )}
                      </div>
                    </div>

                    {/* Details row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {supplier.service_type && (
                        <span className="flex items-center gap-1">
                          <UtensilsCrossed className="h-3 w-3" />
                          {supplier.service_type}
                        </span>
                      )}
                      {supplier.capacity_limit != null && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          سعة: {supplier.capacity_limit} وجبة
                        </span>
                      )}
                      {supplier.is_emergency_backup && supplier.mobilization_time_hours != null && (
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-red-500" />
                          جاهزية: {supplier.mobilization_time_hours} ساعات
                        </span>
                      )}
                      {supplier.contact_name && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {supplier.contact_name}
                          {supplier.contact_phone && ` — ${supplier.contact_phone}`}
                        </span>
                      )}
                      {(supplier.contract_start || supplier.contract_end) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {supplier.contract_start ?? '—'} → {supplier.contract_end ?? '—'}
                        </span>
                      )}
                    </div>

                    {/* Notes */}
                    {supplier.notes && (
                      <p className="text-xs text-slate-400 dark:text-slate-500">{supplier.notes}</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </>
  )
}
