import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { StaffWellbeingScore, StaffWellbeingScoreInsert } from '@/types/database'

const DEMO_WELLBEING: StaffWellbeingScore[] = [
  {
    id: 'sw001',
    employee_id: 'e001',
    employee_name: 'محمد أحمد العلي',
    assessment_date: '2026-02-28',
    mbi_ee_score: 22,
    mbi_dp_score: 8,
    overtime_ratio: 0.15,
    consecutive_shifts: 3,
    sick_leave_count: 1,
    proqol_burnout_score: 28,
    case_severity_exposure: 0.4,
    composite_score: 35,
    risk_level: 'green',
    intervention_notes: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sw002',
    employee_id: 'e002',
    employee_name: 'فاطمة خالد المالكي',
    assessment_date: '2026-02-28',
    mbi_ee_score: 30,
    mbi_dp_score: 12,
    overtime_ratio: 0.35,
    consecutive_shifts: 5,
    sick_leave_count: 3,
    proqol_burnout_score: 38,
    case_severity_exposure: 0.7,
    composite_score: 62,
    risk_level: 'orange',
    intervention_notes: 'تنبيه المشرف — جلسة رفاهية مجدولة',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sw003',
    employee_id: 'e003',
    employee_name: 'عادل محمد السالم',
    assessment_date: '2026-02-28',
    mbi_ee_score: 18,
    mbi_dp_score: 5,
    overtime_ratio: 0.1,
    consecutive_shifts: 2,
    sick_leave_count: 0,
    proqol_burnout_score: 20,
    case_severity_exposure: 0.3,
    composite_score: 22,
    risk_level: 'green',
    intervention_notes: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sw004',
    employee_id: 'e004',
    employee_name: 'نورة سعد الحربي',
    assessment_date: '2026-02-28',
    mbi_ee_score: 35,
    mbi_dp_score: 15,
    overtime_ratio: 0.45,
    consecutive_shifts: 7,
    sick_leave_count: 4,
    proqol_burnout_score: 45,
    case_severity_exposure: 0.85,
    composite_score: 82,
    risk_level: 'red',
    intervention_notes: 'تدخّل فوري — تخفيف أعباء العمل ومقابلة عاجلة',
    created_at: new Date().toISOString(),
  },
]

async function fetchStaffWellbeing(): Promise<StaffWellbeingScore[]> {
  if (isDemoMode || !supabase) return DEMO_WELLBEING

  const { data, error } = await supabase
    .from('staff_wellbeing_scores')
    .select('*')
    .order('assessment_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useStaffWellbeing() {
  return useQuery({
    queryKey: queryKeys.staffWellbeing.scores(),
    queryFn: fetchStaffWellbeing,
  })
}

export function useCreateWellbeingScore() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: StaffWellbeingScoreInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...data, id: `sw${Date.now()}`, created_at: new Date().toISOString() } as StaffWellbeingScore
      }
      const { data: row, error } = await supabase
        .from('staff_wellbeing_scores')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.staffWellbeing.all })
    },
  })
}

export function useWellbeingStats() {
  const { data: scores } = useStaffWellbeing()

  return {
    totalAssessed: scores?.length ?? 0,
    greenCount: scores?.filter((s) => s.risk_level === 'green').length ?? 0,
    yellowCount: scores?.filter((s) => s.risk_level === 'yellow').length ?? 0,
    orangeCount: scores?.filter((s) => s.risk_level === 'orange').length ?? 0,
    redCount: scores?.filter((s) => s.risk_level === 'red').length ?? 0,
    avgScore: scores?.length
      ? Math.round(scores.reduce((sum, s) => sum + (s.composite_score ?? 0), 0) / scores.length)
      : 0,
  }
}
