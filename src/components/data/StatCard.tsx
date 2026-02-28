import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  trend?: { value: number; positive?: boolean }
  accent?: 'teal' | 'navy' | 'gold' | 'danger' | 'success'
  className?: string
}

const accentBorders = {
  teal: 'border-r-teal',
  navy: 'border-r-navy',
  gold: 'border-r-gold',
  danger: 'border-r-danger',
  success: 'border-r-success',
}

const accentBg = {
  teal: 'bg-teal/10 text-teal',
  navy: 'bg-navy/10 text-navy dark:text-blue-300',
  gold: 'bg-gold/10 text-gold-dark',
  danger: 'bg-danger/10 text-danger',
  success: 'bg-success/10 text-success',
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accent = 'teal',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 border-r-4 bg-white p-4 shadow-soft transition-all duration-200 hover:shadow-card',
        'dark:border-slate-700 dark:bg-slate-800',
        accentBorders[accent],
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                trend.positive ? 'text-success' : 'text-danger',
              )}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', accentBg[accent])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
