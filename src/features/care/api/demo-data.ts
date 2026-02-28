import type { DailyCareLog, ShiftHandoverReport } from '@/types/database'
import type { ShiftHandoverItem } from '../types'

const now = new Date().toISOString()
const today = new Date().toISOString().slice(0, 10)

export const DEMO_CARE_LOGS: DailyCareLog[] = [
  {
    id: 'cl001',
    beneficiary_id: 'b001',
    shift: 'صباحي',
    shift_date: today,
    temperature: 36.8,
    pulse: 78,
    blood_pressure_systolic: 120,
    blood_pressure_diastolic: 80,
    oxygen_saturation: 98,
    blood_sugar: 105,
    meals: { breakfast: 'كامل', lunch: 'جزئي' },
    medications: { كاربامازبين: 'تم', أملوديبين: 'تم' },
    care_activities: ['غسيل', 'علاج طبيعي'],
    incidents: null,
    mood: 'مستقر',
    sleep_quality: 'جيدة',
    notes: 'حالة المستفيد مستقرة',
    recorded_by: 'ممرض: سعيد',
    created_at: now,
  },
  {
    id: 'cl002',
    beneficiary_id: 'b004',
    shift: 'صباحي',
    shift_date: today,
    temperature: 37.2,
    pulse: 85,
    blood_pressure_systolic: 140,
    blood_pressure_diastolic: 90,
    oxygen_saturation: 96,
    blood_sugar: 180,
    meals: { breakfast: 'كامل' },
    medications: { أنسولين: 'تم' },
    care_activities: ['غسيل'],
    incidents: null,
    mood: 'قلق',
    sleep_quality: 'متقطعة',
    notes: 'ارتفاع طفيف في السكر — يتطلب متابعة',
    recorded_by: 'ممرض: سعيد',
    created_at: now,
  },
]

export const DEMO_HANDOVER_ITEMS: ShiftHandoverItem[] = [
  { id: 'h1', category: 'critical', title: 'ارتفاع حرارة المستفيد', description: 'أحمد محمد — حرارة 38.5°C تم إعطاء خافض حرارة، يحتاج متابعة', beneficiaryName: 'أحمد محمد السالم', priority: 'high', shiftType: 'صباحي', status: 'active', createdAt: now, createdBy: 'ممرض: سعيد' },
  { id: 'h2', category: 'medication', title: 'تأخر في إعطاء الأنسولين', description: 'نورة حسن — لم يتم إعطاء جرعة الأنسولين الصباحية بسبب انخفاض السكر', beneficiaryName: 'نورة حسن العتيبي', priority: 'high', shiftType: 'صباحي', status: 'active', createdAt: now, createdBy: 'ممرض: سعيد' },
  { id: 'h3', category: 'care', title: 'تغيير ضمادة', description: 'خالد سعيد — يحتاج تغيير ضمادة الجرح في الساق اليمنى', beneficiaryName: 'خالد سعيد الغامدي', priority: 'medium', shiftType: 'صباحي', status: 'active', createdAt: now, createdBy: 'ممرض: سعيد' },
  { id: 'h4', category: 'pending', title: 'نتائج تحليل دم', description: 'فاطمة عبدالله — بانتظار نتائج تحليل CBC من المختبر', beneficiaryName: 'فاطمة عبدالله الزهراني', priority: 'low', shiftType: 'صباحي', status: 'active', createdAt: now, createdBy: 'ممرض: سعيد' },
]

export const DEMO_HANDOVER_REPORTS: ShiftHandoverReport[] = [
  {
    id: 'hr001',
    shift_date: today,
    outgoing_shift: 'صباحي',
    incoming_shift: 'مسائي',
    section: 'ذكور',
    stable_count: 35,
    needs_attention_count: 5,
    critical_count: 2,
    summary_incidents: 'ارتفاع حرارة مستفيد واحد — تم التعامل',
    created_at: now,
  },
]
