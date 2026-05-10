import { useNotifications } from '@/hooks/use-notifications'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { ConfigDrawer } from '@/components/config-drawer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationButton } from '@/components/notification-button'
import { NotificationDialog } from '@/components/notification-dialog'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { defaultTopNavLinks } from '../config/top-nav.config'
import { type TopNavLink } from '../types'
import { Header } from './header'
import { SystemBrand } from './system-brand'
import { TopNav } from './top-nav'

/**
 * General application Header component
 * Integrates navigation bar, search, configuration and profile functions
 *
 * @example
 * // Basic usage
 * <AppHeader />
 *
 * @example
 * // Custom navigation links
 * <AppHeader navLinks={customLinks} />
 *
 * @example
 * // Hide navigation bar and search box
 * <AppHeader showTopNav={false} showSearch={false} />
 *
 * @example
 * // Fully customize left and right content
 * <AppHeader
 *   leftContent={<CustomLeft />}
 *   rightContent={<CustomRight />}
 * />
 */
type AppHeaderProps = {
  /**
   * Custom navigation links, uses default global navigation or dynamically generated from backend if not provided
   */
  navLinks?: TopNavLink[]
  /**
   * Whether to show top navigation bar
   * @default true
   */
  showTopNav?: boolean
  /**
   * Left content, overrides TopNav if provided
   */
  leftContent?: React.ReactNode
  /**
   * Whether to show search box
   * @default true
   */
  showSearch?: boolean
  /**
   * Custom right content, overrides default right content if provided
   */
  rightContent?: React.ReactNode
  /**
   * Whether to show notification button
   * @default true
   */
  showNotifications?: boolean
  /**
   * Whether to show config drawer
   * @default true
   */
  showConfigDrawer?: boolean
  /**
   * Whether to show profile dropdown
   * @default true
   */
  showProfileDropdown?: boolean
}

export function AppHeader({
  navLinks = defaultTopNavLinks,
  showTopNav = true,
  leftContent,
  showSearch = true,
  rightContent,
  showNotifications = true,
  showConfigDrawer = true,
  showProfileDropdown = true,
}: AppHeaderProps) {
  const { t } = useTranslation()
  // Prioritize dynamically generated links from backend
  const dynamicLinks = useTopNavLinks()
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks

  // Notifications hook
  const notifications = useNotifications()

  return (
    <>
      <Header className='border-b border-border/60 bg-background/82 backdrop-blur-xl'>
        <div className='flex min-w-0 flex-1 items-center gap-3'>
          <SystemBrand variant='inline' />

          {leftContent ? (
            <div className='ms-1 flex min-w-0 items-center'>{leftContent}</div>
          ) : null}
        </div>

        {rightContent ?? (
          <div className='ms-auto flex items-center gap-1.5 sm:gap-2'>
            {showTopNav && (
              <div className='hidden xl:block'>
                <TopNav links={links} />
              </div>
            )}
            {showSearch && (
              <Search
                className={cn(
                  'hidden md:inline-flex md:min-w-52 lg:min-w-60 xl:min-w-72',
                  'border-border/70 bg-muted/55 hover:bg-muted/80 shadow-[inset_0_1px_0_color-mix(in_oklch,var(--background)_88%,transparent)]'
                )}
                placeholder={t('Search routes, keys, models')}
              />
            )}
            {showNotifications && (
              <NotificationButton
                unreadCount={notifications.unreadCount}
                onClick={() => notifications.openDialog()}
                className='border-border/60 bg-background/70 hover:bg-muted/75 size-9 rounded-xl border shadow-[inset_0_1px_0_color-mix(in_oklch,var(--background)_88%,transparent)]'
              />
            )}
            <LanguageSwitcher />
            {showConfigDrawer && <ConfigDrawer />}
            {showProfileDropdown && <ProfileDropdown />}
          </div>
        )}
      </Header>

      {/* Notification Dialog */}
      {showNotifications && (
        <NotificationDialog
          open={notifications.dialogOpen}
          onOpenChange={notifications.setDialogOpen}
          activeTab={notifications.activeTab}
          onTabChange={notifications.setActiveTab}
          notice={notifications.notice}
          announcements={notifications.announcements}
          loading={notifications.loading}
          onCloseToday={notifications.closeToday}
        />
      )}
    </>
  )
}
