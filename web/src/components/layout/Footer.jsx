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

import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getFooterHTML, getLogo, getSystemName } from '../../helpers';
import { StatusContext } from '../../context/Status';

const FooterBar = () => {
  const { t } = useTranslation();
  const [footer, setFooter] = useState(getFooterHTML());
  const systemName = getSystemName();
  const displaySystemName = systemName === 'New API' ? 'NavtoAI' : systemName;
  const logo = getLogo();
  const [statusState] = useContext(StatusContext);
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const location = useLocation();
  const isAuthRoute = ['/login', '/register', '/reset', '/user/reset'].includes(
    location.pathname,
  );

  const loadFooter = () => {
    let footer_html = localStorage.getItem('footer_html');
    if (footer_html) {
      setFooter(footer_html);
    }
  };

  const currentYear = new Date().getFullYear();
  const footerSections = useMemo(
    () => [
      {
        title: t('关于我们'),
        links: [
          {
            href: 'https://docs.newapi.pro/wiki/project-introduction/',
            label: t('关于项目'),
          },
          {
            href: 'https://docs.newapi.pro/support/community-interaction/',
            label: t('联系我们'),
          },
          {
            href: 'https://docs.newapi.pro/wiki/features-introduction/',
            label: t('功能特性'),
          },
        ],
      },
      {
        title: t('文档'),
        links: [
          {
            href: 'https://docs.newapi.pro/getting-started/',
            label: t('快速开始'),
          },
          {
            href: 'https://docs.newapi.pro/installation/',
            label: t('安装指南'),
          },
          {
            href: 'https://docs.newapi.pro/api/',
            label: t('API 文档'),
          },
        ],
      },
      {
        title: t('相关项目'),
        links: [
          {
            href: 'https://github.com/songquanpeng/one-api',
            label: 'One API',
          },
          {
            href: 'https://github.com/novicezk/midjourney-proxy',
            label: 'Midjourney-Proxy',
          },
          {
            href: 'https://github.com/Calcium-Ion/neko-api-key-tool',
            label: 'neko-api-key-tool',
          },
        ],
      },
      {
        title: t('友情链接'),
        links: [
          {
            href: 'https://github.com/Calcium-Ion/new-api-horizon',
            label: 'new-api-horizon',
          },
          {
            href: 'https://github.com/coaidev/coai',
            label: 'CoAI',
          },
          {
            href: 'https://www.gpt-load.com/',
            label: 'GPT-Load',
          },
        ],
      },
    ],
    [t],
  );

  const customFooter = useMemo(
    () => (
      <footer className='relative w-full overflow-hidden border-t border-[#e5e8ec] bg-[#f7f8f6] text-[#111722] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'>
        <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffb58f] to-transparent dark:via-[#2f4b3b]' />
        <div className='relative mx-auto w-full max-w-[1180px] px-6 py-10 sm:px-8 lg:px-10'>
          {isDemoSiteMode && (
            <div className='grid gap-10 border-b border-[#e3e7eb] pb-10 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.6fr)] md:gap-12 dark:border-zinc-800/80'>
              <div className='max-w-[320px]'>
                <div className='inline-flex items-center gap-4'>
                  <div className='grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#dde3e8] bg-white/80 p-2 shadow-[0_18px_40px_rgba(17,23,34,0.06)] dark:border-zinc-800 dark:bg-zinc-900/70 dark:shadow-none'>
                    <img
                      src={logo}
                      alt={systemName}
                      className='h-10 w-10 object-contain'
                    />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-[11px] font-medium uppercase text-[#6e7783] dark:text-zinc-500'>
                      NavtoAI
                    </p>
                    <h2 className='truncate text-[24px] font-medium text-[#111722] dark:text-zinc-100'>
                      {displaySystemName}
                    </h2>
                  </div>
                </div>
                <p className='mt-5 max-w-[28ch] text-sm leading-7 text-[#5b6470] dark:text-zinc-400'>
                  © {currentYear} {displaySystemName}. {t('版权所有')}
                </p>
              </div>

              <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4'>
                {footerSections.map((section) => (
                  <div key={section.title} className='text-left'>
                    <p className='text-[11px] font-medium uppercase text-[#6e7783] dark:text-zinc-500'>
                      {section.title}
                    </p>
                    <div className='mt-5 flex flex-col gap-3.5'>
                      {section.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='group inline-flex items-center gap-3 text-sm text-[#4f5864] transition-colors duration-200 hover:text-[#111722] dark:text-zinc-400 dark:hover:text-zinc-100'
                        >
                          <span className='h-1.5 w-1.5 rounded-full bg-[#c4ccd4] transition-all duration-200 group-hover:w-3 group-hover:bg-[#ff5a1f] dark:bg-zinc-700 dark:group-hover:bg-[#ff8a4c]' />
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={isDemoSiteMode ? 'pt-8' : ''}>
            <div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-sm text-[#5b6470] dark:text-zinc-400 md:justify-start md:text-left'>
              <span>
                © {currentYear} {displaySystemName}. {t('版权所有')}
              </span>
              <span className='hidden h-1 w-1 rounded-full bg-[#c4ccd4] md:inline-block dark:bg-zinc-700' />
              <span className='text-[#6c7682] dark:text-zinc-500'>NavtoAI</span>
            </div>
          </div>
        </div>
      </footer>
    ),
    [logo, displaySystemName, t, currentYear, isDemoSiteMode, footerSections],
  );

  useEffect(() => {
    loadFooter();
  }, []);

  if (isAuthRoute) {
    return null;
  }

  return (
    <div className='w-full'>
      {footer ? (
        <footer className='relative w-full overflow-hidden border-t border-[#e5e8ec] bg-[#f7f8f6] text-[#111722] dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100'>
          <div className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffb58f] to-transparent dark:via-[#2f4b3b]' />
          <div className='relative mx-auto w-full max-w-[1180px] px-6 py-6 sm:px-8 lg:px-10'>
            <div className='rounded-[24px] border border-[#e3e7eb] bg-[#fbfbf9]/88 px-5 py-5 shadow-[0_18px_50px_rgba(17,23,34,0.05)] backdrop-blur-sm md:px-7 dark:border-zinc-800 dark:bg-zinc-900/60 dark:shadow-none'>
              <div
                className='custom-footer na-cb6feafeb3990c78 min-w-0 flex-1 break-words text-sm leading-7 text-[#5b6470] dark:text-zinc-400 [&_a]:font-medium [&_a]:text-[#ff5a1f] [&_a]:transition-colors [&_a]:duration-200 [&_a:hover]:text-[#d94a15] [&_ol]:m-0 [&_ol]:pl-5 [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:m-0 [&_ul]:pl-5 dark:[&_a]:text-[#ff8a4c] dark:[&_a:hover]:text-[#ffac7a]'
                dangerouslySetInnerHTML={{ __html: footer }}
              ></div>
            </div>
          </div>
        </footer>
      ) : (
        customFooter
      )}
    </div>
  );
};

export default FooterBar;
