import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
}

export function Spinner({ size = 'md', className, text }: SpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-teal', sizeMap[size])} />
      {text && <span className="text-sm text-slate-500 dark:text-slate-400">{text}</span>}
    </div>
  )
}

export function FullPageSpinner({ text = 'جاري التحميل...' }: { text?: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" text={text} />
    </div>
  )
}
