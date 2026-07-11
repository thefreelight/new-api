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

import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { Coins, Users, FileX, RefreshCw, Settings2 } from 'lucide-react';

import ModelPricingCombined from '../../pages/Setting/Ratio/ModelPricingCombined';
import GroupRatioSettings from '../../pages/Setting/Ratio/GroupRatioSettings';
import ModelRatioNotSetEditor from '../../pages/Setting/Ratio/ModelRationNotSetEditor';
import UpstreamRatioSync from '../../pages/Setting/Ratio/UpstreamRatioSync';
import ToolPriceSettings from '../../pages/Setting/Ratio/ToolPriceSettings';

import { API, showError, toBoolean } from '../../helpers';

const PREMIUM_SUBTAB_STYLES = `
  .settings-premium-subtabs.semi-tabs .semi-tabs-bar {
    margin-bottom: 8px !important;
  }

  .settings-premium-subtabs .semi-tabs-tab {
    min-height: 32px !important;
    margin: 0 6px 6px 0 !important;
    padding: 0 10px !important;
  }
`;

const tabLabel = (Icon, label) => (
  <span className='settings-premium-tab-label'>
    <span className='settings-premium-tab-icon'>
      <Icon size={16} />
    </span>
    <span>{label}</span>
  </span>
);

const RatioSetting = () => {
  const { t } = useTranslation();

  let [inputs, setInputs] = useState({
    ModelPrice: '',
    ModelRatio: '',
    CacheRatio: '',
    CreateCacheRatio: '',
    CompletionRatio: '',
    GroupRatio: '',
    GroupGroupRatio: '',
    ImageRatio: '',
    AudioRatio: '',
    AudioCompletionRatio: '',
    AutoGroups: '',
    DefaultUseAutoGroup: false,
    ExposeRatioEnabled: false,
    UserUsableGroups: '',
    'group_ratio_setting.group_special_usable_group': '',
  });

  const [loading, setLoading] = useState(false);

  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        if (item.value.startsWith('{') || item.value.startsWith('[')) {
          try {
            item.value = JSON.stringify(JSON.parse(item.value), null, 2);
          } catch (e) {
            // 如果后端返回的不是合法 JSON，直接展示
          }
        }
        if (['DefaultUseAutoGroup', 'ExposeRatioEnabled'].includes(item.key)) {
          newInputs[item.key] = toBoolean(item.value);
        } else {
          newInputs[item.key] = item.value;
        }
      });
      setInputs(newInputs);
    } else {
      showError(message);
    }
  };

  const onRefresh = async () => {
    try {
      setLoading(true);
      await getOptions();
    } catch (error) {
      showError('刷新失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Spin spinning={loading} size='large'>
      <style>{PREMIUM_SUBTAB_STYLES}</style>
      <div className='relative rounded-lg border border-[#e2e7ec] bg-white p-3 shadow-none sm:p-4'>
        <div className='relative'>
          <Tabs
            className='settings-premium-tabs settings-premium-subtabs'
            type='card'
            defaultActiveKey='pricing'
            contentStyle={{ paddingTop: 12 }}
          >
            <Tabs.TabPane
              tab={tabLabel(Coins, t('模型定价设置'))}
              itemKey='pricing'
            >
              <ModelPricingCombined options={inputs} refresh={onRefresh} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={tabLabel(Users, t('分组相关设置'))}
              itemKey='group'
            >
              <GroupRatioSettings options={inputs} refresh={onRefresh} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={tabLabel(FileX, t('未设置价格模型'))}
              itemKey='unset_models'
            >
              <ModelRatioNotSetEditor options={inputs} refresh={onRefresh} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={tabLabel(RefreshCw, t('上游价格同步'))}
              itemKey='upstream_sync'
            >
              <UpstreamRatioSync options={inputs} refresh={onRefresh} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={tabLabel(Settings2, t('工具调用定价'))}
              itemKey='tool_price'
            >
              <ToolPriceSettings options={inputs} />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </Spin>
  );
};

export default RatioSetting;
