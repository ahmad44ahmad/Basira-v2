import { User, MapPin, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'
import type { UnifiedBeneficiaryProfile } from '../types'
import { ALERT_TAGS, STATUS_CONFIG } from '../types'

interface BeneficiaryCardProps {
  beneficiary: UnifiedBeneficiaryProfile
  selected?: boolean
  onClick: () => void
}

const riskColors = {
  low: '',
  medium: 'border-r-warning',
  high: 'border-r-danger',
  critical: 'border-r-red-600',
}

export function BeneficiaryCard({ beneficiary, selected, onClick }: BeneficiaryCardProps) {
  const statusConfig = STATUS_CONFIG[beneficiary.status]
  const tags = beneficiary.smartTags.slice(0, 2)
  const extraTags = beneficiary.smartTags.length - 2

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-xl border border-r-4 p-4 text-right transition-all duration-200',
        'hover:shadow-card',
        selected
          ? 'border-gold bg-gold/5 shadow-card dark:bg-gold/10'
          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
        riskColors[beneficiary.riskLevel],
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal">
          <User className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          {/* Name + Status */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {beneficiary.full_name}
            </h3>
            <Badge variant={statusConfig.variant} className="shrink-0">
              {statusConfig.label}
            </Badge>
          </div>

          {/* Info row */}
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span>#{beneficiary.file_number}</span>
            {beneficiary.room_number && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                غرفة {beneficiary.room_number}
              </span>
            )}
            <span>{beneficiary.section}</span>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => {
                const config = ALERT_TAGS[tag.id]
                return (
                  <span
                    key={tag.id}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                      config?.bgColor ?? 'bg-slate-100',
                      config?.color ?? 'text-slate-700',
                    )}
                  >
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {tag.label}
                  </span>
                )
              })}
              {extraTags > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700">
                  +{extraTags}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
