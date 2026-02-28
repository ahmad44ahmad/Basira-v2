import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { MedicalProfile, MedicalProfileInsert } from '@/types/database'
import { DEMO_MEDICAL_PROFILES } from './demo-data'

// ===== Fetch =====

async function fetchMedicalProfiles(): Promise<MedicalProfile[]> {
  if (isDemoMode || !supabase) return DEMO_MEDICAL_PROFILES

  const { data, error } = await supabase
    .from('medical_profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function fetchMedicalProfile(beneficiaryId: string): Promise<MedicalProfile | null> {
  if (isDemoMode || !supabase) {
    return DEMO_MEDICAL_PROFILES.find((p) => p.beneficiary_id === beneficiaryId) ?? null
  }

  const { data, error } = await supabase
    .from('medical_profiles')
    .select('*')
    .eq('beneficiary_id', beneficiaryId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ?? null
}

// ===== Hooks =====

export function useMedicalProfiles() {
  return useQuery({
    queryKey: queryKeys.medical.profiles(),
    queryFn: fetchMedicalProfiles,
  })
}

export function useMedicalProfile(beneficiaryId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.medical.profile(beneficiaryId!),
    queryFn: () => fetchMedicalProfile(beneficiaryId!),
    enabled: !!beneficiaryId,
  })
}

export function useUpdateMedicalProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<MedicalProfileInsert> }) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { error } = await supabase
        .from('medical_profiles')
        .update(updates)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.medical.all })
    },
  })
}

export function useMedicalStats() {
  const { data: profiles } = useMedicalProfiles()

  return {
    totalProfiles: profiles?.length ?? 0,
    epilepticCount: profiles?.filter((p) => p.epilepsy).length ?? 0,
    withAllergies: profiles?.filter((p) => (p.allergies?.length ?? 0) > 0).length ?? 0,
    withChronicDiseases: profiles?.filter((p) => (p.chronic_diseases?.length ?? 0) > 0).length ?? 0,
  }
}
