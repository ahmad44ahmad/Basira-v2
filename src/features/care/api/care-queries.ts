import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { DailyCareLog, DailyCareLogInsert } from '@/types/database'
import type { ShiftHandoverItem } from '../types'
import { DEMO_CARE_LOGS, DEMO_HANDOVER_ITEMS } from './demo-data'

// ===== Daily Care Logs =====

async function fetchDailyCareLogs(): Promise<DailyCareLog[]> {
  if (isDemoMode || !supabase) return DEMO_CARE_LOGS

  const { data, error } = await supabase
    .from('daily_care_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return data ?? []
}

export function useDailyCareLogs() {
  return useQuery({
    queryKey: queryKeys.care.logs(),
    queryFn: fetchDailyCareLogs,
  })
}

export function useCreateDailyCareLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: DailyCareLogInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...data, id: `dcl${Date.now()}`, created_at: new Date().toISOString() } as DailyCareLog
      }
      const { data: row, error } = await supabase
        .from('daily_care_logs')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.care.all })
    },
  })
}

// ===== Shift Handover Items =====
// Note: handover items use shift_handover_reports table for reports,
// but individual items are stored as local state with demo data fallback.
// When a real handover_items table exists, this can be switched.

async function fetchHandoverItems(): Promise<ShiftHandoverItem[]> {
  if (isDemoMode || !supabase) return DEMO_HANDOVER_ITEMS

  // Query shift_handover_reports and transform to items
  const { data, error } = await supabase
    .from('shift_handover_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  // Transform reports into displayable items
  return (data ?? []).map((r) => ({
    id: r.id,
    category: (r.critical_count > 0 ? 'critical' : 'care') as ShiftHandoverItem['category'],
    title: `تسليم ${r.outgoing_shift} → ${r.incoming_shift}`,
    description: r.summary_incidents ?? `${r.stable_count} مستقر، ${r.needs_attention_count} يحتاج متابعة، ${r.critical_count} حرج`,
    priority: (r.critical_count > 0 ? 'high' : 'medium') as ShiftHandoverItem['priority'],
    shiftType: r.outgoing_shift as ShiftHandoverItem['shiftType'],
    status: 'active' as const,
    createdAt: r.created_at,
    createdBy: r.section,
  }))
}

export function useHandoverItems() {
  return useQuery({
    queryKey: queryKeys.care.handoverAll(),
    queryFn: fetchHandoverItems,
  })
}

export function useCareStats() {
  const { data: logs } = useDailyCareLogs()
  const today = new Date().toISOString().slice(0, 10)
  const todayLogs = logs?.filter((l) => l.shift_date === today) ?? []

  return {
    totalLogs: logs?.length ?? 0,
    todayLogs: todayLogs.length,
    requiresFollowup: todayLogs.filter((l) => l.incidents).length,
    avgTemperature: todayLogs.length
      ? +(todayLogs.reduce((sum, l) => sum + (l.temperature ?? 0), 0) / todayLogs.length).toFixed(1)
      : 0,
  }
}
