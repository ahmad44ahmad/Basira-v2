import { useState } from 'react'
import { ShieldCheck, AlertTriangle, ClipboardCheck, Flame, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge, Input, Select, Modal, Tabs } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  RISK_CATEGORY_CONFIG, RISK_LEVEL_CONFIG, RISK_STATUS_CONFIG, RISK_RESPONSE_CONFIG,
  LIKELIHOOD_LABELS, IMPACT_LABELS, calculateRiskLevel,
  COMPLIANCE_STATUS_CONFIG,
  SAFETY_INCIDENT_TYPE_CONFIG, SAFETY_SEVERITY_CONFIG, SAFETY_STATUS_CONFIG,
  type Risk, type RiskCategory, type RiskLevel, type RiskStatus,
  type ComplianceRequirement, type ComplianceStatus,
  type SafetyIncident, type SafetyIncidentType,
} from '../types'

// ─── Demo Data ──────────────────────────────────────────────────

const DEMO_RISKS: Risk[] = [
  { id: 'r1', riskCode: 'RISK-2026-001', titleAr: 'مخاطر السقوط للمستفيدين', description: 'احتمال سقوط المستفيدين بسبب ضعف إجراءات السلامة في الأجنحة', category: 'safety', likelihood: 4, impact: 4, riskScore: 16, riskLevel: 'high', riskOwner: 'مدير التمريض', department: 'الخدمات الطبية', responseStrategy: 'mitigate', mitigationAction: 'تركيب مقابض جانبية وأرضيات مانعة للانزلاق', status: 'mitigating', reviewFrequency: 'monthly', nextReviewDate: '2026-03-15' },
  { id: 'r2', riskCode: 'RISK-2026-002', titleAr: 'مخاطر الحريق', description: 'قدم أنظمة الإنذار والإطفاء في بعض الأجنحة', category: 'safety', likelihood: 3, impact: 5, riskScore: 15, riskLevel: 'high', riskOwner: 'مسؤول السلامة', department: 'الصيانة والتشغيل', responseStrategy: 'mitigate', mitigationAction: 'تحديث أنظمة الحريق وتدريب الموظفين على الإخلاء', status: 'mitigating', reviewFrequency: 'monthly', nextReviewDate: '2026-03-10' },
  { id: 'r3', riskCode: 'RISK-2026-003', titleAr: 'نقص الكوادر التمريضية', description: 'عدم كفاية أعداد الممرضين مقارنة بعدد المستفيدين', category: 'operational', likelihood: 4, impact: 3, riskScore: 12, riskLevel: 'high', riskOwner: 'مدير الموارد البشرية', department: 'الموارد البشرية', responseStrategy: 'mitigate', status: 'identified', reviewFrequency: 'quarterly' },
  { id: 'r4', riskCode: 'RISK-2026-004', titleAr: 'مخاطر العدوى المكتسبة', description: 'خطر انتقال العدوى بين المستفيدين في الأجنحة المشتركة', category: 'compliance', likelihood: 3, impact: 4, riskScore: 12, riskLevel: 'high', riskOwner: 'مسؤول IPC', department: 'مكافحة العدوى', responseStrategy: 'mitigate', mitigationAction: 'تعزيز بروتوكولات مكافحة العدوى والعزل', status: 'mitigating', reviewFrequency: 'monthly' },
  { id: 'r5', riskCode: 'RISK-2026-005', titleAr: 'تأخر الصيانة الوقائية', description: 'تراكم طلبات الصيانة الوقائية وتأخر تنفيذها', category: 'operational', likelihood: 3, impact: 2, riskScore: 6, riskLevel: 'medium', riskOwner: 'مشرف الصيانة', department: 'الصيانة والتشغيل', responseStrategy: 'accept', status: 'monitoring', reviewFrequency: 'quarterly' },
  { id: 'r6', riskCode: 'RISK-2026-006', titleAr: 'مخاطر أمن المعلومات', description: 'ضعف سياسات حماية البيانات الشخصية للمستفيدين', category: 'compliance', likelihood: 2, impact: 4, riskScore: 8, riskLevel: 'medium', riskOwner: 'مسؤول IT', department: 'تقنية المعلومات', responseStrategy: 'mitigate', mitigationAction: 'تطبيق سياسات PDPL وتشفير البيانات', status: 'mitigating', reviewFrequency: 'quarterly' },
  { id: 'r7', riskCode: 'RISK-2026-007', titleAr: 'مخاطر انقطاع التيار الكهربائي', description: 'تأثير انقطاع الكهرباء على الأجهزة الطبية الحرجة', category: 'operational', likelihood: 2, impact: 5, riskScore: 10, riskLevel: 'medium', riskOwner: 'مهندس الكهرباء', department: 'الصيانة والتشغيل', responseStrategy: 'mitigate', mitigationAction: 'صيانة المولد الاحتياطي وتركيب UPS', status: 'monitoring', reviewFrequency: 'monthly' },
]

const DEMO_COMPLIANCE: ComplianceRequirement[] = [
  { id: 'comp1', requirementCode: 'ISO-4-1', titleAr: 'فهم احتياجات المستفيدين وتوقعاتهم', standardName: 'ISO 9001:2015', section: 'سياق المنظمة', complianceStatus: 'compliant', complianceScore: 95, responsibleDepartment: 'الخدمات الاجتماعية', evidenceNotes: 'بحث اجتماعي + تقييم طبي محدث كل 6 أشهر', lastAuditDate: '2026-02-15' },
  { id: 'comp2', requirementCode: 'ISO-5-2', titleAr: 'سياسة الجودة والالتزام القيادي', standardName: 'ISO 9001:2015', section: 'القيادة', complianceStatus: 'compliant', complianceScore: 100, responsibleDepartment: 'الإدارة العليا', evidenceNotes: 'توقيع المستفيد/الولي على خطة التمكين' },
  { id: 'comp3', requirementCode: 'ISO-6-1', titleAr: 'إدارة المخاطر والفرص', standardName: 'ISO 9001:2015', section: 'التخطيط', complianceStatus: 'partial', complianceScore: 70, responsibleDepartment: 'الجودة', gapDescription: 'سجل المخاطر يحتاج ربط بخطة الإخلاء', remediationPlan: 'دمج سجل المخاطر مع خطة BCP' },
  { id: 'comp4', requirementCode: 'ISO-7-1', titleAr: 'الموارد والبنية التحتية', standardName: 'ISO 9001:2015', section: 'الدعم', complianceStatus: 'partial', complianceScore: 60, responsibleDepartment: 'الصيانة والتشغيل', gapDescription: 'تقارير الصيانة الوقائية غير مكتملة' },
  { id: 'comp5', requirementCode: 'ISO-8-1', titleAr: 'التخطيط والضبط التشغيلي', standardName: 'ISO 9001:2015', section: 'العمليات', complianceStatus: 'compliant', complianceScore: 90, responsibleDepartment: 'الخدمات الطبية', evidenceNotes: 'سجلات العلامات الحيوية وتوزيع الوجبات مكتملة' },
  { id: 'comp6', requirementCode: 'MOH-045', titleAr: 'ترخيص العيادة الطبية', standardName: 'وزارة الصحة', section: 'التراخيص', complianceStatus: 'non_compliant', complianceScore: 30, responsibleDepartment: 'الخدمات الطبية', gapDescription: 'الترخيص منتهي الصلاحية — يحتاج تجديد فوري', remediationPlan: 'تقديم طلب تجديد عاجل', dueDate: '2026-03-15' },
  { id: 'comp7', requirementCode: 'PDPL-001', titleAr: 'حماية البيانات الشخصية', standardName: 'نظام حماية البيانات الشخصية', section: 'الخصوصية', complianceStatus: 'partial', complianceScore: 55, responsibleDepartment: 'تقنية المعلومات', gapDescription: 'سياسة الخصوصية تحتاج تحديث لتتوافق مع PDPL' },
]

const DEMO_SAFETY: SafetyIncident[] = [
  { id: 's1', incidentDate: '2026-02-27', incidentType: 'near_miss', severity: 'minor', location: 'ممر الجناح A', description: 'أرضية مبللة بدون لافتة تحذيرية بالقرب من الحمام', reportedBy: 'نورة العتيبي', status: 'closed', correctiveActions: 'تركيب لافتات دائمة ومسح الأرضيات فوراً' },
  { id: 's2', incidentDate: '2026-02-24', incidentType: 'injury', severity: 'moderate', location: 'غرفة 12', description: 'سقوط مستفيد أثناء محاولة النهوض من السرير بدون مساعدة', reportedBy: 'هند المحمد', status: 'investigating', rootCause: 'عدم تفعيل جرس الاستدعاء وغياب حاجز السرير', injuries: 1 },
  { id: 's3', incidentDate: '2026-02-20', incidentType: 'fire', severity: 'minor', location: 'المطبخ المركزي', description: 'ارتفاع درجة حرارة الفرن بشكل غير طبيعي — تم إيقافه فوراً', reportedBy: 'الشيف أحمد', status: 'closed', correctiveActions: 'فحص الفرن بواسطة الفني وصيانة الحساسات' },
  { id: 's4', incidentDate: '2026-02-15', incidentType: 'property_damage', severity: 'minor', location: 'موقف السيارات', description: 'تضرر مرآة سيارة الإسعاف أثناء المناورة', reportedBy: 'السائق محمد', status: 'closed' },
]

// ─── Main Page ──────────────────────────────────────────────────

export function GRCPage() {
  const [activeTab, setActiveTab] = useState('risks')

  const tabs = [
    { id: 'risks', label: 'سجل المخاطر' },
    { id: 'compliance', label: 'الامتثال' },
    { id: 'safety', label: 'السلامة' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="الحوكمة والمخاطر والامتثال" description="إدارة المخاطر وضمان الامتثال وسلامة المنشأة" icon={<ShieldCheck className="h-5 w-5" />} />
      <Tabs tabs={tabs.map((t) => ({ id: t.id, label: t.label }))} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === 'risks' && <RiskSection />}
        {activeTab === 'compliance' && <ComplianceSection />}
        {activeTab === 'safety' && <SafetySection />}
      </div>
    </div>
  )
}

// ─── Risk Section ───────────────────────────────────────────────

function RiskSection() {
  const [risks] = useState(DEMO_RISKS)
  const [filterLevel, setFilterLevel] = useState<RiskLevel | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<RiskCategory | 'all'>('all')

  const filtered = risks.filter((r) =>
    (filterLevel === 'all' || r.riskLevel === filterLevel) &&
    (filterCategory === 'all' || r.category === filterCategory),
  )

  const stats = {
    total: risks.length,
    critical: risks.filter((r) => r.riskLevel === 'critical').length,
    high: risks.filter((r) => r.riskLevel === 'high').length,
    medium: risks.filter((r) => r.riskLevel === 'medium').length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي المخاطر" value={stats.total} accent="navy" />
        <StatCard title="حرج" value={stats.critical} accent="danger" />
        <StatCard title="عالي" value={stats.high} accent="gold" />
        <StatCard title="متوسط" value={stats.medium} accent="teal" />
      </div>

      {/* 5x5 Risk Matrix */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">مصفوفة المخاطر 5×5</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            <div className="grid grid-cols-6 gap-1 text-center text-xs">
              <div />
              {[1, 2, 3, 4, 5].map((imp) => (
                <div key={imp} className="p-1 font-medium text-slate-600 dark:text-slate-400">{IMPACT_LABELS[imp]}</div>
              ))}
              {[5, 4, 3, 2, 1].map((lik) => (
                <div key={lik} className="contents">
                  <div className="flex items-center justify-center p-1 font-medium text-slate-600 dark:text-slate-400">{LIKELIHOOD_LABELS[lik]}</div>
                  {[1, 2, 3, 4, 5].map((imp) => {
                    const score = lik * imp
                    const level = calculateRiskLevel(score)
                    const risksInCell = risks.filter((r) => r.likelihood === lik && r.impact === imp)
                    return (
                      <div key={`${lik}-${imp}`} className={cn(
                        'flex items-center justify-center rounded p-2 text-xs font-bold',
                        level === 'critical' ? 'bg-red-200 text-red-900 dark:bg-red-900/40 dark:text-red-300' :
                        level === 'high' ? 'bg-orange-200 text-orange-900 dark:bg-orange-900/40 dark:text-orange-300' :
                        level === 'medium' ? 'bg-amber-200 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300' :
                        'bg-green-200 text-green-900 dark:bg-green-900/40 dark:text-green-300',
                      )}>
                        {risksInCell.length > 0 ? `${score} (${risksInCell.length})` : score}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="mb-3 flex flex-wrap gap-2">
        {(['all', 'safety', 'operational', 'compliance', 'financial', 'strategic'] as const).map((c) => (
          <button key={c} onClick={() => setFilterCategory(c)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterCategory === c ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
            {c === 'all' ? 'الكل' : `${RISK_CATEGORY_CONFIG[c].emoji} ${RISK_CATEGORY_CONFIG[c].label}`}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map((l) => (
          <button key={l} onClick={() => setFilterLevel(l)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterLevel === l ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
            {l === 'all' ? 'جميع المستويات' : RISK_LEVEL_CONFIG[l].label}
          </button>
        ))}
      </div>

      {/* Risk cards */}
      <div className="space-y-3">
        {filtered.map((risk) => {
          const levelConfig = RISK_LEVEL_CONFIG[risk.riskLevel]
          const catConfig = RISK_CATEGORY_CONFIG[risk.category]
          const statusConfig = RISK_STATUS_CONFIG[risk.status]
          const responseConfig = RISK_RESPONSE_CONFIG[risk.responseStrategy]
          return (
            <Card key={risk.id} className={cn(risk.riskLevel === 'critical' && 'border-r-4 border-r-red-500', risk.riskLevel === 'high' && 'border-r-4 border-r-orange-500')}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={levelConfig.color}>{risk.riskScore} — {levelConfig.label}</Badge>
                    <Badge variant="outline">{catConfig.emoji} {catConfig.label}</Badge>
                    <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    <code className="text-xs text-slate-500">{risk.riskCode}</code>
                  </div>
                  <h3 className="mt-1.5 font-bold text-slate-900 dark:text-white">{risk.titleAr}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{risk.description}</p>
                  {risk.mitigationAction && (
                    <p className="mt-1 text-xs text-teal">{responseConfig.emoji} {risk.mitigationAction}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>👤 {risk.riskOwner}</span>
                    <span>🏢 {risk.department}</span>
                    <span>📊 احتمالية {risk.likelihood} × أثر {risk.impact}</span>
                    {risk.nextReviewDate && <span>📅 مراجعة: {risk.nextReviewDate}</span>}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد مخاطر</div>}
      </div>
    </>
  )
}

// ─── Compliance Section ─────────────────────────────────────────

function ComplianceSection() {
  const [requirements] = useState(DEMO_COMPLIANCE)
  const [filterStatus, setFilterStatus] = useState<ComplianceStatus | 'all'>('all')

  const filtered = filterStatus === 'all' ? requirements : requirements.filter((r) => r.complianceStatus === filterStatus)
  const avgScore = Math.round(requirements.reduce((s, r) => s + r.complianceScore, 0) / requirements.length)

  const stats = {
    total: requirements.length,
    compliant: requirements.filter((r) => r.complianceStatus === 'compliant').length,
    partial: requirements.filter((r) => r.complianceStatus === 'partial').length,
    nonCompliant: requirements.filter((r) => r.complianceStatus === 'non_compliant').length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard title="متوسط الامتثال" value={`${avgScore}%`} accent={avgScore >= 80 ? 'teal' : avgScore >= 50 ? 'gold' : 'danger'} />
        <StatCard title="إجمالي المتطلبات" value={stats.total} accent="navy" />
        <StatCard title="ممتثل" value={stats.compliant} accent="teal" />
        <StatCard title="جزئي" value={stats.partial} accent="gold" />
        <StatCard title="غير ممتثل" value={stats.nonCompliant} accent="danger" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'compliant', 'partial', 'non_compliant', 'pending'] as const).map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterStatus === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
            {s === 'all' ? 'الكل' : `${COMPLIANCE_STATUS_CONFIG[s].emoji} ${COMPLIANCE_STATUS_CONFIG[s].label}`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((req) => {
          const statusConfig = COMPLIANCE_STATUS_CONFIG[req.complianceStatus]
          return (
            <Card key={req.id} className={cn(req.complianceStatus === 'non_compliant' && 'border-r-4 border-r-red-500')}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono dark:bg-slate-800">{req.requirementCode}</code>
                    <Badge className={statusConfig.color}>{statusConfig.emoji} {statusConfig.label}</Badge>
                    <Badge variant="outline">{req.standardName}</Badge>
                  </div>
                  <h3 className="mt-1.5 font-bold text-slate-900 dark:text-white">{req.titleAr}</h3>

                  {/* Score bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className={cn('h-full rounded-full', req.complianceScore >= 80 ? 'bg-emerald-500' : req.complianceScore >= 50 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${req.complianceScore}%` }} />
                    </div>
                    <span className="text-xs font-bold">{req.complianceScore}%</span>
                  </div>

                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span>🏢 {req.responsibleDepartment}</span>
                    {req.lastAuditDate && <span>📅 آخر تدقيق: {req.lastAuditDate}</span>}
                    {req.dueDate && <span>⏰ الموعد: {req.dueDate}</span>}
                  </div>
                  {req.evidenceNotes && <p className="mt-1 text-xs text-emerald-600">📎 {req.evidenceNotes}</p>}
                  {req.gapDescription && <p className="mt-1 text-xs text-red-600">⚠️ {req.gapDescription}</p>}
                  {req.remediationPlan && <p className="mt-1 text-xs text-blue-600">🔧 {req.remediationPlan}</p>}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}

// ─── Safety Section ─────────────────────────────────────────────

function SafetySection() {
  const [incidents] = useState(DEMO_SAFETY)
  const [filterType, setFilterType] = useState<SafetyIncidentType | 'all'>('all')

  const filtered = filterType === 'all' ? incidents : incidents.filter((i) => i.incidentType === filterType)

  const stats = {
    total: incidents.length,
    open: incidents.filter((i) => i.status !== 'closed').length,
    injuries: incidents.reduce((s, i) => s + (i.injuries || 0), 0),
    nearMiss: incidents.filter((i) => i.incidentType === 'near_miss').length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الحوادث" value={stats.total} accent="navy" />
        <StatCard title="مفتوح" value={stats.open} accent="danger" />
        <StatCard title="الإصابات" value={stats.injuries} accent="gold" />
        <StatCard title="حوادث وشيكة" value={stats.nearMiss} accent="teal" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterType('all')} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>الكل</button>
          {Object.entries(SAFETY_INCIDENT_TYPE_CONFIG).map(([key, config]) => (
            <button key={key} onClick={() => setFilterType(key as SafetyIncidentType)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === key ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
              {config.emoji} {config.label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />}>تسجيل حادث</Button>
      </div>

      <div className="space-y-3">
        {filtered.map((incident) => {
          const typeConfig = SAFETY_INCIDENT_TYPE_CONFIG[incident.incidentType]
          const sevConfig = SAFETY_SEVERITY_CONFIG[incident.severity]
          const statusConfig = SAFETY_STATUS_CONFIG[incident.status]
          return (
            <Card key={incident.id} className={cn(incident.severity === 'critical' && 'border-r-4 border-r-red-500', incident.severity === 'major' && 'border-r-4 border-r-orange-500')}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-xl">{typeConfig.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={sevConfig.color}>{sevConfig.label}</Badge>
                    <Badge variant="outline">{typeConfig.label}</Badge>
                    <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    {incident.injuries && incident.injuries > 0 && <Badge variant="danger">🤕 {incident.injuries} إصابة</Badge>}
                  </div>
                  <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">{incident.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span>📅 {incident.incidentDate}</span>
                    <span>📍 {incident.location}</span>
                    <span>👤 {incident.reportedBy}</span>
                  </div>
                  {incident.rootCause && <p className="mt-1 text-xs text-red-600">🔍 {incident.rootCause}</p>}
                  {incident.correctiveActions && <p className="mt-1 text-xs text-emerald-600">✅ {incident.correctiveActions}</p>}
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد حوادث</div>}
      </div>
    </>
  )
}
