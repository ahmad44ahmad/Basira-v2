import type { NCR, AuditCycle, OvrReport } from '../types'

export const DEMO_NCRS: NCR[] = [
  {
    id: 'ncr1',
    title: 'عدم توثيق الرعاية اليومية لـ 3 مستفيدين',
    description: 'لم يتم توثيق سجلات الرعاية اليومية لثلاثة مستفيدين خلال الوردية الليلية بسبب نقص الكادر',
    department: 'التمريض',
    severity: 'major',
    status: 'in_progress',
    isoClause: '8.5.1',
    reportedBy: 'مشرف التمريض',
    reportedDate: '2026-02-15',
    dueDate: '2026-03-15',
    rootCause: 'نقص الكادر في الوردية الليلية',
    capas: [
      { id: 'c1', description: 'تعيين ممرض إضافي للوردية الليلية', type: 'corrective', assignedTo: 'إدارة الموارد البشرية', status: 'in_progress', dueDate: '2026-03-01' },
      { id: 'c2', description: 'تفعيل التنبيهات الآلية للتوثيق المتأخر', type: 'preventive', assignedTo: 'قسم تقنية المعلومات', status: 'pending', dueDate: '2026-03-15' },
    ],
  },
  {
    id: 'ncr2',
    title: 'عدم الالتزام ببروتوكول نظافة اليدين',
    description: 'رصد عدم التزام متكرر ببروتوكول نظافة اليدين في نقاط الدخول بسبب عدم توفر المطهرات',
    department: 'مكافحة العدوى',
    severity: 'major',
    status: 'open',
    isoClause: '8.5.1',
    reportedBy: 'أ. محمد الحربي',
    reportedDate: '2026-02-20',
    dueDate: '2026-03-20',
    rootCause: 'عدم توفر المطهرات في نقاط الدخول',
    capas: [
      { id: 'c3', description: 'تركيب موزعات مطهر إضافية', type: 'corrective', assignedTo: 'إدارة التشغيل', status: 'pending', dueDate: '2026-03-01' },
    ],
  },
  {
    id: 'ncr3',
    title: 'تأخر في صيانة معدات العلاج الطبيعي',
    description: 'تأخر صيانة معدات العلاج الطبيعي بسبب عدم توفر قطع الغيار من المورد الحالي',
    department: 'التأهيل',
    severity: 'minor',
    status: 'closed',
    isoClause: '7.1.3',
    reportedBy: 'إدارة التشغيل',
    reportedDate: '2026-01-10',
    dueDate: '2026-02-10',
    rootCause: 'تأخر المورد في توفير قطع الغيار',
    capas: [
      { id: 'c4', description: 'التعاقد مع مورد بديل', type: 'preventive', assignedTo: 'إدارة المشتريات', status: 'verified', dueDate: '2026-02-10' },
    ],
  },
  {
    id: 'ncr4',
    title: 'عدم تحديث ملفات التأهيل',
    description: 'عدم تحديث ملفات التأهيل لعدد من المستفيدين بسبب عدم وضوح مسؤولية التوثيق',
    department: 'التأهيل',
    severity: 'minor',
    status: 'verification',
    isoClause: '7.5',
    reportedBy: 'أ. نور العمري',
    reportedDate: '2026-01-25',
    dueDate: '2026-02-25',
    rootCause: 'عدم وضوح المسؤولية',
    capas: [
      { id: 'c5', description: 'تحديد مسؤول التوثيق لكل قسم', type: 'corrective', assignedTo: 'مدير الجودة', status: 'verified', dueDate: '2026-02-15' },
    ],
  },
]

export const DEMO_AUDITS: AuditCycle[] = [
  {
    id: 'aud1',
    cycleName: 'تدقيق Q1 2026',
    cycleYear: 2026,
    cycleQuarter: 1,
    status: 'in_progress',
    plannedStartDate: '2026-01-15',
    plannedEndDate: '2026-03-15',
    leadAuditor: 'أ. سعد المطيري',
    scope: 'تدقيق شامل للأقسام الطبية والإدارية',
    findings: [
      { id: 'f1', findingType: 'minor_nc', description: 'عدم تحديث سجلات التدريب', isoClause: '7.2', department: 'الموارد البشرية', status: 'open' },
      { id: 'f2', findingType: 'observation', description: 'فرصة تحسين في توثيق الاجتماعات', isoClause: '5.3', department: 'الإدارة العليا', status: 'open' },
    ],
  },
  {
    id: 'aud2',
    cycleName: 'تدقيق Q4 2025',
    cycleYear: 2025,
    cycleQuarter: 4,
    status: 'completed',
    plannedStartDate: '2025-10-01',
    plannedEndDate: '2025-12-31',
    leadAuditor: 'أ. سعد المطيري',
    findings: [
      { id: 'f3', findingType: 'major_nc', description: 'عدم وجود خطة طوارئ محدثة', isoClause: '6.1', department: 'إدارة السلامة', status: 'closed' },
    ],
  },
]

export const DEMO_OVRS: OvrReport[] = [
  { id: 'ovr1', incidentDate: '2026-02-22', description: 'سقط المستفيد أثناء النقل من الكرسي إلى السرير', category: 'fall', severity: 'major', isAnonymous: false, reporterName: 'ممرض: سعيد', status: 'investigating' },
  { id: 'ovr2', incidentDate: '2026-02-18', description: 'تم إعطاء جرعة مضاعفة من الباراسيتامول — تم التعامل فوراً', category: 'medication_error', severity: 'major', isAnonymous: false, reporterName: 'ممرض: عادل', status: 'closed' },
  { id: 'ovr3', incidentDate: '2026-02-15', description: 'تعطل جرس الإنذار في الجناح B لمدة ساعتين', category: 'equipment', severity: 'moderate', isAnonymous: false, reporterName: 'فني: أحمد', status: 'closed' },
  { id: 'ovr4', incidentDate: '2026-02-10', description: 'شكوى بخصوص تأخر الرد على طلب إجازة', category: 'other', severity: 'minor', isAnonymous: true, status: 'closed' },
]
