import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { SocialResearch } from '@/types/database'
import type { LeaveRequest, SocialActivity } from '../types'
import { DEMO_RESEARCHES, DEMO_LEAVES, DEMO_ACTIVITIES } from './demo-data'

// ===== Social Research =====

async function fetchSocialResearches(): Promise<SocialResearch[]> {
  if (isDemoMode || !supabase) return DEMO_RESEARCHES as unknown as SocialResearch[]

  const { data, error } = await supabase
    .from('social_research')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useSocialResearches() {
  return useQuery({
    queryKey: queryKeys.social.researches(),
    queryFn: fetchSocialResearches,
  })
}

// ===== Leave Requests =====
// Note: leaves may not have a dedicated table yet — uses demo data with local state

async function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  if (isDemoMode || !supabase) return DEMO_LEAVES
  // If a leaves table exists, query it here
  return DEMO_LEAVES
}

export function useLeaveRequests() {
  return useQuery({
    queryKey: queryKeys.social.leaves(),
    queryFn: fetchLeaveRequests,
  })
}

export function useUpdateLeaveStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (_update: { id: string; status: string }) => {
      // When leave table exists, update here
      await new Promise((r) => setTimeout(r, 300))
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.leaves() })
    },
  })
}

// ===== Activities =====

async function fetchActivities(): Promise<SocialActivity[]> {
  if (isDemoMode || !supabase) return DEMO_ACTIVITIES
  return DEMO_ACTIVITIES
}

export function useSocialActivities() {
  return useQuery({
    queryKey: queryKeys.social.activities(),
    queryFn: fetchActivities,
  })
}
