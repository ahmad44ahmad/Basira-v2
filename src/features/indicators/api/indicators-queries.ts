import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { isDemoMode } from '@/lib/supabase'
import { DEMO_INDICATORS, DEMO_BENCHMARKS, DEMO_HR_STATS, DEMO_ALERTS } from './demo-data'
import type { SmartIndicator, BenchmarkStandard, DepartmentHrStats, DiscrepancyAlert } from '../types'

export function useSmartIndicators() {
  return useQuery({
    queryKey: queryKeys.indicators.smart(),
    queryFn: async (): Promise<SmartIndicator[]> => DEMO_INDICATORS,
  })
}

export function useBenchmarks() {
  return useQuery({
    queryKey: queryKeys.indicators.benchmarks(),
    queryFn: async (): Promise<BenchmarkStandard[]> => DEMO_BENCHMARKS,
  })
}

export function useHrImpactStats() {
  return useQuery({
    queryKey: queryKeys.indicators.hrImpact(),
    queryFn: async (): Promise<DepartmentHrStats[]> => DEMO_HR_STATS,
  })
}

export function useDiscrepancyAlerts() {
  return useQuery({
    queryKey: queryKeys.indicators.alerts(),
    queryFn: async (): Promise<DiscrepancyAlert[]> => DEMO_ALERTS,
  })
}
