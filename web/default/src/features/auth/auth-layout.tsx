import type { ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  Fingerprint,
  KeyRound,
  Orbit,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSystemConfig } from '@/hooks/use-system-config'
import { Skeleton } from '@/components/ui/skeleton'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { systemName, logo, loading } = useSystemConfig()
  const scene = getAuthScene(pathname, t)

  return (
    <div className='relative min-h-svh overflow-hidden bg-[#f7f2e8] text-slate-950 dark:bg-[#090b0f] dark:text-white'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-80 dark:opacity-100'
        style={{
          background: [
            'radial-gradient(circle at top left, rgba(214, 163, 83, 0.18), transparent 35%)',
            'radial-gradient(circle at 85% 18%, rgba(116, 140, 168, 0.16), transparent 32%)',
            'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(243,237,226,0.92))',
          ].join(', '),
        }}
      />
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.055)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 mix-blend-multiply dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] dark:opacity-100 dark:mix-blend-normal'
      />
      <div className='relative mx-auto flex min-h-svh w-full max-w-[1440px] flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8'>
        <header className='flex items-center justify-between gap-4 pb-4 sm:pb-6'>
          <Link
            to='/'
            className='flex min-w-0 items-center gap-3 rounded-full border border-slate-900/10 bg-white/70 px-3 py-2 text-sm shadow-[0_12px_30px_-22px_rgba(15,23,42,0.4)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/85 dark:border-white/10 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]'
          >
            <div className='relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(232,221,202,0.95))] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))]'>
              {loading ? (
                <Skeleton className='absolute inset-1 rounded-full' />
              ) : (
                <img
                  src={logo}
                  alt={t('Logo')}
                  className='h-8 w-8 rounded-full object-cover'
                />
              )}
            </div>
            <div className='min-w-0'>
              <p className='text-[0.68rem] font-semibold tracking-[0.32em] text-slate-500 uppercase dark:text-white/45'>
                {t('API Router')}
              </p>
              {loading ? (
                <Skeleton className='mt-1 h-5 w-28' />
              ) : (
                <h1
                  className='truncate text-base font-semibold tracking-[-0.02em] sm:text-lg'
                  style={{
                    fontFamily:
                      '"Public Sans Variable", "Public Sans", ui-sans-serif, system-ui, sans-serif',
                  }}
                >
                  {systemName}
                </h1>
              )}
            </div>
          </Link>

          <div className='hidden items-center gap-2 rounded-full border border-slate-900/10 bg-white/55 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.24em] text-slate-600 uppercase shadow-[0_14px_32px_-26px_rgba(15,23,42,0.45)] backdrop-blur sm:flex dark:border-white/10 dark:bg-white/[0.04] dark:text-white/55'>
            <Sparkles className='h-3.5 w-3.5' />
            {scene.eyebrow}
          </div>
        </header>

        <div className='grid flex-1 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(440px,560px)] lg:gap-6'>
          <aside className='hidden overflow-hidden rounded-[2rem] border border-slate-900/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.82),rgba(242,233,220,0.76))] p-8 shadow-[0_36px_80px_-48px_rgba(15,23,42,0.55)] backdrop-blur-xl lg:flex lg:flex-col lg:justify-between dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]'>
            <div className='space-y-10'>
              <div className='space-y-5'>
                <div className='inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.24em] text-slate-600 uppercase dark:border-white/10 dark:bg-white/[0.04] dark:text-white/55'>
                  <scene.icon className='h-3.5 w-3.5' />
                  {scene.kicker}
                </div>
                <div className='max-w-xl space-y-4'>
                  <h2
                    className='max-w-lg text-[clamp(2.3rem,4vw,4.2rem)] leading-[0.98] font-semibold tracking-[-0.06em] text-balance'
                    style={{
                      fontFamily:
                        '"Public Sans Variable", "Public Sans", ui-sans-serif, system-ui, sans-serif',
                    }}
                  >
                    {scene.title}
                  </h2>
                  <p className='max-w-2xl text-base leading-8 text-slate-600 dark:text-white/68 xl:text-lg'>
                    {scene.description}
                  </p>
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-3'>
                {scene.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className='rounded-[1.5rem] border border-slate-900/10 bg-white/76 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] dark:border-white/10 dark:bg-white/[0.04]'
                  >
                    <p className='text-[1.8rem] leading-none font-semibold tracking-[-0.06em]'>
                      {metric.value}
                    </p>
                    <p className='mt-2 text-xs leading-5 font-medium tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'>
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                {scene.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className='flex items-start gap-3 rounded-[1.35rem] border border-slate-900/10 bg-white/62 px-4 py-4 text-sm leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/10 dark:bg-white/[0.03]'
                  >
                    <div className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-[0_12px_24px_-18px_rgba(15,23,42,0.8)] dark:bg-[#d6a353] dark:text-slate-950'>
                      <ShieldCheck className='h-4 w-4' />
                    </div>
                    <p className='text-slate-700 dark:text-white/72'>
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className='space-y-5 rounded-[1.75rem] border border-slate-900/10 bg-slate-950 px-6 py-5 text-white shadow-[0_28px_60px_-38px_rgba(15,23,42,0.85)] dark:border-white/10 dark:bg-[#12161d]'>
              <div className='flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold tracking-[0.22em] text-white/55 uppercase'>
                <span>{t('Live routing stack')}</span>
                <span className='h-1 w-1 rounded-full bg-emerald-400' />
                <span>{t('Auth hardened')}</span>
              </div>
              <div className='grid gap-3 sm:grid-cols-3'>
                {scene.providers.map((provider) => (
                  <div
                    key={provider}
                    className='rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white/78'
                  >
                    {provider}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className='flex flex-col gap-4'>
            <div className='rounded-[1.75rem] border border-slate-900/10 bg-white/72 p-5 shadow-[0_26px_60px_-42px_rgba(15,23,42,0.5)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] lg:hidden'>
              <div className='flex flex-wrap items-center gap-2 text-[0.68rem] font-semibold tracking-[0.22em] text-slate-500 uppercase dark:text-white/45'>
                <scene.icon className='h-3.5 w-3.5' />
                <span>{scene.eyebrow}</span>
              </div>
              <h2
                className='mt-3 text-[1.9rem] leading-[1.02] font-semibold tracking-[-0.05em] text-balance'
                style={{
                  fontFamily:
                    '"Public Sans Variable", "Public Sans", ui-sans-serif, system-ui, sans-serif',
                }}
              >
                {scene.title}
              </h2>
              <p className='mt-3 text-sm leading-6 text-slate-600 dark:text-white/68'>
                {scene.description}
              </p>
              <div className='mt-4 grid grid-cols-3 gap-2'>
                {scene.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className='rounded-2xl border border-slate-900/10 bg-white/75 px-3 py-3 dark:border-white/10 dark:bg-white/[0.04]'
                  >
                    <p className='text-lg font-semibold tracking-[-0.05em]'>
                      {metric.value}
                    </p>
                    <p className='mt-1 text-[0.62rem] leading-4 font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-white/45'>
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className='flex flex-1 items-center justify-center'>
              <section className='w-full rounded-[2rem] border border-slate-900/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.94),rgba(248,243,235,0.86))] p-6 shadow-[0_36px_90px_-54px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-8 lg:min-h-[720px] lg:p-10 dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))]'>
                <div className='flex h-full flex-col justify-center'>{children}</div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type AuthScene = {
  eyebrow: string
  kicker: string
  title: string
  description: string
  icon: typeof Orbit
  metrics: Array<{ label: string; value: string }>
  highlights: string[]
  providers: string[]
}

function getAuthScene(
  pathname: string,
  t: (key: string) => string
): AuthScene {
  if (pathname.startsWith('/sign-up')) {
    return {
      eyebrow: t('Workspace onboarding'),
      kicker: t('Provisioned access'),
      title: t('Stand up a premium routing workspace in minutes.'),
      description: t(
        'Create your account to activate provider routing, governed quotas, billing controls, and team-ready access from a single API edge.'
      ),
      icon: Workflow,
      metrics: [
        { value: '40+', label: t('providers ready') },
        { value: '1', label: t('unified endpoint') },
        { value: '24/7', label: t('traffic oversight') },
      ],
      highlights: [
        t('Provision credentials, model policies, and rate limits without leaving the same control plane.'),
        t('Bring email verification, OAuth, and passkeys into the same onboarding path when your deployment needs them.'),
        t('Keep billing, usage visibility, and upstream access aligned from the first session.'),
        t('Launch with a shell that feels like infrastructure software, not a generic login screen.'),
      ],
      providers: ['OpenAI', 'Claude', 'Gemini', 'Azure', 'Bedrock', 'OpenRouter'],
    }
  }

  if (pathname.startsWith('/forgot-password')) {
    return {
      eyebrow: t('Credential recovery'),
      kicker: t('Safe fallback'),
      title: t('Recover operator access without losing control of the gateway.'),
      description: t(
        'Reset flows stay clear and deliberate so administrators can restore access quickly while preserving trust in the routing surface.'
      ),
      icon: KeyRound,
      metrics: [
        { value: 'Zero', label: t('logic changes') },
        { value: 'Fast', label: t('operator recovery') },
        { value: 'Scoped', label: t('account actions') },
      ],
      highlights: [
        t('Give operators a direct path back into quota, token, and provider management.'),
        t('Preserve the same calm visual language across recovery, verification, and daily sign-in.'),
        t('Keep every action legible on mobile screens and tightly contained on desktop.'),
        t('Support secure follow-up steps without introducing unnecessary UI noise.'),
      ],
      providers: ['Password reset', 'Email link', 'Audit-friendly'],
    }
  }

  if (pathname.startsWith('/otp')) {
    return {
      eyebrow: t('Verification layer'),
      kicker: t('Second factor'),
      title: t('Verify the operator before traffic, keys, and quotas come into view.'),
      description: t(
        'Two-factor checkpoints protect the same control plane that routes model traffic, manages keys, and exposes billing signals.'
      ),
      icon: Fingerprint,
      metrics: [
        { value: '2FA', label: t('identity check') },
        { value: 'SSE', label: t('stream-ready stack') },
        { value: 'RBAC', label: t('privileged access') },
      ],
      highlights: [
        t('Treat authentication as part of the operational surface, not a disconnected afterthought.'),
        t('Keep the verification step readable, fast, and consistent with the rest of the gateway shell.'),
        t('Reduce friction without flattening the sense of security and control.'),
        t('Maintain accessible forms while giving the auth surface a stronger infrastructure tone.'),
      ],
      providers: ['Passkeys', 'OTP', 'OAuth', 'Email'],
    }
  }

  if (pathname.startsWith('/reset') || pathname.startsWith('/user/reset')) {
    return {
      eyebrow: t('Password issuance'),
      kicker: t('Protected reset'),
      title: t('Rotate credentials with the same precision as your routing policies.'),
      description: t(
        'Fresh credentials should feel deliberate and trustworthy, especially when the account unlocks model access, quotas, and payment controls.'
      ),
      icon: KeyRound,
      metrics: [
        { value: '1', label: t('secure reset flow') },
        { value: '30s', label: t('retry guard') },
        { value: 'Copy', label: t('handoff ready') },
      ],
      highlights: [
        t('Provide a clean reset confirmation stage that feels premium even in edge-case recovery.'),
        t('Keep sensitive values contained, readable, and easy to act on across devices.'),
        t('Retain the same control-plane cues so users never feel dropped into a separate product.'),
        t('Preserve existing reset behavior while strengthening the surrounding visual trust.'),
      ],
      providers: ['Rotation', 'Recovery', 'Clipboard-safe'],
    }
  }

  return {
    eyebrow: t('Operator sign in'),
    kicker: t('Control plane access'),
    title: t('Step back into the API router control plane.'),
    description: t(
      'Authenticate once to manage upstream providers, model routing, quotas, keys, and billing from a single premium workspace.'
    ),
    icon: Orbit,
    metrics: [
      { value: '40+', label: t('upstreams') },
      { value: 'SSE', label: t('stream support') },
      { value: '99.9%', label: t('ops confidence') },
    ],
    highlights: [
      t('Route OpenAI, Claude, Gemini, Azure, Bedrock, and more through one calm operator surface.'),
      t('Bring password, passkey, and OAuth entry points into a single hierarchy that still feels intentional.'),
      t('Review usage, tokens, models, and policies from the same environment immediately after sign-in.'),
      t('Make the first screen feel like part of the platform, not a disconnected utility page.'),
    ],
    providers: ['OpenAI', 'Claude', 'Gemini', 'Azure', 'Bedrock', 'OpenRouter'],
  }
}
