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

import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, Button, Dropdown, Typography } from '@douyinfe/semi-ui';
import { ChevronDown } from 'lucide-react';
import {
  IconExit,
  IconUserSetting,
  IconCreditCard,
  IconKey,
} from '@douyinfe/semi-icons';
import { stringToColor } from '../../../helpers';
import SkeletonWrapper from '../components/SkeletonWrapper';

const UserArea = ({
  userState,
  isLoading,
  isMobile,
  isSelfUseMode,
  logout,
  navigate,
  t,
}) => {
  const dropdownRef = useRef(null);
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';
  const isRegisterRoute = location.pathname === '/register';
  const isResetRoute =
    location.pathname === '/reset' || location.pathname === '/user/reset';
  const isAuthRoute = isLoginRoute || isRegisterRoute || isResetRoute;
  const dropdownMenuClassName =
    '!rounded-lg !border !border-[var(--console-border)] !bg-white !p-1 !shadow-[0_18px_48px_rgba(24,24,20,0.08)]';
  const dropdownItemClassName =
    '!rounded-md !px-3 !py-2 !text-sm !font-medium !text-[var(--console-text)] transition-colors duration-150 hover:!bg-[var(--console-accent-soft)] hover:!text-[var(--console-text-strong)]';
  const dropdownDangerItemClassName =
    '!rounded-md !px-3 !py-2 !text-sm !font-medium !text-[#8a3d3d] transition-colors duration-150 hover:!bg-[#f8eceb] hover:!text-[#6f2525]';
  const dropdownIconClassName = 'text-[var(--console-text-muted)]';
  const guestButtonBaseClassName =
    'flex h-9 items-center justify-center !rounded-md !px-3 text-sm font-medium transition duration-200';
  const authButtonTextClassName = '!text-sm !text-inherit';
  if (isLoading) {
    return (
      <SkeletonWrapper
        loading={true}
        type='userArea'
        width={50}
        isMobile={isMobile}
      />
    );
  }

  if (userState.user) {
    return (
      <div className='relative' ref={dropdownRef}>
        <Dropdown
          position='bottomRight'
          getPopupContainer={() => dropdownRef.current}
          render={
            <Dropdown.Menu className={dropdownMenuClassName}>
              <Dropdown.Item
                onClick={() => {
                  navigate('/console/personal');
                }}
                className={dropdownItemClassName}
              >
                <div className='flex items-center gap-2'>
                  <IconUserSetting
                    size='small'
                    className={dropdownIconClassName}
                  />
                  <span>{t('个人设置')}</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  navigate('/console/token');
                }}
                className={dropdownItemClassName}
              >
                <div className='flex items-center gap-2'>
                  <IconKey size='small' className={dropdownIconClassName} />
                  <span>{t('令牌管理')}</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  navigate('/console/topup');
                }}
                className={dropdownItemClassName}
              >
                <div className='flex items-center gap-2'>
                  <IconCreditCard
                    size='small'
                    className={dropdownIconClassName}
                  />
                  <span>{t('钱包管理')}</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item
                onClick={logout}
                className={dropdownDangerItemClassName}
              >
                <div className='flex items-center gap-2'>
                  <IconExit size='small' className='text-[#b26b6b]' />
                  <span>{t('退出')}</span>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Button
            theme='borderless'
            type='tertiary'
            className='flex !h-8 items-center gap-1.5 !rounded-md border border-[var(--console-border)] !bg-white !px-1.5 !py-1 shadow-none transition-colors duration-150 hover:!border-[var(--console-border-strong)] hover:!bg-[var(--console-panel-soft)]'
          >
            <Avatar
              size='extra-small'
              color={stringToColor(userState.user.username)}
              className='mr-0.5'
            >
              {userState.user.username[0].toUpperCase()}
            </Avatar>
            <span className='hidden max-w-[132px] md:inline'>
              <Typography.Text className='mr-1 block truncate !text-xs !font-medium !text-[var(--console-text-muted)]'>
                {userState.user.username}
              </Typography.Text>
            </span>
            <ChevronDown
              size={14}
              className='text-[var(--console-text-muted)]'
            />
          </Button>
        </Dropdown>
      </div>
    );
  } else {
    if (isAuthRoute) {
      return null;
    }

    const showRegisterButton = !isSelfUseMode && !isRegisterRoute;
    const showLoginButton = !isLoginRoute;

    const loginButtonClasses = `${guestButtonBaseClassName} border border-[var(--console-border)] !bg-white !text-[var(--console-text)] hover:!border-[var(--console-border-strong)] hover:!bg-[var(--console-panel-soft)]`;
    const registerButtonClasses = `${guestButtonBaseClassName} min-w-[72px] !bg-[var(--console-accent)] !text-white shadow-none hover:!bg-[var(--console-accent-strong)]`;

    return (
      <div className='flex items-center gap-2'>
        {showLoginButton && (
          <Link to='/login' className='flex'>
            <Button
              theme='borderless'
              type='tertiary'
              className={loginButtonClasses}
            >
              <span className={authButtonTextClassName}>{t('登录')}</span>
            </Button>
          </Link>
        )}
        {showRegisterButton && (
          <div className='hidden md:block'>
            <Link to='/register' className='flex'>
              <Button
                theme='solid'
                type='primary'
                className={registerButtonClasses}
              >
                <span className='!text-sm !text-white'>{t('注册')}</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }
};

export default UserArea;
