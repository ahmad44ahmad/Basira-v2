import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Users, Briefcase, Globe, CheckCircle, Plus, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge, Button, Modal, Input, Select } from '@/components/ui'

// ── Types ───────────────────────────────────────────────────────

interface TrainingReferral {
  id: string
  beneficiaryName: string
  referralDate: string
  referralType: 'educational' | 'vocational' | 'community'
  status: 'pending' | 'approved' | 'in_progress' | 'completed'
  description: string
  assignedTo?: string
}

const REFERRAL_TYPE_CONFIG = {
  educational: { label: 'دمج تعليمي', emoji: '📚', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  vocational: { label: 'تأهيل مهني', emoji: '🔧', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  community: { label: 'دمج مجتمعي', emoji: '🤝', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
} as const

const REFERRAL_STATUS_CONFIG = {
  pending: { label: 'معلق', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  approved: { label: 'معتمد', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress: { label: 'جاري', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  completed: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
} as const

// ── Demo Data ───────────────────────────────────────────────────

const DEMO_REFERRALS: TrainingReferral[] = [
  { id: '1', beneficiaryName: 'أحمد محمد السالم', referralDate: '2026-02-15', referralType: 'vocational', status: 'approved', description: 'تأهيل مهني في مجال صيانة الحاسب الآلي', assignedTo: 'مركز التأهيل المهني' },
  { id: '2', beneficiaryName: 'خالد سعيد الغامدي', referralDate: '2026-02-10', referralType: 'educational', status: 'in_progress', description: 'إلحاق ببرنامج محو الأمية المتقدم', assignedTo: 'إدارة التعليم' },
  { id: '3', beneficiaryName: 'فاطمة عبدالله العمري', referralDate: '2026-01-28', referralType: 'community', status: 'completed', description: 'برنامج العيش المستقل والدمج المجتمعي', assignedTo: 'جمعية الدمج المجتمعي' },
  { id: '4', beneficiaryName: 'سارة محمد الحربي', referralDate: '2026-02-20', referralType: 'vocational', status: 'pending', description: 'تدريب على مهارات الطبخ والضيافة' },
  { id: '5', beneficiaryName: 'عبدالرحمن علي القحطاني', referralDate: '2026-02-22', referralType: 'educational', status: 'pending', description: 'برنامج تعليم أساسيات القراءة والكتابة' },
  { id: '6', beneficiaryName: 'نورة سعد المطيري', referralDate: '2026-01-15', referralType: 'community', status: 'in_progress', description: 'برنامج التطوع المجتمعي والتفاعل الاجتماعي', assignedTo: 'إدارة التنمية الاجتماعية' },
]

// ── Component ───────────────────────────────────────────────────

export function TrainingPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'educational' | 'vocational' | 'community'>('all')

  const filtered = typeFilter === 'all' ? DEMO_REFERRALS : DEMO_REFERRALS.filter((r) => r.referralType === typeFilter)
  const educationalCount = DEMO_REFERRALS.filter((r) => r.referralType === 'educational').length
  const vocationalCount = DEMO_REFERRALS.filter((r) => r.referralType === 'vocational').length
  const communityCount = DEMO_REFERRALS.filter((r) => r.referralType === 'community').length

  return (
    <div className="animate-fade-in">
      <PageHeader title="التدريب والتأهيل" description="إدارة إحالات التأهيل التعليمي والمهني والمجتمعي" />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard title="إجمالي الإحالات" value={String(DEMO_REFERRALS.length)} subtitle="إحالة تأهيل" icon={<GraduationCap className="h-6 w-6" />} accent="teal" />
        <StatCard title="تعليمي" value={String(educationalCount)} subtitle="دمج تعليمي" icon={<Users className="h-6 w-6" />} accent="success" />
        <StatCard title="مهني" value={String(vocationalCount)} subtitle="تأهيل مهني" icon={<Briefcase className="h-6 w-6" />} accent="gold" />
        <StatCard title="مجتمعي" value={String(communityCount)} subtitle="دمج مجتمعي" icon={<Globe className="h-6 w-6" />} accent="teal" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {(['all', 'educational', 'vocational', 'community'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${typeFilter === t ? 'bg-hrsd-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
            >
              {t === 'all' ? `الكل (${DEMO_REFERRALS.length})` : `${REFERRAL_TYPE_CONFIG[t].emoji} ${REFERRAL_TYPE_CONFIG[t].label}`}
            </button>
          ))}
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="ms-1.5 h-4 w-4" /> إحالة جديدة
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.map((ref) => {
          const typeCfg = REFERRAL_TYPE_CONFIG[ref.referralType]
          const statusCfg = REFERRAL_STATUS_CONFIG[ref.status]
          return (
            <motion.div key={ref.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-3">
              <Card>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeCfg.emoji}</span>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{ref.beneficiaryName}</h3>
                      <Badge className={typeCfg.color}>{typeCfg.label}</Badge>
                    </div>
                    <Badge className={statusCfg.color}>{statusCfg.label}</Badge>
                  </div>
                  <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">{ref.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ref.referralDate}</span>
                    {ref.assignedTo && <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {ref.assignedTo}</span>}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="إحالة تأهيل جديدة (نموذج 4)">
        <div className="space-y-4">
          <Input label="اسم المستفيد" placeholder="اختر المستفيد..." />
          <Select
            label="نوع الإحالة"
            options={[
              { label: '📚 دمج تعليمي', value: 'educational' },
              { label: '🔧 تأهيل مهني', value: 'vocational' },
              { label: '🤝 دمج مجتمعي', value: 'community' },
            ]}
          />
          <Input label="وصف البرنامج" placeholder="تفاصيل برنامج التأهيل..." />
          <Input label="الجهة المحال إليها" placeholder="مركز التأهيل / الجمعية..." />
          <Button className="w-full" onClick={() => setShowAdd(false)}>إنشاء الإحالة</Button>
        </div>
      </Modal>
    </div>
  )
}
