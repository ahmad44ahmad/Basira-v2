import { Card, CardHeader, CardTitle, Badge } from '@/components/ui'
import { StatCard } from '@/components/data'
import { useFeedbackStats, useVisualSurveys, useStressAlerts } from '../api/feedback-queries'
import { EMOJI_RATINGS, MOOD_OPTIONS, STRESS_SEVERITY_CONFIG } from '../types'

export function MoodCurveDashboard() {
  const stats = useFeedbackStats()
  const { data: surveys } = useVisualSurveys()
  const { data: alerts } = useStressAlerts()

  const getEmojiForRating = (rating: number) => {
    const r = EMOJI_RATINGS.find((e) => e.value === Math.round(rating))
    return r?.emoji ?? '😐'
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي الاستبيانات" value={stats.totalSurveys} accent="teal" />
        <StatCard title="نسبة الرضا" value={`${stats.satisfactionRate}%`} accent="success" />
        <StatCard title="متوسط تقييم الطعام" value={stats.avgFoodRating} accent="gold" />
        <StatCard title="تنبيهات التوتر النشطة" value={stats.activeStressAlerts} accent="danger" />
      </div>

      {/* Recent surveys */}
      <Card>
        <CardHeader>
          <CardTitle>آخر الاستبيانات</CardTitle>
        </CardHeader>
        <div className="p-4">
          {!surveys?.length ? (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">لا توجد استبيانات بعد</p>
          ) : (
            <div className="space-y-3">
              {surveys.slice(0, 10).map((s) => {
                const mood = MOOD_OPTIONS.find((m) => m.value === s.overall_mood)
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{mood?.emoji ?? '😐'}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {s.survey_date}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs">🍽️ {getEmojiForRating(s.food_rating ?? 2)}</span>
                          <span className="text-xs">🛏️ {getEmojiForRating(s.comfort_rating ?? 2)}</span>
                          <span className="text-xs">👥 {getEmojiForRating(s.staff_rating ?? 2)}</span>
                          <span className="text-xs">🎨 {getEmojiForRating(s.activities_rating ?? 2)}</span>
                        </div>
                      </div>
                    </div>
                    {mood && (
                      <Badge className={mood.color}>{mood.label}</Badge>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Stress Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>تنبيهات التوتر</CardTitle>
        </CardHeader>
        <div className="p-4">
          {!alerts?.length ? (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">لا توجد تنبيهات</p>
          ) : (
            <div className="space-y-3">
              {alerts.map((a) => {
                const config = STRESS_SEVERITY_CONFIG[a.severity]
                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{a.trigger_description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {a.eda_value ? `EDA: ${a.eda_value}` : ''} {a.hr_value ? `HR: ${a.hr_value}` : ''}
                      </p>
                    </div>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
