import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type {
  Referral, ReferralInsert,
  FamilyNotification, FamilyNotificationInsert,
  IncidentReport, IncidentReportInsert,
} from '@/types/database'

// ===== Demo Data =====

const DEMO_REFERRALS: Referral[] = [
  {
    id: 'ref001',
    beneficiary_id: 'b001',
    referral_type: 'internal',
    specialty: 'behavioral',
    urgency: 'important',
    referred_to_department: 'قسم العلاج السلوكي',
    referred_to_section: null,
    description: 'يحتاج المستفيد لجلسات تعديل سلوك بسبب سلوكيات عدوانية متكررة',
    current_needs: 'جلسات إرشادية فردية وجماعية',
    expected_outcomes: 'تحسن في السلوك الاجتماعي خلال 3 أشهر',
    receiving_opinion: null,
    intervention_description: null,
    status: 'in_treatment',
    specialist_name: 'أ. خالد الشمري',
    supervisor_name: 'د. عبدالرحمن الفهد',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ref002',
    beneficiary_id: 'b002',
    referral_type: 'external',
    specialty: 'medical',
    urgency: 'urgent',
    referred_to_department: 'مستشفى الملك فهد التخصصي',
    referred_to_section: 'قسم العظام',
    description: 'يحتاج تقييم طبي شامل لآلام متكررة في الظهر',
    current_needs: 'أشعة وفحوصات شاملة',
    expected_outcomes: 'تشخيص دقيق وخطة علاجية',
    receiving_opinion: 'بانتظار الموعد',
    intervention_description: null,
    status: 'pending',
    specialist_name: 'أ. نورة القحطاني',
    supervisor_name: null,
    created_at: new Date().toISOString(),
  },
]

const DEMO_FAMILY_NOTIFICATIONS: FamilyNotification[] = [
  {
    id: 'fn001',
    beneficiary_id: 'b001',
    notification_type: 'injury',
    notification_detail: 'إصابة طفيفة في اليد اليمنى أثناء النشاط الرياضي',
    contact_number: '0551234567',
    contacted_relation: 'father',
    contacted_name: 'محمد أحمد السالم',
    call_summary: 'تم إبلاغ والد المستفيد بالإصابة وطمأنته بأن الحالة مستقرة',
    notes: null,
    notified_by: 'أ. خالد الشمري',
    created_at: new Date().toISOString(),
  },
  {
    id: 'fn002',
    beneficiary_id: 'b002',
    notification_type: 'appointment',
    notification_detail: 'موعد مراجعة في مستشفى الملك فهد التخصصي يوم الخميس',
    contact_number: '0559876543',
    contacted_relation: 'mother',
    contacted_name: 'سارة عبدالله',
    call_summary: 'تم التنسيق مع الأم لحضور الموعد مع المستفيد',
    notes: 'الأم ستحضر بنفسها للمرافقة',
    notified_by: 'أ. نورة القحطاني',
    created_at: new Date().toISOString(),
  },
]

const DEMO_INCIDENT_REPORTS: IncidentReport[] = [
  {
    id: 'ir001',
    beneficiary_id: 'b001',
    incident_date: '2026-02-25',
    incident_time: '10:30',
    incident_type: 'unapproved',
    incident_type_detail: 'خروج من الغرفة بدون إذن خلال فترة الراحة',
    worker_name: 'أحمد سعيد',
    worker_id: 'emp005',
    worker_statement: 'لاحظت خروج المستفيد من غرفته خلال فترة الراحة وتم إرجاعه',
    action_taken_on_worker: null,
    specialist_opinion: 'يحتاج تعزيز الإشراف خلال فترات الراحة',
    social_worker_opinion: 'سيتم عقد جلسة إرشادية مع المستفيد',
    reported_by: 'أ. خالد الشمري',
    created_at: new Date().toISOString(),
  },
]

// ===== Referrals =====

async function fetchReferrals(): Promise<Referral[]> {
  if (isDemoMode || !supabase) return DEMO_REFERRALS

  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useReferrals() {
  return useQuery({
    queryKey: queryKeys.social.referrals(),
    queryFn: fetchReferrals,
  })
}

export function useCreateReferral() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ReferralInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `ref${Date.now()}`, created_at: new Date().toISOString() } as Referral
      }
      const { data, error } = await supabase
        .from('referrals')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.referrals() })
    },
  })
}

// ===== Family Notifications =====

async function fetchFamilyNotifications(): Promise<FamilyNotification[]> {
  if (isDemoMode || !supabase) return DEMO_FAMILY_NOTIFICATIONS

  const { data, error } = await supabase
    .from('family_notifications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useFamilyNotifications() {
  return useQuery({
    queryKey: queryKeys.social.familyNotifications(),
    queryFn: fetchFamilyNotifications,
  })
}

export function useCreateFamilyNotification() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: FamilyNotificationInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `fn${Date.now()}`, created_at: new Date().toISOString() } as FamilyNotification
      }
      const { data, error } = await supabase
        .from('family_notifications')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.familyNotifications() })
    },
  })
}

// ===== Incident Reports =====

async function fetchIncidentReports(): Promise<IncidentReport[]> {
  if (isDemoMode || !supabase) return DEMO_INCIDENT_REPORTS

  const { data, error } = await supabase
    .from('incident_reports')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useIncidentReports() {
  return useQuery({
    queryKey: queryKeys.social.incidentReports(),
    queryFn: fetchIncidentReports,
  })
}

export function useCreateIncidentReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: IncidentReportInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `ir${Date.now()}`, created_at: new Date().toISOString() } as IncidentReport
      }
      const { data, error } = await supabase
        .from('incident_reports')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.incidentReports() })
    },
  })
}
