import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { AbuseReport, AbuseReportInsert } from '@/types/database'

const now = new Date().toISOString()

// ===== Demo Data =====

const DEMO_ABUSE_REPORTS: AbuseReport[] = [
  {
    id: 'ab001',
    beneficiary_id: 'b001',
    report_date: '2026-01-20',
    report_time: '14:30',
    abuse_type: 'neglect',
    severity: 'minor',
    description: 'تأخر في تقديم وجبة الغداء للمستفيد بسبب خطأ في جدول التوزيع',
    location_in_facility: 'جناح ذكور A — غرفة 103',
    perpetrator_type: 'staff',
    perpetrator_name: null,
    immediate_actions: [
      'تقديم الوجبة فوراً للمستفيد',
      'إبلاغ مشرف الوردية',
      'مراجعة جدول توزيع الوجبات',
    ],
    medical_examination_done: false,
    medical_report: null,
    beneficiary_separated: false,
    investigation_status: 'resolved',
    investigator_name: 'أ. خالد المطيري',
    investigation_notes: 'تم تصحيح الخطأ في نظام الجدولة وتم إجراء تنبيه للفريق',
    follow_up_actions: [
      { action: 'تحديث جدول توزيع الوجبات', status: 'completed', date: '2026-01-21' },
      { action: 'تدريب الفريق على إجراءات التحقق', status: 'completed', date: '2026-01-25' },
    ],
    authority_notified: false,
    authority_reference: null,
    reported_by: 'أ. سعاد الزهراني',
    witness_names: ['أ. نورة العتيبي'],
    created_at: now,
  },
  {
    id: 'ab002',
    beneficiary_id: 'b002',
    report_date: '2026-02-10',
    report_time: '09:15',
    abuse_type: 'psychological',
    severity: 'moderate',
    description: 'رصد استخدام أسلوب تخويف لفظي مع المستفيد أثناء توجيهه للقيام بنشاط يومي',
    location_in_facility: 'قاعة الأنشطة',
    perpetrator_type: 'staff',
    perpetrator_name: null,
    immediate_actions: [
      'إبعاد الموظف عن المستفيد فوراً',
      'تهدئة المستفيد والتأكد من حالته النفسية',
      'إبلاغ الأخصائي النفسي',
    ],
    medical_examination_done: true,
    medical_report: 'لا توجد علامات جسدية — حالة قلق خفيفة تم التعامل معها',
    beneficiary_separated: true,
    investigation_status: 'investigating',
    investigator_name: 'أ. ريم الدوسري',
    investigation_notes: 'جاري أخذ إفادات الشهود ومراجعة كاميرات المراقبة',
    follow_up_actions: [
      { action: 'جلسة دعم نفسي للمستفيد', status: 'completed', date: '2026-02-10' },
      { action: 'تحقيق إداري مع الموظف', status: 'in_progress', date: '2026-02-12' },
      { action: 'مراجعة سياسة التعامل مع المستفيدين', status: 'pending', date: null },
    ],
    authority_notified: false,
    authority_reference: null,
    reported_by: 'أ. منى الحربي',
    witness_names: ['أ. فاطمة الشمري', 'أ. عبدالله القرني'],
    created_at: now,
  },
  {
    id: 'ab003',
    beneficiary_id: 'b003',
    report_date: '2026-02-25',
    report_time: '22:45',
    abuse_type: 'physical',
    severity: 'severe',
    description: 'تم رصد كدمات على ذراع المستفيد أثناء الفحص الليلي — مصدرها مجهول',
    location_in_facility: 'جناح إناث B — غرفة 207',
    perpetrator_type: 'unknown',
    perpetrator_name: null,
    immediate_actions: [
      'فحص طبي فوري وتوثيق الإصابات بالصور',
      'إبلاغ مدير المركز',
      'عزل المستفيد في غرفة آمنة',
      'مراجعة كاميرات المراقبة',
    ],
    medical_examination_done: true,
    medical_report: 'كدمات متعددة على الذراع الأيمن — لا كسور — تم التوثيق الفوتوغرافي',
    beneficiary_separated: true,
    investigation_status: 'referred_to_authorities',
    investigator_name: 'أ. ريم الدوسري',
    investigation_notes: 'تم تحويل القضية للجنة حماية الطفل — تحقيق داخلي مستمر بالتوازي',
    follow_up_actions: [
      { action: 'إبلاغ وزارة الموارد البشرية', status: 'completed', date: '2026-02-26' },
      { action: 'تقرير مفصل للجنة الحماية', status: 'completed', date: '2026-02-26' },
      { action: 'متابعة طبية يومية للمستفيد', status: 'in_progress', date: '2026-02-25' },
      { action: 'تحقيق داخلي شامل', status: 'in_progress', date: '2026-02-25' },
    ],
    authority_notified: true,
    authority_reference: 'HRSD-REF-2026-0842',
    reported_by: 'أ. هند السبيعي',
    witness_names: [],
    created_at: now,
  },
]

// ===== Abuse Reports =====

async function fetchAbuseReports(): Promise<AbuseReport[]> {
  if (isDemoMode || !supabase) return DEMO_ABUSE_REPORTS

  const { data, error } = await supabase
    .from('abuse_reports')
    .select('*')
    .order('report_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useAbuseReports() {
  return useQuery({
    queryKey: queryKeys.grc.abuseReports(),
    queryFn: fetchAbuseReports,
  })
}

export function useCreateAbuseReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: AbuseReportInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('abuse_reports')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.grc.abuseReports() })
    },
  })
}
