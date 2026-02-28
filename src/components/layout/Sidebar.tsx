import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/useUIStore'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  HeartPulse,
  Utensils,
  Wrench,
  Shield,
  BarChart3,
  Settings,
  ChevronDown,
  X,
  Activity,
  Handshake,
  GraduationCap,
  Sparkles,
  MessageCircleHeart,
  ShieldAlert,
} from 'lucide-react'

interface NavSection {
  id: string
  label: string
  icon: React.ReactNode
  items: { to: string; label: string }[]
}

const navSections: NavSection[] = [
  {
    id: 'main',
    label: 'الرئيسية',
    icon: <LayoutDashboard className="h-5 w-5" />,
    items: [
      { to: '/dashboard', label: 'لوحة القيادة' },
    ],
  },
  {
    id: 'beneficiaries',
    label: 'المستفيدون',
    icon: <Users className="h-5 w-5" />,
    items: [
      { to: '/beneficiaries', label: 'قائمة المستفيدين' },
      { to: '/empowerment', label: 'التمكين' },
      { to: '/family', label: 'بوابة الأسرة' },
    ],
  },
  {
    id: 'medical',
    label: 'الخدمات الطبية',
    icon: <Stethoscope className="h-5 w-5" />,
    items: [
      { to: '/medical', label: 'الملفات الطبية' },
      { to: '/medications', label: 'الأدوية' },
      { to: '/safety', label: 'مخاطر السقوط' },
    ],
  },
  {
    id: 'care',
    label: 'الرعاية اليومية',
    icon: <HeartPulse className="h-5 w-5" />,
    items: [
      { to: '/care', label: 'سجل الرعاية' },
      { to: '/handover', label: 'تسليم الورديات' },
    ],
  },
  {
    id: 'feedback',
    label: 'الصدى الصامت',
    icon: <MessageCircleHeart className="h-5 w-5" />,
    items: [
      { to: '/feedback', label: 'الاستبيان والمزاج' },
    ],
  },
  {
    id: 'emergency',
    label: 'خطط الطوارئ',
    icon: <ShieldAlert className="h-5 w-5" />,
    items: [
      { to: '/emergency', label: 'خطط PEEP والمعدات' },
    ],
  },
  {
    id: 'ipc',
    label: 'مكافحة العدوى',
    icon: <Activity className="h-5 w-5" />,
    items: [
      { to: '/ipc', label: 'لوحة مكافحة العدوى' },
      { to: '/ipc/inspection', label: 'الفحص اليومي' },
      { to: '/ipc/immunizations', label: 'التطعيمات' },
    ],
  },
  {
    id: 'social',
    label: 'الخدمات الاجتماعية',
    icon: <Handshake className="h-5 w-5" />,
    items: [
      { to: '/social', label: 'البحث الاجتماعي' },
      { to: '/social/leaves', label: 'طلبات الإجازة' },
      { to: '/social/activities', label: 'الأنشطة' },
    ],
  },
  {
    id: 'catering',
    label: 'التغذية',
    icon: <Utensils className="h-5 w-5" />,
    items: [
      { to: '/catering', label: 'لوحة التغذية' },
      { to: '/catering/daily-log', label: 'السجل اليومي' },
      { to: '/catering/quality', label: 'مراقبة الجودة' },
    ],
  },
  {
    id: 'operations',
    label: 'العمليات',
    icon: <Wrench className="h-5 w-5" />,
    items: [
      { to: '/operations', label: 'لوحة العمليات' },
      { to: '/operations/assets', label: 'الأصول' },
      { to: '/operations/maintenance', label: 'الصيانة' },
    ],
  },
  {
    id: 'grc',
    label: 'الحوكمة والجودة',
    icon: <Shield className="h-5 w-5" />,
    items: [
      { to: '/grc', label: 'لوحة الحوكمة' },
      { to: '/grc/risks', label: 'سجل المخاطر' },
      { to: '/grc/compliance', label: 'الامتثال' },
      { to: '/quality', label: 'إدارة الجودة' },
    ],
  },
  {
    id: 'reports',
    label: 'التقارير',
    icon: <BarChart3 className="h-5 w-5" />,
    items: [
      { to: '/reports', label: 'لوحة التقارير' },
      { to: '/strategic', label: 'المؤشرات الاستراتيجية' },
      { to: '/indicators', label: 'المؤشرات الذكية' },
    ],
  },
  {
    id: 'admin',
    label: 'التدريب والدعم',
    icon: <GraduationCap className="h-5 w-5" />,
    items: [
      { to: '/training', label: 'التدريب' },
      { to: '/support', label: 'الدعم الفني' },
      { to: '/settings', label: 'الإعدادات' },
    ],
  },
]

function SidebarSection({ section }: { section: NavSection }) {
  const location = useLocation()
  const isActive = section.items.some((item) => location.pathname.startsWith(item.to))
  const [open, setOpen] = useState(isActive)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-teal/10 text-teal'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800',
        )}
      >
        {section.icon}
        <span className="flex-1 text-right">{section.label}</span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ms-4 mt-1 space-y-0.5 border-s-2 border-slate-200 ps-3 dark:border-slate-700">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive: active }) =>
                    cn(
                      'block rounded-lg px-3 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-teal/10 font-medium text-teal'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 start-0 z-50 flex h-full w-[280px] flex-col border-e border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0',
          'dark:border-slate-700 dark:bg-slate-900',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-gold" />
            <span className="text-lg font-bold text-navy dark:text-white">بصيرة</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navSections.map((section) => (
            <SidebarSection key={section.id} section={section} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-3 dark:border-slate-700">
          <NavLink
            to="/settings"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <Settings className="h-4 w-4" />
            الإعدادات
          </NavLink>
        </div>
      </aside>
    </>
  )
}
