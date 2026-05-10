import { useMemo } from 'react'
import { useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { ROLE } from '@/lib/roles'
import { useLayout } from '@/context/layout-provider'
import { useSidebarConfig } from '@/hooks/use-sidebar-config'
import { useSidebarData } from '@/hooks/use-sidebar-data'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { getNavGroupsForPath } from '../lib/workspace-registry'
import { NavGroup } from './nav-group'
import { SystemBrand } from './system-brand'

/**
 * Application sidebar component
 * Fetches corresponding navigation menu from workspace registry based on current path
 * Dynamically filters navigation items based on backend SidebarModulesAdmin configuration
 *
 * Automatically matches workspace configuration for current path through workspace registry system
 * Adding new workspaces only requires registration in workspace-registry.ts
 */
export function AppSidebar() {
  const { t } = useTranslation()
  const { collapsible, variant } = useLayout()
  const { pathname } = useLocation()
  const userRole = useAuthStore((state) => state.auth.user?.role)
  const sidebarData = useSidebarData()

  // Get navigation group configuration corresponding to current path from workspace registry
  const allNavGroups = getNavGroupsForPath(pathname, t) || sidebarData.navGroups

  // Filter sidebar navigation items based on backend configuration
  const configFilteredNavGroups = useSidebarConfig(allNavGroups)

  // Filter navigation groups based on user role
  // Non-Admin users cannot see Admin navigation group
  const currentNavGroups = useMemo(() => {
    const isAdmin = userRole && userRole >= ROLE.ADMIN
    return configFilteredNavGroups.filter((group) => {
      if (group.id === 'admin') {
        return isAdmin
      }
      return true
    })
  }, [configFilteredNavGroups, userRole])

  return (
    <Sidebar
      collapsible={collapsible}
      variant={variant}
      className='before:pointer-events-none before:absolute before:inset-x-3 before:top-3 before:h-28 before:rounded-[1.5rem] before:bg-[radial-gradient(circle_at_top_left,oklch(0.93_0.05_90/.8),transparent_46%),radial-gradient(circle_at_top_right,oklch(0.94_0.07_210/.45),transparent_38%)] before:content-[""]'
    >
      <SidebarHeader className='gap-3 px-3 pb-3'>
        <SystemBrand variant='sidebar' />
        <div className='rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/45 px-3 py-2 text-[11px] leading-5 text-sidebar-foreground/78 shadow-[inset_0_1px_0_color-mix(in_oklch,var(--sidebar-background)_82%,transparent)] group-data-[collapsible=icon]:hidden'>
          <div className='font-semibold tracking-[0.18em] uppercase'>
            {t('Traffic Control')}
          </div>
          <div className='mt-1 text-sidebar-foreground/62'>
            {t('Watch routes, policies, keys, and spend from one console.')}
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className='mx-3 bg-sidebar-border/70' />
      <SidebarContent className='px-1.5 py-3'>
        {currentNavGroups.map((props) => {
          const key = props.id || props.title
          return <NavGroup key={key} {...props} />
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
