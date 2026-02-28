// ─── Visit Management (إدارة الزيارات) ─────────────────────────

export type VisitType = 'internal' | 'behavioral' | 'emergency' | 'external' | 'phone'

export interface Visit {
  id: string
  beneficiaryId: string
  beneficiaryName?: string
  type: VisitType
  date: string
  time: string
  visitorName: string
  relation: string
  notes: string
  employeeName: string
  duration?: number
}

export const VISIT_TYPES: { value: VisitType; label: string; emoji: string; color: string }[] = [
  { value: 'internal', label: 'زيارة عائلية', emoji: '👨‍👩‍👦', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'behavioral', label: 'سلوكية', emoji: '📋', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  { value: 'emergency', label: 'طارئة', emoji: '🚨', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'external', label: 'خارجية', emoji: '🚗', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'phone', label: 'اتصال هاتفي', emoji: '📞', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
]

// ─── Family Media Feed (البث الإعلامي) ──────────────────────────

export type FeedPostType = 'image' | 'video' | 'milestone'

export interface FeedPost {
  id: string
  type: FeedPostType
  author: {
    name: string
    role: string
    avatar: string
  }
  content: string
  mediaColor?: string
  timestamp: string
  likes: number
  comments: number
  isLiked: boolean
}

export const FEED_TYPE_CONFIG: Record<FeedPostType, { label: string; emoji: string }> = {
  image: { label: 'صورة', emoji: '📸' },
  video: { label: 'فيديو', emoji: '🎥' },
  milestone: { label: 'إنجاز', emoji: '🏆' },
}

// ─── Family Portal ──────────────────────────────────────────────

export interface FamilyMember {
  name: string
  relation: string
  beneficiaryName: string
  lastVisit: string
  nextVisit?: string
}

export interface FamilyUpdate {
  id: string
  type: 'progress' | 'activity' | 'social' | 'health'
  title: string
  description: string
  date: string
}

export const UPDATE_TYPE_CONFIG: Record<FamilyUpdate['type'], { label: string; emoji: string; color: string }> = {
  progress: { label: 'تقدم', emoji: '📈', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  activity: { label: 'نشاط', emoji: '🎨', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  social: { label: 'اجتماعي', emoji: '😊', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  health: { label: 'صحة', emoji: '❤️', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}
