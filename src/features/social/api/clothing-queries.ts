import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, isDemoMode } from '@/lib/supabase'
import { queryKeys } from '@/lib/query-keys'
import type {
  ClothingInventory, ClothingInventoryInsert,
  ClothingTransaction, ClothingTransactionInsert,
} from '@/types/database'

// ===== Demo Data =====

const DEMO_INVENTORY: ClothingInventory[] = [
  {
    id: 'ci001',
    beneficiary_id: 'b001',
    season_type: 'summer',
    fiscal_year: '1447',
    item_name: 'ثوب صيفي',
    item_size: 'L',
    quantity: 3,
    condition: 'good',
    notes: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ci002',
    beneficiary_id: 'b001',
    season_type: 'winter',
    fiscal_year: '1447',
    item_name: 'جاكيت شتوي',
    item_size: 'L',
    quantity: 2,
    condition: 'good',
    notes: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'ci003',
    beneficiary_id: 'b002',
    season_type: 'eid_fitr',
    fiscal_year: '1447',
    item_name: 'ملابس عيد الفطر',
    item_size: 'M',
    quantity: 1,
    condition: 'good',
    notes: 'تم الصرف بمناسبة العيد',
    created_at: new Date().toISOString(),
  },
]

const DEMO_TRANSACTIONS: ClothingTransaction[] = [
  {
    id: 'ct001',
    transaction_type: 'purchase',
    beneficiary_id: null,
    season_type: 'summer',
    fiscal_year: '1447',
    items: [
      { name: 'ثوب صيفي', size: 'L', quantity: 20, unit_cost: 150 },
      { name: 'سروال', size: 'L', quantity: 20, unit_cost: 80 },
    ],
    total_cost: 4600,
    warehouse_keeper: 'أ. عبدالله المحمدي',
    committee_head: 'أ. سعد الحربي',
    notes: 'مشتريات الموسم الصيفي',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ct002',
    transaction_type: 'issue',
    beneficiary_id: 'b001',
    season_type: 'summer',
    fiscal_year: '1447',
    items: [
      { name: 'ثوب صيفي', size: 'L', quantity: 3 },
      { name: 'سروال', size: 'L', quantity: 3 },
    ],
    total_cost: null,
    warehouse_keeper: 'أ. عبدالله المحمدي',
    committee_head: null,
    notes: 'صرف كسوة صيفية للمستفيد',
    created_at: new Date().toISOString(),
  },
]

// ===== Clothing Inventory =====

async function fetchClothingInventory(): Promise<ClothingInventory[]> {
  if (isDemoMode || !supabase) return DEMO_INVENTORY

  const { data, error } = await supabase
    .from('clothing_inventory')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useClothingInventory() {
  return useQuery({
    queryKey: queryKeys.social.clothingInventory(),
    queryFn: fetchClothingInventory,
  })
}

export function useCreateClothingItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ClothingInventoryInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `ci${Date.now()}`, created_at: new Date().toISOString() } as ClothingInventory
      }
      const { data, error } = await supabase
        .from('clothing_inventory')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.clothingInventory() })
    },
  })
}

// ===== Clothing Transactions =====

async function fetchClothingTransactions(): Promise<ClothingTransaction[]> {
  if (isDemoMode || !supabase) return DEMO_TRANSACTIONS

  const { data, error } = await supabase
    .from('clothing_transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export function useClothingTransactions() {
  return useQuery({
    queryKey: queryKeys.social.clothingTransactions(),
    queryFn: fetchClothingTransactions,
  })
}

export function useCreateClothingTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: ClothingTransactionInsert) => {
      if (isDemoMode || !supabase) {
        await new Promise((r) => setTimeout(r, 300))
        return { ...input, id: `ct${Date.now()}`, created_at: new Date().toISOString() } as ClothingTransaction
      }
      const { data, error } = await supabase
        .from('clothing_transactions')
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.social.clothingTransactions() })
    },
  })
}
