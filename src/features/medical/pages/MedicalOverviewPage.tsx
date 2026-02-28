import { Stethoscope, Users, Syringe, ShieldAlert, Activity, FileText, Smile, Ear } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

const quickActions = [
  { to: '/care', label: 'سجل الرعاية اليومية', icon: <Activity className="h-5 w-5" />, color: 'bg-teal/10 text-teal' },
  { to: '/safety', label: 'تقييم مخاطر السقوط', icon: <ShieldAlert className="h-5 w-5" />, color: 'bg-red-500/10 text-red-500' },
  { to: '/medications', label: 'إعطاء الأدوية', icon: <Syringe className="h-5 w-5" />, color: 'bg-purple-500/10 text-purple-500' },
  { to: '/handover', label: 'تسليم الورديات', icon: <FileText className="h-5 w-5" />, color: 'bg-blue-500/10 text-blue-500' },
  { to: '/ipc', label: 'مكافحة العدوى', icon: <ShieldAlert className="h-5 w-5" />, color: 'bg-amber-500/10 text-amber-500' },
  { to: '/medical', label: 'الخدمات النفسية', icon: <Smile className="h-5 w-5" />, color: 'bg-pink-500/10 text-pink-500' },
  { to: '/medical', label: 'النطق والتخاطب', icon: <Ear className="h-5 w-5" />, color: 'bg-indigo-500/10 text-indigo-500' },
]

const recentExams = [
  { name: 'أحمد محمد السالم', type: 'فحص دوري', date: '2026-02-27', result: 'طبيعي' },
  { name: 'فاطمة عبدالله الزهراني', type: 'فحص أسنان', date: '2026-02-26', result: 'يحتاج متابعة' },
  { name: 'نورة حسن العتيبي', type: 'علاج طبيعي', date: '2026-02-26', result: 'تحسن ملحوظ' },
  { name: 'خالد سعيد الغامدي', type: 'تقييم نفسي', date: '2026-02-25', result: 'مستقر' },
]

const progressItems = [
  { label: 'نسبة التطعيم', value: 85, color: 'bg-teal' },
  { label: 'الفحوصات الدورية', value: 72, color: 'bg-blue-500' },
  { label: 'الامتثال الدوائي', value: 95, color: 'bg-success' },
  { label: 'اكتمال الملفات الطبية', value: 88, color: 'bg-gold' },
]

export function MedicalOverviewPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="الخدمات الطبية"
        description="نظرة شاملة على الحالة الطبية والخدمات العلاجية"
        icon={<Stethoscope className="h-5 w-5" />}
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="الملفات الطبية" value="148" icon={<Users className="h-6 w-6" />} accent="teal" subtitle="ملف نشط" />
        <StatCard title="الحالات الفعالة" value="23" icon={<Activity className="h-6 w-6" />} accent="gold" subtitle="تحت المتابعة" />
        <StatCard title="تطعيمات معلقة" value="12" icon={<Syringe className="h-6 w-6" />} accent="danger" />
        <StatCard title="حالات عزل" value="2" icon={<ShieldAlert className="h-6 w-6" />} accent="navy" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>الوصول السريع</CardTitle></CardHeader>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 text-center transition-all hover:shadow-card hover:-translate-y-0.5 dark:border-slate-700"
              >
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', action.color)}>
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{action.label}</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader><CardTitle>مؤشرات الأداء</CardTitle></CardHeader>
          <div className="space-y-4">
            {progressItems.map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className={cn('h-full rounded-full transition-all duration-700', item.color)} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Exams */}
      <Card className="mt-6">
        <CardHeader><CardTitle>آخر الفحوصات</CardTitle></CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-right dark:border-slate-700">
                <th className="px-3 py-2 font-medium text-slate-500">المستفيد</th>
                <th className="px-3 py-2 font-medium text-slate-500">نوع الفحص</th>
                <th className="px-3 py-2 font-medium text-slate-500">التاريخ</th>
                <th className="px-3 py-2 font-medium text-slate-500">النتيجة</th>
              </tr>
            </thead>
            <tbody>
              {recentExams.map((exam, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">{exam.name}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{exam.type}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{exam.date}</td>
                  <td className="px-3 py-3">
                    <Badge variant={exam.result === 'طبيعي' || exam.result === 'مستقر' ? 'success' : exam.result.includes('تحسن') ? 'info' : 'warning'}>
                      {exam.result}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
