import { useState } from 'react'
import { ShieldCheck, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge, Input, Select, Modal, Tabs, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  RISK_CATEGORY_CONFIG, RISK_LEVEL_CONFIG, RISK_STATUS_CONFIG, RISK_RESPONSE_CONFIG,
  LIKELIHOOD_LABELS, IMPACT_LABELS, calculateRiskLevel,
  COMPLIANCE_STATUS_CONFIG,
  SAFETY_INCIDENT_TYPE_CONFIG, SAFETY_SEVERITY_CONFIG, SAFETY_STATUS_CONFIG,
  ABUSE_TYPE_CONFIG, ABUSE_SEVERITY_CONFIG, PERPETRATOR_TYPE_CONFIG, INVESTIGATION_STATUS_CONFIG,
  type Risk, type RiskCategory, type RiskLevel, type RiskStatus,
  type ComplianceRequirement, type ComplianceStatus,
  type SafetyIncident, type SafetyIncidentType,
} from '../types'
import { useRisks, useComplianceRequirements, useSafetyIncidents } from '../api/grc-queries'
import { useAbuseReports } from '../api/abuse-queries'

// ─── Main Page ──────────────────────────────────────────────────

export function GRCPage() {
  const [activeTab, setActiveTab] = useState('risks')

  const tabs = [
    { id: 'risks', label: 'سجل المخاطر' },
    { id: 'compliance', label: 'الامتثال' },
    { id: 'safety', label: 'السلامة' },
    { id: 'abuse', label: 'بلاغات العنف' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="الحوكمة والمخاطر والامتثال" description="إدارة المخاطر وضمان الامتثال وسلامة المنشأة" icon={<ShieldCheck className="h-5 w-5" />} />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === 'risks' && <RiskSection />}
        {activeTab === 'compliance' && <ComplianceSection />}
        {activeTab === 'safety' && <SafetySection />}
        {activeTab === 'abuse' && <AbuseSection />}
      </div>
    </div>
  )
}

// ─── Risk Section ───────────────────────────────────────────────

function RiskSection() {
  const { data: risks = [], isLoading, error } = useRisks()
  const [filterLevel, setFilterLevel] = useState<RiskLevel | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<RiskCategory | 'all'>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (risks.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد مخاطر مسجلة في السجل حاليا" />

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
            <Card key={risk.id} className={cn(risk.riskLevel === 'critical' && 'border-s-4 border-s-red-500', risk.riskLevel === 'high' && 'border-s-4 border-s-orange-500')}>
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
  const { data: requirements = [], isLoading, error } = useComplianceRequirements()
  const [filterStatus, setFilterStatus] = useState<ComplianceStatus | 'all'>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (requirements.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد متطلبات امتثال مسجلة حاليا" />

  const filtered = filterStatus === 'all' ? requirements : requirements.filter((r) => r.complianceStatus === filterStatus)
  const avgScore = requirements.length > 0 ? Math.round(requirements.reduce((s, r) => s + r.complianceScore, 0) / requirements.length) : 0

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
            <Card key={req.id} className={cn(req.complianceStatus === 'non_compliant' && 'border-s-4 border-s-red-500')}>
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
  const { data: incidents = [], isLoading, error } = useSafetyIncidents()
  const [filterType, setFilterType] = useState<SafetyIncidentType | 'all'>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (incidents.length === 0) return <EmptyState title="لا توجد بيانات" description="لا توجد حوادث سلامة مسجلة حاليا" />

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
            <Card key={incident.id} className={cn(incident.severity === 'critical' && 'border-s-4 border-s-red-500', incident.severity === 'major' && 'border-s-4 border-s-orange-500')}>
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

// ─── Abuse Reporting Section ─────────────────────────────────────

function AbuseSection() {
  const { data: reports = [], isLoading, error } = useAbuseReports()
  const [filterStatus, setFilterStatus] = useState<string>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if (reports.length === 0) return <EmptyState title="لا توجد بلاغات" description="لم يتم تسجيل أي بلاغات عنف أو إيذاء" />

  const filtered = filterStatus === 'all' ? reports : reports.filter((r) => r.investigation_status === filterStatus)

  const stats = {
    total: reports.length,
    minor: reports.filter((r) => r.severity === 'minor').length,
    moderate: reports.filter((r) => r.severity === 'moderate').length,
    severe: reports.filter((r) => r.severity === 'severe' || r.severity === 'critical').length,
    investigating: reports.filter((r) => r.investigation_status === 'investigating').length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard title="إجمالي البلاغات" value={stats.total} accent="navy" />
        <StatCard title="بسيط" value={stats.minor} accent="teal" />
        <StatCard title="متوسط" value={stats.moderate} accent="gold" />
        <StatCard title="شديد/حرج" value={stats.severe} accent="danger" />
        <StatCard title="قيد التحقيق" value={stats.investigating} accent="navy" />
      </div>

      {/* Status Filter */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterStatus === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
          >
            الكل
          </button>
          {Object.entries(INVESTIGATION_STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterStatus === key ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
            >
              {config.label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />}>
          تسجيل بلاغ
        </Button>
      </div>

      {/* Abuse Report Cards */}
      <div className="space-y-3">
        {filtered.map((report) => {
          const typeConfig = ABUSE_TYPE_CONFIG[report.abuse_type]
          const sevConfig = ABUSE_SEVERITY_CONFIG[report.severity]
          const statusConfig = INVESTIGATION_STATUS_CONFIG[report.investigation_status]
          const perpConfig = report.perpetrator_type ? PERPETRATOR_TYPE_CONFIG[report.perpetrator_type] : null

          return (
            <Card
              key={report.id}
              className={cn(
                report.severity === 'severe' && 'border-s-4 border-s-orange-500',
                report.severity === 'critical' && 'border-s-4 border-s-red-500',
                report.investigation_status === 'referred_to_authorities' && 'border-s-4 border-s-red-600',
              )}
            >
              <div className="space-y-3">
                {/* Header badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg">{typeConfig?.emoji}</span>
                  <Badge className={typeConfig?.color ?? ''}>{typeConfig?.label ?? report.abuse_type}</Badge>
                  <Badge className={sevConfig?.color ?? ''}>{sevConfig?.label ?? report.severity}</Badge>
                  <Badge className={statusConfig?.color ?? ''}>{statusConfig?.label ?? report.investigation_status}</Badge>
                  {report.medical_examination_done && (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">🏥 فحص طبي</Badge>
                  )}
                  {report.authority_notified && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">⚠️ مُبلّغ للجهات</Badge>
                  )}
                </div>

                {/* Description */}
                {report.description && (
                  <p className="text-sm text-slate-700 dark:text-slate-300">{report.description}</p>
                )}

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>📅 {report.report_date}</span>
                  {report.report_time && <span>🕐 {report.report_time}</span>}
                  {report.location_in_facility && <span>📍 {report.location_in_facility}</span>}
                  {perpConfig && <span>👤 {perpConfig.label}</span>}
                  <span>المُبلّغ: {report.reported_by}</span>
                </div>

                {/* Medical report */}
                {report.medical_report && (
                  <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/10">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-1">التقرير الطبي:</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-300">{report.medical_report}</p>
                  </div>
                )}

                {/* Authority reference */}
                {report.authority_notified && report.authority_reference && (
                  <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                    <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">مرجع الجهة المختصة:</p>
                    <p className="text-xs font-mono text-red-600 dark:text-red-300">{report.authority_reference}</p>
                  </div>
                )}

                {/* Immediate Actions */}
                {report.immediate_actions.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">الإجراءات الفورية:</p>
                    <div className="space-y-0.5">
                      {report.immediate_actions.map((action) => (
                        <p key={action} className="text-xs text-slate-600 dark:text-slate-400">• {action}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Actions */}
                {report.follow_up_actions.length > 0 && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-slate-500">إجراءات المتابعة:</p>
                    <div className="space-y-1">
                      {(report.follow_up_actions as Array<{ action: string; status: string; date: string | null }>).map((fa) => (
                        <div key={`${fa.action}-${fa.status}`} className="flex items-center gap-2 text-xs">
                          <span className={cn(
                            'inline-block h-2 w-2 rounded-full',
                            fa.status === 'completed' ? 'bg-emerald-500' : fa.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-400',
                          )} />
                          <span className="text-slate-600 dark:text-slate-400">{fa.action}</span>
                          {fa.date && <span className="text-slate-400">({fa.date})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investigation notes */}
                {report.investigation_notes && (
                  <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/10">
                    <p className="text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">ملاحظات التحقيق:</p>
                    <p className="text-xs text-purple-600 dark:text-purple-300">{report.investigation_notes}</p>
                  </div>
                )}

                {/* Witnesses */}
                {report.witness_names.length > 0 && (
                  <p className="text-xs text-slate-400">
                    الشهود: {report.witness_names.join('، ')}
                  </p>
                )}
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد بلاغات</div>}
      </div>
    </>
  )
}
