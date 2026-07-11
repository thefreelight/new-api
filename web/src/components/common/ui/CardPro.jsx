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
import { Card, Divider, Button } from '@douyinfe/semi-ui';
import PropTypes from 'prop-types';
import { useIsMobile } from '../../../hooks/common/useIsMobile';
import { IconEyeOpened, IconEyeClosed } from '@douyinfe/semi-icons';

const CARD_PRO_PREMIUM_STYLES = `
  .card-pro-premium.table-scroll-card {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--console-border);
    border-radius: 34px !important;
    background:
      radial-gradient(circle at top left, rgba(126, 199, 164, 0.12), transparent 28%),
      radial-gradient(circle at top right, rgba(196, 164, 107, 0.1), transparent 30%),
      linear-gradient(180deg, rgba(13, 18, 28, 0.98) 0%, rgba(7, 11, 17, 1) 100%);
    box-shadow: var(--console-shadow);
  }

  .card-pro-premium.table-scroll-card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background:
      linear-gradient(
        90deg,
        rgba(196, 164, 107, 0) 0%,
        rgba(196, 164, 107, 0.82) 48%,
        rgba(126, 199, 164, 0.54) 100%
      );
    pointer-events: none;
    z-index: 1;
  }

  .card-pro-premium .semi-card-header {
    position: relative;
    padding: 26px 26px 22px;
    border-bottom: 1px solid var(--console-divider);
    background:
      radial-gradient(circle at top right, rgba(196, 164, 107, 0.14), transparent 30%),
      linear-gradient(180deg, rgba(20, 28, 42, 0.96) 0%, rgba(10, 14, 21, 0.98) 100%);
  }

  .card-pro-premium .semi-card-body {
    padding: 0 26px 26px;
    background: transparent;
  }

  .card-pro-premium .semi-card-footer {
    padding: 0 26px 22px;
    background: transparent;
  }

  .card-pro-premium .card-pro-header {
    gap: 18px;
  }

  .card-pro-premium .card-pro-section-stats,
  .card-pro-premium .card-pro-section-description,
  .card-pro-premium .card-pro-actions-block,
  .card-pro-premium .card-pro-search-block {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--console-border);
    border-radius: 26px;
    background:
      linear-gradient(180deg, rgba(18, 25, 37, 0.96) 0%, rgba(9, 13, 20, 0.98) 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 16px 34px rgba(1, 3, 7, 0.22);
  }

  .card-pro-premium .card-pro-section-stats::before,
  .card-pro-premium .card-pro-section-description::before,
  .card-pro-premium .card-pro-actions-block::before,
  .card-pro-premium .card-pro-search-block::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(196, 164, 107, 0.44), rgba(126, 199, 164, 0.16));
    opacity: 0.72;
  }

  .card-pro-premium .card-pro-section-stats,
  .card-pro-premium .card-pro-section-description {
    padding: 18px 20px;
  }

  .card-pro-premium .card-pro-section-tabs {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    color: var(--console-text-muted);
  }

  .card-pro-premium .card-pro-controls {
    gap: 12px;
  }

  .card-pro-premium .card-pro-actions-block,
  .card-pro-premium .card-pro-search-block {
    padding: 16px 18px;
  }

  .card-pro-premium .card-pro-footer {
    margin-top: 4px;
    padding-top: 18px;
    border-top: 1px solid var(--console-divider);
  }

  .card-pro-premium .card-pro-mobile-toggle-button.semi-button {
    min-height: 42px;
    border-radius: 18px;
    border: 1px solid rgba(196, 164, 107, 0.18);
    background: rgba(7, 11, 17, 0.76);
    color: var(--console-text-muted);
  }

  .card-pro-premium .card-pro-mobile-toggle-button.semi-button:hover,
  .card-pro-premium .card-pro-mobile-toggle-button.semi-button:focus {
    border-color: rgba(196, 164, 107, 0.3);
    background: rgba(16, 23, 34, 0.94);
    color: var(--console-text-strong);
  }

  .card-pro-premium .card-pro-header .semi-button,
  .card-pro-premium .card-pro-header .semi-input-wrapper,
  .card-pro-premium .card-pro-header .semi-input-number,
  .card-pro-premium .card-pro-header .semi-select,
  .card-pro-premium .card-pro-header .semi-datepicker-input {
    border-radius: 18px;
  }

  .card-pro-premium .card-pro-header .semi-button {
    border-color: rgba(196, 164, 107, 0.16);
    background: rgba(7, 11, 17, 0.7);
    color: var(--console-text-muted);
    box-shadow: none;
  }

  .card-pro-premium .card-pro-header .semi-button:hover,
  .card-pro-premium .card-pro-header .semi-button:focus {
    border-color: rgba(196, 164, 107, 0.3);
    background: rgba(16, 23, 34, 0.94);
    color: var(--console-text-strong);
  }

  .card-pro-premium .card-pro-header .semi-input-wrapper,
  .card-pro-premium .card-pro-header .semi-input-number,
  .card-pro-premium .card-pro-header .semi-select-selection,
  .card-pro-premium .card-pro-header .semi-datepicker-input {
    border-color: var(--console-border);
    background: rgba(6, 10, 15, 0.66);
    box-shadow: none;
  }

  .card-pro-premium .card-pro-header .semi-input-wrapper:hover,
  .card-pro-premium .card-pro-header .semi-input-number:hover,
  .card-pro-premium .card-pro-header .semi-select-selection:hover,
  .card-pro-premium .card-pro-header .semi-datepicker-input:hover {
    border-color: rgba(196, 164, 107, 0.26);
    background: rgba(14, 20, 30, 0.92);
  }

  .card-pro-premium .card-pro-header .semi-input,
  .card-pro-premium .card-pro-header input,
  .card-pro-premium .card-pro-header textarea,
  .card-pro-premium .card-pro-header .semi-select-selection-text,
  .card-pro-premium .card-pro-header .semi-datepicker .semi-input {
    color: var(--console-text-strong) !important;
  }

  .card-pro-premium .card-pro-header .semi-input::placeholder,
  .card-pro-premium .card-pro-header input::placeholder,
  .card-pro-premium .card-pro-header textarea::placeholder,
  .card-pro-premium .card-pro-header .semi-select-selection-placeholder,
  .card-pro-premium .card-pro-header .semi-input-number-placeholder {
    color: var(--console-text-faint) !important;
  }

  .card-pro-premium .card-pro-header .semi-input-prefix,
  .card-pro-premium .card-pro-header .semi-input-suffix,
  .card-pro-premium .card-pro-header .semi-select-arrow,
  .card-pro-premium .card-pro-header .semi-select-clear,
  .card-pro-premium .card-pro-header .semi-input-number-suffix,
  .card-pro-premium .card-pro-header .semi-datepicker-suffix {
    color: var(--console-text-faint);
  }

  .card-pro-premium .card-pro-divider.semi-divider-horizontal {
    border-color: var(--console-divider);
  }

  .card-pro-premium .semi-card-header,
  .card-pro-premium .semi-card-body,
  .card-pro-premium .semi-card-footer,
  .card-pro-premium .card-pro-section-stats,
  .card-pro-premium .card-pro-section-description,
  .card-pro-premium .card-pro-actions-block,
  .card-pro-premium .card-pro-search-block {
    color: var(--console-text-muted);
  }

  .card-pro-premium .semi-card-header a,
  .card-pro-premium .semi-card-body a,
  .card-pro-premium .semi-card-footer a {
    color: var(--console-accent);
  }

  @media (max-width: 767px) {
    .card-pro-premium .semi-card-header {
      padding: 22px 18px 18px;
    }

    .card-pro-premium .semi-card-body {
      padding: 0 18px 18px;
    }

    .card-pro-premium .semi-card-footer {
      padding: 0 18px 18px;
    }

    .card-pro-premium .card-pro-section-stats,
    .card-pro-premium .card-pro-section-description,
    .card-pro-premium .card-pro-actions-block,
    .card-pro-premium .card-pro-search-block {
      padding: 14px;
    }
  }

  .card-pro-premium.table-scroll-card {
    border-color: #e0e3e8 !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    box-shadow: 0 22px 66px rgba(17, 23, 34, 0.08) !important;
  }

  .card-pro-premium.table-scroll-card::before {
    background: linear-gradient(90deg, rgba(255, 90, 31, 0), rgba(255, 90, 31, 0.72), rgba(255, 90, 31, 0)) !important;
  }

  .card-pro-premium .semi-card-header {
    border-bottom-color: #eceef1 !important;
    background: #ffffff !important;
  }

  .card-pro-premium .card-pro-section-stats,
  .card-pro-premium .card-pro-section-description,
  .card-pro-premium .card-pro-actions-block,
  .card-pro-premium .card-pro-search-block {
    border-color: #e0e3e8 !important;
    border-radius: 8px !important;
    background: #fbfaf8 !important;
    box-shadow: none !important;
  }

  .card-pro-premium .card-pro-section-stats::before,
  .card-pro-premium .card-pro-section-description::before,
  .card-pro-premium .card-pro-actions-block::before,
  .card-pro-premium .card-pro-search-block::before {
    background: linear-gradient(90deg, rgba(255, 90, 31, 0.46), rgba(255, 90, 31, 0.08)) !important;
  }

  .card-pro-premium .card-pro-mobile-toggle-button.semi-button,
  .card-pro-premium .card-pro-header .semi-button {
    border-color: #e0e3e8 !important;
    background: #ffffff !important;
    color: #626b76 !important;
  }

  .card-pro-premium .card-pro-mobile-toggle-button.semi-button:hover,
  .card-pro-premium .card-pro-mobile-toggle-button.semi-button:focus,
  .card-pro-premium .card-pro-header .semi-button:hover,
  .card-pro-premium .card-pro-header .semi-button:focus {
    border-color: rgba(255, 90, 31, 0.3) !important;
    background: #fff5ef !important;
    color: #0f131a !important;
  }

  .card-pro-premium .card-pro-header .semi-input-wrapper,
  .card-pro-premium .card-pro-header .semi-input-number,
  .card-pro-premium .card-pro-header .semi-select-selection,
  .card-pro-premium .card-pro-header .semi-datepicker-input {
    border-color: #e0e3e8 !important;
    background: #ffffff !important;
  }

  .card-pro-premium .card-pro-header .semi-input-wrapper:hover,
  .card-pro-premium .card-pro-header .semi-input-number:hover,
  .card-pro-premium .card-pro-header .semi-select-selection:hover,
  .card-pro-premium .card-pro-header .semi-datepicker-input:hover {
    border-color: rgba(255, 90, 31, 0.28) !important;
    background: #ffffff !important;
  }

  .card-pro-premium .card-pro-header .semi-input,
  .card-pro-premium .card-pro-header input,
  .card-pro-premium .card-pro-header textarea,
  .card-pro-premium .card-pro-header .semi-select-selection-text,
  .card-pro-premium .card-pro-header .semi-datepicker .semi-input {
    color: #171d27 !important;
  }

  .card-pro-premium .card-pro-header .semi-input::placeholder,
  .card-pro-premium .card-pro-header input::placeholder,
  .card-pro-premium .card-pro-header textarea::placeholder,
  .card-pro-premium .card-pro-header .semi-select-selection-placeholder,
  .card-pro-premium .card-pro-header .semi-input-number-placeholder,
  .card-pro-premium .card-pro-header .semi-input-prefix,
  .card-pro-premium .card-pro-header .semi-input-suffix,
  .card-pro-premium .card-pro-header .semi-select-arrow,
  .card-pro-premium .card-pro-header .semi-select-clear,
  .card-pro-premium .card-pro-header .semi-input-number-suffix,
  .card-pro-premium .card-pro-header .semi-datepicker-suffix {
    color: #8a929d !important;
  }

  .card-pro-premium .card-pro-divider.semi-divider-horizontal,
  .card-pro-premium .card-pro-footer {
    border-color: #eceef1 !important;
  }

  .card-pro-premium .semi-card-header,
  .card-pro-premium .semi-card-body,
  .card-pro-premium .semi-card-footer,
  .card-pro-premium .card-pro-section-stats,
  .card-pro-premium .card-pro-section-description,
  .card-pro-premium .card-pro-actions-block,
  .card-pro-premium .card-pro-search-block {
    color: #626b76 !important;
  }

  .card-pro-premium .semi-card-header a,
  .card-pro-premium .semi-card-body a,
  .card-pro-premium .semi-card-footer a {
    color: #ff5a1f !important;
  }

  .card-pro-premium.table-scroll-card {
    display: block !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    overflow: visible !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .card-pro-premium.table-scroll-card::before,
  .card-pro-premium .card-pro-section-stats::before,
  .card-pro-premium .card-pro-section-description::before,
  .card-pro-premium .card-pro-actions-block::before,
  .card-pro-premium .card-pro-search-block::before {
    display: none !important;
  }

  .card-pro-premium .semi-card-header,
  .card-pro-premium .semi-card-body,
  .card-pro-premium .semi-card-footer {
    flex: 0 0 auto !important;
    min-height: 0 !important;
    overflow: visible !important;
    padding: 0 !important;
    border: 0 !important;
    background: transparent !important;
    color: var(--console-text-muted) !important;
  }

  .card-pro-premium .card-pro-header {
    gap: 10px !important;
  }

  .card-pro-premium .card-pro-controls {
    gap: 10px !important;
  }

  .card-pro-premium .card-pro-section-description,
  .card-pro-premium .card-pro-section-stats,
  .card-pro-premium .card-pro-section-tabs,
  .card-pro-premium .card-pro-actions-block,
  .card-pro-premium .card-pro-search-block,
  .card-pro-premium .card-pro-footer {
    overflow: visible !important;
    border: 1px solid #e2e7ec !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    box-shadow: none !important;
    color: var(--console-text-muted) !important;
  }

  .card-pro-premium .card-pro-section-description {
    padding: 0 !important;
  }

  .card-pro-premium .card-pro-section-stats,
  .card-pro-premium .card-pro-section-tabs,
  .card-pro-premium .card-pro-actions-block,
  .card-pro-premium .card-pro-search-block {
    padding: 8px 10px !important;
  }

  .card-pro-premium .card-pro-section-tabs {
    border: 0 !important;
    background: transparent !important;
    padding: 0 !important;
  }

  .card-pro-premium .card-pro-footer {
    margin-top: 10px !important;
    padding: 8px 10px !important;
  }

  .card-pro-premium .card-pro-divider.semi-divider-horizontal {
    display: none !important;
  }

  .card-pro-premium .card-pro-mobile-toggle-button.semi-button,
  .card-pro-premium .card-pro-header .semi-button {
    min-height: 28px !important;
    border-color: #dfe5eb !important;
    border-radius: 6px !important;
    background: #ffffff !important;
    color: #4c5968 !important;
    box-shadow: none !important;
    font-weight: 500 !important;
  }

  .card-pro-premium .card-pro-header .semi-button-primary,
  .card-pro-premium .card-pro-header .semi-button-primary.semi-button {
    border-color: #17202b !important;
    background: #17202b !important;
    color: #ffffff !important;
  }

  .card-pro-premium .card-pro-mobile-toggle-button.semi-button:hover,
  .card-pro-premium .card-pro-mobile-toggle-button.semi-button:focus,
  .card-pro-premium .card-pro-header .semi-button:hover,
  .card-pro-premium .card-pro-header .semi-button:focus {
    border-color: #cfd8e2 !important;
    background: #f3f6f9 !important;
    color: #141a22 !important;
  }

  .card-pro-premium .card-pro-header .semi-button-primary:hover,
  .card-pro-premium .card-pro-header .semi-button-primary:focus {
    border-color: #0f1721 !important;
    background: #0f1721 !important;
    color: #ffffff !important;
  }

  .card-pro-premium .card-pro-header .semi-input-wrapper,
  .card-pro-premium .card-pro-header .semi-input-number,
  .card-pro-premium .card-pro-header .semi-select-selection,
  .card-pro-premium .card-pro-header .semi-datepicker-input {
    min-height: 30px !important;
    border-color: #dfe5eb !important;
    border-radius: 6px !important;
    background: #ffffff !important;
    box-shadow: none !important;
  }

  .card-pro-premium .card-pro-header .semi-input-wrapper:hover,
  .card-pro-premium .card-pro-header .semi-input-number:hover,
  .card-pro-premium .card-pro-header .semi-select-selection:hover,
  .card-pro-premium .card-pro-header .semi-datepicker-input:hover {
    border-color: #cfd8e2 !important;
    background: #ffffff !important;
  }

  .card-pro-premium .card-pro-header .semi-input,
  .card-pro-premium .card-pro-header input,
  .card-pro-premium .card-pro-header textarea,
  .card-pro-premium .card-pro-header .semi-select-selection-text,
  .card-pro-premium .card-pro-header .semi-datepicker .semi-input {
    color: #141a22 !important;
    font-size: 13px !important;
  }

  .card-pro-premium .card-pro-header .semi-input::placeholder,
  .card-pro-premium .card-pro-header input::placeholder,
  .card-pro-premium .card-pro-header textarea::placeholder,
  .card-pro-premium .card-pro-header .semi-select-selection-placeholder,
  .card-pro-premium .card-pro-header .semi-input-number-placeholder,
  .card-pro-premium .card-pro-header .semi-input-prefix,
  .card-pro-premium .card-pro-header .semi-input-suffix,
  .card-pro-premium .card-pro-header .semi-select-arrow,
  .card-pro-premium .card-pro-header .semi-select-clear,
  .card-pro-premium .card-pro-header .semi-input-number-suffix,
  .card-pro-premium .card-pro-header .semi-datepicker-suffix {
    color: #8a95a1 !important;
  }

  .card-pro-premium .semi-card-header a,
  .card-pro-premium .semi-card-body a,
  .card-pro-premium .semi-card-footer a {
    color: #2f5f8f !important;
  }
`;

/**
 * CardPro 高级卡片组件
 *
 * 布局分为6个区域：
 * 1. 统计信息区域 (statsArea)
 * 2. 描述信息区域 (descriptionArea)
 * 3. 类型切换/标签区域 (tabsArea)
 * 4. 操作按钮区域 (actionsArea)
 * 5. 搜索表单区域 (searchArea)
 * 6. 分页区域 (paginationArea) - 固定在卡片底部
 *
 * 支持三种布局类型：
 * - type1: 操作型 (如TokensTable) - 描述信息 + 操作按钮 + 搜索表单
 * - type2: 查询型 (如LogsTable) - 统计信息 + 搜索表单
 * - type3: 复杂型 (如ChannelsTable) - 描述信息 + 类型切换 + 操作按钮 + 搜索表单
 */
const CardPro = ({
  type = 'type1',
  className = '',
  children,
  statsArea,
  descriptionArea,
  tabsArea,
  actionsArea,
  searchArea,
  paginationArea,
  shadows = '',
  bordered = true,
  style,
  t = (key) => key,
  ...props
}) => {
  const isMobile = useIsMobile();
  const [showMobileActions, setShowMobileActions] = useState(false);

  const toggleMobileActions = () => {
    setShowMobileActions(!showMobileActions);
  };

  const hasMobileHideableContent = actionsArea || searchArea;

  const renderHeader = () => {
    const hasContent =
      statsArea || descriptionArea || tabsArea || actionsArea || searchArea;
    if (!hasContent) return null;

    return (
      <div className='card-pro-header flex w-full flex-col'>
        {type === 'type2' && statsArea && (
          <div className='card-pro-section card-pro-section-stats'>
            {statsArea}
          </div>
        )}

        {descriptionArea && (
          <div className='card-pro-section card-pro-section-description'>
            {descriptionArea}
          </div>
        )}

        {descriptionArea &&
        (statsArea || tabsArea || actionsArea || searchArea) ? (
          <Divider className='card-pro-divider' margin='12px' />
        ) : null}

        {type === 'type3' && tabsArea && (
          <div className='card-pro-section card-pro-section-tabs'>
            {tabsArea}
          </div>
        )}

        {isMobile && hasMobileHideableContent && (
          <div className='card-pro-mobile-toggle w-full'>
            <Button
              className='card-pro-mobile-toggle-button'
              onClick={toggleMobileActions}
              icon={showMobileActions ? <IconEyeClosed /> : <IconEyeOpened />}
              type='tertiary'
              size='small'
              theme='outline'
              block
            >
              {showMobileActions ? t('隐藏操作项') : t('显示操作项')}
            </Button>
          </div>
        )}

        <div
          className={`card-pro-controls flex flex-col ${
            isMobile && !showMobileActions ? 'hidden' : ''
          }`}
        >
          {(type === 'type1' || type === 'type3') &&
            actionsArea &&
            (Array.isArray(actionsArea) ? (
              actionsArea.map((area, idx) => (
                <React.Fragment key={idx}>
                  {idx !== 0 && <Divider className='card-pro-divider' />}
                  <div className='card-pro-actions-block w-full'>{area}</div>
                </React.Fragment>
              ))
            ) : (
              <div className='card-pro-actions-block w-full'>{actionsArea}</div>
            ))}

          {actionsArea && searchArea && (
            <Divider className='card-pro-divider' />
          )}

          {searchArea && (
            <div className='card-pro-search-block w-full'>{searchArea}</div>
          )}
        </div>
      </div>
    );
  };

  const headerContent = renderHeader();

  const renderFooter = () => {
    if (!paginationArea) return null;

    return (
      <div
        className={`card-pro-footer flex w-full ${
          isMobile ? 'justify-center' : 'items-center justify-between'
        }`}
      >
        {paginationArea}
      </div>
    );
  };

  const footerContent = renderFooter();
  const premiumCardClassName = [
    'card-pro-premium',
    'table-scroll-card',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <style>{CARD_PRO_PREMIUM_STYLES}</style>
      <Card
        className={premiumCardClassName}
        title={headerContent}
        footer={footerContent}
        shadows={shadows}
        bordered={bordered}
        style={style}
        {...props}
      >
        {children}
      </Card>
    </>
  );
};

CardPro.propTypes = {
  type: PropTypes.oneOf(['type1', 'type2', 'type3']),
  className: PropTypes.string,
  style: PropTypes.object,
  shadows: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  bordered: PropTypes.bool,
  statsArea: PropTypes.node,
  descriptionArea: PropTypes.node,
  tabsArea: PropTypes.node,
  actionsArea: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  searchArea: PropTypes.node,
  paginationArea: PropTypes.node,
  children: PropTypes.node,
  t: PropTypes.func,
};

export default CardPro;
