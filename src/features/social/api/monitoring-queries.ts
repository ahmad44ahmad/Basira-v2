import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { SocialFollowup, SocialFollowupInsert, DailyMonitorRound, DailyMonitorRoundInsert } from '@/types/database'

// ===== Demo Data =====

const DEMO_FOLLOWUPS: SocialFollowup[] = [
  {
    id: 'sf001',
    beneficiary_id: 'b001',
    period: '2026-H1',
    assessor_name: 'أ. خالد الشمري',
    clothing_self: 'partial',
    eating_self: 'self',
    mobility: 'wheelchair_manual',
    hygiene: 'partial',
    peer_relations: 'good',
    other_relations: 'good',
    family_cooperation: 'cooperative',
    family_bond: 'good',
    actions_taken: [{ action: 'جلسة إرشادية', date: '2026-01-15' }],
    internal_visits: 3,
    external_visits: 1,
    family_calls: 5,
    social_reports: 2,
    participates_in_activities: true,
    activity_types: ['رياضية', 'فنية'],
    hobbies: ['الرسم', 'السباحة'],
    has_talent: true,
    talent_description: 'موهبة في الرسم',
    recommendations: 'زيادة المشاركة في الأنشطة الاجتماعية',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sf002',
    beneficiary_id: 'b002',
    period: '2026-H1',
    assessor_name: 'أ. نورة القحطاني',
    clothing_self: 'self',
    eating_self: 'self',
    mobility: 'natural',
    hygiene: 'self',
    peer_relations: 'good',
    other_relations: 'partial',
    family_cooperation: 'partial',
    family_bond: 'partial',
    actions_taken: [{ action: 'اتصال بالأسرة', date: '2026-02-01' }, { action: 'جلسة توعوية', date: '2026-02-10' }],
    internal_visits: 5,
    external_visits: 2,
    family_calls: 8,
    social_reports: 3,
    participates_in_activities: true,
    activity_types: ['ثقافية', 'رياضية'],
    hobbies: ['القراءة'],
    has_talent: false,
    talent_description: null,
    recommendations: 'تعزيز العلاقة مع الأسرة وزيادة التواصل',
    created_at: new Date().toISOString(),
  },
]

const DEMO_ROUNDS: DailyMonitorRound[] = [
  {
    id: 'mr001',
    unit_number: 'وحدة 1',
    round_date: '2026-02-28',
    shift: 'morning',
    rooms: [
      { room_number: '101', appearance: 'جيد', cleanliness: 'ممتاز', health_status: 'مستقر', worker_response: 'ممتاز', notes: '' },
      { room_number: '102', appearance: 'جيد', cleanliness: 'جيد', health_status: 'يحتاج متابعة', worker_response: 'جيد', notes: 'ملاحظة على النظافة' },
    ],
    monitor_name: 'أ. محمد العتيبي',
    supervisor_name: 'أ. سعد الحربي',
    general_notes: 'الوضع العام مستقر',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mr002',
    unit_number: 'وحدة 2',
    round_date: '2026-02-28',
    shift: 'evening',
    rooms: [
      { room_number: '201', appearance: 'ممتاز', cleanliness: 'ممتاز', health_status: 'مستقر', worker_response: 'ممتاز', notes: '' },
      { room_number: '202', appearance: 'مقبول', cleanliness: 'مقبول', health_status: 'مستقر', worker_response: 'جيد', notes: '' },
      { room_number: '203', appearance: 'جيد', cleanliness: 'جيد', health_status: 'مستقر', worker_response: 'جيد', notes: '' },
    ],
    monitor_name: 'أ. فهد المطيري',
    supervisor_name: null,
    general_notes: null,
    created_at: new Date().toISOString(),
  },
]

// ===== Social Followups =====

async function fetchSocialFollowups(): Promise<SocialFollowup[]> {
  if (isDemoMode || !supabase) return DEMO_FOLLOWUPS

  const { data, error } = await supabase
    .from('social_followups')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useSocialFollowups() {
  return useQuery({
    queryKey: queryKeys.social.followups(),
    queryFn: fetchSocialFollowups,
  })
}

export function useCreateSocialFollowup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: SocialFollowupInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `sf${Date.now()}`, created_at: new Date().toISOString() } as SocialFollowup
      }
      const { data, error } = await supabase
        .from('social_followups')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.followups() })
    },
  })
}

// ===== Daily Monitor Rounds =====

async function fetchDailyMonitorRounds(): Promise<DailyMonitorRound[]> {
  if (isDemoMode || !supabase) return DEMO_ROUNDS

  const { data, error } = await supabase
    .from('daily_monitor_rounds')
    .select('*')
    .order('round_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useDailyMonitorRounds() {
  return useQuery({
    queryKey: queryKeys.social.monitorRounds(),
    queryFn: fetchDailyMonitorRounds,
  })
}

export function useCreateDailyMonitorRound() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: DailyMonitorRoundInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `mr${Date.now()}`, created_at: new Date().toISOString() } as DailyMonitorRound
      }
      const { data, error } = await supabase
        .from('daily_monitor_rounds')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.monitorRounds() })
    },
  })
}
