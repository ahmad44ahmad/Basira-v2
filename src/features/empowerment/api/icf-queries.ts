import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { IcfAssessment, IcfAssessmentInsert } from '@/types/database'
import { DEMO_ICF_ASSESSMENTS } from './demo-data'

async function fetchIcfAssessments(): Promise<IcfAssessment[]> {
  if (isDemoMode || !supabase) return DEMO_ICF_ASSESSMENTS

  const { data, error } = await supabase
    .from('icf_assessments')
    .select('*')
    .order('assessment_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useIcfAssessments(beneficiaryId?: string) {
  return useQuery({
    queryKey: queryKeys.icf.assessments(),
    queryFn: async () => {
      const assessments = await fetchIcfAssessments()
      return beneficiaryId ? assessments.filter((a) => a.beneficiary_id === beneficiaryId) : assessments
    },
  })
}

export function useCreateIcfAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: IcfAssessmentInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `icf${Date.now()}`, created_at: new Date().toISOString() } as IcfAssessment
      }
      const { data: row, error } = await supabase
        .from('icf_assessments')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.icf.all })
    },
  })
}

export function useIcfStats() {
  const { data: assessments } = useIcfAssessments()

  const total = assessments?.length ?? 0
  const byComponent = {
    b: assessments?.filter((a) => a.component === 'b').length ?? 0,
    s: assessments?.filter((a) => a.component === 's').length ?? 0,
    d: assessments?.filter((a) => a.component === 'd').length ?? 0,
    e: assessments?.filter((a) => a.component === 'e').length ?? 0,
  }

  const withGap = assessments?.filter(
    (a) => a.component === 'd' && a.capacity_qualifier != null && a.performance_qualifier != null
      && a.capacity_qualifier !== a.performance_qualifier
  ).length ?? 0

  return { total, byComponent, environmentalGaps: withGap }
}
