import { type ReactNode } from 'react'
import {
  Activity,
  ArrowUpRight,
  Coins,
  ShieldCheck,
  Waypoints,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimateInView } from '@/components/animate-in-view'
import { getFeaturePanels } from '../../constants'

interface FeaturesProps {
  className?: string
}

const PANEL_ACCENTS = {
  cyan: {
    line: 'bg-cyan-500',
    chip: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    glow: 'from-cyan-500/14 to-transparent',
    icon: <Waypoints className='size-4' strokeWidth={1.7} />,
  },
  amber: {
    line: 'bg-amber-500',
    chip:
      'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    glow: 'from-amber-500/14 to-transparent',
    icon: <ShieldCheck className='size-4' strokeWidth={1.7} />,
  },
  slate: {
    line: 'bg-slate-500',
    chip:
      'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300',
    glow: 'from-slate-500/14 to-transparent',
    icon: <Activity className='size-4' strokeWidth={1.7} />,
  },
} as const

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()
  const panels = getFeaturePanels(t)

  return (
    <section className='relative px-6 py-24 md:py-28'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid gap-10 xl:grid-cols-[0.4fr_0.6fr] xl:items-start'>
          <AnimateInView className='max-w-md' animation='fade-up'>
            <p className='text-[0.72rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-slate-400'>
              {t('Control surfaces')}
            </p>
            <h2 className='mt-4 text-3xl leading-tight font-semibold tracking-[-0.05em] text-slate-950 dark:text-slate-50 md:text-[3rem]'>
              {t('Routing, pricing, and governance in one product surface')}
            </h2>
            <p className='mt-5 text-base leading-7 text-slate-600 dark:text-slate-400'>
              {t(
                'This homepage is about productized infrastructure. The gateway should feel more like a mission desk for AI traffic than a chat app startup site.'
              )}
            </p>

            <div className='mt-8 space-y-3 rounded-[1.6rem] border border-slate-200/80 bg-white/82 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'>
              <SignalRow
                icon={<Coins className='size-4' strokeWidth={1.7} />}
                title={t('Commercial logic')}
                description={t(
                  'Normalize vendor pricing and turn route choice into an economic decision, not a guess.'
                )}
              />
              <SignalRow
                icon={<ShieldCheck className='size-4' strokeWidth={1.7} />}
                title={t('Governance')}
                description={t(
                  'Add approvals, permissions, and tenant limits at the gateway rather than scattering them downstream.'
                )}
              />
              <SignalRow
                icon={<ArrowUpRight className='size-4' strokeWidth={1.7} />}
                title={t('Operational agility')}
                description={t(
                  'Swap vendors, shift traffic, and react to outages without forcing application rewrites.'
                )}
              />
            </div>
          </AnimateInView>

          <div className='grid gap-4 md:grid-cols-2'>
            {panels.map((panel, index) => {
              const accent = PANEL_ACCENTS[panel.accent]
              return (
                <AnimateInView
                  key={panel.id}
                  delay={index * 90}
                  animation='scale-in'
                  className='group relative overflow-hidden rounded-[1.8rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,250,252,0.96))] p-5 shadow-[0_28px_70px_-46px_rgba(15,23,42,0.3)] transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))]'
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b ${accent.glow} opacity-80`}
                  />
                  <div className='relative'>
                    <div className='flex items-center justify-between gap-3'>
                      <div className='flex items-center gap-3'>
                        <div className='flex size-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/86 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200'>
                          {accent.icon}
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-semibold tracking-[0.18em] uppercase ${accent.chip}`}
                        >
                          {panel.eyebrow}
                        </span>
                      </div>
                      <div className={`h-8 w-1 rounded-full ${accent.line}`} />
                    </div>

                    <h3 className='mt-6 max-w-[16ch] text-xl leading-tight font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-50'>
                      {panel.title}
                    </h3>
                    <p className='mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400'>
                      {panel.description}
                    </p>

                    <div className='mt-6 space-y-2.5'>
                      {panel.bullets.map((bullet, bulletIndex) => (
                        <div
                          key={bullet}
                          className='grid grid-cols-[auto_1fr] items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/74 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.03]'
                        >
                          <span
                            className={`mt-1 size-2 rounded-full ${
                              bulletIndex % 2 === 0 ? accent.line : 'bg-slate-400'
                            }`}
                          />
                          <span className='text-sm leading-6 text-slate-700 dark:text-slate-300'>
                            {bullet}
                          </span>
                        </div>
                      ))}
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

function SignalRow(props: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className='grid grid-cols-[auto_1fr] items-start gap-3 rounded-[1.1rem] border border-slate-200/70 bg-slate-50/86 px-3.5 py-3 dark:border-white/10 dark:bg-white/[0.03]'>
      <div className='mt-0.5 flex size-8 items-center justify-center rounded-full border border-slate-200/80 bg-white/85 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200'>
        {props.icon}
      </div>
      <div>
        <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
          {props.title}
        </p>
        <p className='mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400'>
          {props.description}
        </p>
      </div>
    </div>
  )
}
