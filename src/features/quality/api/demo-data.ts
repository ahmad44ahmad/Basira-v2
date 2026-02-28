import type { NCR, AuditCycle, OvrReport } from '../types'

export const DEMO_NCRS: NCR[] = [
  { id: 'ncr1', code: 'NCR-2026-001', title: 'عدم توثيق الرعاية اليومية لـ 3 مستفيدين', department: 'التمريض', severity: 'major', status: 'in_progress', isoClause: '8.5.1', identifiedDate: '2026-02-15', dueDate: '2026-03-15', assignedTo: 'مشرف التمريض', rootCause: 'نقص الكادر في الوردية الليلية', capas: [{ id: 'c1', description: 'تعيين ممرض إضافي للوردية الليلية', type: 'corrective', status: 'open', dueDate: '2026-03-01' }, { id: 'c2', description: 'تفعيل التنبيهات الآلية للتوثيق المتأخر', type: 'preventive', status: 'open', dueDate: '2026-03-15' }] },
  { id: 'ncr2', code: 'NCR-2026-002', title: 'عدم الالتزام ببروتوكول نظافة اليدين', department: 'مكافحة العدوى', severity: 'major', status: 'open', isoClause: '8.5.1', identifiedDate: '2026-02-20', dueDate: '2026-03-20', assignedTo: 'أ. محمد الحربي', rootCause: 'عدم توفر المطهرات في نقاط الدخول', capas: [{ id: 'c3', description: 'تركيب موزعات مطهر إضافية', type: 'corrective', status: 'open', dueDate: '2026-03-01' }] },
  { id: 'ncr3', code: 'NCR-2026-003', title: 'تأخر في صيانة معدات العلاج الطبيعي', department: 'التأهيل', severity: 'minor', status: 'closed', isoClause: '7.1.3', identifiedDate: '2026-01-10', dueDate: '2026-02-10', assignedTo: 'إدارة التشغيل', rootCause: 'تأخر المورد في توفير قطع الغيار', capas: [{ id: 'c4', description: 'التعاقد مع مورد بديل', type: 'preventive', status: 'verified', dueDate: '2026-02-10' }] },
  { id: 'ncr4', code: 'NCR-2026-004', title: 'عدم تحديث ملفات التأهيل', department: 'التأهيل', severity: 'minor', status: 'verified', isoClause: '7.5', identifiedDate: '2026-01-25', dueDate: '2026-02-25', assignedTo: 'أ. نور العمري', rootCause: 'عدم وضوح المسؤولية', capas: [{ id: 'c5', description: 'تحديد مسؤول التوثيق لكل قسم', type: 'corrective', status: 'verified', dueDate: '2026-02-15' }] },
]

export const DEMO_AUDITS: AuditCycle[] = [
  { id: 'aud1', cycleName: 'تدقيق Q1 2026', year: 2026, quarter: 1, status: 'in_progress', startDate: '2026-01-15', endDate: '2026-03-15', leadAuditor: 'أ. سعد المطيري', totalAudits: 8, completedAudits: 5, findings: [{ id: 'f1', type: 'minor_nc', description: 'عدم تحديث سجلات التدريب', isoClause: '7.2', status: 'open' }, { id: 'f2', type: 'observation', description: 'فرصة تحسين في توثيق الاجتماعات', isoClause: '5.3', status: 'open' }] },
  { id: 'aud2', cycleName: 'تدقيق Q4 2025', year: 2025, quarter: 4, status: 'completed', startDate: '2025-10-01', endDate: '2025-12-31', leadAuditor: 'أ. سعد المطيري', totalAudits: 8, completedAudits: 8, findings: [{ id: 'f3', type: 'major_nc', description: 'عدم وجود خطة طوارئ محدثة', isoClause: '6.1', status: 'closed' }] },
]

export const DEMO_OVRS: OvrReport[] = [
  { id: 'ovr1', title: 'سقوط مستفيد أثناء النقل', category: 'safety', severity: 'high', date: '2026-02-22', department: 'التمريض', status: 'investigating', reportedBy: 'ممرض: سعيد', description: 'سقط المستفيد أثناء النقل من الكرسي إلى السرير' },
  { id: 'ovr2', title: 'خطأ في إعطاء الدواء', category: 'medication', severity: 'high', date: '2026-02-18', department: 'التمريض', status: 'resolved', reportedBy: 'ممرض: عادل', description: 'تم إعطاء جرعة مضاعفة من الباراسيتامول — تم التعامل فوراً' },
  { id: 'ovr3', title: 'عطل في نظام الإنذار', category: 'equipment', severity: 'medium', date: '2026-02-15', department: 'التشغيل', status: 'resolved', reportedBy: 'فني: أحمد', description: 'تعطل جرس الإنذار في الجناح B لمدة ساعتين' },
  { id: 'ovr4', title: 'شكوى ولي أمر', category: 'complaint', severity: 'low', date: '2026-02-10', department: 'الاجتماعية', status: 'closed', reportedBy: 'أ. خالد الشمري', description: 'شكوى بخصوص تأخر الرد على طلب إجازة' },
]
