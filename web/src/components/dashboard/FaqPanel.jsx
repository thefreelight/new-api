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
import { Card, Collapse, Empty } from '@douyinfe/semi-ui';
import { HelpCircle } from 'lucide-react';
import { IconPlus, IconMinus } from '@douyinfe/semi-icons';
import { marked } from 'marked';
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from '@douyinfe/semi-illustrations';
import ScrollableContainer from '../common/ui/ScrollableContainer';

const FAQ_PANEL_STYLES = `
  .dashboard-faq-collapse.semi-collapse {
    border: 0 !important;
    background: transparent !important;
  }

  .dashboard-faq-collapse .semi-collapse-item {
    border-bottom: 1px solid var(--console-divider) !important;
  }

  .dashboard-faq-collapse .semi-collapse-header {
    padding: 12px 16px !important;
    color: var(--console-text-strong) !important;
    font-size: 13px !important;
    font-weight: 600 !important;
  }

  .dashboard-faq-collapse .semi-collapse-content {
    padding: 0 16px 12px 44px !important;
    color: var(--console-text-muted) !important;
    font-size: 13px !important;
    line-height: 1.7 !important;
  }
`;

const FaqPanel = ({ faqData, CARD_PROPS, ILLUSTRATION_SIZE, t }) => {
  return (
    <>
      <style>{FAQ_PANEL_STYLES}</style>
      <Card
        {...CARD_PROPS}
        className='overflow-hidden border border-[var(--console-border)] bg-[var(--console-panel-strong)] !rounded-2xl shadow-none lg:col-span-1 [&_.semi-card-body]:!p-0'
        bodyStyle={{ padding: 0 }}
      >
        <section>
          <div className='flex items-center gap-3 border-b border-[var(--console-divider)] px-4 py-3'>
            <span className='grid h-8 w-8 place-items-center rounded-md bg-transparent text-[var(--console-text-muted)]'>
              <HelpCircle size={17} />
            </span>
            <div className='min-w-0'>
              <h2 className='truncate text-sm font-semibold leading-5 text-[var(--console-text-strong)]'>
                {t('常见问答')}
              </h2>
              <p className='mt-0.5 text-xs text-[var(--console-text-muted)]'>
                {faqData.length.toString().padStart(2, '0')}
              </p>
            </div>
          </div>

          <ScrollableContainer maxHeight='24rem'>
            {faqData.length > 0 ? (
              <Collapse
                accordion
                expandIcon={<IconPlus />}
                collapseIcon={<IconMinus />}
                className='dashboard-faq-collapse'
              >
                {faqData.map((item, index) => (
                  <Collapse.Panel
                    key={index}
                    header={item.question}
                    itemKey={index.toString()}
                  >
                    <div
                      className='dashboard-rich-text'
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(item.answer || ''),
                      }}
                    />
                  </Collapse.Panel>
                ))}
              </Collapse>
            ) : (
              <div className='flex min-h-[16rem] justify-center p-6'>
                <Empty
                  image={<IllustrationConstruction style={ILLUSTRATION_SIZE} />}
                  darkModeImage={
                    <IllustrationConstructionDark style={ILLUSTRATION_SIZE} />
                  }
                  title={t('暂无常见问答')}
                  description={t('请联系管理员在系统设置中配置常见问答')}
                />
              </div>
            )}
          </ScrollableContainer>
        </section>
      </Card>
    </>
  );
};

export default FaqPanel;
