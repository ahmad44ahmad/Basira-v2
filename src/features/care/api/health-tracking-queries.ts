import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { EpilepsyTracking, MenstrualTracking, WeightTracking, HygieneFollowup } from '@/types/database'

// ===== Demo Data =====

const now = new Date().toISOString()
const today = new Date().toISOString().slice(0, 10)

const DEMO_EPILEPSY: EpilepsyTracking[] = [
  {
    id: 'ep001',
    beneficiary_id: 'b003',
    record_date: today,
    record_type: 'episode',
    seizure_date: today,
    seizure_time: '03:15',
    seizure_type: 'نوبة توترية رمعية معممة',
    duration_minutes: 3,
    medication_given: 'ديازيبام 5 مجم وريدي',
    complications: 'لا توجد مضاعفات — استعاد وعيه خلال 10 دقائق',
    medication_compliance: true,
    seizure_frequency: null,
    trigger_factors: ['قلة النوم', 'إرهاق'],
    nursing_actions: ['وضع المستفيد على جانبه', 'تأمين مجرى الهواء', 'قياس العلامات الحيوية', 'إبلاغ الطبيب المناوب'],
    recorded_by: 'ممرض: سعيد المالكي',
    created_at: now,
  },
  {
    id: 'ep002',
    beneficiary_id: 'b003',
    record_date: today,
    record_type: 'follow_up',
    seizure_date: null,
    seizure_time: null,
    seizure_type: null,
    duration_minutes: null,
    medication_given: null,
    complications: null,
    medication_compliance: true,
    seizure_frequency: 'مرة واحدة خلال الشهر',
    trigger_factors: null,
    nursing_actions: ['مراقبة دورية', 'تقييم مستوى الوعي'],
    recorded_by: 'ممرضة: نورة القحطاني',
    created_at: now,
  },
  {
    id: 'ep003',
    beneficiary_id: 'b011',
    record_date: today,
    record_type: 'episode',
    seizure_date: today,
    seizure_time: '06:45',
    seizure_type: 'نوبة توترية رمعية',
    duration_minutes: 5,
    medication_given: 'ميدازولام 5 مجم أنفي',
    complications: 'توتر حاد بعد النوبة — يحتاج مراقبة مستمرة',
    medication_compliance: true,
    seizure_frequency: null,
    trigger_factors: ['توتر', 'عدم انتظام النوم'],
    nursing_actions: ['وضع على الجانب', 'تأمين مجرى الهواء', 'إعطاء ميدازولام', 'إبلاغ الطبيب المناوب', 'مراقبة تشبع الأكسجين'],
    recorded_by: 'ممرضة: نورة القحطاني',
    created_at: now,
  },
]

const DEMO_MENSTRUAL: MenstrualTracking[] = [
  {
    id: 'mn001',
    beneficiary_id: 'b005',
    cycle_start_date: '2026-02-05',
    cycle_end_date: '2026-02-10',
    duration_days: 5,
    flow_amount: 'normal',
    regularity: 'regular',
    notes: 'دورة منتظمة بدون أعراض مصاحبة',
    recorded_by: 'ممرضة: سارة الحربي',
    created_at: now,
  },
  {
    id: 'mn002',
    beneficiary_id: 'b005',
    cycle_start_date: '2026-01-07',
    cycle_end_date: '2026-01-13',
    duration_days: 6,
    flow_amount: 'heavy',
    regularity: 'regular',
    notes: 'تدفق غزير في اليومين الأولين — تم إعطاء مسكن',
    recorded_by: 'ممرضة: سارة الحربي',
    created_at: now,
  },
]

const DEMO_WEIGHT: WeightTracking[] = [
  {
    id: 'wt001',
    beneficiary_id: 'b001',
    measurement_date: '2026-02-28',
    weight_kg: 72.5,
    height_cm: 168,
    bmi: 25.7,
    notes: 'وزن مستقر مقارنة بالشهر السابق',
    recorded_by: 'ممرض: خالد العمري',
    created_at: now,
  },
  {
    id: 'wt002',
    beneficiary_id: 'b001',
    measurement_date: '2026-01-28',
    weight_kg: 73.0,
    height_cm: 168,
    bmi: 25.9,
    notes: null,
    recorded_by: 'ممرض: خالد العمري',
    created_at: now,
  },
  {
    id: 'wt003',
    beneficiary_id: 'b001',
    measurement_date: '2025-12-28',
    weight_kg: 74.2,
    height_cm: 168,
    bmi: 26.3,
    notes: 'بدأ برنامج تغذية صحية — هدف تخفيف الوزن',
    recorded_by: 'ممرض: خالد العمري',
    created_at: now,
  },
  {
    id: 'wt004',
    beneficiary_id: 'b009',
    measurement_date: '2026-02-28',
    weight_kg: 28,
    height_cm: 110,
    bmi: 23.1,
    notes: 'وزن مستقر — يحتاج نظام غذائي لينة مهروسة',
    recorded_by: 'ممرض: خالد العمري',
    created_at: now,
  },
]

const DEMO_HYGIENE: HygieneFollowup[] = [
  {
    id: 'hf001',
    beneficiary_id: 'b001',
    followup_date: today,
    items: {
      bathing: 'partial',
      oral_care: 'self',
      hair_care: 'self',
      nail_care: 'dependent',
      clothing_change: 'self',
      toileting: 'partial',
    },
    overall_independence: 'partial',
    notes: 'يحتاج مساعدة في الاستحمام وقص الأظافر فقط',
    recorded_by: 'ممرضة: هدى الشهري',
    created_at: now,
  },
  {
    id: 'hf002',
    beneficiary_id: 'b002',
    followup_date: today,
    items: {
      bathing: 'self',
      oral_care: 'self',
      hair_care: 'self',
      nail_care: 'self',
      clothing_change: 'self',
      toileting: 'self',
    },
    overall_independence: 'self',
    notes: 'مستقل تماما في جميع أنشطة النظافة الشخصية',
    recorded_by: 'ممرضة: هدى الشهري',
    created_at: now,
  },
]

// ===== Fetch Functions =====

async function fetchEpilepsyTracking(): Promise<EpilepsyTracking[]> {
  if (isDemoMode || !supabase) return DEMO_EPILEPSY

  const { data, error } = await supabase
    .from('epilepsy_tracking')
    .select('*')
    .order('record_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

async function fetchMenstrualTracking(): Promise<MenstrualTracking[]> {
  if (isDemoMode || !supabase) return DEMO_MENSTRUAL

  const { data, error } = await supabase
    .from('menstrual_tracking')
    .select('*')
    .order('cycle_start_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

async function fetchWeightTracking(): Promise<WeightTracking[]> {
  if (isDemoMode || !supabase) return DEMO_WEIGHT

  const { data, error } = await supabase
    .from('weight_tracking')
    .select('*')
    .order('measurement_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

async function fetchHygieneFollowup(): Promise<HygieneFollowup[]> {
  if (isDemoMode || !supabase) return DEMO_HYGIENE

  const { data, error } = await supabase
    .from('hygiene_followup')
    .select('*')
    .order('followup_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

// ===== Query Hooks =====

export function useEpilepsyTracking() {
  return useQuery({
    queryKey: queryKeys.care.epilepsyTracking(),
    queryFn: fetchEpilepsyTracking,
  })
}

export function useMenstrualTracking() {
  return useQuery({
    queryKey: queryKeys.care.menstrualTracking(),
    queryFn: fetchMenstrualTracking,
  })
}

export function useWeightTracking() {
  return useQuery({
    queryKey: queryKeys.care.weightTracking(),
    queryFn: fetchWeightTracking,
  })
}

export function useHygieneFollowup() {
  return useQuery({
    queryKey: queryKeys.care.hygieneFollowup(),
    queryFn: fetchHygieneFollowup,
  })
}
