import { useState } from 'react'
import { MessageCircleHeart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { Spinner } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useVisualSurveys } from '../api/feedback-queries'
import { VisualSurvey } from '../components/VisualSurvey'
import { MoodCurveDashboard } from '../components/MoodCurveDashboard'

export function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('survey')
  const { isLoading, error } = useVisualSurveys()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <div className="flex justify-center py-12 text-center"><p className="text-lg font-bold text-red-600">خطأ في تحميل البيانات</p></div>

  const tabs = [
    { id: 'survey', label: 'الاستبيان البصري' },
    { id: 'mood', label: 'لوحة المزاج' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="الصدى الصامت"
        description="استبيانات بصرية ورصد المزاج للمستفيدين غير الناطقين"
        icon={<MessageCircleHeart className="h-5 w-5" />}
      />

      <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-teal-600 text-teal-700 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'survey' && <VisualSurvey />}
          {activeTab === 'mood' && <MoodCurveDashboard />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
