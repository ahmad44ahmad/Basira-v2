// ─── Assets (إدارة الأصول) ───────────────────────────────────────

export type AssetStatus = 'active' | 'under_maintenance' | 'out_of_service' | 'disposed' | 'transferred'
export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor' | 'unusable'
export type AssetType = 'fixed' | 'movable' | 'consumable'

export interface Asset {
  id: string
  assetCode: string
  nameAr: string
  category: string
  assetType: AssetType
  building: string
  floor?: string
  room?: string
  status: AssetStatus
  condition: AssetCondition
  acquisitionDate: string
  acquisitionCost: number
  currentBookValue: number
  depreciationRate: number
  supplierName?: string
  warrantyEnd?: string
  lastInspectionDate?: string
  nextInspectionDate?: string
  photoUrl?: string
  notes?: string
}

export const ASSET_STATUS_CONFIG: Record<AssetStatus, { label: string; color: string }> = {
  active: { label: 'نشط', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  under_maintenance: { label: 'تحت الصيانة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  out_of_service: { label: 'خارج الخدمة', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  disposed: { label: 'تم التخلص', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  transferred: { label: 'تم نقله', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
}

export const ASSET_CONDITION_CONFIG: Record<AssetCondition, { label: string; color: string }> = {
  excellent: { label: 'ممتاز', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  good: { label: 'جيد', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  fair: { label: 'متوسط', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  poor: { label: 'ضعيف', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  unusable: { label: 'غير صالح', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

// ─── Maintenance (الصيانة) ──────────────────────────────────────

export type MaintenanceType = 'corrective' | 'preventive' | 'emergency' | 'improvement'
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical'
export type MaintenanceStatus = 'pending' | 'approved' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled' | 'rejected'

export interface MaintenanceRequest {
  id: string
  requestNumber: string
  assetId?: string
  assetName?: string
  title: string
  description?: string
  requestType: MaintenanceType
  priority: MaintenancePriority
  status: MaintenanceStatus
  reportedBy: string
  assignedTo?: string
  reportedDate: string
  targetCompletion?: string
  actualCompletion?: string
  estimatedCost?: number
  actualCost?: number
  qualityRating?: number
  completionNotes?: string
}

export const MAINTENANCE_TYPE_CONFIG: Record<MaintenanceType, { label: string; emoji: string }> = {
  corrective: { label: 'تصحيحية', emoji: '🔧' },
  preventive: { label: 'وقائية', emoji: '🛡️' },
  emergency: { label: 'طارئة', emoji: '🚨' },
  improvement: { label: 'تحسينية', emoji: '✨' },
}

export const MAINTENANCE_PRIORITY_CONFIG: Record<MaintenancePriority, { label: string; color: string }> = {
  low: { label: 'منخفضة', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  medium: { label: 'متوسطة', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  high: { label: 'عالية', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  critical: { label: 'حرجة', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

export const MAINTENANCE_STATUS_CONFIG: Record<MaintenanceStatus, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  approved: { label: 'معتمد', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress: { label: 'قيد التنفيذ', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  on_hold: { label: 'معلق', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  completed: { label: 'مكتمل', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  cancelled: { label: 'ملغي', color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500' },
  rejected: { label: 'مرفوض', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

// ─── Waste Management (إدارة النفايات) ──────────────────────────

export type WasteType = 'general' | 'recyclable' | 'hazardous' | 'medical' | 'electronic' | 'confidential'
export type DisposalMethod = 'landfill' | 'recycling' | 'incineration' | 'special_treatment' | 'reuse'

export interface WasteRecord {
  id: string
  recordDate: string
  wasteType: WasteType
  sourceLocation: string
  quantity: number
  unit: 'kg' | 'ton' | 'liter' | 'unit'
  disposalMethod: DisposalMethod
  contractorName?: string
  notes?: string
}

export const WASTE_TYPE_CONFIG: Record<WasteType, { label: string; emoji: string; color: string }> = {
  general: { label: 'عامة', emoji: '🗑️', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  recyclable: { label: 'قابلة للتدوير', emoji: '♻️', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  hazardous: { label: 'خطرة', emoji: '⚠️', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  medical: { label: 'طبية', emoji: '🏥', color: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400' },
  electronic: { label: 'إلكترونية', emoji: '💻', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  confidential: { label: 'سرية', emoji: '🔒', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
}

export const DISPOSAL_METHODS: { value: DisposalMethod; label: string }[] = [
  { value: 'landfill', label: 'ردم' },
  { value: 'recycling', label: 'إعادة تدوير' },
  { value: 'incineration', label: 'حرق' },
  { value: 'special_treatment', label: 'معالجة خاصة' },
  { value: 'reuse', label: 'إعادة استخدام' },
]
