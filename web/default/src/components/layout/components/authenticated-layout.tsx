import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AnimatedOutlet } from '@/components/page-transition'
import { SkipToMain } from '@/components/skip-to-main'
import { WorkspaceProvider } from '../context/workspace-context'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout(props: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  return (
    <LayoutProvider>
      <SearchProvider>
        <WorkspaceProvider>
          <SidebarProvider
            defaultOpen={defaultOpen}
            className={cn(
              '[--app-header-height:4.5rem]',
              'min-h-svh flex-col bg-[radial-gradient(circle_at_top_left,oklch(0.97_0.05_85/.9),transparent_26%),radial-gradient(circle_at_top_right,oklch(0.95_0.06_195/.45),transparent_24%),linear-gradient(180deg,oklch(0.99_0.01_95)_0%,oklch(0.985_0.008_255)_48%,oklch(0.972_0.012_255)_100%)]'
            )}
          >
            <SkipToMain />
            <AppHeader />
            <div className='relative flex min-h-0 w-full flex-1'>
              <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--border)_55%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_45%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.3]'
              />
              <AppSidebar />
              <SidebarInset
                className={cn(
                  '@container/content',
                  'relative isolate overflow-hidden',
                  'h-[calc(100svh-var(--app-header-height,0px))]',
                  'peer-data-[variant=inset]:h-[calc(100svh-var(--app-header-height,0px)-(var(--spacing)*4))]'
                )}
              >
                <div
                  aria-hidden='true'
                  className='pointer-events-none absolute inset-0'
                >
                  <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,oklch(0.98_0.03_90/.9),transparent_40%),radial-gradient(circle_at_bottom_right,oklch(0.95_0.05_205/.35),transparent_34%)]' />
                  <div className='absolute inset-0 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_6%,transparent),transparent_22%,transparent_78%,color-mix(in_oklch,var(--warning)_8%,transparent))] opacity-90' />
                </div>
                <div className='relative flex min-h-0 flex-1 flex-col'>
                  {props.children ?? <AnimatedOutlet />}
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </WorkspaceProvider>
      </SearchProvider>
    </LayoutProvider>
  )
}
