import { Menu, Sun, Moon, Bell, Search } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'
import { useAuth } from '@/providers/AuthProvider'
import { Avatar } from '@/components/ui'
import { cn } from '@/lib/utils'

export function Header() {
  const { toggleSidebar, darkMode, toggleDarkMode } = useUIStore()
  const { user } = useAuth()

  const displayName = user?.user_metadata?.full_name || user?.email || 'مستخدم'

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 backdrop-blur-sm',
        'border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80',
      )}
    >
      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث سريع..."
            className={cn(
              'h-9 w-64 rounded-lg border bg-slate-50 pr-9 pl-3 text-sm',
              'border-slate-200 placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold',
              'dark:bg-slate-800 dark:border-slate-600',
            )}
          />
        </div>
      </div>

      {/* Left side */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          title={darkMode ? 'الوضع الفاتح' : 'الوضع الداكن'}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>

        <div className="flex items-center gap-2 rounded-lg px-2 py-1">
          <Avatar name={displayName} size="sm" />
          <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:block">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  )
}
