import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { OmAsset, OmMaintenanceRequest, OmMaintenanceRequestInsert } from '@/types/database'
import type { Asset, MaintenanceRequest, WasteRecord } from '../types'
import { DEMO_ASSETS, DEMO_MAINTENANCE, DEMO_WASTE } from './demo-data'

// ===== Assets =====

async function fetchAssets(): Promise<Asset[]> {
  if (isDemoMode || !supabase) return DEMO_ASSETS

  const { data, error } = await supabase
    .from('om_assets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((a: OmAsset) => ({
    id: a.id,
    assetCode: a.asset_code,
    nameAr: a.name_ar,
    category: 'general',
    assetType: 'fixed' as const,
    building: a.location ?? '',
    status: a.status === 'operational' ? 'active' as const : a.status === 'maintenance' ? 'under_maintenance' as const : 'disposed' as const,
    condition: 'good' as const,
    acquisitionDate: a.purchase_date ?? '',
    acquisitionCost: 0,
    currentBookValue: 0,
    depreciationRate: 10,
    warrantyEnd: a.warranty_expiry ?? '',
  }))
}

export function useAssets() {
  return useQuery({
    queryKey: queryKeys.operations.assets(),
    queryFn: fetchAssets,
  })
}

// ===== Maintenance Requests =====

async function fetchMaintenanceRequests(): Promise<MaintenanceRequest[]> {
  if (isDemoMode || !supabase) return DEMO_MAINTENANCE

  const { data, error } = await supabase
    .from('om_maintenance_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((r: OmMaintenanceRequest) => ({
    id: r.id,
    requestNumber: r.request_number,
    title: r.title,
    description: r.description ?? '',
    requestType: 'corrective' as const,
    priority: r.priority as MaintenanceRequest['priority'],
    status: r.status as MaintenanceRequest['status'],
    reportedBy: r.requested_by ?? '',
    assignedTo: r.assigned_to ?? '',
    reportedDate: r.created_at,
    actualCompletion: r.completed_at ?? '',
    estimatedCost: r.cost ?? 0,
  }))
}

export function useMaintenanceRequests() {
  return useQuery({
    queryKey: queryKeys.operations.maintenance(),
    queryFn: fetchMaintenanceRequests,
  })
}

export function useCreateMaintenanceRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: OmMaintenanceRequestInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...data, id: `maint${Date.now()}`, created_at: new Date().toISOString() } as OmMaintenanceRequest
      }
      const { data: row, error } = await supabase
        .from('om_maintenance_requests')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.operations.maintenance() })
    },
  })
}

export function useUpdateMaintenanceStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return
      }
      const { error } = await supabase
        .from('om_maintenance_requests')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.operations.maintenance() })
    },
  })
}

// ===== Waste Records (no dedicated table, demo only for now) =====

export function useWasteRecords() {
  return useQuery({
    queryKey: queryKeys.operations.waste(),
    queryFn: async (): Promise<WasteRecord[]> => DEMO_WASTE,
  })
}

// ===== Stats =====

export function useOperationsStats() {
  const { data: assets } = useAssets()
  const { data: maintenance } = useMaintenanceRequests()

  return {
    totalAssets: assets?.length ?? 0,
    operationalAssets: assets?.filter((a) => a.status === 'active').length ?? 0,
    openRequests: maintenance?.filter((m) => m.status === 'pending' || m.status === 'in_progress').length ?? 0,
    totalMaintenanceCost: maintenance?.reduce((s, m) => s + (m.estimatedCost ?? 0), 0) ?? 0,
  }
}
