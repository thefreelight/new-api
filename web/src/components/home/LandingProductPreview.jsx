/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React from 'react';
import { IconCopy, IconSend } from '@douyinfe/semi-icons';
import { Claude, Gemini, Mistral, OpenAI } from '@lobehub/icons';

const requestLines = (endpoint) => [
  `POST ${endpoint}`,
  'Authorization: Bearer sk-live-your-token',
  'Content-Type: application/json',
  '',
  '{',
  '  "model": "claude-3.5-sonnet",',
  '  "messages": [',
  '    {"role": "system", "content": "Route globally."},',
  '    {"role": "user", "content": "Design a launch plan."}',
  '  ],',
  '  "stream": true',
  '}',
];

const decisionLayers = [
  {
    step: '01',
    title: 'Provider policy',
    body: 'Keep client payloads stable while routing to the best-fit upstream for the request.',
    accentClass: 'border-[#8fefff]/18 bg-[#8fefff]/10 text-[#a8f7ff]',
  },
  {
    step: '02',
    title: 'Billing awareness',
    body: 'Tie every request back to customer identity, quota, and spend posture in the same path.',
    accentClass: 'border-[#8cffd0]/18 bg-[#8cffd0]/10 text-[#b8ffe1]',
  },
  {
    step: '03',
    title: 'Failover choreography',
    body: 'Warm secondary lanes ahead of time so incidents degrade into reroutes instead of downtime.',
    accentClass: 'border-[#f2bcff]/18 bg-[#f2bcff]/10 text-[#ffd8ff]',
  },
];

const routeSignals = [
  {
    region: 'North America',
    provider: 'OpenAI priority lane',
    posture: 'Primary reasoning traffic',
    latency: '312 ms',
  },
  {
    region: 'Europe',
    provider: 'Azure AI -> Mistral handoff',
    posture: 'Policy-sensitive workloads',
    latency: '428 ms',
  },
  {
    region: 'Asia-Pacific',
    provider: 'Qwen -> Gemini burst lane',
    posture: 'Elastic multilingual demand',
    latency: '356 ms',
  },
];

const recentRoutes = [
  ['/v1/chat/completions', 'claude-3.5-sonnet', 'Priority'],
  ['/v1/embeddings', 'text-embedding-3-large', 'Vector'],
  ['/v1/messages', 'gpt-4o', 'Failover'],
  ['/v1/images/generations', 'dall-e-3', 'Media'],
];

const modelLibrary = [
  {
    name: 'GPT-4o',
    vendor: 'OpenAI',
    Icon: OpenAI,
    meta: ['Vision', 'Realtime'],
  },
  {
    name: 'Claude 3.5 Sonnet',
    vendor: 'Anthropic',
    Icon: Claude.Color,
    meta: ['Reasoning', '200K'],
  },
  {
    name: 'Gemini 1.5 Pro',
    vendor: 'Google',
    Icon: Gemini.Color,
    meta: ['1M context', 'Search'],
  },
  {
    name: 'Mistral Large 2',
    vendor: 'Mistral AI',
    Icon: Mistral.Color,
    meta: ['EU route', '128K'],
  },
];

const healthChecks = [
  ['Control plane', 'Stable'],
  ['Quota ledger', 'Watching spend'],
  ['Failover fabric', 'Warm'],
];

const LandingProductPreview = ({ serverAddress }) => {
  const baseUrl = (serverAddress || 'https://api.navtoai.com').replace(
    /\/$/,
    '',
  );
  const endpoint = `${baseUrl}/v1/chat/completions`;

  return (
    <section
      id='routing-preview'
      className='mx-auto w-full max-w-[1380px] px-5 pb-3 pt-8 sm:px-8 lg:px-10'
    >
      <div className='flex flex-col gap-4 px-1 pb-6 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='text-[11px] uppercase tracking-[0.32em] text-[#a0f6ff]'>
            Routing preview
          </p>
          <h2 className='mt-3 max-w-[780px] text-[34px] font-semibold tracking-[-0.04em] text-white sm:text-[44px]'>
            Familiar from the outside. Deliberate, policy-aware, and cinematic
            underneath.
          </h2>
        </div>
        <p className='max-w-[470px] text-sm leading-7 text-[#a7bacd] sm:text-base'>
          The relay should read like a control surface, not a gallery of equal
          widgets. One request comes in, then routing, billing, and resilience
          decisions layer in behind it.
        </p>
      </div>

      <div className='relative overflow-hidden rounded-[32px] border border-white/10 bg-[#030711] shadow-[0_30px_120px_rgba(0,0,0,0.46)]'>
        <div
          className='absolute inset-0 opacity-84'
          style={{
            backgroundImage:
              'radial-gradient(circle at top left, rgba(69, 232, 255, 0.18), transparent 26%), radial-gradient(circle at 82% 18%, rgba(203, 132, 255, 0.16), transparent 24%), linear-gradient(180deg, rgba(10,18,32,0.96) 0%, rgba(4,8,14,0.98) 100%)',
          }}
        />
        <div
          className='absolute inset-0 opacity-[0.12]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        <div className='relative grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-6'>
          <article className='overflow-hidden rounded-[28px] border border-white/10 bg-[#06111d]/90 shadow-[0_18px_48px_rgba(0,0,0,0.28)]'>
            <div className='flex flex-col gap-4 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5'>
              <div className='flex min-w-0 items-center gap-3'>
                <span className='font-mono text-xl leading-none text-[#8fefff]'>
                  &gt;_
                </span>
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-white'>
                    OpenAI-compatible ingress
                  </p>
                  <p className='truncate text-xs text-white/45'>
                    Ask for one API shape and let the relay handle the rest.
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span className='hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55 sm:inline-flex'>
                  ⌘ K
                </span>
                <span
                  className='inline-flex h-10 items-center gap-2 rounded-full border border-[#8aefff]/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(153,241,255,0.92))] px-4 text-sm font-semibold text-[#04111d]'
                  aria-hidden='true'
                >
                  Dispatch <IconSend size='small' />
                </span>
              </div>
            </div>

            <div className='grid gap-4 border-b border-white/10 p-4 lg:grid-cols-[minmax(0,1.08fr)_260px] lg:p-5'>
              <div className='rounded-[22px] border border-white/10 bg-[#050a13] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-[11px] uppercase tracking-[0.28em] text-white/38'>
                      Request path
                    </p>
                    <p className='mt-2 text-sm text-[#a9bfd4]'>{endpoint}</p>
                  </div>
                  <span
                    className='inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs text-white/58'
                    aria-hidden='true'
                  >
                    Copy cURL <IconCopy size='small' />
                  </span>
                </div>
                <pre className='mt-5 overflow-x-auto rounded-[20px] border border-[#8fefff]/12 bg-[#07101b] p-4 text-[13px] leading-7 text-[#afe8ff]'>
                  {requestLines(endpoint)
                    .map((line) => `${line}\n`)
                    .join('')}
                </pre>
                <div className='mt-4 flex flex-col gap-2 text-sm text-[#c7d7e4] sm:flex-row sm:items-center sm:justify-between'>
                  <p>One endpoint, many provider-aware exits.</p>
                  <span className='inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#9ee8ff]'>
                    stream-ready relay
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <div>
                  <p className='text-[11px] uppercase tracking-[0.28em] text-white/38'>
                    Decision stack
                  </p>
                  <p className='mt-2 text-sm leading-6 text-[#a7bbcf]'>
                    The relay makes a few critical calls in sequence instead of
                    treating every request as a flat passthrough.
                  </p>
                </div>
                <div className='space-y-3'>
                  {decisionLayers.map(({ step, title, body, accentClass }) => (
                    <article
                      key={title}
                      className='rounded-[20px] border border-white/10 bg-[#08131d]/92 p-4'
                    >
                      <div className='flex items-start gap-3'>
                        <span
                          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[11px] font-semibold uppercase tracking-[0.2em] ${accentClass}`}
                        >
                          {step}
                        </span>
                        <div>
                          <p className='text-sm font-medium text-white'>
                            {title}
                          </p>
                          <p className='mt-2 text-xs leading-6 text-[#9fb5c9]'>
                            {body}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <div className='grid gap-4 p-4 lg:grid-cols-[0.98fr_1.02fr] lg:p-5'>
              <article className='rounded-[22px] border border-white/10 bg-white/[0.04] p-4'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-[11px] uppercase tracking-[0.28em] text-white/38'>
                      Recent routes
                    </p>
                    <h3 className='mt-2 text-xl font-semibold tracking-[-0.03em] text-white'>
                      Live request queue
                    </h3>
                  </div>
                  <span className='text-xs uppercase tracking-[0.22em] text-white/42'>
                    traffic now
                  </span>
                </div>
                <div className='mt-4 divide-y divide-white/8 text-sm'>
                  {recentRoutes.map(([route, model, tag]) => (
                    <div
                      key={`${route}-${model}`}
                      className='grid grid-cols-[1fr_auto] gap-4 py-3 first:pt-0 last:pb-0'
                    >
                      <div className='min-w-0'>
                        <p className='truncate font-medium text-white'>
                          {route}
                        </p>
                        <p className='mt-1 truncate text-xs text-white/42'>
                          {model}
                        </p>
                      </div>
                      <span className='inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#a8f2ff]'>
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className='rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,17,29,0.94),rgba(4,8,14,0.98))] p-4'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <p className='text-[11px] uppercase tracking-[0.28em] text-white/38'>
                      Usage pulse
                    </p>
                    <h3 className='mt-2 text-xl font-semibold tracking-[-0.03em] text-white'>
                      Readable signal, not decorative noise.
                    </h3>
                  </div>
                  <span className='rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/48'>
                    24h view
                  </span>
                </div>
                <svg
                  className='mt-5 h-24 w-full text-[#8ef7ff]'
                  viewBox='0 0 320 120'
                  fill='none'
                  role='img'
                  aria-label='Usage pulse'
                >
                  {[0, 1, 2, 3].map((line) => (
                    <path
                      key={line}
                      d={`M8 ${24 + line * 24}H312`}
                      stroke='rgba(255,255,255,0.12)'
                      strokeDasharray='4 6'
                    />
                  ))}
                  <path
                    d='M10 82C32 70 52 34 80 42C108 50 120 26 146 38C172 50 196 96 228 76C260 56 274 18 310 28'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                  />
                </svg>
                <div className='mt-4 flex flex-wrap gap-5'>
                  <div>
                    <p className='text-xs text-white/42'>Requests</p>
                    <p className='mt-2 text-2xl font-semibold text-white'>
                      2.42M
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-white/42'>Tokens routed</p>
                    <p className='mt-2 text-2xl font-semibold text-white'>
                      18.7B
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-white/42'>Spend posture</p>
                    <p className='mt-2 text-2xl font-semibold text-[#9effd5]'>
                      Guarded
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </article>

          <aside className='relative lg:-translate-y-8 lg:pt-4'>
            <div className='overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,40,0.96),rgba(8,11,19,0.98))] shadow-[0_20px_54px_rgba(0,0,0,0.32)]'>
              <div id='system-status' className='border-b border-white/10 p-4'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <p className='text-[11px] uppercase tracking-[0.28em] text-white/38'>
                      System status
                    </p>
                    <p className='mt-2 text-lg font-semibold text-white'>
                      Gateway layers stay readable at a glance.
                    </p>
                  </div>
                  <span className='rounded-full border border-[#8cffd2]/18 bg-[#8cffd2]/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#afffe0]'>
                    healthy
                  </span>
                </div>
                <div className='mt-4 space-y-3'>
                  {healthChecks.map(([label, value]) => (
                    <div
                      key={label}
                      className='flex items-center justify-between rounded-[18px] border border-white/10 bg-white/[0.04] px-4 py-3'
                    >
                      <span className='text-sm text-[#c2d1df]'>{label}</span>
                      <span className='inline-flex items-center gap-2 text-sm text-[#9ef7cf]'>
                        <span className='h-2 w-2 rounded-full bg-[#76ffbb]' />
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='border-b border-white/10 p-4'>
                <div className='flex items-center justify-between gap-4'>
                  <h3 className='text-lg font-semibold tracking-[-0.03em] text-white'>
                    Global lanes
                  </h3>
                  <span className='text-xs uppercase tracking-[0.22em] text-white/42'>
                    live fabric
                  </span>
                </div>
                <div className='mt-4 space-y-3'>
                  {routeSignals.map(
                    ({ region, provider, posture, latency }) => (
                      <article
                        key={region}
                        className='rounded-[18px] border border-white/10 bg-[#07111c] p-4'
                      >
                        <div className='flex items-center justify-between gap-4'>
                          <span className='text-[11px] uppercase tracking-[0.24em] text-[#8fefff]'>
                            {region}
                          </span>
                          <span className='text-xs text-white/38'>
                            {latency}
                          </span>
                        </div>
                        <p className='mt-3 text-sm font-medium text-white'>
                          {provider}
                        </p>
                        <p className='mt-2 text-xs leading-6 text-[#9cb0c6]'>
                          {posture}
                        </p>
                      </article>
                    ),
                  )}
                </div>
              </div>

              <div className='p-4'>
                <div className='flex items-center justify-between gap-4'>
                  <h3 className='text-lg font-semibold tracking-[-0.03em] text-white'>
                    Model library
                  </h3>
                  <span className='text-xs uppercase tracking-[0.22em] text-white/42'>
                    flagship mix
                  </span>
                </div>
                <div className='mt-4 divide-y divide-white/8'>
                  {modelLibrary.map(({ name, vendor, Icon, meta }) => (
                    <div
                      key={name}
                      className='flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0'
                    >
                      <div className='flex min-w-0 items-center gap-3'>
                        <span className='grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[#07111d]'>
                          <Icon size={26} />
                        </span>
                        <div className='min-w-0'>
                          <p className='truncate text-sm font-semibold text-white'>
                            {name}
                          </p>
                          <p className='truncate text-xs text-white/42'>
                            {vendor}
                          </p>
                        </div>
                      </div>
                      <div className='hidden max-w-[112px] flex-wrap justify-end gap-1 sm:flex'>
                        {meta.map((item) => (
                          <span
                            key={item}
                            className='rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-[#a8bdd1]'
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default LandingProductPreview;
