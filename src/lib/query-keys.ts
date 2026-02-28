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
    examinations: () => [...queryKeys.medical.all, 'examinations'] as const,
    prescriptions: () => [...queryKeys.medical.all, 'prescriptions'] as const,
    clinicalNotes: () => [...queryKeys.medical.all, 'clinical-notes'] as const,
    labOrders: () => [...queryKeys.medical.all, 'lab-orders'] as const,
    mdtRounds: () => [...queryKeys.medical.all, 'mdt-rounds'] as const,
    diseaseNotifications: () => [...queryKeys.medical.all, 'disease-notifications'] as const,
    transfers: () => [...queryKeys.medical.all, 'transfers'] as const,
    therapySessions: () => [...queryKeys.medical.all, 'therapy-sessions'] as const,
    psychAssessments: () => [...queryKeys.medical.all, 'psych-assessments'] as const,
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
    nursingAssessments: () => [...queryKeys.care.all, 'nursing-assessments'] as const,
    vitalSignCharts: () => [...queryKeys.care.all, 'vital-sign-charts'] as const,
    epilepsyTracking: () => [...queryKeys.care.all, 'epilepsy-tracking'] as const,
    menstrualTracking: () => [...queryKeys.care.all, 'menstrual-tracking'] as const,
    weightTracking: () => [...queryKeys.care.all, 'weight-tracking'] as const,
    hygieneFollowup: () => [...queryKeys.care.all, 'hygiene-followup'] as const,
    nursingNotes: () => [...queryKeys.care.all, 'nursing-notes'] as const,
    appointments: () => [...queryKeys.care.all, 'appointments'] as const,
    isolationRecords: () => [...queryKeys.care.all, 'isolation-records'] as const,
    ambulanceChecks: () => [...queryKeys.care.all, 'ambulance-checks'] as const,
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
    followups: () => [...queryKeys.social.all, 'followups'] as const,
    referrals: () => [...queryKeys.social.all, 'referrals'] as const,
    familyNotifications: () => [...queryKeys.social.all, 'family-notifications'] as const,
    incidentReports: () => [...queryKeys.social.all, 'incident-reports'] as const,
    monitorRounds: () => [...queryKeys.social.all, 'monitor-rounds'] as const,
    clothingInventory: () => [...queryKeys.social.all, 'clothing-inventory'] as const,
    clothingTransactions: () => [...queryKeys.social.all, 'clothing-transactions'] as const,
    activityAdvances: () => [...queryKeys.social.all, 'activity-advances'] as const,
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
    trainingReferrals: () => [...queryKeys.empowerment.all, 'training-referrals'] as const,
    trainingEvaluations: () => [...queryKeys.empowerment.all, 'training-evaluations'] as const,
    crpdAssessments: () => [...queryKeys.empowerment.all, 'crpd-assessments'] as const,
    independenceBudget: () => [...queryKeys.empowerment.all, 'independence-budget'] as const,
  },
  family: {
    all: ['family'] as const,
    visits: (beneficiaryId?: string) =>
      [...queryKeys.family.all, 'visits', beneficiaryId] as const,
    updates: (beneficiaryId?: string) =>
      [...queryKeys.family.all, 'updates', beneficiaryId] as const,
    feed: () => [...queryKeys.family.all, 'feed'] as const,
    visitRecords: () => [...queryKeys.family.all, 'visit-records'] as const,
    counseling: () => [...queryKeys.family.all, 'counseling'] as const,
  },
  catering: {
    all: ['catering'] as const,
    dailyLog: (date: string) => [...queryKeys.catering.all, 'daily-log', date] as const,
    meals: (date?: string) => [...queryKeys.catering.all, 'meals', date] as const,
    inventory: () => [...queryKeys.catering.all, 'inventory'] as const,
    evaluations: () => [...queryKeys.catering.all, 'evaluations'] as const,
    suppliers: () => [...queryKeys.catering.all, 'suppliers'] as const,
    transactions: () => [...queryKeys.catering.all, 'transactions'] as const,
  },
  operations: {
    all: ['operations'] as const,
    assets: () => [...queryKeys.operations.all, 'assets'] as const,
    maintenance: () => [...queryKeys.operations.all, 'maintenance'] as const,
    preventive: () => [...queryKeys.operations.all, 'preventive'] as const,
    categories: () => [...queryKeys.operations.all, 'categories'] as const,
    checklists: () => [...queryKeys.operations.all, 'checklists'] as const,
    waste: () => [...queryKeys.operations.all, 'waste'] as const,
  },
  quality: {
    all: ['quality'] as const,
    ncrs: () => [...queryKeys.quality.all, 'ncrs'] as const,
    audits: () => [...queryKeys.quality.all, 'audits'] as const,
    cycles: () => [...queryKeys.quality.all, 'cycles'] as const,
    findings: () => [...queryKeys.quality.all, 'findings'] as const,
    ovrs: () => [...queryKeys.quality.all, 'ovrs'] as const,
  },
  grc: {
    all: ['grc'] as const,
    risks: () => [...queryKeys.grc.all, 'risks'] as const,
    compliance: () => [...queryKeys.grc.all, 'compliance'] as const,
    abuseReports: () => [...queryKeys.grc.all, 'abuse-reports'] as const,
    safety: () => [...queryKeys.grc.all, 'safety'] as const,
  },
  stats: {
    all: ['stats'] as const,
    dashboard: () => [...queryKeys.stats.all, 'dashboard'] as const,
    kpis: () => [...queryKeys.stats.all, 'kpis'] as const,
  },
  feedback: {
    all: ['feedback'] as const,
    surveys: () => [...queryKeys.feedback.all, 'surveys'] as const,
    surveysByBeneficiary: (id: string) => [...queryKeys.feedback.all, 'surveys', id] as const,
    mood: () => [...queryKeys.feedback.all, 'mood'] as const,
    stressAlerts: () => [...queryKeys.feedback.all, 'stress-alerts'] as const,
    moodTelemetry: () => [...queryKeys.feedback.all, 'mood-telemetry'] as const,
  },
  emergency: {
    all: ['emergency'] as const,
    plans: () => [...queryKeys.emergency.all, 'plans'] as const,
    plan: (beneficiaryId: string) => [...queryKeys.emergency.all, 'plan', beneficiaryId] as const,
    equipment: () => [...queryKeys.emergency.all, 'equipment'] as const,
  },
  icf: {
    all: ['icf'] as const,
    assessments: () => [...queryKeys.icf.all, 'assessments'] as const,
    byBeneficiary: (id: string) => [...queryKeys.icf.all, 'assessments', id] as const,
  },
  lifePlans: {
    all: ['life-plans'] as const,
    plans: () => [...queryKeys.lifePlans.all, 'plans'] as const,
    plan: (beneficiaryId: string) => [...queryKeys.lifePlans.all, 'plan', beneficiaryId] as const,
  },
  rights: {
    all: ['rights'] as const,
    log: () => [...queryKeys.rights.all, 'log'] as const,
    byBeneficiary: (id: string) => [...queryKeys.rights.all, 'log', id] as const,
  },
  staffWellbeing: {
    all: ['staff-wellbeing'] as const,
    scores: () => [...queryKeys.staffWellbeing.all, 'scores'] as const,
  },
  dental: {
    all: ['dental'] as const,
    records: () => [...queryKeys.dental.all, 'records'] as const,
    hygieneLogs: () => [...queryKeys.dental.all, 'hygiene-logs'] as const,
    sterilization: () => [...queryKeys.dental.all, 'sterilization'] as const,
  },
  indicators: {
    all: ['indicators'] as const,
    smart: () => [...queryKeys.indicators.all, 'smart'] as const,
    benchmarks: () => [...queryKeys.indicators.all, 'benchmarks'] as const,
    hrImpact: () => [...queryKeys.indicators.all, 'hr-impact'] as const,
    alerts: () => [...queryKeys.indicators.all, 'alerts'] as const,
  },
  auth: {
    session: ['auth', 'session'] as const,
    profile: ['auth', 'profile'] as const,
  },
} as const
