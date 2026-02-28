import type { Asset, MaintenanceRequest, WasteRecord } from '../types'

const now = new Date().toISOString()

export const DEMO_ASSETS: Asset[] = [
  { id: 'a1', code: 'AST-001', name: 'سرير كهربائي', category: 'medical_equipment', location: 'جناح ذكور A', status: 'operational', condition: 'good', purchaseDate: '2024-01-15', warrantyExpiry: '2027-01-15', lastMaintenance: '2026-02-01' },
  { id: 'a2', code: 'AST-002', name: 'كرسي متحرك', category: 'mobility', location: 'المخزن', status: 'operational', condition: 'fair', purchaseDate: '2023-06-10', warrantyExpiry: '2025-06-10', lastMaintenance: '2026-01-20' },
  { id: 'a3', code: 'AST-003', name: 'مكيف مركزي', category: 'hvac', location: 'المبنى الرئيسي', status: 'maintenance', condition: 'poor', purchaseDate: '2022-03-01', warrantyExpiry: '2025-03-01', lastMaintenance: '2026-02-15' },
  { id: 'a4', code: 'AST-004', name: 'جهاز قياس ضغط', category: 'medical_equipment', location: 'غرفة التمريض', status: 'operational', condition: 'good', purchaseDate: '2025-01-10', warrantyExpiry: '2028-01-10', lastMaintenance: '' },
  { id: 'a5', code: 'AST-005', name: 'غسالة صناعية', category: 'laundry', location: 'المغسلة', status: 'operational', condition: 'good', purchaseDate: '2024-08-20', warrantyExpiry: '2026-08-20', lastMaintenance: '2026-02-10' },
  { id: 'a6', code: 'AST-006', name: 'مولد كهربائي', category: 'power', location: 'غرفة الكهرباء', status: 'retired', condition: 'poor', purchaseDate: '2018-05-01', warrantyExpiry: '2021-05-01', lastMaintenance: '2025-11-01' },
]

export const DEMO_MAINTENANCE: MaintenanceRequest[] = [
  { id: 'm1', requestNumber: 'MR-001', title: 'إصلاح تكييف المبنى الرئيسي', description: 'تعطل وحدة التبريد المركزية', location: 'المبنى الرئيسي', type: 'corrective', priority: 'high', status: 'in_progress', requestedBy: 'أ. عبدالله', assignedTo: 'شركة التكييف', createdAt: '2026-02-20', completedAt: '', cost: 15000 },
  { id: 'm2', requestNumber: 'MR-002', title: 'صيانة دورية مصاعد', description: 'صيانة ربع سنوية للمصاعد', location: 'جميع المباني', type: 'preventive', priority: 'medium', status: 'open', requestedBy: 'إدارة التشغيل', assignedTo: '', createdAt: '2026-02-25', completedAt: '', cost: 0 },
  { id: 'm3', requestNumber: 'MR-003', title: 'تسريب مياه حمام جناح ذكور', description: 'تسريب من الصنبور الرئيسي', location: 'جناح ذكور A - حمام 3', type: 'corrective', priority: 'high', status: 'completed', requestedBy: 'ممرض: سعيد', assignedTo: 'فني السباكة', createdAt: '2026-02-18', completedAt: '2026-02-19', cost: 500 },
  { id: 'm4', requestNumber: 'MR-004', title: 'استبدال إضاءة الممر', description: 'إضاءة ضعيفة في ممر الطابق الثاني', location: 'المبنى الرئيسي - ط2', type: 'corrective', priority: 'low', status: 'open', requestedBy: 'مشرف: خالد', assignedTo: '', createdAt: '2026-02-26', completedAt: '', cost: 0 },
  { id: 'm5', requestNumber: 'MR-005', title: 'صيانة كراسي متحركة', description: 'فحص وصيانة 10 كراسي متحركة', location: 'المخزن', type: 'preventive', priority: 'medium', status: 'open', requestedBy: 'إدارة التشغيل', assignedTo: 'الفني المناوب', createdAt: '2026-02-27', completedAt: '', cost: 0 },
]

export const DEMO_WASTE: WasteRecord[] = [
  { id: 'w1', date: '2026-02-28', category: 'medical', type: 'sharps', weight: 2.5, disposalMethod: 'incineration', disposedBy: 'شركة النفايات الطبية', cost: 150 },
  { id: 'w2', date: '2026-02-28', category: 'medical', type: 'infectious', weight: 5.0, disposalMethod: 'incineration', disposedBy: 'شركة النفايات الطبية', cost: 300 },
  { id: 'w3', date: '2026-02-28', category: 'general', type: 'organic', weight: 25.0, disposalMethod: 'municipal', disposedBy: 'أمانة المنطقة', cost: 0 },
  { id: 'w4', date: '2026-02-28', category: 'general', type: 'recyclable', weight: 8.0, disposalMethod: 'recycling', disposedBy: 'شركة التدوير', cost: 0 },
  { id: 'w5', date: '2026-02-27', category: 'medical', type: 'pharmaceutical', weight: 1.0, disposalMethod: 'incineration', disposedBy: 'شركة النفايات الطبية', cost: 100 },
  { id: 'w6', date: '2026-02-27', category: 'general', type: 'organic', weight: 22.0, disposalMethod: 'municipal', disposedBy: 'أمانة المنطقة', cost: 0 },
]
