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
import { Form } from '@douyinfe/semi-ui';
import { MonitorPlay, Store, UserRound } from 'lucide-react';

/**
 * 使用模式选择步骤组件
 * 提供系统使用模式的选择界面
 */
const UsageModeStep = ({
  formData,
  handleUsageModeChange,
  renderNavigationButtons,
  t,
}) => {
  const modes = [
    {
      value: 'external',
      title: t('对外运营模式'),
      description: t('适用于为多个用户提供服务的场景'),
      detail: t('开启完整用户、额度、价格和渠道运营能力。'),
      icon: Store,
    },
    {
      value: 'self',
      title: t('自用模式'),
      description: t('适用于个人使用的场景，不需要设置模型价格'),
      detail: t('保留核心代理能力，减少面向客户的运营配置。'),
      icon: UserRound,
    },
    {
      value: 'demo',
      title: t('演示站点模式'),
      description: t('适用于展示系统功能的场景，提供基础功能演示'),
      detail: t('适合产品演示、试用和临时验证。'),
      icon: MonitorPlay,
    },
  ];

  return (
    <>
      <Form.Input
        field='usageMode'
        noLabel
        initValue={formData.usageMode}
        style={{ display: 'none' }}
      />
      <div className='setup-mode-grid' aria-label={t('使用模式选择')}>
        {modes.map((mode) => {
          const ModeIcon = mode.icon;
          const selected = formData.usageMode === mode.value;

          return (
            <button
              key={mode.value}
              type='button'
              className={`setup-mode-card ${selected ? 'is-selected' : ''}`}
              onClick={() => handleUsageModeChange(mode.value)}
            >
              <span className='setup-mode-icon'>
                <ModeIcon size={20} />
              </span>
              <span className='setup-mode-title'>{mode.title}</span>
              <span className='setup-mode-description'>{mode.description}</span>
              <span className='setup-mode-detail'>{mode.detail}</span>
            </button>
          );
        })}
      </div>
      {renderNavigationButtons && renderNavigationButtons()}
    </>
  );
};

export default UsageModeStep;
