import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { TrainingReferral, TrainingReferralInsert, TrainingEvaluation, TrainingEvaluationInsert } from '@/types/database'

const now = new Date().toISOString()

// ===== Demo Data =====

const DEMO_TRAINING_REFERRALS: TrainingReferral[] = [
  {
    id: 'tr001',
    beneficiary_id: 'b001',
    referral_date: '2026-01-15',
    medical_diagnosis: 'شلل دماغي — تشنجي ثنائي',
    psychological_diagnosis: 'تأخر نمائي شامل',
    assistive_devices: 'كرسي متحرك يدوي',
    referral_goals: ['تحسين المهارات الحركية', 'تطوير مهارات التواصل'],
    skills_assessment: {
      self_care: 'partial',
      communication: 'good',
      cognitive: 'developing',
      performance: 'basic',
    },
    referred_by: 'أ. عادل العلي',
    received_by: 'أ. سارة القحطاني',
    supervisor_name: 'د. محمد الشهري',
    created_at: now,
  },
  {
    id: 'tr002',
    beneficiary_id: 'b002',
    referral_date: '2026-02-01',
    medical_diagnosis: 'متلازمة داون',
    psychological_diagnosis: null,
    assistive_devices: null,
    referral_goals: ['التدريب على العناية الذاتية', 'التأهيل المهني', 'تحسين السلوك الاجتماعي'],
    skills_assessment: {
      self_care: 'independent',
      communication: 'partial',
      cognitive: 'basic',
      performance: 'developing',
    },
    referred_by: 'أ. نور العمري',
    received_by: 'أ. فهد الحربي',
    supervisor_name: 'د. خالد العتيبي',
    created_at: now,
  },
]

const DEMO_TRAINING_EVALUATIONS: TrainingEvaluation[] = [
  {
    id: 'te001',
    beneficiary_id: 'b001',
    evaluation_type: 'semi_annual',
    evaluation_date: '2026-02-15',
    evaluator_name: 'أ. سارة القحطاني',
    sections: [
      {
        section_name: 'المهارات الحركية الدقيقة',
        max_score: 30,
        items: [
          { name: 'الإمساك بالأشياء', score: 6, max: 10 },
          { name: 'التنسيق بين اليد والعين', score: 5, max: 10 },
          { name: 'الكتابة والرسم', score: 4, max: 10 },
        ],
      },
      {
        section_name: 'المهارات الاجتماعية',
        max_score: 20,
        items: [
          { name: 'التفاعل مع الأقران', score: 7, max: 10 },
          { name: 'اتباع التعليمات', score: 6, max: 10 },
        ],
      },
      {
        section_name: 'العناية الذاتية',
        max_score: 20,
        items: [
          { name: 'النظافة الشخصية', score: 5, max: 10 },
          { name: 'تناول الطعام', score: 7, max: 10 },
        ],
      },
    ],
    total_score: 40,
    max_total: 70,
    percentage: 57,
    notes: 'تحسن ملحوظ في المهارات الاجتماعية مقارنة بالتقييم السابق',
    created_at: now,
  },
  {
    id: 'te002',
    beneficiary_id: 'b002',
    evaluation_type: 'training_performance',
    evaluation_date: '2026-02-20',
    evaluator_name: 'أ. فهد الحربي',
    sections: [
      {
        section_name: 'مهارات العمل',
        max_score: 40,
        items: [
          { name: 'الالتزام بالمواعيد', score: 9, max: 10 },
          { name: 'إتمام المهام', score: 7, max: 10 },
          { name: 'جودة العمل', score: 6, max: 10 },
          { name: 'التعاون مع الزملاء', score: 8, max: 10 },
        ],
      },
      {
        section_name: 'المهارات الحياتية',
        max_score: 30,
        items: [
          { name: 'إدارة الوقت', score: 7, max: 10 },
          { name: 'حل المشكلات', score: 5, max: 10 },
          { name: 'التواصل الفعّال', score: 6, max: 10 },
        ],
      },
    ],
    total_score: 48,
    max_total: 70,
    percentage: 69,
    notes: 'أداء جيد في بيئة العمل التدريبية — يحتاج دعم إضافي في حل المشكلات',
    created_at: now,
  },
]

// ===== Training Referrals =====

async function fetchTrainingReferrals(): Promise<TrainingReferral[]> {
  if (isDemoMode || !supabase) return DEMO_TRAINING_REFERRALS

  const { data, error } = await supabase
    .from('training_referrals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useTrainingReferrals() {
  return useQuery({
    queryKey: queryKeys.empowerment.trainingReferrals(),
    queryFn: fetchTrainingReferrals,
  })
}

export function useCreateTrainingReferral() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: TrainingReferralInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('training_referrals')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.empowerment.trainingReferrals() })
    },
  })
}

// ===== Training Evaluations =====

async function fetchTrainingEvaluations(): Promise<TrainingEvaluation[]> {
  if (isDemoMode || !supabase) return DEMO_TRAINING_EVALUATIONS

  const { data, error } = await supabase
    .from('training_evaluations')
    .select('*')
    .order('evaluation_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useTrainingEvaluations() {
  return useQuery({
    queryKey: queryKeys.empowerment.trainingEvaluations(),
    queryFn: fetchTrainingEvaluations,
  })
}

export function useCreateTrainingEvaluation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: TrainingEvaluationInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('training_evaluations')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.empowerment.trainingEvaluations() })
    },
  })
}
