import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, ClipboardCheck, Syringe, AlertTriangle, Bug, Eye,
  CheckCircle, XCircle, Plus, X, ChevronDown, ChevronUp,
} from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge, Button, Modal, Tabs } from '@/components/ui'
import {
  INSPECTION_CATEGORY_CONFIG, SHIFT_CONFIG, IPC_LOCATIONS, DEFAULT_CHECKLIST,
  calculateComplianceScore,
  IPC_INCIDENT_CATEGORY_CONFIG, IPC_SEVERITY_CONFIG, IPC_STATUS_CONFIG,
  IMMUNITY_STATUS_CONFIG, VACCINE_TYPES,
  OUTBREAK_SEVERITY_CONFIG, CONTAINMENT_STATUS_CONFIG,
  type IPCInspection, type IPCIncident, type ImmunizationRecord, type Outbreak,
  type IPCIncidentCategory, type IPCIncidentStatus, type ImmunityStatus,
  type ChecklistItem, type InspectionShift,
} from '../types'

// ── Demo Data ───────────────────────────────────────────────────

const DEMO_INSPECTIONS: IPCInspection[] = [
  { id: '1', date: '2026-02-28', shift: 'morning', inspector: 'أ. نورة الشمري', location: 'جناح الذكور أ', complianceScore: 87, items: [], notes: 'ملاحظة بسيطة على نظافة الأسطح', followUpRequired: false },
  { id: '2', date: '2026-02-28', shift: 'morning', inspector: 'أ. ريم العتيبي', location: 'العيادة الطبية', complianceScore: 95, items: [], followUpRequired: false },
  { id: '3', date: '2026-02-27', shift: 'evening', inspector: 'أ. فهد المالكي', location: 'جناح الإناث أ', complianceScore: 72, items: [], notes: 'نقص في المعقمات', followUpRequired: true },
  { id: '4', date: '2026-02-27', shift: 'night', inspector: 'أ. سارة المحمد', location: 'المطبخ', complianceScore: 91, items: [], followUpRequired: false },
  { id: '5', date: '2026-02-26', shift: 'morning', inspector: 'أ. نورة الشمري', location: 'الصيدلية', complianceScore: 68, items: [], notes: 'عدم فصل النفايات بشكل صحيح', followUpRequired: true },
]

const DEMO_INCIDENTS: IPCIncident[] = [
  { id: '1', category: 'infection_confirmed', detectionDate: '2026-02-25', affectedType: 'beneficiary', reportedBy: 'د. خالد العمري', location: 'جناح الذكور أ', infectionSite: 'تنفسي', severity: 'moderate', status: 'investigating', isolationRequired: true, description: 'إصابة تنفسية مؤكدة - تم عزل المستفيد', immediateActions: 'عزل + أخذ عينات + إبلاغ الطبيب' },
  { id: '2', category: 'needle_stick', detectionDate: '2026-02-24', affectedType: 'staff', reportedBy: 'أ. ريم العتيبي', location: 'العيادة الطبية', severity: 'mild', status: 'resolved', isolationRequired: false, description: 'وخز إبرة أثناء سحب الدم', immediateActions: 'غسل + تطهير + إبلاغ المشرف' },
  { id: '3', category: 'outbreak_alert', detectionDate: '2026-02-20', affectedType: 'beneficiary', reportedBy: 'د. سارة المحمد', location: 'جناح الإناث أ', severity: 'severe', status: 'containment', isolationRequired: true, description: 'اشتباه تفشي نوروفيروس - 3 حالات', immediateActions: 'عزل الحالات + تنظيف شامل + إبلاغ الوزارة' },
  { id: '4', category: 'colonization', detectionDate: '2026-02-18', affectedType: 'beneficiary', reportedBy: 'أ. فهد المالكي', location: 'جناح الذكور ب', severity: 'mild', status: 'closed', isolationRequired: false, description: 'استعمار MRSA - نتيجة مسحة روتينية', immediateActions: 'احتياطات تلامسية + مراقبة' },
]

const DEMO_IMMUNIZATIONS: ImmunizationRecord[] = [
  { id: '1', personType: 'staff', personName: 'أ. نورة الشمري', vaccineCode: 'HBV', vaccineName: 'التهاب الكبد B', doseNumber: 3, totalDoses: 3, dateAdministered: '2025-11-15', immunityStatus: 'immune', adverseReaction: false },
  { id: '2', personType: 'staff', personName: 'أ. ريم العتيبي', vaccineCode: 'FLU', vaccineName: 'الإنفلونزا', doseNumber: 1, totalDoses: 1, dateAdministered: '2025-10-01', immunityStatus: 'immune', adverseReaction: false },
  { id: '3', personType: 'staff', personName: 'أ. فهد المالكي', vaccineCode: 'HBV', vaccineName: 'التهاب الكبد B', doseNumber: 2, totalDoses: 3, dateAdministered: '2026-01-10', nextDueDate: '2026-07-10', immunityStatus: 'pending', adverseReaction: false },
  { id: '4', personType: 'beneficiary', personName: 'أحمد محمد السالم', vaccineCode: 'FLU', vaccineName: 'الإنفلونزا', doseNumber: 1, totalDoses: 1, dateAdministered: '2025-10-15', immunityStatus: 'immune', adverseReaction: false },
  { id: '5', personType: 'staff', personName: 'د. خالد العمري', vaccineCode: 'COVID', vaccineName: 'كوفيد-19', doseNumber: 2, totalDoses: 2, dateAdministered: '2025-09-20', immunityStatus: 'expired', adverseReaction: false },
  { id: '6', personType: 'beneficiary', personName: 'فاطمة عبدالله', vaccineCode: 'TDAP', vaccineName: 'الكزاز والدفتيريا', doseNumber: 1, totalDoses: 1, dateAdministered: '2026-02-01', immunityStatus: 'immune', adverseReaction: false },
  { id: '7', personType: 'staff', personName: 'أ. سارة المحمد', vaccineCode: 'HBV', vaccineName: 'التهاب الكبد B', doseNumber: 3, totalDoses: 3, dateAdministered: '2025-08-20', immunityStatus: 'immune', adverseReaction: true },
]

const DEMO_OUTBREAKS: Outbreak[] = [
  { id: '1', code: 'OB-2026-001', pathogen: 'Norovirus', severity: 'high', location: 'جناح الإناث أ', staffAffected: 1, beneficiariesAffected: 3, containmentStatus: 'contained', mohNotified: true, detectionDate: '2026-02-20', description: 'تفشي نوروفيروس مع أعراض هضمية' },
  { id: '2', code: 'OB-2026-002', pathogen: 'Influenza A', severity: 'moderate', location: 'جناح الذكور أ', staffAffected: 0, beneficiariesAffected: 2, containmentStatus: 'active', mohNotified: false, detectionDate: '2026-02-26', description: 'حالتان مؤكدتان من إنفلونزا A' },
]

// ── Inspections Tab ─────────────────────────────────────────────

function InspectionsSection() {
  const [showNewInspection, setShowNewInspection] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(DEFAULT_CHECKLIST.map((i) => ({ ...i })))
  const [newLocation, setNewLocation] = useState(IPC_LOCATIONS[0])
  const [newShift, setNewShift] = useState<InspectionShift>('morning')

  const avgCompliance = Math.round(DEMO_INSPECTIONS.reduce((a, i) => a + i.complianceScore, 0) / DEMO_INSPECTIONS.length)
  const followUps = DEMO_INSPECTIONS.filter((i) => i.followUpRequired).length
  const score = calculateComplianceScore(checklist)

  const toggleItem = (id: string, val: boolean) => {
    setChecklist((prev) => prev.map((i) => i.id === id ? { ...i, isCompliant: val } : i))
  }

  const categories = Object.keys(INSPECTION_CATEGORY_CONFIG) as Array<keyof typeof INSPECTION_CATEGORY_CONFIG>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="معدل الامتثال" value={`${avgCompliance}%`} subtitle="هذا الأسبوع" icon={<ShieldCheck className="h-6 w-6" />} accent="teal" />
        <StatCard title="جولات اليوم" value={String(DEMO_INSPECTIONS.filter((i) => i.date === '2026-02-28').length)} subtitle="جولة تفتيش" icon={<ClipboardCheck className="h-6 w-6" />} accent="success" />
        <StatCard title="متابعات معلقة" value={String(followUps)} subtitle="تحتاج إجراء" icon={<AlertTriangle className="h-6 w-6" />} accent="gold" />
        <StatCard title="إجمالي الجولات" value={String(DEMO_INSPECTIONS.length)} subtitle="هذا الشهر" icon={<Eye className="h-6 w-6" />} accent="teal" />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowNewInspection(true)}>
          <Plus className="ml-1.5 h-4 w-4" /> جولة تفتيش جديدة
        </Button>
      </div>

      {/* Inspection History */}
      <AnimatePresence mode="popLayout">
        {DEMO_INSPECTIONS.map((insp) => (
          <motion.div key={insp.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white ${insp.complianceScore >= 90 ? 'bg-emerald-500' : insp.complianceScore >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}>
                    {insp.complianceScore}%
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{insp.location}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{insp.date}</span>
                      <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {SHIFT_CONFIG[insp.shift].emoji} {SHIFT_CONFIG[insp.shift].label}
                      </Badge>
                      <span>{insp.inspector}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {insp.followUpRequired && <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">متابعة مطلوبة</Badge>}
                  {insp.notes && <span className="text-xs text-slate-500" title={insp.notes}>📝</span>}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* New Inspection Modal */}
      <Modal open={showNewInspection} onClose={() => setShowNewInspection(false)} title="جولة تفتيش جديدة">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">الموقع</label>
              <select value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {IPC_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">الوردية</label>
              <select value={newShift} onChange={(e) => setNewShift(e.target.value as InspectionShift)} className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                {Object.entries(SHIFT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
              </select>
            </div>
          </div>

          {/* Score */}
          <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-slate-800">
            <span className="text-sm text-slate-500">نسبة الامتثال: </span>
            <span className={`text-2xl font-bold ${score >= 90 ? 'text-emerald-600' : score >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{score}%</span>
          </div>

          {/* Checklist by category */}
          {categories.map((cat) => {
            const cfg = INSPECTION_CATEGORY_CONFIG[cat]
            const items = checklist.filter((i) => i.category === cat)
            return (
              <div key={cat}>
                <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{cfg.emoji} {cfg.label}</h4>
                <div className="space-y-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2 dark:border-slate-700">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleItem(item.id, true)}
                          className={`rounded p-1 ${item.isCompliant === true ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'text-slate-400 hover:text-emerald-500'}`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleItem(item.id, false)}
                          className={`rounded p-1 ${item.isCompliant === false ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'text-slate-400 hover:text-red-500'}`}
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          <Button className="w-full" onClick={() => setShowNewInspection(false)}>حفظ الجولة</Button>
        </div>
      </Modal>
    </div>
  )
}

// ── Incidents Tab ───────────────────────────────────────────────

function IncidentsSection() {
  const [catFilter, setCatFilter] = useState<IPCIncidentCategory | 'all'>('all')
  const filtered = useMemo(
    () => catFilter === 'all' ? DEMO_INCIDENTS : DEMO_INCIDENTS.filter((i) => i.category === catFilter),
    [catFilter],
  )
  const openCount = DEMO_INCIDENTS.filter((i) => i.status !== 'closed' && i.status !== 'resolved').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="حوادث نشطة" value={String(openCount)} subtitle="تحتاج متابعة" icon={<Bug className="h-6 w-6" />} accent="danger" />
        <StatCard title="إجمالي الحوادث" value={String(DEMO_INCIDENTS.length)} subtitle="هذا الشهر" icon={<AlertTriangle className="h-6 w-6" />} accent="gold" />
        <StatCard title="حالات عزل" value={String(DEMO_INCIDENTS.filter((i) => i.isolationRequired).length)} subtitle="نشطة حالياً" icon={<ShieldCheck className="h-6 w-6" />} accent="teal" />
        <StatCard title="مغلقة" value={String(DEMO_INCIDENTS.filter((i) => i.status === 'closed' || i.status === 'resolved').length)} subtitle="تم الحل" icon={<CheckCircle className="h-6 w-6" />} accent="success" />
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setCatFilter('all')} className={`rounded-full px-3 py-1 text-sm font-medium ${catFilter === 'all' ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
          الكل
        </button>
        {(Object.keys(IPC_INCIDENT_CATEGORY_CONFIG) as IPCIncidentCategory[]).map((cat) => {
          const cfg = IPC_INCIDENT_CATEGORY_CONFIG[cat]
          return (
            <button key={cat} onClick={() => setCatFilter(cat)} className={`rounded-full px-3 py-1 text-sm font-medium ${catFilter === cat ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
              {cfg.emoji} {cfg.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.map((inc) => (
          <motion.div key={inc.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className={`border-r-4 ${inc.severity === 'critical' ? 'border-r-red-500' : inc.severity === 'severe' ? 'border-r-orange-500' : inc.severity === 'moderate' ? 'border-r-amber-500' : 'border-r-green-500'}`}>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{IPC_INCIDENT_CATEGORY_CONFIG[inc.category].emoji}</span>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{IPC_INCIDENT_CATEGORY_CONFIG[inc.category].label}</h3>
                    <Badge className={IPC_SEVERITY_CONFIG[inc.severity].color}>{IPC_SEVERITY_CONFIG[inc.severity].label}</Badge>
                  </div>
                  <Badge className={IPC_STATUS_CONFIG[inc.status].color}>{IPC_STATUS_CONFIG[inc.status].label}</Badge>
                </div>
                <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">{inc.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  <span>{inc.detectionDate}</span>
                  <span>{inc.location}</span>
                  <span>{inc.affectedType === 'beneficiary' ? 'مستفيد' : inc.affectedType === 'staff' ? 'موظف' : 'زائر'}</span>
                  {inc.isolationRequired && <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">عزل مطلوب</Badge>}
                </div>
                {inc.immediateActions && (
                  <div className="mt-2 rounded bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    <span className="font-medium">الإجراءات الفورية:</span> {inc.immediateActions}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Immunizations Tab ───────────────────────────────────────────

function ImmunizationsSection() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'staff' | 'beneficiary'>('all')
  const filtered = useMemo(
    () => typeFilter === 'all' ? DEMO_IMMUNIZATIONS : DEMO_IMMUNIZATIONS.filter((i) => i.personType === typeFilter),
    [typeFilter],
  )

  const immuneCount = DEMO_IMMUNIZATIONS.filter((i) => i.immunityStatus === 'immune').length
  const pendingCount = DEMO_IMMUNIZATIONS.filter((i) => i.immunityStatus === 'pending').length
  const expiredCount = DEMO_IMMUNIZATIONS.filter((i) => i.immunityStatus === 'expired').length
  const immunityRate = Math.round((immuneCount / DEMO_IMMUNIZATIONS.length) * 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="نسبة التحصين" value={`${immunityRate}%`} subtitle="من الإجمالي" icon={<Syringe className="h-6 w-6" />} accent="teal" />
        <StatCard title="محصّنين" value={String(immuneCount)} subtitle="مكتمل التحصين" icon={<CheckCircle className="h-6 w-6" />} accent="success" />
        <StatCard title="قيد الاكتمال" value={String(pendingCount)} subtitle="جرعات متبقية" icon={<AlertTriangle className="h-6 w-6" />} accent="gold" />
        <StatCard title="منتهي" value={String(expiredCount)} subtitle="يحتاج تجديد" icon={<XCircle className="h-6 w-6" />} accent="danger" />
      </div>

      <div className="flex gap-2">
        {(['all', 'staff', 'beneficiary'] as const).map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${typeFilter === t ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
            {t === 'all' ? 'الكل' : t === 'staff' ? 'الموظفين' : 'المستفيدين'}
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-3 py-2 text-right text-slate-500">الاسم</th>
                <th className="px-3 py-2 text-right text-slate-500">اللقاح</th>
                <th className="px-3 py-2 text-center text-slate-500">الجرعة</th>
                <th className="px-3 py-2 text-center text-slate-500">التاريخ</th>
                <th className="px-3 py-2 text-center text-slate-500">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rec) => {
                const statusCfg = IMMUNITY_STATUS_CONFIG[rec.immunityStatus]
                return (
                  <tr key={rec.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{rec.personName}</div>
                      <div className="text-xs text-slate-400">{rec.personType === 'staff' ? 'موظف' : 'مستفيد'}</div>
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{rec.vaccineName}</td>
                    <td className="px-3 py-2 text-center text-slate-600 dark:text-slate-400">{rec.doseNumber}/{rec.totalDoses}</td>
                    <td className="px-3 py-2 text-center text-xs text-slate-500">{rec.dateAdministered}</td>
                    <td className="px-3 py-2 text-center">
                      <Badge className={statusCfg.color}>{statusCfg.emoji} {statusCfg.label}</Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Vaccine Coverage by Type */}
      <Card>
        <CardHeader><CardTitle>تغطية اللقاحات</CardTitle></CardHeader>
        <div className="space-y-3">
          {VACCINE_TYPES.map((vac) => {
            const records = DEMO_IMMUNIZATIONS.filter((r) => r.vaccineCode === vac.code)
            const complete = records.filter((r) => r.immunityStatus === 'immune').length
            return (
              <div key={vac.code} className="flex items-center gap-3">
                <span className="w-36 text-sm font-medium text-slate-700 dark:text-slate-300">{vac.name}</span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${records.length > 0 ? (complete / records.length) * 100 : 0}%` }}
                      className="h-full rounded-full bg-hrsd-teal"
                    />
                  </div>
                </div>
                <span className="w-16 text-left text-xs text-slate-500">{complete}/{records.length}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ── Outbreaks Tab ───────────────────────────────────────────────

function OutbreaksSection() {
  const activeCount = DEMO_OUTBREAKS.filter((o) => o.containmentStatus !== 'resolved').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard title="تفشيات نشطة" value={String(activeCount)} subtitle="تحتاج متابعة" icon={<Bug className="h-6 w-6" />} accent="danger" />
        <StatCard title="مصابين" value={String(DEMO_OUTBREAKS.reduce((a, o) => a + o.beneficiariesAffected + o.staffAffected, 0))} subtitle="مستفيدين + موظفين" icon={<AlertTriangle className="h-6 w-6" />} accent="gold" />
        <StatCard title="إبلاغ الوزارة" value={String(DEMO_OUTBREAKS.filter((o) => o.mohNotified).length)} subtitle={`من ${DEMO_OUTBREAKS.length}`} icon={<ShieldCheck className="h-6 w-6" />} accent="teal" />
      </div>

      {/* Protocol reminder */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/10">
        <div className="p-4">
          <h4 className="mb-1 font-semibold text-amber-800 dark:text-amber-400">بروتوكول إعلان التفشي</h4>
          <p className="text-sm text-amber-700 dark:text-amber-500">
            يُعلن التفشي عند وجود حالتين أو أكثر مرتبطتين وبائياً في نفس الموقع خلال فترة الحضانة. يجب إبلاغ وزارة الصحة خلال 24 ساعة.
          </p>
        </div>
      </Card>

      <AnimatePresence mode="popLayout">
        {DEMO_OUTBREAKS.map((ob) => {
          const statusCfg = CONTAINMENT_STATUS_CONFIG[ob.containmentStatus]
          return (
            <motion.div key={ob.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className={`border-r-4 ${ob.containmentStatus === 'active' ? 'border-r-red-500' : ob.containmentStatus === 'contained' ? 'border-r-amber-500' : 'border-r-emerald-500'}`}>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-slate-500">{ob.code}</span>
                      <h3 className="font-bold text-slate-900 dark:text-white">{ob.pathogen}</h3>
                      <Badge className={OUTBREAK_SEVERITY_CONFIG[ob.severity].color}>{OUTBREAK_SEVERITY_CONFIG[ob.severity].label}</Badge>
                    </div>
                    <Badge className={statusCfg.color}>{statusCfg.emoji} {statusCfg.label}</Badge>
                  </div>
                  {ob.description && <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">{ob.description}</p>}
                  <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/50 sm:grid-cols-4">
                    <div><span className="text-xs text-slate-500">الموقع</span><div className="font-medium text-slate-700 dark:text-slate-300">{ob.location}</div></div>
                    <div><span className="text-xs text-slate-500">مستفيدين</span><div className="font-medium text-red-600">{ob.beneficiariesAffected}</div></div>
                    <div><span className="text-xs text-slate-500">موظفين</span><div className="font-medium text-amber-600">{ob.staffAffected}</div></div>
                    <div><span className="text-xs text-slate-500">إبلاغ الوزارة</span><div className="font-medium">{ob.mohNotified ? '✅ تم' : '❌ لم يتم'}</div></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

// ── Main Page ───────────────────────────────────────────────────

export function IPCPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="مكافحة العدوى"
        description="إدارة جولات التفتيش والحوادث والتحصينات وإدارة التفشي"
      />

      <Tabs
        defaultTab="inspections"
        tabs={[
          { id: 'inspections', label: 'جولات التفتيش', icon: <ClipboardCheck className="h-4 w-4" />, content: <InspectionsSection /> },
          { id: 'incidents', label: 'الحوادث', icon: <Bug className="h-4 w-4" />, content: <IncidentsSection /> },
          { id: 'immunizations', label: 'التحصينات', icon: <Syringe className="h-4 w-4" />, content: <ImmunizationsSection /> },
          { id: 'outbreaks', label: 'إدارة التفشي', icon: <AlertTriangle className="h-4 w-4" />, content: <OutbreaksSection /> },
        ]}
      />
    </div>
  )
}
