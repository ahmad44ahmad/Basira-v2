import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { VisualSurveyResponse, VisualSurveyResponseInsert, StressAlert } from '@/types/database'
import { DEMO_SURVEYS, DEMO_STRESS_ALERTS } from './demo-data'

// ===== Visual Surveys =====

async function fetchVisualSurveys(): Promise<VisualSurveyResponse[]> {
  if (isDemoMode || !supabase) return DEMO_SURVEYS

  const { data, error } = await supabase
    .from('visual_survey_responses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useVisualSurveys() {
  return useQuery({
    queryKey: queryKeys.feedback.surveys(),
    queryFn: fetchVisualSurveys,
  })
}

export function useCreateVisualSurvey() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: VisualSurveyResponseInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `srv${Date.now()}`, created_at: new Date().toISOString() } as VisualSurveyResponse
      }
      const { data: row, error } = await supabase
        .from('visual_survey_responses')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.feedback.all })
    },
  })
}

// ===== Stress Alerts =====

async function fetchStressAlerts(): Promise<StressAlert[]> {
  if (isDemoMode || !supabase) return DEMO_STRESS_ALERTS

  const { data, error } = await supabase
    .from('stress_alerts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useStressAlerts() {
  return useQuery({
    queryKey: queryKeys.feedback.stressAlerts(),
    queryFn: fetchStressAlerts,
  })
}

// ===== Stats =====

export function useFeedbackStats() {
  const { data: surveys } = useVisualSurveys()
  const { data: alerts } = useStressAlerts()

  const totalSurveys = surveys?.length ?? 0
  const happyCount = surveys?.filter((s) => s.overall_mood === 'happy').length ?? 0
  const avgFood = totalSurveys
    ? +(surveys!.reduce((s, v) => s + (v.food_rating ?? 0), 0) / totalSurveys).toFixed(1)
    : 0
  const activeAlerts = alerts?.filter((a) => a.status === 'active').length ?? 0

  return {
    totalSurveys,
    satisfactionRate: totalSurveys ? Math.round((happyCount / totalSurveys) * 100) : 0,
    avgFoodRating: avgFood,
    activeStressAlerts: activeAlerts,
  }
}
