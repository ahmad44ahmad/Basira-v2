import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { Medication, MedicationStatus } from '../types'
import { DEMO_MEDICATIONS } from './demo-data'

// ===== Fetch =====
// Medications are derived from medical_profiles.current_medications joined with beneficiaries.
// In production, this could also be a dedicated medication_administration table.

interface MedProfileWithBeneficiary {
  id: string
  beneficiary_id: string
  current_medications: Array<{ name: string; dosage: string; frequency: string; scheduledTime?: string }> | null
  beneficiaries: {
    full_name: string
    room_number: string | null
    allergies: string | null
  }
}

async function fetchMedicationSchedule(): Promise<Medication[]> {
  if (isDemoMode || !supabase) return DEMO_MEDICATIONS

  const { data, error } = await supabase
    .from('medical_profiles')
    .select('id, beneficiary_id, current_medications, beneficiaries!inner(full_name, room_number, allergies:medical_diagnosis)')

  if (error) throw error

  // Transform medical profile medications into schedule items
  const meds: Medication[] = []
  for (const profile of data ?? []) {
    const beneficiary = (profile as MedProfileWithBeneficiary).beneficiaries
    const medications = (profile as MedProfileWithBeneficiary).current_medications

    for (const med of medications ?? []) {
      meds.push({
        id: `${profile.id}-${med.name}`,
        name: med.name,
        dosage: med.dosage,
        route: 'فموي',
        frequency: med.frequency,
        scheduledTime: med.scheduledTime ?? '08:00',
        status: 'pending',
        beneficiaryName: beneficiary.full_name,
        beneficiaryId: profile.beneficiary_id,
        room: `غ-${beneficiary.room_number ?? '?'}`,
      })
    }
  }

  return meds
}

// ===== Hooks =====

export function useMedicationSchedule() {
  return useQuery({
    queryKey: queryKeys.medications.all,
    queryFn: fetchMedicationSchedule,
  })
}

export function useAdministerMedication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string; status: MedicationStatus }) => {
      // In production: insert into medication_administration_log table
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return
      }
      // Placeholder — no dedicated admin log table yet
      await new Promise((r) => setTimeout(r, 300))
      return { id }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.medications.all })
    },
  })
}

export function useMedicationStats() {
  const { data: meds } = useMedicationSchedule()

  return {
    total: meds?.length ?? 0,
    pending: meds?.filter((m) => m.status === 'pending').length ?? 0,
    overdue: meds?.filter((m) => m.status === 'overdue').length ?? 0,
    administered: meds?.filter((m) => m.status === 'administered').length ?? 0,
  }
}
