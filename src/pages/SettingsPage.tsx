import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Sun, Moon, Monitor, Bell, BellOff, Globe, LayoutGrid, LayoutList, Save, User, Shield } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { Card, CardHeader, CardTitle, Button } from '@/components/ui'
import { useUIStore } from '@/stores/useUIStore'

type ThemeOption = 'light' | 'dark' | 'auto'
type LayoutOption = 'compact' | 'comfortable'

interface SettingsState {
  theme: ThemeOption
  notifications: boolean
  language: 'ar' | 'en'
  layout: LayoutOption
}

function loadSettings(): SettingsState {
  try {
    const saved = localStorage.getItem('basira_settings')
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return { theme: 'dark', notifications: true, language: 'ar', layout: 'comfortable' }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(loadSettings)
  const [saved, setSaved] = useState(false)
  const { darkMode, toggleDarkMode } = useUIStore()

  const update = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem('basira_settings', JSON.stringify(settings))
    // Apply theme
    if (settings.theme === 'dark' && !darkMode) toggleDarkMode()
    if (settings.theme === 'light' && darkMode) toggleDarkMode()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const themeOptions: { value: ThemeOption; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'فاتح', icon: Sun },
    { value: 'dark', label: 'داكن', icon: Moon },
    { value: 'auto', label: 'تلقائي', icon: Monitor },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader title="الإعدادات" description="تخصيص المظهر والإشعارات والتفضيلات" />

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> المظهر</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon
              const active = settings.theme === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => update('theme', opt.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${active ? 'border-hrsd-teal bg-hrsd-teal/5' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'}`}
                >
                  <Icon className={`h-6 w-6 ${active ? 'text-hrsd-teal' : 'text-slate-400'}`} />
                  <span className={`text-sm font-medium ${active ? 'text-hrsd-teal' : 'text-slate-600 dark:text-slate-400'}`}>{opt.label}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {settings.notifications ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
              الإشعارات
            </CardTitle>
          </CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">تفعيل الإشعارات</p>
              <p className="text-xs text-slate-500">استلام تنبيهات حول التحديثات والتذكيرات</p>
            </div>
            <button
              onClick={() => update('notifications', !settings.notifications)}
              className={`relative h-6 w-11 rounded-full transition-colors ${settings.notifications ? 'bg-hrsd-teal' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <motion.div
                animate={{ x: settings.notifications ? -20 : 0 }}
                className="absolute top-0.5 end-0.5 h-5 w-5 rounded-full bg-white shadow"
              />
            </button>
          </div>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> اللغة</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'ar' as const, label: 'العربية', flag: '🇸🇦' },
              { value: 'en' as const, label: 'English', flag: '🇬🇧' },
            ]).map((lang) => {
              const active = settings.language === lang.value
              return (
                <button
                  key={lang.value}
                  onClick={() => update('language', lang.value)}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all ${active ? 'border-hrsd-teal bg-hrsd-teal/5' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'}`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className={`font-medium ${active ? 'text-hrsd-teal' : 'text-slate-600 dark:text-slate-400'}`}>{lang.label}</span>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Layout */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {settings.layout === 'compact' ? <LayoutList className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
              تخطيط لوحة التحكم
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'compact' as LayoutOption, label: 'مدمج', desc: 'عرض أكثر بيانات في مساحة أقل' },
              { value: 'comfortable' as LayoutOption, label: 'مريح', desc: 'مسافات أوسع وعناصر أكبر' },
            ]).map((opt) => {
              const active = settings.layout === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => update('layout', opt.value)}
                  className={`rounded-xl border-2 p-4 text-right transition-all ${active ? 'border-hrsd-teal bg-hrsd-teal/5' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'}`}
                >
                  <div className={`font-medium ${active ? 'text-hrsd-teal' : 'text-slate-600 dark:text-slate-400'}`}>{opt.label}</div>
                  <div className="text-xs text-slate-500">{opt.desc}</div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> معلومات الحساب</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="text-sm text-slate-500">الدور</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">مدير النظام</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="text-sm text-slate-500">آخر تسجيل دخول</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">2026-02-28 08:30</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="text-sm text-slate-500">الإصدار</span>
              <span className="font-mono text-sm text-slate-500">v2.0.0</span>
            </div>
          </div>
        </Card>

        {/* Save */}
        <Button onClick={handleSave} className="w-full">
          <Save className="ms-1.5 h-4 w-4" />
          {saved ? 'تم الحفظ ✓' : 'حفظ الإعدادات'}
        </Button>
      </div>
    </div>
  )
}
