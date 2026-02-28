import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { FallRiskAssessment, FallRiskAssessmentInsert, RiskAlert } from '@/types/database'
import { DEMO_FALL_RISK_ASSESSMENTS, DEMO_RISK_ALERTS } from './demo-data'

// ===== Fall Risk Assessments =====

async function fetchFallRiskAssessments(): Promise<FallRiskAssessment[]> {
  if (isDemoMode || !supabase) return DEMO_FALL_RISK_ASSESSMENTS

  const { data, error } = await supabase
    .from('fall_risk_assessments')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useFallRiskAssessments() {
  return useQuery({
    queryKey: queryKeys.safety.assessments(),
    queryFn: fetchFallRiskAssessments,
  })
}

export function useCreateFallRiskAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: FallRiskAssessmentInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('fall_risk_assessments')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.safety.all })
    },
  })
}

// ===== Risk Alerts =====

async function fetchRiskAlerts(): Promise<RiskAlert[]> {
  if (isDemoMode || !supabase) return DEMO_RISK_ALERTS

  const { data, error } = await supabase
    .from('risk_alerts')
    .select('*')
    .eq('status', 'نشط')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useRiskAlerts() {
  return useQuery({
    queryKey: queryKeys.safety.alerts(),
    queryFn: fetchRiskAlerts,
  })
}

export function useResolveRiskAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, acknowledgedBy }: { id: string; acknowledgedBy: string }) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { error } = await supabase
        .from('risk_alerts')
        .update({ status: 'resolved', acknowledged_by: acknowledgedBy, resolved_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.safety.all })
    },
  })
}

export function useSafetyStats() {
  const { data: assessments } = useFallRiskAssessments()
  const { data: alerts } = useRiskAlerts()

  return {
    totalAssessments: assessments?.length ?? 0,
    highRisk: assessments?.filter((a) => a.risk_level === 'عالي' || a.risk_level === 'حرج').length ?? 0,
    activeAlerts: alerts?.length ?? 0,
    criticalAlerts: alerts?.filter((a) => a.severity === 'critical' || a.severity === 'high').length ?? 0,
  }
}
