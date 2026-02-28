import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HeartPulse, Save, AlertTriangle, Thermometer, Activity as ActivityIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { Button, Input, Select, Card, CardHeader, CardTitle, Badge } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import { SHIFT_CONFIG, MOBILITY_OPTIONS, MOOD_OPTIONS, type Shift } from '../types'
import { useCreateDailyCareLog } from '../api/care-queries'
import { useBeneficiaryOptions } from '@/features/beneficiaries/api/beneficiary-queries'

const careLogSchema = z.object({
  beneficiaryId: z.string().min(1, 'اختر المستفيد'),
  shift: z.enum(['صباحي', 'مسائي', 'ليلي']),
  temperature: z.number().min(35).max(42).nullable().optional(),
  pulse: z.number().min(40).max(180).nullable().optional(),
  bloodPressureSystolic: z.number().min(70).max(200).nullable().optional(),
  bloodPressureDiastolic: z.number().min(40).max(130).nullable().optional(),
  oxygenSaturation: z.number().min(70).max(100).nullable().optional(),
  bloodSugar: z.number().min(20).max(600).nullable().optional(),
  weight: z.number().min(10).max(300).nullable().optional(),
  mobilityToday: z.enum(['active', 'limited', 'bedridden']),
  mood: z.enum(['stable', 'happy', 'anxious', 'aggressive', 'depressed', 'confused']),
  notes: z.string().optional(),
  incidents: z.string().optional(),
  requiresFollowup: z.boolean().default(false),
})

type CareLogForm = z.infer<typeof careLogSchema>

function getCurrentShift(): Shift {
  const hour = new Date().getHours()
  if (hour >= 7 && hour < 15) return 'صباحي'
  if (hour >= 15 && hour < 23) return 'مسائي'
  return 'ليلي'
}

export function DailyCarePage() {
  const beneficiaryOptions = useBeneficiaryOptions()
  const createLog = useCreateDailyCareLog()
  const currentShift = getCurrentShift()
  const shiftInfo = SHIFT_CONFIG[currentShift]

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CareLogForm>({
    resolver: zodResolver(careLogSchema),
    defaultValues: {
      shift: currentShift,
      mobilityToday: 'active',
      mood: 'stable',
      requiresFollowup: false,
    },
  })

  const temp = watch('temperature')
  const systolic = watch('bloodPressureSystolic')
  const hasAbnormalVitals = (temp && (temp < 36 || temp > 37.5)) || (systolic && (systolic > 140 || systolic < 90))

  const onSubmit = async (data: CareLogForm) => {
    try {
      await createLog.mutateAsync({
        beneficiary_id: data.beneficiaryId,
        shift: data.shift,
        shift_date: new Date().toISOString().slice(0, 10),
        temperature: data.temperature ?? null,
        pulse: data.pulse ?? null,
        blood_pressure_systolic: data.bloodPressureSystolic ?? null,
        blood_pressure_diastolic: data.bloodPressureDiastolic ?? null,
        oxygen_saturation: data.oxygenSaturation ?? null,
        blood_sugar: data.bloodSugar ?? null,
        meals: null,
        medications: null,
        care_activities: null,
        incidents: data.incidents || null,
        mood: data.mood,
        sleep_quality: null,
        notes: data.notes || null,
        recorded_by: 'المستخدم الحالي',
      })
      toast.success('تم حفظ سجل الرعاية بنجاح')
    } catch {
      toast.error('فشل حفظ سجل الرعاية')
    }
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="سجل الرعاية اليومية"
        description="تسجيل الرعاية والعلامات الحيوية للمستفيدين"
        icon={<HeartPulse className="h-5 w-5" />}
        actions={
          <Badge className={shiftInfo.color}>
            {shiftInfo.label} ({shiftInfo.time})
          </Badge>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Beneficiary + Shift */}
        <Card>
          <CardHeader><CardTitle>معلومات أساسية</CardTitle></CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="المستفيد"
              placeholder="اختر المستفيد..."
              options={beneficiaryOptions}
              {...register('beneficiaryId')}
              error={errors.beneficiaryId?.message}
            />
            <Select
              label="الوردية"
              options={[
                { value: 'صباحي', label: 'صباحي (07:00 - 15:00)' },
                { value: 'مسائي', label: 'مسائي (15:00 - 23:00)' },
                { value: 'ليلي', label: 'ليلي (23:00 - 07:00)' },
              ]}
              {...register('shift')}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">التاريخ والوقت</label>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {new Date().toLocaleDateString('ar-SA')} — {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </Card>

        {/* Vital Signs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-teal" />
              العلامات الحيوية
            </CardTitle>
          </CardHeader>

          {hasAbnormalVitals && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <span className="text-sm font-medium text-danger">تم رصد قراءات غير طبيعية — يُرجى التوثيق في الملاحظات</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <Input label="الحرارة (°C)" type="number" step="0.1" placeholder="36.5" {...register('temperature', { valueAsNumber: true })} error={errors.temperature?.message} />
            <Input label="النبض (BPM)" type="number" placeholder="72" {...register('pulse', { valueAsNumber: true })} error={errors.pulse?.message} />
            <Input label="الضغط الانقباضي" type="number" placeholder="120" {...register('bloodPressureSystolic', { valueAsNumber: true })} />
            <Input label="الضغط الانبساطي" type="number" placeholder="80" {...register('bloodPressureDiastolic', { valueAsNumber: true })} />
            <Input label="الأكسجين (%)" type="number" placeholder="98" {...register('oxygenSaturation', { valueAsNumber: true })} />
            <Input label="السكر (mg/dL)" type="number" placeholder="100" {...register('bloodSugar', { valueAsNumber: true })} />
            <Input label="الوزن (kg)" type="number" step="0.1" placeholder="65" {...register('weight', { valueAsNumber: true })} />
          </div>
        </Card>

        {/* Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-teal" />
              التقييم العام
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="الحالة الحركية اليوم"
              options={MOBILITY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              {...register('mobilityToday')}
            />
            <Select
              label="المزاج والحالة النفسية"
              options={MOOD_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              {...register('mood')}
            />
          </div>
        </Card>

        {/* Notes & Incidents */}
        <Card>
          <CardHeader><CardTitle>الملاحظات والمتابعة</CardTitle></CardHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">ملاحظات التمريض</label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="سجل ملاحظاتك حول حالة المستفيد..."
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">حوادث (إن وجدت)</label>
              <textarea
                {...register('incidents')}
                rows={2}
                placeholder="وصف الحادثة إن وجدت..."
                className={cn(
                  'w-full rounded-lg border bg-white p-3 text-sm dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50',
                  'border-slate-300 dark:border-slate-600',
                )}
              />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register('requiresFollowup')} className="h-4 w-4 rounded border-slate-300 text-teal" />
              <span className="text-sm text-slate-700 dark:text-slate-300">يتطلب متابعة في الوردية القادمة</span>
            </label>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" variant="gold" size="lg" loading={createLog.isPending} icon={<Save className="h-4 w-4" />}>
            حفظ سجل الرعاية
          </Button>
        </div>
      </form>
    </div>
  )
}
