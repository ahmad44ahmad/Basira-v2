import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { VisitRecord, VisitRecordInsert } from '@/types/database'

// ─── Demo Data ──────────────────────────────────────────────────

const DEMO_VISIT_RECORDS: VisitRecord[] = [
  {
    id: 'vr1',
    beneficiary_id: 'b001',
    visit_type: 'internal',
    visit_date: '2026-02-25',
    arrival_time: '10:00',
    departure_time: '12:30',
    visitor_name: 'محمد أحمد السالم',
    visitor_national_id: '1045678901',
    visitor_relation: 'father',
    companion_count: 2,
    checklist_medical_exam: false,
    checklist_personal_hygiene: false,
    checklist_medications_delivered: false,
    checklist_clothing_sufficient: false,
    checklist_weight_monitored: false,
    checklist_medications_given: false,
    checklist_clothing_returned: false,
    checklist_care_instructions: false,
    checklist_diet_followed: false,
    checklist_hospital_appointments: false,
    checklist_development_plans: false,
    family_integration: 'good',
    therapy_plan_trained: false,
    visit_purpose: 'زيارة عائلية دورية للاطمئنان على حالة المستفيد',
    guardian_notes: 'المستفيد في حالة نفسية ممتازة ويبدو سعيداً',
    specialist_name: 'أ. سارة العمري',
    monitor_name: 'أ. خالد الشهري',
    nurse_name: null,
    doctor_name: null,
    created_at: '2026-02-25T10:00:00Z',
  },
  {
    id: 'vr2',
    beneficiary_id: 'b002',
    visit_type: 'external',
    visit_date: '2026-02-22',
    arrival_time: '09:00',
    departure_time: '17:00',
    visitor_name: 'عبدالله سعيد الزهراني',
    visitor_national_id: '1034567890',
    visitor_relation: 'father',
    companion_count: 3,
    checklist_medical_exam: true,
    checklist_personal_hygiene: true,
    checklist_medications_delivered: true,
    checklist_clothing_sufficient: true,
    checklist_weight_monitored: true,
    checklist_medications_given: true,
    checklist_clothing_returned: true,
    checklist_care_instructions: true,
    checklist_diet_followed: false,
    checklist_hospital_appointments: true,
    checklist_development_plans: false,
    family_integration: 'good',
    therapy_plan_trained: true,
    visit_purpose: 'إجازة نهاية أسبوع مع العائلة',
    guardian_notes: 'تم الالتزام بتعليمات الأدوية والحمية الغذائية بشكل جيد',
    specialist_name: 'أ. نورة القحطاني',
    monitor_name: 'أ. فهد المالكي',
    nurse_name: 'م. هدى الحربي',
    doctor_name: 'د. عبدالرحمن الغامدي',
    created_at: '2026-02-22T09:00:00Z',
  },
  {
    id: 'vr3',
    beneficiary_id: 'b004',
    visit_type: 'internal',
    visit_date: '2026-02-20',
    arrival_time: '14:00',
    departure_time: '16:00',
    visitor_name: 'منى حسن العتيبي',
    visitor_national_id: '1056789012',
    visitor_relation: 'mother',
    companion_count: 1,
    checklist_medical_exam: false,
    checklist_personal_hygiene: false,
    checklist_medications_delivered: false,
    checklist_clothing_sufficient: false,
    checklist_weight_monitored: false,
    checklist_medications_given: false,
    checklist_clothing_returned: false,
    checklist_care_instructions: false,
    checklist_diet_followed: false,
    checklist_hospital_appointments: false,
    checklist_development_plans: false,
    family_integration: 'partial',
    therapy_plan_trained: false,
    visit_purpose: 'متابعة تقدم خطة الدمج الأسري',
    guardian_notes: 'نحتاج لتكثيف الزيارات لتحسين التواصل',
    specialist_name: 'أ. ريم الدوسري',
    monitor_name: null,
    nurse_name: null,
    doctor_name: null,
    created_at: '2026-02-20T14:00:00Z',
  },
]

// ─── Fetch Functions ────────────────────────────────────────────

async function fetchVisitRecords(): Promise<VisitRecord[]> {
  if (isDemoMode || !supabase) return DEMO_VISIT_RECORDS

  const { data, error } = await supabase
    .from('visit_records')
    .select('*')
    .order('visit_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function createVisitRecord(record: VisitRecordInsert): Promise<VisitRecord> {
  if (isDemoMode || !supabase) {
    return {
      id: `vr-${Date.now()}`,
      ...record,
      created_at: new Date().toISOString(),
    } as VisitRecord
  }

  const { data, error } = await supabase
    .from('visit_records')
    .insert(record)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Query Hooks ────────────────────────────────────────────────

export function useVisitRecords() {
  return useQuery({
    queryKey: queryKeys.family.visitRecords(),
    queryFn: fetchVisitRecords,
  })
}

export function useCreateVisitRecord() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createVisitRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.family.visitRecords() })
    },
  })
}
