import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

let instance: SupabaseClient<Database> | null = null

export function getSupabase(): SupabaseClient<Database> | null {
  if (instance) return instance
  if (!supabaseUrl || !supabaseAnonKey) return null

  instance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return instance
}

export const supabase = getSupabase()

export const isDemoMode = import.meta.env.VITE_APP_MODE === 'demo'
