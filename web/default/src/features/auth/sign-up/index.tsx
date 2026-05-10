import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Sparkles, Workflow } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStatus } from '@/hooks/use-status'
import { AuthLayout } from '../auth-layout'
import { TermsFooter } from '../components/terms-footer'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  const { t } = useTranslation()
  const { status } = useStatus()

  return (
    <AuthLayout>
      <div className='w-full space-y-8'>
        <div className='space-y-5'>
          <div className='inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/80 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.22em] text-slate-600 uppercase shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-white/[0.04] dark:text-white/50'>
            <Workflow className='h-3.5 w-3.5' />
            {t('Provision premium access')}
          </div>
          <div className='space-y-3'>
            <h2
              className='max-w-lg text-4xl leading-[0.95] font-semibold tracking-[-0.06em] text-balance sm:text-[2.85rem]'
              style={{
                fontFamily:
                  '"Public Sans Variable", "Public Sans", ui-sans-serif, system-ui, sans-serif',
              }}
            >
              {t('Create an account')}
            </h2>
            <p className='max-w-xl text-sm leading-7 text-slate-600 sm:text-[0.98rem] dark:text-white/68'>
              {t(
                'Activate your API-router workspace with unified provider access, safer authentication, and a cleaner control-plane experience from day one.'
              )}
            </p>
          </div>
          <div className='grid gap-3 sm:grid-cols-3'>
            <div className='rounded-[1.35rem] border border-slate-900/10 bg-white/78 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]'>
              <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                {t('Fast onboarding')}
              </p>
              <p className='mt-2 text-sm leading-6 text-slate-700 dark:text-white/72'>
                {t('Create credentials and move straight into routing setup.')}
              </p>
            </div>
            <div className='rounded-[1.35rem] border border-slate-900/10 bg-white/78 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]'>
              <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                {t('Flexible auth')}
              </p>
              <p className='mt-2 text-sm leading-6 text-slate-700 dark:text-white/72'>
                {t('Email verification and social sign-up remain fully functional.')}
              </p>
            </div>
            <div className='rounded-[1.35rem] border border-slate-900/10 bg-white/78 px-4 py-3 dark:border-white/10 dark:bg-white/[0.04]'>
              <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                {t('Premium shell')}
              </p>
              <p className='mt-2 text-sm leading-6 text-slate-700 dark:text-white/72'>
                {t('A stronger first impression for the entire auth surface.')}
              </p>
            </div>
          </div>
          <div className='flex items-start gap-3 rounded-[1.45rem] border border-slate-900/10 bg-[linear-gradient(135deg,rgba(246,238,225,0.95),rgba(255,255,255,0.82))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]'>
            <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#a66a18] text-white shadow-[0_14px_28px_-20px_rgba(166,106,24,0.8)] dark:bg-[#d6a353] dark:text-slate-950'>
              <Sparkles className='h-4 w-4' />
            </div>
            <p className='text-sm leading-6 text-slate-700 dark:text-white/72'>
              {t(
                'This redesign updates the look and feel only. Your validation, registration, redirect, verification, and OAuth logic still run exactly as before.'
              )}
            </p>
          </div>
          <p className='text-sm leading-7 text-slate-600 dark:text-white/62'>
            {t('Already have an account?')}{' '}
            <Link
              to='/sign-in'
              className='inline-flex items-center gap-1 font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-[#9a6822] dark:text-white dark:decoration-white/25 dark:hover:text-[#f2c98c]'
            >
              {t('Sign in')}
              <ArrowUpRight className='h-3.5 w-3.5' />
            </Link>
            .
          </p>
        </div>

        <div className='rounded-[1.6rem] border border-slate-900/10 bg-white/66 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/10 dark:bg-white/[0.03] sm:p-5'>
          <div className='space-y-2 pb-4'>
            <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
              {t('Workspace creation')}
            </p>
            <h3 className='text-lg font-semibold tracking-[-0.03em]'>
              {t('Set your account credentials')}
            </h3>
          </div>
          <SignUpForm />
        </div>

        <TermsFooter
          variant='sign-up'
          status={status}
          className='text-left'
        />
      </div>
    </AuthLayout>
  )
}
