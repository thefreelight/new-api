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

const ConsoleShell = ({
  children,
  className = '',
  contentClassName = '',
  wide = false,
}) => {
  const widthClass = wide ? 'max-w-none' : 'mx-auto max-w-[1360px]';
  const spacingClass = wide
    ? 'px-3 pb-6 pt-4'
    : 'px-3 pb-6 pt-6 sm:px-5 sm:pb-8 lg:px-6';

  return (
    <div
      className={`console-shell w-full ${widthClass} ${spacingClass} ${className}`}
    >
      <div className={`console-shell-content w-full ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default ConsoleShell;
