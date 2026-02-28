export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type VaccinationStatus = 'UpToDate' | 'Overdue' | 'Incomplete' | 'Pending'

export interface VitalSigns {
  temperature: number | null
  bloodPressureSystolic: number | null
  bloodPressureDiastolic: number | null
  pulse: number | null
  respiratoryRate: number | null
  oxygenSaturation: number | null
  bloodSugar: number | null
  weight: number | null
  measuredAt: string
}

export interface CurrentMedication {
  id?: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate?: string
}

export interface InfectionStatus {
  suspectedInfection: boolean
  isolationRecommended: boolean
  isolationReason?: string
  vaccinationStatus: VaccinationStatus
  lastVaccinationDate?: string
}

export interface MedicalProfileView {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  bloodType?: BloodType
  isEpileptic: boolean
  latestVitals?: VitalSigns
  currentMedications: CurrentMedication[]
  infectionStatus: InfectionStatus
  chronicDiseases: string[]
  allergies: string[]
  surgeries: string[]
}

export interface MedicalExamination {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  date: string
  doctorName: string
  diagnosis: string
  vitalSigns: {
    bloodPressure: string
    pulse: string
    temperature: string
    respiration: string
  }
  symptoms?: string
  treatment?: string
  physicalExamNotes: string
  recommendations: string
}

export interface MedicalStats {
  totalProfiles: number
  activeCases: number
  pendingVaccinations: number
  isolatedCount: number
  vaccinationRate: number
  medicationCompliance: number
}
