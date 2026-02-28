import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Sparkles, LogIn, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { Button, Input } from '@/components/ui'
import { toast } from '@/stores/useToastStore'

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, isDemoMode } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      await signIn(data.email, data.password)
      toast.success('تم تسجيل الدخول بنجاح')
      navigate('/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
      toast.error('خطأ في البريد الإلكتروني أو كلمة المرور')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    toast.success('مرحباً بك في الوضع التجريبي')
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-bl from-navy via-navy-dark to-teal-dark p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-glass backdrop-blur-xl"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/20">
            <Sparkles className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-white">نظام بصيرة</h1>
          <p className="mt-1 text-sm text-slate-300">نظام إدارة مرافق الرعاية</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">البريد الإلكتروني</label>
            <input
              type="email"
              {...register('email')}
              className="h-11 w-full rounded-lg border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              placeholder="admin@basira.sa"
              dir="ltr"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className="h-11 w-full rounded-lg border border-white/20 bg-white/10 px-4 pl-11 text-sm text-white placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                placeholder="••••••"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            loading={loading}
            icon={<LogIn className="h-4 w-4" />}
            className="w-full"
            variant="gold"
            size="lg"
          >
            تسجيل الدخول
          </Button>
        </form>

        {/* Demo mode */}
        {isDemoMode && (
          <div className="mt-4">
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-transparent px-2 text-slate-400">أو</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={handleDemoLogin}
            >
              دخول تجريبي
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
