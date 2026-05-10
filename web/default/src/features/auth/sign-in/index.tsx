import { Link, useSearch } from '@tanstack/react-router'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStatus } from '@/hooks/use-status'
import { AuthLayout } from '../auth-layout'
import { TermsFooter } from '../components/terms-footer'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { t } = useTranslation()
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const { status } = useStatus()

  return (
    <AuthLayout>
      <div className='w-full space-y-8'>
        <div className='space-y-5'>
          <div className='inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.22em] text-slate-600 uppercase shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50'>
            <ShieldCheck className='h-3.5 w-3.5' />
            {t('Secure operator access')}
          </div>
          <div className='space-y-3'>
            <h2
              className='max-w-lg text-4xl leading-[0.95] font-semibold tracking-[-0.06em] text-balance sm:text-[2.85rem]'
              style={{
                fontFamily:
                  '"Public Sans Variable", "Public Sans", ui-sans-serif, system-ui, sans-serif',
              }}
            >
              {t('Sign in')}
            </h2>
            <p className='max-w-xl text-sm leading-7 text-slate-600 sm:text-[0.98rem] dark:text-white/68'>
              {t(
                'Resume routing operations, inspect usage, and manage upstream providers from the same premium control plane.'
              )}
            </p>
          </div>
          <div className='grid gap-3 sm:grid-cols-3'>
            <div className='rounded-[1.35rem] border border-slate-900/10 bg-white/78 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]'>
              <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                {t('Single edge')}
              </p>
              <p className='mt-2 text-sm leading-6 text-slate-700 dark:text-white/72'>
                {t('One auth surface for every provider route.')}
              </p>
            </div>
            <div className='rounded-[1.35rem] border border-slate-900/10 bg-white/78 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]'>
              <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                {t('Hardened sign-in')}
              </p>
              <p className='mt-2 text-sm leading-6 text-slate-700 dark:text-white/72'>
                {t('Password, passkey, OAuth, and 2FA stay aligned.')}
              </p>
            </div>
            <div className='rounded-[1.35rem] border border-slate-900/10 bg-white/78 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]'>
              <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                {t('Operational clarity')}
              </p>
              <p className='mt-2 text-sm leading-6 text-slate-700 dark:text-white/72'>
                {t('Readable, responsive, and ready for daily admin work.')}
              </p>
            </div>
          </div>
          {!status?.self_use_mode_enabled && (
            <p className='text-sm leading-7 text-slate-600 dark:text-white/62'>
              {t("Don't have an account?")}{' '}
              <Link
                to='/sign-up'
                className='inline-flex items-center gap-1 font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#9a6822] dark:text-white dark:decoration-white/25 dark:hover:text-[#f2c98c]'
              >
                {t('Sign up')}
                <ArrowUpRight className='h-3.5 w-3.5' />
              </Link>
              .
            </p>
          )}
        </div>

        <div className='rounded-[1.6rem] border border-slate-900/10 bg-white/66 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/10 dark:bg-white/[0.03] sm:p-5'>
          <div className='space-y-2 pb-4'>
            <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
              {t('Authentication')}
            </p>
            <h3 className='text-lg font-semibold tracking-[-0.03em]'>
              {t('Enter your credentials')}
            </h3>
          </div>
          <UserAuthForm redirectTo={redirect} />
        </div>

        <TermsFooter
          variant='sign-in'
          status={status}
          className='text-left'
        />
      </div>
    </AuthLayout>
  )
}
