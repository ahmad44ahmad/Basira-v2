import type { DailyMeal, InventoryItem, InventoryTransaction } from '../types'

const today = new Date().toISOString().slice(0, 10)
const beneficiaries = ['أحمد محمد السالم', 'فاطمة عبدالله الزهراني', 'خالد سعيد الغامدي', 'نورة حسن العتيبي', 'سلطان ماجد القحطاني', 'ريم عبدالرحمن الشهري']
const mealTypes: DailyMeal['mealType'][] = ['breakfast', 'lunch', 'dinner']

export const DEMO_MEALS: DailyMeal[] = beneficiaries.flatMap((name, bi) =>
  mealTypes.map((type, mi) => ({
    id: `meal-${bi}-${mi}`,
    beneficiaryName: name,
    mealType: type,
    status: (mi === 0 ? 'delivered' : mi === 1 ? 'delivered' : 'scheduled') as DailyMeal['status'],
    dietaryNotes: bi === 3 ? 'نظام غذائي لمرضى السكري' : '',
    deliveredAt: mi < 2 ? `${today}T${mi === 0 ? '07:30' : '12:30'}:00` : '',
    date: today,
  })),
)

export const DEMO_INVENTORY: InventoryItem[] = [
  { id: 'inv1', name: 'أرز بسمتي', category: 'حبوب', unit: 'كغ', currentStock: 45, minStock: 20, maxStock: 100, status: 'normal' },
  { id: 'inv2', name: 'دجاج طازج', category: 'لحوم', unit: 'كغ', currentStock: 8, minStock: 15, maxStock: 50, status: 'low' },
  { id: 'inv3', name: 'حليب طازج', category: 'ألبان', unit: 'لتر', currentStock: 25, minStock: 10, maxStock: 60, status: 'normal' },
  { id: 'inv4', name: 'طماطم', category: 'خضروات', unit: 'كغ', currentStock: 5, minStock: 10, maxStock: 30, status: 'low' },
  { id: 'inv5', name: 'زيت زيتون', category: 'زيوت', unit: 'لتر', currentStock: 18, minStock: 5, maxStock: 20, status: 'normal' },
  { id: 'inv6', name: 'خبز عربي', category: 'مخبوزات', unit: 'ربطة', currentStock: 30, minStock: 10, maxStock: 40, status: 'normal' },
  { id: 'inv7', name: 'تمر', category: 'فواكه مجففة', unit: 'كغ', currentStock: 12, minStock: 5, maxStock: 25, status: 'normal' },
]

export const DEMO_TRANSACTIONS: InventoryTransaction[] = [
  { id: 't1', itemName: 'أرز بسمتي', type: 'in', quantity: 50, date: '2026-02-27', notes: 'استلام من المورد', performedBy: 'أ. عبدالله' },
  { id: 't2', itemName: 'دجاج طازج', type: 'out', quantity: 12, date: '2026-02-27', notes: 'استخدام يومي', performedBy: 'الشيف محمد' },
  { id: 't3', itemName: 'حليب طازج', type: 'in', quantity: 20, date: '2026-02-26', notes: 'توريد أسبوعي', performedBy: 'أ. عبدالله' },
  { id: 't4', itemName: 'طماطم', type: 'out', quantity: 8, date: '2026-02-26', notes: 'استخدام يومي', performedBy: 'الشيف محمد' },
]
