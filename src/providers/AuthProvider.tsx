import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '@/lib/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isDemoMode: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const DEMO_USER: User = {
  id: 'demo-user-123',
  email: 'demo@basira.sa',
  app_metadata: {},
  user_metadata: { full_name: 'مستخدم تجريبي' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
} as User

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: isDemoMode ? DEMO_USER : null,
    session: null,
    loading: !isDemoMode,
    isDemoMode,
  })

  useEffect(() => {
    if (isDemoMode || !supabase) {
      setState((s) => ({ ...s, loading: false }))
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setState((s) => ({
        ...s,
        user: session?.user ?? null,
        session,
        loading: false,
      }))
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((s) => ({
        ...s,
        user: session?.user ?? null,
        session,
      }))
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase not configured')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setState((s) => ({ ...s, user: null, session: null }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
