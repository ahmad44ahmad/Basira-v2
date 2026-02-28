import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, User, Heart, Stethoscope } from 'lucide-react'
import { z } from 'zod'
import { Button, Input, Select, Modal } from '@/components/ui'
import { beneficiarySchema, vitalSignsSchema } from '@/utils/validation'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import { useCreateBeneficiary } from '../api/beneficiary-queries'

// Step 1: Personal
const step1Schema = beneficiarySchema

// Step 2: Vitals
const step2Schema = z.object({
  primaryDiagnosis: z.enum(['CP', 'Downs', 'Autism', 'IntellectualDisability', 'Other']),
  isEpileptic: z.boolean().default(false),
  vitals: vitalSignsSchema.optional(),
})

// Step 3: History
const step3Schema = z.object({
  chronicDiseases: z.string().optional(),
  surgeries: z.string().optional(),
  allergies: z.string().optional(),
  lastSeizureDate: z.string().optional(),
  seizureFrequency: z.string().optional(),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>

const diagnosisOptions = [
  { value: 'CP', label: 'الشلل الدماغي' },
  { value: 'Downs', label: 'متلازمة داون' },
  { value: 'Autism', label: 'توحد' },
  { value: 'IntellectualDisability', label: 'إعاقة ذهنية' },
  { value: 'Other', label: 'أخرى' },
]

const steps = [
  { id: 1, title: 'البيانات الشخصية', icon: <User className="h-4 w-4" /> },
  { id: 2, title: 'التشخيص والعلامات الحيوية', icon: <Heart className="h-4 w-4" /> },
  { id: 3, title: 'التاريخ الطبي', icon: <Stethoscope className="h-4 w-4" /> },
]

interface AddBeneficiaryFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddBeneficiaryForm({ open, onClose, onSuccess }: AddBeneficiaryFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null)
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null)
  const createMutation = useCreateBeneficiary()

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) })
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) })
  const form3 = useForm<Step3Data>({ resolver: zodResolver(step3Schema) })

  const handleStep1 = form1.handleSubmit((data) => {
    setStep1Data(data)
    setCurrentStep(2)
  })

  const handleStep2 = form2.handleSubmit((data) => {
    setStep2Data(data)
    setCurrentStep(3)
  })

  const handleStep3 = form3.handleSubmit(async (data) => {
    if (!step1Data || !step2Data) return

    // Build medical notes from step 2 diagnosis + step 3 history
    const diagnosisLabel = diagnosisOptions.find((d) => d.value === step2Data.primaryDiagnosis)?.label ?? step2Data.primaryDiagnosis
    const medicalParts = [diagnosisLabel]
    if (step2Data.isEpileptic) medicalParts.push('صرع')
    if (data.chronicDiseases) medicalParts.push(data.chronicDiseases)

    const notesParts: string[] = []
    if (data.surgeries) notesParts.push(`العمليات: ${data.surgeries}`)
    if (data.allergies) notesParts.push(`الحساسيات: ${data.allergies}`)
    if (data.lastSeizureDate) notesParts.push(`آخر نوبة: ${data.lastSeizureDate}`)
    if (data.seizureFrequency) notesParts.push(`تكرار النوبات: ${data.seizureFrequency}`)

    const insertData = {
      file_number: `BEN-${Date.now()}`,
      full_name: step1Data.fullName,
      national_id: step1Data.nationalId,
      gender: step1Data.gender,
      date_of_birth: step1Data.dateOfBirth,
      nationality: step1Data.nationality,
      section: step1Data.section,
      room_number: step1Data.roomNumber ?? null,
      bed_number: step1Data.bedNumber ?? null,
      admission_date: new Date().toISOString().split('T')[0],
      discharge_date: null,
      status: 'نشط' as const,
      evacuation_category: null,
      guardian_name: step1Data.guardianName ?? null,
      guardian_phone: step1Data.guardianPhone ?? null,
      guardian_relation: step1Data.guardianRelation ?? null,
      medical_diagnosis: medicalParts.join(' | '),
      notes: notesParts.length > 0 ? notesParts.join('\n') : null,
    }

    try {
      await createMutation.mutateAsync(insertData)
      toast.success('تم إضافة المستفيد بنجاح')
      onSuccess()
      handleClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'حدث خطأ أثناء إضافة المستفيد')
    }
  })

  const handleClose = () => {
    setCurrentStep(1)
    setStep1Data(null)
    setStep2Data(null)
    form1.reset()
    form2.reset()
    form3.reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="إضافة مستفيد جديد" size="lg">
      {/* Step Indicators */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors',
                currentStep === step.id
                  ? 'bg-teal text-white'
                  : currentStep > step.id
                    ? 'bg-success text-white'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-700',
              )}
            >
              {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span className={cn(
              'hidden text-xs sm:block',
              currentStep === step.id ? 'font-medium text-teal' : 'text-slate-500',
            )}>
              {step.title}
            </span>
            {i < steps.length - 1 && (
              <div className={cn(
                'h-0.5 w-8',
                currentStep > step.id ? 'bg-success' : 'bg-slate-200 dark:bg-slate-700',
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Personal */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="الاسم الكامل" {...form1.register('fullName')} error={form1.formState.errors.fullName?.message} />
                <Input label="رقم الهوية" {...form1.register('nationalId')} error={form1.formState.errors.nationalId?.message} dir="ltr" />
                <Select
                  label="الجنس"
                  options={[{ value: 'ذكر', label: 'ذكر' }, { value: 'أنثى', label: 'أنثى' }]}
                  {...form1.register('gender')}
                  error={form1.formState.errors.gender?.message}
                />
                <Input label="تاريخ الميلاد" type="date" {...form1.register('dateOfBirth')} error={form1.formState.errors.dateOfBirth?.message} max={new Date().toISOString().slice(0, 10)} />
                <Input label="الجنسية" {...form1.register('nationality')} error={form1.formState.errors.nationality?.message} />
                <Select
                  label="القسم"
                  options={[
                    { value: 'ذكور', label: 'ذكور' },
                    { value: 'إناث', label: 'إناث' },
                    { value: 'أطفال', label: 'أطفال' },
                  ]}
                  {...form1.register('section')}
                  error={form1.formState.errors.section?.message}
                />
                <Input label="رقم الغرفة" {...form1.register('roomNumber')} />
                <Input label="رقم السرير" {...form1.register('bedNumber')} />
              </div>

              <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">ولي الأمر</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="اسم ولي الأمر" {...form1.register('guardianName')} />
                  <Input label="رقم جوال ولي الأمر" {...form1.register('guardianPhone')} dir="ltr" />
                  <Input label="صلة القرابة" {...form1.register('guardianRelation')} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" icon={<ChevronLeft className="h-4 w-4" />}>التالي</Button>
              </div>
            </form>
          )}

          {/* Step 2: Diagnosis + Vitals */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <Select
                label="التشخيص الأساسي"
                options={diagnosisOptions}
                {...form2.register('primaryDiagnosis')}
                error={form2.formState.errors.primaryDiagnosis?.message}
              />

              <label className="flex items-center gap-2">
                <input type="checkbox" {...form2.register('isEpileptic')} className="h-4 w-4 rounded border-slate-300" />
                <span className="text-sm text-slate-700 dark:text-slate-300">هل يعاني من الصرع؟</span>
              </label>

              <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
                <h4 className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">العلامات الحيوية</h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <Input label="الحرارة (°C)" type="number" step="0.1" min="35" max="42" {...form2.register('vitals.temperature', { valueAsNumber: true })} error={form2.formState.errors.vitals?.temperature?.message} />
                  <Input label="النبض (bpm)" type="number" min="40" max="180" {...form2.register('vitals.pulse', { valueAsNumber: true })} error={form2.formState.errors.vitals?.pulse?.message} />
                  <Input label="الضغط الانقباضي" type="number" min="70" max="200" {...form2.register('vitals.bloodPressureSystolic', { valueAsNumber: true })} error={form2.formState.errors.vitals?.bloodPressureSystolic?.message} />
                  <Input label="الضغط الانبساطي" type="number" min="40" max="130" {...form2.register('vitals.bloodPressureDiastolic', { valueAsNumber: true })} error={form2.formState.errors.vitals?.bloodPressureDiastolic?.message} />
                  <Input label="تشبع الأكسجين (%)" type="number" min="70" max="100" {...form2.register('vitals.oxygenSaturation', { valueAsNumber: true })} error={form2.formState.errors.vitals?.oxygenSaturation?.message} />
                  <Input label="الوزن (kg)" type="number" step="0.1" min="10" max="300" {...form2.register('vitals.weight', { valueAsNumber: true })} error={form2.formState.errors.vitals?.weight?.message} />
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} icon={<ChevronRight className="h-4 w-4" />}>السابق</Button>
                <Button type="submit" icon={<ChevronLeft className="h-4 w-4" />}>التالي</Button>
              </div>
            </form>
          )}

          {/* Step 3: Medical History */}
          {currentStep === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">الأمراض المزمنة</label>
                <textarea
                  {...form3.register('chronicDiseases')}
                  placeholder="اكتب كل مرض في سطر منفصل..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">العمليات الجراحية</label>
                <textarea {...form3.register('surgeries')} placeholder="اكتب كل عملية في سطر منفصل..." rows={2} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">الحساسيات</label>
                <textarea {...form3.register('allergies')} placeholder="اكتب كل حساسية في سطر منفصل..." rows={2} className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
              </div>

              {step2Data?.isEpileptic && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <h4 className="mb-3 text-sm font-bold text-amber-700 dark:text-amber-400">معلومات الصرع</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="تاريخ آخر نوبة" type="date" {...form3.register('lastSeizureDate')} />
                    <Input label="تكرار النوبات" {...form3.register('seizureFrequency')} placeholder="مثال: مرة شهرياً" />
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(2)} icon={<ChevronRight className="h-4 w-4" />}>السابق</Button>
                <Button type="submit" variant="gold" icon={<Check className="h-4 w-4" />} disabled={createMutation.isPending} loading={createMutation.isPending}>حفظ المستفيد</Button>
              </div>
            </form>
          )}
        </motion.div>
      </AnimatePresence>
    </Modal>
  )
}
