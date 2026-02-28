import type { Visit, FeedPost, FamilyUpdate } from '../types'

const now = new Date().toISOString()

export const DEMO_VISITS: Visit[] = [
  { id: 'v1', beneficiaryId: 'b001', beneficiaryName: 'أحمد محمد السالم', visitorName: 'محمد أحمد السالم', visitorRelation: 'أب', visitDate: '2026-02-28', visitTime: '10:00', visitType: 'regular', duration: 60, status: 'scheduled', notes: '' },
  { id: 'v2', beneficiaryId: 'b002', beneficiaryName: 'فاطمة عبدالله الزهراني', visitorName: 'عبدالله سعيد الزهراني', visitorRelation: 'أب', visitDate: '2026-02-27', visitTime: '14:00', visitType: 'regular', duration: 90, status: 'completed', notes: 'زيارة جيدة' },
  { id: 'v3', beneficiaryId: 'b004', beneficiaryName: 'نورة حسن العتيبي', visitorName: 'حسن سالم العتيبي', visitorRelation: 'أب', visitDate: '2026-02-26', visitTime: '11:00', visitType: 'medical', duration: 45, status: 'completed', notes: '' },
]

export const DEMO_FEED: FeedPost[] = [
  { id: 'f1', type: 'photo', content: 'أجواء رائعة في ورشة الفنون اليوم', date: '2026-02-27', likes: 12, isLiked: false, author: 'فريق الأنشطة' },
  { id: 'f2', type: 'update', content: 'تم تطعيم جميع المستفيدين ضد الإنفلونزا الموسمية', date: '2026-02-25', likes: 8, isLiked: true, author: 'القسم الطبي' },
  { id: 'f3', type: 'achievement', content: 'أحمد أكمل برنامج العلاج الطبيعي بنجاح — 50 متر مشي مستقل!', date: '2026-02-23', likes: 24, isLiked: false, author: 'العلاج الطبيعي' },
]

export const DEMO_UPDATES: FamilyUpdate[] = [
  { id: 'u1', beneficiaryId: 'b001', beneficiaryName: 'أحمد محمد السالم', type: 'health', title: 'تحديث صحي', content: 'الحالة الصحية مستقرة — العلامات الحيوية طبيعية', date: '2026-02-27', isRead: false },
  { id: 'u2', beneficiaryId: 'b001', beneficiaryName: 'أحمد محمد السالم', type: 'activity', title: 'نشاط يومي', content: 'شارك في ورشة الفنون وأظهر تفاعلاً إيجابياً', date: '2026-02-26', isRead: true },
  { id: 'u3', beneficiaryId: 'b002', beneficiaryName: 'فاطمة عبدالله الزهراني', type: 'goal', title: 'تحقيق هدف', content: 'أكملت هدف ارتداء الملابس بشكل مستقل بنجاح', date: '2026-02-25', isRead: false },
]
