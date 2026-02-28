import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { DentalRecord, DentalHygieneLog, DentalSterilization } from '@/types/database'

// ===== Demo Data =====

const DEMO_DENTAL_RECORDS: DentalRecord[] = [
  {
    id: 'dr-001',
    beneficiary_id: 'b001',
    record_date: '2026-02-25',
    record_type: 'charting',
    tooth_chart: [
      { tooth: 11, status: 'caries', surface: 'mesial' },
      { tooth: 14, status: 'filled', surface: 'occlusal' },
      { tooth: 36, status: 'missing', surface: null },
    ],
    ohis_score: 2.5,
    cpitn_score: 3,
    treatment_phase: null,
    treatment_performed: null,
    tooth_numbers: null,
    materials_used: null,
    complications: null,
    dentist_name: 'د. سارة العتيبي',
    created_at: '2026-02-25T09:00:00Z',
  },
  {
    id: 'dr-002',
    beneficiary_id: 'b002',
    record_date: '2026-02-26',
    record_type: 'treatment',
    tooth_chart: [],
    ohis_score: null,
    cpitn_score: null,
    treatment_phase: 'restorative',
    treatment_performed: 'حشوة مركبة',
    tooth_numbers: [16, 17],
    materials_used: 'كمبوزيت',
    complications: null,
    dentist_name: 'د. سارة العتيبي',
    created_at: '2026-02-26T10:30:00Z',
  },
  {
    id: 'dr-003',
    beneficiary_id: 'b003',
    record_date: '2026-02-27',
    record_type: 'treatment',
    tooth_chart: [],
    ohis_score: null,
    cpitn_score: null,
    treatment_phase: 'preventive',
    treatment_performed: 'تنظيف وتلميع',
    tooth_numbers: null,
    materials_used: null,
    complications: null,
    dentist_name: 'د. سارة العتيبي',
    created_at: '2026-02-27T11:00:00Z',
  },
]

const DEMO_HYGIENE_LOGS: DentalHygieneLog[] = [
  {
    id: 'dh-001',
    beneficiary_id: 'b001',
    log_date: '2026-02-25',
    brushing_done: true,
    brushing_time: 'both',
    training_session: false,
    training_notes: null,
    oral_health_status: 'good',
    recorded_by: 'أ. نورة الشمري',
    created_at: '2026-02-25T18:00:00Z',
  },
  {
    id: 'dh-002',
    beneficiary_id: 'b002',
    log_date: '2026-02-26',
    brushing_done: true,
    brushing_time: 'morning',
    training_session: true,
    training_notes: 'تدريب على استخدام فرشاة الأسنان بشكل صحيح',
    oral_health_status: 'fair',
    recorded_by: 'أ. نورة الشمري',
    created_at: '2026-02-26T18:00:00Z',
  },
  {
    id: 'dh-003',
    beneficiary_id: 'b003',
    log_date: '2026-02-27',
    brushing_done: false,
    brushing_time: null,
    training_session: false,
    training_notes: null,
    oral_health_status: 'poor',
    recorded_by: 'أ. نورة الشمري',
    created_at: '2026-02-27T18:00:00Z',
  },
]

const DEMO_STERILIZATION: DentalSterilization[] = [
  {
    id: 'ds-001',
    log_date: '2026-02-25',
    equipment_name: 'أوتوكلاف ١',
    sterilization_method: 'autoclave',
    cycle_number: 45,
    temperature: 134,
    pressure: 2.1,
    duration_minutes: 18,
    biological_indicator_result: 'pass',
    operator_name: 'ف. محمد القحطاني',
    created_at: '2026-02-25T07:00:00Z',
  },
  {
    id: 'ds-002',
    log_date: '2026-02-26',
    equipment_name: 'أوتوكلاف ٢',
    sterilization_method: 'autoclave',
    cycle_number: 32,
    temperature: 134,
    pressure: 2.0,
    duration_minutes: 18,
    biological_indicator_result: 'pass',
    operator_name: 'ف. محمد القحطاني',
    created_at: '2026-02-26T07:00:00Z',
  },
]

// ===== Dental Records =====

async function fetchDentalRecords(): Promise<DentalRecord[]> {
  if (isDemoMode || !supabase) return DEMO_DENTAL_RECORDS

  const { data, error } = await supabase
    .from('dental_records')
    .select('*')
    .order('record_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export function useDentalRecords() {
  return useQuery({
    queryKey: queryKeys.dental.records(),
    queryFn: fetchDentalRecords,
  })
}

// ===== Dental Hygiene Logs =====

async function fetchDentalHygieneLogs(): Promise<DentalHygieneLog[]> {
  if (isDemoMode || !supabase) return DEMO_HYGIENE_LOGS

  const { data, error } = await supabase
    .from('dental_hygiene_logs')
    .select('*')
    .order('log_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export function useDentalHygieneLogs() {
  return useQuery({
    queryKey: queryKeys.dental.hygieneLogs(),
    queryFn: fetchDentalHygieneLogs,
  })
}

// ===== Dental Sterilization =====

async function fetchDentalSterilization(): Promise<DentalSterilization[]> {
  if (isDemoMode || !supabase) return DEMO_STERILIZATION

  const { data, error } = await supabase
    .from('dental_sterilization')
    .select('*')
    .order('log_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export function useDentalSterilization() {
  return useQuery({
    queryKey: queryKeys.dental.sterilization(),
    queryFn: fetchDentalSterilization,
  })
}
