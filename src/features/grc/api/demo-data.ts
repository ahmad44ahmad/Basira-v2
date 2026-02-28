import type { Risk, ComplianceRequirement, SafetyIncident } from '../types'

export const DEMO_RISKS: Risk[] = [
  { id: 'r1', title: 'نقص الكادر التمريضي', description: 'قد يؤدي نقص الكادر إلى تأخر تقديم الرعاية', category: 'operational', likelihood: 4, impact: 5, riskScore: 20, riskLevel: 'critical', response: 'mitigate', mitigationPlan: 'تعيين 5 ممرضين إضافيين خلال Q1', owner: 'مدير التمريض', status: 'open' },
  { id: 'r2', title: 'تعطل نظام المعلومات', description: 'انقطاع النظام قد يؤثر على توثيق الرعاية', category: 'technology', likelihood: 2, impact: 5, riskScore: 10, riskLevel: 'high', response: 'mitigate', mitigationPlan: 'نسخ احتياطي يومي + خطة استمرارية', owner: 'تقنية المعلومات', status: 'mitigated' },
  { id: 'r3', title: 'تسرب بيانات حساسة', description: 'خطر تسرب بيانات المستفيدين الطبية', category: 'compliance', likelihood: 2, impact: 5, riskScore: 10, riskLevel: 'high', response: 'avoid', mitigationPlan: 'تشفير قاعدة البيانات + RLS + تدقيق دوري', owner: 'أمن المعلومات', status: 'mitigated' },
  { id: 'r4', title: 'حريق في المطبخ', description: 'خطر نشوب حريق بسبب معدات الطبخ', category: 'safety', likelihood: 2, impact: 4, riskScore: 8, riskLevel: 'medium', response: 'mitigate', mitigationPlan: 'فحص دوري + طفايات حريق + تدريب الموظفين', owner: 'إدارة السلامة', status: 'mitigated' },
  { id: 'r5', title: 'انتشار عدوى', description: 'خطر انتشار عدوى بين المستفيدين', category: 'clinical', likelihood: 3, impact: 4, riskScore: 12, riskLevel: 'high', response: 'mitigate', mitigationPlan: 'تطبيق بروتوكولات IPC بصرامة', owner: 'مكافحة العدوى', status: 'open' },
  { id: 'r6', title: 'سقوط مستفيدين', description: 'خطر سقوط خاصة لكبار السن وذوي الإعاقة الحركية', category: 'clinical', likelihood: 3, impact: 3, riskScore: 9, riskLevel: 'medium', response: 'mitigate', mitigationPlan: 'تقييم مورس + تدابير وقائية حسب مستوى الخطر', owner: 'التمريض', status: 'open' },
  { id: 'r7', title: 'تأخر صيانة المعدات', description: 'تأخر صيانة المعدات الطبية عن الجدول', category: 'operational', likelihood: 3, impact: 3, riskScore: 9, riskLevel: 'medium', response: 'transfer', mitigationPlan: 'عقد صيانة شامل مع مورد خارجي', owner: 'إدارة التشغيل', status: 'mitigated' },
]

export const DEMO_COMPLIANCE: ComplianceRequirement[] = [
  { id: 'comp1', standard: 'ISO 9001:2015', clause: '4.1', requirement: 'فهم المنظمة وسياقها', status: 'compliant', evidence: 'تحليل SWOT محدث', gapAnalysis: '', remediationPlan: '', dueDate: '' },
  { id: 'comp2', standard: 'ISO 9001:2015', clause: '5.1', requirement: 'القيادة والالتزام', status: 'compliant', evidence: 'سياسة الجودة معتمدة من المدير', gapAnalysis: '', remediationPlan: '', dueDate: '' },
  { id: 'comp3', standard: 'ISO 9001:2015', clause: '6.1', requirement: 'إجراءات معالجة المخاطر', status: 'partial', evidence: 'سجل المخاطر موجود', gapAnalysis: 'لم يتم تحديث المخاطر منذ 6 أشهر', remediationPlan: 'مراجعة ربع سنوية', dueDate: '2026-03-31' },
  { id: 'comp4', standard: 'ISO 9001:2015', clause: '7.2', requirement: 'الكفاءة', status: 'compliant', evidence: 'سجلات تدريب محدثة لجميع الموظفين', gapAnalysis: '', remediationPlan: '', dueDate: '' },
  { id: 'comp5', standard: 'ISO 9001:2015', clause: '8.5.1', requirement: 'التحكم في تقديم الخدمة', status: 'partial', evidence: 'إجراءات موثقة جزئياً', gapAnalysis: '3 إجراءات تحتاج تحديث', remediationPlan: 'تحديث الإجراءات المتبقية', dueDate: '2026-03-15' },
  { id: 'comp6', standard: 'وزارة الموارد البشرية', clause: 'معيار 3.2', requirement: 'نسبة التوطين في التمريض', status: 'non_compliant', evidence: 'نسبة حالية 15%', gapAnalysis: 'المطلوب 30% — فجوة 15%', remediationPlan: 'خطة توظيف سعوديين', dueDate: '2026-06-30' },
  { id: 'comp7', standard: 'مكافحة العدوى', clause: 'CBAHI 1.5', requirement: 'برنامج مكافحة عدوى فعال', status: 'compliant', evidence: 'تقارير IPC شهرية + نتائج تدقيق', gapAnalysis: '', remediationPlan: '', dueDate: '' },
]

export const DEMO_SAFETY: SafetyIncident[] = [
  { id: 's1', title: 'سقوط مستفيد', type: 'fall', severity: 'high', date: '2026-02-22', location: 'جناح ذكور A', status: 'investigating', description: 'سقط المستفيد أثناء محاولة الذهاب للحمام ليلاً', injuryLevel: 'minor' },
  { id: 's2', title: 'خطأ دوائي', type: 'medication_error', severity: 'high', date: '2026-02-18', location: 'جناح إناث B', status: 'resolved', description: 'جرعة مضاعفة من الباراسيتامول — تم الاكتشاف فوراً', injuryLevel: 'none' },
  { id: 's3', title: 'سلوك عدواني', type: 'behavioral', severity: 'medium', date: '2026-02-15', location: 'قاعة الأنشطة', status: 'resolved', description: 'سلوك عدواني من مستفيد تجاه آخر — تم التدخل', injuryLevel: 'none' },
  { id: 's4', title: 'إصابة عمل', type: 'workplace', severity: 'low', date: '2026-02-10', location: 'المطبخ', status: 'closed', description: 'جرح بسيط لعامل المطبخ أثناء التقطيع', injuryLevel: 'minor' },
]
