import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AnimateInView } from '@/components/animate-in-view'
import { getCTAPoints } from '../../constants'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()
  const points = getCTAPoints(t)

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='relative overflow-hidden px-6 py-24 md:py-28'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          background: [
            'radial-gradient(circle at 18% 30%, oklch(0.94 0.05 215 / 0.95) 0, transparent 30%)',
            'radial-gradient(circle at 82% 58%, oklch(0.95 0.05 80 / 0.9) 0, transparent 28%)',
          ].join(','),
        }}
      />

      <AnimateInView
        className='relative mx-auto max-w-6xl overflow-hidden rounded-[2.2rem] border border-slate-200/80 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,248,251,0.98))] shadow-[0_40px_90px_-56px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.025))]'
        animation='scale-in'
      >
        <div
          aria-hidden
          className='absolute inset-y-0 right-0 hidden w-[44%] bg-[linear-gradient(180deg,rgba(6,182,212,0.08),transparent_45%,rgba(245,158,11,0.08))] md:block'
        />
        <div className='relative grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-9 xl:p-11'>
          <div className='max-w-2xl'>
            <p className='text-[0.72rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400'>
              {t('Launch your edge')}
            </p>
            <h2 className='mt-4 text-3xl leading-tight font-semibold tracking-[-0.05em] text-slate-950 dark:text-slate-50 md:text-[3.1rem]'>
              {t('Turn scattered provider access into one governed product surface')}
            </h2>
            <p className='mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-400'>
              {t(
                'Stand up a cleaner public edge for every AI app you run. Keep the supplier market flexible underneath while your teams see one contract, one dashboard, and one place to control spend.'
              )}
            </p>

            <div className='mt-8 flex flex-wrap items-center gap-3'>
              <Button
                className='group h-11 rounded-full bg-slate-950 px-5 text-white shadow-[0_24px_50px_-30px_rgba(15,23,42,0.55)] hover:bg-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white'
                render={<Link to='/sign-up' />}
              >
                {t('Get started')}
                <ArrowRight className='ml-1 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
              <Button
                variant='outline'
                className='h-11 rounded-full border-slate-300/90 bg-white/72 px-5 text-slate-700 hover:border-slate-400 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-100 dark:hover:bg-white/[0.06]'
                render={<Link to='/pricing' />}
              >
                {t('See pricing')}
              </Button>
            </div>
          </div>

          <div className='grid content-start gap-3'>
            {points.map((point, index) => (
              <div
                key={point}
                className='rounded-[1.25rem] border border-slate-200/80 bg-white/84 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]'
              >
                <div className='grid grid-cols-[auto_1fr] items-center gap-3'>
                  <div
                    className={`size-2.5 rounded-full ${
                      index % 2 === 0 ? 'bg-cyan-500' : 'bg-amber-500'
                    }`}
                  />
                  <p className='text-sm leading-6 font-medium text-slate-800 dark:text-slate-200'>
                    {point}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateInView>
    </section>
  )
}
