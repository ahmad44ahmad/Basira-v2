import { useState } from 'react'
import { Heart, Calendar, MessageCircle, Image, Video, Trophy, Phone, Send, ThumbsUp, Plus, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Button, Card, Badge, Input, Modal, Tabs } from '@/components/ui'
import { toast } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'
import {
  VISIT_TYPES, UPDATE_TYPE_CONFIG,
  type FeedPost, type FamilyUpdate, type VisitType,
} from '../types'
import { useVisits, useFamilyFeed, useFamilyUpdates } from '../api/family-queries'

// ─── Main Page ──────────────────────────────────────────────────

const GOALS_PROGRESS = [
  { id: 'g1', title: 'المشي باستقلالية', domain: '🦿 علاج طبيعي', progress: 70 },
  { id: 'g2', title: 'نطق 20 كلمة جديدة', domain: '🗣️ تخاطب', progress: 60 },
  { id: 'g3', title: 'ارتداء الملابس', domain: '🪥 عناية ذاتية', progress: 40 },
]

export function FamilyPortalPage() {
  const [activeTab, setActiveTab] = useState('updates')
  const { data: visits = [] } = useVisits()
  const { data: updates = [] } = useFamilyUpdates()

  const tabs = [
    { id: 'updates', label: 'التحديثات' },
    { id: 'visits', label: 'الزيارات' },
    { id: 'feed', label: 'البث الإعلامي' },
    { id: 'goals', label: 'الأهداف' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="بوابة الأسرة"
        description="متابعة أحوال المستفيدين والتواصل مع المركز"
        icon={<Heart className="h-5 w-5" />}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon={<Phone className="h-4 w-4" />}>اتصال</Button>
            <Button variant="gold" size="sm" icon={<MessageCircle className="h-4 w-4" />}>رسالة</Button>
          </div>
        }
      />

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard title="الأهداف النشطة" value={GOALS_PROGRESS.length} accent="teal" />
        <StatCard title="الزيارات هذا الشهر" value={visits.filter((v) => v.date?.startsWith('2026-02')).length} accent="navy" />
        <StatCard title="متوسط التقدم" value={`${Math.round(GOALS_PROGRESS.reduce((s, g) => s + g.progress, 0) / GOALS_PROGRESS.length)}%`} accent="gold" />
        <StatCard title="التحديثات الجديدة" value={updates.length} accent="teal" />
      </div>

      <Tabs
        tabs={tabs.map((t) => ({ id: t.id, label: t.label }))}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'updates' && <UpdatesSection />}
        {activeTab === 'visits' && <VisitsSection />}
        {activeTab === 'feed' && <FeedSection />}
        {activeTab === 'goals' && <GoalsSection />}
      </div>
    </div>
  )
}

// ─── Updates Section ────────────────────────────────────────────

function UpdatesSection() {
  const { data: updates = [] } = useFamilyUpdates()

  return (
    <div className="space-y-3">
      {updates.map((update) => {
        const config = UPDATE_TYPE_CONFIG[update.type as FamilyUpdate['type']]
        return (
          <motion.div key={update.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <div className="flex items-start gap-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg', config.color)}>
                  {config.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{update.title}</h3>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{update.description ?? (update as Record<string, unknown>).content as string}</p>
                  <p className="mt-1 text-xs text-slate-400">{update.date}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Visits Section ─────────────────────────────────────────────

function VisitsSection() {
  const { data: visits = [] } = useVisits()
  const [filterType, setFilterType] = useState<VisitType | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = filterType === 'all' ? visits : visits.filter((v) => v.type === filterType)

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === 'all' ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
          >
            الكل
          </button>
          {VISIT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors', filterType === t.value ? 'bg-teal text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400')}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <Button variant="gold" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => setShowAddModal(true)}>
          تسجيل زيارة
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((visit) => {
            const typeConfig = VISIT_TYPES.find((t) => t.value === visit.type)
            return (
              <motion.div key={visit.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
                <Card>
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg', typeConfig?.color)}>
                      {typeConfig?.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{visit.beneficiaryName}</h3>
                        {typeConfig && <Badge className={typeConfig.color}>{typeConfig.label}</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{visit.notes}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span>👤 {visit.visitorName} ({visit.relation})</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{visit.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{visit.time}</span>
                        {visit.duration && <span>⏱️ {visit.duration} دقيقة</span>}
                        <span>📝 {visit.employeeName}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-slate-400">لا توجد زيارات</div>}
      </div>

      <AddVisitModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  )
}

function AddVisitModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ beneficiaryName: '', type: 'internal' as VisitType, date: '', time: '', visitorName: '', relation: '', notes: '' })
  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <Modal open={open} onClose={onClose} title="تسجيل زيارة جديدة">
      <div className="space-y-4">
        <Input label="المستفيد" value={form.beneficiaryName} onChange={(e) => update('beneficiaryName', e.target.value)} placeholder="اسم المستفيد..." />
        <div className="grid grid-cols-3 gap-4">
          <Input label="اسم الزائر" value={form.visitorName} onChange={(e) => update('visitorName', e.target.value)} />
          <Input label="صلة القرابة" value={form.relation} onChange={(e) => update('relation', e.target.value)} placeholder="والد، أخ..." />
          <Input label="التاريخ" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">ملاحظات</label>
          <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} placeholder="ملاحظات عن الزيارة..." className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm dark:border-slate-600 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-gold/50" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
          <Button variant="gold" onClick={() => { toast.success('تم تسجيل الزيارة'); onClose() }} disabled={!form.beneficiaryName.trim()}>تسجيل</Button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Feed Section ───────────────────────────────────────────────

function FeedSection() {
  const { data: fetchedPosts = [] } = useFamilyFeed()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const displayPosts = posts.length > 0 ? posts : fetchedPosts

  const toggleLike = (id: string) => {
    const current = posts.length > 0 ? posts : fetchedPosts
    setPosts(current.map((p) =>
      p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p,
    ))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {displayPosts.map((post) => (
        <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden">
            {/* Author */}
            <div className="flex items-center gap-3">
              {post.author && typeof post.author === 'object' && (
                <>
                  <span className="text-2xl">{post.author.avatar}</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{post.author.name}</p>
                    <p className="text-xs text-slate-500">{post.author.role} · {post.timestamp}</p>
                  </div>
                </>
              )}
            </div>

            {/* Content */}
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{post.content}</p>

            {/* Milestone highlight */}
            {post.type === 'milestone' && (
              <div className="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-700 dark:text-amber-400">
                  <Trophy className="h-4 w-4" /> إنجاز جديد!
                </div>
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">تم تحديث سجل الإنجازات في ملف التمكين</p>
              </div>
            )}

            {/* Media placeholder */}
            {post.mediaColor && post.type !== 'milestone' && (
              <div className={cn('mt-3 flex h-48 items-center justify-center rounded-xl', post.mediaColor)}>
                {post.type === 'video' ? (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 shadow-lg">
                    <Video className="h-6 w-6 text-slate-700" />
                  </div>
                ) : (
                  <Image className="h-10 w-10 text-white/60" />
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={() => toggleLike(post.id)}
                className={cn('flex items-center gap-1 text-sm transition-colors', post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500')}
              >
                <ThumbsUp className={cn('h-4 w-4', post.isLiked && 'fill-current')} />
                {post.likes}
              </button>
              <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-teal">
                <MessageCircle className="h-4 w-4" />
                {post.comments ?? 0}
              </button>
              <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-teal">
                <Send className="h-4 w-4" />
                مشاركة
              </button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Goals Section ──────────────────────────────────────────────

function GoalsSection() {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-l from-teal/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-xl">🎯</div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">متوسط التقدم الإجمالي</h3>
            <p className="text-sm text-slate-500">{GOALS_PROGRESS.length} أهداف نشطة</p>
          </div>
          <div className="mr-auto text-3xl font-bold text-teal">
            {Math.round(GOALS_PROGRESS.reduce((s, g) => s + g.progress, 0) / GOALS_PROGRESS.length)}%
          </div>
        </div>
      </Card>

      {GOALS_PROGRESS.map((goal) => (
        <Card key={goal.id}>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white">{goal.title}</h3>
                <Badge variant="outline">{goal.domain}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <motion.div
                    className={cn('h-full rounded-full', goal.progress >= 100 ? 'bg-emerald-500' : goal.progress >= 50 ? 'bg-teal' : 'bg-gold')}
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{goal.progress}%</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
