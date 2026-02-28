import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import type { BeneficiaryFilters as FilterState } from '../types'

interface BeneficiaryFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  totalCount: number
  filteredCount: number
}

export function BeneficiaryFilters({ filters, onChange, totalCount, filteredCount }: BeneficiaryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = [
    filters.status !== 'all',
    filters.section !== 'all',
    filters.riskLevel !== 'all',
  ].filter(Boolean).length

  const clearFilters = () => {
    onChange({ search: filters.search, status: 'all', section: 'all', riskLevel: 'all' })
  }

  return (
    <div className="space-y-3">
      {/* Search + Filter Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="ابحث بالاسم أو رقم الملف أو الهوية..."
            className={cn(
              'h-10 w-full rounded-lg border bg-white pr-10 pl-3 text-sm',
              'border-slate-200 placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold',
              'dark:bg-slate-800 dark:border-slate-600',
            )}
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          size="md"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -left-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">تصفية</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-danger hover:underline">
                <X className="h-3 w-3" />
                مسح الفلاتر
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Status */}
            <div>
              <label className="mb-1 block text-xs text-slate-500">الحالة</label>
              <select
                value={filters.status}
                onChange={(e) => onChange({ ...filters, status: e.target.value as FilterState['status'] })}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-slate-600 dark:bg-slate-700"
              >
                <option value="all">الكل</option>
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
                <option value="مخرج">مخرج</option>
                <option value="متوفى">متوفى</option>
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="mb-1 block text-xs text-slate-500">القسم</label>
              <select
                value={filters.section}
                onChange={(e) => onChange({ ...filters, section: e.target.value as FilterState['section'] })}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-slate-600 dark:bg-slate-700"
              >
                <option value="all">الكل</option>
                <option value="ذكور">ذكور</option>
                <option value="إناث">إناث</option>
                <option value="أطفال">أطفال</option>
              </select>
            </div>

            {/* Risk Level */}
            <div>
              <label className="mb-1 block text-xs text-slate-500">مستوى الخطر</label>
              <select
                value={filters.riskLevel}
                onChange={(e) => onChange({ ...filters, riskLevel: e.target.value as FilterState['riskLevel'] })}
                className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm dark:border-slate-600 dark:bg-slate-700"
              >
                <option value="all">الكل</option>
                <option value="low">منخفض</option>
                <option value="medium">متوسط</option>
                <option value="high">عالي</option>
                <option value="critical">حرج</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        عرض {filteredCount} من {totalCount} مستفيد
      </p>
    </div>
  )
}
