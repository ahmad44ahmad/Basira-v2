// ─── Meals (الوجبات) ────────────────────────────────────────────

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
export type MealStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'consumed' | 'refused'

export interface DailyMeal {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  dietaryPlan: string
  mealDate: string
  mealType: MealType
  status: MealStatus
  consumptionPercentage?: number
  deliveredBy?: string
  deliveredAt?: string
  notes?: string
}

export const MEAL_TYPE_CONFIG: Record<MealType, { label: string; emoji: string; price: number }> = {
  breakfast: { label: 'فطور', emoji: '🍳', price: 10 },
  lunch: { label: 'غداء', emoji: '🍲', price: 15 },
  dinner: { label: 'عشاء', emoji: '🥗', price: 12 },
  snack: { label: 'وجبة خفيفة', emoji: '🍎', price: 5 },
}

export const MEAL_STATUS_CONFIG: Record<MealStatus, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  preparing: { label: 'قيد التحضير', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  ready: { label: 'جاهز', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  delivered: { label: 'تم التسليم', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400' },
  consumed: { label: 'تم الاستهلاك', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  refused: { label: 'رفض', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

// ─── Quality Control (مراقبة الجودة) ────────────────────────────

export type ComplianceStatus = 'compliant' | 'non_compliant'
export type ViolationSeverity = 'low' | 'medium' | 'high' | 'critical'

export interface QualityCheckItem {
  id: string
  category: string
  question: string
  status: ComplianceStatus | null
  deductionAmount: number
  observation?: string
}

export interface QualityEvaluation {
  id: string
  supplierName: string
  evaluationDate: string
  totalScore: number
  totalPenalty: number
  compliantCount: number
  nonCompliantCount: number
  evaluatorName: string
  notes?: string
  items: QualityCheckItem[]
}

export const QUALITY_CATEGORIES = [
  { id: 'hygiene', label: 'النظافة', emoji: '🧹' },
  { id: 'food', label: 'الطعام', emoji: '🍽️' },
  { id: 'service', label: 'الخدمة', emoji: '👨‍🍳' },
  { id: 'safety', label: 'السلامة', emoji: '🛡️' },
] as const

export const DEFAULT_CHECKLIST: Omit<QualityCheckItem, 'status' | 'deductionAmount' | 'observation'>[] = [
  { id: 'q1', category: 'hygiene', question: 'زي العمال نظيف ومرتب' },
  { id: 'q2', category: 'hygiene', question: 'نظافة منطقة التحضير' },
  { id: 'q3', category: 'hygiene', question: 'ارتداء القفازات والكمامات' },
  { id: 'q4', category: 'hygiene', question: 'نظافة ثلاجات التخزين' },
  { id: 'q5', category: 'food', question: 'صلاحية المواد الغذائية' },
  { id: 'q6', category: 'food', question: 'درجة حرارة التقديم (ساخن > 65°C)' },
  { id: 'q7', category: 'food', question: 'جودة الطعم والرائحة' },
  { id: 'q8', category: 'food', question: 'كمية الوجبات كافية' },
  { id: 'q9', category: 'service', question: 'الالتزام بوقت التقديم' },
  { id: 'q10', category: 'service', question: 'سلوك العاملين مهني' },
  { id: 'q11', category: 'safety', question: 'نظافة الأواني والأدوات' },
  { id: 'q12', category: 'safety', question: 'فصل اللحوم عن الخضار' },
]

// ─── Inventory (المخزون) ────────────────────────────────────────

export type TransactionType = 'receipt' | 'consumption' | 'waste' | 'audit_adjustment'

export interface InventoryItem {
  id: string
  code: string
  nameAr: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  maxStock: number
  dailyQuota: number
  lastUpdated: string
}

export interface InventoryTransaction {
  id: string
  materialId: string
  materialName: string
  transactionDate: string
  transactionType: TransactionType
  quantity: number
  supplierName?: string
  invoiceNumber?: string
  reason?: string
  createdBy: string
}

export const TRANSACTION_TYPE_CONFIG: Record<TransactionType, { label: string; emoji: string; color: string }> = {
  receipt: { label: 'استلام', emoji: '📥', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  consumption: { label: 'استهلاك', emoji: '📤', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  waste: { label: 'هدر', emoji: '🗑️', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  audit_adjustment: { label: 'تعديل جرد', emoji: '📋', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
}

export const SEVERITY_CONFIG: Record<ViolationSeverity, { label: string; color: string }> = {
  low: { label: 'منخفضة', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  medium: { label: 'متوسطة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  high: { label: 'عالية', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  critical: { label: 'حرجة', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}
