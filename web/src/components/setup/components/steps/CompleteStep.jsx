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
import { CheckCircle2, Database, Settings2, UserRound } from 'lucide-react';

/**
 * 完成步骤组件
 * 显示配置总结和初始化确认界面
 */
const CompleteStep = ({
  setupStatus,
  formData,
  renderNavigationButtons,
  t,
}) => {
  const databaseLabel =
    setupStatus.database_type === 'sqlite'
      ? 'SQLite'
      : setupStatus.database_type === 'mysql'
        ? 'MySQL'
        : setupStatus.database_type === 'postgres'
          ? 'PostgreSQL'
          : t('未检测');
  const usageModeLabel =
    formData.usageMode === 'external'
      ? t('对外运营模式')
      : formData.usageMode === 'self'
        ? t('自用模式')
        : t('演示站点模式');

  return (
    <div>
      <div className='setup-complete-hero'>
        <div className='setup-complete-icon'>
          <CheckCircle2 size={28} />
        </div>
        <div>
          <h4>{t('准备完成初始化')}</h4>
          <p>{t('请确认以下设置信息，点击"初始化系统"开始配置。')}</p>
        </div>
      </div>

      <div className='setup-review-list'>
        <div className='setup-review-row'>
          <span className='setup-review-icon'>
            <Database size={18} />
          </span>
          <span className='setup-review-label'>{t('数据库类型')}</span>
          <strong>{databaseLabel}</strong>
        </div>
        <div className='setup-review-row'>
          <span className='setup-review-icon'>
            <UserRound size={18} />
          </span>
          <span className='setup-review-label'>{t('管理员账号')}</span>
          <strong>
            {setupStatus.root_init
              ? t('已初始化')
              : formData.username || t('未设置')}
          </strong>
        </div>
        <div className='setup-review-row'>
          <span className='setup-review-icon'>
            <Settings2 size={18} />
          </span>
          <span className='setup-review-label'>{t('使用模式')}</span>
          <strong>{usageModeLabel}</strong>
        </div>
      </div>

      {renderNavigationButtons && renderNavigationButtons()}
    </div>
  );
};

export default CompleteStep;
