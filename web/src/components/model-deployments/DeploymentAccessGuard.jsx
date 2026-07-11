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
import { Card, Button, Typography } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Settings, Server, AlertCircle, WifiOff } from 'lucide-react';
import ConsoleShell from '../layout/ConsoleShell';

const { Title, Text } = Typography;

const DeploymentStateCard = ({
  icon,
  iconToneClassName,
  title,
  description,
  detail,
  actions,
  children,
}) => (
  <ConsoleShell
    wide
    contentClassName='flex min-h-[72vh] items-center justify-center'
  >
    <div className='relative w-full max-w-[720px] rounded-lg border border-[#dfe3e8] bg-[#fbfbf9] px-8 py-12 text-center shadow-[0_24px_90px_rgba(17,23,34,0.06)] sm:px-12'>
      <div className='relative'>
        <div className='mb-8'>
          <div
            className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border bg-white shadow-[0_12px_40px_rgba(17,23,34,0.04)] ${iconToneClassName}`}
          >
            {icon}
          </div>
        </div>

        <Title
          heading={2}
          className='!m-0 !text-[30px] !font-semibold !tracking-[-0.04em] !text-[#111722]'
        >
          {title}
        </Title>
        <Text className='mx-auto mt-4 block max-w-[42ch] !text-base !leading-8 !text-[#59616d]'>
          {description}
        </Text>
        {detail ? (
          <Text className='mx-auto mt-3 block max-w-[46ch] !text-sm !leading-7 !text-[#7b8490]'>
            {detail}
          </Text>
        ) : null}

        {children}

        {actions ? (
          <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  </ConsoleShell>
);

const DeploymentAccessGuard = ({
  children,
  loading,
  isEnabled,
  connectionLoading,
  connectionOk,
  connectionError,
  onRetry,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoToSettings = () => {
    navigate('/console/setting?tab=model-deployment');
  };

  if (loading) {
    return (
      <ConsoleShell wide>
        <Card
          loading={true}
          className='min-h-[420px] overflow-hidden border border-[#dfe3e8] bg-[#fbfbf9] !rounded-lg shadow-[0_24px_90px_rgba(17,23,34,0.06)]'
        >
          <div className='py-24 text-center'>
            <Text className='!text-sm !text-[#68717d]'>
              {t('加载设置中...')}
            </Text>
          </div>
        </Card>
      </ConsoleShell>
    );
  }

  if (!isEnabled) {
    return (
      <DeploymentStateCard
        icon={<AlertCircle size={42} className='text-[#ca8a04]' />}
        iconToneClassName='border-[#ecd9ad] text-[#ca8a04]'
        title={t('模型部署服务未启用')}
        description={t('访问模型部署功能需要先启用 io.net 部署服务')}
        actions={
          <Button
            theme='solid'
            type='primary'
            icon={<Settings size={16} />}
            className='h-11 !rounded-md !bg-[#ff5a1f] px-5 font-medium !text-[#14100d] transition hover:!bg-[#ff6a32]'
            onClick={handleGoToSettings}
          >
            {t('前往设置页面')}
          </Button>
        }
      >
        <div className='mx-auto mt-8 max-w-[360px] rounded-lg border border-[#e4e8eb] bg-white/82 p-5 text-left shadow-[0_12px_32px_rgba(17,23,34,0.04)]'>
          <div className='mb-4 flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg border border-[#dde2e7] bg-[#f7f8f6] text-[#ff5a1f]'>
              <Server size={18} />
            </div>
            <Text strong className='!text-[#111722]'>
              {t('需要配置的项目')}
            </Text>
          </div>
          <div className='space-y-3 text-sm text-[#59616d]'>
            <div className='flex items-center gap-3'>
              <span className='h-1.5 w-1.5 rounded-full bg-[#ff5a1f]' />
              <span>{t('启用 io.net 部署开关')}</span>
            </div>
            <div className='flex items-center gap-3'>
              <span className='h-1.5 w-1.5 rounded-full bg-[#ff5a1f]' />
              <span>{t('配置有效的 io.net API Key')}</span>
            </div>
          </div>
        </div>
        <Text className='mt-6 block !text-sm !leading-7 !text-[#7b8490]'>
          {t('配置完成后刷新页面即可使用模型部署功能')}
        </Text>
      </DeploymentStateCard>
    );
  }

  if (connectionLoading || (connectionOk === null && !connectionError)) {
    return (
      <ConsoleShell wide>
        <Card
          loading={true}
          className='min-h-[420px] overflow-hidden border border-[#dfe3e8] bg-[#fbfbf9] !rounded-lg shadow-[0_24px_90px_rgba(17,23,34,0.06)]'
        >
          <div className='py-24 text-center'>
            <Text className='!text-sm !text-[#68717d]'>
              {t('正在检查 io.net 连接...')}
            </Text>
          </div>
        </Card>
      </ConsoleShell>
    );
  }

  if (connectionOk === false) {
    const isExpired = connectionError?.type === 'expired';
    const title = isExpired ? t('接口密钥已过期') : t('无法连接 io.net');
    const description = isExpired
      ? t('当前 API 密钥已过期，请在设置中更新。')
      : t('当前配置无法连接到 io.net。');
    const detail = connectionError?.message || '';

    return (
      <DeploymentStateCard
        icon={<WifiOff size={42} className='text-[#dc2626]' />}
        iconToneClassName='border-[#eed1d1] text-[#dc2626]'
        title={title}
        description={description}
        detail={detail}
        actions={
          <>
            <Button
              theme='solid'
              type='primary'
              icon={<Settings size={16} />}
              className='h-11 !rounded-md !bg-[#111722] px-5 font-medium text-[#f8fafc] transition hover:!bg-[#202838]'
              onClick={handleGoToSettings}
            >
              {t('前往设置')}
            </Button>
            {onRetry ? (
              <Button
                type='tertiary'
                className='h-11 !rounded-md border border-[#dfe3e8] bg-white px-5 text-[#171d27] transition hover:border-[#cbd1d8] hover:bg-[#fbfbf9]'
                onClick={onRetry}
              >
                {t('重试连接')}
              </Button>
            ) : null}
          </>
        }
      />
    );
  }

  return children;
};

export default DeploymentAccessGuard;
