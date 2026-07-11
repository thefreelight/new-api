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
import { Link, matchPath, useLocation } from 'react-router-dom';
import SkeletonWrapper from '../components/SkeletonWrapper';

const Navigation = ({
  mainNavLinks,
  isMobile,
  isLoading,
  userState,
  pricingRequireAuth,
}) => {
  const location = useLocation();
  const isAuthRoute = ['/login', '/register', '/reset', '/user/reset'].includes(
    location.pathname,
  );

  const renderNavLinks = () => {
    const baseClasses =
      'flex-shrink-0 flex items-center gap-1 rounded-md text-[13px] font-medium transition-colors duration-150 ease-in-out';
    const spacingClasses = isMobile ? 'px-2 py-1' : 'px-2 py-1';

    return mainNavLinks.map((link) => {
      const isCurrentRoute =
        !link.isExternal &&
        (location.pathname === link.to ||
          (link.to !== '/' &&
            matchPath({ path: `${link.to}/*` }, location.pathname)));
      const linkClassName = `${baseClasses} ${spacingClasses} ${
        isCurrentRoute
          ? 'bg-[#e3e3df] text-[#11110f]'
          : 'text-[#555551] hover:bg-[#eeeeeb] hover:text-[#11110f]'
      }`;
      const linkContent = <span>{link.text}</span>;

      if (link.isExternal) {
        return (
          <a
            key={link.itemKey}
            href={link.externalLink}
            target='_blank'
            rel='noopener noreferrer'
            className={`${baseClasses} ${spacingClasses} text-[#555551] hover:bg-[#eeeeeb] hover:text-[#11110f]`}
          >
            {linkContent}
          </a>
        );
      }

      let targetPath = link.to;
      if (link.itemKey === 'console' && !userState.user) {
        targetPath = '/login';
      }
      if (link.itemKey === 'pricing' && pricingRequireAuth && !userState.user) {
        targetPath = '/login';
      }

      return (
        <Link
          key={link.itemKey}
          to={targetPath}
          className={linkClassName}
          aria-current={isCurrentRoute ? 'page' : undefined}
        >
          {linkContent}
        </Link>
      );
    });
  };

  if (isMobile && isAuthRoute) {
    return null;
  }

  return (
    <nav className='mx-2 flex flex-1 items-center justify-end gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide md:mx-4'>
      <SkeletonWrapper
        loading={isLoading}
        type='navigation'
        count={4}
        width={60}
        height={16}
        isMobile={isMobile}
      >
        {renderNavLinks()}
      </SkeletonWrapper>
    </nav>
  );
};

export default Navigation;
