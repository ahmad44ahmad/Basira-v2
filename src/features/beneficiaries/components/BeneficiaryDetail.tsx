import {
  User, Phone, MapPin, Calendar, Heart, Shield, FileText, Activity,
  ChevronLeft, AlertTriangle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, formatDate } from '@/lib/utils'
import { Badge, Button, Tabs, Card, CardHeader, CardTitle } from '@/components/ui'
import type { UnifiedBeneficiaryProfile } from '../types'
import { ALERT_TAGS, STATUS_CONFIG } from '../types'

interface BeneficiaryDetailProps {
  beneficiary: UnifiedBeneficiaryProfile
  onClose: () => void
}

const riskBadge = {
  low: { label: 'منخفض', variant: 'success' as const },
  medium: { label: 'متوسط', variant: 'warning' as const },
  high: { label: 'عالي', variant: 'danger' as const },
  critical: { label: 'حرج', variant: 'danger' as const },
}

function InfoRow({ label, value, icon }: { label: string; value: string | null | undefined; icon?: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-3 py-2">
      {icon && <span className="text-slate-400">{icon}</span>}
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
      </div>
    </div>
  )
}

function OverviewTab({ b }: { b: UnifiedBeneficiaryProfile }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>المعلومات الشخصية</CardTitle></CardHeader>
        <div className="space-y-1">
          <InfoRow label="رقم الهوية" value={b.national_id} icon={<FileText className="h-4 w-4" />} />
          <InfoRow label="تاريخ الميلاد" value={b.date_of_birth ? formatDate(b.date_of_birth) : null} icon={<Calendar className="h-4 w-4" />} />
          <InfoRow label="الجنسية" value={b.nationality} />
          <InfoRow label="القسم" value={b.section} />
          <InfoRow label="الغرفة / السرير" value={b.room_number ? `غرفة ${b.room_number}${b.bed_number ? ` - سرير ${b.bed_number}` : ''}` : null} icon={<MapPin className="h-4 w-4" />} />
        </div>
      </Card>

      <Card>
        <CardHeader><CardTitle>ولي الأمر</CardTitle></CardHeader>
        <div className="space-y-1">
          <InfoRow label="الاسم" value={b.guardian_name} icon={<User className="h-4 w-4" />} />
          <InfoRow label="صلة القرابة" value={b.guardian_relation} />
          <InfoRow label="رقم الجوال" value={b.guardian_phone} icon={<Phone className="h-4 w-4" />} />
        </div>
        {b.isOrphan && (
          <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              هذا المستفيد يتيم — تحت رعاية المؤسسة
            </p>
          </div>
        )}
      </Card>

      <Card className="md:col-span-2">
        <CardHeader><CardTitle>المعلومات الطبية</CardTitle></CardHeader>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoRow label="التشخيص الأساسي" value={b.medical_diagnosis} icon={<Heart className="h-4 w-4" />} />
          <InfoRow label="تاريخ القبول" value={b.admission_date ? formatDate(b.admission_date) : null} icon={<Calendar className="h-4 w-4" />} />
        </div>
        {b.hasChronicCondition && (
          <div className="mt-3 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
            <p className="flex items-center gap-2 text-xs font-medium text-red-700 dark:text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              يعاني من حالة مزمنة — يتطلب متابعة مستمرة
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

function TimelineTab() {
  return (
    <div className="space-y-3">
      {[
        { id: 'daily-care', action: 'تسجيل رعاية يومية', time: 'اليوم 08:30', color: 'bg-teal' },
        { id: 'vitals', action: 'فحص العلامات الحيوية', time: 'اليوم 07:00', color: 'bg-blue-500' },
        { id: 'therapy', action: 'جلسة علاج طبيعي', time: 'أمس 14:00', color: 'bg-purple-500' },
        { id: 'visit', action: 'زيارة عائلية', time: 'أمس 10:30', color: 'bg-gold' },
        { id: 'fall-risk', action: 'تقييم مخاطر السقوط', time: 'قبل 3 أيام', color: 'bg-red-500' },
      ].map((event) => (
        <div key={event.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn('h-3 w-3 rounded-full', event.color)} />
            {i < 4 && <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{event.action}</p>
            <p className="text-xs text-slate-500">{event.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export function BeneficiaryDetail({ beneficiary: b, onClose }: BeneficiaryDetailProps) {
  const risk = riskBadge[b.riskLevel]

  const tabs = [
    { id: 'overview', label: 'نظرة عامة', icon: <User className="h-4 w-4" />, content: <OverviewTab b={b} /> },
    { id: 'timeline', label: 'الخط الزمني', icon: <Activity className="h-4 w-4" />, content: <TimelineTab /> },
    { id: 'medical', label: 'الملف الطبي', icon: <Heart className="h-4 w-4" />, content: <PlaceholderTab label="الملف الطبي" /> },
    { id: 'quality', label: 'الجودة والمخاطر', icon: <Shield className="h-4 w-4" />, content: <PlaceholderTab label="الجودة والمخاطر" /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex h-full flex-col"
    >
      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <button
          onClick={onClose}
          className="mt-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal/10 text-teal">
          <User className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{b.full_name}</h2>
            <Badge variant={STATUS_CONFIG[b.status].variant}>{STATUS_CONFIG[b.status].label}</Badge>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>#{b.file_number}</span>
            <span>·</span>
            <span>{b.section}</span>
            {b.room_number && (
              <>
                <span>·</span>
                <span>غرفة {b.room_number}</span>
              </>
            )}
            <span>·</span>
            <Badge variant={risk.variant} dot>{risk.label}</Badge>
          </div>

          {/* Smart Tags */}
          {b.smartTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {b.smartTags.map((tag) => {
                const config = ALERT_TAGS[tag.id]
                return (
                  <span
                    key={tag.id}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium',
                      config?.bgColor, config?.color,
                    )}
                  >
                    {tag.label}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-4 flex gap-2">
        <Button variant="primary" size="sm" icon={<FileText className="h-4 w-4" />}>
          تعديل الملف
        </Button>
        <Button variant="outline" size="sm" icon={<AlertTriangle className="h-4 w-4" />}>
          تبليغ حادثة
        </Button>
      </div>

      {/* Tabs */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Tabs tabs={tabs} />
      </div>
    </motion.div>
  )
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 text-sm text-slate-400">
      <Shield className="h-8 w-8 text-slate-300 dark:text-slate-600" />
      <span>{label}</span>
      <span className="text-xs text-slate-300 dark:text-slate-600">سيتم إضافة المحتوى قريباً</span>
    </div>
  )
}
