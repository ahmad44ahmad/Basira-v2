import type { UnifiedBeneficiaryProfile } from '@/features/beneficiaries'
import type { IntelligenceAlert } from '@/features/stats/hooks/useCrossDomainIntelligence'

// ── FHIR R4 Types (inline — no external deps) ──────────────────

interface FHIRIdentifier {
  system: string
  value: string
}

interface FHIRCoding {
  system: string
  code: string
  display: string
}

interface FHIRCodeableConcept {
  coding: FHIRCoding[]
  text: string
}

interface FHIRPatient {
  resourceType: 'Patient'
  id: string
  identifier: FHIRIdentifier[]
  name: Array<{ text: string }>
  gender: 'male' | 'female' | 'unknown'
  birthDate?: string
}

interface FHIRCondition {
  resourceType: 'Condition'
  id: string
  subject: { reference: string }
  code: FHIRCodeableConcept
  clinicalStatus: FHIRCodeableConcept
  severity: FHIRCodeableConcept
  recordedDate: string
  note: Array<{ text: string }>
}

interface FHIRBundleEntry {
  fullUrl: string
  resource: FHIRPatient | FHIRCondition
}

export interface FHIRBundle {
  resourceType: 'Bundle'
  type: 'collection'
  timestamp: string
  identifier: FHIRIdentifier
  entry: FHIRBundleEntry[]
}

// ── Generator ───────────────────────────────────────────────────

export function generateFHIRPassport(
  beneficiary: UnifiedBeneficiaryProfile,
  alerts: IntelligenceAlert[],
): FHIRBundle {
  const patient: FHIRPatient = {
    resourceType: 'Patient',
    id: beneficiary.id,
    identifier: [
      {
        system: 'https://nphies.sa/identifier/national-id',
        value: beneficiary.national_id ?? '',
      },
      {
        system: 'urn:basira:beneficiary',
        value: beneficiary.id,
      },
    ],
    name: [{ text: beneficiary.full_name }],
    gender: beneficiary.section === 'إناث' ? 'female' : beneficiary.section === 'ذكور' ? 'male' : 'unknown',
    birthDate: beneficiary.date_of_birth ?? undefined,
  }

  const conditions: FHIRCondition[] = alerts.map((alert) => ({
    resourceType: 'Condition' as const,
    id: alert.id,
    subject: { reference: `Patient/${beneficiary.id}` },
    code: {
      coding: [
        {
          system: 'urn:basira:intelligence-alert',
          code: alert.category,
          display: alert.title,
        },
      ],
      text: alert.title,
    },
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active',
          display: 'Active',
        },
      ],
      text: 'نشط',
    },
    severity: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-severity',
          code: alert.severity === 'critical' ? 'severe' : 'moderate',
          display: alert.severity === 'critical' ? 'Severe' : 'Moderate',
        },
      ],
      text: alert.severity === 'critical' ? 'حرج' : 'تحذير',
    },
    recordedDate: alert.detectedAt,
    note: [{ text: alert.description }],
  }))

  return {
    resourceType: 'Bundle',
    type: 'collection',
    timestamp: new Date().toISOString(),
    identifier: {
      system: 'urn:basira:fhir-passport',
      value: `passport-${beneficiary.id}-${Date.now()}`,
    },
    entry: [
      { fullUrl: `urn:uuid:${beneficiary.id}`, resource: patient },
      ...conditions.map((c) => ({
        fullUrl: `urn:uuid:${c.id}`,
        resource: c,
      })),
    ],
  }
}
