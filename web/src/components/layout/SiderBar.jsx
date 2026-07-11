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

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLucideIcon } from '../../helpers/render';
import { ChevronLeft } from 'lucide-react';
import { useSidebarCollapsed } from '../../hooks/common/useSidebarCollapsed';
import { useSidebar } from '../../hooks/common/useSidebar';
import { useMinimumLoadingTime } from '../../hooks/common/useMinimumLoadingTime';
import { isAdmin, isRoot, showError } from '../../helpers';
import SkeletonWrapper from './components/SkeletonWrapper';

import { Nav, Divider, Button } from '@douyinfe/semi-ui';

const routerMap = {
  home: '/',
  channel: '/console/channel',
  token: '/console/token',
  redemption: '/console/redemption',
  topup: '/console/topup',
  user: '/console/user',
  subscription: '/console/subscription',
  log: '/console/log',
  midjourney: '/console/midjourney',
  setting: '/console/setting',
  about: '/about',
  detail: '/console',
  pricing: '/pricing',
  task: '/console/task',
  models: '/console/models',
  deployment: '/console/deployment',
  playground: '/console/playground',
  personal: '/console/personal',
};

const SiderBar = ({ onNavigate = () => {} }) => {
  const { t } = useTranslation();
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const {
    isModuleVisible,
    hasSectionVisibleModules,
    loading: sidebarLoading,
  } = useSidebar();

  const showSkeleton = useMinimumLoadingTime(sidebarLoading, 200);

  const [selectedKeys, setSelectedKeys] = useState(['home']);
  const [chatItems, setChatItems] = useState([]);
  const [openedKeys, setOpenedKeys] = useState([]);
  const location = useLocation();
  const [routerMapState, setRouterMapState] = useState(routerMap);
  const workspaceItems = useMemo(() => {
    const items = [
      {
        text: t('数据看板'),
        itemKey: 'detail',
        to: '/detail',
        className:
          localStorage.getItem('enable_data_export') === 'true'
            ? ''
            : 'tableHiddle',
      },
      {
        text: t('令牌管理'),
        itemKey: 'token',
        to: '/token',
      },
      {
        text: t('使用日志'),
        itemKey: 'log',
        to: '/log',
      },
      {
        text: t('绘图日志'),
        itemKey: 'midjourney',
        to: '/midjourney',
        className:
          localStorage.getItem('enable_drawing') === 'true'
            ? ''
            : 'tableHiddle',
      },
      {
        text: t('任务日志'),
        itemKey: 'task',
        to: '/task',
        className:
          localStorage.getItem('enable_task') === 'true' ? '' : 'tableHiddle',
      },
    ];

    return items.filter((item) => isModuleVisible('console', item.itemKey));
  }, [
    localStorage.getItem('enable_data_export'),
    localStorage.getItem('enable_drawing'),
    localStorage.getItem('enable_task'),
    t,
    isModuleVisible,
  ]);

  const financeItems = useMemo(() => {
    const items = [
      {
        text: t('钱包管理'),
        itemKey: 'topup',
        to: '/topup',
      },
      {
        text: t('个人设置'),
        itemKey: 'personal',
        to: '/personal',
      },
    ];

    return items.filter((item) => isModuleVisible('personal', item.itemKey));
  }, [t, isModuleVisible]);

  const adminItems = useMemo(() => {
    const items = [
      {
        text: t('渠道管理'),
        itemKey: 'channel',
        to: '/channel',
        className: isAdmin() ? '' : 'tableHiddle',
      },
      {
        text: t('订阅管理'),
        itemKey: 'subscription',
        to: '/subscription',
        className: isAdmin() ? '' : 'tableHiddle',
      },
      {
        text: t('模型管理'),
        itemKey: 'models',
        to: '/console/models',
        className: isAdmin() ? '' : 'tableHiddle',
      },
      {
        text: t('模型部署'),
        itemKey: 'deployment',
        to: '/deployment',
        className: isAdmin() ? '' : 'tableHiddle',
      },
      {
        text: t('兑换码管理'),
        itemKey: 'redemption',
        to: '/redemption',
        className: isAdmin() ? '' : 'tableHiddle',
      },
      {
        text: t('用户管理'),
        itemKey: 'user',
        to: '/user',
        className: isAdmin() ? '' : 'tableHiddle',
      },
      {
        text: t('系统设置'),
        itemKey: 'setting',
        to: '/setting',
        className: isRoot() ? '' : 'tableHiddle',
      },
    ];

    return items.filter((item) => isModuleVisible('admin', item.itemKey));
  }, [isAdmin(), isRoot(), t, isModuleVisible]);

  const chatMenuItems = useMemo(() => {
    const items = [
      {
        text: t('操练场'),
        itemKey: 'playground',
        to: '/playground',
      },
    ];

    if (chatItems.length > 0) {
      items.push({
        text: t('聊天'),
        itemKey: 'chat',
        items: chatItems,
      });
    }

    return items.filter((item) => isModuleVisible('chat', item.itemKey));
  }, [chatItems, t, isModuleVisible]);

  const updateRouterMapWithChats = (chats) => {
    const newRouterMap = { ...routerMap };

    if (Array.isArray(chats) && chats.length > 0) {
      for (let i = 0; i < chats.length; i++) {
        newRouterMap['chat' + i] = '/console/chat/' + i;
      }
    }

    setRouterMapState(newRouterMap);
    return newRouterMap;
  };

  useEffect(() => {
    let chats = localStorage.getItem('chats');
    if (chats) {
      try {
        chats = JSON.parse(chats);
        if (Array.isArray(chats)) {
          let nextChatItems = [];
          for (let i = 0; i < chats.length; i++) {
            let shouldSkip = false;
            let chat = {};
            for (let key in chats[i]) {
              let link = chats[i][key];
              if (typeof link !== 'string') continue;
              if (link.startsWith('fluent') || link.startsWith('ccswitch')) {
                shouldSkip = true;
                break;
              }
              chat.text = key;
              chat.itemKey = 'chat' + i;
              chat.to = '/console/chat/' + i;
            }
            if (shouldSkip || !chat.text) continue;
            nextChatItems.push(chat);
          }
          setChatItems(nextChatItems);
          updateRouterMapWithChats(chats);
        }
      } catch (e) {
        showError('聊天数据解析失败');
      }
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    let matchingKey = Object.keys(routerMapState).find(
      (key) => routerMapState[key] === currentPath,
    );

    if (!matchingKey && currentPath.startsWith('/console/chat/')) {
      const chatIndex = currentPath.split('/').pop();
      if (!isNaN(chatIndex)) {
        matchingKey = 'chat' + chatIndex;
      } else {
        matchingKey = 'chat';
      }
    }

    if (matchingKey) {
      setSelectedKeys([matchingKey]);
      if (matchingKey.startsWith('chat') && matchingKey !== 'chat') {
        setOpenedKeys((prev) =>
          prev.includes('chat') ? prev : [...prev, 'chat'],
        );
      }
    }
  }, [location.pathname, routerMapState]);

  useEffect(() => {
    if (collapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [collapsed]);

  const SELECTED_TEXT_COLOR = 'var(--console-text-strong)';

  const renderNavItem = (item) => {
    if (item.className === 'tableHiddle') return null;

    const isSelected = selectedKeys.includes(item.itemKey);
    const textColor = isSelected
      ? SELECTED_TEXT_COLOR
      : 'var(--console-text-muted)';

    return (
      <Nav.Item
        key={item.itemKey}
        itemKey={item.itemKey}
        text={
          <span
            className='truncate text-[13px] font-medium'
            style={{ color: textColor }}
          >
            {item.text}
          </span>
        }
        icon={
          <div className='sidebar-icon-container flex-shrink-0'>
            {getLucideIcon(item.itemKey, isSelected)}
          </div>
        }
        className={item.className}
      />
    );
  };

  const renderSubItem = (item) => {
    if (item.items && item.items.length > 0) {
      const isSelected =
        selectedKeys.includes(item.itemKey) ||
        item.items.some((subItem) => selectedKeys.includes(subItem.itemKey));
      const textColor = isSelected
        ? SELECTED_TEXT_COLOR
        : 'var(--console-text-muted)';

      return (
        <Nav.Sub
          key={item.itemKey}
          itemKey={item.itemKey}
          text={
            <span
              className='truncate text-[13px] font-medium'
              style={{ color: textColor }}
            >
              {item.text}
            </span>
          }
          icon={
            <div className='sidebar-icon-container flex-shrink-0'>
              {getLucideIcon(item.itemKey, isSelected)}
            </div>
          }
        >
          {item.items.map((subItem) => {
            const isSubSelected = selectedKeys.includes(subItem.itemKey);
            const subTextColor = isSubSelected
              ? SELECTED_TEXT_COLOR
              : 'var(--console-text-muted)';

            return (
              <Nav.Item
                className='sidebar-sub-nav-item'
                key={subItem.itemKey}
                itemKey={subItem.itemKey}
                text={
                  <span
                    className='truncate text-[13px] font-medium'
                    style={{ color: subTextColor }}
                  >
                    {subItem.text}
                  </span>
                }
              />
            );
          })}
        </Nav.Sub>
      );
    }

    return renderNavItem(item);
  };

  return (
    <div
      className='sidebar-container admin-sidebar'
      style={{
        width: 'var(--sidebar-current-width)',
      }}
    >
      <SkeletonWrapper
        loading={showSkeleton}
        type='sidebar'
        className=''
        collapsed={collapsed}
        showAdmin={isAdmin()}
      >
        <Nav
          className='sidebar-nav'
          defaultIsCollapsed={collapsed}
          isCollapsed={collapsed}
          onCollapseChange={toggleCollapsed}
          selectedKeys={selectedKeys}
          itemStyle='sidebar-nav-item'
          hoverStyle='sidebar-nav-item:hover'
          selectedStyle='sidebar-nav-item-selected'
          renderWrapper={({ itemElement, props }) => {
            const to =
              routerMapState[props.itemKey] || routerMap[props.itemKey];

            if (!to) return itemElement;

            return (
              <Link
                className='sidebar-nav-link'
                style={{ textDecoration: 'none' }}
                to={to}
                onClick={onNavigate}
              >
                {itemElement}
              </Link>
            );
          }}
          onSelect={(key) => {
            if (openedKeys.includes(key.itemKey)) {
              setOpenedKeys(openedKeys.filter((k) => k !== key.itemKey));
            }

            setSelectedKeys([key.itemKey]);
          }}
          openKeys={openedKeys}
          onOpenChange={(data) => {
            setOpenedKeys(data.openKeys);
          }}
        >
          {hasSectionVisibleModules('chat') && (
            <div className='sidebar-section'>
              {!collapsed && (
                <div className='sidebar-group-label'>{t('聊天')}</div>
              )}
              {chatMenuItems.map((item) => renderSubItem(item))}
            </div>
          )}

          {hasSectionVisibleModules('console') && (
            <>
              <Divider className='sidebar-divider' />
              <div>
                {!collapsed && (
                  <div className='sidebar-group-label'>{t('控制台')}</div>
                )}
                {workspaceItems.map((item) => renderNavItem(item))}
              </div>
            </>
          )}

          {hasSectionVisibleModules('personal') && (
            <>
              <Divider className='sidebar-divider' />
              <div>
                {!collapsed && (
                  <div className='sidebar-group-label'>{t('个人中心')}</div>
                )}
                {financeItems.map((item) => renderNavItem(item))}
              </div>
            </>
          )}

          {isAdmin() && hasSectionVisibleModules('admin') && (
            <>
              <Divider className='sidebar-divider' />
              <div>
                {!collapsed && (
                  <div className='sidebar-group-label'>{t('管理员')}</div>
                )}
                {adminItems.map((item) => renderNavItem(item))}
              </div>
            </>
          )}
        </Nav>
      </SkeletonWrapper>

      <div className='sidebar-collapse-button'>
        <SkeletonWrapper
          loading={showSkeleton}
          type='button'
          width={collapsed ? 40 : 164}
          height={24}
          className='w-full'
        >
          <div className='sidebar-collapse-button-inner'>
            <Button
              className='sidebar-collapse-trigger'
              theme='outline'
              type='tertiary'
              size='small'
              icon={
                <ChevronLeft
                  size={16}
                  strokeWidth={2.5}
                  color='currentColor'
                  style={{
                    transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              }
              onClick={toggleCollapsed}
              style={
                collapsed
                  ? { width: 40, height: 40, padding: 0 }
                  : { padding: '6px 16px', width: '100%', height: 44 }
              }
            >
              {!collapsed ? t('收起侧边栏') : null}
            </Button>
          </div>
        </SkeletonWrapper>
      </div>
    </div>
  );
};

export default SiderBar;
