import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { SystemStatus } from '../types'

interface TermsFooterProps {
  variant?: 'sign-in' | 'sign-up'
  className?: string
  status?: SystemStatus | null
}

export function TermsFooter({
  variant = 'sign-in',
  className,
  status,
}: TermsFooterProps) {
  const { t } = useTranslation()
  const text =
    variant === 'sign-in'
      ? 'By clicking sign in, you agree to our'
      : 'By creating an account, you agree to our'

  const hasUserAgreement = Boolean(status?.user_agreement_enabled)
  const hasPrivacyPolicy = Boolean(status?.privacy_policy_enabled)

  if (!hasUserAgreement && !hasPrivacyPolicy) {
    return null
  }

  const agreementLink = {
    label: 'User Agreement',
    href: '/user-agreement',
  }
  const privacyLink = {
    label: 'Privacy Policy',
    href: '/privacy-policy',
  }

  const activeLinks =
    hasUserAgreement || hasPrivacyPolicy
      ? ([
          hasUserAgreement ? agreementLink : null,
          hasPrivacyPolicy ? privacyLink : null,
        ].filter(Boolean) as Array<{ label: string; href: string }>)
      : [agreementLink, privacyLink]

  const [firstLink, secondLink] = activeLinks

  return (
    <p
      className={cn(
        'text-xs leading-6 text-slate-500 dark:text-white/45',
        className
      )}
    >
      {text}{' '}
      {firstLink && (
        <a
          href={firstLink.href}
          className='font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#9a6822] dark:text-white dark:decoration-white/25 dark:hover:text-[#f2c98c]'
        >
          {firstLink.label}
        </a>
      )}
      {secondLink && (
        <>
          {' '}
          {t('and')}{' '}
          <a
            href={secondLink.href}
            className='font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#9a6822] dark:text-white dark:decoration-white/25 dark:hover:text-[#f2c98c]'
          >
            {secondLink.label}
          </a>
        </>
      )}
      .
    </p>
  )
}
