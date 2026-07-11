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
  CircleCheck,
  Database,
  HardDrive,
  Server,
  TriangleAlert,
} from 'lucide-react';

/**
 * 数据库检查步骤组件
 * 显示当前数据库类型和相关警告信息
 */
const DatabaseStep = ({ setupStatus, renderNavigationButtons, t }) => {
  // 检测是否在 Electron 环境中运行
  const isElectron =
    typeof window !== 'undefined' && window.electron?.isElectron;
  const databaseType = setupStatus.database_type;
  const databaseLabel =
    databaseType === 'sqlite'
      ? 'SQLite'
      : databaseType === 'mysql'
        ? 'MySQL'
        : databaseType === 'postgres'
          ? 'PostgreSQL'
          : t('检测中');
  const isProductionDatabase =
    databaseType === 'postgres' || databaseType === 'mysql';

  return (
    <>
      <div
        className={`setup-db-status ${
          isProductionDatabase ? 'is-ready' : 'is-warning'
        }`}
      >
        <div className='setup-db-status-main'>
          <div className='setup-db-icon'>
            {isProductionDatabase ? (
              <Server size={24} />
            ) : (
              <HardDrive size={24} />
            )}
          </div>
          <div>
            <span className='setup-field-label'>{t('检测到的数据库')}</span>
            <h4>{databaseLabel}</h4>
            <p>
              {databaseType === 'postgres'
                ? t(
                    '已连接到生产 PostgreSQL，初始化数据会写入持久化关系型数据库。',
                  )
                : databaseType === 'mysql'
                  ? t('已连接到 MySQL，适合生产环境持久化运行。')
                  : isElectron
                    ? t('当前使用本地 SQLite 存储，适合桌面端单机运行。')
                    : t(
                        '当前使用 SQLite。容器环境请确保数据库文件已映射到持久化存储。',
                      )}
            </p>
          </div>
        </div>
        <div
          className={`setup-db-badge ${
            isProductionDatabase ? 'is-good' : 'is-caution'
          }`}
        >
          {isProductionDatabase ? (
            <CircleCheck size={16} />
          ) : (
            <TriangleAlert size={16} />
          )}
          {isProductionDatabase ? t('生产可用') : t('需要确认')}
        </div>
      </div>

      {databaseType === 'sqlite' && (
        <div className='setup-notice is-warning'>
          <TriangleAlert size={18} />
          <div>
            <strong>
              {isElectron ? t('本地数据存储') : t('请持久化数据库文件')}
            </strong>
            <p>
              {isElectron
                ? t('所有配置、用户和使用记录会保存到本机数据目录。')
                : t(
                    '如果这不是本地单机环境，请在容器重启前确认 SQLite 文件已经挂载到持久化存储。',
                  )}
            </p>
            {isElectron && window.electron?.dataDir && (
              <code className='setup-data-dir'>{window.electron.dataDir}</code>
            )}
          </div>
        </div>
      )}

      {isProductionDatabase && (
        <div className='setup-notice is-success'>
          <Database size={18} />
          <div>
            <strong>{t('数据库连接正常')}</strong>
            <p>{t('下一步将创建管理员账号，并写入首次运行所需的基础配置。')}</p>
          </div>
        </div>
      )}
      {renderNavigationButtons && renderNavigationButtons()}
    </>
  );
};

export default DatabaseStep;
