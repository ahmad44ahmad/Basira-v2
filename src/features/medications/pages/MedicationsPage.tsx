import { useState } from 'react'
import { Pill, Clock, CheckCircle, XCircle, AlertTriangle, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import { STATUS_CONFIG, FIVE_RIGHTS, type Medication, type MedicationStatus } from '../types'

const DEMO_MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'أنسولين', dosage: '10 وحدات', route: 'حقن تحت الجلد', frequency: 'قبل الوجبات', scheduledTime: '07:00', status: 'overdue', beneficiaryName: 'نورة حسن العتيبي', beneficiaryId: 'b004', room: 'غ-15', delayMinutes: 35, preRequirements: ['قياس السكر'], specialInstructions: 'حقن في البطن' },
  { id: 'm2', name: 'أملوديبين', dosage: '5 ملغ', route: 'فموي', frequency: 'مرة يومياً', scheduledTime: '08:00', status: 'pending', beneficiaryName: 'أحمد محمد السالم', beneficiaryId: 'b001', room: 'غ-12', preRequirements: ['قياس الضغط'] },
  { id: 'm3', name: 'كاربامازبين', dosage: '200 ملغ', route: 'فموي', frequency: 'مرتين يومياً', scheduledTime: '07:30', status: 'administered', beneficiaryName: 'ريم عبدالرحمن الشهري', beneficiaryId: 'b006', room: 'غ-10', allergies: ['البنسلين'] },
  { id: 'm4', name: 'باراسيتامول', dosage: '500 ملغ', route: 'فموي', frequency: 'عند الحاجة', scheduledTime: '09:00', status: 'pending', beneficiaryName: 'خالد سعيد الغامدي', beneficiaryId: 'b003', room: 'غ-3' },
  { id: 'm5', name: 'أوميبرازول', dosage: '20 ملغ', route: 'فموي', frequency: 'قبل الإفطار', scheduledTime: '06:30', status: 'administered', beneficiaryName: 'فاطمة عبدالله الزهراني', beneficiaryId: 'b002', room: 'غ-8' },
  { id: 'm6', name: 'ريسبيريدون', dosage: '1 ملغ', route: 'فموي', frequency: 'مساءً', scheduledTime: '20:00', status: 'pending', beneficiaryName: 'سلطان ماجد القحطاني', beneficiaryId: 'b005', room: 'غ-5', interactions: ['تجنب الكحول'] },
]

export function MedicationsPage() {
  const [medications, setMedications] = useState(DEMO_MEDICATIONS)
  const [filter, setFilter] = useState<MedicationStatus | 'all'>('all')
  const [administeringId, setAdministeringId] = useState<string | null>(null)

  const filtered = filter === 'all' ? medications : medications.filter((m) => m.status === filter)

  const stats = {
    total: medications.length,
    pending: medications.filter((m) => m.status === 'pending').length,
    overdue: medications.filter((m) => m.status === 'overdue').length,
    administered: medications.filter((m) => m.status === 'administered').length,
  }

  const handleAdminister = (id: string) => {
    setAdministeringId(id)
    setTimeout(() => {
      setMedications((prev) => prev.map((m) => m.id === id ? { ...m, status: 'administered' as const } : m))
      toast.success('تم تسجيل إعطاء الدواء بنجاح')
      setAdministeringId(null)
    }, 600)
  }

  const handleSkip = (id: string) => {
    setMedications((prev) => prev.map((m) => m.id === id ? { ...m, status: 'skipped' as const } : m))
    toast.warning('تم تخطي الدواء')
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="إعطاء الأدوية"
        description="جدول الأدوية وتوثيق الإعطاء وفق الحقوق الخمسة"
        icon={<Pill className="h-5 w-5" />}
      />

      {/* Five Rights Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 rounded-xl border border-teal/20 bg-teal/5 p-4">
        {FIVE_RIGHTS.map((right) => (
          <div key={right.id} className="flex items-center gap-1.5 text-sm">
            <span>{right.icon}</span>
            <span className="font-medium text-teal-dark dark:text-teal-light">{right.label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الأدوية" value={stats.total} accent="navy" />
        <StatCard title="قيد الانتظار" value={stats.pending} accent="teal" />
        <StatCard title="متأخر" value={stats.overdue} accent="danger" />
        <StatCard title="تم الإعطاء" value={stats.administered} accent="success" />
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />
        {(['all', 'pending', 'overdue', 'administered', 'skipped'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filter === f ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {f === 'all' ? 'الكل' : STATUS_CONFIG[f].label}
          </button>
        ))}
      </div>

      {/* Medication Cards */}
      <div className="space-y-3">
        {filtered.map((med) => {
          const config = STATUS_CONFIG[med.status]
          return (
            <motion.div
              key={med.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={cn(med.status === 'overdue' && 'border-red-300 dark:border-red-800')}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Med Info */}
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', med.status === 'overdue' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-teal/10 text-teal')}>
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{med.name}</h3>
                        <Badge className={cn(config.bgColor, config.color)}>{config.label}</Badge>
                      </div>
                      <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                        {med.dosage} — {med.route} — {med.frequency}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>👤 {med.beneficiaryName}</span>
                        <span>🏠 {med.room}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {med.scheduledTime}
                        </span>
                        {med.delayMinutes && <span className="font-medium text-danger">متأخر {med.delayMinutes} دقيقة</span>}
                      </div>

                      {/* Warnings */}
                      {med.allergies && (
                        <div className="mt-2 flex items-center gap-1 text-xs font-medium text-danger">
                          <AlertTriangle className="h-3 w-3" />
                          حساسية: {med.allergies.join(', ')}
                        </div>
                      )}
                      {med.preRequirements && (
                        <p className="mt-1 text-xs text-amber-600">متطلبات: {med.preRequirements.join(', ')}</p>
                      )}
                      {med.specialInstructions && (
                        <p className="mt-1 text-xs text-blue-600">تعليمات: {med.specialInstructions}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {(med.status === 'pending' || med.status === 'overdue') && (
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        loading={administeringId === med.id}
                        icon={<CheckCircle className="h-4 w-4" />}
                        onClick={() => handleAdminister(med.id)}
                      >
                        إعطاء
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<XCircle className="h-4 w-4" />}
                        onClick={() => handleSkip(med.id)}
                      >
                        تخطي
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
