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
import NewYearButton from './NewYearButton';
import NotificationButton from './NotificationButton';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import UserArea from './UserArea';

const ActionButtons = ({
  isNewYear,
  unreadCount,
  onNoticeOpen,
  theme,
  onThemeToggle,
  currentLang,
  onLanguageChange,
  userState,
  isLoading,
  isMobile,
  isSelfUseMode,
  logout,
  navigate,
  t,
}) => {
  const utilityGroupClassName =
    'flex items-center gap-0.5 rounded-md border border-[var(--console-divider)] bg-white p-0.5 shadow-none dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none';
  const utilityButtonClassName =
    'flex !h-7 !w-7 items-center justify-center !rounded-md !border !border-transparent !bg-transparent !p-0 !text-[var(--console-text-muted)] !shadow-none transition-colors duration-150 hover:!border-transparent hover:!bg-[var(--console-accent-soft)] hover:!text-[var(--console-text-strong)] focus:!border-transparent focus:!bg-[var(--console-accent-soft)] focus:!text-[var(--console-text-strong)] dark:!text-zinc-400 dark:hover:!border-zinc-800 dark:hover:!bg-zinc-800/80 dark:hover:!text-zinc-100 dark:focus:!border-zinc-800 dark:focus:!bg-zinc-800/80 dark:focus:!text-zinc-100';
  const utilityMenuClassName =
    '!min-w-[12.5rem] !rounded-lg !border !border-[var(--console-border)] !bg-white !p-1.5 !shadow-[0_18px_48px_rgba(24,24,20,0.08)] dark:!border-zinc-800 dark:!bg-zinc-900/95 dark:!shadow-[0_24px_60px_rgba(0,0,0,0.35)]';

  return (
    <div className='flex items-center gap-1.5 md:gap-2'>
      <div className={utilityGroupClassName}>
        <NewYearButton isNewYear={isNewYear} />

        <NotificationButton
          unreadCount={unreadCount}
          onNoticeOpen={onNoticeOpen}
          t={t}
          buttonClassName={utilityButtonClassName}
        />

        <ThemeToggle
          theme={theme}
          onThemeToggle={onThemeToggle}
          t={t}
          buttonClassName={utilityButtonClassName}
          menuClassName={utilityMenuClassName}
        />

        <LanguageSelector
          currentLang={currentLang}
          onLanguageChange={onLanguageChange}
          t={t}
          buttonClassName={utilityButtonClassName}
          menuClassName={utilityMenuClassName}
        />
      </div>

      <UserArea
        userState={userState}
        isLoading={isLoading}
        isMobile={isMobile}
        isSelfUseMode={isSelfUseMode}
        logout={logout}
        navigate={navigate}
        t={t}
      />
    </div>
  );
};

export default ActionButtons;
