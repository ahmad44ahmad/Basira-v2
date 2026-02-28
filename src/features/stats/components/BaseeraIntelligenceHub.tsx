import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Stethoscope, Heart, ShieldCheck, Download, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, Badge, Button, Tabs, Spinner } from '@/components/ui'
import { useCrossDomainIntelligence } from '../hooks/useCrossDomainIntelligence'
import { generateFHIRPassport } from '@/lib/fhir-exporter'
import type { IntelligenceAlert, AlertCategory } from '../hooks/useCrossDomainIntelligence'
import type { UnifiedBeneficiaryProfile } from '@/features/beneficiaries'

// ── Tab Config ──────────────────────────────────────────────────

const TABS = [
  { id: 'clinical', label: 'سريري', icon: <Stethoscope className="h-4 w-4" /> },
  { id: 'empowerment', label: 'تمكين', icon: <Heart className="h-4 w-4" /> },
  { id: 'quality', label: 'جودة', icon: <ShieldCheck className="h-4 w-4" /> },
]

// ── Alert Card ──────────────────────────────────────────────────

function AlertCard({ alert }: { alert: IntelligenceAlert }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <AlertTriangle
              className={`h-4 w-4 shrink-0 ${alert.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}
            />
            <span className="text-sm font-bold text-slate-900 dark:text-white">{alert.title}</span>
            <Badge variant={alert.severity === 'critical' ? 'danger' : 'warning'}>
              {alert.severity === 'critical' ? 'حرج' : 'تحذير'}
            </Badge>
          </div>
          {alert.beneficiaryId !== '__systemic__' && (
            <p className="text-sm text-slate-600 dark:text-slate-400">{alert.beneficiaryName}</p>
          )}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{alert.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {alert.relatedDomains.map((domain) => (
              <Badge key={domain} variant="teal">{domain}</Badge>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── FHIR Export ─────────────────────────────────────────────────

function handleExportFHIR(
  alerts: IntelligenceAlert[],
  beneficiaryMap: Map<string, UnifiedBeneficiaryProfile>,
) {
  const alertsByBen = new Map<string, IntelligenceAlert[]>()
  for (const alert of alerts) {
    if (alert.beneficiaryId === '__systemic__') continue
    const arr = alertsByBen.get(alert.beneficiaryId)
    if (arr) arr.push(alert)
    else alertsByBen.set(alert.beneficiaryId, [alert])
  }

  const bundles = []
  for (const [benId, benAlerts] of alertsByBen) {
    const ben = beneficiaryMap.get(benId)
    if (!ben) continue
    bundles.push(generateFHIRPassport(ben, benAlerts))
  }

  const blob = new Blob([JSON.stringify(bundles, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `basira-fhir-passport-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Main Component ──────────────────────────────────────────────

export function BaseeraIntelligenceHub() {
  const [activeTab, setActiveTab] = useState<AlertCategory>('clinical')
  const { alerts, isLoading, beneficiaryMap } = useCrossDomainIntelligence()

  const filteredAlerts = alerts.filter((a) => a.category === activeTab)
  const clinicalCount = alerts.filter((a) => a.category === 'clinical').length
  const empowermentCount = alerts.filter((a) => a.category === 'empowerment').length
  const qualityCount = alerts.filter((a) => a.category === 'quality').length
  const totalCount = alerts.length

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-hrsd-teal" />
            محرك الذكاء متعدد النطاقات
            {totalCount > 0 && (
              <Badge variant="danger" dot>{totalCount} تنبيه</Badge>
            )}
          </CardTitle>
          {alerts.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportFHIR(alerts, beneficiaryMap)}
            >
              <Download className="h-4 w-4 ms-1.5" />
              تصدير FHIR
            </Button>
          )}
        </div>
      </CardHeader>

      <div className="px-4 pb-4">
        <Tabs
          tabs={TABS.map((t) => ({
            ...t,
            label: `${t.label} (${t.id === 'clinical' ? clinicalCount : t.id === 'empowerment' ? empowermentCount : qualityCount})`,
          }))}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as AlertCategory)}
        />

        <div className="mt-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-8 text-center"
              >
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  لا توجد تنبيهات حالية في هذا القسم
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}
