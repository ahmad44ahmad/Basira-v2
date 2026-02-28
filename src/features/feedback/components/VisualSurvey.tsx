import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Save } from 'lucide-react'
import { Button, Card, CardHeader, CardTitle, Select } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { useCreateVisualSurvey } from '../api/feedback-queries'
import { useBeneficiaryOptions } from '@/features/beneficiaries'
import { EMOJI_RATINGS, MOOD_OPTIONS, SURVEY_AREAS } from '../types'
import type { EmojiRating } from '../types'
import { cn } from '@/lib/utils'

const surveySchema = z.object({
  beneficiaryId: z.string().min(1, 'اختر المستفيد'),
  foodRating: z.number().min(1).max(3),
  comfortRating: z.number().min(1).max(3),
  staffRating: z.number().min(1).max(3),
  activitiesRating: z.number().min(1).max(3),
  overallMood: z.enum(['happy', 'neutral', 'sad']),
  notes: z.string().optional(),
})

type SurveyFormData = z.infer<typeof surveySchema>

function EmojiSelector({
  value,
  onChange,
  label,
  icon,
}: {
  value: number
  onChange: (v: EmojiRating) => void
  label: string
  icon: string
}) {
  return (
    <div className="text-center">
      <div className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <span className="ml-1">{icon}</span>
        {label}
      </div>
      <div className="flex justify-center gap-3">
        {EMOJI_RATINGS.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => onChange(r.value)}
            className={cn(
              'flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-3xl transition-all',
              value === r.value
                ? 'border-teal-500 bg-teal-50 scale-110 shadow-lg dark:bg-teal-900/30'
                : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800'
            )}
          >
            {r.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

export function VisualSurvey() {
  const beneficiaryOptions = useBeneficiaryOptions()
  const createMutation = useCreateVisualSurvey()

  const { control, handleSubmit, reset, register, formState: { errors } } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      beneficiaryId: '',
      foodRating: 2,
      comfortRating: 2,
      staffRating: 2,
      activitiesRating: 2,
      overallMood: 'neutral',
      notes: '',
    },
  })

  const onSubmit = async (data: SurveyFormData) => {
    try {
      await createMutation.mutateAsync({
        beneficiary_id: data.beneficiaryId,
        survey_date: new Date().toISOString().split('T')[0],
        food_rating: data.foodRating,
        comfort_rating: data.comfortRating,
        staff_rating: data.staffRating,
        activities_rating: data.activitiesRating,
        overall_mood: data.overallMood,
        notes: data.notes || null,
        recorded_by: null,
      })
      toast.success('تم حفظ الاستبيان بنجاح')
      reset()
    } catch (err) {
      console.error(err)
      toast.error('حدث خطأ أثناء الحفظ')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>الاستبيان البصري</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Beneficiary select */}
        <Select
          label="المستفيد"
          placeholder="اختر المستفيد..."
          options={beneficiaryOptions}
          {...register('beneficiaryId')}
          error={errors.beneficiaryId?.message}
        />

        {/* Emoji rating grids */}
        <div className="grid grid-cols-2 gap-6">
          {SURVEY_AREAS.map((area) => (
            <Controller
              key={area.key}
              name={area.key}
              control={control}
              render={({ field }) => (
                <EmojiSelector
                  value={field.value}
                  onChange={field.onChange}
                  label={area.label}
                  icon={area.icon}
                />
              )}
            />
          ))}
        </div>

        {/* Overall mood */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">المزاج العام</label>
          <Controller
            name="overallMood"
            control={control}
            render={({ field }) => (
              <div className="flex justify-center gap-4">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => field.onChange(m.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl border-2 px-6 py-3 transition-all',
                      field.value === m.value
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800'
                    )}
                  >
                    <span className="text-3xl">{m.emoji}</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{m.label}</span>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">ملاحظات</label>
          <textarea
            {...register('notes')}
            rows={2}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
            placeholder="ملاحظات إضافية..."
          />
        </div>

        <Button type="submit" loading={createMutation.isPending} className="w-full">
          <Save className="h-4 w-4 ml-2" />
          حفظ الاستبيان
        </Button>
      </form>
    </Card>
  )
}
