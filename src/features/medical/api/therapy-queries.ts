import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { TherapySession, PsychAssessment } from '@/types/database'

// ─── Demo Data ──────────────────────────────────────────────────

const now = new Date().toISOString()
const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()
const twoWeeksAgo = new Date(Date.now() - 14 * 86_400_000).toISOString()

const DEMO_THERAPY_SESSIONS: TherapySession[] = [
  {
    id: 'ts-001',
    beneficiary_id: 'b001',
    session_date: now.slice(0, 10),
    session_time: '10:00',
    therapy_type: 'physical_therapy',
    session_type: 'follow_up',
    assessment_data: {
      rom: 'تحسن في مدى الحركة بنسبة 15%',
      strength: 'قوة العضلات 3/5 الأطراف السفلية',
      balance: 'التوازن في وضع الجلوس: جيد',
    },
    goals: ['تحسين التوازن أثناء الوقوف', 'زيادة مدى حركة الكتف الأيمن'],
    recommendations: 'استمرار التمارين المنزلية مع زيادة التكرار',
    duration_minutes: 45,
    therapist_name: 'خالد السبيعي',
    therapist_role: 'أخصائي علاج طبيعي',
    created_at: now,
  },
  {
    id: 'ts-002',
    beneficiary_id: 'b003',
    session_date: weekAgo.slice(0, 10),
    session_time: '11:30',
    therapy_type: 'speech_therapy',
    session_type: 'initial_evaluation',
    assessment_data: {
      articulation: 'صعوبة في نطق الأحرف: ر، س، ش',
      language: 'المحصول اللغوي أقل من المتوقع لعمره',
      fluency: 'تأتأة خفيفة في بداية الجمل',
    },
    goals: ['تحسين نطق الأحرف الأساسية', 'زيادة المحصول اللغوي', 'تقليل التأتأة'],
    recommendations: 'جلستين أسبوعيا لمدة 3 أشهر مع تمارين منزلية',
    duration_minutes: 30,
    therapist_name: 'هند الشمري',
    therapist_role: 'أخصائية نطق وتخاطب',
    created_at: weekAgo,
  },
  {
    id: 'ts-003',
    beneficiary_id: 'b003',
    session_date: twoWeeksAgo.slice(0, 10),
    session_time: '09:00',
    therapy_type: 'psychology',
    session_type: 'soap_note',
    assessment_data: {
      mood: 'مستقر',
      behavior: 'تحسن في التفاعل الاجتماعي، انخفاض في سلوك العزلة',
      cognition: 'تركيز محدود - 10 دقائق متواصلة',
    },
    goals: ['زيادة فترة التركيز', 'تعزيز المهارات الاجتماعية'],
    recommendations: 'برنامج تعديل سلوك مع تعزيز إيجابي',
    duration_minutes: 50,
    therapist_name: 'أ. منى القحطاني',
    therapist_role: 'أخصائية نفسية',
    created_at: twoWeeksAgo,
  },
]

const DEMO_PSYCH_ASSESSMENTS: PsychAssessment[] = [
  {
    id: 'pa-001',
    beneficiary_id: 'b003',
    assessment_date: now.slice(0, 10),
    assessment_type: 'comprehensive_exam',
    mental_status_exam: {
      appearance: 'مظهر مرتب ومناسب',
      orientation: 'موجه للمكان والأشخاص',
      mood: 'متعاون مع قلق خفيف',
      thought_process: 'منظم مع بطء في المعالجة',
    },
    cognitive_assessment: {
      attention: 'محدود - 10 دقائق',
      memory: 'ذاكرة قصيرة المدى: ضعيفة، بعيدة المدى: متوسطة',
      executive_function: 'صعوبة في التخطيط وحل المشكلات',
    },
    psychological_testing: {
      tool: 'مقياس السلوك التكيفي فاينلاند',
      score: 'أقل من المتوسط في مجالات التواصل والحياة اليومية',
    },
    problem_statement: 'انسحاب اجتماعي وسلوكيات نمطية متكررة',
    short_term_goals: ['تقليل سلوك العزلة خلال 3 أشهر', 'تحسين التواصل البصري'],
    long_term_goals: ['اكتساب مهارات اجتماعية أساسية', 'المشاركة في الأنشطة الجماعية'],
    strategies: ['جلسات فردية أسبوعية', 'برنامج مهارات اجتماعية جماعي', 'تدريب الفريق على التعامل'],
    timeline: '6 أشهر مع مراجعة كل شهرين',
    behavior_type: null,
    antecedent: null,
    consequence: null,
    frequency: null,
    intervention_applied: null,
    result: null,
    clinical_observations: 'المستفيد يظهر قدرات كامنة تحتاج لبيئة محفزة',
    behavioral_improvements: null,
    goals_progress: null,
    current_challenges: 'صعوبة التواصل اللفظي، الانسحاب من الأنشطة الجماعية',
    therapist_name: 'أ. منى القحطاني',
    review_date: '2026-04-28',
    status: 'active',
    created_at: now,
  },
  {
    id: 'pa-002',
    beneficiary_id: 'b001',
    assessment_date: weekAgo.slice(0, 10),
    assessment_type: 'behavior_observation',
    mental_status_exam: null,
    cognitive_assessment: null,
    psychological_testing: null,
    problem_statement: 'نوبات غضب متكررة أثناء تغيير الروتين اليومي',
    short_term_goals: ['تقليل نوبات الغضب من 5 إلى 2 أسبوعيا'],
    long_term_goals: ['تعلم استراتيجيات تهدئة ذاتية'],
    strategies: ['بطاقات جدول بصري', 'تقنية العد التنازلي', 'مكافآت فورية'],
    timeline: '3 أشهر',
    behavior_type: 'نوبات غضب',
    antecedent: 'تغيير مفاجئ في الروتين اليومي',
    consequence: 'انسحاب من النشاط وبكاء',
    frequency: '4-5 مرات أسبوعيا',
    intervention_applied: 'جدول بصري مع تحذير مسبق قبل أي تغيير بـ10 دقائق',
    result: 'تحسن ملحوظ - انخفاض إلى 2-3 مرات أسبوعيا',
    clinical_observations: 'يستجيب بشكل جيد للتحضير المسبق والروتين المرئي',
    behavioral_improvements: 'تحسن بنسبة 40% في إدارة المشاعر',
    goals_progress: { anger_reduction: '60%', self_calming: '35%' },
    current_challenges: 'لا يزال يواجه صعوبة مع التغييرات غير المتوقعة',
    therapist_name: 'أ. منى القحطاني',
    review_date: '2026-04-01',
    status: 'completed',
    created_at: weekAgo,
  },
]

// ─── Fetch Functions ────────────────────────────────────────────

async function fetchTherapySessions(): Promise<TherapySession[]> {
  if (isDemoMode || !supabase) return DEMO_THERAPY_SESSIONS

  const { data, error } = await supabase
    .from('therapy_sessions')
    .select('*')
    .order('session_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function fetchPsychAssessments(): Promise<PsychAssessment[]> {
  if (isDemoMode || !supabase) return DEMO_PSYCH_ASSESSMENTS

  const { data, error } = await supabase
    .from('psych_assessments')
    .select('*')
    .order('assessment_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Hooks ──────────────────────────────────────────────────────

export function useTherapySessions() {
  return useQuery({
    queryKey: queryKeys.medical.therapySessions(),
    queryFn: fetchTherapySessions,
  })
}

export function usePsychAssessments() {
  return useQuery({
    queryKey: queryKeys.medical.psychAssessments(),
    queryFn: fetchPsychAssessments,
  })
}
