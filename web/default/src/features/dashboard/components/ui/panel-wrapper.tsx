import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface PanelWrapperProps {
  title: ReactNode
  description?: ReactNode
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
  height?: string
  className?: string
  contentClassName?: string
  headerActions?: ReactNode
  children?: ReactNode
}

function PanelHeader(props: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {
  const heading = (
    <div className='flex flex-col gap-1'>
      <div className='text-sm font-semibold tracking-tight'>{props.title}</div>
      {props.description != null && (
        <div className='text-muted-foreground/75 text-xs leading-relaxed'>
          {props.description}
        </div>
      )}
    </div>
  )

  return (
    <div className='border-b border-border/65 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--background)_94%,transparent),transparent)] px-4 py-3.5 sm:px-5'>
      {props.actions != null ? (
        <div className='flex items-start justify-between gap-2'>
          {heading}
          {props.actions}
        </div>
      ) : (
        heading
      )}
    </div>
  )
}

export function PanelWrapper(props: PanelWrapperProps) {
  const { t } = useTranslation()
  const resolvedEmptyMessage = props.emptyMessage ?? t('No data available')
  const height = props.height ?? 'h-64'
  const frameClassName = cn(
    'overflow-hidden rounded-[1.65rem] border border-border/70 bg-background/86 shadow-[0_18px_48px_-34px_color-mix(in_oklch,var(--foreground)_18%,transparent),inset_0_1px_0_color-mix(in_oklch,var(--background)_88%,transparent)] backdrop-blur-[8px]',
    props.className
  )

  if (props.loading) {
    return (
      <div className={frameClassName}>
        <PanelHeader title={props.title} description={props.description} />
        <div className={cn('p-4 sm:p-5', props.contentClassName)}>
          <Skeleton
            className={`w-full rounded-[1.1rem] bg-muted/65 ${height}`}
          />
        </div>
      </div>
    )
  }

  if (props.empty) {
    return (
      <div className={frameClassName}>
        <PanelHeader title={props.title} description={props.description} />
        <div
          className={cn(
            'text-muted-foreground/78 flex items-center justify-center px-4 text-sm',
            height,
            props.contentClassName
          )}
        >
          {resolvedEmptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div className={frameClassName}>
      <PanelHeader
        title={props.title}
        description={props.description}
        actions={props.headerActions}
      />
      <div className={cn('p-4 sm:p-5', props.contentClassName)}>
        {props.children}
      </div>
    </div>
  )
}
