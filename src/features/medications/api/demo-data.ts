import type { Medication } from '../types'

export const DEMO_MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'أنسولين', dosage: '10 وحدات', route: 'حقن تحت الجلد', frequency: 'قبل الوجبات', scheduledTime: '07:00', status: 'overdue', beneficiaryName: 'نورة حسن العتيبي', beneficiaryId: 'b004', room: 'غ-15', delayMinutes: 35, preRequirements: ['قياس السكر'], specialInstructions: 'حقن في البطن' },
  { id: 'm2', name: 'أملوديبين', dosage: '5 ملغ', route: 'فموي', frequency: 'مرة يومياً', scheduledTime: '08:00', status: 'pending', beneficiaryName: 'أحمد محمد السالم', beneficiaryId: 'b001', room: 'غ-12', preRequirements: ['قياس الضغط'] },
  { id: 'm3', name: 'كاربامازبين', dosage: '200 ملغ', route: 'فموي', frequency: 'مرتين يومياً', scheduledTime: '07:30', status: 'administered', beneficiaryName: 'ريم عبدالرحمن الشهري', beneficiaryId: 'b006', room: 'غ-10', allergies: ['البنسلين'] },
  { id: 'm4', name: 'باراسيتامول', dosage: '500 ملغ', route: 'فموي', frequency: 'عند الحاجة', scheduledTime: '09:00', status: 'pending', beneficiaryName: 'خالد سعيد الغامدي', beneficiaryId: 'b003', room: 'غ-3' },
  { id: 'm5', name: 'أوميبرازول', dosage: '20 ملغ', route: 'فموي', frequency: 'قبل الإفطار', scheduledTime: '06:30', status: 'administered', beneficiaryName: 'فاطمة عبدالله الزهراني', beneficiaryId: 'b002', room: 'غ-8' },
  { id: 'm6', name: 'ريسبيريدون', dosage: '1 ملغ', route: 'فموي', frequency: 'مساءً', scheduledTime: '20:00', status: 'pending', beneficiaryName: 'سلطان ماجد القحطاني', beneficiaryId: 'b005', room: 'غ-5', interactions: ['تجنب الكحول'] },
  { id: 'm7', name: 'نوسينيرسين', dosage: '12 ملغ', route: 'حقن قطني', frequency: 'كل 4 أشهر', scheduledTime: '09:00', status: 'pending', beneficiaryName: 'عمر يوسف المالكي', beneficiaryId: 'b009', room: 'غ-4', specialInstructions: 'يُعطى في المستشفى فقط — حقن في السائل الشوكي' },
  { id: 'm8', name: 'ليفيتيراسيتام', dosage: '500 ملغ', route: 'فموي', frequency: 'مرتين يومياً', scheduledTime: '08:00', status: 'administered', beneficiaryName: 'سارة خالد الحربي', beneficiaryId: 'b010', room: 'غ-11', allergies: ['الأسبرين'] },
  { id: 'm9', name: 'فالبروات الصوديوم', dosage: '500 ملغ', route: 'فموي', frequency: 'ثلاث مرات يومياً', scheduledTime: '07:00', status: 'overdue', beneficiaryName: 'يزيد عبدالله العسيري', beneficiaryId: 'b011', room: 'غ-14', delayMinutes: 45, preRequirements: ['قياس مستوى الدواء في الدم'] },
  { id: 'm10', name: 'باكلوفين', dosage: '5 ملغ', route: 'فموي', frequency: 'ثلاث مرات يومياً', scheduledTime: '08:00', status: 'pending', beneficiaryName: 'لمى محمد الشمري', beneficiaryId: 'b012', room: 'غ-6' },
]
