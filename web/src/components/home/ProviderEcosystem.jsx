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
import {
  AzureAI,
  Claude,
  Cohere,
  DeepSeek,
  Gemini,
  Grok,
  Hunyuan,
  Midjourney,
  Minimax,
  Mistral,
  Moonshot,
  OpenAI,
  Perplexity,
  Qwen,
  Spark,
  Suno,
  Volcengine,
  Wenxin,
  XAI,
  Xinference,
} from '@lobehub/icons';

const providerGroups = [
  {
    title: 'Frontier reasoning',
    description:
      'Flagship chat, reasoning, and multimodal surfaces that anchor premium customer experiences.',
    stat: 'Core lanes',
    cardClass:
      'border-[#8fefff]/14 bg-[linear-gradient(180deg,rgba(11,26,42,0.94),rgba(6,11,20,0.94))]',
    badgeClass: 'border-[#8fefff]/18 bg-[#8fefff]/10 text-[#9efcff]',
    providers: [
      { name: 'OpenAI', Icon: OpenAI },
      { name: 'Claude', Icon: Claude.Color },
      { name: 'Gemini', Icon: Gemini.Color },
      { name: 'xAI', Icon: XAI },
      { name: 'Mistral', Icon: Mistral.Color },
      { name: 'Cohere', Icon: Cohere.Color },
    ],
  },
  {
    title: 'Regional powerhouses',
    description:
      'Strong coverage for regional fit, multilingual traffic, and alternative supply across major markets.',
    stat: 'Global options',
    cardClass:
      'border-[#8cffd0]/14 bg-[linear-gradient(180deg,rgba(10,29,24,0.92),rgba(7,12,19,0.94))]',
    badgeClass: 'border-[#8cffd0]/18 bg-[#8cffd0]/10 text-[#a8ffd9]',
    providers: [
      { name: 'Qwen', Icon: Qwen.Color },
      { name: 'DeepSeek', Icon: DeepSeek.Color },
      { name: 'Moonshot', Icon: Moonshot },
      { name: 'Hunyuan', Icon: Hunyuan.Color },
      { name: 'Wenxin', Icon: Wenxin.Color },
      { name: 'Volcengine', Icon: Volcengine.Color },
      { name: 'Spark', Icon: Spark.Color },
      { name: 'MiniMax', Icon: Minimax.Color },
    ],
  },
  {
    title: 'Specialist surfaces',
    description:
      'Search, media, enterprise, and self-hosted adapters can still live inside the same gateway story.',
    stat: 'Expansion lanes',
    cardClass:
      'border-[#f0a9ff]/14 bg-[linear-gradient(180deg,rgba(29,12,33,0.92),rgba(8,12,20,0.94))]',
    badgeClass: 'border-[#f0a9ff]/18 bg-[#f0a9ff]/10 text-[#ffc8ff]',
    providers: [
      { name: 'Perplexity', Icon: Perplexity.Color },
      { name: 'Midjourney', Icon: Midjourney },
      { name: 'Suno', Icon: Suno },
      { name: 'Grok', Icon: Grok },
      { name: 'Azure AI', Icon: AzureAI.Color },
      { name: 'Xinference', Icon: Xinference.Color },
    ],
  },
];

const ProviderChip = ({ name, Icon, large = false, accent = false }) => (
  <div
    className={`inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#07111c]/88 pr-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/18 ${
      large ? 'min-h-[62px] pl-3 text-base' : 'min-h-[54px] pl-2.5 text-sm'
    } ${accent ? 'shadow-[0_12px_36px_rgba(95,228,255,0.08)]' : ''}`}
    title={name}
  >
    <span
      className={`grid shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.05] ${
        large ? 'h-12 w-12' : 'h-10 w-10'
      }`}
    >
      <Icon aria-hidden='true' size={large ? 26 : 22} />
    </span>
    <span className='font-medium text-white'>{name}</span>
  </div>
);

const ProviderEcosystem = () => {
  const [frontierGroup, regionalGroup, specialistGroup] = providerGroups;

  return (
    <section
      id='model-ecosystem'
      className='mx-auto w-full max-w-[1380px] px-5 pb-10 pt-8 sm:px-8 lg:px-10'
    >
      <div className='relative overflow-hidden rounded-[34px] border border-white/10 bg-[#030711] shadow-[0_26px_110px_rgba(0,0,0,0.38)]'>
        <div
          className='absolute inset-0 opacity-84'
          style={{
            backgroundImage:
              'radial-gradient(circle at 18% 20%, rgba(79, 238, 255, 0.16), transparent 24%), radial-gradient(circle at 84% 12%, rgba(223, 137, 255, 0.14), transparent 22%), linear-gradient(180deg, rgba(8,15,27,0.96) 0%, rgba(4,8,14,0.98) 100%)',
          }}
        />
        <div
          className='absolute inset-0 opacity-[0.1]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div className='relative grid gap-8 p-5 lg:grid-cols-[0.78fr_1.22fr] lg:p-7'>
          <div className='flex flex-col justify-between gap-8'>
            <div>
              <p className='text-[11px] uppercase tracking-[0.32em] text-[#a0f6ff]'>
                Provider ecosystem
              </p>
              <h2 className='mt-3 max-w-[420px] text-[34px] font-semibold tracking-[-0.04em] text-white sm:text-[44px]'>
                One gateway for a worldwide model economy.
              </h2>
              <p className='mt-5 max-w-[430px] text-sm leading-7 text-[#a8bdd1] sm:text-base'>
                The ecosystem should feel like a premium exchange wall, not a
                stack of interchangeable logo cards. Different providers occupy
                different strategic roles, and the layout now makes that
                legible.
              </p>
            </div>

            <div className='space-y-5'>
              <div className='inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#d6e6f2]'>
                40+ upstream integrations available across the relay layer
              </div>
              <div className='space-y-4 text-sm leading-7 text-[#cad8e5]'>
                <div className='border-l border-[#8fefff]/28 pl-4'>
                  <p className='text-[11px] uppercase tracking-[0.24em] text-[#9efcff]'>
                    Frontier
                  </p>
                  <p>
                    Anchor premium reasoning, multimodal, and flagship chat
                    lanes.
                  </p>
                </div>
                <div className='border-l border-[#8cffd0]/28 pl-4'>
                  <p className='text-[11px] uppercase tracking-[0.24em] text-[#a8ffd9]'>
                    Regional
                  </p>
                  <p>
                    Match geography, compliance, and multilingual demand without
                    leaving the gateway.
                  </p>
                </div>
                <div className='border-l border-[#f0a9ff]/28 pl-4'>
                  <p className='text-[11px] uppercase tracking-[0.24em] text-[#ffc8ff]'>
                    Specialist
                  </p>
                  <p>
                    Bring search, media, enterprise, and self-hosted adapters
                    into the same customer story.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='grid gap-4 lg:grid-cols-[1.05fr_0.95fr]'>
            <article
              className={`rounded-[30px] border p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)] lg:row-span-2 ${frontierGroup.cardClass}`}
            >
              <div className='flex items-center justify-between gap-4'>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${frontierGroup.badgeClass}`}
                >
                  {frontierGroup.stat}
                </span>
                <span className='text-xs uppercase tracking-[0.22em] text-white/38'>
                  flagship mix
                </span>
              </div>
              <h3 className='mt-5 text-[30px] font-semibold tracking-[-0.04em] text-white'>
                {frontierGroup.title}
              </h3>
              <p className='mt-3 max-w-[34ch] text-sm leading-7 text-[#c6d7e6]'>
                {frontierGroup.description}
              </p>
              <div className='mt-7 flex flex-wrap gap-3'>
                {frontierGroup.providers.map(({ name, Icon }, index) => (
                  <ProviderChip
                    key={name}
                    name={name}
                    Icon={Icon}
                    large={index < 3}
                    accent={index < 2}
                  />
                ))}
              </div>
            </article>

            <article
              className={`rounded-[28px] border p-5 shadow-[0_16px_36px_rgba(0,0,0,0.2)] ${regionalGroup.cardClass}`}
            >
              <div className='flex items-center justify-between gap-4'>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${regionalGroup.badgeClass}`}
                >
                  {regionalGroup.stat}
                </span>
                <span className='text-xs uppercase tracking-[0.22em] text-white/38'>
                  regional fit
                </span>
              </div>
              <h3 className='mt-5 text-2xl font-semibold tracking-[-0.03em] text-white'>
                {regionalGroup.title}
              </h3>
              <p className='mt-3 text-sm leading-7 text-[#c7d8e5]'>
                {regionalGroup.description}
              </p>
              <div className='mt-6 flex flex-wrap gap-2.5'>
                {regionalGroup.providers.map(({ name, Icon }, index) => (
                  <ProviderChip
                    key={name}
                    name={name}
                    Icon={Icon}
                    large={index < 2}
                  />
                ))}
              </div>
            </article>

            <article
              className={`rounded-[28px] border p-5 shadow-[0_16px_36px_rgba(0,0,0,0.2)] ${specialistGroup.cardClass}`}
            >
              <div className='flex items-center justify-between gap-4'>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${specialistGroup.badgeClass}`}
                >
                  {specialistGroup.stat}
                </span>
                <span className='text-xs uppercase tracking-[0.22em] text-white/38'>
                  extensions
                </span>
              </div>
              <h3 className='mt-5 text-2xl font-semibold tracking-[-0.03em] text-white'>
                {specialistGroup.title}
              </h3>
              <p className='mt-3 text-sm leading-7 text-[#d7c7df]'>
                {specialistGroup.description}
              </p>
              <div className='mt-6 flex flex-wrap gap-2.5'>
                {specialistGroup.providers.map(({ name, Icon }, index) => (
                  <ProviderChip
                    key={name}
                    name={name}
                    Icon={Icon}
                    large={index === 0 || index === 4}
                  />
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderEcosystem;
