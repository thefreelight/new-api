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
import { Button, Dropdown } from '@douyinfe/semi-ui';
import { Languages } from 'lucide-react';

const languageOptions = [
  { key: 'zh-CN', label: '简体中文' },
  { key: 'zh-TW', label: '繁體中文' },
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'Français' },
  { key: 'ja', label: '日本語' },
  { key: 'ru', label: 'Русский' },
  { key: 'vi', label: 'Tiếng Việt' },
];

const LanguageSelector = ({
  currentLang,
  onLanguageChange,
  t,
  buttonClassName,
  menuClassName,
}) => {
  const getItemClassName = (isSelected) =>
    isSelected
      ? '!bg-[#edf4ef] !font-medium !text-[#111722] dark:!bg-zinc-800 dark:!text-zinc-100'
      : 'hover:!bg-[#f1f3f0] hover:!text-[#111722] dark:hover:!bg-zinc-800/80 dark:hover:!text-zinc-100';

  return (
    <Dropdown
      position='bottomRight'
      render={
        <Dropdown.Menu
          className={
            menuClassName ||
            '!rounded-2xl !border !border-[#e3e7eb] !bg-[#fbfbf9]/95 !p-1.5 !shadow-[0_24px_60px_rgba(17,23,34,0.08)] backdrop-blur-xl dark:!border-zinc-800 dark:!bg-zinc-900/95 dark:!shadow-[0_24px_60px_rgba(0,0,0,0.35)]'
          }
        >
          {languageOptions.map((option) => (
            <Dropdown.Item
              key={option.key}
              onClick={() => onLanguageChange(option.key)}
              className={`!rounded-xl !px-3 !py-2 !text-sm !font-medium !text-[#5b6470] dark:!text-zinc-300 ${getItemClassName(
                currentLang === option.key,
              )}`}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      }
    >
      <span className='inline-flex'>
        <Button
          icon={<Languages size={18} />}
          aria-label={t('common.changeLanguage')}
          theme='borderless'
          type='tertiary'
          className={
            buttonClassName ||
            '!p-1.5 !text-current focus:!bg-semi-color-fill-1 dark:focus:!bg-gray-700 !rounded-full !bg-semi-color-fill-0 dark:!bg-semi-color-fill-1 hover:!bg-semi-color-fill-1 dark:hover:!bg-semi-color-fill-2'
          }
        />
      </span>
    </Dropdown>
  );
};

export default LanguageSelector;
