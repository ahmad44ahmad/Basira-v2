import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { CateringSupplier, CateringSupplierInsert } from '@/types/database'

// ===== Demo Data =====

const DEMO_SUPPLIERS: CateringSupplier[] = [
  {
    id: 'sup1', supplier_name: 'شركة الغذاء المتكامل', contract_number: 'CAT-2026-001',
    service_type: 'وجبات رئيسية', contract_start: '2026-01-01', contract_end: '2026-12-31',
    is_emergency_backup: false, mobilization_time_hours: null, capacity_limit: 500,
    status: 'active', contact_name: 'أ. عبدالرحمن السالم', contact_phone: '0551234567',
    notes: 'المورد الرئيسي للوجبات اليومية', created_at: new Date().toISOString(),
  },
  {
    id: 'sup2', supplier_name: 'مؤسسة الصحة الغذائية', contract_number: 'CAT-2026-002',
    service_type: 'حميات خاصة', contract_start: '2026-01-01', contract_end: '2026-06-30',
    is_emergency_backup: false, mobilization_time_hours: null, capacity_limit: 100,
    status: 'active', contact_name: 'د. نورة المالكي', contact_phone: '0559876543',
    notes: 'متخصص في الحميات الطبية والغذائية', created_at: new Date().toISOString(),
  },
  {
    id: 'sup3', supplier_name: 'شركة الإمداد السريع', contract_number: 'CAT-2026-EMR',
    service_type: 'طوارئ تغذية', contract_start: '2026-01-01', contract_end: '2026-12-31',
    is_emergency_backup: true, mobilization_time_hours: 4, capacity_limit: 300,
    status: 'active', contact_name: 'أ. فهد الدوسري', contact_phone: '0501112233',
    notes: 'مورد احتياطي — جاهزية خلال 4 ساعات', created_at: new Date().toISOString(),
  },
  {
    id: 'sup4', supplier_name: 'مطابخ البركة', contract_number: 'CAT-2025-003',
    service_type: 'مناسبات وفعاليات', contract_start: '2025-01-01', contract_end: '2025-12-31',
    is_emergency_backup: false, mobilization_time_hours: null, capacity_limit: 200,
    status: 'terminated', contact_name: 'أ. سعد العتيبي', contact_phone: '0504455667',
    notes: 'انتهى العقد ولم يجدد', created_at: new Date().toISOString(),
  },
]

// ===== Fetch =====

async function fetchCateringSuppliers(): Promise<CateringSupplier[]> {
  if (isDemoMode || !supabase) return DEMO_SUPPLIERS

  const { data, error } = await supabase
    .from('catering_suppliers')
    .select('*')
    .order('status')
    .order('supplier_name')

  if (error) throw error
  return data ?? []
}

// ===== Hooks =====

export function useCateringSuppliers() {
  return useQuery({
    queryKey: queryKeys.catering.suppliers(),
    queryFn: fetchCateringSuppliers,
  })
}

export function useCreateCateringSupplier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (supplier: CateringSupplierInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return
      }
      const { error } = await supabase
        .from('catering_suppliers')
        .insert(supplier)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.catering.suppliers() })
    },
  })
}
