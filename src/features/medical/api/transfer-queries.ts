import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { PatientTransfer, DiseaseNotification } from '@/types/database'

// ─── Demo Data ──────────────────────────────────────────────────

const now = new Date().toISOString()
const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()

const DEMO_TRANSFERS: PatientTransfer[] = [
  {
    id: 'tr-001',
    beneficiary_id: 'b001',
    transfer_date: weekAgo.slice(0, 10),
    transfer_type: 'external',
    from_location: 'مركز بصيرة للرعاية',
    to_location: 'مستشفى الملك فهد التخصصي',
    reason: 'نوبة صرع متكررة تحتاج تقييم عصبي متقدم',
    clinical_summary: 'مستفيد يعاني من شلل دماغي وصرع، حدثت نوبتين في 24 ساعة رغم العلاج',
    diagnosis: 'صرع غير مسيطر عليه',
    medications_at_transfer: [
      { drug: 'كاربامازبين', dose: '200 ملغ', frequency: 'مرتين يوميا' },
    ],
    medical_record_attached: true,
    discharge_diagnosis: 'تم تعديل جرعة الدواء وإضافة ليفيتيراسيتام',
    follow_up_instructions: 'متابعة في عيادة الأعصاب بعد شهر، مراقبة النوبات يوميا',
    sending_physician: 'د. أحمد العتيبي',
    receiving_physician: 'د. عبدالله الغامدي',
    created_at: weekAgo,
  },
  {
    id: 'tr-002',
    beneficiary_id: 'b002',
    transfer_date: now.slice(0, 10),
    transfer_type: 'internal',
    from_location: 'جناح أ - الطابق الأول',
    to_location: 'جناح ب - الطابق الثاني',
    reason: 'نقل لجناح مناسب لاحتياجات الرعاية المتقدمة',
    clinical_summary: 'حالة مستقرة، يحتاج بيئة أكثر ملاءمة',
    diagnosis: 'متلازمة داون',
    medications_at_transfer: [
      { drug: 'أوميبرازول', dose: '20 ملغ', frequency: 'مرة يوميا' },
    ],
    medical_record_attached: true,
    discharge_diagnosis: null,
    follow_up_instructions: 'متابعة تكيف المستفيد مع البيئة الجديدة',
    sending_physician: 'د. سارة الحربي',
    receiving_physician: null,
    created_at: now,
  },
]

const DEMO_DISEASE_NOTIFICATIONS: DiseaseNotification[] = [
  {
    id: 'dn-001',
    beneficiary_id: 'b004',
    notification_date: now.slice(0, 10),
    disease_name: 'إنفلونزا موسمية',
    onset_date: new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10),
    symptoms: ['حمى', 'سعال', 'آلام عضلية', 'إرهاق عام'],
    contacts: [
      { name: 'مستفيد ب003', relation: 'غرفة مجاورة', status: 'تحت المراقبة' },
    ],
    authority_notified: true,
    authority_reference: 'REF-2026-0145',
    precautions_taken: ['عزل المريض', 'تعقيم الغرفة', 'توزيع كمامات على المخالطين'],
    notifier_name: 'د. أحمد العتيبي',
    created_at: now,
  },
]

// ─── Fetch Functions ────────────────────────────────────────────

async function fetchTransfers(): Promise<PatientTransfer[]> {
  if (isDemoMode || !supabase) return DEMO_TRANSFERS

  const { data, error } = await supabase
    .from('patient_transfers')
    .select('*')
    .order('transfer_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function fetchDiseaseNotifications(): Promise<DiseaseNotification[]> {
  if (isDemoMode || !supabase) return DEMO_DISEASE_NOTIFICATIONS

  const { data, error } = await supabase
    .from('disease_notifications')
    .select('*')
    .order('notification_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Hooks ──────────────────────────────────────────────────────

export function useTransfers() {
  return useQuery({
    queryKey: queryKeys.medical.transfers(),
    queryFn: fetchTransfers,
  })
}

export function useDiseaseNotifications() {
  return useQuery({
    queryKey: queryKeys.medical.diseaseNotifications(),
    queryFn: fetchDiseaseNotifications,
  })
}
