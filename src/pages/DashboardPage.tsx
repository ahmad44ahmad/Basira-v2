import { motion } from 'framer-motion'
import {
  Users, HeartPulse, AlertTriangle, TrendingUp, Target, FileCheck, Activity,
  Clock, CheckCircle, Database, Cloud, Shield, ChevronLeft,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui'

// ── Department Performance Data ─────────────────────────────────

const DEPARTMENT_PERFORMANCE = [
  { type: 'medical', label: 'الخدمات الطبية', progress: 82, total: 45, color: 'bg-rose-500' },
  { type: 'social', label: 'الرعاية الاجتماعية', progress: 75, total: 38, color: 'bg-blue-500' },
  { type: 'psychological', label: 'الدعم النفسي', progress: 68, total: 30, color: 'bg-purple-500' },
  { type: 'physiotherapy', label: 'العلاج الطبيعي', progress: 71, total: 28, color: 'bg-teal-500' },
  { type: 'occupational', label: 'العلاج الوظيفي', progress: 65, total: 22, color: 'bg-amber-500' },
]

const RECENT_ACTIVITY = [
  { action: 'تسجيل رعاية يومية', target: 'أحمد محمد السالم', time: 'منذ 15 دقيقة', icon: HeartPulse, color: 'text-rose-500' },
  { action: 'تقييم مخاطر السقوط', target: 'فاطمة عبدالله العمري', time: 'منذ 30 دقيقة', icon: Shield, color: 'text-amber-500' },
  { action: 'اكتمال خطة تأهيل', target: 'خالد سعيد الغامدي', time: 'منذ ساعة', icon: Target, color: 'text-emerald-500' },
  { action: 'طلب صيانة جديد', target: 'قسم الذكور - غرفة 12', time: 'منذ ساعتين', icon: Activity, color: 'text-blue-500' },
  { action: 'إجازة عائلية - موافقة', target: 'سارة محمد الحربي', time: 'منذ 3 ساعات', icon: CheckCircle, color: 'text-teal-500' },
]

const PENDING_TASKS = [
  { label: 'موافقات مدير معلقة', count: 4, urgent: true },
  { label: 'خطط تأهيل بانتظار الاعتماد', count: 7, urgent: false },
  { label: 'تحديثات الضمان الاجتماعي', count: 3, urgent: false },
  { label: 'تقارير طبية متأخرة', count: 2, urgent: true },
]

const COMPLIANCE_TREND = [
  { label: 'الأسبوع 1', value: 78 },
  { label: 'الأسبوع 2', value: 82 },
  { label: 'الأسبوع 3', value: 85 },
  { label: 'الأسبوع 4', value: 88 },
]

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
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="لوحة القيادة التنفيذية"
        description="نظرة شاملة على الأداء التشغيلي للمركز"
      />

      {/* KPI Grid — "The Pulse" */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="المستفيدين النشطين"
          value="156"
          subtitle="ملف نشط في المركز"
          icon={<Users className="h-6 w-6" />}
          accent="teal"
          trend={{ value: 5, positive: true }}
        />
        <StatCard
          title="نسبة تغطية الخطط"
          value="88%"
          subtitle="137 خطة من 156 مستفيد"
          icon={<FileCheck className="h-6 w-6" />}
          accent="success"
          trend={{ value: 6, positive: true }}
        />
        <StatCard
          title="متوسط إنجاز الأهداف"
          value="72%"
          subtitle="عبر جميع الأقسام"
          icon={<Target className="h-6 w-6" />}
          accent="gold"
          trend={{ value: 4, positive: true }}
        />
        <StatCard
          title="حالات حرجة"
          value="3"
          subtitle="تتطلب تدخل فوري"
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
            <div className="space-y-4">
              {DEPARTMENT_PERFORMANCE.map((dept, i) => (
                <div key={dept.type}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{dept.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{dept.total} هدف</span>
                      <span className="font-bold text-slate-900 dark:text-white">{dept.progress}%</span>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.progress}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full rounded-full ${dept.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
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
            <div className="flex items-end gap-3" style={{ height: 120 }}>
              {COMPLIANCE_TREND.map((week, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{week.value}%</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${week.value}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-hrsd-teal to-emerald-400"
                    style={{ maxHeight: 100 }}
                  />
                  <span className="text-[10px] text-slate-500">{week.label}</span>
                </div>
              ))}
            </div>
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
              <QuickLink to="/beneficiaries" label="المستفيدين" icon={Users} count={156} />
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
