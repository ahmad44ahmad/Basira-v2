import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HelpCircle, MessageCircle, Book, ChevronDown, ChevronUp,
  Phone, Mail, Clock, Shield,
} from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { Card, CardHeader, CardTitle } from '@/components/ui'

// ── FAQ Data ────────────────────────────────────────────────────

const FAQ_ITEMS = [
  { q: 'كيف أضيف مستفيد جديد؟', a: 'اذهب إلى صفحة المستفيدين واضغط على زر "إضافة مستفيد" في أعلى الصفحة. أكمل النموذج بالبيانات الأساسية ثم اضغط حفظ.' },
  { q: 'كيف أسجل رعاية يومية؟', a: 'من صفحة الرعاية اليومية، اختر المستفيد المطلوب ثم أكمل نموذج الرعاية اليومية الذي يشمل العلامات الحيوية والملاحظات.' },
  { q: 'كيف أطلب صيانة؟', a: 'من صفحة العمليات > الصيانة، اضغط "طلب صيانة جديد" وحدد الموقع ونوع الصيانة والأولوية ووصف المشكلة.' },
  { q: 'كيف أصدر تقرير؟', a: 'من صفحة التقارير، اختر نوع التقرير المطلوب (استراتيجي، ISO، SROI، استدامة) وسيتم عرض البيانات تلقائياً.' },
  { q: 'كيف أستخدم البحث السريع؟', a: 'اضغط Ctrl+K (أو Cmd+K على ماك) لفتح قائمة البحث السريع. يمكنك البحث عن أي صفحة أو قسم والتنقل إليه مباشرة.' },
  { q: 'كيف أغير المظهر (فاتح/داكن)؟', a: 'من صفحة الإعدادات، اختر المظهر المناسب: فاتح أو داكن أو تلقائي. يمكنك أيضاً استخدام زر التبديل في الشريط العلوي.' },
  { q: 'ماذا أفعل عند حادثة مكافحة عدوى؟', a: 'اذهب إلى مكافحة العدوى > الحوادث وسجل البلاغ فوراً. حدد نوع الحادثة ودرجة الخطورة والإجراءات الفورية المتخذة.' },
  { q: 'كيف أتابع مؤشرات الأداء؟', a: 'من صفحة المؤشرات الذكية ستجد 8 مؤشرات استراتيجية مع اتجاهاتها وحالتها. يمكنك أيضاً مقارنة الأداء مع معايير الوزارة.' },
]

// ── Component ───────────────────────────────────────────────────

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="animate-fade-in">
      <PageHeader title="الدعم الفني" description="المساعدة والأسئلة الشائعة ومعلومات الاتصال" />

      <div className="mx-auto max-w-3xl space-y-6">
        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: 'دليل المستخدم', desc: 'تعلم أساسيات النظام', icon: Book, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { title: 'الدعم المباشر', desc: 'تواصل مع فريق الدعم', icon: MessageCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            { title: 'الأمان والخصوصية', desc: 'سياسات حماية البيانات', icon: Shield, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className={`${item.bg} cursor-pointer border-0 transition-shadow hover:shadow-lg`}>
                  <div className="p-5">
                    <Icon className={`mb-3 h-8 w-8 ${item.color}`} />
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-hrsd-teal" /> الأسئلة الشائعة
            </CardTitle>
          </CardHeader>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {FAQ_ITEMS.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-right"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الاتصال</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { icon: Phone, label: 'هاتف الدعم', value: '920-00-1234', sublabel: 'أيام العمل 8ص - 4م' },
              { icon: Mail, label: 'البريد الإلكتروني', value: 'support@basira.gov.sa', sublabel: 'رد خلال 24 ساعة' },
              { icon: Clock, label: 'ساعات العمل', value: 'الأحد - الخميس', sublabel: '8:00 ص - 4:00 م' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hrsd-teal/10">
                    <Icon className="h-5 w-5 text-hrsd-teal" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.sublabel}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{item.value}</span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات النظام</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="text-slate-500">الإصدار</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white">v2.0.0</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="text-slate-500">المنصة</span>
              <div className="font-bold text-slate-900 dark:text-white">Basira Cloud</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="text-slate-500">قاعدة البيانات</span>
              <div className="font-bold text-slate-900 dark:text-white">Supabase</div>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <span className="text-slate-500">آخر تحديث</span>
              <div className="font-bold text-slate-900 dark:text-white">2026-02-28</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
