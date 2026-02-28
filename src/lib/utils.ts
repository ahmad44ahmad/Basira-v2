import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ar } from 'date-fns/locale'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Format date in Arabic locale */
export function formatDate(date: string | Date, pattern = 'dd MMMM yyyy'): string {
  return format(new Date(date), pattern, { locale: ar })
}

/** Format relative time in Arabic (e.g., "منذ 3 ساعات") */
export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ar })
}

/** Format currency in SAR */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    minimumFractionDigits: 0,
  }).format(amount)
}

/** Format number with Arabic locale */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ar-SA').format(num)
}

/** Format percentage */
export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/** Generate initials from Arabic or English name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

/** Sleep utility for testing */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
