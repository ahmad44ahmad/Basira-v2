// Public API for beneficiaries feature
export { BeneficiariesPage } from './pages/BeneficiariesPage'
export { BeneficiaryCard, BeneficiaryDetail, BeneficiaryFilters, AddBeneficiaryForm } from './components'
export { useBeneficiaries, useBeneficiaryOptions, useBeneficiaryStats, useCreateBeneficiary } from './api/beneficiary-queries'
export type { UnifiedBeneficiaryProfile, BeneficiaryFilters as BeneficiaryFilterState, SmartTag, RiskLevel } from './types'
