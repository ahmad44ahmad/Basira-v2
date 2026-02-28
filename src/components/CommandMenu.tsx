import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, LayoutDashboard, Users, HeartPulse, Pill, Shield, HandHelping,
  Star, Home as HomeIcon, Utensils, Wrench, Scale, ClipboardCheck, BarChart3,
  Activity, Settings, GraduationCap, HelpCircle, ShieldCheck, ArrowLeft,
} from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'

interface CommandItem {
  id: string
  label: string
  labelEn?: string
  icon: React.ReactNode
  path: string
  category: string
  keywords?: string[]
}

const COMMANDS: CommandItem[] = [
  // الرئيسية
  { id: 'dashboard', label: 'لوحة القيادة', labelEn: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, path: '/dashboard', category: 'الرئيسية', keywords: ['home', 'main'] },
  // المستفيدون
  { id: 'beneficiaries', label: 'المستفيدون', labelEn: 'Beneficiaries', icon: <Users className="h-4 w-4" />, path: '/beneficiaries', category: 'المستفيدون', keywords: ['residents', 'patients'] },
  { id: 'empowerment', label: 'التمكين', labelEn: 'Empowerment', icon: <Star className="h-4 w-4" />, path: '/empowerment', category: 'المستفيدون', keywords: ['dignity', 'goals'] },
  { id: 'family', label: 'بوابة الأسرة', labelEn: 'Family Portal', icon: <HomeIcon className="h-4 w-4" />, path: '/family', category: 'المستفيدون', keywords: ['visits', 'portal'] },
  // الطبية
  { id: 'medical', label: 'الملفات الطبية', labelEn: 'Medical Records', icon: <HeartPulse className="h-4 w-4" />, path: '/medical', category: 'الخدمات الطبية', keywords: ['health', 'records'] },
  { id: 'medications', label: 'الأدوية', labelEn: 'Medications', icon: <Pill className="h-4 w-4" />, path: '/medications', category: 'الخدمات الطبية', keywords: ['drugs', 'pharmacy'] },
  { id: 'safety', label: 'مخاطر السقوط', labelEn: 'Fall Risk', icon: <Shield className="h-4 w-4" />, path: '/safety', category: 'الخدمات الطبية', keywords: ['fall', 'risk', 'janssen'] },
  // الرعاية
  { id: 'care', label: 'الرعاية اليومية', labelEn: 'Daily Care', icon: <HandHelping className="h-4 w-4" />, path: '/care', category: 'الرعاية', keywords: ['daily', 'log'] },
  { id: 'handover', label: 'تسليم المناوبة', labelEn: 'Shift Handover', icon: <ArrowLeft className="h-4 w-4" />, path: '/handover', category: 'الرعاية', keywords: ['shift'] },
  // IPC
  { id: 'ipc', label: 'مكافحة العدوى', labelEn: 'IPC', icon: <ShieldCheck className="h-4 w-4" />, path: '/ipc', category: 'مكافحة العدوى', keywords: ['infection', 'prevention'] },
  // الاجتماعية
  { id: 'social', label: 'الخدمات الاجتماعية', labelEn: 'Social Services', icon: <Users className="h-4 w-4" />, path: '/social', category: 'الاجتماعية', keywords: ['social', 'leaves'] },
  // التغذية
  { id: 'catering', label: 'التغذية', labelEn: 'Catering', icon: <Utensils className="h-4 w-4" />, path: '/catering', category: 'التشغيل', keywords: ['food', 'meals'] },
  // العمليات
  { id: 'operations', label: 'العمليات والصيانة', labelEn: 'Operations', icon: <Wrench className="h-4 w-4" />, path: '/operations', category: 'التشغيل', keywords: ['maintenance', 'assets'] },
  // الحوكمة
  { id: 'grc', label: 'الحوكمة والمخاطر', labelEn: 'GRC', icon: <Scale className="h-4 w-4" />, path: '/grc', category: 'الحوكمة والجودة', keywords: ['risk', 'compliance'] },
  { id: 'quality', label: 'إدارة الجودة', labelEn: 'Quality', icon: <ClipboardCheck className="h-4 w-4" />, path: '/quality', category: 'الحوكمة والجودة', keywords: ['ncr', 'audit', 'capa'] },
  // التقارير
  { id: 'reports', label: 'التقارير', labelEn: 'Reports', icon: <BarChart3 className="h-4 w-4" />, path: '/reports', category: 'التقارير', keywords: ['sroi', 'kpi'] },
  { id: 'indicators', label: 'المؤشرات الذكية', labelEn: 'Indicators', icon: <Activity className="h-4 w-4" />, path: '/indicators', category: 'التقارير', keywords: ['smart', 'benchmark'] },
  // الإدارة
  { id: 'training', label: 'التدريب والتأهيل', labelEn: 'Training', icon: <GraduationCap className="h-4 w-4" />, path: '/training', category: 'الإدارة', keywords: ['training', 'referral'] },
  { id: 'support', label: 'الدعم الفني', labelEn: 'Support', icon: <HelpCircle className="h-4 w-4" />, path: '/support', category: 'الإدارة', keywords: ['help', 'faq'] },
  { id: 'settings', label: 'الإعدادات', labelEn: 'Settings', icon: <Settings className="h-4 w-4" />, path: '/settings', category: 'الإدارة', keywords: ['theme', 'preferences'] },
]

export function CommandMenu() {
  const { commandMenuOpen, setCommandMenuOpen } = useUIStore()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Cmd+K / Ctrl+K listener
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandMenuOpen(!commandMenuOpen)
      }
      if (e.key === 'Escape' && commandMenuOpen) {
        setCommandMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [commandMenuOpen, setCommandMenuOpen])

  // Focus input when opened
  useEffect(() => {
    if (commandMenuOpen) {
      setQuery('')
      setSelectedIndex(0)
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [commandMenuOpen])

  // Filtered results
  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS
    const q = query.toLowerCase()
    return COMMANDS.filter(
      (c) =>
        c.label.includes(query) ||
        c.labelEn?.toLowerCase().includes(q) ||
        c.keywords?.some((k) => k.includes(q)) ||
        c.category.includes(query),
    )
  }, [query])

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>()
    filtered.forEach((item) => {
      const arr = map.get(item.category) || []
      arr.push(item)
      map.set(item.category, arr)
    })
    return map
  }, [filtered])

  // Keyboard navigation
  useEffect(() => {
    if (!commandMenuOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % filtered.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length)
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault()
        navigate(filtered[selectedIndex].path)
        setCommandMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [commandMenuOpen, filtered, selectedIndex, navigate, setCommandMenuOpen])

  // Reset selection on query change
  useEffect(() => { setSelectedIndex(0) }, [query])

  if (!commandMenuOpen) return null

  let flatIndex = 0

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
        onClick={() => setCommandMenuOpen(false)}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-700">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث أو اذهب إلى..."
              className="flex-1 bg-transparent py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              dir="rtl"
            />
            <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-400 dark:border-slate-600">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">لا توجد نتائج</div>
            ) : (
              Array.from(grouped.entries()).map(([category, items]) => (
                <div key={category}>
                  <div className="mb-1 px-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {category}
                  </div>
                  {items.map((item) => {
                    const idx = flatIndex++
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path)
                          setCommandMenuOpen(false)
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                          idx === selectedIndex
                            ? 'bg-hrsd-teal/10 text-hrsd-teal'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className={idx === selectedIndex ? 'text-hrsd-teal' : 'text-slate-400'}>{item.icon}</span>
                        <span className="flex-1 text-right">{item.label}</span>
                        {item.labelEn && (
                          <span className="text-xs text-slate-400">{item.labelEn}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 dark:border-slate-700">
            <div className="flex gap-2 text-[10px] text-slate-400">
              <span><kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">↑↓</kbd> للتنقل</span>
              <span><kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">↵</kbd> للفتح</span>
            </div>
            <span className="text-[10px] text-slate-400">
              <kbd className="rounded border border-slate-300 px-1 dark:border-slate-600">Ctrl+K</kbd>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
