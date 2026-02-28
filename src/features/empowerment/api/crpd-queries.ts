import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type {
  CRPDSupportAssessment,
  CRPDSupportAssessmentInsert,
  IndependenceBudgetAnalysis,
  IndependenceBudgetAnalysisInsert,
} from '@/types/database'

const now = new Date().toISOString()

// ===== Demo Data =====

const DEMO_CRPD_ASSESSMENTS: CRPDSupportAssessment[] = [
  {
    id: 'crpd1',
    beneficiary_id: 'b001',
    assessment_date: '2026-02-15',
    assessor_name: 'أ. منى الشهري',
    environmental_barriers: [{ type: 'physical', description: 'عدم توفر منحدرات كافية', severity: 'high' }],
    attitudinal_barriers: [{ type: 'stigma', description: 'نظرة مجتمعية سلبية', severity: 'medium' }],
    institutional_barriers: [{ type: 'policy', description: 'غياب سياسة دمج واضحة', severity: 'high' }],
    personal_aspirations: 'الالتحاق بدورة حاسب آلي',
    required_support_services: 'دعم تقني ومواصلات',
    is_plan_codesigned: true,
    participating_stakeholders: 'المستفيد، الأسرة، الأخصائي الاجتماعي',
    created_at: now,
  },
  {
    id: 'crpd2',
    beneficiary_id: 'b002',
    assessment_date: '2026-02-10',
    assessor_name: 'أ. خالد العمري',
    environmental_barriers: [{ type: 'transport', description: 'صعوبة الوصول للمرافق العامة', severity: 'high' }],
    attitudinal_barriers: [],
    institutional_barriers: [{ type: 'training', description: 'نقص برامج التأهيل المهني', severity: 'medium' }],
    personal_aspirations: 'العمل في مجال الحرف اليدوية',
    required_support_services: 'تدريب مهني وتسويق منتجات',
    is_plan_codesigned: true,
    participating_stakeholders: 'المستفيد، مدرب مهني',
    created_at: now,
  },
  {
    id: 'crpd3',
    beneficiary_id: 'b003',
    assessment_date: '2026-01-28',
    assessor_name: 'أ. سارة القحطاني',
    environmental_barriers: [],
    attitudinal_barriers: [{ type: 'family', description: 'عدم تقبل الأسرة لفكرة الاستقلالية', severity: 'high' }],
    institutional_barriers: [],
    personal_aspirations: 'المشاركة في أنشطة رياضية',
    required_support_services: 'دعم نفسي وإرشاد أسري',
    is_plan_codesigned: false,
    participating_stakeholders: 'الأخصائي الاجتماعي فقط',
    created_at: now,
  },
]

const DEMO_BUDGETS: IndependenceBudgetAnalysis[] = [
  {
    id: 'bud1',
    beneficiary_id: 'b001',
    fiscal_year: '2025-2026',
    analysis_date: '2026-01-15',
    dependency_spending: 180000,
    independence_spending: 95000,
    training_budget: 45000,
    community_integration_budget: 30000,
    total_budget: 350000,
    independence_ratio: 0.486,
    recommendations: 'زيادة ميزانية التدريب المهني بنسبة 20%',
    created_at: now,
  },
  {
    id: 'bud2',
    beneficiary_id: 'b001',
    fiscal_year: '2024-2025',
    analysis_date: '2025-01-10',
    dependency_spending: 220000,
    independence_spending: 60000,
    training_budget: 30000,
    community_integration_budget: 15000,
    total_budget: 325000,
    independence_ratio: 0.323,
    recommendations: 'تحويل جزء من ميزانية الإعاشة إلى برامج التمكين',
    created_at: now,
  },
]

// ===== CRPD Assessments =====

async function fetchCRPDAssessments(): Promise<CRPDSupportAssessment[]> {
  if (isDemoMode || !supabase) return DEMO_CRPD_ASSESSMENTS

  const { data, error } = await supabase
    .from('crpd_support_assessments')
    .select('*')
    .order('assessment_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useCRPDAssessments() {
  return useQuery({
    queryKey: queryKeys.empowerment.crpdAssessments(),
    queryFn: fetchCRPDAssessments,
  })
}

export function useCreateCRPDAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CRPDSupportAssessmentInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `crpd${Date.now()}`, created_at: new Date().toISOString() } as CRPDSupportAssessment
      }
      const { data: row, error } = await supabase
        .from('crpd_support_assessments')
        .insert(input)
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

// ===== Independence Budget =====

async function fetchIndependenceBudgets(): Promise<IndependenceBudgetAnalysis[]> {
  if (isDemoMode || !supabase) return DEMO_BUDGETS

  const { data, error } = await supabase
    .from('independence_budget_analysis')
    .select('*')
    .order('analysis_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useIndependenceBudgets() {
  return useQuery({
    queryKey: queryKeys.empowerment.independenceBudget(),
    queryFn: fetchIndependenceBudgets,
  })
}

export function useCreateIndependenceBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: IndependenceBudgetAnalysisInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return {
          ...input,
          id: `bud${Date.now()}`,
          total_budget: input.dependency_spending + input.independence_spending + input.training_budget + input.community_integration_budget,
          independence_ratio: (input.independence_spending + input.training_budget + input.community_integration_budget) /
            (input.dependency_spending + input.independence_spending + input.training_budget + input.community_integration_budget || 1),
          created_at: new Date().toISOString(),
        } as IndependenceBudgetAnalysis
      }
      const { data: row, error } = await supabase
        .from('independence_budget_analysis')
        .insert(input)
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
