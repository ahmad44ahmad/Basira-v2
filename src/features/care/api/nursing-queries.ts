import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { NursingAssessment, VitalSignChart, NursingNote } from '@/types/database'

// ===== Demo Data =====

const now = new Date().toISOString()
const today = new Date().toISOString().slice(0, 10)

const DEMO_NURSING_ASSESSMENTS: NursingAssessment[] = [
  {
    id: 'na001',
    beneficiary_id: 'b001',
    assessment_date: today,
    assessment_type: 'admission',
    chief_complaint: 'ألم في المفاصل مع صعوبة في الحركة',
    medical_history: 'سكري نوع ٢ — ارتفاع ضغط الدم',
    physical_findings: {
      general: 'واعٍ متجاوب',
      respiratory: 'طبيعي',
      cardiovascular: 'منتظم بدون نفخة',
      musculoskeletal: 'محدودية حركة في الركبة اليمنى',
    },
    vital_signs: {
      temperature: 37.0,
      pulse: 76,
      blood_pressure: '130/85',
      oxygen_saturation: 97,
      respiratory_rate: 18,
    },
    functional_status: 'يحتاج مساعدة جزئية في التنقل',
    daily_activities: 'يستطيع تناول الطعام بنفسه — يحتاج مساعدة في الاستحمام',
    medication_summary: 'ميتفورمين 500 مجم مرتين يوميا، أملوديبين 5 مجم',
    clinical_changes: null,
    shift_summary: null,
    assessor_name: 'ممرضة: سارة الحربي',
    assessor_role: 'ممرضة مسجلة',
    created_at: now,
  },
  {
    id: 'na002',
    beneficiary_id: 'b003',
    assessment_date: today,
    assessment_type: 'periodic',
    chief_complaint: null,
    medical_history: 'صرع — تخلف ذهني بسيط',
    physical_findings: {
      general: 'مستقر نشط',
      neurological: 'لا توجد علامات بؤرية',
      skin: 'سليمة بدون تقرحات',
    },
    vital_signs: {
      temperature: 36.7,
      pulse: 80,
      blood_pressure: '118/75',
      oxygen_saturation: 99,
    },
    functional_status: 'مستقل في أغلب الأنشطة',
    daily_activities: 'مشارك في برنامج التأهيل',
    medication_summary: 'كاربامازبين 200 مجم ثلاث مرات يوميا',
    clinical_changes: 'تحسن في عدد النوبات خلال الشهر الماضي',
    shift_summary: null,
    assessor_name: 'ممرض: خالد العمري',
    assessor_role: 'ممرض مسجل',
    created_at: now,
  },
  {
    id: 'na003',
    beneficiary_id: 'b002',
    assessment_date: today,
    assessment_type: 'daily_report',
    chief_complaint: null,
    medical_history: null,
    physical_findings: { general: 'حالة مستقرة' },
    vital_signs: { temperature: 36.5, pulse: 72, blood_pressure: '120/80' },
    functional_status: 'مستقل',
    daily_activities: null,
    medication_summary: null,
    clinical_changes: null,
    shift_summary: 'حالة المستفيد مستقرة طوال الوردية — لا توجد شكاوى',
    assessor_name: 'ممرضة: نورة القحطاني',
    assessor_role: 'ممرضة',
    created_at: now,
  },
]

const DEMO_VITAL_SIGN_CHARTS: VitalSignChart[] = [
  {
    id: 'vc001',
    beneficiary_id: 'b001',
    chart_date: today,
    chart_type: 'floor',
    readings: [
      { time: '08:00', temperature: 37.2, pulse: 72, blood_pressure: '125/82', respiratory_rate: 18, oxygen_saturation: 97 },
      { time: '14:00', temperature: 37.0, pulse: 78, blood_pressure: '130/85', respiratory_rate: 17, oxygen_saturation: 98 },
      { time: '20:00', temperature: 36.8, pulse: 70, blood_pressure: '122/78', respiratory_rate: 16, oxygen_saturation: 98 },
    ],
    unit_number: 'ج-201',
    shift: 'صباحي',
    insulin_dose: null,
    nurse_name: 'ممرضة: سارة الحربي',
    created_at: now,
  },
  {
    id: 'vc002',
    beneficiary_id: 'b004',
    chart_date: today,
    chart_type: 'blood_sugar',
    readings: [
      { time: '07:00', blood_sugar_fasting: 145, insulin_dose: '12 وحدة' },
      { time: '12:00', blood_sugar_before_lunch: 180, insulin_dose: '8 وحدات' },
      { time: '18:00', blood_sugar_before_dinner: 160, insulin_dose: '10 وحدات' },
    ],
    unit_number: 'ج-105',
    shift: 'صباحي',
    insulin_dose: '30 وحدة يوميا',
    nurse_name: 'ممرض: سعيد المالكي',
    created_at: now,
  },
  {
    id: 'vc003',
    beneficiary_id: 'b002',
    chart_date: today,
    chart_type: 'observation',
    readings: [
      { time: '08:00', temperature: 36.5, pulse: 68, consciousness: 'واعٍ', pupils: 'متساوية متفاعلة' },
      { time: '10:00', temperature: 36.6, pulse: 70, consciousness: 'واعٍ', pupils: 'متساوية متفاعلة' },
    ],
    unit_number: 'م-301',
    shift: 'صباحي',
    insulin_dose: null,
    nurse_name: 'ممرضة: هدى الشهري',
    created_at: now,
  },
]

const DEMO_NURSING_NOTES: NursingNote[] = [
  {
    id: 'nn001',
    beneficiary_id: 'b001',
    note_date: today,
    note_time: '09:30',
    shift: 'morning',
    narrative_note: 'المستفيد يشتكي من ألم خفيف في الركبة اليمنى بعد جلسة العلاج الطبيعي. تم إعطاء مسكن حسب الوصفة. يتابع الطبيب المعالج.',
    patient_condition: 'مستقر مع ألم خفيف',
    vital_signs_summary: 'الحرارة 37.0 — النبض 76 — الضغط 130/85',
    nurse_name: 'ممرضة: سارة الحربي',
    created_at: now,
  },
  {
    id: 'nn002',
    beneficiary_id: 'b004',
    note_date: today,
    note_time: '11:00',
    shift: 'morning',
    narrative_note: 'ارتفاع ملحوظ في سكر الدم الصباحي (180 مجم/دل). تم ضبط جرعة الأنسولين بعد استشارة الطبيب. المستفيد ملتزم بالحمية الغذائية.',
    patient_condition: 'مستقر — يحتاج متابعة سكر الدم',
    vital_signs_summary: 'السكر 180 — الحرارة 36.8 — الضغط 140/90',
    nurse_name: 'ممرض: سعيد المالكي',
    created_at: now,
  },
  {
    id: 'nn003',
    beneficiary_id: 'b003',
    note_date: today,
    note_time: '15:30',
    shift: 'evening',
    narrative_note: 'حالة المستفيد مستقرة. تناول وجبة الغداء كاملة. شارك في نشاط ترفيهي بعد الظهر. لا توجد شكاوى.',
    patient_condition: 'مستقر',
    vital_signs_summary: null,
    nurse_name: 'ممرضة: نورة القحطاني',
    created_at: now,
  },
]

// ===== Fetch Functions =====

async function fetchNursingAssessments(): Promise<NursingAssessment[]> {
  if (isDemoMode || !supabase) return DEMO_NURSING_ASSESSMENTS

  const { data, error } = await supabase
    .from('nursing_assessments')
    .select('*')
    .order('assessment_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

async function fetchVitalSignCharts(): Promise<VitalSignChart[]> {
  if (isDemoMode || !supabase) return DEMO_VITAL_SIGN_CHARTS

  const { data, error } = await supabase
    .from('vital_sign_charts')
    .select('*')
    .order('chart_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

async function fetchNursingNotes(): Promise<NursingNote[]> {
  if (isDemoMode || !supabase) return DEMO_NURSING_NOTES

  const { data, error } = await supabase
    .from('nursing_notes')
    .select('*')
    .order('note_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

// ===== Query Hooks =====

export function useNursingAssessments() {
  return useQuery({
    queryKey: queryKeys.care.nursingAssessments(),
    queryFn: fetchNursingAssessments,
  })
}

export function useVitalSignCharts() {
  return useQuery({
    queryKey: queryKeys.care.vitalSignCharts(),
    queryFn: fetchVitalSignCharts,
  })
}

export function useNursingNotes() {
  return useQuery({
    queryKey: queryKeys.care.nursingNotes(),
    queryFn: fetchNursingNotes,
  })
}
