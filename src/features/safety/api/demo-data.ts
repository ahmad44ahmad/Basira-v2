import type { FallRiskAssessment, RiskAlert } from '@/types/database'

const now = new Date().toISOString()

export const DEMO_FALL_RISK_ASSESSMENTS: FallRiskAssessment[] = [
  {
    id: 'fra001',
    beneficiary_id: 'b001',
    fall_history: 25,
    medications_risk: 15,
    cognitive_level: 0,
    mobility_level: 10,
    risk_score: 50,
    risk_level: 'متوسط',
    preventive_measures: ['الوقاية القياسية', 'مراجعة الأدوية المؤثرة', 'إضاءة ليلية'],
    next_assessment_date: '2026-03-15',
    assessed_by: 'ممرض: سعيد',
    created_at: now,
  },
  {
    id: 'fra002',
    beneficiary_id: 'b004',
    fall_history: 25,
    medications_risk: 15,
    cognitive_level: 15,
    mobility_level: 20,
    risk_score: 75,
    risk_level: 'عالي',
    preventive_measures: ['سوار تعريفي أصفر', 'حواجز السرير مرفوعة', 'مراقبة عند الحمام', 'تطبيق بروتوكول السقوط'],
    next_assessment_date: '2026-03-01',
    assessed_by: 'ممرض: عادل',
    created_at: now,
  },
]

export const DEMO_RISK_ALERTS: RiskAlert[] = [
  {
    id: 'ra001',
    beneficiary_id: 'b004',
    alert_type: 'fall_risk',
    severity: 'high',
    message: 'درجة خطر سقوط عالية (75) — يتطلب بروتوكول سقوط كامل',
    status: 'نشط',
    acknowledged_by: null,
    resolved_at: null,
    created_at: now,
  },
  {
    id: 'ra002',
    beneficiary_id: 'b001',
    alert_type: 'vital_signs',
    severity: 'medium',
    message: 'تذبذب في مستوى الصرع — يتطلب مراقبة إضافية',
    status: 'نشط',
    acknowledged_by: null,
    resolved_at: null,
    created_at: now,
  },
]
