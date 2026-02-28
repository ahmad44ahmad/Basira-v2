import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { IpcInspection, IpcInspectionInsert, IpcIncident, IpcIncidentInsert, IpcImmunization } from '@/types/database'
import { DEMO_INSPECTIONS, DEMO_INCIDENTS, DEMO_IMMUNIZATIONS } from './demo-data'

// ===== Inspections =====

async function fetchInspections(): Promise<IpcInspection[]> {
  if (isDemoMode || !supabase) return DEMO_INSPECTIONS

  const { data, error } = await supabase
    .from('ipc_inspections')
    .select('*')
    .order('inspection_date', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export function useIPCInspections() {
  return useQuery({
    queryKey: queryKeys.ipc.inspections(),
    queryFn: fetchInspections,
  })
}

export function useCreateIPCInspection() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: IpcInspectionInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('ipc_inspections')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.ipc.inspections() })
    },
  })
}

// ===== Incidents =====

async function fetchIncidents(): Promise<IpcIncident[]> {
  if (isDemoMode || !supabase) return DEMO_INCIDENTS

  const { data, error } = await supabase
    .from('ipc_incidents')
    .select('*')
    .order('detection_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useIPCIncidents() {
  return useQuery({
    queryKey: queryKeys.ipc.incidents(),
    queryFn: fetchIncidents,
  })
}

export function useCreateIPCIncident() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: IpcIncidentInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('ipc_incidents')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.ipc.incidents() })
    },
  })
}

// ===== Immunizations =====

async function fetchImmunizations(): Promise<IpcImmunization[]> {
  if (isDemoMode || !supabase) return DEMO_IMMUNIZATIONS

  const { data, error } = await supabase
    .from('immunizations')
    .select('*')
    .order('date_administered', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useIPCImmunizations() {
  return useQuery({
    queryKey: queryKeys.ipc.immunizations(),
    queryFn: fetchImmunizations,
  })
}

// ===== Stats =====

export function useIPCStats() {
  const { data: inspections } = useIPCInspections()
  const { data: incidents } = useIPCIncidents()
  const { data: immunizations } = useIPCImmunizations()

  const avgCompliance = inspections?.length
    ? Math.round(inspections.reduce((s, i) => s + i.compliance_score, 0) / inspections.length)
    : 0

  return {
    totalInspections: inspections?.length ?? 0,
    avgCompliance,
    activeIncidents: incidents?.filter((i) => i.status !== 'closed' && i.status !== 'resolved').length ?? 0,
    totalImmunizations: immunizations?.length ?? 0,
  }
}
