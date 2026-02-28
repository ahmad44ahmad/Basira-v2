import { HeartPulse, Shield, Target, Activity, CheckCircle } from 'lucide-react'

// ── Department Performance Data ─────────────────────────────────

export const DEPARTMENT_PERFORMANCE = [
  { type: 'medical', label: 'الخدمات الطبية', progress: 82, total: 45, color: 'bg-rose-500' },
  { type: 'social', label: 'الرعاية الاجتماعية', progress: 75, total: 38, color: 'bg-blue-500' },
  { type: 'psychological', label: 'الدعم النفسي', progress: 68, total: 30, color: 'bg-purple-500' },
  { type: 'physiotherapy', label: 'العلاج الطبيعي', progress: 71, total: 28, color: 'bg-teal-500' },
  { type: 'occupational', label: 'العلاج الوظيفي', progress: 65, total: 22, color: 'bg-amber-500' },
]

export const RECENT_ACTIVITY = [
  { action: 'تسجيل رعاية يومية', target: 'أحمد محمد السالم', time: 'منذ 15 دقيقة', icon: HeartPulse, color: 'text-rose-500' },
  { action: 'تقييم مخاطر السقوط', target: 'فاطمة عبدالله العمري', time: 'منذ 30 دقيقة', icon: Shield, color: 'text-amber-500' },
  { action: 'اكتمال خطة تأهيل', target: 'خالد سعيد الغامدي', time: 'منذ ساعة', icon: Target, color: 'text-emerald-500' },
  { action: 'طلب صيانة جديد', target: 'قسم الذكور - غرفة 12', time: 'منذ ساعتين', icon: Activity, color: 'text-blue-500' },
  { action: 'إجازة عائلية - موافقة', target: 'سارة محمد الحربي', time: 'منذ 3 ساعات', icon: CheckCircle, color: 'text-teal-500' },
]

export const PENDING_TASKS = [
  { label: 'موافقات مدير معلقة', count: 4, urgent: true },
  { label: 'خطط تأهيل بانتظار الاعتماد', count: 7, urgent: false },
  { label: 'تحديثات الضمان الاجتماعي', count: 3, urgent: false },
  { label: 'تقارير طبية متأخرة', count: 2, urgent: true },
]

export const COMPLIANCE_TREND = [
  { label: 'الأسبوع 1', value: 78 },
  { label: 'الأسبوع 2', value: 82 },
  { label: 'الأسبوع 3', value: 85 },
  { label: 'الأسبوع 4', value: 88 },
]
