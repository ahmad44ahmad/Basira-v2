import { useQuery } from '@tanstack/react-query'
import { isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { Visit, FeedPost, FamilyUpdate } from '../types'
import { DEMO_VISITS, DEMO_FEED, DEMO_UPDATES } from './demo-data'

// ===== Visits =====
// Note: visits may not have a dedicated table yet — uses demo data

async function fetchVisits(): Promise<Visit[]> {
  if (isDemoMode) return DEMO_VISITS
  return DEMO_VISITS
}

export function useVisits(beneficiaryId?: string) {
  return useQuery({
    queryKey: queryKeys.family.visits(beneficiaryId),
    queryFn: async () => {
      const visits = await fetchVisits()
      return beneficiaryId ? visits.filter((v) => v.beneficiaryId === beneficiaryId) : visits
    },
  })
}

// ===== Feed =====

async function fetchFeed(): Promise<FeedPost[]> {
  if (isDemoMode) return DEMO_FEED
  return DEMO_FEED
}

export function useFamilyFeed() {
  return useQuery({
    queryKey: queryKeys.family.feed(),
    queryFn: fetchFeed,
  })
}

// ===== Updates =====

async function fetchUpdates(): Promise<FamilyUpdate[]> {
  if (isDemoMode) return DEMO_UPDATES
  return DEMO_UPDATES
}

export function useFamilyUpdates(beneficiaryId?: string) {
  return useQuery({
    queryKey: queryKeys.family.updates(beneficiaryId),
    queryFn: async () => {
      const updates = await fetchUpdates()
      return beneficiaryId ? updates.filter((u) => u.beneficiaryId === beneficiaryId) : updates
    },
  })
}
