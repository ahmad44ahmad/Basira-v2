import { useQuery } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { MoodBraceletTelemetry } from '@/types/database'

// ===== Demo Data =====

const DEMO_TELEMETRY: MoodBraceletTelemetry[] = [
  { id: 'mt1', beneficiary_id: 'b001', recorded_timestamp: '2026-02-28T08:30:00Z', voluntary_button_press: 'green', heart_rate_bpm: 72, skin_conductance: 2.5, calculated_stress_anomaly: 'normal', emotional_valence: 'positive', current_activity_context: 'فطور', location_context: 'قاعة الطعام', created_at: '2026-02-28T08:30:00Z' },
  { id: 'mt2', beneficiary_id: 'b001', recorded_timestamp: '2026-02-28T10:15:00Z', voluntary_button_press: 'yellow', heart_rate_bpm: 88, skin_conductance: 4.2, calculated_stress_anomaly: 'elevated', emotional_valence: 'neutral', current_activity_context: 'جلسة علاج طبيعي', location_context: 'قاعة التأهيل', created_at: '2026-02-28T10:15:00Z' },
  { id: 'mt3', beneficiary_id: 'b001', recorded_timestamp: '2026-02-28T14:00:00Z', voluntary_button_press: 'green', heart_rate_bpm: 68, skin_conductance: 1.8, calculated_stress_anomaly: 'normal', emotional_valence: 'positive', current_activity_context: 'قراءة', location_context: 'المكتبة', created_at: '2026-02-28T14:00:00Z' },
  { id: 'mt4', beneficiary_id: 'b002', recorded_timestamp: '2026-02-28T09:00:00Z', voluntary_button_press: 'red', heart_rate_bpm: 105, skin_conductance: 6.8, calculated_stress_anomaly: 'critical_warning', emotional_valence: 'negative', current_activity_context: 'بعد زيارة الأسرة', location_context: 'الغرفة', created_at: '2026-02-28T09:00:00Z' },
  { id: 'mt5', beneficiary_id: 'b002', recorded_timestamp: '2026-02-28T11:30:00Z', voluntary_button_press: 'yellow', heart_rate_bpm: 92, skin_conductance: 5.1, calculated_stress_anomaly: 'elevated', emotional_valence: 'neutral', current_activity_context: 'جلسة إرشاد نفسي', location_context: 'العيادة', created_at: '2026-02-28T11:30:00Z' },
  { id: 'mt6', beneficiary_id: 'b002', recorded_timestamp: '2026-02-28T16:00:00Z', voluntary_button_press: 'green', heart_rate_bpm: 78, skin_conductance: 3.2, calculated_stress_anomaly: 'normal', emotional_valence: 'positive', current_activity_context: 'لعب جماعي', location_context: 'الحديقة', created_at: '2026-02-28T16:00:00Z' },
  { id: 'mt7', beneficiary_id: 'b003', recorded_timestamp: '2026-02-28T08:00:00Z', voluntary_button_press: 'blue', heart_rate_bpm: 65, skin_conductance: 1.5, calculated_stress_anomaly: 'normal', emotional_valence: 'neutral', current_activity_context: 'استيقاظ', location_context: 'الغرفة', created_at: '2026-02-28T08:00:00Z' },
  { id: 'mt8', beneficiary_id: 'b003', recorded_timestamp: '2026-02-28T12:00:00Z', voluntary_button_press: 'green', heart_rate_bpm: 70, skin_conductance: 2.0, calculated_stress_anomaly: 'normal', emotional_valence: 'positive', current_activity_context: 'غداء', location_context: 'قاعة الطعام', created_at: '2026-02-28T12:00:00Z' },
  { id: 'mt9', beneficiary_id: 'b001', recorded_timestamp: '2026-02-27T09:00:00Z', voluntary_button_press: 'green', heart_rate_bpm: 70, skin_conductance: 2.2, calculated_stress_anomaly: 'normal', emotional_valence: 'positive', current_activity_context: 'تمارين صباحية', location_context: 'الصالة الرياضية', created_at: '2026-02-27T09:00:00Z' },
  { id: 'mt10', beneficiary_id: 'b001', recorded_timestamp: '2026-02-27T15:00:00Z', voluntary_button_press: 'red', heart_rate_bpm: 110, skin_conductance: 7.5, calculated_stress_anomaly: 'critical_warning', emotional_valence: 'negative', current_activity_context: 'ضوضاء مفاجئة', location_context: 'الممر', created_at: '2026-02-27T15:00:00Z' },
  { id: 'mt11', beneficiary_id: 'b002', recorded_timestamp: '2026-02-27T10:00:00Z', voluntary_button_press: 'yellow', heart_rate_bpm: 85, skin_conductance: 4.0, calculated_stress_anomaly: 'elevated', emotional_valence: 'neutral', current_activity_context: 'فحص طبي', location_context: 'العيادة', created_at: '2026-02-27T10:00:00Z' },
  { id: 'mt12', beneficiary_id: 'b003', recorded_timestamp: '2026-02-27T14:00:00Z', voluntary_button_press: 'green', heart_rate_bpm: 68, skin_conductance: 1.9, calculated_stress_anomaly: 'normal', emotional_valence: 'positive', current_activity_context: 'رسم', location_context: 'قاعة الأنشطة', created_at: '2026-02-27T14:00:00Z' },
  // b010 سارة — negative moods (Abandonment trigger: ≥2 negative)
  { id: 'mt13', beneficiary_id: 'b010', recorded_timestamp: '2026-02-28T09:30:00Z', voluntary_button_press: 'red', heart_rate_bpm: 98, skin_conductance: 5.8, calculated_stress_anomaly: 'elevated', emotional_valence: 'negative', current_activity_context: 'وحيدة في الغرفة', location_context: 'الغرفة', created_at: '2026-02-28T09:30:00Z' },
  { id: 'mt14', beneficiary_id: 'b010', recorded_timestamp: '2026-02-28T14:00:00Z', voluntary_button_press: 'red', heart_rate_bpm: 102, skin_conductance: 6.5, calculated_stress_anomaly: 'critical_warning', emotional_valence: 'negative', current_activity_context: 'رفضت الخروج من الغرفة', location_context: 'الغرفة', created_at: '2026-02-28T14:00:00Z' },
  { id: 'mt15', beneficiary_id: 'b010', recorded_timestamp: '2026-02-27T11:00:00Z', voluntary_button_press: 'yellow', heart_rate_bpm: 85, skin_conductance: 4.3, calculated_stress_anomaly: 'elevated', emotional_valence: 'neutral', current_activity_context: 'جلسة إرشاد', location_context: 'العيادة', created_at: '2026-02-27T11:00:00Z' },
  // b003 خالد — critical stress on seizure day (Post-Seizure trigger)
  { id: 'mt16', beneficiary_id: 'b003', recorded_timestamp: `${new Date().toISOString().slice(0, 10)}T04:00:00Z`, voluntary_button_press: 'red', heart_rate_bpm: 115, skin_conductance: 8.2, calculated_stress_anomaly: 'critical_warning', emotional_valence: 'negative', current_activity_context: 'بعد نوبة صرع', location_context: 'الغرفة', created_at: `${new Date().toISOString().slice(0, 10)}T04:00:00Z` },
]

// ===== Mood Telemetry =====

async function fetchMoodTelemetry(): Promise<MoodBraceletTelemetry[]> {
  if (isDemoMode || !supabase) return DEMO_TELEMETRY

  const { data, error } = await supabase
    .from('mood_bracelet_telemetry')
    .select('*')
    .order('recorded_timestamp', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useMoodTelemetry() {
  return useQuery({
    queryKey: queryKeys.feedback.moodTelemetry(),
    queryFn: fetchMoodTelemetry,
  })
}
