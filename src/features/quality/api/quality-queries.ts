import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { GrcNcr, GrcAudit } from '@/types/database'
import type { NCR, AuditCycle, OvrReport } from '../types'
import { DEMO_NCRS, DEMO_AUDITS, DEMO_OVRS } from './demo-data'

// ===== NCRs =====

async function fetchNCRs(): Promise<NCR[]> {
  if (isDemoMode || !supabase) return DEMO_NCRS

  const { data, error } = await supabase
    .from('grc_ncrs')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((f: GrcNcr) => ({
    id: f.id,
    title: f.title,
    description: f.description ?? f.title,
    department: f.category ?? '',
    severity: (f.severity === 'critical' ? 'critical' : f.severity === 'major' ? 'major' : f.severity === 'observation' ? 'observation' : 'minor') as NCR['severity'],
    status: (f.status === 'open' ? 'open' : f.status === 'in_progress' ? 'in_progress' : f.status === 'closed' ? 'closed' : 'investigating') as NCR['status'],
    isoClause: f.category ?? '',
    reportedBy: f.assigned_to ?? '',
    reportedDate: f.created_at,
    dueDate: f.due_date ?? '',
    rootCause: f.root_cause ?? '',
    capas: f.corrective_action ? [{ id: `capa-${f.id}`, description: f.corrective_action, type: 'corrective' as const, assignedTo: f.assigned_to ?? '', status: (f.status === 'closed' ? 'verified' : 'pending') as const, dueDate: f.due_date ?? '' }] : [],
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
    .from('grc_audits')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((a: GrcAudit) => ({
    id: a.id,
    cycleName: a.audit_code ?? `تدقيق ${a.audit_type ?? ''}`,
    cycleYear: a.audit_date ? new Date(a.audit_date).getFullYear() : new Date().getFullYear(),
    cycleQuarter: a.audit_date ? Math.ceil((new Date(a.audit_date).getMonth() + 1) / 3) : 1,
    status: 'completed' as const,
    plannedStartDate: a.audit_date ?? '',
    plannedEndDate: a.audit_date ?? '',
    leadAuditor: a.auditor_name ?? '',
    findings: [],
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
