import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { MaintenanceChecklist, MaintenanceChecklistInsert } from '@/types/database'
import type { ChecklistCategory } from '../types'

// ─── Demo Data ──────────────────────────────────────────────────

const DEMO_CHECKLISTS: MaintenanceChecklist[] = [
  {
    id: 'mc001',
    checklist_code: 'GFM-ZM-01',
    category: 'hvac',
    facility_type: 'healthcare',
    title_ar: 'فحص وحدات التكييف المركزي',
    checklist_items: [
      { description: 'فحص الفلاتر وتنظيفها', frequency: 'شهري', status: 'pass', notes: '', inspector: 'فني التكييف' },
      { description: 'فحص مستوى الفريون', frequency: 'ربع سنوي', status: 'pass', notes: '', inspector: 'فني التكييف' },
      { description: 'فحص المراوح والمحركات', frequency: 'شهري', status: 'fail', notes: 'يحتاج تشحيم', inspector: 'فني التكييف' },
      { description: 'فحص الأنابيب والوصلات', frequency: 'ربع سنوي', status: 'pass', notes: '', inspector: 'فني التكييف' },
    ],
    inspection_date: '2026-02-28',
    inspector_name: 'م. أحمد الشهري',
    compliance_percentage: 75,
    status: 'completed',
    notes: 'بند واحد يحتاج متابعة',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mc002',
    checklist_code: 'GFM-ZM-05',
    category: 'electrical',
    facility_type: 'healthcare',
    title_ar: 'فحص اللوحات الكهربائية',
    checklist_items: [
      { description: 'فحص القواطع الكهربائية', frequency: 'شهري', status: 'pass', notes: '', inspector: 'فني كهرباء' },
      { description: 'فحص التأريض', frequency: 'ربع سنوي', status: 'pass', notes: '', inspector: 'فني كهرباء' },
      { description: 'فحص أسلاك التوصيل', frequency: 'نصف سنوي', status: 'pass', notes: '', inspector: 'فني كهرباء' },
    ],
    inspection_date: '2026-02-25',
    inspector_name: 'م. سالم الحربي',
    compliance_percentage: 100,
    status: 'completed',
    notes: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mc003',
    checklist_code: 'GFM-ZM-12',
    category: 'fire_safety',
    facility_type: 'healthcare',
    title_ar: 'فحص أنظمة الإنذار والإطفاء',
    checklist_items: [
      { description: 'فحص طفايات الحريق', frequency: 'شهري', status: 'pass', notes: '', inspector: 'مسؤول السلامة' },
      { description: 'اختبار أجهزة الإنذار', frequency: 'شهري', status: 'pass', notes: '', inspector: 'مسؤول السلامة' },
      { description: 'فحص مخارج الطوارئ', frequency: 'أسبوعي', status: 'fail', notes: 'باب مخرج طوارئ مسدود', inspector: 'مسؤول السلامة' },
      { description: 'فحص مضخات الحريق', frequency: 'ربع سنوي', status: 'pass', notes: '', inspector: 'مسؤول السلامة' },
      { description: 'فحص شبكة الرشاشات', frequency: 'نصف سنوي', status: 'na', notes: 'غير متوفرة في هذا المبنى', inspector: 'مسؤول السلامة' },
    ],
    inspection_date: '2026-02-20',
    inspector_name: 'أ. فهد العنزي',
    compliance_percentage: 60,
    status: 'in_progress',
    notes: 'يحتاج متابعة عاجلة لمخرج الطوارئ',
    created_at: new Date().toISOString(),
  },
  {
    id: 'mc004',
    checklist_code: 'GFM-ZM-20',
    category: 'elevators',
    facility_type: 'healthcare',
    title_ar: 'فحص المصاعد',
    checklist_items: [
      { description: 'فحص أبواب المصعد', frequency: 'شهري', status: 'pass', notes: '', inspector: 'فني مصاعد' },
      { description: 'فحص نظام الفرامل', frequency: 'ربع سنوي', status: 'pass', notes: '', inspector: 'فني مصاعد' },
      { description: 'فحص زر الطوارئ', frequency: 'شهري', status: 'pass', notes: '', inspector: 'فني مصاعد' },
    ],
    inspection_date: '2026-02-15',
    inspector_name: 'م. عبدالله القرني',
    compliance_percentage: 100,
    status: 'completed',
    notes: null,
    created_at: new Date().toISOString(),
  },
]

// ─── Fetch ──────────────────────────────────────────────────────

async function fetchMaintenanceChecklists(): Promise<MaintenanceChecklist[]> {
  if (isDemoMode || !supabase) return DEMO_CHECKLISTS

  const { data, error } = await supabase
    .from('maintenance_checklists')
    .select('*')
    .order('inspection_date', { ascending: false })

  if (error) throw error
  return data ?? []
}

// ─── Query Hooks ────────────────────────────────────────────────

export function useMaintenanceChecklists() {
  return useQuery({
    queryKey: queryKeys.operations.checklists(),
    queryFn: fetchMaintenanceChecklists,
  })
}

export function useCreateMaintenanceChecklist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: MaintenanceChecklistInsert) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { data: row, error } = await supabase
        .from('maintenance_checklists')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return row
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.operations.checklists() })
    },
  })
}

// ─── Stats Hook ─────────────────────────────────────────────────

interface ChecklistStats {
  total: number
  completed: number
  inProgress: number
  pending: number
  avgCompliance: number
  byCategory: Record<string, number>
}

export function useChecklistStats(): ChecklistStats {
  const { data: checklists = [] } = useMaintenanceChecklists()

  const total = checklists.length
  const completed = checklists.filter((c) => c.status === 'completed').length
  const inProgress = checklists.filter((c) => c.status === 'in_progress').length
  const pending = checklists.filter((c) => c.status === 'pending').length

  const avgCompliance = total > 0
    ? Math.round(checklists.reduce((sum, c) => sum + (c.compliance_percentage ?? 0), 0) / total)
    : 0

  const byCategory = checklists.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1
    return acc
  }, {})

  return { total, completed, inProgress, pending, avgCompliance, byCategory }
}
