/** Structured query key factory for TanStack Query */
export const queryKeys = {
  beneficiaries: {
    all: ['beneficiaries'] as const,
    lists: () => [...queryKeys.beneficiaries.all, 'list'] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.beneficiaries.lists(), filters] as const,
    details: () => [...queryKeys.beneficiaries.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.beneficiaries.details(), id] as const,
  },
  medical: {
    all: ['medical'] as const,
    profile: (beneficiaryId: string) =>
      [...queryKeys.medical.all, 'profile', beneficiaryId] as const,
    examinations: (beneficiaryId: string) =>
      [...queryKeys.medical.all, 'examinations', beneficiaryId] as const,
    medications: (beneficiaryId: string) =>
      [...queryKeys.medical.all, 'medications', beneficiaryId] as const,
  },
  care: {
    all: ['care'] as const,
    dailyLog: (beneficiaryId: string, date: string) =>
      [...queryKeys.care.all, 'daily-log', beneficiaryId, date] as const,
    fallRisk: (beneficiaryId: string) =>
      [...queryKeys.care.all, 'fall-risk', beneficiaryId] as const,
    handover: (shiftDate: string, shift: string) =>
      [...queryKeys.care.all, 'handover', shiftDate, shift] as const,
  },
  catering: {
    all: ['catering'] as const,
    dailyLog: (date: string) => [...queryKeys.catering.all, 'daily-log', date] as const,
    inventory: () => [...queryKeys.catering.all, 'inventory'] as const,
    evaluations: () => [...queryKeys.catering.all, 'evaluations'] as const,
  },
  operations: {
    all: ['operations'] as const,
    assets: () => [...queryKeys.operations.all, 'assets'] as const,
    maintenance: () => [...queryKeys.operations.all, 'maintenance'] as const,
  },
  grc: {
    all: ['grc'] as const,
    risks: () => [...queryKeys.grc.all, 'risks'] as const,
    compliance: () => [...queryKeys.grc.all, 'compliance'] as const,
  },
  stats: {
    all: ['stats'] as const,
    dashboard: () => [...queryKeys.stats.all, 'dashboard'] as const,
    kpis: () => [...queryKeys.stats.all, 'kpis'] as const,
  },
  auth: {
    session: ['auth', 'session'] as const,
    profile: ['auth', 'profile'] as const,
  },
} as const
