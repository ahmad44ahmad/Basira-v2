import type { Asset, MaintenanceRequest, WasteRecord } from '../types'

export const DEMO_ASSETS: Asset[] = [
  { id: 'a1', assetCode: 'AST-001', nameAr: 'سرير كهربائي', category: 'medical_equipment', assetType: 'fixed', building: 'جناح ذكور A', status: 'active', condition: 'good', acquisitionDate: '2024-01-15', acquisitionCost: 25000, currentBookValue: 20000, depreciationRate: 10, warrantyEnd: '2027-01-15', lastInspectionDate: '2026-02-01' },
  { id: 'a2', assetCode: 'AST-002', nameAr: 'كرسي متحرك', category: 'mobility', assetType: 'movable', building: 'المخزن', status: 'active', condition: 'fair', acquisitionDate: '2023-06-10', acquisitionCost: 3500, currentBookValue: 2400, depreciationRate: 15, warrantyEnd: '2025-06-10', lastInspectionDate: '2026-01-20' },
  { id: 'a3', assetCode: 'AST-003', nameAr: 'مكيف مركزي', category: 'hvac', assetType: 'fixed', building: 'المبنى الرئيسي', status: 'under_maintenance', condition: 'poor', acquisitionDate: '2022-03-01', acquisitionCost: 45000, currentBookValue: 27000, depreciationRate: 10, warrantyEnd: '2025-03-01', lastInspectionDate: '2026-02-15' },
  { id: 'a4', assetCode: 'AST-004', nameAr: 'جهاز قياس ضغط', category: 'medical_equipment', assetType: 'movable', building: 'غرفة التمريض', status: 'active', condition: 'good', acquisitionDate: '2025-01-10', acquisitionCost: 1200, currentBookValue: 1080, depreciationRate: 10, warrantyEnd: '2028-01-10' },
  { id: 'a5', assetCode: 'AST-005', nameAr: 'غسالة صناعية', category: 'laundry', assetType: 'fixed', building: 'المغسلة', status: 'active', condition: 'good', acquisitionDate: '2024-08-20', acquisitionCost: 18000, currentBookValue: 15300, depreciationRate: 15, warrantyEnd: '2026-08-20', lastInspectionDate: '2026-02-10' },
  { id: 'a6', assetCode: 'AST-006', nameAr: 'مولد كهربائي', category: 'power', assetType: 'fixed', building: 'غرفة الكهرباء', status: 'disposed', condition: 'poor', acquisitionDate: '2018-05-01', acquisitionCost: 60000, currentBookValue: 0, depreciationRate: 10, warrantyEnd: '2021-05-01', lastInspectionDate: '2025-11-01' },
]

export const DEMO_MAINTENANCE: MaintenanceRequest[] = [
  { id: 'm1', requestNumber: 'MR-001', title: 'إصلاح تكييف المبنى الرئيسي', description: 'تعطل وحدة التبريد المركزية — المبنى الرئيسي', requestType: 'corrective', priority: 'high', status: 'in_progress', reportedBy: 'أ. عبدالله', assignedTo: 'شركة التكييف', reportedDate: '2026-02-20', estimatedCost: 15000 },
  { id: 'm2', requestNumber: 'MR-002', title: 'صيانة دورية مصاعد', description: 'صيانة ربع سنوية للمصاعد — جميع المباني', requestType: 'preventive', priority: 'medium', status: 'pending', reportedBy: 'إدارة التشغيل', reportedDate: '2026-02-25' },
  { id: 'm3', requestNumber: 'MR-003', title: 'تسريب مياه حمام جناح ذكور', description: 'تسريب من الصنبور الرئيسي — جناح ذكور A حمام 3', requestType: 'corrective', priority: 'high', status: 'completed', reportedBy: 'ممرض: سعيد', assignedTo: 'فني السباكة', reportedDate: '2026-02-18', actualCompletion: '2026-02-19', estimatedCost: 500 },
  { id: 'm4', requestNumber: 'MR-004', title: 'استبدال إضاءة الممر', description: 'إضاءة ضعيفة في ممر الطابق الثاني — المبنى الرئيسي', requestType: 'corrective', priority: 'low', status: 'pending', reportedBy: 'مشرف: خالد', reportedDate: '2026-02-26' },
  { id: 'm5', requestNumber: 'MR-005', title: 'صيانة كراسي متحركة', description: 'فحص وصيانة 10 كراسي متحركة — المخزن', requestType: 'preventive', priority: 'medium', status: 'pending', reportedBy: 'إدارة التشغيل', assignedTo: 'الفني المناوب', reportedDate: '2026-02-27' },
]

export const DEMO_WASTE: WasteRecord[] = [
  { id: 'w1', recordDate: '2026-02-28', wasteType: 'medical', sourceLocation: 'العيادة الرئيسية', quantity: 2.5, unit: 'kg', disposalMethod: 'incineration', contractorName: 'شركة النفايات الطبية' },
  { id: 'w2', recordDate: '2026-02-28', wasteType: 'hazardous', sourceLocation: 'المختبر', quantity: 5.0, unit: 'kg', disposalMethod: 'incineration', contractorName: 'شركة النفايات الطبية' },
  { id: 'w3', recordDate: '2026-02-28', wasteType: 'general', sourceLocation: 'المطبخ المركزي', quantity: 25.0, unit: 'kg', disposalMethod: 'landfill', contractorName: 'أمانة المنطقة' },
  { id: 'w4', recordDate: '2026-02-28', wasteType: 'recyclable', sourceLocation: 'الإدارة', quantity: 8.0, unit: 'kg', disposalMethod: 'recycling', contractorName: 'شركة التدوير' },
  { id: 'w5', recordDate: '2026-02-27', wasteType: 'medical', sourceLocation: 'غرفة التمريض', quantity: 1.0, unit: 'kg', disposalMethod: 'incineration', contractorName: 'شركة النفايات الطبية' },
  { id: 'w6', recordDate: '2026-02-27', wasteType: 'general', sourceLocation: 'المطبخ المركزي', quantity: 22.0, unit: 'kg', disposalMethod: 'landfill', contractorName: 'أمانة المنطقة' },
]
