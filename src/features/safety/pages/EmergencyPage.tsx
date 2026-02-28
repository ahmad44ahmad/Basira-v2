import { useState } from 'react'
import { ShieldAlert, User, MapPin, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { Card, Badge, Spinner, Tabs } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { StatCard } from '@/components/data'
import { usePeepPlans, useEquipmentReadiness, useEmergencyStats } from '../api/emergency-queries'

const PEEP_STATUS_CONFIG = {
  active: { label: 'نشط', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  needs_review: { label: 'يحتاج مراجعة', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  expired: { label: 'منتهي', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  draft: { label: 'مسودة', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
} as const

const EQUIPMENT_STATUS_CONFIG = {
  operational: { label: 'تعمل', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  needs_maintenance: { label: 'تحتاج صيانة', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  out_of_service: { label: 'خارج الخدمة', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  expired: { label: 'منتهية الصلاحية', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
} as const

const MOBILITY_LABELS: Record<string, string> = {
  independent: 'مستقل',
  assisted: 'بمساعدة',
  wheelchair: 'كرسي متحرك',
  stretcher: 'نقالة',
  defend_in_place: 'دفاع في المكان',
}

const EQUIPMENT_TYPE_EMOJI: Record<string, string> = {
  evac_chair: '♿',
  fire_extinguisher: '🧯',
  first_aid: '🩹',
  aed: '💓',
  alarm_system: '🔔',
  emergency_lighting: '💡',
  fire_blanket: '🔥',
  other: '📦',
}

export function EmergencyPage() {
  const [activeTab, setActiveTab] = useState('peep')
  const { data: plans, isLoading: plansLoading, error: plansError } = usePeepPlans()
  const { data: equipment, isLoading: equipLoading, error: equipError } = useEquipmentReadiness()
  const stats = useEmergencyStats()

  const isLoading = plansLoading || equipLoading
  const error = plansError || equipError

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <EmptyState title="خطأ" description="خطأ في تحميل البيانات" />

  const tabs = [
    { id: 'peep', label: 'خطط PEEP' },
    { id: 'equipment', label: 'جاهزية المعدات' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="خطط الطوارئ PEEP"
        description="خطط الإخلاء الشخصية وجاهزية معدات الطوارئ"
        icon={<ShieldAlert className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="خطط الإخلاء" value={stats.totalPlans} accent="teal" />
        <StatCard title="خطط نشطة" value={stats.activePlans} accent="success" />
        <StatCard title="تحتاج مراجعة" value={stats.needsReview} accent="gold" />
        <StatCard title="معدات تحتاج صيانة" value={stats.maintenanceNeeded} accent="danger" />
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'peep' && <PeepPlansSection plans={plans ?? []} />}
          {activeTab === 'equipment' && <EquipmentSection equipment={equipment ?? []} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function PeepPlansSection({ plans }: { plans: import('@/types/database').EmergencyPeepPlan[] }) {
  if (!plans.length) return <EmptyState title="لا توجد خطط إخلاء" description="لم يتم إنشاء خطط إخلاء شخصية بعد" />

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => {
        const statusConfig = PEEP_STATUS_CONFIG[plan.status]
        return (
          <Card key={plan.id}>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {plan.beneficiary_id.slice(0, 8)}
                  </span>
                </div>
                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2">
                  <span className="text-slate-500 dark:text-slate-400">مستوى الحركة</span>
                  <p className="font-medium text-slate-900 dark:text-white mt-0.5">
                    {MOBILITY_LABELS[plan.evacuation_mobility_level ?? ''] ?? 'غير محدد'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2">
                  <span className="text-slate-500 dark:text-slate-400">طريقة الإخلاء</span>
                  <p className="font-medium text-slate-900 dark:text-white mt-0.5">
                    {MOBILITY_LABELS[plan.evacuation_method ?? ''] ?? 'غير محدد'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs">
                <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-700 dark:text-slate-300">{plan.primary_route ?? 'لم يُحدد المسار'}</p>
                  {plan.alternative_route && (
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">بديل: {plan.alternative_route}</p>
                  )}
                </div>
              </div>

              {plan.behavioral_considerations && (
                <div className="flex items-start gap-2 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-slate-600 dark:text-slate-400">{plan.behavioral_considerations}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                <span>المرافق: {plan.primary_escort ?? 'لم يُعيَّن'}</span>
                <span>آخر تدريب: {plan.last_drill_date ?? 'لم يُنفذ'}</span>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function EquipmentSection({ equipment }: { equipment: import('@/types/database').EmergencyEquipmentReadiness[] }) {
  if (!equipment.length) return <EmptyState title="لا توجد معدات" description="لم تتم إضافة معدات طوارئ بعد" />

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {equipment.map((eq) => {
        const statusConfig = EQUIPMENT_STATUS_CONFIG[eq.status]
        const emoji = EQUIPMENT_TYPE_EMOJI[eq.equipment_type] ?? '📦'
        return (
          <Card key={eq.id}>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{emoji}</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{eq.equipment_name}</span>
                </div>
                <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <MapPin className="inline h-3 w-3 ms-1" />{eq.location}
              </p>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>آخر فحص: {eq.last_inspection_date ?? '—'}</span>
                <span>الفحص القادم: {eq.next_inspection_date ?? '—'}</span>
              </div>
              {eq.notes && <p className="text-xs text-amber-600 dark:text-amber-400">{eq.notes}</p>}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
