import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { useToastStore, type ToastType } from '@/stores/useToastStore'
import { cn } from '@/lib/utils'

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
}

const styles: Record<ToastType, string> = {
  success: 'border-emerald-200 dark:border-emerald-800',
  error: 'border-red-200 dark:border-red-800',
  warning: 'border-amber-200 dark:border-amber-800',
  info: 'border-blue-200 dark:border-blue-800',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className={cn(
              'flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-elevated',
              'dark:bg-slate-800',
              styles[t.type],
            )}
          >
            {icons[t.type]}
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {t.message}
            </span>
            <button
              onClick={() => removeToast(t.id)}
              className="ms-auto rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
