import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { GrcRisk, GrcRiskInsert, GrcComplianceRequirement } from '@/types/database'
import type { Risk, ComplianceRequirement, SafetyIncident } from '../types'
import { DEMO_RISKS, DEMO_COMPLIANCE, DEMO_SAFETY } from './demo-data'

// ===== Risks =====

async function fetchRisks(): Promise<Risk[]> {
  if (isDemoMode || !supabase) return DEMO_RISKS

  const { data, error } = await supabase
    .from('grc_risks')
    .select('*')
    .order('risk_score', { ascending: false })

  if (error) throw error
  return (data ?? []).map((r: GrcRisk) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category as Risk['category'],
    likelihood: r.likelihood,
    impact: r.impact,
    riskScore: r.risk_score,
    riskLevel: r.risk_level as Risk['riskLevel'],
    response: r.response_strategy,
    mitigationPlan: r.mitigation_plan ?? '',
    owner: r.owner ?? '',
    status: r.status,
  }))
}

export function useRisks() {
  return useQuery({
    queryKey: queryKeys.grc.risks(),
    queryFn: fetchRisks,
  })
}

export function useCreateRisk() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: GrcRiskInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...data, id: `risk${Date.now()}`, created_at: new Date().toISOString() } as GrcRisk
      }
      const { data: row, error } = await supabase
        .from('grc_risks')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.grc.risks() })
    },
  })
}

// ===== Compliance =====

async function fetchCompliance(): Promise<ComplianceRequirement[]> {
  if (isDemoMode || !supabase) return DEMO_COMPLIANCE

  const { data, error } = await supabase
    .from('grc_compliance_requirements')
    .select('*')
    .order('standard')

  if (error) throw error
  return (data ?? []).map((c: GrcComplianceRequirement) => ({
    id: c.id,
    standard: c.standard,
    clause: c.clause,
    requirement: c.requirement,
    status: c.status,
    evidence: c.evidence ?? '',
    gapAnalysis: c.gap_analysis ?? '',
    remediationPlan: c.remediation_plan ?? '',
    dueDate: c.due_date ?? '',
  }))
}

export function useComplianceRequirements() {
  return useQuery({
    queryKey: queryKeys.grc.compliance(),
    queryFn: fetchCompliance,
  })
}

// ===== Safety Incidents (demo-only until dedicated table) =====

export function useSafetyIncidents() {
  return useQuery({
    queryKey: queryKeys.grc.safety(),
    queryFn: async (): Promise<SafetyIncident[]> => DEMO_SAFETY,
  })
}

// ===== Stats =====

export function useGRCStats() {
  const { data: risks } = useRisks()
  const { data: compliance } = useComplianceRequirements()

  return {
    totalRisks: risks?.length ?? 0,
    highRisks: risks?.filter((r) => r.riskLevel === 'critical' || r.riskLevel === 'high').length ?? 0,
    compliantCount: compliance?.filter((c) => c.status === 'compliant').length ?? 0,
    totalCompliance: compliance?.length ?? 0,
    complianceRate: compliance?.length
      ? Math.round((compliance.filter((c) => c.status === 'compliant').length / compliance.length) * 100)
      : 0,
  }
}
