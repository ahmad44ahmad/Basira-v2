import { useMemo } from 'react'
import { useBeneficiaries } from '@/features/beneficiaries'
import type { UnifiedBeneficiaryProfile } from '@/features/beneficiaries'
import { useMoodTelemetry } from '@/features/feedback'
import { useDailyMeals } from '@/features/catering'
import { useEpilepsyTracking, useStaffWellbeing } from '@/features/care'
import { useVisitRecords } from '@/features/family'
import { useAbuseReports } from '@/features/grc'
import { useDentalRecords } from '@/features/dental'
import type { MoodBraceletTelemetry, EpilepsyTracking, VisitRecord, AbuseReport, StaffWellbeingScore, DentalRecord } from '@/types/database'
import type { DailyMeal } from '@/features/catering'

// ── Types ───────────────────────────────────────────────────────

export type AlertCategory = 'clinical' | 'empowerment' | 'quality'
export type AlertSeverity = 'warning' | 'critical'

export interface IntelligenceAlert {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  category: AlertCategory
  severity: AlertSeverity
  title: string
  description: string
  detectedAt: string
  relatedDomains: string[]
}

export interface CrossDomainIntelligenceResult {
  alerts: IntelligenceAlert[]
  isLoading: boolean
  beneficiaryMap: Map<string, UnifiedBeneficiaryProfile>
}

// ── HashMap Builder ─────────────────────────────────────────────

function buildMap<T>(items: T[], keyFn: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const key = keyFn(item)
    const arr = map.get(key)
    if (arr) arr.push(item)
    else map.set(key, [item])
  }
  return map
}

// ── Hook ────────────────────────────────────────────────────────

export function useCrossDomainIntelligence(): CrossDomainIntelligenceResult {
  const beneficiariesQuery = useBeneficiaries()
  const moodQuery = useMoodTelemetry()
  const mealsQuery = useDailyMeals()
  const epilepsyQuery = useEpilepsyTracking()
  const visitsQuery = useVisitRecords()
  const abuseQuery = useAbuseReports()
  const wellbeingQuery = useStaffWellbeing()
  const dentalQuery = useDentalRecords()

  const isLoading =
    beneficiariesQuery.isLoading || moodQuery.isLoading ||
    mealsQuery.isLoading || epilepsyQuery.isLoading ||
    visitsQuery.isLoading || abuseQuery.isLoading ||
    wellbeingQuery.isLoading || dentalQuery.isLoading

  const beneficiaries = beneficiariesQuery.data ?? []
  const moods = moodQuery.data ?? []
  const meals = mealsQuery.data ?? []
  const seizures = epilepsyQuery.data ?? []
  const visits = visitsQuery.data ?? []
  const abuseReports = abuseQuery.data ?? []
  const wellbeingScores = wellbeingQuery.data ?? []
  const dentalRecords = dentalQuery.data ?? []

  const { alerts, beneficiaryMap } = useMemo(() => {
    // ── Step 1: Beneficiary lookup map ──
    const benMap = new Map<string, UnifiedBeneficiaryProfile>()
    for (const b of beneficiaries) {
      benMap.set(b.id, b)
    }

    // ── Step 2: Build domain maps (O(N) each) ──
    const moodMap = buildMap<MoodBraceletTelemetry>(moods, (m) => m.beneficiary_id)
    const mealMap = buildMap<DailyMeal>(meals, (m) => m.beneficiaryId)
    const dentalMap = buildMap<DentalRecord>(dentalRecords, (d) => d.beneficiary_id)
    const seizureMap = buildMap<EpilepsyTracking>(seizures, (s) => s.beneficiary_id)
    const visitMap = buildMap<VisitRecord>(visits, (v) => v.beneficiary_id)

    // ── Step 3: Time boundaries ──
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const todayStr = now.toISOString().slice(0, 10)
    const nowISO = now.toISOString()

    // ── Step 4: Single iteration over beneficiaries ──
    const generatedAlerts: IntelligenceAlert[] = []

    for (const ben of beneficiaries) {
      const id = ben.id
      const benMoods = moodMap.get(id) ?? []
      const benMeals = mealMap.get(id) ?? []
      const benDental = dentalMap.get(id) ?? []
      const benSeizures = seizureMap.get(id) ?? []
      const benVisits = visitMap.get(id) ?? []

      // ═══ Rule 1: Silent Pain Detector (clinical) ═══
      const refusedMealsLast7d = benMeals.filter(
        (m) => m.status === 'refused' && new Date(m.mealDate) >= sevenDaysAgo,
      ).length

      const latestDentalWithOHIS = benDental.find((d) => d.ohis_score != null)
      const hasBadDental = (latestDentalWithOHIS?.ohis_score ?? 0) >= 2

      const hasStressAnomaly = benMoods.some(
        (m) => m.calculated_stress_anomaly === 'elevated' || m.calculated_stress_anomaly === 'critical_warning',
      )

      if (refusedMealsLast7d >= 2 && hasBadDental && hasStressAnomaly) {
        generatedAlerts.push({
          id: `silent-pain-${id}`,
          beneficiaryId: id,
          beneficiaryName: ben.full_name,
          category: 'clinical',
          severity: 'critical',
          title: 'ألم صامت محتمل',
          description: `رفض ${refusedMealsLast7d} وجبات خلال 7 أيام + مؤشر صحة فم مرتفع (OHIS: ${latestDentalWithOHIS?.ohis_score}) + ضغط نفسي مرصود`,
          detectedAt: nowISO,
          relatedDomains: ['التغذية', 'صحة الفم', 'الحالة النفسية'],
        })
      }

      // ═══ Rule 2: Post-Seizure Risk (clinical) ═══
      const seizureToday = benSeizures.some(
        (s) => s.record_type === 'episode' && s.seizure_date === todayStr,
      )

      const criticalStressToday = benMoods.some(
        (m) =>
          m.calculated_stress_anomaly === 'critical_warning' &&
          m.recorded_timestamp.slice(0, 10) === todayStr,
      )

      if (seizureToday && criticalStressToday) {
        generatedAlerts.push({
          id: `post-seizure-${id}`,
          beneficiaryId: id,
          beneficiaryName: ben.full_name,
          category: 'clinical',
          severity: 'critical',
          title: 'خطر ما بعد النوبة',
          description: 'تم تسجيل نوبة صرع اليوم مع رصد ضغط نفسي حرج — يتطلب مراقبة فورية',
          detectedAt: nowISO,
          relatedDomains: ['الصرع', 'الحالة النفسية'],
        })
      }

      // ═══ Rule 3: Abandonment Syndrome (empowerment) ═══
      const isInstitutional = ben.guardian_relation === 'institution'

      const visitsLast30d = benVisits.filter(
        (v) => new Date(v.visit_date) >= thirtyDaysAgo,
      ).length

      const negativeMoodCount = benMoods.filter(
        (m) => m.emotional_valence === 'negative',
      ).length

      if (!isInstitutional && visitsLast30d === 0 && negativeMoodCount >= 2) {
        generatedAlerts.push({
          id: `abandonment-${id}`,
          beneficiaryId: id,
          beneficiaryName: ben.full_name,
          category: 'empowerment',
          severity: 'warning',
          title: 'متلازمة الهجر',
          description: `لا توجد زيارات خلال 30 يوماً + ${negativeMoodCount} قراءات مزاج سلبية — يحتاج تدخل الأخصائي الاجتماعي`,
          detectedAt: nowISO,
          relatedDomains: ['الزيارات العائلية', 'الحالة النفسية'],
        })
      }
    }

    // ═══ Rule 4: Institutional Fatigue / Just Culture (quality) ═══
    const burnedOutStaff = wellbeingScores.filter(
      (s) => s.risk_level === 'red' || s.risk_level === 'orange',
    )

    const recentAbuseIncidents = abuseReports.filter(
      (r) =>
        new Date(r.report_date) >= thirtyDaysAgo &&
        r.investigation_status !== 'resolved',
    )

    if (burnedOutStaff.length >= 2 && recentAbuseIncidents.length > 0) {
      generatedAlerts.push({
        id: `institutional-fatigue-${todayStr}`,
        beneficiaryId: '__systemic__',
        beneficiaryName: 'المركز',
        category: 'quality',
        severity: 'critical',
        title: 'إرهاق مؤسسي',
        description: `${burnedOutStaff.length} موظفين في مستوى خطر مرتفع (برتقالي/أحمر) + ${recentAbuseIncidents.length} بلاغ إيذاء حديث — يتطلب تحليل السبب الجذري (RCA)`,
        detectedAt: nowISO,
        relatedDomains: ['رفاهية الموظفين', 'بلاغات الإيذاء'],
      })
    }

    return { alerts: generatedAlerts, beneficiaryMap: benMap }
  }, [beneficiaries, moods, meals, seizures, visits, abuseReports, wellbeingScores, dentalRecords])

  return { alerts, isLoading, beneficiaryMap }
}
