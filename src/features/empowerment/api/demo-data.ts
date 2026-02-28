import type { DignityProfile, GoalProgressLog } from '../types'

const now = new Date().toISOString()

export const DEMO_GOALS = [
  { id: 'g1', beneficiary_id: 'b001', domain: 'حركي', goal_title: 'المشي المستقل لمسافة 50 متر', goal_description: 'تحسين القدرة الحركية للمشي بدون مساعدة', measurement_type: 'distance', measurement_unit: 'متر', baseline_value: 10, target_value: 50, current_value: 35, quality_of_life_dimension: 'physical', start_date: '2026-01-01', target_date: '2026-06-01', assigned_to: 'أ. عادل العلي', assigned_department: 'العلاج الطبيعي', status: 'active' as const, progress_percentage: 70, achievement_evidence: null, barriers_notes: 'ألم في الركبة أحياناً', family_involvement: 'تشجيع مستمر', linked_national_goal: null, created_at: now, updated_at: now },
  { id: 'g2', beneficiary_id: 'b001', domain: 'تواصل', goal_title: 'نطق 20 كلمة جديدة', goal_description: 'توسيع المحصول اللغوي', measurement_type: 'count', measurement_unit: 'كلمة', baseline_value: 5, target_value: 20, current_value: 14, quality_of_life_dimension: 'social', start_date: '2026-01-15', target_date: '2026-07-15', assigned_to: 'أ. هدى المالكي', assigned_department: 'النطق والتخاطب', status: 'active' as const, progress_percentage: 60, achievement_evidence: null, barriers_notes: null, family_involvement: 'ممارسة في المنزل', linked_national_goal: null, created_at: now, updated_at: now },
  { id: 'g3', beneficiary_id: 'b002', domain: 'استقلالية', goal_title: 'ارتداء الملابس بشكل مستقل', goal_description: 'التدرب على ارتداء الملابس دون مساعدة', measurement_type: 'score', measurement_unit: 'درجة', baseline_value: 2, target_value: 10, current_value: 10, quality_of_life_dimension: 'independence', start_date: '2025-09-01', target_date: '2026-02-01', assigned_to: 'أ. نور العمري', assigned_department: 'العلاج الوظيفي', status: 'achieved' as const, progress_percentage: 100, achievement_evidence: 'تم التوثيق بالفيديو', barriers_notes: null, family_involvement: 'تدريب الأسرة', linked_national_goal: null, created_at: now, updated_at: now },
]

export const DEMO_LOGS: GoalProgressLog[] = [
  { id: 'pl1', goalId: 'g1', date: '2026-02-25', value: 35, note: 'تحسن ملحوظ — مشى 35 متر بدون مساعدة', recordedBy: 'أ. عادل العلي' },
  { id: 'pl2', goalId: 'g1', date: '2026-02-18', value: 28, note: 'زيادة تدريجية في المسافة', recordedBy: 'أ. عادل العلي' },
  { id: 'pl3', goalId: 'g2', date: '2026-02-20', value: 14, note: 'نطق 3 كلمات جديدة هذا الأسبوع', recordedBy: 'أ. هدى المالكي' },
]

export const DEMO_DIGNITY: DignityProfile = {
  id: 'd1',
  beneficiaryId: 'b001',
  preferredName: 'أبو سلطان',
  communicationStyle: 'بصري — يفضل الصور والإشارات',
  likes: ['الموسيقى الهادئة', 'الرسم', 'المشي في الحديقة'],
  dislikes: ['الأصوات العالية', 'الأماكن المزدحمة'],
  strengths: ['ذاكرة بصرية قوية', 'تعاون ممتاز'],
  motivators: ['المكافآت الغذائية', 'الثناء اللفظي'],
  calmingStrategies: ['الموسيقى الهادئة', 'الضغط العميق'],
  dreams: 'أحب أن أتعلم الرسم',
}
