import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { SystemStatus } from '../types'

interface LegalConsentProps {
  status: SystemStatus | null
  checked: boolean
  onCheckedChange: (nextValue: boolean) => void
  className?: string
}

export function LegalConsent({
  status,
  checked,
  onCheckedChange,
  className,
}: LegalConsentProps) {
  const { t } = useTranslation()
  const hasUserAgreement = Boolean(status?.user_agreement_enabled)
  const hasPrivacyPolicy = Boolean(status?.privacy_policy_enabled)

  if (!hasUserAgreement && !hasPrivacyPolicy) {
    return null
  }

  const handleChange = (value: boolean) => {
    onCheckedChange(value === true)
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-[1.35rem] border border-slate-900/10 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] dark:border-white/10 dark:bg-white/[0.03]',
        className
      )}
    >
      <Checkbox
        id='legal-consent'
        checked={checked}
        onCheckedChange={handleChange}
        className='mt-0.5 border-slate-400 data-[checked=true]:border-[#a66a18] data-[checked=true]:bg-[#a66a18] dark:border-white/30 dark:data-[checked=true]:border-[#d6a353] dark:data-[checked=true]:bg-[#d6a353]'
      />
      <Label
        htmlFor='legal-consent'
        className='items-start gap-1 text-left text-xs leading-6 font-normal text-slate-600 dark:text-white/62'
      >
        <span>
          {t('I have read and agree to the')}{' '}
          {hasUserAgreement && (
            <a
              href='/user-agreement'
              target='_blank'
              rel='noopener noreferrer'
              className='font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#9a6822] dark:text-white dark:decoration-white/25 dark:hover:text-[#f2c98c]'
            >
              {t('User Agreement')}
            </a>
          )}
          {hasUserAgreement && hasPrivacyPolicy && ' and the '}
          {hasPrivacyPolicy && (
            <a
              href='/privacy-policy'
              target='_blank'
              rel='noopener noreferrer'
              className='font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#9a6822] dark:text-white dark:decoration-white/25 dark:hover:text-[#f2c98c]'
            >
              {t('Privacy Policy')}
            </a>
          )}
          .
        </span>
      </Label>
    </div>
  )
}
