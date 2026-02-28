import { useState, type ReactNode } from 'react'
import {
  Stethoscope, Users, Syringe, ShieldAlert, Activity, FileText, Smile, Ear,
  Pill, FlaskConical, ClipboardList, Ambulance, Brain, Heart, Eye,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge, Spinner } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { cn } from '@/lib/utils'
import { useMedicalProfiles, useMedicalStats } from '../api/medical-queries'
import { useExaminations, usePrescriptions, useLabOrders } from '../api/examination-queries'
import { useClinicalNotes, useMdtRounds } from '../api/clinical-queries'
import { useTransfers, useDiseaseNotifications } from '../api/transfer-queries'
import { useTherapySessions, usePsychAssessments } from '../api/therapy-queries'
import { useBeneficiaryStats } from '@/features/beneficiaries/api/beneficiary-queries'
import {
  PRESCRIPTION_TYPE_CONFIG, PRESCRIPTION_STATUS_CONFIG,
  NOTE_TYPE_CONFIG, DISCIPLINE_CONFIG,
  LAB_STATUS_CONFIG, ROUND_TYPE_CONFIG,
  TRANSFER_TYPE_CONFIG,
  THERAPY_TYPE_CONFIG, SESSION_TYPE_CONFIG,
  PSYCH_ASSESSMENT_TYPE_CONFIG, PSYCH_STATUS_CONFIG,
} from '../types'
import type { MedicalExamination, Prescription, LabOrder, ClinicalNote, MultidisciplinaryRound, PatientTransfer, DiseaseNotification, TherapySession, PsychAssessment } from '@/types/database'

// ─── Tab Definition ─────────────────────────────────────────────

interface TabDef {
  id: string
  label: string
  icon: ReactNode
}

const TABS: TabDef[] = [
  { id: 'overview', label: 'نظرة عامة', icon: <Eye className="h-4 w-4" /> },
  { id: 'examinations', label: 'الفحوصات والوصفات', icon: <Stethoscope className="h-4 w-4" /> },
  { id: 'clinical', label: 'الملاحظات السريرية', icon: <FileText className="h-4 w-4" /> },
  { id: 'transfers', label: 'التحويلات الطبية', icon: <Ambulance className="h-4 w-4" /> },
  { id: 'therapy', label: 'العلاج الطبيعي والنطق', icon: <Activity className="h-4 w-4" /> },
  { id: 'psych', label: 'الخدمات النفسية', icon: <Brain className="h-4 w-4" /> },
]

// ─── Main Page ──────────────────────────────────────────────────

export function MedicalOverviewPage() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="الخدمات الطبية"
        description="نظرة شاملة على الحالة الطبية والخدمات العلاجية"
        icon={<Stethoscope className="h-5 w-5" />}
      />

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
              tab.id === activeTab
                ? 'text-teal'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.id === activeTab && (
              <motion.div
                layoutId="medical-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'examinations' && <ExaminationsSection />}
          {activeTab === 'clinical' && <ClinicalSection />}
          {activeTab === 'transfers' && <TransfersSection />}
          {activeTab === 'therapy' && <TherapySection />}
          {activeTab === 'psych' && <PsychSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Quick Actions (reused) ─────────────────────────────────────

const quickActions = [
  { to: '/care', label: 'سجل الرعاية اليومية', icon: <Activity className="h-5 w-5" />, color: 'bg-teal/10 text-teal' },
  { to: '/safety', label: 'تقييم مخاطر السقوط', icon: <ShieldAlert className="h-5 w-5" />, color: 'bg-red-500/10 text-red-500' },
  { to: '/medications', label: 'إعطاء الأدوية', icon: <Syringe className="h-5 w-5" />, color: 'bg-purple-500/10 text-purple-500' },
  { to: '/handover', label: 'تسليم الورديات', icon: <FileText className="h-5 w-5" />, color: 'bg-blue-500/10 text-blue-500' },
  { to: '/ipc', label: 'مكافحة العدوى', icon: <ShieldAlert className="h-5 w-5" />, color: 'bg-amber-500/10 text-amber-500' },
  { to: '/medical', label: 'الخدمات النفسية', icon: <Smile className="h-5 w-5" />, color: 'bg-pink-500/10 text-pink-500' },
  { to: '/medical', label: 'النطق والتخاطب', icon: <Ear className="h-5 w-5" />, color: 'bg-indigo-500/10 text-indigo-500' },
]

// ─── Overview Section ───────────────────────────────────────────

function OverviewSection() {
  const { data: profiles, isLoading, error } = useMedicalProfiles()
  const medStats = useMedicalStats()
  const benStats = useBeneficiaryStats()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>
  if ((profiles ?? []).length === 0) return <EmptyState title="لا توجد بيانات" description="لم يتم تسجيل أي ملفات طبية بعد" />

  const recentExams = (profiles ?? []).slice(0, 4).map((p) => ({
    name: p.beneficiary_id,
    type: p.primary_diagnosis ?? 'فحص',
    date: p.updated_at.slice(0, 10),
    result: p.chronic_diseases?.length ? 'يحتاج متابعة' : 'طبيعي',
  }))

  const completionRate = benStats.total > 0 ? Math.round((medStats.totalProfiles / benStats.total) * 100) : 0
  const progressItems = [
    { label: 'نسبة التطعيم', value: 85, color: 'bg-teal' },
    { label: 'الفحوصات الدورية', value: completionRate || 72, color: 'bg-blue-500' },
    { label: 'الامتثال الدوائي', value: 95, color: 'bg-success' },
    { label: 'اكتمال الملفات الطبية', value: completionRate || 88, color: 'bg-gold' },
  ]

  return (
    <>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="الملفات الطبية" value={medStats.totalProfiles} icon={<Users className="h-6 w-6" />} accent="teal" subtitle="ملف نشط" />
        <StatCard title="أمراض مزمنة" value={medStats.withChronicDiseases} icon={<Activity className="h-6 w-6" />} accent="gold" subtitle="تحت المتابعة" />
        <StatCard title="حساسية مسجلة" value={medStats.withAllergies} icon={<Syringe className="h-6 w-6" />} accent="danger" />
        <StatCard title="حالات صرع" value={medStats.epilepticCount} icon={<ShieldAlert className="h-6 w-6" />} accent="navy" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>الوصول السريع</CardTitle></CardHeader>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 text-center transition-all hover:shadow-card hover:-translate-y-0.5 dark:border-slate-700"
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', action.color)}>
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader><CardTitle>مؤشرات الأداء</CardTitle></CardHeader>
          <div className="space-y-4">
            {progressItems.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className={cn('h-full rounded-full transition-all duration-700', item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Exams */}
      <Card className="mt-6">
        <CardHeader><CardTitle>آخر الفحوصات</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-right dark:border-slate-700">
                <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
                <th className="px-3 py-2 font-medium text-slate-500">نوع الفحص</th>
                <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
                <th className="px-3 py-2 font-medium text-slate-500">النتيجة</th>
              </tr>
            </thead>
            <tbody>
              {recentExams.map((exam, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{exam.name}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{exam.type}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{exam.date}</td>
                  <td className="px-3 py-3">
                    <Badge variant={exam.result === 'طبيعي' || exam.result === 'مستقر' ? 'success' : exam.result.includes('تحسن') ? 'info' : 'warning'}>
                      {exam.result}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

// ─── Examinations Section ───────────────────────────────────────

function ExaminationsSection() {
  const { data: exams = [], isLoading: examsLoading } = useExaminations()
  const { data: prescriptions = [], isLoading: rxLoading } = usePrescriptions()
  const { data: labOrders = [], isLoading: labLoading } = useLabOrders()
  const [subTab, setSubTab] = useState<'exams' | 'rx' | 'lab'>('exams')

  const isLoading = examsLoading || rxLoading || labLoading

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  const rxActive = prescriptions.filter((r) => r.status === 'active').length
  const labPending = labOrders.filter((l) => l.status === 'ordered').length

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="الفحوصات" value={exams.length} icon={<Stethoscope className="h-6 w-6" />} accent="teal" />
        <StatCard title="الوصفات" value={prescriptions.length} icon={<Pill className="h-6 w-6" />} accent="navy" subtitle={`${rxActive} نشط`} />
        <StatCard title="طلبات المختبر" value={labOrders.length} icon={<FlaskConical className="h-6 w-6" />} accent="gold" subtitle={`${labPending} قيد الانتظار`} />
        <StatCard title="نتائج واردة" value={labOrders.filter((l) => l.status === 'resulted').length} icon={<ClipboardList className="h-6 w-6" />} accent="success" />
      </div>

      {/* Sub-tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {([
          { id: 'exams' as const, label: 'الفحوصات الطبية' },
          { id: 'rx' as const, label: 'الوصفات' },
          { id: 'lab' as const, label: 'طلبات المختبر' },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              subTab === t.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'exams' && <ExaminationsTable data={exams} />}
      {subTab === 'rx' && <PrescriptionsTable data={prescriptions} />}
      {subTab === 'lab' && <LabOrdersTable data={labOrders} />}
    </>
  )
}

function ExaminationsTable({ data }: { data: MedicalExamination[] }) {
  if (data.length === 0) return <EmptyState icon={<Stethoscope className="h-8 w-8 text-slate-400" />} title="لا توجد فحوصات" description="لم يتم تسجيل أي فحوصات طبية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
              <th className="px-3 py-2 font-medium text-slate-500">الشكوى الرئيسية</th>
              <th className="px-3 py-2 font-medium text-slate-500">التشخيص</th>
              <th className="px-3 py-2 font-medium text-slate-500">الطبيب</th>
            </tr>
          </thead>
          <tbody>
            {data.map((exam) => (
              <tr key={exam.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{exam.beneficiary_id}</td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{exam.exam_date}</td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{exam.chief_complaint ?? '-'}</td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{exam.diagnosis ?? '-'}</td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{exam.examiner_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function PrescriptionsTable({ data }: { data: Prescription[] }) {
  if (data.length === 0) return <EmptyState icon={<Pill className="h-8 w-8 text-slate-400" />} title="لا توجد وصفات" description="لم يتم تسجيل أي وصفات طبية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
              <th className="px-3 py-2 font-medium text-slate-500">النوع</th>
              <th className="px-3 py-2 font-medium text-slate-500">الحالة</th>
              <th className="px-3 py-2 font-medium text-slate-500">الواصف</th>
              <th className="px-3 py-2 font-medium text-slate-500">الأدوية</th>
            </tr>
          </thead>
          <tbody>
            {data.map((rx) => {
              const typeConfig = PRESCRIPTION_TYPE_CONFIG[rx.prescription_type]
              const statusConfig = PRESCRIPTION_STATUS_CONFIG[rx.status]
              return (
                <tr key={rx.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{rx.beneficiary_id}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{rx.prescription_date}</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', typeConfig.bgColor, typeConfig.color)}>{typeConfig.label}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusConfig.bgColor, statusConfig.color)}>{statusConfig.label}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{rx.prescriber_name}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{rx.items.length} صنف</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function LabOrdersTable({ data }: { data: LabOrder[] }) {
  if (data.length === 0) return <EmptyState icon={<FlaskConical className="h-8 w-8 text-slate-400" />} title="لا توجد طلبات مختبر" description="لم يتم تسجيل أي طلبات فحص مختبرية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">تاريخ الطلب</th>
              <th className="px-3 py-2 font-medium text-slate-500">الفحوصات</th>
              <th className="px-3 py-2 font-medium text-slate-500">الحالة</th>
              <th className="px-3 py-2 font-medium text-slate-500">الطالب</th>
              <th className="px-3 py-2 font-medium text-slate-500">إبلاغ الطبيب</th>
            </tr>
          </thead>
          <tbody>
            {data.map((lab) => {
              const statusConfig = LAB_STATUS_CONFIG[lab.status]
              return (
                <tr key={lab.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{lab.beneficiary_id}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{lab.order_date}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{lab.tests.length} فحص</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusConfig.bgColor, statusConfig.color)}>{statusConfig.label}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{lab.ordered_by}</td>
                  <td className="px-3 py-3">
                    <Badge variant={lab.physician_notified ? 'success' : 'warning'}>
                      {lab.physician_notified ? 'تم الإبلاغ' : 'لم يبلغ'}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ─── Clinical Section ───────────────────────────────────────────

function ClinicalSection() {
  const { data: notes = [], isLoading: notesLoading } = useClinicalNotes()
  const { data: rounds = [], isLoading: roundsLoading } = useMdtRounds()
  const [subTab, setSubTab] = useState<'notes' | 'rounds'>('notes')
  const [filterNoteType, setFilterNoteType] = useState<string>('all')
  const [filterDiscipline, setFilterDiscipline] = useState<string>('all')

  const isLoading = notesLoading || roundsLoading

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  const soapCount = notes.filter((n) => n.note_type === 'soap').length
  const progressCount = notes.filter((n) => n.note_type === 'progress').length

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="الملاحظات السريرية" value={notes.length} icon={<FileText className="h-6 w-6" />} accent="teal" />
        <StatCard title="ملاحظات SOAP" value={soapCount} icon={<ClipboardList className="h-6 w-6" />} accent="navy" />
        <StatCard title="ملاحظات تقدم" value={progressCount} icon={<FileText className="h-6 w-6" />} accent="gold" />
        <StatCard title="جولات الفريق" value={rounds.length} icon={<Users className="h-6 w-6" />} accent="success" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([
          { id: 'notes' as const, label: 'الملاحظات السريرية' },
          { id: 'rounds' as const, label: 'جولات الفريق متعدد التخصصات' },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              subTab === t.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'notes' && (
        <>
          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-1">
              <span className="self-center text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">النوع:</span>
              {(['all', 'progress', 'consultation', 'follow_up', 'soap'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterNoteType(t)}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                    filterNoteType === t ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                  )}
                >
                  {t === 'all' ? 'الكل' : NOTE_TYPE_CONFIG[t].label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="self-center text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">التخصص:</span>
              {(['all', 'doctor', 'nursing', 'pt', 'ot', 'speech', 'psychology', 'social'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDiscipline(d)}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                    filterDiscipline === d ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                  )}
                >
                  {d === 'all' ? 'الكل' : DISCIPLINE_CONFIG[d].label}
                </button>
              ))}
            </div>
          </div>
          <ClinicalNotesTable
            data={notes.filter((n) =>
              (filterNoteType === 'all' || n.note_type === filterNoteType)
              && (filterDiscipline === 'all' || n.discipline === filterDiscipline),
            )}
          />
        </>
      )}
      {subTab === 'rounds' && <MdtRoundsTable data={rounds} />}
    </>
  )
}

function ClinicalNotesTable({ data }: { data: ClinicalNote[] }) {
  if (data.length === 0) return <EmptyState icon={<FileText className="h-8 w-8 text-slate-400" />} title="لا توجد ملاحظات" description="لم يتم تسجيل أي ملاحظات سريرية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
              <th className="px-3 py-2 font-medium text-slate-500">النوع</th>
              <th className="px-3 py-2 font-medium text-slate-500">التخصص</th>
              <th className="px-3 py-2 font-medium text-slate-500">التقييم</th>
              <th className="px-3 py-2 font-medium text-slate-500">الكاتب</th>
            </tr>
          </thead>
          <tbody>
            {data.map((note) => {
              const typeConfig = NOTE_TYPE_CONFIG[note.note_type]
              const discConfig = DISCIPLINE_CONFIG[note.discipline]
              return (
                <tr key={note.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{note.beneficiary_id}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{note.note_date}</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', typeConfig.bgColor, typeConfig.color)}>{typeConfig.label}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', discConfig.bgColor, discConfig.color)}>{discConfig.label}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{note.assessment ?? '-'}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{note.author_name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function MdtRoundsTable({ data }: { data: MultidisciplinaryRound[] }) {
  if (data.length === 0) return <EmptyState icon={<Users className="h-8 w-8 text-slate-400" />} title="لا توجد جولات" description="لم يتم تسجيل أي جولات فريق متعدد التخصصات بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
              <th className="px-3 py-2 font-medium text-slate-500">نوع الجولة</th>
              <th className="px-3 py-2 font-medium text-slate-500">التخصصات</th>
              <th className="px-3 py-2 font-medium text-slate-500">الأهداف</th>
              <th className="px-3 py-2 font-medium text-slate-500">المنسق</th>
            </tr>
          </thead>
          <tbody>
            {data.map((round) => {
              const typeConfig = ROUND_TYPE_CONFIG[round.round_type]
              return (
                <tr key={round.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{round.beneficiary_id}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{round.round_date}</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', typeConfig.bgColor, typeConfig.color)}>{typeConfig.label}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{round.disciplines.length} تخصص</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{round.goals ?? '-'}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{round.coordinator_name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ─── Transfers Section ──────────────────────────────────────────

function TransfersSection() {
  const { data: transfers = [], isLoading: transfersLoading } = useTransfers()
  const { data: notifications = [], isLoading: notifLoading } = useDiseaseNotifications()
  const [subTab, setSubTab] = useState<'transfers' | 'notifications'>('transfers')
  const [filterType, setFilterType] = useState<string>('all')

  const isLoading = transfersLoading || notifLoading

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  const internalCount = transfers.filter((t) => t.transfer_type === 'internal').length
  const externalCount = transfers.filter((t) => t.transfer_type === 'external').length

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي التحويلات" value={transfers.length} icon={<Ambulance className="h-6 w-6" />} accent="teal" />
        <StatCard title="تحويلات داخلية" value={internalCount} icon={<Activity className="h-6 w-6" />} accent="navy" />
        <StatCard title="تحويلات خارجية" value={externalCount} icon={<Ambulance className="h-6 w-6" />} accent="gold" />
        <StatCard title="تبليغات أمراض" value={notifications.length} icon={<ShieldAlert className="h-6 w-6" />} accent="danger" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([
          { id: 'transfers' as const, label: 'التحويلات' },
          { id: 'notifications' as const, label: 'تبليغات الأمراض' },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              subTab === t.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'transfers' && (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {(['all', 'internal', 'external'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                  filterType === t ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                )}
              >
                {t === 'all' ? 'الكل' : TRANSFER_TYPE_CONFIG[t].label}
              </button>
            ))}
          </div>
          <TransfersTable data={filterType === 'all' ? transfers : transfers.filter((t) => t.transfer_type === filterType)} />
        </>
      )}
      {subTab === 'notifications' && <DiseaseNotificationsTable data={notifications} />}
    </>
  )
}

function TransfersTable({ data }: { data: PatientTransfer[] }) {
  if (data.length === 0) return <EmptyState icon={<Ambulance className="h-8 w-8 text-slate-400" />} title="لا توجد تحويلات" description="لم يتم تسجيل أي تحويلات طبية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
              <th className="px-3 py-2 font-medium text-slate-500">النوع</th>
              <th className="px-3 py-2 font-medium text-slate-500">من</th>
              <th className="px-3 py-2 font-medium text-slate-500">إلى</th>
              <th className="px-3 py-2 font-medium text-slate-500">السبب</th>
              <th className="px-3 py-2 font-medium text-slate-500">الطبيب المرسل</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tr) => {
              const typeConfig = TRANSFER_TYPE_CONFIG[tr.transfer_type]
              return (
                <tr key={tr.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{tr.beneficiary_id}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{tr.transfer_date}</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', typeConfig.bgColor, typeConfig.color)}>{typeConfig.label}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{tr.from_location}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{tr.to_location}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{tr.reason ?? '-'}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{tr.sending_physician}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function DiseaseNotificationsTable({ data }: { data: DiseaseNotification[] }) {
  if (data.length === 0) return <EmptyState icon={<ShieldAlert className="h-8 w-8 text-slate-400" />} title="لا توجد تبليغات" description="لم يتم تسجيل أي تبليغات أمراض معدية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">تاريخ التبليغ</th>
              <th className="px-3 py-2 font-medium text-slate-500">المرض</th>
              <th className="px-3 py-2 font-medium text-slate-500">الأعراض</th>
              <th className="px-3 py-2 font-medium text-slate-500">إبلاغ الجهات</th>
              <th className="px-3 py-2 font-medium text-slate-500">المبلّغ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dn) => (
              <tr key={dn.id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{dn.beneficiary_id}</td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{dn.notification_date}</td>
                <td className="px-3 py-3 font-medium text-red-600 dark:text-red-400">{dn.disease_name}</td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{dn.symptoms?.join('، ') ?? '-'}</td>
                <td className="px-3 py-3">
                  <Badge variant={dn.authority_notified ? 'success' : 'danger'}>
                    {dn.authority_notified ? 'تم الإبلاغ' : 'لم يبلغ'}
                  </Badge>
                </td>
                <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{dn.notifier_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ─── Therapy Section (PT + Speech + OT) ─────────────────────────

function TherapySection() {
  const { data: sessions = [], isLoading } = useTherapySessions()
  const [filterType, setFilterType] = useState<string>('all')

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  // Filter to only PT, Speech, OT (not psychology - that's in PsychSection)
  const therapySessions = sessions.filter((s) => s.therapy_type !== 'psychology')

  const ptCount = therapySessions.filter((s) => s.therapy_type === 'physical_therapy').length
  const speechCount = therapySessions.filter((s) => s.therapy_type === 'speech_therapy').length
  const otCount = therapySessions.filter((s) => s.therapy_type === 'occupational_therapy').length

  const filtered = filterType === 'all'
    ? therapySessions
    : therapySessions.filter((s) => s.therapy_type === filterType)

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="إجمالي الجلسات" value={therapySessions.length} icon={<Activity className="h-6 w-6" />} accent="teal" />
        <StatCard title="علاج طبيعي" value={ptCount} icon={<Heart className="h-6 w-6" />} accent="success" />
        <StatCard title="نطق وتخاطب" value={speechCount} icon={<Ear className="h-6 w-6" />} accent="navy" />
        <StatCard title="علاج وظيفي" value={otCount} icon={<Activity className="h-6 w-6" />} accent="gold" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(['all', 'physical_therapy', 'speech_therapy', 'occupational_therapy'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              filterType === t ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t === 'all' ? 'الكل' : THERAPY_TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>

      <TherapySessionsTable data={filtered} />
    </>
  )
}

function TherapySessionsTable({ data }: { data: TherapySession[] }) {
  if (data.length === 0) return <EmptyState icon={<Activity className="h-8 w-8 text-slate-400" />} title="لا توجد جلسات" description="لم يتم تسجيل أي جلسات علاجية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
              <th className="px-3 py-2 font-medium text-slate-500">نوع العلاج</th>
              <th className="px-3 py-2 font-medium text-slate-500">نوع الجلسة</th>
              <th className="px-3 py-2 font-medium text-slate-500">المدة</th>
              <th className="px-3 py-2 font-medium text-slate-500">المعالج</th>
            </tr>
          </thead>
          <tbody>
            {data.map((session) => {
              const therapyConfig = THERAPY_TYPE_CONFIG[session.therapy_type]
              const sessionConfig = SESSION_TYPE_CONFIG[session.session_type]
              return (
                <tr key={session.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{session.beneficiary_id}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{session.session_date}</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', therapyConfig.bgColor, therapyConfig.color)}>{therapyConfig.label}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', sessionConfig.bgColor, sessionConfig.color)}>{sessionConfig.label}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{session.duration_minutes ? `${session.duration_minutes} دقيقة` : '-'}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{session.therapist_name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ─── Psychology Section ─────────────────────────────────────────

function PsychSection() {
  const { data: sessions = [], isLoading: sessionsLoading } = useTherapySessions()
  const { data: assessments = [], isLoading: assessLoading } = usePsychAssessments()
  const [subTab, setSubTab] = useState<'sessions' | 'assessments'>('sessions')
  const [filterAssessType, setFilterAssessType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const isLoading = sessionsLoading || assessLoading

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>

  // Only psychology sessions
  const psychSessions = sessions.filter((s) => s.therapy_type === 'psychology')

  const activeAssess = assessments.filter((a) => a.status === 'active').length
  const completedAssess = assessments.filter((a) => a.status === 'completed').length

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="الجلسات النفسية" value={psychSessions.length} icon={<Brain className="h-6 w-6" />} accent="teal" />
        <StatCard title="التقييمات" value={assessments.length} icon={<ClipboardList className="h-6 w-6" />} accent="navy" />
        <StatCard title="تقييمات نشطة" value={activeAssess} icon={<Activity className="h-6 w-6" />} accent="success" />
        <StatCard title="تقييمات مكتملة" value={completedAssess} icon={<FileText className="h-6 w-6" />} accent="gold" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {([
          { id: 'sessions' as const, label: 'الجلسات النفسية' },
          { id: 'assessments' as const, label: 'التقييمات النفسية' },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              subTab === t.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'sessions' && <PsychSessionsTable data={psychSessions} />}
      {subTab === 'assessments' && (
        <>
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-1">
              <span className="self-center text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">النوع:</span>
              {(['all', 'comprehensive_exam', 'treatment_plan', 'behavior_observation', 'behavior_modification', 'progress_review'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterAssessType(t)}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                    filterAssessType === t ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                  )}
                >
                  {t === 'all' ? 'الكل' : PSYCH_ASSESSMENT_TYPE_CONFIG[t].label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="self-center text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">الحالة:</span>
              {(['all', 'active', 'completed', 'reviewed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
                    filterStatus === s ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400',
                  )}
                >
                  {s === 'all' ? 'الكل' : PSYCH_STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>
          <PsychAssessmentsTable
            data={assessments.filter((a) =>
              (filterAssessType === 'all' || a.assessment_type === filterAssessType)
              && (filterStatus === 'all' || a.status === filterStatus),
            )}
          />
        </>
      )}
    </>
  )
}

function PsychSessionsTable({ data }: { data: TherapySession[] }) {
  if (data.length === 0) return <EmptyState icon={<Brain className="h-8 w-8 text-slate-400" />} title="لا توجد جلسات نفسية" description="لم يتم تسجيل أي جلسات نفسية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
              <th className="px-3 py-2 font-medium text-slate-500">نوع الجلسة</th>
              <th className="px-3 py-2 font-medium text-slate-500">المدة</th>
              <th className="px-3 py-2 font-medium text-slate-500">التوصيات</th>
              <th className="px-3 py-2 font-medium text-slate-500">المعالج</th>
            </tr>
          </thead>
          <tbody>
            {data.map((session) => {
              const sessionConfig = SESSION_TYPE_CONFIG[session.session_type]
              return (
                <tr key={session.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{session.beneficiary_id}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{session.session_date}</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', sessionConfig.bgColor, sessionConfig.color)}>{sessionConfig.label}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{session.duration_minutes ? `${session.duration_minutes} دقيقة` : '-'}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{session.recommendations ?? '-'}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{session.therapist_name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function PsychAssessmentsTable({ data }: { data: PsychAssessment[] }) {
  if (data.length === 0) return <EmptyState icon={<ClipboardList className="h-8 w-8 text-slate-400" />} title="لا توجد تقييمات" description="لم يتم تسجيل أي تقييمات نفسية بعد" />

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-right dark:border-slate-700">
              <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
              <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
              <th className="px-3 py-2 font-medium text-slate-500">نوع التقييم</th>
              <th className="px-3 py-2 font-medium text-slate-500">الحالة</th>
              <th className="px-3 py-2 font-medium text-slate-500">المشكلة</th>
              <th className="px-3 py-2 font-medium text-slate-500">المعالج</th>
            </tr>
          </thead>
          <tbody>
            {data.map((assess) => {
              const typeConfig = PSYCH_ASSESSMENT_TYPE_CONFIG[assess.assessment_type]
              const statusConfig = PSYCH_STATUS_CONFIG[assess.status]
              return (
                <tr key={assess.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{assess.beneficiary_id}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{assess.assessment_date}</td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', typeConfig.bgColor, typeConfig.color)}>{typeConfig.label}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusConfig.bgColor, statusConfig.color)}>{statusConfig.label}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{assess.problem_statement ?? '-'}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{assess.therapist_name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
