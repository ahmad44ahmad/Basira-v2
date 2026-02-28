import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { InternalAuditCycle, AuditFinding } from '@/types/database'
import type { NCR, AuditCycle, OvrReport } from '../types'
import { DEMO_NCRS, DEMO_AUDITS, DEMO_OVRS } from './demo-data'

// ===== NCRs =====
// NCRs come from audit_findings with finding_type = 'major_nc' or 'minor_nc'

async function fetchNCRs(): Promise<NCR[]> {
  if (isDemoMode || !supabase) return DEMO_NCRS

  const { data, error } = await supabase
    .from('audit_findings')
    .select('*')
    .in('finding_type', ['major_nc', 'minor_nc'])
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((f: AuditFinding) => ({
    id: f.id,
    code: f.finding_code ?? f.id.slice(0, 8),
    title: f.description,
    department: f.iso_clause ?? '',
    severity: f.finding_type === 'major_nc' ? 'major' : 'minor',
    status: f.status === 'open' ? 'open' : f.status === 'in_progress' ? 'in_progress' : f.status === 'verified' ? 'verified' : 'closed',
    isoClause: f.iso_clause ?? '',
    identifiedDate: f.created_at,
    dueDate: f.due_date ?? '',
    assignedTo: f.responsible_person ?? '',
    rootCause: f.root_cause ?? '',
    capas: f.corrective_action ? [{ id: `capa-${f.id}`, description: f.corrective_action, type: 'corrective' as const, status: f.status === 'verified' ? 'verified' as const : 'open' as const, dueDate: f.due_date ?? '' }] : [],
  }))
}

export function useNCRs() {
  return useQuery({
    queryKey: queryKeys.quality.ncrs(),
    queryFn: fetchNCRs,
  })
}

// ===== Audit Cycles =====

async function fetchAuditCycles(): Promise<AuditCycle[]> {
  if (isDemoMode || !supabase) return DEMO_AUDITS

  const { data, error } = await supabase
    .from('internal_audit_cycles')
    .select('*, internal_audits(*, audit_findings(*))')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((c: InternalAuditCycle & { internal_audits?: Array<{ audit_findings?: AuditFinding[] }> }) => ({
    id: c.id,
    cycleName: c.cycle_name,
    year: c.cycle_year,
    quarter: c.cycle_quarter ?? 1,
    status: c.status,
    startDate: c.planned_start_date ?? '',
    endDate: c.planned_end_date ?? '',
    leadAuditor: c.lead_auditor ?? '',
    totalAudits: c.internal_audits?.length ?? 0,
    completedAudits: c.internal_audits?.filter((a: { status?: string }) => a.status === 'completed').length ?? 0,
    findings: (c.internal_audits ?? []).flatMap((a: { audit_findings?: AuditFinding[] }) =>
      (a.audit_findings ?? []).map((f) => ({
        id: f.id,
        type: f.finding_type,
        description: f.description,
        isoClause: f.iso_clause ?? '',
        status: f.status,
      })),
    ),
  }))
}

export function useAuditCycles() {
  return useQuery({
    queryKey: queryKeys.quality.cycles(),
    queryFn: fetchAuditCycles,
  })
}

// ===== OVR Reports (demo-only for now) =====

export function useOVRReports() {
  return useQuery({
    queryKey: [...queryKeys.quality.all, 'ovrs'] as const,
    queryFn: async (): Promise<OvrReport[]> => DEMO_OVRS,
  })
}

// ===== Stats =====

export function useQualityStats() {
  const { data: ncrs } = useNCRs()
  const { data: audits } = useAuditCycles()

  return {
    openNCRs: ncrs?.filter((n) => n.status === 'open' || n.status === 'in_progress').length ?? 0,
    totalNCRs: ncrs?.length ?? 0,
    auditCycles: audits?.length ?? 0,
    completionRate: audits?.length
      ? Math.round((audits.filter((a) => a.status === 'completed').length / audits.length) * 100)
      : 0,
  }
}
