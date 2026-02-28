import { cn, getInitials } from '@/lib/utils'

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

interface AvatarProps {
  name: string
  src?: string | null
  size?: keyof typeof sizeMap
  className?: string
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover', sizeMap[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-teal/15 font-bold text-teal',
        sizeMap[size],
        className,
      )}
    >
      {getInitials(name)}
    </div>
  )
}
