import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { RightsRealizationLog, RightsRealizationLogInsert } from '@/types/database'
import { DEMO_RIGHTS_LOG } from './demo-data'

async function fetchRightsLog(): Promise<RightsRealizationLog[]> {
  if (isDemoMode || !supabase) return DEMO_RIGHTS_LOG

  const { data, error } = await supabase
    .from('rights_realization_log')
    .select('*')
    .order('logged_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useRightsLog(beneficiaryId?: string) {
  return useQuery({
    queryKey: queryKeys.rights.log(),
    queryFn: async () => {
      const log = await fetchRightsLog()
      return beneficiaryId ? log.filter((r) => r.beneficiary_id === beneficiaryId) : log
    },
  })
}

export function useCreateRightsEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: RightsRealizationLogInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `right${Date.now()}`, created_at: new Date().toISOString() } as RightsRealizationLog
      }
      const { data: row, error } = await supabase
        .from('rights_realization_log')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.rights.all })
    },
  })
}

export function useRightsStats() {
  const { data: log } = useRightsLog()

  return {
    totalEntries: log?.length ?? 0,
    realized: log?.filter((r) => r.status === 'realized').length ?? 0,
    partial: log?.filter((r) => r.status === 'partially_realized').length ?? 0,
    barriers: log?.filter((r) => r.status === 'barrier_identified').length ?? 0,
  }
}
