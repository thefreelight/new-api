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
import { Link } from 'react-router-dom';
import { Typography, Tag } from '@douyinfe/semi-ui';
import SkeletonWrapper from '../components/SkeletonWrapper';

const HeaderLogo = ({
  logo,
  logoLoaded,
  isLoading,
  systemName,
  isSelfUseMode,
  isDemoSiteMode,
  t,
}) => {
  return (
    <Link to='/' className='group flex items-center gap-2'>
      <div className='relative h-5 w-5 overflow-hidden rounded-md bg-transparent dark:bg-zinc-900'>
        <SkeletonWrapper loading={isLoading || !logoLoaded} type='image' />
        <img
          src={logo}
          alt='logo'
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-200 ${!isLoading && logoLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className='hidden md:flex items-center gap-1.5'>
        <div className='flex items-center gap-2'>
          <SkeletonWrapper
            loading={isLoading}
            type='title'
            width={82}
            height={18}
          >
            <Typography.Title
              heading={4}
              className='!mb-0 !text-[13px] !font-semibold !leading-5 !text-[var(--console-text-strong)] dark:!text-zinc-100'
            >
              {systemName}
            </Typography.Title>
          </SkeletonWrapper>
          {(isSelfUseMode || isDemoSiteMode) && !isLoading && (
            <Tag color='white' className='!hidden' size='small' shape='circle'>
              {isSelfUseMode ? t('自用模式') : t('演示站点')}
            </Tag>
          )}
        </div>
      </div>
    </Link>
  );
};

export default HeaderLogo;
