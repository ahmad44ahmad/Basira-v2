import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldAlert, Save, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { Button, Select, Card, CardHeader, CardTitle, Badge, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import { calculateFallRisk, RISK_LEVEL_CONFIG, type FallRiskFormData, type FallRiskResult } from '../types'
import { useCreateFallRiskAssessment } from '../api/safety-queries'
import { useBeneficiaryOptions, useBeneficiaries } from '@/features/beneficiaries'

const fallRiskSchema = z.object({
  beneficiaryId: z.string().min(1, 'اختر المستفيد'),
  assessmentDate: z.string().min(1, 'حدد تاريخ التقييم'),
  historyOfFalls: z.boolean(),
  secondaryDiagnosis: z.boolean(),
  ambulatoryAid: z.enum(['none', 'crutches', 'furniture']),
  ivTherapy: z.boolean(),
  gait: z.enum(['normal', 'weak', 'impaired']),
  mentalStatus: z.enum(['oriented', 'forgets']),
})

export function FallRiskPage() {
  const [result, setResult] = useState<FallRiskResult | null>(null)
  const { isLoading, error } = useBeneficiaries()
  const beneficiaryOptions = useBeneficiaryOptions()
  const createAssessment = useCreateFallRiskAssessment()

  const { register, handleSubmit, watch } = useForm<FallRiskFormData>({
    resolver: zodResolver(fallRiskSchema),
    defaultValues: {
      assessmentDate: new Date().toISOString().slice(0, 10),
      historyOfFalls: false,
      secondaryDiagnosis: false,
      ambulatoryAid: 'none',
      ivTherapy: false,
      gait: 'normal',
      mentalStatus: 'oriented',
    },
  })

  // Live score calculation
  const formValues = watch()
  const liveResult = calculateFallRisk(formValues)

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (beneficiaryOptions.length === 0) return <EmptyState title="لا توجد بيانات" description="لا يوجد مستفيدون نشطون لإجراء تقييم مخاطر السقوط" />

  const onSubmit = async (data: FallRiskFormData) => {
    const calcResult = calculateFallRisk(data)
    setResult(calcResult)
    try {
      await createAssessment.mutateAsync({
        beneficiary_id: data.beneficiaryId,
        fall_history: data.historyOfFalls ? 25 : 0,
        medications_risk: data.secondaryDiagnosis ? 15 : 0,
        cognitive_level: data.mentalStatus === 'forgets' ? 15 : 0,
        mobility_level: data.gait === 'impaired' ? 20 : data.gait === 'weak' ? 10 : 0,
        risk_score: calcResult.riskScore,
        risk_level: calcResult.riskLevel === 'high' ? 'عالي' : calcResult.riskLevel === 'medium' ? 'متوسط' : 'منخفض',
        preventive_measures: calcResult.preventiveMeasures,
        next_assessment_date: null,
        assessed_by: 'المستخدم الحالي',
      })
      toast.success('تم حفظ تقييم مخاطر السقوط')
    } catch (err) {
      console.error(err)
      toast.error('فشل حفظ التقييم')
    }
  }

  const riskConfig = RISK_LEVEL_CONFIG[liveResult.riskLevel]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="تقييم مخاطر السقوط"
        description="مقياس مورس لتقييم خطر السقوط (Morse Fall Scale)"
        icon={<ShieldAlert className="h-5 w-5" />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>بيانات التقييم</CardTitle></CardHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="المستفيد"
                placeholder="اختر المستفيد..."
                options={beneficiaryOptions}
                {...register('beneficiaryId')}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">تاريخ التقييم</label>
                <input
                  type="date"
                  {...register('assessmentDate')}
                  className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader><CardTitle>عوامل الخطر</CardTitle></CardHeader>
            <div className="space-y-5">
              {/* History of Falls */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">تاريخ سقوط سابق</p>
                  <p className="text-xs text-slate-500">هل سقط المستفيد خلال الأشهر الثلاثة الماضية؟</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-danger">+25</span>
                  <input type="checkbox" {...register('historyOfFalls')} className="h-5 w-5 rounded border-slate-300 text-teal" />
                </div>
              </div>

              {/* Secondary Diagnosis */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">تشخيص ثانوي</p>
                  <p className="text-xs text-slate-500">هل يعاني من أكثر من تشخيص طبي؟</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-danger">+15</span>
                  <input type="checkbox" {...register('secondaryDiagnosis')} className="h-5 w-5 rounded border-slate-300 text-teal" />
                </div>
              </div>

              {/* Ambulatory Aid */}
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">المساعدة على المشي</p>
                  <span className="text-xs text-slate-500">0 / +15 / +30</span>
                </div>
                <Select
                  options={[
                    { value: 'none', label: 'لا يحتاج (0)' },
                    { value: 'crutches', label: 'عكازات / عصا (+15)' },
                    { value: 'furniture', label: 'يتكئ على الأثاث (+30)' },
                  ]}
                  {...register('ambulatoryAid')}
                />
              </div>

              {/* IV Therapy */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">محاليل وريدية</p>
                  <p className="text-xs text-slate-500">هل يتلقى محاليل أو أنابيب وريدية؟</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-danger">+20</span>
                  <input type="checkbox" {...register('ivTherapy')} className="h-5 w-5 rounded border-slate-300 text-teal" />
                </div>
              </div>

              {/* Gait */}
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">نمط المشي</p>
                  <span className="text-xs text-slate-500">0 / +10 / +20</span>
                </div>
                <Select
                  options={[
                    { value: 'normal', label: 'طبيعي (0)' },
                    { value: 'weak', label: 'ضعيف — خطوات قصيرة (+10)' },
                    { value: 'impaired', label: 'متعثر — صعوبة النهوض (+20)' },
                  ]}
                  {...register('gait')}
                />
              </div>

              {/* Mental Status */}
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">الحالة العقلية</p>
                  <span className="text-xs text-slate-500">0 / +15</span>
                </div>
                <Select
                  options={[
                    { value: 'oriented', label: 'واعي ومدرك (0)' },
                    { value: 'forgets', label: 'ينسى محدودية قدراته (+15)' },
                  ]}
                  {...register('mentalStatus')}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" variant="gold" size="lg" loading={createAssessment.isPending} icon={<Save className="h-4 w-4" />}>
                حفظ التقييم
              </Button>
            </div>
          </Card>
        </form>

        {/* Live Score Panel */}
        <div className="space-y-4">
          <Card>
            <div className="text-center">
              <p className="text-sm text-slate-500">نقاط الخطر</p>
              <motion.p
                key={liveResult.riskScore}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="mt-1 text-5xl font-black text-slate-900 dark:text-white"
              >
                {liveResult.riskScore}
              </motion.p>
              <p className="text-xs text-slate-400">من 125</p>
              <div className="mt-3">
                <Badge className={cn('text-sm px-4 py-1', riskConfig.bgColor, riskConfig.color)}>
                  {riskConfig.label}
                </Badge>
              </div>
            </div>

            {/* Score Bar */}
            <div className="mt-4">
              <div className="flex text-[10px] text-slate-500">
                <span className="flex-1">0</span>
                <span className="flex-1 text-center">25</span>
                <span className="flex-1 text-center">50</span>
                <span className="text-left">125</span>
              </div>
              <div className="mt-1 flex h-3 overflow-hidden rounded-full">
                <div className="w-1/5 bg-emerald-400" />
                <div className="w-1/5 bg-amber-400" />
                <div className="w-3/5 bg-red-400" />
              </div>
              <div className="relative mt-1">
                <div
                  className="absolute top-0 h-4 w-0.5 bg-slate-900 dark:bg-white transition-all duration-300"
                  style={{ right: `${Math.min((liveResult.riskScore / 125) * 100, 100)}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Preventive Measures */}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader><CardTitle>التدابير الوقائية</CardTitle></CardHeader>
                <div className="space-y-2">
                  {result.preventiveMeasures.map((measure, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{measure}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Scale Reference */}
          <Card>
            <CardHeader><CardTitle>مرجع المقياس</CardTitle></CardHeader>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="text-slate-600 dark:text-slate-400">0-24: منخفض — رعاية أساسية</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="text-slate-600 dark:text-slate-400">25-50: متوسط — وقاية قياسية</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="text-slate-600 dark:text-slate-400">&gt;50: عالي — بروتوكول سقوط كامل</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
