import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { StrategicKPI as StrategicKPIRow } from '@/types/database'

// Demo data - empty array since no DB snapshots in demo mode
const DEMO_SNAPSHOTS: StrategicKPIRow[] = []

async function fetchStrategicKPISnapshots(): Promise<StrategicKPIRow[]> {
  if (isDemoMode || !supabase) return DEMO_SNAPSHOTS
  const { data, error } = await supabase
    .from('strategic_kpis')
    .select('*')
    .order('kpi_date', { ascending: false })
    .limit(12)
  if (error) throw error
  return data ?? []
}

export function useStrategicKPISnapshots() {
  return useQuery({
    queryKey: queryKeys.stats.kpis(),
    queryFn: fetchStrategicKPISnapshots,
  })
}
