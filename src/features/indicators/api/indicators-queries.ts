import { useQuery } from '@tanstack/react-query'
import { isDemoMode } from '@/lib/supabase'
import { DEMO_INDICATORS, DEMO_BENCHMARKS, DEMO_HR_STATS, DEMO_ALERTS } from './demo-data'
import type { SmartIndicator, BenchmarkStandard, DepartmentHrStats, DiscrepancyAlert } from '../types'

export function useSmartIndicators() {
  return useQuery({
    queryKey: ['indicators', 'smart'],
    queryFn: async (): Promise<SmartIndicator[]> => DEMO_INDICATORS,
    staleTime: 5 * 60 * 1000,
  })
}

export function useBenchmarks() {
  return useQuery({
    queryKey: ['indicators', 'benchmarks'],
    queryFn: async (): Promise<BenchmarkStandard[]> => DEMO_BENCHMARKS,
    staleTime: 5 * 60 * 1000,
  })
}

export function useHrImpactStats() {
  return useQuery({
    queryKey: ['indicators', 'hr-impact'],
    queryFn: async (): Promise<DepartmentHrStats[]> => DEMO_HR_STATS,
    staleTime: 5 * 60 * 1000,
  })
}

export function useDiscrepancyAlerts() {
  return useQuery({
    queryKey: ['indicators', 'alerts'],
    queryFn: async (): Promise<DiscrepancyAlert[]> => DEMO_ALERTS,
    staleTime: 5 * 60 * 1000,
  })
}
