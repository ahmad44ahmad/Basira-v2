import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { ActivityAdvance, ActivityAdvanceInsert } from '@/types/database'

// ===== Demo Data =====

const DEMO_ADVANCES: ActivityAdvance[] = [
  {
    id: 'adv001',
    fiscal_year: '1447',
    advance_type: 'imprest',
    amount_requested: 5000,
    amount_approved: 5000,
    amount_spent: 3200,
    purpose: 'شراء مستلزمات النشاط الرياضي الشهري',
    budget_line: 'بند الأنشطة والبرامج',
    approval_status: 'approved',
    receipts: [
      { description: 'مستلزمات رياضية', amount: 2000, date: '2026-02-15' },
      { description: 'مأكولات وعصائر', amount: 1200, date: '2026-02-15' },
    ],
    requested_by: 'أ. محمد العتيبي',
    approved_by: 'أ. سعد الحربي',
    settlement_date: null,
    settlement_notes: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'adv002',
    fiscal_year: '1447',
    advance_type: 'reimbursement',
    amount_requested: 1500,
    amount_approved: 1500,
    amount_spent: 1500,
    purpose: 'استرداد تكاليف رحلة ترفيهية',
    budget_line: 'بند الرحلات',
    approval_status: 'settled',
    receipts: [
      { description: 'رسوم دخول المنتزه', amount: 800, date: '2026-02-10' },
      { description: 'نقل', amount: 700, date: '2026-02-10' },
    ],
    requested_by: 'أ. فهد المطيري',
    approved_by: 'أ. سعد الحربي',
    settlement_date: '2026-02-20',
    settlement_notes: 'تمت التسوية بنجاح',
    created_at: new Date().toISOString(),
  },
]

// ===== Activity Advances =====

async function fetchActivityAdvances(): Promise<ActivityAdvance[]> {
  if (isDemoMode || !supabase) return DEMO_ADVANCES

  const { data, error } = await supabase
    .from('activity_advances')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useActivityAdvances() {
  return useQuery({
    queryKey: queryKeys.social.activityAdvances(),
    queryFn: fetchActivityAdvances,
  })
}

export function useCreateActivityAdvance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ActivityAdvanceInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `adv${Date.now()}`, created_at: new Date().toISOString() } as ActivityAdvance
      }
      const { data, error } = await supabase
        .from('activity_advances')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.activityAdvances() })
    },
  })
}
