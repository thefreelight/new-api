import { Link } from '@tanstack/react-router'
import { ArrowRight, Dot, Shield, Waypoints } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Button } from '@/components/ui/button'
import { HeroTerminalDemo } from '../hero-terminal-demo'
import { getHeroSignalItems } from '../../constants'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()
  const signalItems = getHeroSignalItems(t)

  return (
    <section className='relative overflow-hidden px-6 pt-28 pb-20 md:pt-36 md:pb-24'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          background: [
            'radial-gradient(circle at 12% 18%, oklch(0.95 0.04 215 / 0.95) 0, transparent 34%)',
            'radial-gradient(circle at 88% 14%, oklch(0.96 0.03 85 / 0.92) 0, transparent 28%)',
            'linear-gradient(180deg, rgba(248,250,252,0.96) 0%, rgba(255,255,255,0.96) 36%, rgba(244,247,250,0.92) 100%)',
          ].join(','),
        }}
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.46]'
        style={{
          backgroundImage: [
            'linear-gradient(to right, rgba(148,163,184,0.16) 1px, transparent 1px)',
            'linear-gradient(to bottom, rgba(148,163,184,0.16) 1px, transparent 1px)',
          ].join(','),
          backgroundSize: '92px 92px',
          maskImage:
            'radial-gradient(circle at center, black 18%, rgba(0,0,0,0.6) 58%, transparent 88%)',
        }}
      />

      <div className='relative mx-auto max-w-7xl'>
        <div className='grid gap-14 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] xl:items-center'>
          <div className='max-w-2xl'>
            <div className='landing-animate-fade-up inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/82 px-3 py-1.5 text-[0.72rem] font-semibold tracking-[0.2em] text-slate-600 uppercase shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)] opacity-0'>
              <Waypoints className='size-3.5 text-cyan-700' strokeWidth={1.8} />
              {t('Signal Grid')}
            </div>

            <h1
              className='landing-animate-fade-up mt-7 max-w-[13ch] text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.96] font-semibold tracking-[-0.06em] text-slate-950 opacity-0 dark:text-slate-50'
              style={{ animationDelay: '90ms' }}
            >
              {t('A premium traffic desk for AI model routing')}
            </h1>

            <p
              className='landing-animate-fade-up mt-6 max-w-xl text-[1.02rem] leading-7 text-slate-600 opacity-0 dark:text-slate-300 md:text-[1.08rem]'
              style={{ animationDelay: '170ms' }}
            >
              {systemName}{' '}
              {t(
                'turns AI providers into managed inventory. Present one stable API edge to apps, then route requests across the market with budgets, telemetry, and policy already attached.'
              )}
            </p>

            <div
              className='landing-animate-fade-up mt-8 flex flex-wrap items-center gap-3 opacity-0'
              style={{ animationDelay: '260ms' }}
            >
              {props.isAuthenticated ? (
                <Button
                  className='group h-11 rounded-full bg-slate-950 px-5 text-white shadow-[0_24px_48px_-28px_rgba(15,23,42,0.55)] transition-transform hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white'
                  render={<Link to='/dashboard' />}
                >
                  {t('Go to Dashboard')}
                  <ArrowRight className='ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
              ) : (
                <>
                  <Button
                    className='group h-11 rounded-full bg-slate-950 px-5 text-white shadow-[0_24px_48px_-28px_rgba(15,23,42,0.55)] transition-transform hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white'
                    render={<Link to='/sign-up' />}
                  >
                    {t('Open the gateway')}
                    <ArrowRight className='ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                  </Button>
                  <Button
                    variant='outline'
                    className='h-11 rounded-full border-slate-300/90 bg-white/70 px-5 text-slate-700 shadow-[0_20px_45px_-34px_rgba(15,23,42,0.35)] hover:border-slate-400 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-100 dark:hover:bg-white/[0.06]'
                    render={<Link to='/pricing' />}
                  >
                    {t('View pricing')}
                  </Button>
                </>
              )}
            </div>

            <div
              className='landing-animate-fade-up mt-10 grid gap-4 opacity-0 md:grid-cols-[1.2fr_0.8fr]'
              style={{ animationDelay: '340ms' }}
            >
              <div className='rounded-[1.6rem] border border-slate-200/80 bg-white/82 p-4 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)] backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.03]'>
                <div className='flex items-center gap-2 text-[0.72rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400'>
                  <Shield className='size-3.5 text-amber-600 dark:text-amber-300' />
                  {t('Control plane signals')}
                </div>
                <div className='mt-4 space-y-3'>
                  {signalItems.map((item) => (
                    <div
                      key={item.label}
                      className='rounded-2xl border border-slate-200/70 bg-slate-50/86 px-3.5 py-3 dark:border-white/10 dark:bg-white/[0.03]'
                    >
                      <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                        {item.label}
                      </p>
                      <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='rounded-[1.6rem] border border-slate-200/80 bg-slate-950 p-4 text-slate-100 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.6)] dark:border-white/10'>
                <div className='flex items-center justify-between'>
                  <p className='text-[0.72rem] font-semibold tracking-[0.2em] text-slate-400 uppercase'>
                    {t('Mission notes')}
                  </p>
                  <span className='rounded-full border border-white/10 px-2 py-1 text-[0.62rem] tracking-[0.18em] text-cyan-300 uppercase'>
                    {t('public edge')}
                  </span>
                </div>
                <div className='mt-4 space-y-3 text-sm leading-6 text-slate-300'>
                  <p>{t('One endpoint in. Many suppliers behind it.')}</p>
                  <p>
                    {t(
                      'Treat model access like inventory management, not a pile of environment variables.'
                    )}
                  </p>
                  <div className='mt-5 space-y-2'>
                    {[t('Stable app contract'), t('Configurable supplier lanes'), t('Operator-grade visibility')].map(
                      (item) => (
                        <div key={item} className='flex items-center gap-2'>
                          <Dot className='size-5 text-amber-300' />
                          <span>{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className='landing-animate-fade-up opacity-0 xl:justify-self-end'
            style={{ animationDelay: '420ms' }}
          >
            <HeroTerminalDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
