import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { Beneficiary, BeneficiaryInsert } from '@/types/database'
import type { UnifiedBeneficiaryProfile, RiskLevel } from '../types'
import { DEMO_BENEFICIARIES } from './demo-data'

// ===== Transform DB row → Unified Profile =====
function transformBeneficiary(row: Beneficiary): UnifiedBeneficiaryProfile {
  const medicalText = (row.medical_diagnosis ?? '').toLowerCase()
  const hasChronicCondition = medicalText.includes('سكري') || medicalText.includes('صرع')
  const isOrphan = row.guardian_relation === 'institution' || (row.notes ?? '').includes('يتيم')

  let riskLevel: RiskLevel = 'low'
  if (medicalText.includes('طريح') || medicalText.includes('حرج')) {
    riskLevel = 'critical'
  } else if (hasChronicCondition) {
    riskLevel = 'high'
  } else if (medicalText.includes('متوسط')) {
    riskLevel = 'medium'
  }

  const smartTags = []
  if (medicalText.includes('صرع')) smartTags.push({ id: 'epilepsy', label: 'صرع', color: 'red' as const })
  if (medicalText.includes('سكري')) smartTags.push({ id: 'diabetic', label: 'سكري', color: 'orange' as const })
  if (isOrphan) smartTags.push({ id: 'orphan', label: 'يتيم', color: 'gray' as const })

  return {
    ...row,
    smartTags,
    riskLevel,
    isOrphan,
    hasChronicCondition,
    requiresIsolation: false,
  }
}

// ===== Fetch all beneficiaries =====
async function fetchBeneficiaries(): Promise<UnifiedBeneficiaryProfile[]> {
  if (isDemoMode || !supabase) return DEMO_BENEFICIARIES

  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .order('full_name')

  if (error) throw error
  return (data ?? []).map(transformBeneficiary)
}

// ===== Fetch single beneficiary =====
async function fetchBeneficiary(id: string): Promise<UnifiedBeneficiaryProfile | null> {
  if (isDemoMode || !supabase) {
    return DEMO_BENEFICIARIES.find((b) => b.id === id) ?? null
  }

  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data ? transformBeneficiary(data) : null
}

// ===== Hooks =====

export function useBeneficiaries() {
  return useQuery({
    queryKey: queryKeys.beneficiaries.all,
    queryFn: fetchBeneficiaries,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBeneficiary(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.beneficiaries.detail(id!),
    queryFn: () => fetchBeneficiary(id!),
    enabled: !!id,
  })
}

export function useCreateBeneficiary() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: BeneficiaryInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('beneficiaries')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.beneficiaries.all })
    },
  })
}

export function useUpdateBeneficiary() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BeneficiaryInsert> }) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { error } = await supabase
        .from('beneficiaries')
        .update(updates)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.beneficiaries.all })
      qc.invalidateQueries({ queryKey: queryKeys.beneficiaries.detail(id) })
    },
  })
}

export function useBeneficiaryStats() {
  const { data: beneficiaries } = useBeneficiaries()

  const stats = {
    total: beneficiaries?.length ?? 0,
    active: beneficiaries?.filter((b) => b.status === 'نشط').length ?? 0,
    male: beneficiaries?.filter((b) => b.section === 'ذكور').length ?? 0,
    female: beneficiaries?.filter((b) => b.section === 'إناث').length ?? 0,
    children: beneficiaries?.filter((b) => b.section === 'أطفال').length ?? 0,
    highRisk: beneficiaries?.filter((b) => b.riskLevel === 'high' || b.riskLevel === 'critical').length ?? 0,
  }

  return stats
}
