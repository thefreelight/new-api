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
import { Button } from '@douyinfe/semi-ui';
import { RefreshCw, Search } from 'lucide-react';

const DashboardHeader = ({
  getGreeting,
  greetingVisible,
  showSearchModal,
  refresh,
  loading,
  t,
}) => {
  const secondaryActionClassName =
    'h-8 !rounded-lg !border !border-[var(--console-border)] !bg-white px-3 !text-xs !font-medium !text-[var(--console-text-muted)] shadow-none transition-colors duration-150 hover:!border-[var(--console-border-strong)] hover:!bg-[var(--console-panel-soft)] hover:!text-[var(--console-text-strong)]';
  const primaryActionClassName =
    'h-8 !rounded-lg !border-0 !bg-[var(--console-accent)] px-3 !text-xs !font-medium !text-white shadow-none transition duration-150 hover:!bg-[var(--console-accent-strong)]';

  return (
    <header className='mb-3'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0'>
          <h1 className='text-lg font-semibold leading-6 text-[var(--console-text-strong)]'>
            {t('概览')}
          </h1>
          <p
            className='mt-1 truncate text-xs leading-5 text-[var(--console-text-muted)] transition-opacity duration-300'
            style={{ opacity: greetingVisible ? 1 : 0 }}
          >
            {getGreeting}
          </p>
        </div>

        <div className='flex shrink-0 items-center gap-2'>
          <Button
            type='tertiary'
            icon={<Search size={15} />}
            onClick={showSearchModal}
            className={secondaryActionClassName}
          >
            {t('搜索')}
          </Button>
          <Button
            theme='solid'
            type='primary'
            icon={<RefreshCw size={15} />}
            onClick={refresh}
            loading={loading}
            className={primaryActionClassName}
          >
            {t('刷新')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
