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
import PropTypes from 'prop-types';
import CompactModeToggle from './CompactModeToggle';

const TABLE_PAGE_DESCRIPTION_STYLES = `
  .admin-table-description {
    min-height: 58px;
    border: 0;
    background: transparent;
    color: var(--console-text);
  }

  .admin-table-description-icon {
    display: grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border: 1px solid #dce3ea;
    border-radius: 8px;
    background: #f7f9fb;
    color: var(--admin-table-accent, #2f5f8f);
  }

  .admin-table-description-code {
    display: inline-flex;
    align-items: center;
    border: 1px solid #dfe5eb;
    border-radius: 999px;
    background: #f8fafc;
    padding: 1px 7px;
    color: #697584;
    font-size: 11px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0;
  }

  .admin-table-description-title {
    min-width: 0;
    margin: 0;
    color: #141a22;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    letter-spacing: 0;
  }

  .admin-table-description-meta {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #697584;
    font-size: 12px;
    font-weight: 500;
    line-height: 18px;
  }

  .admin-table-description-meta-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--admin-table-accent, #2f5f8f);
  }

  .admin-table-description-toggle {
    border: 1px solid #dfe5eb;
    border-radius: 8px;
    background: #ffffff;
    padding: 4px;
  }

  .admin-table-description-toggle-button.semi-button {
    min-height: 28px;
    border-color: transparent;
    border-radius: 6px;
    background: transparent;
    color: #4c5968;
    box-shadow: none;
  }

  .admin-table-description-toggle-button.semi-button:hover,
  .admin-table-description-toggle-button.semi-button:focus {
    border-color: #cfd8e2;
    background: #f3f6f9;
    color: #141a22;
  }
`;

const TablePageDescription = ({
  code,
  title,
  icon,
  compactMode,
  setCompactMode,
  t,
  accent = '#2f5f8f',
}) => {
  const activeModeLabel = compactMode ? t('紧凑列表') : t('自适应列表');

  return (
    <>
      <style>{TABLE_PAGE_DESCRIPTION_STYLES}</style>
      <div
        className='admin-table-description flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between'
        style={{ '--admin-table-accent': accent }}
      >
        <div className='flex min-w-0 items-center gap-3'>
          <div className='admin-table-description-icon shrink-0'>{icon}</div>

          <div className='min-w-0'>
            <div className='flex min-w-0 items-center gap-2'>
              {code && (
                <span className='admin-table-description-code'>{code}</span>
              )}
              <h1 className='admin-table-description-title truncate'>
                {title}
              </h1>
            </div>

            <div className='admin-table-description-meta mt-1'>
              <span className='admin-table-description-meta-dot' />
              <span>{activeModeLabel}</span>
            </div>
          </div>
        </div>

        <div className='admin-table-description-toggle flex shrink-0'>
          <CompactModeToggle
            compactMode={compactMode}
            setCompactMode={setCompactMode}
            t={t}
            className='admin-table-description-toggle-button'
          />
        </div>
      </div>
    </>
  );
};

TablePageDescription.propTypes = {
  code: PropTypes.string,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  compactMode: PropTypes.bool.isRequired,
  setCompactMode: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  accent: PropTypes.string,
};

export default TablePageDescription;
