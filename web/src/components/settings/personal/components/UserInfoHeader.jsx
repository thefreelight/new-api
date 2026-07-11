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
import { Avatar, Card } from '@douyinfe/semi-ui';
import {
  getSystemName,
  isRoot,
  isAdmin,
  renderQuota,
  stringToColor,
} from '../../../../helpers';
import { Coins, BarChart2, Users } from 'lucide-react';

const DISPLAY_FONT_STYLE = {
  fontFamily:
    '"Avenir Next", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
};

const UserInfoHeader = ({ t, userState }) => {
  const username = userState?.user?.username || 'null';
  const userId = userState?.user?.id;
  const userRole = isRoot()
    ? t('超级管理员')
    : isAdmin()
      ? t('管理员')
      : t('普通用户');
  const brandName = getSystemName();
  const displayBrandName =
    !brandName || brandName === 'New API' ? 'NavtoAI' : brandName;

  const getAvatarText = () => {
    if (username && username.length > 0) {
      return username.slice(0, 2).toUpperCase();
    }
    return 'NA';
  };

  const summaryItems = [
    {
      label: t('历史消耗'),
      value: renderQuota(userState?.user?.used_quota),
      Icon: Coins,
    },
    {
      label: t('请求次数'),
      value: userState?.user?.request_count || 0,
      Icon: BarChart2,
    },
    {
      label: t('用户分组'),
      value: userState?.user?.group || t('默认'),
      Icon: Users,
    },
  ];

  return (
    <Card
      className='relative overflow-hidden !rounded-lg border border-[var(--console-border)] bg-white p-[1px] shadow-[var(--console-shadow)] [&_.semi-card-body]:!p-0'
      bodyStyle={{ padding: 0 }}
    >
      <div className='relative overflow-hidden rounded-md bg-[#fbfaf8] px-5 py-5 sm:px-7 sm:py-7'>
        <div className='pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,rgba(255,90,31,0)_0%,rgba(255,90,31,0.45)_50%,rgba(255,90,31,0)_100%)]' />

        <div className='relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between'>
          <div className='flex min-w-0 items-start gap-4 sm:gap-5'>
            <div className='relative shrink-0'>
              <div className='relative grid h-[92px] w-[92px] place-items-center rounded-lg border border-[#e0e3e8] bg-white shadow-[0_18px_42px_rgba(17,23,34,0.08)]'>
                <Avatar
                  color={stringToColor(username)}
                  style={{ width: 74, height: 74, fontSize: 22 }}
                >
                  {getAvatarText()}
                </Avatar>
              </div>
            </div>

            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-2 text-xs font-medium text-[var(--console-text-muted)]'>
                <span className='rounded-full border border-[rgba(255,90,31,0.24)] bg-white px-3 py-1 uppercase tracking-[0.2em] text-[#ff5a1f]'>
                  {displayBrandName}
                </span>
                <span className='rounded-full border border-[#e0e3e8] bg-white px-3 py-1'>
                  {userRole}
                </span>
                <span className='rounded-full border border-[#e0e3e8] bg-white px-3 py-1'>
                  ID {userId}
                </span>
              </div>

              <div
                className='mt-4 truncate text-[38px] leading-none tracking-[0] text-[#111722] sm:text-[50px]'
                style={DISPLAY_FONT_STYLE}
              >
                {username}
              </div>

              <div className='mt-4 text-sm leading-7 text-[#626b76]'>
                {t('用户分组')} ·{' '}
                <span className='font-medium text-[#111722]'>
                  {userState?.user?.group || t('默认')}
                </span>
              </div>
            </div>
          </div>

          <div className='min-w-[280px] rounded-lg border border-[#e0e3e8] bg-white p-5 shadow-[0_18px_44px_rgba(17,23,34,0.06)]'>
            <div className='flex items-center justify-between gap-3'>
              <div className='text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ff5a1f]'>
                {t('当前余额')}
              </div>
              <span className='rounded-full border border-[#e0e3e8] bg-[#fbfaf8] px-2.5 py-1 text-[11px] font-medium text-[#626b76]'>
                {userState?.user?.group || t('默认')}
              </span>
            </div>

            <div
              className='mt-5 break-all text-[40px] leading-none tracking-[0] text-[#111722] sm:text-[46px]'
              style={DISPLAY_FONT_STYLE}
            >
              {renderQuota(userState?.user?.quota)}
            </div>
          </div>
        </div>

        <div className='mt-6 grid gap-3 md:grid-cols-3'>
          {summaryItems.map(({ label, value, Icon }) => (
            <div
              key={label}
              className='rounded-lg border border-[#e0e3e8] bg-white p-4 shadow-[0_14px_34px_rgba(17,23,34,0.06)]'
            >
              <div className='flex items-start gap-3'>
                <div className='grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#e0e3e8] bg-[#fbfaf8] text-[#ff5a1f]'>
                  <Icon size={17} />
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='text-[11px] uppercase tracking-[0.16em] text-[#8a929d]'>
                    {label}
                  </div>
                  <div className='mt-2 break-all text-lg font-semibold tracking-[0] text-[#111722]'>
                    {value}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default UserInfoHeader;
