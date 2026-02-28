import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { EmergencyPeepPlan, EmergencyPeepPlanInsert, EmergencyEquipmentReadiness, EmergencyEquipmentReadinessInsert } from '@/types/database'
import { DEMO_PEEP_PLANS, DEMO_EQUIPMENT } from './demo-emergency-data'

// ===== PEEP Plans =====

async function fetchPeepPlans(): Promise<EmergencyPeepPlan[]> {
  if (isDemoMode || !supabase) return DEMO_PEEP_PLANS

  const { data, error } = await supabase
    .from('emergency_peep_plans')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function usePeepPlans() {
  return useQuery({
    queryKey: queryKeys.emergency.plans(),
    queryFn: fetchPeepPlans,
  })
}

export function useCreatePeepPlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: EmergencyPeepPlanInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('emergency_peep_plans')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.emergency.all })
    },
  })
}

// ===== Equipment Readiness =====

async function fetchEquipmentReadiness(): Promise<EmergencyEquipmentReadiness[]> {
  if (isDemoMode || !supabase) return DEMO_EQUIPMENT

  const { data, error } = await supabase
    .from('emergency_equipment_readiness')
    .select('*')
    .order('next_inspection_date', { ascending: true })

  if (error) throw error
  return data ?? []
}

export function useEquipmentReadiness() {
  return useQuery({
    queryKey: queryKeys.emergency.equipment(),
    queryFn: fetchEquipmentReadiness,
  })
}

export function useCreateEquipmentInspection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: EmergencyEquipmentReadinessInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('emergency_equipment_readiness')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.emergency.all })
    },
  })
}

// ===== Stats =====

export function useEmergencyStats() {
  const { data: plans } = usePeepPlans()
  const { data: equipment } = useEquipmentReadiness()

  return {
    totalPlans: plans?.length ?? 0,
    activePlans: plans?.filter((p) => p.status === 'active').length ?? 0,
    needsReview: plans?.filter((p) => p.status === 'needs_review').length ?? 0,
    totalEquipment: equipment?.length ?? 0,
    operationalEquipment: equipment?.filter((e) => e.status === 'operational').length ?? 0,
    maintenanceNeeded: equipment?.filter((e) => e.status === 'needs_maintenance' || e.status === 'expired').length ?? 0,
  }
}
