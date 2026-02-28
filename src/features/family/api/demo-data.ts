import type { Visit, FeedPost, FamilyUpdate } from '../types'

export const DEMO_VISITS: Visit[] = [
  { id: 'v1', beneficiaryId: 'b001', beneficiaryName: 'أحمد محمد السالم', visitorName: 'محمد أحمد السالم', relation: 'أب', date: '2026-02-28', time: '10:00', type: 'internal', duration: 60, notes: '', employeeName: 'سارة العمري' },
  { id: 'v2', beneficiaryId: 'b002', beneficiaryName: 'فاطمة عبدالله الزهراني', visitorName: 'عبدالله سعيد الزهراني', relation: 'أب', date: '2026-02-27', time: '14:00', type: 'internal', duration: 90, notes: 'زيارة جيدة', employeeName: 'نورا الشهري' },
  { id: 'v3', beneficiaryId: 'b004', beneficiaryName: 'نورة حسن العتيبي', visitorName: 'حسن سالم العتيبي', relation: 'أب', date: '2026-02-26', time: '11:00', type: 'external', duration: 45, notes: '', employeeName: 'سارة العمري' },
]

export const DEMO_FEED: FeedPost[] = [
  { id: 'f1', type: 'image', content: 'أجواء رائعة في ورشة الفنون اليوم', timestamp: '2026-02-27', likes: 12, comments: 3, isLiked: false, author: { name: 'فريق الأنشطة', role: 'أخصائي أنشطة', avatar: '' } },
  { id: 'f2', type: 'video', content: 'تم تطعيم جميع المستفيدين ضد الإنفلونزا الموسمية', timestamp: '2026-02-25', likes: 8, comments: 1, isLiked: true, author: { name: 'القسم الطبي', role: 'طبيب', avatar: '' } },
  { id: 'f3', type: 'milestone', content: 'أحمد أكمل برنامج العلاج الطبيعي بنجاح — 50 متر مشي مستقل!', timestamp: '2026-02-23', likes: 24, comments: 5, isLiked: false, author: { name: 'العلاج الطبيعي', role: 'أخصائي علاج طبيعي', avatar: '' } },
]

export const DEMO_UPDATES: FamilyUpdate[] = [
  { id: 'u1', type: 'health', title: 'تحديث صحي', description: 'الحالة الصحية مستقرة — العلامات الحيوية طبيعية', date: '2026-02-27' },
  { id: 'u2', type: 'activity', title: 'نشاط يومي', description: 'شارك في ورشة الفنون وأظهر تفاعلاً إيجابياً', date: '2026-02-26' },
  { id: 'u3', type: 'progress', title: 'تحقيق هدف', description: 'أكملت هدف ارتداء الملابس بشكل مستقل بنجاح', date: '2026-02-25' },
]
