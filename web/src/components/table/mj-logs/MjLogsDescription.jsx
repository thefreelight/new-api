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
import { Image } from 'lucide-react';
import TablePageDescription from '../../common/ui/TablePageDescription';

const MjLogsDescription = ({ compactMode, setCompactMode, t }) => {
  return (
    <TablePageDescription
      code='08'
      title={t('Midjourney 日志')}
      icon={<Image size={17} strokeWidth={1.8} />}
      compactMode={compactMode}
      setCompactMode={setCompactMode}
      t={t}
      accent='#8a5a7a'
    />
  );
};

export default MjLogsDescription;
