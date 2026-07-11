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

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  Card,
  Skeleton,
  Pagination,
  Empty,
  Button,
  Collapsible,
} from '@douyinfe/semi-ui';
import { IconChevronDown, IconChevronUp } from '@douyinfe/semi-icons';
import PropTypes from 'prop-types';
import { useIsMobile } from '../../../hooks/common/useIsMobile';
import { useMinimumLoadingTime } from '../../../hooks/common/useMinimumLoadingTime';

const CARD_TABLE_SURFACE_STYLES = `
  .card-table-desktop-table.semi-table-wrapper {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--console-border);
    border-radius: 32px;
    background:
      radial-gradient(circle at top left, rgba(126, 199, 164, 0.12), transparent 28%),
      radial-gradient(circle at top right, rgba(196, 164, 107, 0.08), transparent 32%),
      linear-gradient(180deg, rgba(13, 18, 28, 0.98) 0%, rgba(7, 11, 17, 1) 100%);
    box-shadow: var(--console-shadow);
  }

  .card-table-desktop-table.semi-table-wrapper::before,
  .card-table-mobile-card.semi-card::before,
  .card-table-empty::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background:
      linear-gradient(
        90deg,
        rgba(196, 164, 107, 0) 0%,
        rgba(196, 164, 107, 0.78) 48%,
        rgba(126, 199, 164, 0.52) 100%
      );
    pointer-events: none;
    z-index: 1;
  }

  .card-table-desktop-table .semi-table,
  .card-table-desktop-table .semi-table-tbody > .semi-table-row,
  .card-table-desktop-table .semi-table-header,
  .card-table-desktop-table .semi-table-placeholder {
    background: transparent;
  }

  .card-table-desktop-table .semi-table-thead > .semi-table-row > .semi-table-row-head,
  .card-table-desktop-table .semi-table-header-sticky .semi-table-thead > .semi-table-row > .semi-table-row-head {
    background: rgba(12, 18, 27, 0.74);
    color: var(--console-accent-warm);
    border-bottom: 1px solid var(--console-divider);
    padding-top: 16px;
    padding-bottom: 16px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row > .semi-table-row-cell,
  .card-table-desktop-table .semi-table-thead > .semi-table-row > .semi-table-row-head {
    color: var(--console-text-strong);
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    background: transparent;
    border-bottom: 1px solid var(--console-divider);
    padding-top: 18px;
    padding-bottom: 18px;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:nth-child(even) > .semi-table-row-cell {
    background-color: rgba(255, 255, 255, 0.018);
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:last-child > .semi-table-row-cell,
  .card-table-desktop-table .semi-table-placeholder {
    border-bottom: none;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell {
    background-image: linear-gradient(90deg, rgba(126, 199, 164, 0.08), rgba(196, 164, 107, 0.05));
    background-color: rgba(18, 25, 37, 0.86);
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left,
  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right {
    background-image: linear-gradient(90deg, rgba(126, 199, 164, 0.08), rgba(196, 164, 107, 0.05));
    background-color: rgba(18, 25, 37, 0.96);
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left::before,
  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right::before {
    background: transparent;
  }

  .card-table-desktop-table .semi-table-column-filter,
  .card-table-desktop-table .semi-table-column-sorter-up,
  .card-table-desktop-table .semi-table-column-sorter-down,
  .card-table-desktop-table .semi-table-expand-icon {
    color: var(--console-text-faint);
  }

  .card-table-desktop-table .semi-table-placeholder {
    padding: 40px 18px;
    color: var(--console-text-muted);
  }

  .card-table-desktop-table .semi-table-pagination-outer {
    min-height: 0;
    padding: 18px 20px 22px;
    border-top: 1px solid var(--console-divider);
    color: var(--console-text-muted);
    background: rgba(10, 14, 21, 0.58);
  }

  .card-table-desktop-table .semi-table-pagination-outer .semi-page-item,
  .card-table-desktop-table .semi-table-pagination-outer .semi-page-item-button,
  .card-table-desktop-table .semi-table-pagination-outer .semi-page-item .semi-icon,
  .card-table-desktop-table .semi-table-pagination-outer .semi-page-total,
  .card-table-desktop-table .semi-table-pagination-outer .semi-page-size {
    color: var(--console-text-muted);
  }

  .card-table-desktop-table .semi-table-body::-webkit-scrollbar-thumb {
    background: rgba(148, 162, 179, 0.36);
    border-radius: 999px;
  }

  .card-table-desktop-table .semi-empty-description,
  .card-table-desktop-table .semi-empty-content,
  .card-table-desktop-table .semi-empty-title {
    color: var(--console-text-muted);
  }

  .card-table-mobile-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .card-table-mobile-card.semi-card,
  .card-table-empty {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--console-border);
    border-radius: 28px;
    background:
      radial-gradient(circle at top left, rgba(126, 199, 164, 0.12), transparent 28%),
      linear-gradient(180deg, rgba(15, 21, 31, 0.96) 0%, rgba(7, 11, 17, 1) 100%);
    box-shadow: var(--console-shadow-soft);
  }

  .card-table-mobile-card .semi-card-body {
    position: relative;
    padding: 0;
  }

  .card-table-mobile-inner,
  .card-table-skeleton-block {
    padding: 18px 18px 16px;
  }

  .card-table-mobile-row,
  .card-table-skeleton-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid var(--console-divider);
  }

  .card-table-mobile-row--plain,
  .card-table-skeleton-row--plain {
    justify-content: flex-end;
  }

  .card-table-mobile-row--last,
  .card-table-skeleton-row--last {
    border-bottom: none;
    padding-bottom: 0;
  }

  .card-table-mobile-label {
    flex-shrink: 0;
    margin-right: 8px;
    color: var(--console-accent-warm);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: uppercase;
    user-select: none;
  }

  .card-table-mobile-value {
    min-width: 0;
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
    color: var(--console-text-strong);
    text-align: right;
    word-break: break-word;
  }

  .card-table-mobile-toggle.semi-button {
    width: 100%;
    min-height: 42px;
    margin-top: 16px;
    border-radius: 18px;
    border: 1px solid rgba(196, 164, 107, 0.18);
    background: rgba(7, 11, 17, 0.76);
    color: var(--console-text-muted);
    justify-content: center;
  }

  .card-table-mobile-toggle.semi-button:hover,
  .card-table-mobile-toggle.semi-button:focus {
    border-color: rgba(196, 164, 107, 0.3);
    background: rgba(18, 25, 37, 0.94);
    color: var(--console-text-strong);
  }

  .card-table-mobile-details {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid var(--console-divider);
    color: var(--console-text-muted);
  }

  .card-table-mobile-pagination {
    align-self: center;
    margin-top: 4px;
    padding: 4px 10px;
    border: 1px solid var(--console-border);
    border-radius: 20px;
    background: rgba(10, 14, 21, 0.82);
    box-shadow: 0 12px 30px rgba(1, 3, 7, 0.26);
  }

  .card-table-mobile-pagination .semi-page-item,
  .card-table-mobile-pagination .semi-page-item-button,
  .card-table-mobile-pagination .semi-page-item .semi-icon,
  .card-table-mobile-pagination .semi-page-total,
  .card-table-mobile-pagination .semi-page-size {
    color: var(--console-text-muted);
  }

  .card-table-empty {
    padding: 12px;
  }

  .card-table-empty .semi-empty {
    padding: 28px 10px;
  }

  .card-table-empty .semi-empty-title,
  .card-table-empty .semi-empty-content,
  .card-table-empty .semi-empty-description {
    color: var(--console-text-muted);
  }

  .card-table-desktop-table.semi-table-wrapper,
  .card-table-mobile-card.semi-card,
  .card-table-empty {
    border-color: #e0e3e8 !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    box-shadow: 0 22px 66px rgba(17, 23, 34, 0.08) !important;
  }

  .card-table-desktop-table.semi-table-wrapper::before,
  .card-table-mobile-card.semi-card::before,
  .card-table-empty::before {
    background: linear-gradient(90deg, rgba(255, 90, 31, 0), rgba(255, 90, 31, 0.72), rgba(255, 90, 31, 0)) !important;
  }

  .card-table-desktop-table .semi-table-thead > .semi-table-row > .semi-table-row-head,
  .card-table-desktop-table .semi-table-header-sticky .semi-table-thead > .semi-table-row > .semi-table-row-head {
    background: #f6f6f6 !important;
    color: #111722 !important;
    border-bottom-color: #eceef1 !important;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row > .semi-table-row-cell,
  .card-table-desktop-table .semi-table-thead > .semi-table-row > .semi-table-row-head {
    color: #171d27 !important;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    border-bottom-color: #eceef1 !important;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:nth-child(even) > .semi-table-row-cell {
    background-color: #fbfaf8 !important;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell,
  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left,
  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right {
    background-image: none !important;
    background-color: #fff5ef !important;
  }

  .card-table-desktop-table .semi-table-column-filter,
  .card-table-desktop-table .semi-table-column-sorter-up,
  .card-table-desktop-table .semi-table-column-sorter-down,
  .card-table-desktop-table .semi-table-expand-icon,
  .card-table-desktop-table .semi-table-placeholder,
  .card-table-desktop-table .semi-empty-description,
  .card-table-desktop-table .semi-empty-content,
  .card-table-desktop-table .semi-empty-title {
    color: #626b76 !important;
  }

  .card-table-desktop-table .semi-table-pagination-outer,
  .card-table-mobile-pagination {
    border-color: #eceef1 !important;
    background: #ffffff !important;
    color: #626b76 !important;
    box-shadow: none !important;
  }

  .card-table-mobile-row,
  .card-table-skeleton-row,
  .card-table-mobile-details {
    border-color: #eceef1 !important;
  }

  .card-table-mobile-label {
    color: #ff5a1f !important;
  }

  .card-table-mobile-value {
    color: #171d27 !important;
  }

  .card-table-mobile-toggle.semi-button {
    border-color: #e0e3e8 !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    color: #626b76 !important;
  }

  .card-table-mobile-toggle.semi-button:hover,
  .card-table-mobile-toggle.semi-button:focus {
    border-color: rgba(255, 90, 31, 0.3) !important;
    background: #fff5ef !important;
    color: #0f131a !important;
  }

  .card-table-desktop-table.semi-table-wrapper,
  .card-table-mobile-card.semi-card,
  .card-table-empty {
    overflow: hidden !important;
    border: 1px solid #e2e7ec !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    box-shadow: none !important;
  }

  .card-table-desktop-table.semi-table-wrapper::before,
  .card-table-mobile-card.semi-card::before,
  .card-table-empty::before {
    display: none !important;
  }

  .card-table-desktop-table .semi-table,
  .card-table-desktop-table .semi-table-tbody > .semi-table-row,
  .card-table-desktop-table .semi-table-header,
  .card-table-desktop-table .semi-table-placeholder {
    background: #ffffff !important;
  }

  .card-table-desktop-table .semi-table-thead > .semi-table-row > .semi-table-row-head,
  .card-table-desktop-table .semi-table-header-sticky .semi-table-thead > .semi-table-row > .semi-table-row-head {
    background: #f6f8fa !important;
    color: #4c5968 !important;
    border-bottom-color: #e2e7ec !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    font-size: 12px !important;
    font-weight: 600 !important;
    line-height: 18px !important;
    text-transform: none !important;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row > .semi-table-row-cell,
  .card-table-desktop-table .semi-table-thead > .semi-table-row > .semi-table-row-head {
    color: #17202b !important;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row > .semi-table-row-cell {
    background: #ffffff !important;
    border-bottom-color: #eef2f5 !important;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    font-size: 13px !important;
    line-height: 18px !important;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:nth-child(even) > .semi-table-row-cell {
    background-color: #ffffff !important;
  }

  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell,
  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-left,
  .card-table-desktop-table .semi-table-tbody > .semi-table-row:hover > .semi-table-row-cell.semi-table-cell-fixed-right {
    background-image: none !important;
    background-color: #f4f7fa !important;
  }

  .card-table-desktop-table .semi-table-placeholder {
    padding: 58px 18px !important;
    color: #697584 !important;
  }

  .card-table-desktop-table .semi-empty {
    padding: 28px 10px !important;
  }

  .card-table-desktop-table .semi-empty img,
  .card-table-empty .semi-empty img {
    max-width: 118px !important;
    max-height: 118px !important;
  }

  .card-table-desktop-table .semi-empty .semi-empty-image svg,
  .card-table-empty .semi-empty .semi-empty-image svg {
    width: 118px !important;
    height: 118px !important;
  }

  .card-table-desktop-table .semi-table-column-filter,
  .card-table-desktop-table .semi-table-column-sorter-up,
  .card-table-desktop-table .semi-table-column-sorter-down,
  .card-table-desktop-table .semi-table-expand-icon,
  .card-table-desktop-table .semi-empty-description,
  .card-table-desktop-table .semi-empty-content,
  .card-table-desktop-table .semi-empty-title {
    color: #697584 !important;
  }

  .card-table-mobile-list {
    gap: 10px !important;
  }

  .card-table-mobile-card.semi-card,
  .card-table-empty {
    background: #ffffff !important;
  }

  .card-table-mobile-inner,
  .card-table-skeleton-block {
    padding: 12px 14px !important;
  }

  .card-table-mobile-row,
  .card-table-skeleton-row,
  .card-table-mobile-details {
    border-color: #eef2f5 !important;
  }

  .card-table-mobile-row,
  .card-table-skeleton-row {
    padding: 9px 0 !important;
  }

  .card-table-mobile-label {
    color: #697584 !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    text-transform: none !important;
  }

  .card-table-mobile-value {
    color: #17202b !important;
    font-size: 13px !important;
  }

  .card-table-mobile-toggle.semi-button {
    min-height: 30px !important;
    margin-top: 10px !important;
    border-color: #dfe5eb !important;
    border-radius: 6px !important;
    background: #ffffff !important;
    color: #4c5968 !important;
  }

  .card-table-mobile-toggle.semi-button:hover,
  .card-table-mobile-toggle.semi-button:focus {
    border-color: #cfd8e2 !important;
    background: #f3f6f9 !important;
    color: #141a22 !important;
  }

  .card-table-desktop-table .semi-table-pagination-outer,
  .card-table-mobile-pagination {
    border-color: #e2e7ec !important;
    background: #ffffff !important;
    color: #697584 !important;
    box-shadow: none !important;
  }
`;

const CARD_TABLE_BODY_STYLE = { padding: 0 };

/**
 * CardTable 响应式表格组件
 *
 * 在桌面端渲染 Semi-UI 的 Table 组件，在移动端则将每一行数据渲染成 Card 形式。
 * 该组件与 Table 组件的大部分 API 保持一致，只需将原 Table 换成 CardTable 即可。
 */
const CardTable = ({
  columns = [],
  dataSource = [],
  loading = false,
  rowKey = 'key',
  hidePagination = false,
  ...tableProps
}) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const mergedDesktopClassName = [
    'card-table-desktop-table',
    tableProps.className,
  ]
    .filter(Boolean)
    .join(' ');

  const showSkeleton = useMinimumLoadingTime(loading);

  const getRowKey = (record, index) => {
    if (typeof rowKey === 'function') return rowKey(record);
    return record[rowKey] !== undefined ? record[rowKey] : index;
  };

  if (!isMobile) {
    const finalTableProps = hidePagination
      ? { ...tableProps, pagination: false }
      : tableProps;

    return (
      <>
        <style>{CARD_TABLE_SURFACE_STYLES}</style>
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={rowKey}
          {...finalTableProps}
          className={mergedDesktopClassName}
        />
      </>
    );
  }

  if (showSkeleton) {
    const visibleCols = columns.filter((col) => {
      if (tableProps?.visibleColumns && col.key) {
        return tableProps.visibleColumns[col.key];
      }
      return true;
    });

    const renderSkeletonCard = (key) => {
      const placeholder = (
        <div className='card-table-skeleton-block'>
          {visibleCols.map((col, idx) => {
            const isLastColumn = idx === visibleCols.length - 1;

            if (!col.title) {
              return (
                <div
                  key={idx}
                  className={`card-table-skeleton-row card-table-skeleton-row--plain ${
                    isLastColumn ? 'card-table-skeleton-row--last' : ''
                  }`}
                >
                  <Skeleton.Title active style={{ width: 100, height: 24 }} />
                </div>
              );
            }

            return (
              <div
                key={idx}
                className={`card-table-skeleton-row ${
                  isLastColumn ? 'card-table-skeleton-row--last' : ''
                }`}
              >
                <Skeleton.Title active style={{ width: 80, height: 14 }} />
                <Skeleton.Title
                  active
                  style={{
                    width: `${50 + (idx % 3) * 10}%`,
                    maxWidth: 180,
                    height: 14,
                  }}
                />
              </div>
            );
          })}
        </div>
      );

      return (
        <Card
          key={key}
          className='card-table-mobile-card'
          bodyStyle={CARD_TABLE_BODY_STYLE}
        >
          <Skeleton loading={true} active placeholder={placeholder}></Skeleton>
        </Card>
      );
    };

    return (
      <>
        <style>{CARD_TABLE_SURFACE_STYLES}</style>
        <div className='card-table-mobile-list'>
          {[1, 2, 3].map((i) => renderSkeletonCard(i))}
        </div>
      </>
    );
  }

  const isEmpty = !showSkeleton && (!dataSource || dataSource.length === 0);

  const MobileRowCard = ({ record, index }) => {
    const [showDetails, setShowDetails] = useState(false);
    const rowKeyVal = getRowKey(record, index);
    const visibleColumns = columns.filter((col) => {
      if (tableProps?.visibleColumns && col.key) {
        return tableProps.visibleColumns[col.key];
      }
      return true;
    });

    const hasDetails =
      tableProps.expandedRowRender &&
      (!tableProps.rowExpandable || tableProps.rowExpandable(record));

    return (
      <Card
        key={rowKeyVal}
        className='card-table-mobile-card'
        bodyStyle={CARD_TABLE_BODY_STYLE}
      >
        <div className='card-table-mobile-inner'>
          {visibleColumns.map((col, colIdx) => {
            const isLastColumn = colIdx === visibleColumns.length - 1;
            const title = col.title;
            const cellContent = col.render
              ? col.render(record[col.dataIndex], record, index)
              : record[col.dataIndex];

            if (!title) {
              return (
                <div
                  key={col.key || colIdx}
                  className={`card-table-mobile-row card-table-mobile-row--plain ${
                    isLastColumn ? 'card-table-mobile-row--last' : ''
                  }`}
                >
                  {cellContent}
                </div>
              );
            }

            return (
              <div
                key={col.key || colIdx}
                className={`card-table-mobile-row ${
                  isLastColumn ? 'card-table-mobile-row--last' : ''
                }`}
              >
                <span className='card-table-mobile-label'>{title}</span>
                <div className='card-table-mobile-value'>
                  {cellContent !== undefined && cellContent !== null
                    ? cellContent
                    : '-'}
                </div>
              </div>
            );
          })}

          {hasDetails && (
            <>
              <Button
                theme='borderless'
                size='small'
                className='card-table-mobile-toggle'
                icon={showDetails ? <IconChevronUp /> : <IconChevronDown />}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
              >
                {showDetails ? t('收起') : t('详情')}
              </Button>
              <Collapsible isOpen={showDetails} keepDOM>
                <div className='card-table-mobile-details'>
                  {tableProps.expandedRowRender(record, index)}
                </div>
              </Collapsible>
            </>
          )}
        </div>
      </Card>
    );
  };

  if (isEmpty) {
    if (tableProps.empty) return tableProps.empty;
    return (
      <>
        <style>{CARD_TABLE_SURFACE_STYLES}</style>
        <div className='card-table-empty'>
          <Empty description='No Data' />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CARD_TABLE_SURFACE_STYLES}</style>
      <div className='card-table-mobile-list'>
        {dataSource.map((record, index) => (
          <MobileRowCard
            key={getRowKey(record, index)}
            record={record}
            index={index}
          />
        ))}
        {!hidePagination && tableProps.pagination && dataSource.length > 0 && (
          <div className='card-table-mobile-pagination'>
            <Pagination {...tableProps.pagination} />
          </div>
        )}
      </div>
    </>
  );
};

CardTable.propTypes = {
  columns: PropTypes.array.isRequired,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  hidePagination: PropTypes.bool,
};

export default CardTable;
