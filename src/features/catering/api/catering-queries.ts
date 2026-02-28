import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type { CateringRawMaterial } from '@/types/database'
import type { DailyMeal, InventoryItem, InventoryTransaction } from '../types'
import { DEMO_MEALS, DEMO_INVENTORY, DEMO_TRANSACTIONS } from './demo-data'

// ===== Daily Meals =====

async function fetchDailyMeals(): Promise<DailyMeal[]> {
  if (isDemoMode || !supabase) return DEMO_MEALS

  const { data, error } = await supabase
    .from('daily_meals')
    .select('*')
    .order('meal_date', { ascending: false })
    .limit(50)

  if (error) throw error
  return (data ?? []).map((m) => ({
    id: m.id,
    beneficiaryName: m.beneficiary_id,
    mealType: m.meal_type as DailyMeal['mealType'],
    status: m.status as DailyMeal['status'],
    dietaryNotes: m.notes ?? '',
    deliveredAt: m.delivered_at ?? '',
    date: m.meal_date,
  }))
}

export function useDailyMeals() {
  return useQuery({
    queryKey: queryKeys.catering.meals(),
    queryFn: fetchDailyMeals,
  })
}

export function useUpdateMealStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      if (!supabase) throw new Error('Supabase not configured')
      const { error } = await supabase
        .from('daily_meals')
        .update({ status, delivered_at: status === 'delivered' ? new Date().toISOString() : null })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.catering.meals() })
    },
  })
}

// ===== Inventory =====

async function fetchInventory(): Promise<InventoryItem[]> {
  if (isDemoMode || !supabase) return DEMO_INVENTORY

  const { data, error } = await supabase
    .from('catering_raw_materials')
    .select('*')
    .order('name')

  if (error) throw error
  return (data ?? []).map((m: CateringRawMaterial) => ({
    id: m.id,
    name: m.name,
    category: m.category,
    unit: m.unit,
    currentStock: m.current_stock,
    minStock: m.min_stock,
    maxStock: m.max_stock,
    status: m.current_stock <= m.min_stock ? 'low' : m.current_stock >= m.max_stock ? 'overstock' : 'normal',
  }))
}

export function useInventory() {
  return useQuery({
    queryKey: queryKeys.catering.inventory(),
    queryFn: fetchInventory,
  })
}

// ===== Transactions (demo-only for now) =====

export function useInventoryTransactions() {
  return useQuery({
    queryKey: [...queryKeys.catering.all, 'transactions'] as const,
    queryFn: async (): Promise<InventoryTransaction[]> => DEMO_TRANSACTIONS,
  })
}

// ===== Stats =====

export function useCateringStats() {
  const { data: meals } = useDailyMeals()
  const { data: inventory } = useInventory()

  return {
    totalMeals: meals?.length ?? 0,
    deliveredMeals: meals?.filter((m) => m.status === 'delivered').length ?? 0,
    lowStockItems: inventory?.filter((i) => i.status === 'low').length ?? 0,
    totalInventoryItems: inventory?.length ?? 0,
  }
}
