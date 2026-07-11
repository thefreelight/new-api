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
import { Card, Empty } from '@douyinfe/semi-ui';
import { Bell } from 'lucide-react';
import { marked } from 'marked';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import ScrollableContainer from '../common/ui/ScrollableContainer';

const getLegendColor = (color) =>
  ({
    grey: '#8b9aa7',
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f59e0b',
    red: '#ef4444',
  })[color] || '#8b9aa7';

const AnnouncementsPanel = ({
  announcementData,
  announcementLegendData,
  CARD_PROPS,
  ILLUSTRATION_SIZE,
  t,
}) => {
  return (
    <Card
      {...CARD_PROPS}
      className='overflow-hidden border border-[var(--console-border)] bg-[var(--console-panel-strong)] !rounded-2xl shadow-none lg:col-span-2 [&_.semi-card-body]:!p-0'
      bodyStyle={{ padding: 0 }}
    >
      <section>
        <div className='flex flex-col gap-3 border-b border-[var(--console-divider)] px-4 py-3 xl:flex-row xl:items-center xl:justify-between'>
          <div className='flex min-w-0 items-center gap-3'>
            <span className='grid h-8 w-8 place-items-center rounded-md bg-transparent text-[var(--console-text-muted)]'>
              <Bell size={17} />
            </span>
            <div className='min-w-0'>
              <h2 className='truncate text-sm font-semibold leading-5 text-[var(--console-text-strong)]'>
                {t('系统公告')}
              </h2>
              <p className='mt-0.5 text-xs text-[var(--console-text-muted)]'>
                {t('显示最新20条')}
              </p>
            </div>
          </div>

          <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs'>
            {announcementLegendData.map((legend, index) => (
              <div key={index} className='flex items-center gap-1.5'>
                <span
                  className='h-2 w-2 rounded-full'
                  style={{ backgroundColor: getLegendColor(legend.color) }}
                />
                <span className='text-[var(--console-text-muted)]'>
                  {legend.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <ScrollableContainer maxHeight='24rem'>
          {announcementData.length > 0 ? (
            <div className='divide-y divide-[var(--console-divider)]'>
              {announcementData.map((item, idx) => {
                const legend = announcementLegendData.find(
                  (entry) => entry.type === (item.type || 'default'),
                );
                const htmlExtra = item.extra ? marked.parse(item.extra) : '';

                return (
                  <article
                    key={idx}
                    className='px-4 py-3 transition-colors duration-150 hover:bg-[var(--console-panel-soft)]'
                  >
                    <div className='flex items-start gap-3'>
                      <span
                        className='mt-1.5 h-2 w-2 shrink-0 rounded-full'
                        style={{
                          backgroundColor: getLegendColor(legend?.color),
                        }}
                      />
                      <div className='min-w-0 flex-1'>
                        <div
                          className='dashboard-rich-text text-sm font-medium leading-6 text-[var(--console-text-strong)]'
                          dangerouslySetInnerHTML={{
                            __html: marked.parse(item.content || ''),
                          }}
                        />
                        {item.extra && (
                          <div
                            className='dashboard-rich-text mt-1 text-xs leading-5 text-[var(--console-text-muted)]'
                            dangerouslySetInnerHTML={{ __html: htmlExtra }}
                          />
                        )}
                        <div className='mt-1 text-xs text-[var(--console-text-faint)]'>
                          {item.relative ? `${item.relative} ` : ''}
                          {item.time}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className='flex min-h-[16rem] justify-center p-6'>
              <Empty
                image={<IllustrationConstruction style={ILLUSTRATION_SIZE} />}
                darkModeImage={
                  <IllustrationConstructionDark style={ILLUSTRATION_SIZE} />
                }
                title={t('暂无系统公告')}
                description={t('请联系管理员在系统设置中配置公告信息')}
              />
            </div>
          )}
        </ScrollableContainer>
      </section>
    </Card>
  );
};

export default AnnouncementsPanel;
