import { useState } from 'react'
import { MessageCircleHeart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageHeader } from '@/components/layout'
import { Spinner, Tabs } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useVisualSurveys } from '../api/feedback-queries'
import { VisualSurvey } from '../components/VisualSurvey'
import { MoodCurveDashboard } from '../components/MoodCurveDashboard'
import { MoodTelemetrySection } from '../components/MoodTelemetrySection'

export function FeedbackPage() {
  const [activeTab, setActiveTab] = useState('survey')
  const { isLoading, error } = useVisualSurveys()

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" text="جاري التحميل..." /></div>
  if (error) return <EmptyState title="خطأ" description="خطأ في تحميل البيانات" />

  const tabs = [
    { id: 'survey', label: 'الاستبيان البصري' },
    { id: 'mood', label: 'لوحة المزاج' },
    { id: 'telemetry', label: 'القياس الحيوي' },
  ]

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="الصدى الصامت"
        description="استبيانات بصرية ورصد المزاج للمستفيدين غير الناطقين"
        icon={<MessageCircleHeart className="h-5 w-5" />}
      />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

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
          {activeTab === 'telemetry' && <MoodTelemetrySection />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
