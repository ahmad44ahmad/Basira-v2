import type { DailyMeal, InventoryItem, InventoryTransaction } from '../types'

const today = new Date().toISOString().slice(0, 10)
const beneficiaries = [
  { id: 'b001', name: 'أحمد محمد السالم' },
  { id: 'b002', name: 'فاطمة عبدالله الزهراني' },
  { id: 'b003', name: 'خالد سعيد الغامدي' },
  { id: 'b004', name: 'نورة حسن العتيبي' },
  { id: 'b005', name: 'سلطان ماجد القحطاني' },
  { id: 'b006', name: 'ريم عبدالرحمن الشهري' },
]
const mealTypes: DailyMeal['mealType'][] = ['breakfast', 'lunch', 'dinner']

export const DEMO_MEALS: DailyMeal[] = beneficiaries.flatMap((b, bi) =>
  mealTypes.map((type, mi) => ({
    id: `meal-${bi}-${mi}`,
    beneficiaryId: b.id,
    beneficiaryName: b.name,
    mealType: type,
    status: (mi < 2 ? 'delivered' : 'pending') as DailyMeal['status'],
    dietaryPlan: bi === 3 ? 'نظام غذائي لمرضى السكري' : 'عادي',
    mealDate: today,
    deliveredAt: mi < 2 ? `${today}T${mi === 0 ? '07:30' : '12:30'}:00` : undefined,
  })),
)

export const DEMO_INVENTORY: InventoryItem[] = [
  { id: 'inv1', code: 'RM-001', nameAr: 'أرز بسمتي', category: 'حبوب', unit: 'كغ', currentStock: 45, minStock: 20, maxStock: 100, dailyQuota: 5, lastUpdated: today },
  { id: 'inv2', code: 'RM-002', nameAr: 'دجاج طازج', category: 'لحوم', unit: 'كغ', currentStock: 8, minStock: 15, maxStock: 50, dailyQuota: 10, lastUpdated: today },
  { id: 'inv3', code: 'RM-003', nameAr: 'حليب طازج', category: 'ألبان', unit: 'لتر', currentStock: 25, minStock: 10, maxStock: 60, dailyQuota: 8, lastUpdated: today },
  { id: 'inv4', code: 'RM-004', nameAr: 'طماطم', category: 'خضروات', unit: 'كغ', currentStock: 5, minStock: 10, maxStock: 30, dailyQuota: 4, lastUpdated: today },
  { id: 'inv5', code: 'RM-005', nameAr: 'زيت زيتون', category: 'زيوت', unit: 'لتر', currentStock: 18, minStock: 5, maxStock: 20, dailyQuota: 2, lastUpdated: today },
  { id: 'inv6', code: 'RM-006', nameAr: 'خبز عربي', category: 'مخبوزات', unit: 'ربطة', currentStock: 30, minStock: 10, maxStock: 40, dailyQuota: 15, lastUpdated: today },
  { id: 'inv7', code: 'RM-007', nameAr: 'تمر', category: 'فواكه مجففة', unit: 'كغ', currentStock: 12, minStock: 5, maxStock: 25, dailyQuota: 2, lastUpdated: today },
]

export const DEMO_TRANSACTIONS: InventoryTransaction[] = [
  { id: 't1', materialId: 'inv1', materialName: 'أرز بسمتي', transactionType: 'receipt', quantity: 50, transactionDate: '2026-02-27', reason: 'استلام من المورد', createdBy: 'أ. عبدالله' },
  { id: 't2', materialId: 'inv2', materialName: 'دجاج طازج', transactionType: 'consumption', quantity: 12, transactionDate: '2026-02-27', reason: 'استخدام يومي', createdBy: 'الشيف محمد' },
  { id: 't3', materialId: 'inv3', materialName: 'حليب طازج', transactionType: 'receipt', quantity: 20, transactionDate: '2026-02-26', reason: 'توريد أسبوعي', createdBy: 'أ. عبدالله' },
  { id: 't4', materialId: 'inv4', materialName: 'طماطم', transactionType: 'consumption', quantity: 8, transactionDate: '2026-02-26', reason: 'استخدام يومي', createdBy: 'الشيف محمد' },
]
