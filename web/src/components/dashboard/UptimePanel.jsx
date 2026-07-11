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
  Card,
  Button,
  Spin,
  Tabs,
  TabPane,
  Tag,
  Empty,
} from '@douyinfe/semi-ui';
import { Gauge, RefreshCw } from 'lucide-react';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import ScrollableContainer from '../common/ui/ScrollableContainer';

const UPTIME_PANEL_STYLES = `
  .dashboard-uptime-tabs.semi-tabs .semi-tabs-bar {
    margin-bottom: 0 !important;
    border-bottom: 1px solid var(--console-divider) !important;
    padding: 8px 12px 0 !important;
  }

  .dashboard-uptime-tabs .semi-tabs-tab {
    min-height: 32px !important;
    border-radius: 6px 6px 0 0 !important;
    font-size: 12px !important;
  }

  .dashboard-uptime-tabs .semi-tabs-content {
    padding: 0 !important;
  }
`;

const UptimePanel = ({
  uptimeData,
  uptimeLoading,
  activeUptimeTab,
  setActiveUptimeTab,
  loadUptimeData,
  uptimeLegendData,
  renderMonitorList,
  CARD_PROPS,
  ILLUSTRATION_SIZE,
  t,
}) => {
  return (
    <>
      <style>{UPTIME_PANEL_STYLES}</style>
      <Card
        {...CARD_PROPS}
        className='overflow-hidden border border-[var(--console-border)] bg-[var(--console-panel-strong)] !rounded-2xl shadow-none lg:col-span-1 [&_.semi-card-body]:!p-0'
        bodyStyle={{ padding: 0 }}
      >
        <section>
          <div className='flex items-center justify-between gap-3 border-b border-[var(--console-divider)] px-4 py-3'>
            <div className='flex min-w-0 items-center gap-3'>
              <span className='grid h-8 w-8 place-items-center rounded-md bg-transparent text-[var(--console-text-muted)]'>
                <Gauge size={17} />
              </span>
              <div className='min-w-0'>
                <h2 className='truncate text-sm font-semibold leading-5 text-[var(--console-text-strong)]'>
                  {t('服务可用性')}
                </h2>
                <p className='mt-0.5 text-xs text-[var(--console-text-muted)]'>
                  {uptimeData.length.toString().padStart(2, '0')}
                </p>
              </div>
            </div>
            <Button
              icon={<RefreshCw size={14} />}
              onClick={loadUptimeData}
              loading={uptimeLoading}
              size='small'
              theme='borderless'
              type='tertiary'
              className='!h-8 !w-8 !rounded-md !p-0 !text-[var(--console-text-muted)] hover:!bg-[var(--console-panel-soft)] hover:!text-[var(--console-text-strong)]'
              aria-label={t('刷新')}
              title={t('刷新')}
            />
          </div>

          <div className='relative'>
            <Spin spinning={uptimeLoading}>
              {uptimeData.length > 0 ? (
                uptimeData.length === 1 ? (
                  <ScrollableContainer maxHeight='24rem'>
                    {renderMonitorList(uptimeData[0].monitors)}
                  </ScrollableContainer>
                ) : (
                  <Tabs
                    type='card'
                    collapsible
                    activeKey={activeUptimeTab}
                    onChange={setActiveUptimeTab}
                    size='small'
                    className='dashboard-uptime-tabs'
                  >
                    {uptimeData.map((group, groupIdx) => (
                      <TabPane
                        tab={
                          <span className='flex items-center gap-2'>
                            <span className='truncate'>
                              {group.categoryName}
                            </span>
                            <Tag
                              color={
                                activeUptimeTab === group.categoryName
                                  ? 'red'
                                  : 'grey'
                              }
                              size='small'
                              shape='circle'
                            >
                              {group.monitors ? group.monitors.length : 0}
                            </Tag>
                          </span>
                        }
                        itemKey={group.categoryName}
                        key={groupIdx}
                      >
                        <ScrollableContainer maxHeight='21.5rem'>
                          {renderMonitorList(group.monitors)}
                        </ScrollableContainer>
                      </TabPane>
                    ))}
                  </Tabs>
                )
              ) : (
                <div className='flex min-h-[16rem] justify-center p-6'>
                  <Empty
                    image={
                      <IllustrationConstruction style={ILLUSTRATION_SIZE} />
                    }
                    darkModeImage={
                      <IllustrationConstructionDark style={ILLUSTRATION_SIZE} />
                    }
                    title={t('暂无监控数据')}
                    description={t('请联系管理员在系统设置中配置Uptime')}
                  />
                </div>
              )}
            </Spin>
          </div>

          {uptimeData.length > 0 && (
            <div className='border-t border-[var(--console-divider)] px-4 py-3'>
              <div className='flex flex-wrap gap-x-3 gap-y-1 text-xs'>
                {uptimeLegendData.map((legend, index) => (
                  <div key={index} className='flex items-center gap-1.5'>
                    <span
                      className='h-2 w-2 rounded-full'
                      style={{ backgroundColor: legend.color }}
                    />
                    <span className='text-[var(--console-text-muted)]'>
                      {legend.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </Card>
    </>
  );
};

export default UptimePanel;
