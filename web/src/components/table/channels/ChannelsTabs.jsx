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
import { Tabs, TabPane } from '@douyinfe/semi-ui';
import { CHANNEL_OPTIONS } from '../../../constants';
import { getChannelIcon } from '../../../helpers';

const CHANNEL_TAB_STYLES = `
  .channel-premium-tabs-shell {
    overflow-x: auto;
    padding-bottom: 4px;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .channel-premium-tabs-shell::-webkit-scrollbar {
    display: none;
  }

  .channel-premium-tabs-frame {
    display: inline-flex;
    min-width: 100%;
    padding: 6px;
    border: 1px solid #e1e5e8;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.72);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.74),
      0 18px 48px rgba(17, 23, 34, 0.04);
  }

  .channel-premium-tabs.semi-tabs .semi-tabs-bar {
    margin-bottom: 0 !important;
    border-bottom: none !important;
  }

  .channel-premium-tabs .semi-tabs-tab {
    min-height: 50px !important;
    margin: 0 !important;
    padding: 0 12px !important;
    border: 1px solid transparent !important;
    border-radius: 8px !important;
    background: transparent !important;
    color: #59616d !important;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .channel-premium-tabs .semi-tabs-tab:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 90, 31, 0.26) !important;
    background: #fff5ef !important;
    color: #171d27 !important;
  }

  .channel-premium-tabs .semi-tabs-tab-active,
  .channel-premium-tabs .semi-tabs-tab-card-active {
    border-color: rgba(255, 90, 31, 0.32) !important;
    background: #fff1e8 !important;
    color: #111722 !important;
    box-shadow: inset 0 0 0 1px rgba(255, 90, 31, 0.08), 0 14px 34px rgba(17, 23, 34, 0.08);
  }

  .channel-premium-tab-label {
    display: flex;
    align-items: center;
    gap: 10px;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 600;
  }

  .channel-premium-tab-icon {
    display: grid;
    width: 28px;
    height: 28px;
    place-items: center;
    overflow: hidden;
    border: 1px solid #e4e8eb;
    border-radius: 8px;
    background: #fbfbf8;
    color: #ff5a1f;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .channel-premium-tab-icon svg {
    width: 16px;
    height: 16px;
  }

  .channel-premium-tab-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #ff5a1f;
    box-shadow: 0 0 0 6px rgba(255, 90, 31, 0.12);
  }

  .channel-premium-tab-count {
    min-width: 28px;
    border: 1px solid #dde2e7;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.86);
    padding: 0 8px;
    color: #5b6470;
    font-size: 12px;
    font-weight: 700;
    line-height: 24px;
    text-align: center;
  }

  .channel-premium-tabs .semi-tabs-tab-active .channel-premium-tab-icon,
  .channel-premium-tabs .semi-tabs-tab-card-active .channel-premium-tab-icon {
    border-color: rgba(255, 90, 31, 0.28) !important;
    background: #ffffff !important;
    color: #ff5a1f !important;
  }

  .channel-premium-tabs .semi-tabs-tab-active .channel-premium-tab-count,
  .channel-premium-tabs .semi-tabs-tab-card-active .channel-premium-tab-count {
    border-color: rgba(255, 90, 31, 0.24) !important;
    background: #ffffff !important;
    color: #111722 !important;
  }

  .channel-premium-tabs-shell {
    padding-bottom: 0 !important;
  }

  .channel-premium-tabs-frame {
    padding: 0 !important;
    min-width: 0 !important;
    width: max-content !important;
    max-width: 100% !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .channel-premium-tabs.semi-tabs .semi-tabs-bar {
    margin-bottom: 0 !important;
    border-bottom: none !important;
  }

  .channel-premium-tabs .semi-tabs-tab {
    min-height: 30px !important;
    margin: 0 4px 0 0 !important;
    padding: 0 8px !important;
    border: 1px solid #dfe5eb !important;
    border-radius: 6px !important;
    background: #ffffff !important;
    color: #4c5968 !important;
    transform: none !important;
    box-shadow: none !important;
  }

  .channel-premium-tabs .semi-tabs-tab:hover {
    transform: none !important;
    border-color: #cfd8e2 !important;
    background: #f3f6f9 !important;
    color: #141a22 !important;
  }

  .channel-premium-tabs .semi-tabs-tab-active,
  .channel-premium-tabs .semi-tabs-tab-card-active {
    border-color: #cad4df !important;
    background: #e8edf2 !important;
    color: #141a22 !important;
    box-shadow: none !important;
  }

  .channel-premium-tab-label {
    gap: 6px !important;
    font-size: 12px !important;
    font-weight: 600 !important;
  }

  .channel-premium-tab-icon {
    width: 18px !important;
    height: 18px !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: #697584 !important;
  }

  .channel-premium-tab-icon svg {
    width: 14px !important;
    height: 14px !important;
  }

  .channel-premium-tab-dot {
    width: 6px !important;
    height: 6px !important;
    background: #697584 !important;
    box-shadow: none !important;
  }

  .channel-premium-tab-count {
    min-width: 22px !important;
    border-color: #dfe5eb !important;
    border-radius: 999px !important;
    background: #f8fafc !important;
    padding: 0 6px !important;
    color: #697584 !important;
    font-size: 11px !important;
    line-height: 18px !important;
  }

  .channel-premium-tabs .semi-tabs-tab-active .channel-premium-tab-icon,
  .channel-premium-tabs .semi-tabs-tab-card-active .channel-premium-tab-icon {
    border-color: transparent !important;
    background: transparent !important;
    color: #141a22 !important;
  }

  .channel-premium-tabs .semi-tabs-tab-active .channel-premium-tab-count,
  .channel-premium-tabs .semi-tabs-tab-card-active .channel-premium-tab-count {
    border-color: #cad4df !important;
    background: #ffffff !important;
    color: #141a22 !important;
  }
`;

const ChannelsTabs = ({
  enableTagMode,
  activeTypeKey,
  setActiveTypeKey,
  channelTypeCounts,
  availableTypeKeys,
  loadChannels,
  activePage,
  pageSize,
  idSort,
  setActivePage,
  t,
}) => {
  if (enableTagMode) return null;

  const handleTabChange = (key) => {
    setActiveTypeKey(key);
    setActivePage(1);
    loadChannels(1, pageSize, idSort, enableTagMode, key);
  };

  const renderTabLabel = (label, count, icon = null) => (
    <span className='channel-premium-tab-label'>
      <span className='channel-premium-tab-icon'>
        {icon || <span className='channel-premium-tab-dot' />}
      </span>
      <span>{label}</span>
      <span className='channel-premium-tab-count'>{count}</span>
    </span>
  );

  return (
    <>
      <style>{CHANNEL_TAB_STYLES}</style>
      <div className='channel-premium-tabs-shell'>
        <div className='channel-premium-tabs-frame'>
          <Tabs
            activeKey={activeTypeKey}
            type='button'
            collapsible
            onChange={handleTabChange}
            className='channel-premium-tabs min-w-max'
          >
            <TabPane
              itemKey='all'
              tab={renderTabLabel(t('全部'), channelTypeCounts.all || 0)}
            />

            {CHANNEL_OPTIONS.filter((opt) =>
              availableTypeKeys.includes(String(opt.value)),
            ).map((option) => {
              const key = String(option.value);
              const count = channelTypeCounts[option.value] || 0;
              return (
                <TabPane
                  key={key}
                  itemKey={key}
                  tab={renderTabLabel(
                    option.label,
                    count,
                    getChannelIcon(option.value),
                  )}
                />
              );
            })}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ChannelsTabs;
