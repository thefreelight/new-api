import { ArrowRight, Cable, Radar, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'
import { getWorkflowSteps } from '../../constants'

const STEP_ICONS = [Cable, SlidersHorizontal, Radar] as const

export function HowItWorks() {
  const { t } = useTranslation()
  const steps = getWorkflowSteps(t)

  return (
    <section className='border-t border-slate-200/80 px-6 py-24 dark:border-white/10 md:py-28'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid gap-10 xl:grid-cols-[0.42fr_0.58fr] xl:items-start'>
          <AnimateInView className='max-w-md' animation='fade-up'>
            <p className='text-[0.72rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400'>
              {t('Traffic workflow')}
            </p>
            <h2 className='mt-4 text-3xl leading-tight font-semibold tracking-[-0.05em] text-slate-950 dark:text-slate-50 md:text-[3rem]'>
              {t('From raw supplier keys to a governed AI edge')}
            </h2>
            <p className='mt-5 text-base leading-7 text-slate-600 dark:text-slate-400'>
              {t(
                'The gateway should read like operational infrastructure: supply comes in, policy is applied, and live traffic stays observable.'
              )}
            </p>
          </AnimateInView>

          <div className='space-y-4'>
            {steps.map((step, index) => {
              const Icon = STEP_ICONS[index]
              return (
                <AnimateInView
                  key={step.number}
                  delay={index * 110}
                  animation='fade-up'
                  className='group rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,248,251,0.98))] p-5 shadow-[0_28px_65px_-48px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))]'
                >
                  <div className='grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-start'>
                    <div className='flex items-center gap-4'>
                      <div className='flex size-12 items-center justify-center rounded-full border border-slate-200/80 bg-white/88 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200'>
                        <Icon className='size-5' strokeWidth={1.7} />
                      </div>
                      <div className='rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[0.72rem] font-semibold tracking-[0.18em] text-slate-600 uppercase dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300'>
                        {step.number}
                      </div>
                    </div>

                    <div>
                      <h3 className='text-xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-50'>
                        {step.title}
                      </h3>
                      <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400'>
                        {step.description}
                      </p>
                      <div className='mt-4 rounded-[1.15rem] border border-slate-200/70 bg-white/78 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300'>
                        {step.outcome}
                      </div>
                    </div>

                    <div className='hidden items-center md:flex'>
                      <ArrowRight className='size-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1' />
                    </div>
                  </div>
                </AnimateInView>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
