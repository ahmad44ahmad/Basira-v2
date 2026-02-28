import type { LeaveRequest, SocialActivity } from '../types'

const now = new Date().toISOString()

export const DEMO_RESEARCHES = [
  { id: 'sr1', beneficiary_id: 'b001', national_id: '1234567890', research_date: '2026-01-15', social_status: 'يتيم الأب', family_size: 4, income_source: 'ضمان اجتماعي', housing_type: 'شقة مستأجرة', education_level: 'لم يلتحق', social_worker: 'أ. خالد الشمري', recommendations: 'دعم نفسي وتأهيل اجتماعي', notes: null, created_at: now, updated_at: now },
  { id: 'sr2', beneficiary_id: 'b002', national_id: '2345678901', research_date: '2026-01-20', social_status: 'أسرة مستقرة', family_size: 6, income_source: 'وظيفة حكومية', housing_type: 'فيلا ملك', education_level: 'ابتدائي', social_worker: 'أ. نورة القحطاني', recommendations: 'متابعة دورية', notes: null, created_at: now, updated_at: now },
]

export const DEMO_LEAVES: LeaveRequest[] = [
  { id: 'l1', beneficiaryId: 'b001', beneficiaryName: 'أحمد محمد السالم', leaveType: 'weekend', startDate: '2026-02-28', endDate: '2026-03-01', guardianName: 'محمد أحمد السالم', guardianPhone: '0551234567', status: 'pending_supervisor', reason: 'زيارة عائلية نهاية الأسبوع', createdAt: now },
  { id: 'l2', beneficiaryId: 'b002', beneficiaryName: 'فاطمة عبدالله الزهراني', leaveType: 'medical', startDate: '2026-02-25', endDate: '2026-02-25', guardianName: 'عبدالله الزهراني', guardianPhone: '0559876543', status: 'approved', reason: 'موعد طبي خارجي', createdAt: now },
  { id: 'l3', beneficiaryId: 'b003', beneficiaryName: 'خالد سعيد الغامدي', leaveType: 'holiday', startDate: '2026-03-10', endDate: '2026-03-15', guardianName: null, guardianPhone: null, status: 'rejected', reason: 'إجازة عيد الفطر', rejectionReason: 'لا يوجد ولي أمر لاستلامه', createdAt: now },
]

export const DEMO_ACTIVITIES: SocialActivity[] = [
  { id: 'a1', title: 'رحلة ترفيهية', date: '2026-03-01', type: 'trip', participantCount: 15, description: 'رحلة إلى منتزه الملك عبدالله', status: 'planned' },
  { id: 'a2', title: 'ورشة فنية', date: '2026-02-27', type: 'workshop', participantCount: 8, description: 'ورشة رسم وتلوين', status: 'completed' },
  { id: 'a3', title: 'احتفال يوم التأسيس', date: '2026-02-22', type: 'celebration', participantCount: 45, description: 'فعاليات يوم التأسيس السعودي', status: 'completed' },
]
