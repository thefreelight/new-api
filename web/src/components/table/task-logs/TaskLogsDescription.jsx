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
import { ListChecks } from 'lucide-react';
import TablePageDescription from '../../common/ui/TablePageDescription';

const TaskLogsDescription = ({ compactMode, setCompactMode, t }) => {
  return (
    <TablePageDescription
      code='09'
      title={t('任务日志')}
      icon={<ListChecks size={17} strokeWidth={1.8} />}
      compactMode={compactMode}
      setCompactMode={setCompactMode}
      t={t}
      accent='#ad6b2f'
    />
  );
};

export default TaskLogsDescription;
