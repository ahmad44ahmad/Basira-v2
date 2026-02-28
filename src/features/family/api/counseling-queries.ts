import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { FamilyCounselingCase, FamilyCounselingCaseInsert } from '@/types/database'

// ─── Demo Data ──────────────────────────────────────────────────

const DEMO_COUNSELING_CASES: FamilyCounselingCase[] = [
  {
    id: 'cc1',
    beneficiary_id: 'b001',
    referral_date: '2026-01-15',
    medical_diagnosis: 'شلل دماغي تشنجي',
    psychological_diagnosis: 'قلق انفصالي خفيف',
    target_plan_duration: '6months',
    independence_target: 'تحسين مهارات الاعتماد على الذات في الأنشطة اليومية',
    cognitive_target: 'تطوير مهارات التواصل غير اللفظي',
    social_target: 'تحسين التفاعل مع الأقران في البيئة الاجتماعية',
    vocational_target: null,
    pt_target: 'تحسين التوازن والمشي بمسافة 30 متر',
    ot_target: 'ارتداء الملابس وتناول الطعام بشكل مستقل',
    speech_target: 'نطق 15 كلمة جديدة واستخدام جمل بسيطة',
    psych_target: 'تقليل نوبات القلق عند مغادرة الأسرة',
    nutrition_target: 'زيادة الوزن بمعدل 0.5 كجم شهرياً',
    medical_target: 'مراقبة النوبات والتزام بالأدوية',
    beneficiary_engagement: 'engaged',
    family_acceptance: 'الأسرة متعاونة وملتزمة بالخطة العلاجية بشكل كامل',
    family_center_communication: 'تواصل أسبوعي مع الأخصائية الاجتماعية',
    plan_phases: [
      {
        phase: 'المرحلة التمهيدية',
        description: 'تقييم شامل وبناء الثقة مع المستفيد والأسرة',
        steps: ['إجراء التقييم النفسي الشامل', 'مقابلة الأسرة وتحديد الاحتياجات', 'وضع الأهداف التشاركية'],
      },
      {
        phase: 'مرحلة التدخل',
        description: 'تنفيذ البرامج العلاجية والتأهيلية المتخصصة',
        steps: ['جلسات العلاج الطبيعي 3 مرات أسبوعياً', 'جلسات التخاطب مرتين أسبوعياً', 'برنامج الإرشاد الأسري الشهري'],
      },
      {
        phase: 'مرحلة التقييم والمتابعة',
        description: 'تقييم التقدم وتعديل الخطة حسب النتائج',
        steps: ['تقييم شهري للتقدم', 'تعديل الأهداف حسب الاستجابة', 'إعداد تقرير ختامي'],
      },
    ],
    aftercare_visits: [
      { date: '2026-02-10', notes: 'الأسرة ملتزمة بالتمارين المنزلية', status: 'completed' },
      { date: '2026-02-24', notes: 'تحسن ملحوظ في التواصل مع المستفيد', status: 'completed' },
    ],
    housing_type: 'شقة',
    housing_ownership: 'إيجار',
    employment_status: 'موظف حكومي',
    family_disability_count: 1,
    disability_in_family_details: 'المستفيد هو الوحيد ذو الإعاقة في الأسرة',
    interview_date: '2026-01-20',
    interview_location: 'مكتب الإرشاد الأسري',
    interview_parties: 'الأب والأم والأخصائية الاجتماعية',
    interview_duration: '60 دقيقة',
    interview_results: 'الأسرة مستعدة للتعاون الكامل مع الخطة العلاجية',
    satisfaction_score: null,
    visits_score: null,
    integration_score: null,
    programs_score: null,
    interviews_score: null,
    initiatives_score: null,
    status: 'active',
    counselor_name: 'أ. سارة العمري',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'cc2',
    beneficiary_id: 'b002',
    referral_date: '2025-09-01',
    medical_diagnosis: 'متلازمة داون',
    psychological_diagnosis: null,
    target_plan_duration: '1year',
    independence_target: 'تعزيز مهارات العناية الذاتية الكاملة',
    cognitive_target: 'تحسين مهارات القراءة والحساب الأساسية',
    social_target: 'المشاركة الفعالة في الأنشطة الجماعية',
    vocational_target: 'التدريب على مهارات مهنية بسيطة',
    pt_target: 'تحسين اللياقة البدنية والتحمل',
    ot_target: 'إتقان مهارات الحياة اليومية',
    speech_target: 'تحسين وضوح الكلام والمفردات',
    psych_target: null,
    nutrition_target: 'الحفاظ على وزن صحي',
    medical_target: 'فحص دوري للغدة الدرقية والقلب',
    beneficiary_engagement: 'partial',
    family_acceptance: 'الأسرة متقبلة مع بعض التحفظات على برنامج الدمج',
    family_center_communication: 'تواصل شهري مع زيارات دورية',
    plan_phases: [
      {
        phase: 'التقييم الشامل',
        description: 'تقييم جميع الجوانب التطويرية والاجتماعية',
        steps: ['تقييم المهارات الحركية', 'تقييم المهارات المعرفية', 'تقييم المهارات الاجتماعية'],
      },
      {
        phase: 'التأهيل المتكامل',
        description: 'تنفيذ برنامج تأهيلي شامل',
        steps: ['برنامج العلاج الوظيفي', 'برنامج التدريب المهني', 'الأنشطة الترفيهية المنظمة'],
      },
    ],
    aftercare_visits: [
      { date: '2025-10-15', notes: 'زيارة متابعة — تقدم في العناية الذاتية', status: 'completed' },
      { date: '2025-12-20', notes: 'تقييم نصف سنوي — نتائج إيجابية', status: 'completed' },
      { date: '2026-02-15', notes: 'تحسن كبير في المشاركة الاجتماعية', status: 'completed' },
    ],
    housing_type: 'فيلا',
    housing_ownership: 'ملك',
    employment_status: 'متقاعد',
    family_disability_count: 0,
    disability_in_family_details: null,
    interview_date: '2025-09-10',
    interview_location: 'منزل الأسرة',
    interview_parties: 'الأب والأخصائية الاجتماعية والمعالج الوظيفي',
    interview_duration: '90 دقيقة',
    interview_results: 'تم الاتفاق على خطة سنوية شاملة مع مراجعات ربع سنوية',
    satisfaction_score: 8,
    visits_score: 9,
    integration_score: 7,
    programs_score: 8,
    interviews_score: 9,
    initiatives_score: 7,
    status: 'completed',
    counselor_name: 'أ. نورة القحطاني',
    created_at: '2025-09-01T08:00:00Z',
  },
]

// ─── Fetch Functions ────────────────────────────────────────────

async function fetchCounselingCases(): Promise<FamilyCounselingCase[]> {
  if (isDemoMode || !supabase) return DEMO_COUNSELING_CASES

  const { data, error } = await supabase
    .from('family_counseling_cases')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function createCounselingCase(record: FamilyCounselingCaseInsert): Promise<FamilyCounselingCase> {
  if (isDemoMode || !supabase) {
    return {
      id: `cc-${Date.now()}`,
      ...record,
      created_at: new Date().toISOString(),
    } as FamilyCounselingCase
  }

  const { data, error } = await supabase
    .from('family_counseling_cases')
    .insert(record)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Query Hooks ────────────────────────────────────────────────

export function useCounselingCases() {
  return useQuery({
    queryKey: queryKeys.family.counseling(),
    queryFn: fetchCounselingCases,
  })
}

export function useCreateCounselingCase() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCounselingCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.family.counseling() })
    },
  })
}
