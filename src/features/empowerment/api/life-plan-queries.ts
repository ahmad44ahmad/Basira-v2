import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { IndividualLifePlan, IndividualLifePlanInsert } from '@/types/database'
import { DEMO_LIFE_PLANS } from './demo-data'

async function fetchLifePlans(): Promise<IndividualLifePlan[]> {
  if (isDemoMode || !supabase) return DEMO_LIFE_PLANS

  const { data, error } = await supabase
    .from('individual_life_plans')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useLifePlans(beneficiaryId?: string) {
  return useQuery({
    queryKey: queryKeys.lifePlans.plans(),
    queryFn: async () => {
      const plans = await fetchLifePlans()
      return beneficiaryId ? plans.filter((p) => p.beneficiary_id === beneficiaryId) : plans
    },
  })
}

export function useCreateLifePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: IndividualLifePlanInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('individual_life_plans')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.lifePlans.all })
    },
  })
}
