import { useState } from 'react'
import { FileText, Plus, Check, Clock, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge, Input, Select, Modal } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import { SHIFT_CONFIG, CATEGORY_CONFIG, type Shift, type ShiftHandoverItem, type HandoverCategory, type HandoverPriority } from '../types'

function getCurrentShift(): Shift {
  const hour = new Date().getHours()
  if (hour >= 7 && hour < 15) return 'صباحي'
  if (hour >= 15 && hour < 23) return 'مسائي'
  return 'ليلي'
}

const DEMO_ITEMS: ShiftHandoverItem[] = [
  { id: 'h1', category: 'critical', title: 'ارتفاع حرارة المستفيد', description: 'أحمد محمد — حرارة 38.5°C تم إعطاء خافض حرارة، يحتاج متابعة', beneficiaryName: 'أحمد محمد السالم', priority: 'high', shiftType: 'صباحي', status: 'active', createdAt: new Date().toISOString(), createdBy: 'ممرض: سعيد' },
  { id: 'h2', category: 'medication', title: 'تأخر في إعطاء الأنسولين', description: 'نورة حسن — لم يتم إعطاء جرعة الأنسولين الصباحية بسبب انخفاض السكر', beneficiaryName: 'نورة حسن العتيبي', priority: 'high', shiftType: 'صباحي', status: 'active', createdAt: new Date().toISOString(), createdBy: 'ممرض: سعيد' },
  { id: 'h3', category: 'care', title: 'تغيير ضمادة', description: 'خالد سعيد — يحتاج تغيير ضمادة الجرح في الساق اليمنى', beneficiaryName: 'خالد سعيد الغامدي', priority: 'medium', shiftType: 'صباحي', status: 'active', createdAt: new Date().toISOString(), createdBy: 'ممرض: سعيد' },
  { id: 'h4', category: 'pending', title: 'نتائج تحليل دم', description: 'فاطمة عبدالله — بانتظار نتائج تحليل CBC من المختبر', beneficiaryName: 'فاطمة عبدالله الزهراني', priority: 'low', shiftType: 'صباحي', status: 'active', createdAt: new Date().toISOString(), createdBy: 'ممرض: سعيد' },
]

export function ShiftHandoverPage() {
  const currentShift = getCurrentShift()
  const shiftInfo = SHIFT_CONFIG[currentShift]
  const [items, setItems] = useState(DEMO_ITEMS)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterCategory, setFilterCategory] = useState<HandoverCategory | 'all'>('all')

  const filtered = filterCategory === 'all' ? items.filter((i) => i.status === 'active') : items.filter((i) => i.status === 'active' && i.category === filterCategory)

  const stats = {
    total: items.filter((i) => i.status === 'active').length,
    critical: items.filter((i) => i.status === 'active' && i.category === 'critical').length,
    medication: items.filter((i) => i.status === 'active' && i.category === 'medication').length,
    pending: items.filter((i) => i.status === 'active' && i.category === 'pending').length,
  }

  const markDone = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'completed' as const } : i)))
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
    setItems((prev) => [newItem, ...prev])
    toast.success('تمت إضافة بند التسليم')
    setShowAddModal(false)
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="تسليم الورديات"
        description="بنود التسليم والاستلام بين الورديات"
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
