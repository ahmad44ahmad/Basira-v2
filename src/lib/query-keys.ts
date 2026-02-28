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
    profiles: () => [...queryKeys.medical.all, 'profiles'] as const,
    profile: (beneficiaryId: string) =>
      [...queryKeys.medical.all, 'profile', beneficiaryId] as const,
    examinations: (beneficiaryId: string) =>
      [...queryKeys.medical.all, 'examinations', beneficiaryId] as const,
    medications: (beneficiaryId: string) =>
      [...queryKeys.medical.all, 'medications', beneficiaryId] as const,
  },
  care: {
    all: ['care'] as const,
    logs: () => [...queryKeys.care.all, 'logs'] as const,
    dailyLog: (beneficiaryId: string, date: string) =>
      [...queryKeys.care.all, 'daily-log', beneficiaryId, date] as const,
    fallRisk: (beneficiaryId: string) =>
      [...queryKeys.care.all, 'fall-risk', beneficiaryId] as const,
    handover: (shiftDate: string, shift: string) =>
      [...queryKeys.care.all, 'handover', shiftDate, shift] as const,
    handoverAll: () => [...queryKeys.care.all, 'handover'] as const,
  },
  medications: {
    all: ['medications'] as const,
    schedule: (date?: string) => [...queryKeys.medications.all, 'schedule', date] as const,
  },
  safety: {
    all: ['safety'] as const,
    assessments: () => [...queryKeys.safety.all, 'assessments'] as const,
    assessment: (beneficiaryId: string) =>
      [...queryKeys.safety.all, 'assessment', beneficiaryId] as const,
    alerts: () => [...queryKeys.safety.all, 'alerts'] as const,
  },
  ipc: {
    all: ['ipc'] as const,
    inspections: () => [...queryKeys.ipc.all, 'inspections'] as const,
    incidents: () => [...queryKeys.ipc.all, 'incidents'] as const,
    immunizations: () => [...queryKeys.ipc.all, 'immunizations'] as const,
    locations: () => [...queryKeys.ipc.all, 'locations'] as const,
    templates: () => [...queryKeys.ipc.all, 'templates'] as const,
  },
  social: {
    all: ['social'] as const,
    researches: () => [...queryKeys.social.all, 'researches'] as const,
    leaves: () => [...queryKeys.social.all, 'leaves'] as const,
    activities: () => [...queryKeys.social.all, 'activities'] as const,
  },
  empowerment: {
    all: ['empowerment'] as const,
    goals: (beneficiaryId?: string) =>
      [...queryKeys.empowerment.all, 'goals', beneficiaryId] as const,
    progressLogs: (goalId: string) =>
      [...queryKeys.empowerment.all, 'progress', goalId] as const,
    dignityProfile: (beneficiaryId: string) =>
      [...queryKeys.empowerment.all, 'dignity', beneficiaryId] as const,
    templates: () => [...queryKeys.empowerment.all, 'templates'] as const,
  },
  family: {
    all: ['family'] as const,
    visits: (beneficiaryId?: string) =>
      [...queryKeys.family.all, 'visits', beneficiaryId] as const,
    updates: (beneficiaryId?: string) =>
      [...queryKeys.family.all, 'updates', beneficiaryId] as const,
    feed: () => [...queryKeys.family.all, 'feed'] as const,
  },
  catering: {
    all: ['catering'] as const,
    dailyLog: (date: string) => [...queryKeys.catering.all, 'daily-log', date] as const,
    meals: (date?: string) => [...queryKeys.catering.all, 'meals', date] as const,
    inventory: () => [...queryKeys.catering.all, 'inventory'] as const,
    evaluations: () => [...queryKeys.catering.all, 'evaluations'] as const,
  },
  operations: {
    all: ['operations'] as const,
    assets: () => [...queryKeys.operations.all, 'assets'] as const,
    maintenance: () => [...queryKeys.operations.all, 'maintenance'] as const,
    preventive: () => [...queryKeys.operations.all, 'preventive'] as const,
    categories: () => [...queryKeys.operations.all, 'categories'] as const,
  },
  quality: {
    all: ['quality'] as const,
    ncrs: () => [...queryKeys.quality.all, 'ncrs'] as const,
    audits: () => [...queryKeys.quality.all, 'audits'] as const,
    cycles: () => [...queryKeys.quality.all, 'cycles'] as const,
    findings: () => [...queryKeys.quality.all, 'findings'] as const,
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
