import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { ClinicalNote, MultidisciplinaryRound } from '@/types/database'

// ─── Demo Data ──────────────────────────────────────────────────

const now = new Date().toISOString()
const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString()
const twoWeeksAgo = new Date(Date.now() - 14 * 86_400_000).toISOString()

const DEMO_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'cn-001',
    beneficiary_id: 'b001',
    note_date: now.slice(0, 10),
    note_time: '10:00',
    note_type: 'soap',
    discipline: 'doctor',
    subjective: 'يشكو من صداع متكرر منذ 3 أيام مع ارتفاع طفيف في الحرارة',
    objective: 'الحرارة 37.8، ضغط الدم 120/80، احتقان في الجيوب الأنفية',
    assessment: 'التهاب الجيوب الأنفية الحاد',
    plan: 'بدء مضاد حيوي أموكسيسيلين 500 ملغ ثلاث مرات يوميا لمدة 7 أيام، مسكن عند الحاجة',
    diagnosis: 'التهاب الجيوب الأنفية',
    recommendations: 'متابعة بعد أسبوع',
    author_name: 'د. أحمد العتيبي',
    author_role: 'طبيب عام',
    created_at: now,
  },
  {
    id: 'cn-002',
    beneficiary_id: 'b002',
    note_date: weekAgo.slice(0, 10),
    note_time: '14:30',
    note_type: 'progress',
    discipline: 'nursing',
    subjective: 'المستفيد يبدي تحسنا في الشهية بعد بدء العلاج',
    objective: 'العلامات الحيوية مستقرة، لا يوجد ألم',
    assessment: 'تحسن ملحوظ في الحالة العامة',
    plan: 'استمرار على العلاج الحالي',
    diagnosis: null,
    recommendations: null,
    author_name: 'الممرضة فاطمة الزهراني',
    author_role: 'ممرضة',
    created_at: weekAgo,
  },
  {
    id: 'cn-003',
    beneficiary_id: 'b003',
    note_date: twoWeeksAgo.slice(0, 10),
    note_time: '09:15',
    note_type: 'consultation',
    discipline: 'psychology',
    subjective: 'ملاحظة تغيرات سلوكية: زيادة في العزلة والانسحاب الاجتماعي',
    objective: 'التواصل البصري ضعيف، لا يبادر بالتفاعل',
    assessment: 'يحتاج إلى برنامج تعديل سلوك مكثف',
    plan: 'جلسات تعديل سلوك أسبوعية مع متابعة شهرية',
    diagnosis: null,
    recommendations: 'إشراك فريق التمكين في الخطة العلاجية',
    author_name: 'أ. منى القحطاني',
    author_role: 'أخصائية نفسية',
    created_at: twoWeeksAgo,
  },
]

const DEMO_MDT_ROUNDS: MultidisciplinaryRound[] = [
  {
    id: 'mdt-001',
    beneficiary_id: 'b001',
    round_date: now.slice(0, 10),
    round_type: 'planning',
    disciplines: [
      { name: 'طب', representative: 'د. أحمد العتيبي' },
      { name: 'تمريض', representative: 'فاطمة الزهراني' },
      { name: 'علاج طبيعي', representative: 'خالد السبيعي' },
    ],
    active_diagnoses: ['شلل دماغي', 'صرع'],
    current_medications_summary: 'كاربامازبين 200 ملغ مرتين يوميا، أملوديبين 5 ملغ',
    goals: 'تحسين القدرة الحركية والتقليل من نوبات الصرع',
    action_items: [
      { task: 'زيادة جلسات العلاج الطبيعي إلى 3 أسبوعيا', assignee: 'خالد السبيعي', deadline: '2026-03-15' },
      { task: 'متابعة مستوى الدواء في الدم', assignee: 'د. أحمد العتيبي', deadline: '2026-03-10' },
    ],
    coordinator_name: 'د. أحمد العتيبي',
    created_at: now,
  },
  {
    id: 'mdt-002',
    beneficiary_id: 'b003',
    round_date: weekAgo.slice(0, 10),
    round_type: 'review',
    disciplines: [
      { name: 'طب', representative: 'د. سارة الحربي' },
      { name: 'نفسية', representative: 'أ. منى القحطاني' },
      { name: 'نطق وتخاطب', representative: 'هند الشمري' },
    ],
    active_diagnoses: ['توحد', 'إعاقة ذهنية'],
    current_medications_summary: 'ريسبيريدون 1 ملغ مساءً',
    goals: 'تحسين التواصل اللفظي وتقليل السلوكيات النمطية',
    action_items: [
      { task: 'تقييم نفسي شامل', assignee: 'أ. منى القحطاني', deadline: '2026-03-08' },
      { task: 'جلسات نطق مكثفة', assignee: 'هند الشمري', deadline: '2026-03-20' },
    ],
    coordinator_name: 'د. سارة الحربي',
    created_at: weekAgo,
  },
]

// ─── Fetch Functions ────────────────────────────────────────────

async function fetchClinicalNotes(): Promise<ClinicalNote[]> {
  if (isDemoMode || !supabase) return DEMO_CLINICAL_NOTES

  const { data, error } = await supabase
    .from('clinical_notes')
    .select('*')
    .order('note_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

async function fetchMdtRounds(): Promise<MultidisciplinaryRound[]> {
  if (isDemoMode || !supabase) return DEMO_MDT_ROUNDS

  const { data, error } = await supabase
    .from('multidisciplinary_rounds')
    .select('*')
    .order('round_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Hooks ──────────────────────────────────────────────────────

export function useClinicalNotes() {
  return useQuery({
    queryKey: queryKeys.medical.clinicalNotes(),
    queryFn: fetchClinicalNotes,
  })
}

export function useMdtRounds() {
  return useQuery({
    queryKey: queryKeys.medical.mdtRounds(),
    queryFn: fetchMdtRounds,
  })
}
