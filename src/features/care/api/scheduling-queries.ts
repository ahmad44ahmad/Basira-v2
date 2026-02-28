import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { Appointment, IsolationRecord, AmbulanceCheck } from '@/types/database'

// ===== Demo Data =====

const now = new Date().toISOString()
const today = new Date().toISOString().slice(0, 10)

const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'ap001',
    beneficiary_id: 'b001',
    appointment_date: '2026-03-02',
    appointment_time: '09:00',
    department: 'العلاج الطبيعي',
    service_type: 'جلسة تأهيل',
    reason: 'متابعة علاج الركبة اليمنى',
    confirmation_status: 'scheduled',
    companion_needed: false,
    transport_needed: false,
    notes: 'الجلسة الأسبوعية المعتادة',
    scheduled_by: 'ممرضة: سارة الحربي',
    created_at: now,
  },
  {
    id: 'ap002',
    beneficiary_id: 'b004',
    appointment_date: '2026-03-01',
    appointment_time: '10:30',
    department: 'العيادة الخارجية — الغدد الصماء',
    service_type: 'استشارة متابعة',
    reason: 'متابعة السكري وضبط جرعة الأنسولين',
    confirmation_status: 'confirmed',
    companion_needed: true,
    transport_needed: true,
    notes: 'يحتاج مرافق ونقل بسيارة المركز',
    scheduled_by: 'ممرض: سعيد المالكي',
    created_at: now,
  },
  {
    id: 'ap003',
    beneficiary_id: 'b003',
    appointment_date: '2026-02-25',
    appointment_time: '11:00',
    department: 'الأعصاب',
    service_type: 'فحص دوري',
    reason: 'متابعة الصرع — تخطيط دماغ',
    confirmation_status: 'completed',
    companion_needed: true,
    transport_needed: true,
    notes: 'تم الفحص — النتائج طبيعية — الموعد القادم بعد 3 أشهر',
    scheduled_by: 'ممرضة: نورة القحطاني',
    created_at: now,
  },
]

const DEMO_ISOLATION: IsolationRecord[] = [
  {
    id: 'is001',
    beneficiary_id: 'b006',
    isolation_type: 'infection_control',
    start_date: '2026-02-26',
    start_time: '14:00',
    end_date: null,
    end_time: null,
    reason: 'اشتباه إنفلونزا موسمية — حرارة مرتفعة وأعراض تنفسية',
    precautions: ['عزل تنفسي', 'كمامة N95', 'قفازات', 'ثوب عازل'],
    authorization_physician: 'د. عبدالله الشهري',
    medical_justification: 'منع انتشار العدوى في الجناح',
    observations: [
      { date: '2026-02-26', time: '14:00', note: 'بدء العزل — حرارة 38.5' },
      { date: '2026-02-27', time: '08:00', note: 'الحرارة 37.8 — تحسن طفيف' },
      { date: '2026-02-28', time: '08:00', note: 'الحرارة 37.2 — تحسن ملحوظ' },
    ],
    status: 'active',
    termination_reason: null,
    duration_hours: null,
    created_at: now,
  },
  {
    id: 'is002',
    beneficiary_id: 'b007',
    isolation_type: 'psychiatric',
    start_date: '2026-02-24',
    start_time: '22:30',
    end_date: '2026-02-25',
    end_time: '10:00',
    reason: 'سلوك عدواني تجاه المقيمين الآخرين — خطر إيذاء',
    precautions: ['مراقبة مستمرة', 'بيئة آمنة', 'إزالة الأدوات الحادة'],
    authorization_physician: 'د. فهد العتيبي',
    medical_justification: 'حماية المستفيد والآخرين — تهدئة نفسية',
    observations: [
      { date: '2026-02-24', time: '22:30', note: 'بدء العزل — المستفيد هائج' },
      { date: '2026-02-25', time: '02:00', note: 'هدأ المستفيد — نام' },
      { date: '2026-02-25', time: '08:00', note: 'مستقر — هادئ — يتعاون' },
      { date: '2026-02-25', time: '10:00', note: 'إنهاء العزل بعد تقييم الطبيب النفسي' },
    ],
    status: 'terminated',
    termination_reason: 'تحسن الحالة السلوكية — تقييم الطبيب النفسي إيجابي',
    duration_hours: 11.5,
    created_at: now,
  },
]

const DEMO_AMBULANCE: AmbulanceCheck[] = [
  {
    id: 'am001',
    check_date: today,
    vehicle_id: 'AMB-01',
    vehicle_plate: 'أ ب ج 1234',
    equipment_status: [
      { item: 'جهاز إنعاش', status: 'يعمل', expiry: '2027-06-15' },
      { item: 'أسطوانة أكسجين', status: 'يعمل', level: '85%' },
      { item: 'حقيبة إسعافات أولية', status: 'مكتمل', last_refill: '2026-02-20' },
      { item: 'نقالة', status: 'يعمل' },
      { item: 'جهاز قياس ضغط', status: 'يعمل' },
    ],
    fuel_level: '75%',
    mileage: 45230,
    safety_items_ok: true,
    cleanliness_ok: true,
    inspector_name: 'فني: محمد الدوسري',
    created_at: now,
  },
  {
    id: 'am002',
    check_date: today,
    vehicle_id: 'AMB-02',
    vehicle_plate: 'د هـ و 5678',
    equipment_status: [
      { item: 'جهاز إنعاش', status: 'يعمل', expiry: '2027-03-10' },
      { item: 'أسطوانة أكسجين', status: 'يحتاج تعبئة', level: '20%' },
      { item: 'حقيبة إسعافات أولية', status: 'يحتاج تعبئة', last_refill: '2026-01-05' },
      { item: 'نقالة', status: 'يعمل' },
      { item: 'جهاز قياس ضغط', status: 'يعمل' },
    ],
    fuel_level: '40%',
    mileage: 62180,
    safety_items_ok: true,
    cleanliness_ok: false,
    inspector_name: 'فني: سالم القرني',
    created_at: now,
  },
]

// ===== Fetch Functions =====

async function fetchAppointments(): Promise<Appointment[]> {
  if (isDemoMode || !supabase) return DEMO_APPOINTMENTS

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

async function fetchIsolationRecords(): Promise<IsolationRecord[]> {
  if (isDemoMode || !supabase) return DEMO_ISOLATION

  const { data, error } = await supabase
    .from('isolation_records')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

async function fetchAmbulanceChecks(): Promise<AmbulanceCheck[]> {
  if (isDemoMode || !supabase) return DEMO_AMBULANCE

  const { data, error } = await supabase
    .from('ambulance_checks')
    .select('*')
    .order('check_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

// ===== Query Hooks =====

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.care.appointments(),
    queryFn: fetchAppointments,
  })
}

export function useIsolationRecords() {
  return useQuery({
    queryKey: queryKeys.care.isolationRecords(),
    queryFn: fetchIsolationRecords,
  })
}

export function useAmbulanceChecks() {
  return useQuery({
    queryKey: queryKeys.care.ambulanceChecks(),
    queryFn: fetchAmbulanceChecks,
  })
}
