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
import { Card, Avatar, Button, Empty } from '@douyinfe/semi-ui';
import { Server, Gauge, ExternalLink, Copy } from 'lucide-react';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import ScrollableContainer from '../common/ui/ScrollableContainer';

const ApiInfoPanel = ({
  apiInfoData,
  handleCopyUrl,
  handleSpeedTest,
  CARD_PROPS,
  ILLUSTRATION_SIZE,
  t,
}) => {
  const actionButtonClassName =
    'h-8 w-8 !rounded-md !border !border-[var(--console-border)] !bg-white !p-0 !text-[var(--console-text-muted)] shadow-none transition-colors duration-150 hover:!border-[var(--console-border-strong)] hover:!bg-[var(--console-panel-soft)] hover:!text-[var(--console-text-strong)]';

  return (
    <Card
      {...CARD_PROPS}
      className='overflow-hidden border border-[var(--console-border)] bg-[var(--console-panel-strong)] !rounded-2xl shadow-none [&_.semi-card-body]:!p-0'
      bodyStyle={{ padding: 0 }}
    >
      <section className='flex h-full flex-col'>
        <div className='flex items-center justify-between gap-3 border-b border-[var(--console-divider)] px-4 py-3'>
          <div className='flex items-center gap-3'>
            <span className='grid h-8 w-8 place-items-center rounded-md bg-transparent text-[var(--console-text-muted)]'>
              <Server size={17} />
            </span>

            <div className='min-w-0'>
              <h2 className='truncate text-sm font-semibold leading-5 text-[var(--console-text-strong)]'>
                {t('API信息')}
              </h2>
              <p className='mt-0.5 text-xs text-[var(--console-text-muted)]'>
                {apiInfoData.length.toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        <div className='min-h-0 flex-1'>
          <ScrollableContainer maxHeight='32.5rem'>
            {apiInfoData.length > 0 ? (
              <div className='divide-y divide-[var(--console-divider)]'>
                {apiInfoData.map((api, index) => (
                  <div
                    key={api.id}
                    className='group px-4 py-3 transition-colors duration-150 hover:bg-[var(--console-panel-soft)]'
                  >
                    <div className='flex items-start gap-3'>
                      <Avatar size='small' color={api.color}>
                        {api.route.substring(0, 2)}
                      </Avatar>

                      <div className='min-w-0 flex-1'>
                        <div className='flex items-start justify-between gap-2'>
                          <div className='min-w-0'>
                            <div className='flex items-center gap-2'>
                              <span className='text-[11px] font-medium tabular-nums text-[var(--console-text-faint)]'>
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className='truncate text-sm font-semibold text-[var(--console-text-strong)]'>
                                {api.route}
                              </span>
                            </div>
                            {api.description && (
                              <p className='mt-1 line-clamp-2 text-xs leading-5 text-[var(--console-text-muted)]'>
                                {api.description}
                              </p>
                            )}
                          </div>

                          <div className='flex shrink-0 items-center gap-1'>
                            <Button
                              type='tertiary'
                              icon={<Gauge size={14} />}
                              onClick={() => handleSpeedTest(api.url)}
                              className={actionButtonClassName}
                              aria-label={t('测速')}
                              title={t('测速')}
                            />
                            <Button
                              type='tertiary'
                              icon={<Copy size={14} />}
                              onClick={() => handleCopyUrl(api.url)}
                              className={actionButtonClassName}
                              aria-label={t('复制')}
                              title={t('复制')}
                            />
                            <Button
                              type='tertiary'
                              icon={<ExternalLink size={14} />}
                              onClick={() =>
                                window.open(
                                  api.url,
                                  '_blank',
                                  'noopener,noreferrer',
                                )
                              }
                              className={actionButtonClassName}
                              aria-label={t('跳转')}
                              title={t('跳转')}
                            />
                          </div>
                        </div>

                        <button
                          type='button'
                          className='mt-2 flex w-full min-w-0 items-center gap-2 rounded-md border border-[var(--console-border)] bg-white px-2.5 py-2 text-left text-xs text-[var(--console-text-muted)] transition-colors duration-150 hover:border-[var(--console-border-strong)] hover:bg-[var(--console-bg)]'
                          onClick={() => handleCopyUrl(api.url)}
                        >
                          <span className='min-w-0 flex-1 truncate font-mono text-[12px] text-[var(--console-text-strong)]'>
                            {api.url}
                          </span>
                          <Copy
                            size={13}
                            className='shrink-0 text-[var(--console-text-muted)]'
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex min-h-[16rem] w-full items-center justify-center p-6'>
                <Empty
                  image={<IllustrationConstruction style={ILLUSTRATION_SIZE} />}
                  darkModeImage={
                    <IllustrationConstructionDark style={ILLUSTRATION_SIZE} />
                  }
                  title={t('暂无API信息')}
                  description={t('请联系管理员在系统设置中配置API信息')}
                />
              </div>
            )}
          </ScrollableContainer>
        </div>
      </section>
    </Card>
  );
};

export default ApiInfoPanel;
