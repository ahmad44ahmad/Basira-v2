import { z } from 'zod'

/** Saudi National ID: starts with 1 or 2, exactly 10 digits */
export const saudiIdSchema = z
  .string()
  .regex(/^[12]\d{9}$/, 'رقم الهوية يجب أن يبدأ بـ 1 أو 2 ويتكون من 10 أرقام')

/** Saudi phone: starts with 05, exactly 10 digits */
export const saudiPhoneSchema = z
  .string()
  .regex(/^05\d{8}$/, 'رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام')

/** Arabic name: 5-100 chars */
export const arabicNameSchema = z
  .string()
  .min(5, 'الاسم يجب أن يكون 5 أحرف على الأقل')
  .max(100, 'الاسم يجب ألا يتجاوز 100 حرف')

/** Vital Signs Schema */
export const vitalSignsSchema = z.object({
  temperature: z.number().min(35, 'الحرارة منخفضة جداً').max(42, 'الحرارة مرتفعة جداً').optional(),
  pulse: z.number().min(40, 'النبض منخفض جداً').max(180, 'النبض مرتفع جداً').optional(),
  bloodPressureSystolic: z.number().min(70).max(200).optional(),
  bloodPressureDiastolic: z.number().min(40).max(130).optional(),
  oxygenSaturation: z.number().min(70, 'تشبع الأكسجين منخفض جداً').max(100).optional(),
  bloodSugar: z.number().min(20).max(600).optional(),
  weight: z.number().min(10).max(300).optional(),
})

/** Beneficiary Form Schema */
export const beneficiarySchema = z.object({
  fullName: arabicNameSchema,
  nationalId: saudiIdSchema,
  gender: z.enum(['ذكر', 'أنثى']),
  dateOfBirth: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  nationality: z.string().min(1, 'الجنسية مطلوبة'),
  section: z.enum(['ذكور', 'إناث', 'أطفال']),
  roomNumber: z.string().optional(),
  bedNumber: z.string().optional(),
  guardianName: arabicNameSchema.optional(),
  guardianPhone: saudiPhoneSchema.optional(),
  guardianRelation: z.string().optional(),
  medicalDiagnosis: z.string().optional(),
})

/** Incident Report Schema */
export const incidentReportSchema = z.object({
  beneficiaryId: z.string().min(1, 'يجب تحديد المستفيد'),
  incidentDate: z.string().min(1, 'التاريخ مطلوب'),
  incidentTime: z.string().min(1, 'الوقت مطلوب'),
  location: z.string().min(1, 'الموقع مطلوب'),
  incidentType: z.enum(['fall', 'injury', 'medical_emergency', 'behavioral', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  description: z.string().min(20, 'الوصف يجب أن يكون 20 حرفاً على الأقل'),
  actionTaken: z.string().min(10, 'الإجراء المتخذ يجب أن يكون 10 أحرف على الأقل'),
  reportedBy: z.string().min(1, 'اسم المبلغ مطلوب'),
  witnesses: z.string().optional(),
  followUpRequired: z.boolean().default(false),
})

/** Leave Request Schema */
export const leaveRequestSchema = z.object({
  beneficiaryId: z.string().min(1, 'يجب تحديد المستفيد'),
  leaveType: z.enum(['day', 'weekend', 'vacation', 'medical', 'emergency']),
  startDate: z.string().min(1, 'تاريخ البداية مطلوب'),
  endDate: z.string().min(1, 'تاريخ النهاية مطلوب'),
  guardianName: arabicNameSchema,
  guardianPhone: saudiPhoneSchema,
  guardianId: saudiIdSchema,
  destination: z.string().min(1, 'الوجهة مطلوبة'),
  reason: z.string().min(10, 'السبب يجب أن يكون 10 أحرف على الأقل'),
})

/** Maintenance Request Schema */
export const maintenanceRequestSchema = z.object({
  assetId: z.string().optional(),
  location: z.string().min(1, 'الموقع مطلوب'),
  issueType: z.enum(['electrical', 'plumbing', 'hvac', 'structural', 'equipment', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل'),
  requestedBy: z.string().min(1, 'اسم مقدم الطلب مطلوب'),
})

/** Generic validation helper */
export function validateForm<T>(
  schema: z.ZodType<T>,
  data: unknown,
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = issue.path.join('.')
    if (!errors[key]) errors[key] = issue.message
  }
  return { success: false, errors }
}
