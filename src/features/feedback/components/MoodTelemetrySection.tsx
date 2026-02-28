import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Heart, Zap, AlertTriangle } from 'lucide-react'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui'
import { Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { cn } from '@/lib/utils'
import { useMoodTelemetry } from '../api/mood-queries'

const BUTTON_COLOR_CONFIG = {
  green: { label: 'مرتاح', color: 'bg-emerald-500', textColor: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  yellow: { label: 'متوسط', color: 'bg-amber-500', textColor: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  red: { label: 'متوتر', color: 'bg-red-500', textColor: 'text-red-700 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
  blue: { label: 'محايد', color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  none: { label: 'بدون', color: 'bg-slate-400', textColor: 'text-slate-700 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
} as const

const STRESS_CONFIG = {
  normal: { label: 'طبيعي', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  elevated: { label: 'مرتفع', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  critical_warning: { label: 'تحذير حرج', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
} as const

const VALENCE_LABELS: Record<string, string> = {
  positive: 'إيجابي',
  neutral: 'محايد',
  negative: 'سلبي',
}

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString('ar-SA', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MoodTelemetrySection() {
  const { data: telemetry, isLoading, error } = useMoodTelemetry()
  const [filterColor, setFilterColor] = useState<string | null>(null)

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري تحميل القياسات..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل بيانات القياس الحيوي</p></div>
  if (!telemetry?.length) return <EmptyState icon={<Activity className="h-8 w-8 text-slate-400" />} title="لا توجد قراءات حيوية" description="لم يتم تسجيل أي بيانات من أساور المزاج بعد" />

  // Stats calculations
  const totalReadings = telemetry.length
  const criticalCount = telemetry.filter((t) => t.calculated_stress_anomaly === 'critical_warning').length
  const heartRates = telemetry.filter((t) => t.heart_rate_bpm != null).map((t) => t.heart_rate_bpm!)
  const avgHeartRate = heartRates.length ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length) : 0
  const positiveCount = telemetry.filter((t) => t.emotional_valence === 'positive').length
  const positivePercent = Math.round((positiveCount / totalReadings) * 100)

  // Button press distribution
  const colorCounts = { green: 0, yellow: 0, red: 0, blue: 0, none: 0 }
  for (const t of telemetry) {
    const key = t.voluntary_button_press ?? 'none'
    colorCounts[key]++
  }

  // Filter
  const filtered = filterColor ? telemetry.filter((t) => (t.voluntary_button_press ?? 'none') === filterColor) : telemetry

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="إجمالي القراءات" value={totalReadings} icon={<Activity className="h-5 w-5" />} accent="teal" />
        <StatCard title="تحذيرات حرجة" value={criticalCount} icon={<AlertTriangle className="h-5 w-5" />} accent="danger" />
        <StatCard title="متوسط نبض القلب" value={`${avgHeartRate} bpm`} icon={<Heart className="h-5 w-5" />} accent="gold" />
        <StatCard title="المزاج الإيجابي" value={`${positivePercent}%`} icon={<Zap className="h-5 w-5" />} accent="success" />
      </div>

      {/* Button Press Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>توزيع ضغطات الزر</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-3 px-4 pb-4">
          {(Object.keys(BUTTON_COLOR_CONFIG) as Array<keyof typeof BUTTON_COLOR_CONFIG>).map((key) => {
            const cfg = BUTTON_COLOR_CONFIG[key]
            const count = colorCounts[key]
            if (count === 0 && key === 'none') return null
            const isActive = filterColor === key
            return (
              <button
                key={key}
                onClick={() => setFilterColor(isActive ? null : key)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all',
                  cfg.bg, cfg.textColor,
                  isActive && 'ring-2 ring-offset-1 ring-slate-400 dark:ring-slate-500',
                )}
              >
                <span className={cn('h-3 w-3 rounded-full', cfg.color)} />
                {cfg.label}
                <span className="font-bold">{count}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const btnCfg = BUTTON_COLOR_CONFIG[item.voluntary_button_press ?? 'none']
          const stressCfg = item.calculated_stress_anomaly ? STRESS_CONFIG[item.calculated_stress_anomaly] : null

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
            >
              <Card className="p-4">
                <div className="flex flex-wrap items-start gap-4">
                  {/* Color dot */}
                  <div className={cn('mt-1 h-4 w-4 shrink-0 rounded-full', btnCfg.color)} />

                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', btnCfg.bg, btnCfg.textColor)}>
                        {btnCfg.label}
                      </span>
                      {stressCfg && (
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', stressCfg.color)}>
                          {stressCfg.label}
                        </span>
                      )}
                      {item.emotional_valence && (
                        <Badge variant="neutral">{VALENCE_LABELS[item.emotional_valence] ?? item.emotional_valence}</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      {item.heart_rate_bpm != null && (
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 text-red-400" />
                          {item.heart_rate_bpm} bpm
                        </span>
                      )}
                      {item.current_activity_context && <span>{item.current_activity_context}</span>}
                      {item.location_context && (
                        <span className="text-slate-400 dark:text-slate-500">{item.location_context}</span>
                      )}
                    </div>
                  </div>

                  {/* Timestamp */}
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                    {formatTimestamp(item.recorded_timestamp)}
                  </span>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
