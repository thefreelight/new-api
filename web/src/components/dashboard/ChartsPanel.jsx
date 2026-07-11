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
import { Card, Tabs, TabPane } from '@douyinfe/semi-ui';
import { PieChart } from 'lucide-react';
import { VChart } from '@visactor/react-vchart';

const CHART_PANEL_STYLES = `
  .dashboard-chart-tabs.semi-tabs .semi-tabs-bar {
    margin-bottom: 0 !important;
    border-bottom: none !important;
    gap: 6px;
  }

  .dashboard-chart-tabs .semi-tabs-tab {
    min-height: 34px !important;
    margin: 0 !important;
    border: 1px solid var(--console-border) !important;
    border-radius: 6px !important;
    background: #ffffff !important;
    color: var(--console-text-muted) !important;
    padding: 0 10px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    transition:
      border-color 0.15s ease,
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .dashboard-chart-tabs .semi-tabs-tab:hover {
    border-color: var(--console-border-strong) !important;
    color: var(--console-text-strong) !important;
    background: var(--console-panel-soft) !important;
  }

  .dashboard-chart-tabs .semi-tabs-tab-active,
  .dashboard-chart-tabs .semi-tabs-tab-card-active {
    border-color: var(--console-border-strong) !important;
    background: var(--console-accent-soft) !important;
    color: var(--console-text-strong) !important;
  }
`;

const ChartBody = ({ active, spec, CHART_CONFIG }) =>
  active ? (
    <div className='absolute inset-0 p-2 sm:p-3'>
      <div className='h-full w-full'>
        <VChart spec={spec} option={CHART_CONFIG} />
      </div>
    </div>
  ) : null;

const ChartsPanel = ({
  activeChartTab,
  setActiveChartTab,
  spec_line,
  spec_model_line,
  spec_pie,
  spec_rank_bar,
  spec_user_rank,
  spec_user_trend,
  isAdminUser,
  CARD_PROPS,
  CHART_CONFIG,
  hasApiInfoPanel,
  t,
}) => {
  const chartTabs = [
    { key: '1', label: t('消耗分布') },
    { key: '2', label: t('调用趋势') },
    { key: '3', label: t('调用次数分布') },
    { key: '4', label: t('调用次数排行') },
  ];

  if (isAdminUser) {
    chartTabs.push(
      { key: '5', label: t('用户消耗排行') },
      { key: '6', label: t('用户消耗趋势') },
    );
  }

  return (
    <>
      <style>{CHART_PANEL_STYLES}</style>
      <Card
        {...CARD_PROPS}
        className={`overflow-hidden border border-[var(--console-border)] bg-[var(--console-panel-strong)] !rounded-2xl shadow-none [&_.semi-card-body]:!p-0 ${
          hasApiInfoPanel ? 'lg:col-span-3' : ''
        }`}
        bodyStyle={{ padding: 0 }}
      >
        <section>
          <div className='flex flex-col gap-3 border-b border-[var(--console-divider)] px-4 py-3 xl:flex-row xl:items-center xl:justify-between'>
            <div className='flex min-w-0 items-center gap-3'>
              <div className='grid h-7 w-7 shrink-0 place-items-center rounded-md bg-transparent text-[var(--console-text-muted)]'>
                <PieChart size={17} />
              </div>

              <div className='min-w-0'>
                <h2 className='truncate text-sm font-semibold leading-5 text-[var(--console-text-strong)]'>
                  {t('模型数据分析')}
                </h2>
                <p className='mt-0.5 text-xs text-[var(--console-text-muted)]'>
                  {t('数据看板')}
                </p>
              </div>
            </div>

            <div className='overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
              <Tabs
                type='button'
                activeKey={activeChartTab}
                onChange={setActiveChartTab}
                className='dashboard-chart-tabs min-w-max'
              >
                {chartTabs.map((tab) => (
                  <TabPane
                    key={tab.key}
                    tab={<span>{tab.label}</span>}
                    itemKey={tab.key}
                  />
                ))}
              </Tabs>
            </div>
          </div>

          <div className='relative h-[390px] overflow-hidden bg-white sm:h-[460px] xl:h-[520px]'>
            <ChartBody
              active={activeChartTab === '1'}
              spec={spec_line}
              CHART_CONFIG={CHART_CONFIG}
            />
            <ChartBody
              active={activeChartTab === '2'}
              spec={spec_model_line}
              CHART_CONFIG={CHART_CONFIG}
            />
            <ChartBody
              active={activeChartTab === '3'}
              spec={spec_pie}
              CHART_CONFIG={CHART_CONFIG}
            />
            <ChartBody
              active={activeChartTab === '4'}
              spec={spec_rank_bar}
              CHART_CONFIG={CHART_CONFIG}
            />
            {isAdminUser && (
              <>
                <ChartBody
                  active={activeChartTab === '5'}
                  spec={spec_user_rank}
                  CHART_CONFIG={CHART_CONFIG}
                />
                <ChartBody
                  active={activeChartTab === '6'}
                  spec={spec_user_trend}
                  CHART_CONFIG={CHART_CONFIG}
                />
              </>
            )}
          </div>
        </section>
      </Card>
    </>
  );
};

export default ChartsPanel;
