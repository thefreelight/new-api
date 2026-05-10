import { useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'
import { getDefaultStats } from '../../constants'

interface CounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  decimals?: number
}

function Counter(props: CounterProps) {
  const { end, suffix = '', prefix = '', duration = 1600, decimals = 0 } = props
  const ref = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)

  const formatValue = useCallback(
    (value: number) =>
      decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString(),
    [decimals]
  )

  const animate = useCallback(() => {
    const el = ref.current
    if (!el) return
    const start = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      el.textContent = `${prefix}${formatValue(eased * end)}${suffix}`
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [duration, end, formatValue, prefix, suffix])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      el.textContent = `${prefix}${formatValue(end)}${suffix}`
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          animate()
          observer.unobserve(el)
        }
      },
      { threshold: 0.45 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animate, end, formatValue, prefix, suffix])

  return (
    <span ref={ref} className='tabular-nums'>
      {prefix}0{suffix}
    </span>
  )
}

interface StatsProps {
  className?: string
}

export function Stats(_props: StatsProps) {
  const { t } = useTranslation()
  const stats = getDefaultStats(t)

  return (
    <section className='relative px-6 py-8 md:py-10'>
      <div className='mx-auto max-w-7xl'>
        <div className='rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,248,251,0.96))] p-5 shadow-[0_30px_75px_-48px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02))] md:p-7'>
          <div className='flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
            <AnimateInView className='max-w-xl' animation='fade-up'>
              <p className='text-[0.72rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400'>
                {t('Gateway footprint')}
              </p>
              <h2 className='mt-3 text-2xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-50 md:text-[2.2rem]'>
                {t('A broad supplier market with an operator-grade edge')}
              </h2>
            </AnimateInView>
            <AnimateInView
              className='max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-400'
              animation='fade-left'
              delay={80}
            >
              {t(
                'The value proposition is not just connectivity. It is unified control over inventory, traffic, and spend.'
              )}
            </AnimateInView>
          </div>

          <div className='mt-8 grid gap-3 lg:grid-cols-4'>
            {stats.map((stat, index) => (
              <AnimateInView
                key={stat.description}
                delay={index * 90}
                animation='fade-up'
                className='rounded-[1.45rem] border border-slate-200/80 bg-white/84 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <div className='text-[2rem] leading-none font-semibold tracking-[-0.05em] text-slate-950 dark:text-slate-50 md:text-[2.5rem]'>
                      <Counter
                        end={Number(stat.value)}
                        suffix={stat.suffix}
                        decimals={0}
                      />
                    </div>
                    <p className='mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100'>
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`mt-1 size-2.5 rounded-full ${
                      index % 3 === 0
                        ? 'bg-cyan-500'
                        : index % 3 === 1
                          ? 'bg-amber-500'
                          : 'bg-slate-500'
                    }`}
                  />
                </div>
                <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                  {stat.detail}
                </p>
              </AnimateInView>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
