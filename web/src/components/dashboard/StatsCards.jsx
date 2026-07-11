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
import { Button, Card, Skeleton } from '@douyinfe/semi-ui';
import { VChart } from '@visactor/react-vchart';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const metricIconClassName =
  'grid h-7 w-7 shrink-0 place-items-center rounded-md bg-transparent text-[var(--console-text-muted)] [&_svg]:h-4 [&_svg]:w-4';

const StatsCards = ({
  groupedStatsData,
  loading,
  getTrendSpec,
  CARD_PROPS,
  CHART_CONFIG,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className='mb-4'>
      <Card
        {...CARD_PROPS}
        className='overflow-hidden border border-[var(--console-border)] bg-[var(--console-panel-strong)] !rounded-2xl shadow-none [&_.semi-card-body]:!p-0'
        bodyStyle={{ padding: 0 }}
      >
        <div className='grid grid-cols-1 divide-y divide-[var(--console-divider)] md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4'>
          {groupedStatsData.map((group, idx) => {
            const sectionBorderClass =
              idx >= 2
                ? 'md:border-t md:border-[var(--console-divider)] xl:border-t-0'
                : '';

            return (
              <section
                key={idx}
                className={`min-w-0 p-4 ${sectionBorderClass}`}
              >
                <div className='flex items-center justify-between gap-3'>
                  <div className='min-w-0 text-sm font-semibold text-[var(--console-text-strong)] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-[var(--console-text-muted)]'>
                    {group.title}
                  </div>
                  <span className='shrink-0 text-xs font-medium tabular-nums text-[var(--console-text-faint)]'>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className='mt-3 divide-y divide-[var(--console-divider)] border-t border-[var(--console-divider)]'>
                  {group.items.map((item, itemIdx) => {
                    const isLeadItem = itemIdx === 0;
                    const isBalance = item.title === t('当前余额');
                    const showTrend =
                      loading || (item.trendData && item.trendData.length > 0);
                    const ItemContainer = item.onClick ? 'button' : 'div';

                    return (
                      <ItemContainer
                        key={itemIdx}
                        {...(item.onClick
                          ? { type: 'button', onClick: item.onClick }
                          : {})}
                        className={`flex min-h-[82px] w-full items-center justify-between gap-3 py-3 text-left ${
                          item.onClick
                            ? 'transition-colors hover:bg-[var(--console-panel-soft)]'
                            : ''
                        }`}
                      >
                        <div className='flex min-w-0 items-center gap-3'>
                          <div className={metricIconClassName}>{item.icon}</div>
                          <div className='min-w-0'>
                            <div className='truncate text-xs font-medium text-[var(--console-text-muted)]'>
                              {item.title}
                            </div>
                            <div
                              className={`mt-1 font-semibold leading-none tabular-nums text-[var(--console-text-strong)] ${
                                isLeadItem ? 'text-2xl' : 'text-xl'
                              }`}
                            >
                              <Skeleton
                                loading={loading}
                                active
                                placeholder={
                                  <Skeleton.Paragraph
                                    active
                                    rows={1}
                                    style={{
                                      width: isLeadItem ? '88px' : '68px',
                                      height: isLeadItem ? '22px' : '18px',
                                      margin: '3px 0 0',
                                    }}
                                  />
                                }
                              >
                                <span className='break-all'>{item.value}</span>
                              </Skeleton>
                            </div>
                          </div>
                        </div>

                        {isBalance ? (
                          <Button
                            size='small'
                            theme='solid'
                            type='primary'
                            className='!rounded-lg !bg-[var(--console-accent)] !px-2.5 !text-xs shadow-none hover:!bg-[var(--console-accent-strong)]'
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate('/console/topup');
                            }}
                          >
                            {t('充值')}
                          </Button>
                        ) : (
                          showTrend && (
                            <div className='hidden h-10 w-20 shrink-0 sm:block'>
                              <VChart
                                spec={getTrendSpec(
                                  item.trendData || [],
                                  item.trendColor,
                                )}
                                option={CHART_CONFIG}
                              />
                            </div>
                          )
                        )}
                      </ItemContainer>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
