import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { RehabGoal, RehabGoalInsert, BeneficiaryPreferences } from '@/types/database'
import type { GoalProgressLog, DignityProfile } from '../types'
import { DEMO_GOALS, DEMO_LOGS, DEMO_DIGNITY } from './demo-data'

// ===== Rehab Goals =====

async function fetchRehabGoals(): Promise<RehabGoal[]> {
  if (isDemoMode || !supabase) return DEMO_GOALS as unknown as RehabGoal[]

  const { data, error } = await supabase
    .from('rehab_goals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useRehabGoals(beneficiaryId?: string) {
  return useQuery({
    queryKey: queryKeys.empowerment.goals(beneficiaryId),
    queryFn: async () => {
      const goals = await fetchRehabGoals()
      return beneficiaryId ? goals.filter((g) => g.beneficiary_id === beneficiaryId) : goals
    },
  })
}

export function useCreateRehabGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: RehabGoalInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('rehab_goals')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.empowerment.all })
    },
  })
}

// ===== Goal Progress Logs =====

async function fetchProgressLogs(goalId: string): Promise<GoalProgressLog[]> {
  if (isDemoMode || !supabase) return DEMO_LOGS.filter((l) => l.goalId === goalId)

  const { data, error } = await supabase
    .from('goal_progress_logs')
    .select('*')
    .eq('goal_id', goalId)
    .order('recorded_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((r) => ({
    id: r.id,
    goalId: r.goal_id,
    date: r.recorded_at,
    value: r.recorded_value ?? 0,
    note: r.progress_note ?? '',
    recordedBy: r.recorded_by ?? '',
  }))
}

export function useGoalProgressLogs(goalId: string) {
  return useQuery({
    queryKey: queryKeys.empowerment.progressLogs(goalId),
    queryFn: () => fetchProgressLogs(goalId),
    enabled: !!goalId,
  })
}

// ===== Dignity Profile =====

async function fetchDignityProfile(beneficiaryId: string): Promise<DignityProfile | null> {
  if (isDemoMode || !supabase) return DEMO_DIGNITY

  const { data, error } = await supabase
    .from('beneficiary_preferences')
    .select('*')
    .eq('beneficiary_id', beneficiaryId)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  if (!data) return null

  return {
    id: data.id,
    beneficiaryId: data.beneficiary_id,
    preferredName: data.preferred_name ?? '',
    communicationStyle: data.communication_style ?? '',
    likes: data.preferred_activities ?? [],
    dislikes: [],
    strengths: data.strengths ?? [],
    motivators: data.motivators ?? [],
    calmingStrategies: data.calming_strategies ?? [],
    dreams: data.my_dreams ?? '',
  }
}

export function useDignityProfile(beneficiaryId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.empowerment.dignityProfile(beneficiaryId!),
    queryFn: () => fetchDignityProfile(beneficiaryId!),
    enabled: !!beneficiaryId,
  })
}

// ===== Stats =====

export function useEmpowermentStats() {
  const { data: goals } = useRehabGoals()

  return {
    totalGoals: goals?.length ?? 0,
    activeGoals: goals?.filter((g) => g.status === 'active').length ?? 0,
    achievedGoals: goals?.filter((g) => g.status === 'achieved').length ?? 0,
    avgProgress: goals?.length
      ? Math.round(goals.reduce((s, g) => s + g.progress_percentage, 0) / goals.length)
      : 0,
  }
}
