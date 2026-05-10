import type { ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

type StatCardTone = 'rose' | 'teal' | 'gray'

interface StatCardProps {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  sparkline?: number[]
  tone?: StatCardTone
  loading?: boolean
  error?: boolean
  action?: ReactNode
}

const TONE_CLASSES: Record<StatCardTone, string> = {
  rose: 'from-amber-500/90 via-orange-300/75 to-yellow-200/25 dark:from-amber-400/75 dark:via-orange-500/35 dark:to-yellow-400/10',
  teal: 'from-cyan-600/90 via-teal-400/70 to-emerald-200/25 dark:from-cyan-400/75 dark:via-teal-500/35 dark:to-emerald-400/10',
  gray: 'from-slate-500/75 via-slate-300/35 to-transparent dark:from-slate-300/55 dark:via-slate-200/20',
}

function normalizeSparkline(values?: number[]): number[] {
  if (!values?.length) return []

  const sanitized = values.map((value) => Math.max(0, Number(value) || 0))
  const max = Math.max(...sanitized)
  if (max <= 0) return sanitized.map(() => 0)

  return sanitized.map((value) => Math.max(8, (value / max) * 100))
}

export function StatCard(props: StatCardProps) {
  const Icon = props.icon
  const tone = props.tone ?? 'gray'
  const sparkline = normalizeSparkline(props.sparkline)

  return (
    <div className='group flex min-h-36 flex-col justify-between gap-4'>
      <div className='flex items-start justify-between gap-2'>
        <div className='text-muted-foreground flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase sm:gap-2.5'>
          <Icon
            className='text-muted-foreground/70 size-3.5 shrink-0'
            aria-hidden='true'
          />
          <span className='line-clamp-2 leading-snug'>{props.title}</span>
        </div>
        {props.action && <div className='shrink-0'>{props.action}</div>}
      </div>

      {props.loading ? (
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-8 w-28 rounded-lg bg-muted/70' />
          <Skeleton className='h-3.5 w-36 rounded-lg bg-muted/55' />
        </div>
      ) : props.error ? (
        <div className='flex flex-col gap-1'>
          <div className='text-muted-foreground mt-0.5 font-mono text-lg font-bold tracking-tight break-all tabular-nums sm:text-3xl'>
            --
          </div>
          <p className='text-muted-foreground/70 text-xs leading-relaxed'>
            {props.description}
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-1'>
          <div className='text-foreground font-mono text-3xl font-semibold tracking-tight break-all tabular-nums'>
            {props.value}
          </div>
          <p className='text-muted-foreground/72 max-w-[22ch] text-xs leading-relaxed'>
            {props.description}
          </p>
        </div>
      )}

      <div
        className='relative flex h-10 items-end gap-1 overflow-hidden rounded-xl border border-border/45 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--muted)_38%,transparent),transparent)] px-1.5 pb-1.5 pt-2'
        aria-hidden='true'
      >
        <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklch,var(--foreground)_16%,transparent),transparent)]' />
        {sparkline.map((height, index) => (
          <span
            key={`${props.title}-spark-${index}`}
            className={cn(
              'flex-1 rounded-t-sm bg-linear-to-t shadow-[0_0_12px_-6px_color-mix(in_oklch,var(--foreground)_25%,transparent)]',
              height <= 0 && 'opacity-20',
              TONE_CLASSES[tone]
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  )
}
