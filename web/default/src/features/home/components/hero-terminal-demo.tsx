import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Activity, ArrowRightLeft, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  AI_APPLICATIONS,
  AI_MODELS,
  getGatewayFeatures,
  getMarketSegments,
} from '../constants'

const ROUTES = [
  {
    id: 'chat',
    lane: 'CHAT / DEFAULT',
    source: 'Apps',
    model: 'Claude 3.7 Sonnet',
    provider: 'Anthropic via Gateway',
    latency: '184 ms',
    cost: '$0.0021',
    status: 'Healthy',
    accent: 'cyan',
  },
  {
    id: 'reasoning',
    lane: 'REASONING / PREMIUM',
    source: 'Agents',
    model: 'GPT-4.1',
    provider: 'OpenAI direct lane',
    latency: '228 ms',
    cost: '$0.0049',
    status: 'Budget watched',
    accent: 'amber',
  },
  {
    id: 'fallback',
    lane: 'FALLBACK / VALUE',
    source: 'Batch',
    model: 'Gemini 2.5 Flash',
    provider: 'Vertex mirrored route',
    latency: '112 ms',
    cost: '$0.0014',
    status: 'Ready',
    accent: 'slate',
  },
] as const

const ROUTE_ACCENTS = {
  cyan: {
    dot: 'bg-cyan-500',
    badge:
      'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    border: 'border-cyan-500/18',
    glow: 'from-cyan-500/16 via-cyan-500/5 to-transparent',
  },
  amber: {
    dot: 'bg-amber-500',
    badge:
      'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    border: 'border-amber-500/18',
    glow: 'from-amber-500/16 via-amber-500/5 to-transparent',
  },
  slate: {
    dot: 'bg-slate-500',
    badge:
      'border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300',
    border: 'border-slate-500/18',
    glow: 'from-slate-500/16 via-slate-500/5 to-transparent',
  },
} as const

export function HeroTerminalDemo() {
  const { t } = useTranslation()
  const [activeRoute, setActiveRoute] = useState(0)
  const gatewayFeatures = getGatewayFeatures(t).slice(0, 6)
  const segments = getMarketSegments(t)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return

    const interval = window.setInterval(() => {
      setActiveRoute((current) => (current + 1) % ROUTES.length)
    }, 3600)

    return () => window.clearInterval(interval)
  }, [])

  const route = ROUTES[activeRoute]
  const accent = ROUTE_ACCENTS[route.accent]
  const coverage = useMemo(
    () => [
      { label: t('Input Surfaces'), value: t('SDKs · Agents · Apps') },
      { label: t('Policies'), value: t('Budgets · Limits · Fallbacks') },
      { label: t('Operators'), value: t('Logs · Usage · Tenant Controls') },
    ],
    [t]
  )

  return (
    <div className='relative mx-auto w-full max-w-[44rem]'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-12 top-8 h-40 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.88_0.06_215_/_0.85),transparent_70%)] blur-3xl'
      />
      <div className='relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,250,252,0.98))] shadow-[0_36px_90px_-48px_rgba(15,23,42,0.45)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(13,18,24,0.95),rgba(9,14,20,0.96))]'>
        <div className='border-b border-slate-200/80 px-5 py-4 dark:border-white/10'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div>
              <p className='text-[0.68rem] font-semibold tracking-[0.24em] text-slate-500 uppercase dark:text-slate-400'>
                {t('Signal Grid')}
              </p>
              <h3 className='mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50'>
                {t('Gateway traffic board')}
              </h3>
            </div>
            <div className='flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-3 py-1.5 text-[0.68rem] font-medium tracking-[0.18em] text-slate-600 uppercase shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300'>
              <span className='size-2 rounded-full bg-emerald-500' />
              {t('Live routing')}
            </div>
          </div>
        </div>

        <div className='grid gap-0 xl:grid-cols-[1.1fr_0.9fr]'>
          <div className='border-b border-slate-200/70 p-5 dark:border-white/10 xl:border-r xl:border-b-0'>
            <div className='grid gap-4 sm:grid-cols-[0.92fr_1.08fr]'>
              <SignalColumn
                title={t('Demand')}
                subtitle={t('Application inputs')}
                items={AI_APPLICATIONS.map((item) => t(item))}
                labelClassName='text-cyan-700 dark:text-cyan-300'
              />
              <SignalColumn
                title={t('Supply')}
                subtitle={t('Available routes')}
                items={AI_MODELS.map((item) => t(item))}
                labelClassName='text-amber-700 dark:text-amber-300'
              />
            </div>

            <div className='relative my-5 overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-slate-950 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:border-white/10'>
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${accent.glow}`}
              />
              <div className='relative flex items-center justify-between gap-3'>
                <div>
                  <p className='text-[0.68rem] font-semibold tracking-[0.22em] text-slate-400 uppercase'>
                    {route.lane}
                  </p>
                  <div className='mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-200'>
                    <span>{route.source}</span>
                    <span className='text-slate-600'>/</span>
                    <span>{route.model}</span>
                    <span className='text-slate-600'>/</span>
                    <span className='text-slate-400'>{route.provider}</span>
                  </div>
                </div>
                <div
                  className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase ${accent.badge}`}
                >
                  {t(route.status)}
                </div>
              </div>

              <div className='relative mt-5 grid gap-3 sm:grid-cols-[0.86fr_0.28fr_0.86fr] sm:items-center'>
                <TrafficBox
                  title={t('Ingress')}
                  value={t('OpenAI-compatible')}
                  detail={t('Apps keep one endpoint')}
                  accent='cyan'
                />
                <div className='flex items-center justify-center py-1'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]'>
                    <ArrowRightLeft className='size-5' strokeWidth={1.5} />
                  </div>
                </div>
                <TrafficBox
                  title={t('Dispatch')}
                  value={t('Policy-selected lane')}
                  detail={t('Budget, latency, and fallback aware')}
                  accent='amber'
                />

                <Connector accent={accent.dot} />

                <div className='rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3 sm:col-span-2'>
                  <div className='flex flex-wrap items-center gap-3 text-[0.72rem] uppercase'>
                    <span className='font-semibold tracking-[0.22em] text-slate-400'>
                      {t('Active policy chain')}
                    </span>
                    <span className='rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-cyan-300'>
                      {t('Quota check')}
                    </span>
                    <span className='rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-amber-300'>
                      {t('Cost ceiling')}
                    </span>
                    <span className='rounded-full border border-slate-500/20 bg-slate-500/10 px-2 py-0.5 text-slate-300'>
                      {t('Fallback ready')}
                    </span>
                  </div>
                </div>
              </div>

              <div className='mt-5 grid gap-3 sm:grid-cols-3'>
                <MetricTile label={t('Latency')} value={route.latency} />
                <MetricTile label={t('Effective cost')} value={route.cost} />
                <MetricTile label={t('SSE support')} value={t('On')} />
              </div>
            </div>

            <div className='grid gap-2 sm:grid-cols-3'>
              {coverage.map((item) => (
                <div
                  key={item.label}
                  className='rounded-[1.1rem] border border-slate-200/80 bg-white/80 px-3.5 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'
                >
                  <p className='text-[0.68rem] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
                    {item.label}
                  </p>
                  <p className='mt-2 text-sm font-medium text-slate-900 dark:text-slate-100'>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='p-5'>
            <div className='rounded-[1.4rem] border border-slate-200/80 bg-white/88 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <p className='text-[0.68rem] font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400'>
                    {t('Marketplace coverage')}
                  </p>
                  <h4 className='mt-2 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                    {t('Compute supermarket by capability')}
                  </h4>
                </div>
                <Activity className='mt-0.5 size-4 text-cyan-600 dark:text-cyan-300' />
              </div>

              <div className='mt-4 flex flex-wrap gap-2'>
                {segments.map((segment, index) => (
                  <span
                    key={segment}
                    className='rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[0.7rem] font-medium tracking-[0.14em] text-slate-600 uppercase dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300'
                    style={{ opacity: 1 - index * 0.05 }}
                  >
                    {segment}
                  </span>
                ))}
              </div>

              <div className='mt-5 space-y-3'>
                {gatewayFeatures.map((feature, index) => (
                  <div
                    key={feature}
                    className='grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.02]'
                  >
                    <div
                      className={`size-2.5 rounded-full ${index % 2 === 0 ? 'bg-cyan-500' : 'bg-amber-500'}`}
                    />
                    <span className='text-sm font-medium text-slate-800 dark:text-slate-100'>
                      {feature}
                    </span>
                    <span className='text-[0.68rem] font-semibold tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400'>
                      {t('Active')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-1'>
              <MiniPanel
                icon={<ShieldCheck className='size-4' strokeWidth={1.7} />}
                title={t('Governed edge')}
                description={t(
                  'Budgets, rate limits, and user policies stay attached to the route instead of drifting into app code.'
                )}
              />
              <MiniPanel
                icon={<Activity className='size-4' strokeWidth={1.7} />}
                title={t('Operator visibility')}
                description={t(
                  'Every request carries enough signal for support, finance, and platform teams to reason about spend and health.'
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SignalColumn(props: {
  title: string
  subtitle: string
  items: readonly string[]
  labelClassName: string
}) {
  return (
    <div className='rounded-[1.3rem] border border-slate-200/80 bg-white/88 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'>
      <p className='text-[0.68rem] font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400'>
        {props.title}
      </p>
      <p className='mt-1 text-xs text-slate-500 dark:text-slate-400'>
        {props.subtitle}
      </p>
      <div className='mt-4 space-y-2.5'>
        {props.items.map((item, index) => (
          <div
            key={item}
            className='flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/85 px-3 py-2.5 dark:border-white/10 dark:bg-white/[0.02]'
            style={{ opacity: 1 - index * 0.06 }}
          >
            <span className='text-sm font-medium text-slate-800 dark:text-slate-100'>
              {item}
            </span>
            <span
              className={`text-[0.65rem] font-semibold tracking-[0.18em] uppercase ${props.labelClassName}`}
            >
              {index < 2 ? 'hot' : 'ready'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrafficBox(props: {
  title: string
  value: string
  detail: string
  accent: 'cyan' | 'amber'
}) {
  return (
    <div className='rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-4 py-3'>
      <p className='text-[0.66rem] font-semibold tracking-[0.18em] text-slate-400 uppercase'>
        {props.title}
      </p>
      <p
        className={`mt-2 text-sm font-semibold ${
          props.accent === 'cyan' ? 'text-cyan-300' : 'text-amber-300'
        }`}
      >
        {props.value}
      </p>
      <p className='mt-1 text-xs leading-relaxed text-slate-400'>
        {props.detail}
      </p>
    </div>
  )
}

function Connector(props: { accent: string }) {
  return (
    <div className='flex justify-center py-1 sm:col-span-1 sm:row-start-2'>
      <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]'>
        <div className={`size-2.5 rounded-full ${props.accent}`} />
      </div>
    </div>
  )
}

function MetricTile(props: { label: string; value: string }) {
  return (
    <div className='rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-2.5'>
      <p className='text-[0.65rem] font-semibold tracking-[0.18em] text-slate-400 uppercase'>
        {props.label}
      </p>
      <p className='mt-1.5 text-sm font-medium text-slate-100'>{props.value}</p>
    </div>
  )
}

function MiniPanel(props: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className='rounded-[1.3rem] border border-slate-200/80 bg-white/88 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03]'>
      <div className='flex size-9 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200'>
        {props.icon}
      </div>
      <h4 className='mt-4 text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
        {props.title}
      </h4>
      <p className='mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>
        {props.description}
      </p>
    </div>
  )
}
