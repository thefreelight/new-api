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
import { Spin, Typography } from '@douyinfe/semi-ui';
import { useTokenKeys } from '../../hooks/chat/useTokenKeys';
import ConsoleShell from '../../components/layout/ConsoleShell';

const { Text, Title } = Typography;

const chat2page = () => {
  const { keys, serverAddress, isLoading } = useTokenKeys();

  const comLink = (key) => {
    if (!serverAddress || !key) return '';
    let chats = localStorage.getItem('chats');
    if (!chats) return '';

    try {
      chats = JSON.parse(chats);
      if (Array.isArray(chats) && chats.length > 0) {
        const firstChat = chats[0];
        for (const providerName in firstChat) {
          let link = firstChat[providerName];
          if (typeof link !== 'string') continue;
          link = link.replaceAll(
            '{address}',
            encodeURIComponent(serverAddress),
          );
          link = link.replaceAll('{key}', 'sk-' + key);
          return link;
        }
      }
    } catch (error) {
      console.error('Failed to parse chats for redirect:', error);
    }

    return '';
  };

  if (keys.length > 0) {
    const redirectLink = comLink(keys[0]);
    if (redirectLink) {
      window.location.href = redirectLink;
    }
  }

  return (
    <ConsoleShell
      className='min-h-[calc(100vh-64px)]'
      contentClassName='flex min-h-[70vh] items-center justify-center'
    >
      <div className='w-full max-w-[560px] rounded-lg border border-[#dfe3e8] bg-[#fbfbf9] px-8 py-12 text-center shadow-[0_24px_90px_rgba(17,23,34,0.06)]'>
        <div className='mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#dce2e7] bg-white shadow-[0_12px_40px_rgba(17,23,34,0.04)]'>
          <Spin size='large' spinning={isLoading || keys.length > 0} />
        </div>
        <Title
          heading={3}
          className='!m-0 !text-[28px] !font-semibold !tracking-[-0.03em] !text-[#111722]'
        >
          正在跳转
        </Title>
        <Text className='mt-3 block !text-sm !leading-7 !text-[#59616d]'>
          正在为你准备聊天入口，请稍候片刻。
        </Text>
      </div>
    </ConsoleShell>
  );
};

export default chat2page;
