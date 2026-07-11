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

import React, { useEffect, useMemo, useState } from 'react';
import { TabPane, Tabs } from '@douyinfe/semi-ui';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Calculator,
  Gauge,
  Shapes,
  Cog,
  MoreHorizontal,
  LayoutDashboard,
  MessageSquare,
  Palette,
  CreditCard,
  Server,
  Activity,
} from 'lucide-react';

import SystemSetting from '../../components/settings/SystemSetting';
import { isRoot } from '../../helpers';
import OtherSetting from '../../components/settings/OtherSetting';
import OperationSetting from '../../components/settings/OperationSetting';
import RateLimitSetting from '../../components/settings/RateLimitSetting';
import ModelSetting from '../../components/settings/ModelSetting';
import DashboardSetting from '../../components/settings/DashboardSetting';
import RatioSetting from '../../components/settings/RatioSetting';
import ChatsSetting from '../../components/settings/ChatsSetting';
import DrawingSetting from '../../components/settings/DrawingSetting';
import PaymentSetting from '../../components/settings/PaymentSetting';
import ModelDeploymentSetting from '../../components/settings/ModelDeploymentSetting';
import PerformanceSetting from '../../components/settings/PerformanceSetting';
import ConsoleShell from '../../components/layout/ConsoleShell';

const SETTINGS_SHELL_STYLES = `
  .settings-workbench {
    border: 1px solid #dfe5eb;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0 18px 54px rgba(17, 23, 34, 0.06);
  }

  .settings-workbench-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    border-bottom: 1px solid #e8edf2;
    background: #fbfcfd;
  }

  .settings-workbench-title-row {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 12px;
  }

  .settings-workbench-icon {
    display: grid;
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid #dce3ea;
    border-radius: 8px;
    background: #ffffff;
    color: #2f5f8f;
  }

  .settings-workbench-kicker {
    color: #697584;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
  }

  .settings-workbench-title {
    margin: 0;
    color: #141a22;
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: 0;
  }

  .settings-workbench-count {
    flex: 0 0 auto;
    border: 1px solid #dfe5eb;
    border-radius: 999px;
    background: #ffffff;
    padding: 3px 9px;
    color: #697584;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
  }

  .settings-workbench-tabs {
    padding: 12px;
  }

  .settings-premium-tabs.semi-tabs .semi-tabs-bar {
    margin-bottom: 0 !important;
    border-bottom: none !important;
  }

  .settings-premium-tabs .semi-tabs-bar-line {
    display: none !important;
  }

  .settings-premium-tabs .semi-tabs-bar-extra {
    display: none !important;
  }

  .settings-premium-tabs .semi-tabs-tab {
    min-height: 34px !important;
    margin: 0 8px 8px 0 !important;
    padding: 0 10px !important;
    border: 1px solid #dfe3e8 !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    color: #4c5968 !important;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .settings-premium-tabs .semi-tabs-tab:hover {
    border-color: #cfd8e2 !important;
    color: #141a22 !important;
    background: #f3f6f9 !important;
  }

  .settings-premium-tabs .semi-tabs-tab-active,
  .settings-premium-tabs .semi-tabs-tab-card-active {
    border-color: #c8d5e1 !important;
    background: #eaf0f5 !important;
    color: #141a22 !important;
    box-shadow: none !important;
  }

  .settings-premium-tabs .semi-tabs-tab-active .settings-premium-tab-icon,
  .settings-premium-tabs .semi-tabs-tab-card-active .settings-premium-tab-icon {
    border-color: #c8d5e1 !important;
    background: #ffffff !important;
    color: #2f5f8f !important;
  }

  .settings-premium-tab-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 600;
  }

  .settings-premium-tab-icon {
    display: grid;
    width: 22px;
    height: 22px;
    place-items: center;
    border: 1px solid #e4e8eb;
    border-radius: 6px;
    background: #f8fafc;
    color: #697584;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      color 0.2s ease;
  }

  .settings-premium-tab-icon svg {
    width: 14px;
    height: 14px;
  }

  .settings-premium-tabs .semi-tabs-content {
    overflow: visible;
  }

  .settings-workbench-content {
    margin-top: 4px;
    border: 1px solid #e4e9ef;
    border-radius: 8px;
    background: #ffffff;
    padding: 14px;
  }

  .settings-workbench-content .semi-card {
    border-color: #e2e8ef;
    border-radius: 8px;
    box-shadow: none;
  }

  .settings-workbench-content .semi-card + .semi-card,
  .settings-workbench-content .semi-banner + .semi-card {
    margin-top: 12px;
  }

  .settings-workbench-content .semi-banner {
    border-radius: 8px;
  }

  @media (max-width: 767px) {
    .settings-workbench-header {
      align-items: flex-start;
      padding: 14px;
    }

    .settings-workbench-tabs {
      padding: 10px;
    }

    .settings-workbench-content {
      padding: 10px;
    }
  }
`;

const Setting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabActiveKey, setTabActiveKey] = useState('operation');

  const panes = useMemo(() => {
    if (!isRoot()) {
      return [];
    }

    return [
      {
        label: t('运营设置'),
        Icon: Settings,
        content: <OperationSetting />,
        itemKey: 'operation',
      },
      {
        label: t('仪表盘设置'),
        Icon: LayoutDashboard,
        content: <DashboardSetting />,
        itemKey: 'dashboard',
      },
      {
        label: t('聊天设置'),
        Icon: MessageSquare,
        content: <ChatsSetting />,
        itemKey: 'chats',
      },
      {
        label: t('绘图设置'),
        Icon: Palette,
        content: <DrawingSetting />,
        itemKey: 'drawing',
      },
      {
        label: t('支付设置'),
        Icon: CreditCard,
        content: <PaymentSetting />,
        itemKey: 'payment',
      },
      {
        label: t('分组与模型定价设置'),
        Icon: Calculator,
        content: <RatioSetting />,
        itemKey: 'ratio',
      },
      {
        label: t('速率限制设置'),
        Icon: Gauge,
        content: <RateLimitSetting />,
        itemKey: 'ratelimit',
      },
      {
        label: t('模型相关设置'),
        Icon: Shapes,
        content: <ModelSetting />,
        itemKey: 'models',
      },
      {
        label: t('模型部署设置'),
        Icon: Server,
        content: <ModelDeploymentSetting />,
        itemKey: 'model-deployment',
      },
      {
        label: t('性能设置'),
        Icon: Activity,
        content: <PerformanceSetting />,
        itemKey: 'performance',
      },
      {
        label: t('系统设置'),
        Icon: Cog,
        content: <SystemSetting />,
        itemKey: 'system',
      },
      {
        label: t('其他设置'),
        Icon: MoreHorizontal,
        content: <OtherSetting />,
        itemKey: 'other',
      },
    ];
  }, [t]);

  const activePane =
    panes.find((pane) => pane.itemKey === tabActiveKey) || panes[0];

  const onChangeTab = (key) => {
    setTabActiveKey(key);
    navigate(`?tab=${key}`);
  };

  useEffect(() => {
    if (!panes.length) {
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');

    if (tab && panes.some((pane) => pane.itemKey === tab)) {
      setTabActiveKey(tab);
      return;
    }

    const fallbackKey = panes[0].itemKey;
    setTabActiveKey(fallbackKey);

    if (tab !== fallbackKey) {
      navigate(`?tab=${fallbackKey}`, { replace: true });
    }
  }, [location.search, navigate, panes]);

  return (
    <ConsoleShell wide contentClassName='mx-auto w-full max-w-[1440px]'>
      <style>{SETTINGS_SHELL_STYLES}</style>
      <div className='settings-workbench'>
        <div className='settings-workbench-header'>
          <div className='settings-workbench-title-row'>
            <span className='settings-workbench-icon'>
              {activePane && <activePane.Icon size={18} />}
            </span>
            <div className='min-w-0'>
              <div className='settings-workbench-kicker'>{t('系统设置')}</div>
              <h1 className='settings-workbench-title truncate'>
                {activePane?.label || t('系统设置')}
              </h1>
            </div>
          </div>

          <span className='settings-workbench-count'>
            {String(panes.length).padStart(2, '0')}
          </span>
        </div>

        <div className='settings-workbench-tabs'>
          <Tabs
            className='settings-premium-tabs'
            type='card'
            collapsible
            activeKey={tabActiveKey}
            onChange={(key) => onChangeTab(key)}
            tabBarExtraContent={null}
          >
            {panes.map((pane) => (
              <TabPane
                itemKey={pane.itemKey}
                key={pane.itemKey}
                tab={
                  <span className='settings-premium-tab-label'>
                    <span className='settings-premium-tab-icon'>
                      <pane.Icon size={14} />
                    </span>
                    <span>{pane.label}</span>
                  </span>
                }
              >
                {tabActiveKey === pane.itemKey && (
                  <div className='settings-workbench-content'>
                    {pane.content}
                  </div>
                )}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </ConsoleShell>
  );
};

export default Setting;
