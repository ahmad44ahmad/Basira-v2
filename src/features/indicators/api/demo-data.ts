import type { SmartIndicator, BenchmarkStandard, DepartmentHrStats, DiscrepancyAlert } from '../types'

export const DEMO_INDICATORS: SmartIndicator[] = [
  {
    id: '1', domain: 'early_warning', titleAr: 'نظام الإنذار المبكر', subtitleAr: 'كشف الحالات الحرجة مبكراً',
    mainValue: '105', mainLabel: 'نقاط الخطر', trend: 'down', trendValue: '-12%',
    status: 'critical', category: 'both', sparklineData: [125, 115, 140, 145, 170, 188, 143, 103, 105],
    description: 'نظام ذكي يراقب مؤشرات السقوط والتدهور الصحي والسلوكي لاكتشاف الحالات عالية الخطورة',
  },
  {
    id: '2', domain: 'biological', titleAr: 'التدقيق البيولوجي', subtitleAr: 'كشف الفساد عبر ربط المخزون',
    mainValue: '-24%', mainLabel: 'فجوة غير مفسرة', trend: 'down', trendValue: '-8%',
    status: 'critical', category: 'center', sparklineData: [10, 12, 15, 18, 20, 22, 24],
    description: 'ربط مخرجات المخزون بمؤشرات صحة المستفيدين (الوزن والهيموجلوبين) لكشف أي تسرب أو فساد',
  },
  {
    id: '3', domain: 'satisfaction', titleAr: 'الرضا الآني', subtitleAr: 'توقع مشاكل العلاقات العامة',
    mainValue: '72%', mainLabel: 'نسبة الرضا', trend: 'down', trendValue: '-8%',
    status: 'warning', category: 'center', sparklineData: [85, 82, 78, 75, 70, 72],
    description: 'تحليل اتجاهات رضا المستفيدين وأسرهم للتنبؤ بالمشاكل قبل تفاقمها',
  },
  {
    id: '4', domain: 'behavioral', titleAr: 'التنبؤ السلوكي', subtitleAr: 'منع الانفجار السلوكي بالذكاء الاصطناعي',
    mainValue: '87%', mainLabel: 'دقة التنبؤ', trend: 'up', trendValue: '+3%',
    status: 'warning', category: 'center', sparklineData: [80, 82, 85, 83, 86, 87],
    description: 'نموذج ذكاء اصطناعي يتنبأ بالسلوكيات الخطرة بناءً على أنماط الحركة والنوم والتفاعل',
  },
  {
    id: '5', domain: 'cost', titleAr: 'التكلفة/المستفيد', subtitleAr: 'تحليل التكاليف والخصخصة',
    mainValue: '380', mainLabel: 'ريال/مستفيد/يوم', trend: 'stable', trendValue: '0%',
    status: 'good', category: 'both', sparklineData: [365, 372, 380, 375, 378, 380],
    description: 'متابعة التكلفة الفعلية لكل مستفيد مقارنة بمعايير الوزارة وتحديد فرص الخصخصة',
  },
  {
    id: '6', domain: 'hr', titleAr: 'أثر الموارد البشرية', subtitleAr: 'ربط الغياب بجودة الخدمة',
    mainValue: '85%', mainLabel: 'نسبة الحضور', trend: 'down', trendValue: '-3%',
    status: 'warning', category: 'center', sparklineData: [92, 88, 85, 90, 78, 75, 85],
    description: 'تحليل الارتباط بين غياب الموظفين وجودة خدمات الرعاية المقدمة للمستفيدين',
  },
  {
    id: '7', domain: 'benchmark', titleAr: 'المقارنة المرجعية', subtitleAr: 'مقارنة مع معايير الوزارة',
    mainValue: '72%', mainLabel: 'الأداء العام', trend: 'up', trendValue: '+2%',
    status: 'warning', category: 'ministry', sparklineData: [65, 68, 70, 69, 71, 72],
    description: 'مقارنة أداء المركز مع المعايير الوطنية للوزارة عبر 8 مؤشرات معتمدة',
  },
  {
    id: '8', domain: 'iso_22301', titleAr: 'استمرارية الأعمال', subtitleAr: 'معايير ISO 22301',
    mainValue: '52%', mainLabel: 'نسبة الامتثال', trend: 'up', trendValue: '+5%',
    status: 'warning', category: 'ministry', sparklineData: [35, 40, 45, 48, 50, 52],
    description: 'مستوى امتثال المركز لمعايير استمرارية الأعمال ISO 22301 وخطط الطوارئ',
  },
]

export const DEMO_BENCHMARKS: BenchmarkStandard[] = [
  { indicatorName: 'إتمام الرعاية اليومية', indicatorCode: 'CARE_COMPLETION', ministryTarget: 95, excellentThreshold: 95, goodThreshold: 85, acceptableThreshold: 75, unit: '%', category: 'جودة', isHigherBetter: true, currentValue: 88 },
  { indicatorName: 'معدل السقوط', indicatorCode: 'FALL_RATE', ministryTarget: 2, excellentThreshold: 2, goodThreshold: 3.5, acceptableThreshold: 5, unit: '/1000 يوم', category: 'سلامة', isHigherBetter: false, currentValue: 3.2 },
  { indicatorName: 'نظافة الأيدي', indicatorCode: 'HAND_HYGIENE', ministryTarget: 90, excellentThreshold: 90, goodThreshold: 80, acceptableThreshold: 70, unit: '%', category: 'IPC', isHigherBetter: true, currentValue: 85 },
  { indicatorName: 'وقت الاستجابة', indicatorCode: 'ALERT_RESPONSE', ministryTarget: 15, excellentThreshold: 15, goodThreshold: 25, acceptableThreshold: 35, unit: 'دقيقة', category: 'جودة', isHigherBetter: false, currentValue: 18 },
  { indicatorName: 'رضا الأسر', indicatorCode: 'FAMILY_SAT', ministryTarget: 85, excellentThreshold: 85, goodThreshold: 75, acceptableThreshold: 65, unit: '%', category: 'رضا', isHigherBetter: true, currentValue: 78 },
  { indicatorName: 'التكلفة اليومية', indicatorCode: 'DAILY_COST', ministryTarget: 350, excellentThreshold: 350, goodThreshold: 400, acceptableThreshold: 450, unit: 'ريال', category: 'عمليات', isHigherBetter: false, currentValue: 380 },
  { indicatorName: 'تسليم المناوبة', indicatorCode: 'ON_TIME_HANDOVER', ministryTarget: 95, excellentThreshold: 95, goodThreshold: 85, acceptableThreshold: 75, unit: '%', category: 'عمليات', isHigherBetter: true, currentValue: 91 },
  { indicatorName: 'الصيانة الوقائية', indicatorCode: 'PREVENTIVE_MAINT', ministryTarget: 90, excellentThreshold: 90, goodThreshold: 80, acceptableThreshold: 70, unit: '%', category: 'عمليات', isHigherBetter: true, currentValue: 82 },
]

export const DEMO_HR_STATS: DepartmentHrStats[] = [
  { department: 'التمريض - ذكور', totalStaff: 18, present: 15, absent: 2, onLeave: 1, attendanceRate: 83, careCompletionRate: 78, impactScore: 75 },
  { department: 'التمريض - إناث', totalStaff: 22, present: 20, absent: 1, onLeave: 1, attendanceRate: 91, careCompletionRate: 89, impactScore: 45 },
  { department: 'الرعاية الاجتماعية', totalStaff: 8, present: 7, absent: 1, onLeave: 0, attendanceRate: 88, careCompletionRate: 85, impactScore: 55 },
  { department: 'العلاج الطبيعي', totalStaff: 6, present: 5, absent: 1, onLeave: 0, attendanceRate: 83, careCompletionRate: 80, impactScore: 65 },
  { department: 'الإشراف الليلي', totalStaff: 10, present: 8, absent: 2, onLeave: 0, attendanceRate: 80, careCompletionRate: 72, impactScore: 80 },
  { department: 'الخدمات المساندة', totalStaff: 12, present: 11, absent: 0, onLeave: 1, attendanceRate: 92, careCompletionRate: 90, impactScore: 30 },
]

export const DEMO_ALERTS: DiscrepancyAlert[] = [
  { id: 'DA-1', date: '2026-02-25', issue: 'تناقض حاد: خروج لحوم من المخزن لا يتطابق مع الوزن', severity: 'critical', details: 'المخزون يُظهر استهلاك 450 كجم شهرياً، بينما متوسط الوزن انخفض من 72 إلى 68.5 كجم', recommendation: 'تحقيق فوري + تنبيه النزاهة + فحص طبي عاجل' },
  { id: 'DA-2', date: '2026-02-20', issue: 'انخفاض الهيموجلوبين مع ثبات كمية الغذاء', severity: 'high', details: 'مستوى الهيموجلوبين لـ 12 مستفيد أقل من المعدل الطبيعي رغم ثبات الوجبات', recommendation: 'فحص نوعية الغذاء + تحليل القيمة الغذائية' },
  { id: 'DA-3', date: '2026-02-18', issue: 'فرق بين المشتريات والاستهلاك الفعلي', severity: 'medium', details: 'فجوة 15% بين كميات الشراء والاستهلاك المسجل في الأسبوع الأخير', recommendation: 'مراجعة إجراءات الاستلام والصرف' },
]
