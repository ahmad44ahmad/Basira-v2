import { cn } from '@/lib/utils'

const variants = {
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  teal: 'bg-teal/10 text-teal dark:bg-teal/20 dark:text-teal-light',
  gold: 'bg-gold/10 text-gold-dark dark:bg-gold/20 dark:text-gold-light',
} as const

interface BadgeProps {
  variant?: keyof typeof variants
  children: React.ReactNode
  className?: string
  dot?: boolean
}

export function Badge({ variant = 'neutral', children, className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full', {
            'bg-emerald-500': variant === 'success',
            'bg-amber-500': variant === 'warning',
            'bg-red-500': variant === 'danger',
            'bg-blue-500': variant === 'info',
            'bg-slate-500': variant === 'neutral',
            'bg-teal': variant === 'teal',
            'bg-gold': variant === 'gold',
          })}
        />
      )}
      {children}
    </span>
  )
}
