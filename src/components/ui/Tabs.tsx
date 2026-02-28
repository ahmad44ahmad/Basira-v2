import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  content?: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  /** Controlled active tab id */
  activeTab?: string
  /** Callback when tab changes (controlled mode) */
  onChange?: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, defaultTab, activeTab: controlledTab, onChange, className }: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id || '')

  const currentTab = controlledTab ?? internalTab
  const handleChange = (id: string) => {
    if (onChange) onChange(id)
    else setInternalTab(id)
  }

  const active = tabs.find((t) => t.id === currentTab)

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={tab.id === currentTab}
            onClick={() => handleChange(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
              tab.id === currentTab
                ? 'text-teal'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.id === currentTab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 start-0 end-0 h-0.5 bg-teal"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content — only rendered when using uncontrolled mode with content */}
      {active?.content && (
        <div className="pt-4" role="tabpanel" aria-labelledby={`tab-${currentTab}`}>
          {active.content}
        </div>
      )}
    </div>
  )
}
