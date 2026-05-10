import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type SystemBrandProps = {
  defaultName?: string
  defaultVersion?: string
  /**
   * Visual layout:
   * - 'sidebar': stacked card style (used inside the sidebar header).
   * - 'inline': compact horizontal pill (used inside the top app bar).
   */
  variant?: 'sidebar' | 'inline'
}

/**
 * System brand component
 * Displays current system logo + name.
 * - inline: compact pill in the top app bar; clicking navigates to home (/)
 * - sidebar: stacked card in the sidebar header (display only)
 */
export function SystemBrand(props: SystemBrandProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const { logo } = useSystemConfig()

  const variant = props.variant ?? 'sidebar'
  const name = status?.system_name || props.defaultName || 'New API'
  const version =
    status?.version || props.defaultVersion || t('Unknown version')

  if (variant === 'inline') {
    return (
      <Link
        to='/'
        aria-label={t('Go to home')}
        className={cn(
          'text-foreground inline-flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-background/72 px-2.5 py-2 shadow-[0_10px_24px_-18px_color-mix(in_oklch,var(--foreground)_20%,transparent),inset_0_1px_0_color-mix(in_oklch,var(--background)_92%,transparent)] transition-colors outline-none select-none',
          'hover:bg-accent/65 focus-visible:ring-ring/40 focus-visible:ring-2'
        )}
      >
        <div className='flex size-9 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-background shadow-[inset_0_1px_0_color-mix(in_oklch,var(--background)_90%,transparent)]'>
          <img
            src={logo}
            alt={t('Logo')}
            className='size-7 rounded-lg object-cover'
          />
        </div>
        <div className='grid min-w-0 flex-1 text-left leading-tight'>
          <span className='truncate text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground'>
            {t('AI Traffic Control')}
          </span>
          <span className='truncate text-sm font-semibold'>{name}</span>
        </div>
        <span className='hidden rounded-full border border-border/70 bg-muted/65 px-2 py-1 text-[10px] font-medium tracking-[0.18em] uppercase text-muted-foreground xl:inline-flex'>
          {version}
        </span>
      </Link>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='hover:text-sidebar-foreground active:text-sidebar-foreground h-auto cursor-default rounded-[1.5rem] border border-sidebar-border/75 bg-sidebar-accent/55 px-3 py-3 shadow-[0_18px_38px_-28px_color-mix(in_oklch,var(--sidebar-foreground)_32%,transparent),inset_0_1px_0_color-mix(in_oklch,var(--sidebar-background)_88%,transparent)] hover:bg-sidebar-accent/55 active:bg-sidebar-accent/55'
          render={<div />}
        >
          <div className='flex aspect-square size-10 items-center justify-center overflow-hidden rounded-2xl border border-sidebar-border/70 bg-sidebar-background/90 shadow-[inset_0_1px_0_color-mix(in_oklch,var(--sidebar-background)_88%,transparent)]'>
            <img
              src={logo}
              alt={t('Logo')}
              className='size-8 rounded-xl object-cover'
            />
          </div>
          <div className='grid flex-1 text-start text-sm leading-tight group-data-[collapsible=icon]:hidden'>
            <span className='truncate text-[11px] font-semibold tracking-[0.2em] uppercase text-sidebar-foreground/60'>
              {t('Traffic Plane')}
            </span>
            <span className='truncate font-semibold'>{name}</span>
            <span className='truncate text-xs text-sidebar-foreground/65'>
              {version}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
