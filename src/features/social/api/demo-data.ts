import type { LeaveRequest, SocialActivity } from '../types'

const now = new Date().toISOString()

export const DEMO_RESEARCHES = [
  { id: 'sr1', beneficiary_id: 'b001', national_id: '1234567890', research_date: '2026-01-15', social_status: 'يتيم الأب', family_size: 4, income_source: 'ضمان اجتماعي', housing_type: 'شقة مستأجرة', education_level: 'لم يلتحق', social_worker: 'أ. خالد الشمري', recommendations: 'دعم نفسي وتأهيل اجتماعي', notes: null, created_at: now, updated_at: now },
  { id: 'sr2', beneficiary_id: 'b002', national_id: '2345678901', research_date: '2026-01-20', social_status: 'أسرة مستقرة', family_size: 6, income_source: 'وظيفة حكومية', housing_type: 'فيلا ملك', education_level: 'ابتدائي', social_worker: 'أ. نورة القحطاني', recommendations: 'متابعة دورية', notes: null, created_at: now, updated_at: now },
]

export const DEMO_LEAVES: LeaveRequest[] = [
  {
    id: 'l1',
    beneficiaryId: 'b001',
    beneficiaryName: 'أحمد محمد السالم',
    leaveType: 'home_visit',
    startDate: '2026-02-28',
    endDate: '2026-03-01',
    guardianName: 'محمد أحمد السالم',
    guardianContact: '0551234567',
    reason: 'زيارة عائلية نهاية الأسبوع',
    status: 'pending_medical',
    history: [
      { action: 'request', actionBy: 'أ. خالد', role: 'أخصائي اجتماعي', date: now },
    ],
    createdAt: now,
    createdBy: 'أ. خالد الشمري',
  },
  {
    id: 'l2',
    beneficiaryId: 'b002',
    beneficiaryName: 'فاطمة عبدالله الزهراني',
    leaveType: 'hospital',
    startDate: '2026-02-25',
    endDate: '2026-02-25',
    guardianName: 'عبدالله الزهراني',
    guardianContact: '0559876543',
    reason: 'موعد طبي خارجي',
    status: 'approved',
    history: [
      { action: 'request', actionBy: 'أ. نورة', role: 'أخصائي اجتماعي', date: now },
      { action: 'medical_clear', actionBy: 'د. سالم', role: 'طبيب', date: now },
      { action: 'approve', actionBy: 'أ. محمد', role: 'مدير المركز', date: now },
    ],
    createdAt: now,
    createdBy: 'أ. نورة القحطاني',
  },
  {
    id: 'l3',
    beneficiaryId: 'b003',
    beneficiaryName: 'خالد سعيد الغامدي',
    leaveType: 'event',
    startDate: '2026-03-10',
    endDate: '2026-03-15',
    guardianName: 'سعيد الغامدي',
    guardianContact: '0501234567',
    reason: 'إجازة عيد الفطر',
    status: 'rejected',
    history: [
      { action: 'request', actionBy: 'أ. خالد', role: 'أخصائي اجتماعي', date: now },
      { action: 'reject', actionBy: 'د. أحمد', role: 'طبيب', date: now, notes: 'لا يوجد ولي أمر لاستلامه' },
    ],
    createdAt: now,
    createdBy: 'أ. خالد الشمري',
  },
]

export const DEMO_ACTIVITIES: SocialActivity[] = [
  {
    id: 'a1',
    activityName: 'رحلة ترفيهية',
    supervisor: 'أ. سارة العتيبي',
    date: '2026-03-01',
    targetGroup: 'beneficiaries',
    location: 'منتزه الملك عبدالله',
    objectives: 'ترفيه المستفيدين وتعزيز الجانب الاجتماعي',
    outcomes: 'تفاعل إيجابي من جميع المشاركين',
    internalParticipants: 15,
    externalParticipants: 3,
    status: 'achieved',
  },
  {
    id: 'a2',
    activityName: 'ورشة فنية',
    supervisor: 'أ. منال الحربي',
    date: '2026-02-27',
    targetGroup: 'both',
    location: 'قاعة الأنشطة',
    objectives: 'تنمية المهارات الفنية',
    internalParticipants: 8,
    externalParticipants: 2,
    status: 'achieved',
  },
  {
    id: 'a3',
    activityName: 'احتفال يوم التأسيس',
    supervisor: 'أ. فهد الدوسري',
    date: '2026-02-22',
    targetGroup: 'community',
    location: 'المسرح الرئيسي',
    objectives: 'الاحتفاء بيوم التأسيس السعودي',
    outcomes: 'فعاليات متنوعة بمشاركة المجتمع المحلي',
    internalParticipants: 30,
    externalParticipants: 15,
    status: 'achieved',
  },
]
