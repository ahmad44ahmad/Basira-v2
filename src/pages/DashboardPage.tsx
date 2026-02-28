import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  Users, HeartPulse, AlertTriangle, TrendingUp, Target, FileCheck, Activity,
  Clock, Database, Cloud, Shield, ChevronLeft,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { DEPARTMENT_PERFORMANCE, RECENT_ACTIVITY, PENDING_TASKS, COMPLIANCE_TREND } from './dashboard-demo-data'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui'
import { BaseeraIntelligenceHub } from '@/features/stats'
import { useBeneficiaryStats } from '@/features/beneficiaries'
import { useRehabGoals } from '@/features/empowerment'
import { useRisks } from '@/features/grc'
import { useMaintenanceRequests } from '@/features/operations'

const DEPT_COLORS = ['#1E6B5C', '#14415A', '#F59601', '#3b82f6', '#8b5cf6']

// ── Quick Links ─────────────────────────────────────────────────

function QuickLink({ to, label, icon: Icon, count }: { to: string; label: string; icon: typeof Users; count?: number }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center justify-between rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-hrsd-teal" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {count !== undefined && (
          <Badge className="bg-hrsd-teal/10 text-hrsd-teal">{count}</Badge>
        )}
        <ChevronLeft className="h-4 w-4 text-slate-400" />
      </div>
    </button>
  )
}

// ── Main Component ──────────────────────────────────────────────

export function DashboardPage() {
  const beneficiaryStats = useBeneficiaryStats()
  const { data: goals = [] } = useRehabGoals()
  const { data: risks = [] } = useRisks()
  const { data: maintenance = [] } = useMaintenanceRequests()

  const activeCount = beneficiaryStats.active || beneficiaryStats.total
  const highRiskCount = beneficiaryStats.highRisk + risks.filter((r) => r.riskLevel === 'critical' || r.riskLevel === 'high').length
  const avgGoalProgress = goals.length > 0
    ? Math.round(goals.reduce((s, g) => s + (g.progress_percentage ?? 0), 0) / goals.length)
    : 72
  const pendingMaint = maintenance.filter((m) => m.status === 'pending' || m.status === 'in_progress').length

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="لوحة القيادة التنفيذية"
        description="نظرة شاملة على الأداء التشغيلي للمركز"
      />

      {/* Intelligence Hub */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-6"
      >
        <BaseeraIntelligenceHub />
      </motion.div>

      {/* KPI Grid — "The Pulse" */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="المستفيدين النشطين"
          value={String(activeCount)}
          subtitle="ملف نشط في المركز"
          icon={<Users className="h-6 w-6" />}
          accent="teal"
        />
        <StatCard
          title="نسبة تغطية الخطط"
          value={goals.length > 0 ? `${Math.round((goals.filter((g) => g.status === 'active' || g.status === 'achieved').length / Math.max(activeCount, 1)) * 100)}%` : '88%'}
          subtitle={`${goals.filter((g) => g.status === 'active' || g.status === 'achieved').length || 137} خطة من ${activeCount || 156} مستفيد`}
          icon={<FileCheck className="h-6 w-6" />}
          accent="success"
        />
        <StatCard
          title="متوسط إنجاز الأهداف"
          value={`${avgGoalProgress}%`}
          subtitle="عبر جميع الأقسام"
          icon={<Target className="h-6 w-6" />}
          accent="gold"
        />
        <StatCard
          title="حالات حرجة"
          value={String(highRiskCount || 3)}
          subtitle={pendingMaint > 0 ? `+ ${pendingMaint} صيانة معلقة` : 'تتطلب تدخل فوري'}
          icon={<AlertTriangle className="h-6 w-6" />}
          accent="danger"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2/3) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-hrsd-teal" />
                أداء الأقسام (معدل إنجاز الأهداف)
              </CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={DEPARTMENT_PERFORMANCE.length * 50}>
              <BarChart data={DEPARTMENT_PERFORMANCE} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: '#94a3b8' }} width={80} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'الإنجاز']} />
                <Bar dataKey="progress" radius={[0, 4, 4, 0]} animationDuration={800}>
                  {DEPARTMENT_PERFORMANCE.map((entry, index) => (
                    <Cell key={index} fill={DEPT_COLORS[index % DEPT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-hrsd-teal" />
                النشاط الأخير
              </CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {RECENT_ACTIVITY.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 ${item.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.action}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.target}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </motion.div>
                )
              })}
            </div>
          </Card>

          {/* Compliance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>اتجاه الامتثال الأسبوعي</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={COMPLIANCE_TREND} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} width={30} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'الامتثال']} />
                <Bar dataKey="value" fill="#1E6B5C" radius={[4, 4, 0, 0]} animationDuration={600} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                المهام المعلقة
              </CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {PENDING_TASKS.map((task, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg p-3 ${task.urgent ? 'bg-red-50 dark:bg-red-900/10' : 'bg-slate-50 dark:bg-slate-800/50'}`}
                >
                  <span className={`text-sm ${task.urgent ? 'font-medium text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                    {task.label}
                  </span>
                  <Badge className={task.urgent ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}>
                    {task.count}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>حالة النظام</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {[
                { label: 'قاعدة البيانات', status: 'مستقر', icon: Database, ok: true },
                { label: 'المزامنة السحابية', status: 'آخر مزامنة: 10:00 ص', icon: Cloud, ok: true },
                { label: 'النسخ الاحتياطي', status: 'مكتمل', icon: Shield, ok: true },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${item.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-slate-500">{item.status}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>وصول سريع</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              <QuickLink to="/beneficiaries" label="المستفيدين" icon={Users} count={activeCount || 156} />
              <QuickLink to="/medical" label="الملفات الطبية" icon={HeartPulse} />
              <QuickLink to="/indicators" label="المؤشرات الذكية" icon={Activity} count={8} />
              <QuickLink to="/reports" label="التقارير" icon={FileCheck} />
              <QuickLink to="/grc" label="الحوكمة والمخاطر" icon={Shield} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
