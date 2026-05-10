import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  IconDiscord,
  IconGithub,
  IconLinuxDo,
  IconWeChat,
} from '@/assets/brand-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useOAuthLogin } from '../hooks/use-oauth-login'
import type { SystemStatus } from '../types'

type OAuthProvidersProps = {
  status: SystemStatus | null
  disabled?: boolean
  className?: string
  onWeChatLogin?: () => void
  isWeChatLoading?: boolean
}

type ProviderButton = {
  key: string
  label: string
  onClick: () => void
  icon?: ReactNode
  disabled?: boolean
}

export function OAuthProviders({
  status,
  disabled = false,
  className,
  onWeChatLogin,
  isWeChatLoading = false,
}: OAuthProvidersProps) {
  const { t } = useTranslation()
  const {
    isLoading,
    githubButtonText,
    githubButtonDisabled,
    handleGitHubLogin,
    handleDiscordLogin,
    handleOIDCLogin,
    handleLinuxDOLogin,
    handleTelegramLogin,
    handleCustomOAuthLogin,
  } = useOAuthLogin(status)

  const providerButtons: ProviderButton[] = []

  if (status?.wechat_login && onWeChatLogin) {
    providerButtons.push({
      key: 'wechat',
      label: t('Continue with WeChat'),
      onClick: onWeChatLogin,
      icon: <IconWeChat className='h-4 w-4' />,
      disabled: isWeChatLoading,
    })
  }

  if (status?.github_oauth) {
    providerButtons.push({
      key: 'github',
      label: githubButtonText || t('Continue with GitHub'),
      onClick: handleGitHubLogin,
      icon: <IconGithub className='h-4 w-4' />,
      disabled: githubButtonDisabled,
    })
  }

  if (status?.discord_oauth) {
    providerButtons.push({
      key: 'discord',
      label: t('Continue with Discord'),
      onClick: handleDiscordLogin,
      icon: <IconDiscord className='h-4 w-4' />,
    })
  }

  if (status?.oidc_enabled) {
    providerButtons.push({
      key: 'oidc',
      label: t('Continue with OIDC'),
      onClick: handleOIDCLogin,
    })
  }

  if (status?.linuxdo_oauth) {
    providerButtons.push({
      key: 'linuxdo',
      label: t('Continue with LinuxDO'),
      onClick: handleLinuxDOLogin,
      icon: <IconLinuxDo className='h-4 w-4' />,
    })
  }

  if (status?.telegram_oauth) {
    providerButtons.push({
      key: 'telegram',
      label: t('Continue with Telegram'),
      onClick: handleTelegramLogin,
    })
  }

  // Custom OAuth providers
  const customProviders = status?.custom_oauth_providers
  if (customProviders && customProviders.length > 0) {
    for (const provider of customProviders) {
      providerButtons.push({
        key: `custom-${provider.slug}`,
        label: t('Continue with {{name}}', { name: provider.name }),
        onClick: () => handleCustomOAuthLogin(provider),
      })
    }
  }

  if (providerButtons.length === 0) return null

  return (
    <div
      className={cn(
        'space-y-4 rounded-[1.45rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(244,237,226,0.8))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))]',
        className
      )}
    >
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-slate-900/10 dark:border-white/10' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-[#f8f2e8] px-3 text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 dark:bg-[#12161d] dark:text-white/45'>
            {t('Or continue with')}
          </span>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        {providerButtons.map(
          ({ key, label, onClick, icon, disabled: extraDisabled }) => (
            <Button
              key={key}
              variant='outline'
              type='button'
              disabled={disabled || isLoading || extraDisabled}
              onClick={onClick}
              className='h-12 w-full justify-center gap-2 rounded-2xl border-slate-900/10 bg-white/84 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]'
            >
              {icon}
              {label}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
