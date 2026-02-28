import { useState } from 'react'
import { Shield, FileText, Search, Plus, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Eye } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, CardHeader, CardTitle, Badge, Input, Select, Modal, Tabs } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  NCR_SEVERITY_CONFIG, NCR_STATUS_CONFIG, CAPA_TYPE_CONFIG, CAPA_STATUS_CONFIG,
  FINDING_TYPE_CONFIG, AUDIT_STATUS_CONFIG,
  OVR_CATEGORY_CONFIG, OVR_SEVERITY_CONFIG,
  DEPARTMENTS,
  type NCR, type NcrSeverity, type NcrStatus,
  type AuditCycle, type AuditFinding,
  type OvrReport, type OvrCategory, type OvrSeverity,
} from '../types'

// ─── Demo Data ──────────────────────────────────────────────────

const DEMO_NCRS: NCR[] = [
  {
    id: 'ncr1', title: 'قصور في نظام السلامة من الحرائق', description: 'عدم تحديث كاشفات الدخان في الجناح B منذ 2019',
    isoClause: '7.1.3 / 8.5.1', department: 'الصيانة والتشغيل', severity: 'critical', status: 'in_progress',
    reportedBy: 'فريق التدقيق', reportedDate: '2026-01-15', dueDate: '2026-03-30',
    rootCause: 'عدم تحديث منظومة الحرائق منذ 2019 وغياب جدول صيانة دوري',
    capas: [
      { id: 'c1', type: 'corrective', description: 'استبدال كاشفات الدخان في الجناح B فوراً', assignedTo: 'مهندس الصيانة', dueDate: '2026-02-28', status: 'completed', completionDate: '2026-02-10', evidence: 'تقرير فني + صور التركيب' },
      { id: 'c2', type: 'corrective', description: 'تركيب نظام Sprinkler في أجنحة الإيواء', assignedTo: 'شركة السلامة', dueDate: '2026-03-30', status: 'in_progress' },
      { id: 'c3', type: 'preventive', description: 'إنشاء جدول صيانة ربع سنوي لأنظمة الحرائق', assignedTo: 'مشرف الصيانة', dueDate: '2026-03-15', status: 'pending' },
    ],
  },
  {
    id: 'ncr2', title: 'فجوات في توثيق العمليات الابتكارية', description: 'غياب إجراءات موحدة لتوثيق عمليات التطوير والابتكار',
    isoClause: '8.3 / 7.5', department: 'الجودة وتطوير الأداء', severity: 'major', status: 'action_planned',
    reportedBy: 'مدقق خارجي', reportedDate: '2026-02-01', dueDate: '2026-06-30',
    capas: [
      { id: 'c4', type: 'corrective', description: 'إعداد SOP لتوثيق العمليات الابتكارية', assignedTo: 'مدير الجودة', dueDate: '2026-04-30', status: 'in_progress' },
      { id: 'c5', type: 'preventive', description: 'تدريب الموظفين على نظام التوثيق الجديد', assignedTo: 'قسم التدريب', dueDate: '2026-05-30', status: 'pending' },
    ],
  },
  {
    id: 'ncr3', title: 'انقطاع التواصل الاستراتيجي مع الوزارة', description: 'عدم إرسال التقارير الدورية في المواعيد المحددة',
    isoClause: '5.1 / 7.4', department: 'الإدارة العليا', severity: 'major', status: 'in_progress',
    reportedBy: 'مدير المركز', reportedDate: '2026-02-10', dueDate: '2026-03-31',
    capas: [
      { id: 'c6', type: 'corrective', description: 'إنشاء تقويم ثابت لإرسال التقارير', assignedTo: 'السكرتارية', dueDate: '2026-03-01', status: 'completed', completionDate: '2026-02-25' },
    ],
  },
  {
    id: 'ncr4', title: 'نقص في سجلات التدريب على مكافحة العدوى', description: 'عدم وجود سجلات تدريب محدثة لـ 8 موظفين',
    isoClause: '7.2', department: 'مكافحة العدوى', severity: 'minor', status: 'verification',
    reportedBy: 'مسؤول IPC', reportedDate: '2026-02-20', dueDate: '2026-03-15',
    capas: [
      { id: 'c7', type: 'corrective', description: 'عقد دورات تدريبية فورية للموظفين المعنيين', assignedTo: 'مسؤول IPC', dueDate: '2026-03-10', status: 'completed', completionDate: '2026-03-05' },
    ],
  },
]

const DEMO_AUDITS: AuditCycle[] = [
  {
    id: 'aud1', cycleName: 'تدقيق الربع الأول 2026', cycleYear: 2026, cycleQuarter: 1,
    leadAuditor: 'أ. محمد الجودة', status: 'in_progress',
    plannedStartDate: '2026-02-01', plannedEndDate: '2026-03-31',
    scope: 'بنود 4-7 من ISO 9001:2015',
    findings: [
      { id: 'f1', findingType: 'major_nc', isoClause: '7.1.3', department: 'الصيانة والتشغيل', description: 'عدم توفر سجلات صيانة وقائية لبعض المعدات الحرجة', status: 'action_planned', responsiblePerson: 'مشرف الصيانة', dueDate: '2026-03-15' },
      { id: 'f2', findingType: 'minor_nc', isoClause: '7.5', department: 'الخدمات الاجتماعية', description: 'بعض النماذج لا تحمل رقم إصدار محدث', status: 'in_progress', responsiblePerson: 'مدير الخدمات', dueDate: '2026-03-20' },
      { id: 'f3', findingType: 'observation', isoClause: '6.1', department: 'الموارد البشرية', description: 'فرصة لتحسين آلية تحديد المخاطر في خطط التوظيف', status: 'open' },
      { id: 'f4', findingType: 'strength', isoClause: '5.2', department: 'الإدارة العليا', description: 'سياسة الجودة واضحة ومنتشرة بين الموظفين', status: 'closed' },
      { id: 'f5', findingType: 'opportunity', isoClause: '9.1', department: 'الجودة وتطوير الأداء', description: 'إمكانية أتمتة تقارير الأداء الشهرية', status: 'open' },
    ],
  },
  {
    id: 'aud2', cycleName: 'تدقيق الربع الرابع 2025', cycleYear: 2025, cycleQuarter: 4,
    leadAuditor: 'أ. سارة المالكي', status: 'completed',
    plannedStartDate: '2025-10-01', plannedEndDate: '2025-12-15',
    scope: 'بنود 8-10 من ISO 9001:2015',
    findings: [
      { id: 'f6', findingType: 'minor_nc', isoClause: '8.5.1', department: 'الخدمات الطبية', description: 'تأخر في تحديث بعض البروتوكولات الطبية', status: 'closed', correctiveAction: 'تم تحديث جميع البروتوكولات' },
      { id: 'f7', findingType: 'strength', isoClause: '10.2', department: 'الجودة وتطوير الأداء', description: 'نظام NCR/CAPA فعال ومتابع بشكل منتظم', status: 'closed' },
    ],
  },
]

const DEMO_OVRS: OvrReport[] = [
  { id: 'ovr1', incidentDate: '2026-02-26', description: 'تأخر في إعطاء جرعة الأنسولين الصباحية بسبب عدم توفر الممرضة في القسم', category: 'medication_error', severity: 'minor', isAnonymous: false, reporterName: 'ممرض: سعيد', status: 'closed', justCultureCategory: 'human_error', lessonsLearned: 'ضرورة وجود ممرض احتياطي في كل وردية' },
  { id: 'ovr2', incidentDate: '2026-02-24', description: 'سقوط مستفيد أثناء محاولة النهوض من السرير بدون مساعدة', category: 'fall', severity: 'moderate', isAnonymous: false, reporterName: 'هند المحمد', status: 'investigating', justCultureCategory: 'human_error' },
  { id: 'ovr3', incidentDate: '2026-02-20', description: 'ملاحظة أرضية مبللة بالقرب من الحمام بدون لافتة تحذيرية', category: 'fall', severity: 'near_miss', isAnonymous: true, status: 'closed', lessonsLearned: 'تركيب لافتات تحذيرية دائمة وحساسات رطوبة' },
  { id: 'ovr4', incidentDate: '2026-02-18', description: 'سلوك عنيف من مستفيد تجاه زميله أثناء النشاط الجماعي', category: 'behavioral', severity: 'moderate', isAnonymous: false, reporterName: 'نورة العتيبي', status: 'closed', justCultureCategory: 'at_risk_behavior' },
]

// ─── Main Page ──────────────────────────────────────────────────

export function QualityPage() {
  const [activeTab, setActiveTab] = useState('ncr')

  const tabs = [
    { id: 'ncr', label: 'NCR / CAPA' },
    { id: 'audits', label: 'التدقيق الداخلي' },
    { id: 'ovr', label: 'تقارير الانحراف' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="إدارة الجودة" description="عدم المطابقة والتدقيق الداخلي وتقارير الانحراف" icon={<Shield className="h-5 w-5" />} />
      <Tabs tabs={tabs.map((t) => ({ id: t.id, label: t.label }))} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-6">
        {activeTab === 'ncr' && <NcrSection />}
        {activeTab === 'audits' && <AuditSection />}
        {activeTab === 'ovr' && <OvrSection />}
      </div>
    </div>
  )
}

// ─── NCR Section ────────────────────────────────────────────────

function NcrSection() {
  const [ncrs] = useState(DEMO_NCRS)
  const [filterSeverity, setFilterSeverity] = useState<NcrSeverity | 'all'>('all')
  const [expandedNcr, setExpandedNcr] = useState<string | null>(null)

  const filtered = filterSeverity === 'all' ? ncrs : ncrs.filter((n) => n.severity === filterSeverity)

  const allCapas = ncrs.flatMap((n) => n.capas)
  const stats = {
    total: ncrs.length,
    open: ncrs.filter((n) => n.status !== 'closed').length,
    totalCapas: allCapas.length,
    completedCapas: allCapas.filter((c) => c.status === 'completed' || c.status === 'verified').length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي NCR" value={stats.total} accent="navy" />
        <StatCard title="مفتوح" value={stats.open} accent="danger" />
        <StatCard title="إجراءات CAPA" value={stats.totalCapas} accent="gold" />
        <StatCard title="CAPA مكتمل" value={stats.completedCapas} accent="teal" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'critical', 'major', 'minor', 'observation'] as const).map((s) => (
          <button key={s} onClick={() => setFilterSeverity(s)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterSeverity === s ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
            {s === 'all' ? 'الكل' : `${NCR_SEVERITY_CONFIG[s].emoji} ${NCR_SEVERITY_CONFIG[s].label}`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((ncr) => {
          const sevConfig = NCR_SEVERITY_CONFIG[ncr.severity]
          const statusConfig = NCR_STATUS_CONFIG[ncr.status]
          const isExpanded = expandedNcr === ncr.id
          const capaProgress = ncr.capas.length > 0 ? Math.round((ncr.capas.filter((c) => c.status === 'completed' || c.status === 'verified').length / ncr.capas.length) * 100) : 0

          return (
            <Card key={ncr.id} className={cn(ncr.severity === 'critical' && 'border-r-4 border-r-red-500')}>
              <div className="cursor-pointer" onClick={() => setExpandedNcr(isExpanded ? null : ncr.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={sevConfig.color}>{sevConfig.emoji} {sevConfig.label}</Badge>
                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      <code className="text-xs text-slate-500">ISO {ncr.isoClause}</code>
                    </div>
                    <h3 className="mt-1.5 font-bold text-slate-900 dark:text-white">{ncr.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>🏢 {ncr.department}</span>
                      <span>📅 {ncr.reportedDate}</span>
                      <span>⏰ {ncr.dueDate}</span>
                    </div>
                    {/* CAPA progress */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <div className={cn('h-full rounded-full', capaProgress >= 100 ? 'bg-emerald-500' : 'bg-teal')} style={{ width: `${capaProgress}%` }} />
                      </div>
                      <span className="text-xs text-slate-500">CAPA {capaProgress}%</span>
                    </div>
                  </div>
                  <button className="mt-1 text-slate-400">{isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-4 space-y-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">{ncr.description}</p>
                      {ncr.rootCause && (
                        <div className="rounded-lg bg-red-50 p-3 dark:bg-red-900/10">
                          <h4 className="text-xs font-bold text-red-700 dark:text-red-400">السبب الجذري (RCA)</h4>
                          <p className="mt-1 text-sm text-red-600 dark:text-red-300">{ncr.rootCause}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">الإجراءات (CAPA)</h4>
                        <div className="space-y-2">
                          {ncr.capas.map((capa) => {
                            const typeConfig = CAPA_TYPE_CONFIG[capa.type]
                            const capaStatusConfig = CAPA_STATUS_CONFIG[capa.status]
                            return (
                              <div key={capa.id} className="flex items-start justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 text-xs">
                                    <Badge variant="outline">{typeConfig.emoji} {typeConfig.label}</Badge>
                                    <Badge className={capaStatusConfig.color}>{capaStatusConfig.label}</Badge>
                                  </div>
                                  <p className="mt-1 text-sm">{capa.description}</p>
                                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                                    <span>👤 {capa.assignedTo}</span>
                                    <span>📅 {capa.dueDate}</span>
                                    {capa.evidence && <span className="text-emerald-600">📎 {capa.evidence}</span>}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
      </div>
    </>
  )
}

// ─── Audit Section ──────────────────────────────────────────────

function AuditSection() {
  const [audits] = useState(DEMO_AUDITS)
  const [expandedAudit, setExpandedAudit] = useState<string | null>(DEMO_AUDITS[0].id)

  const allFindings = audits.flatMap((a) => a.findings)
  const stats = {
    cycles: audits.length,
    findings: allFindings.length,
    majorNc: allFindings.filter((f) => f.findingType === 'major_nc').length,
    strengths: allFindings.filter((f) => f.findingType === 'strength').length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="دورات التدقيق" value={stats.cycles} accent="navy" />
        <StatCard title="إجمالي النتائج" value={stats.findings} accent="gold" />
        <StatCard title="عدم مطابقة رئيسي" value={stats.majorNc} accent="danger" />
        <StatCard title="نقاط قوة" value={stats.strengths} accent="teal" />
      </div>

      <div className="space-y-4">
        {audits.map((audit) => {
          const statusConfig = AUDIT_STATUS_CONFIG[audit.status]
          const isExpanded = expandedAudit === audit.id
          return (
            <Card key={audit.id}>
              <div className="cursor-pointer" onClick={() => setExpandedAudit(isExpanded ? null : audit.id)}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white">{audit.cycleName}</h3>
                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span>👤 {audit.leadAuditor}</span>
                      <span>📅 {audit.plannedStartDate} — {audit.plannedEndDate}</span>
                      <span>📊 {audit.findings.length} نتيجة</span>
                    </div>
                    {audit.scope && <p className="mt-1 text-xs text-slate-400">{audit.scope}</p>}
                  </div>
                  <button className="text-slate-400">{isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}</button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                      {audit.findings.map((finding) => {
                        const fConfig = FINDING_TYPE_CONFIG[finding.findingType]
                        return (
                          <div key={finding.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
                            <span className="mt-0.5 text-lg">{fConfig.emoji}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <Badge className={fConfig.color}>{fConfig.label}</Badge>
                                <code className="text-xs text-slate-500">ISO {finding.isoClause}</code>
                                <span className="text-xs text-slate-500">🏢 {finding.department}</span>
                              </div>
                              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{finding.description}</p>
                              {finding.correctiveAction && <p className="mt-1 text-xs text-emerald-600">✅ {finding.correctiveAction}</p>}
                              {finding.responsiblePerson && <span className="text-xs text-slate-500">👤 {finding.responsiblePerson} — ⏰ {finding.dueDate}</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
      </div>
    </>
  )
}

// ─── OVR Section ────────────────────────────────────────────────

function OvrSection() {
  const [reports] = useState(DEMO_OVRS)
  const [filterCategory, setFilterCategory] = useState<OvrCategory | 'all'>('all')

  const filtered = filterCategory === 'all' ? reports : reports.filter((r) => r.category === filterCategory)

  const stats = {
    total: reports.length,
    open: reports.filter((r) => r.status !== 'closed').length,
    nearMiss: reports.filter((r) => r.severity === 'near_miss').length,
    anonymous: reports.filter((r) => r.isAnonymous).length,
  }

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي التقارير" value={stats.total} accent="navy" />
        <StatCard title="مفتوح" value={stats.open} accent="danger" />
        <StatCard title="حوادث وشيكة" value={stats.nearMiss} accent="gold" />
        <StatCard title="تقارير مجهولة" value={stats.anonymous} accent="teal" />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterCategory('all')} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterCategory === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>الكل</button>
          {Object.entries(OVR_CATEGORY_CONFIG).map(([key, config]) => (
            <button key={key} onClick={() => setFilterCategory(key as OvrCategory)} className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterCategory === key ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}>
              {config.emoji} {config.label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />}>تقرير جديد</Button>
      </div>

      <div className="space-y-3">
        {filtered.map((report) => {
          const catConfig = OVR_CATEGORY_CONFIG[report.category]
          const sevConfig = OVR_SEVERITY_CONFIG[report.severity]
          return (
            <Card key={report.id} className={cn(report.severity === 'sentinel' && 'border-r-4 border-r-red-500', report.severity === 'major' && 'border-r-4 border-r-orange-500')}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-xl">{catConfig.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={sevConfig.color}>{sevConfig.label}</Badge>
                    <Badge variant="outline">{catConfig.label}</Badge>
                    {report.isAnonymous && <Badge variant="outline">🔒 مجهول</Badge>}
                    <Badge className={report.status === 'closed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : report.status === 'investigating' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}>
                      {report.status === 'closed' ? 'مغلق' : report.status === 'investigating' ? 'تحقيق' : 'مفتوح'}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">{report.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span>📅 {report.incidentDate}</span>
                    {report.reporterName && <span>👤 {report.reporterName}</span>}
                    {report.justCultureCategory && (
                      <Badge variant="outline">
                        {report.justCultureCategory === 'human_error' ? '⚡ خطأ بشري' : report.justCultureCategory === 'at_risk_behavior' ? '⚠️ سلوك محفوف' : '🚨 سلوك متهور'}
                      </Badge>
                    )}
                  </div>
                  {report.lessonsLearned && (
                    <div className="mt-2 rounded-lg bg-blue-50 p-2 dark:bg-blue-900/10">
                      <p className="text-xs text-blue-700 dark:text-blue-400">💡 الدروس المستفادة: {report.lessonsLearned}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد تقارير</div>}
      </div>
    </>
  )
}
