import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { MedicalExamination, Prescription, LabOrder } from '@/types/database'

// ─── Demo Data ──────────────────────────────────────────────────

const now = new Date().toISOString()
const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()
const twoWeeksAgo = new Date(Date.now() - 14 * 86_400_000).toISOString()

const DEMO_EXAMINATIONS: MedicalExamination[] = [
  {
    id: 'exam-001',
    beneficiary_id: 'b001',
    exam_date: now.slice(0, 10),
    exam_time: '09:30',
    chief_complaint: 'صداع متكرر وارتفاع في الحرارة',
    physical_findings: { general: 'واعي ومتعاون', chest: 'أصوات تنفسية طبيعية' },
    vital_signs: { bp: '120/80', pulse: '78', temp: '37.8', resp: '18' },
    diagnosis: 'التهاب الجيوب الأنفية',
    recommendations: 'مضاد حيوي لمدة 7 أيام مع متابعة',
    examiner_name: 'د. أحمد العتيبي',
    signature_date: now.slice(0, 10),
    created_at: now,
  },
  {
    id: 'exam-002',
    beneficiary_id: 'b002',
    exam_date: weekAgo.slice(0, 10),
    exam_time: '11:00',
    chief_complaint: 'ألم في المعدة وغثيان',
    physical_findings: { abdomen: 'ألم عند الضغط في المنطقة العلوية' },
    vital_signs: { bp: '110/70', pulse: '82', temp: '36.9', resp: '16' },
    diagnosis: 'التهاب المعدة',
    recommendations: 'حمية غذائية مع مضاد للحموضة',
    examiner_name: 'د. سارة الحربي',
    signature_date: weekAgo.slice(0, 10),
    created_at: weekAgo,
  },
  {
    id: 'exam-003',
    beneficiary_id: 'b003',
    exam_date: twoWeeksAgo.slice(0, 10),
    exam_time: '14:15',
    chief_complaint: 'فحص دوري روتيني',
    physical_findings: { general: 'حالة عامة جيدة', skin: 'لا توجد طفح جلدي' },
    vital_signs: { bp: '115/75', pulse: '72', temp: '36.5', resp: '17' },
    diagnosis: 'لا يوجد مرض حاد',
    recommendations: 'استمرار على الأدوية الحالية',
    examiner_name: 'د. أحمد العتيبي',
    signature_date: twoWeeksAgo.slice(0, 10),
    created_at: twoWeeksAgo,
  },
]

const DEMO_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-001',
    beneficiary_id: 'b001',
    prescription_date: now.slice(0, 10),
    prescription_type: 'medication',
    items: [
      { drug: 'أموكسيسيلين', dose: '500 ملغ', frequency: '3 مرات يوميا', duration: '7 أيام' },
      { drug: 'باراسيتامول', dose: '500 ملغ', frequency: 'عند الحاجة', duration: '5 أيام' },
    ],
    prescriber_name: 'د. أحمد العتيبي',
    pharmacy_notes: 'يؤخذ بعد الأكل',
    status: 'active',
    created_at: now,
  },
  {
    id: 'rx-002',
    beneficiary_id: 'b002',
    prescription_date: weekAgo.slice(0, 10),
    prescription_type: 'medication',
    items: [
      { drug: 'أوميبرازول', dose: '20 ملغ', frequency: 'مرة يوميا قبل الإفطار', duration: '14 يوم' },
    ],
    prescriber_name: 'د. سارة الحربي',
    pharmacy_notes: null,
    status: 'active',
    created_at: weekAgo,
  },
  {
    id: 'rx-003',
    beneficiary_id: 'b004',
    prescription_date: twoWeeksAgo.slice(0, 10),
    prescription_type: 'standing_orders',
    items: [
      { drug: 'أنسولين', dose: '10 وحدات', frequency: 'قبل الوجبات', duration: 'مستمر' },
      { drug: 'أملوديبين', dose: '5 ملغ', frequency: 'مرة يوميا', duration: 'مستمر' },
    ],
    prescriber_name: 'د. أحمد العتيبي',
    pharmacy_notes: 'مراقبة السكر يوميا',
    status: 'completed',
    created_at: twoWeeksAgo,
  },
]

const DEMO_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab-001',
    beneficiary_id: 'b001',
    order_date: now.slice(0, 10),
    tests: [
      { name: 'تعداد دم شامل (CBC)', code: 'CBC' },
      { name: 'سرعة ترسيب (ESR)', code: 'ESR' },
    ],
    ordered_by: 'د. أحمد العتيبي',
    collected_by: null,
    collection_date: null,
    status: 'ordered',
    physician_notified: false,
    notified_date: null,
    created_at: now,
  },
  {
    id: 'lab-002',
    beneficiary_id: 'b004',
    order_date: weekAgo.slice(0, 10),
    tests: [
      { name: 'سكر صائم', code: 'FBS' },
      { name: 'الهيموغلوبين التراكمي (HbA1c)', code: 'HBA1C' },
    ],
    ordered_by: 'د. سارة الحربي',
    collected_by: 'الممرضة فاطمة',
    collection_date: weekAgo.slice(0, 10),
    status: 'resulted',
    physician_notified: true,
    notified_date: weekAgo.slice(0, 10),
    created_at: weekAgo,
  },
  {
    id: 'lab-003',
    beneficiary_id: 'b002',
    order_date: now.slice(0, 10),
    tests: [
      { name: 'وظائف كبد', code: 'LFT' },
    ],
    ordered_by: 'د. أحمد العتيبي',
    collected_by: 'الممرضة نورة',
    collection_date: now.slice(0, 10),
    status: 'collected',
    physician_notified: false,
    notified_date: null,
    created_at: now,
  },
]

// ─── Fetch Functions ────────────────────────────────────────────

async function fetchExaminations(): Promise<MedicalExamination[]> {
  if (isDemoMode || !supabase) return DEMO_EXAMINATIONS

  const { data, error } = await supabase
    .from('medical_examinations')
    .select('*')
    .order('exam_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function fetchPrescriptions(): Promise<Prescription[]> {
  if (isDemoMode || !supabase) return DEMO_PRESCRIPTIONS

  const { data, error } = await supabase
    .from('prescriptions')
    .select('*')
    .order('prescription_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function fetchLabOrders(): Promise<LabOrder[]> {
  if (isDemoMode || !supabase) return DEMO_LAB_ORDERS

  const { data, error } = await supabase
    .from('lab_orders')
    .select('*')
    .order('order_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Hooks ──────────────────────────────────────────────────────

export function useExaminations() {
  return useQuery({
    queryKey: queryKeys.medical.examinations(),
    queryFn: fetchExaminations,
  })
}

export function usePrescriptions() {
  return useQuery({
    queryKey: queryKeys.medical.prescriptions(),
    queryFn: fetchPrescriptions,
  })
}

export function useLabOrders() {
  return useQuery({
    queryKey: queryKeys.medical.labOrders(),
    queryFn: fetchLabOrders,
  })
}
