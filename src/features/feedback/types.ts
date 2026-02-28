export type EmojiRating = 1 | 2 | 3

export type MoodType = 'happy' | 'neutral' | 'sad'

export interface VisualSurveyFormData {
  beneficiaryId: string
  foodRating: EmojiRating
  comfortRating: EmojiRating
  staffRating: EmojiRating
  activitiesRating: EmojiRating
  overallMood: MoodType
  notes: string
}

export const EMOJI_RATINGS = [
  { value: 1 as const, emoji: '😞', label: 'غير راضٍ', color: 'text-red-500' },
  { value: 2 as const, emoji: '😐', label: 'محايد', color: 'text-amber-500' },
  { value: 3 as const, emoji: '😊', label: 'راضٍ', color: 'text-emerald-500' },
] as const

export const MOOD_OPTIONS = [
  { value: 'happy' as const, emoji: '😊', label: 'سعيد', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'neutral' as const, emoji: '😐', label: 'محايد', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'sad' as const, emoji: '😞', label: 'حزين', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
] as const

export const SURVEY_AREAS = [
  { key: 'foodRating' as const, label: 'الطعام', icon: '🍽️' },
  { key: 'comfortRating' as const, label: 'الراحة', icon: '🛏️' },
  { key: 'staffRating' as const, label: 'الموظفون', icon: '👥' },
  { key: 'activitiesRating' as const, label: 'الأنشطة', icon: '🎨' },
] as const

export const STRESS_SEVERITY_CONFIG = {
  low: { label: 'منخفض', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  medium: { label: 'متوسط', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  high: { label: 'عالي', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  critical: { label: 'حرج', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
} as const
