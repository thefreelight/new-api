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

import React, { useEffect, useState } from 'react';
import { API, copy, showError, showNotice } from '../../helpers';
import { useSearchParams, Link } from 'react-router-dom';
import { Button, Card, Form, Typography, Banner } from '@douyinfe/semi-ui';
import { IconMail, IconLock, IconCopy } from '@douyinfe/semi-icons';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const PasswordResetConfirm = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    email: '',
    token: '',
  });
  const { email, token } = inputs;
  const isValidResetLink = email && token;

  const [loading, setLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [newPassword, setNewPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [formApi, setFormApi] = useState(null);
  const authFormClassName =
    'space-y-4 [&_.semi-input-wrapper]:!rounded-md [&_.semi-input-wrapper]:!border [&_.semi-input-wrapper]:!border-[#dfe3e8] [&_.semi-input-wrapper]:!bg-[#fbfbf9] [&_.semi-input-wrapper]:!shadow-none [&_.semi-input-wrapper:hover]:!border-[#cbd1d8] [&_.semi-input-wrapper:focus-within]:!border-[#ff5a1f] [&_.semi-input-wrapper:focus-within]:!bg-white [&_.semi-input-wrapper:focus-within]:!shadow-[0_0_0_3px_rgba(255,90,31,0.14)] [&_.semi-input]:!text-[#171d27] [&_.semi-input-prefix]:!text-[#7b8490] [&_.semi-input-suffix]:!text-[#7b8490]';
  const primaryButtonClassName =
    'flex h-11 w-full items-center justify-center !rounded-md !bg-[#ff5a1f] font-medium !text-[#14100d] transition duration-200 hover:!bg-[#ff6a32] disabled:!bg-[#f0b49b] disabled:!text-[#fff5ef]';
  const subtleActionButtonClassName =
    'h-8 !rounded-md border border-[#dfe3e8] !bg-white px-3 !text-xs font-medium !text-[#4f5864] transition duration-200 hover:!border-[#cbd1d8] hover:!bg-[#fbfbf9] hover:!text-[#171d27]';
  const authLinkClassName =
    'font-medium text-[#ff5a1f] underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-[#d94a15] hover:decoration-current';
  const auxiliaryTextClassName = '!text-[#6d7681]';

  useEffect(() => {
    let token = searchParams.get('token');
    let email = searchParams.get('email');
    setInputs({
      token: token || '',
      email: email || '',
    });
    if (formApi) {
      formApi.setValues({
        email: email || '',
        newPassword: newPassword || '',
      });
    }
  }, [searchParams, newPassword, formApi]);

  useEffect(() => {
    let countdownInterval = null;
    if (disableButton && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setDisableButton(false);
      setCountdown(30);
    }
    return () => clearInterval(countdownInterval);
  }, [disableButton, countdown]);

  async function handleSubmit() {
    if (!email || !token) {
      showError(t('无效的重置链接，请重新发起密码重置请求'));
      return;
    }
    setDisableButton(true);
    setLoading(true);
    const res = await API.post(`/api/user/reset`, {
      email,
      token,
    });
    const { success, message } = res.data;
    if (success) {
      let password = res.data.data;
      setNewPassword(password);
      await copy(password);
      showNotice(`${t('密码已重置并已复制到剪贴板：')} ${password}`);
    } else {
      showError(message);
    }
    setLoading(false);
  }

  return (
    <div className='relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[linear-gradient(#eef2f4_1px,transparent_1px),linear-gradient(90deg,#eef2f4_1px,transparent_1px),#fbfaf8] bg-[length:42px_42px] px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8'>
      <div className='relative z-10 w-full max-w-[440px]'>
        <div className='flex flex-col items-center'>
          <div className='w-full max-w-md'>
            <Card className='overflow-hidden border border-[#dfe3e8] !rounded-lg bg-[#ffffff] shadow-[0_24px_90px_rgba(17,23,34,0.08)]'>
              <div className='flex justify-center px-8 pb-2 pt-8'>
                <Title
                  heading={3}
                  className='!m-0 !text-[24px] !font-medium !text-[#111722]'
                >
                  {t('密码重置确认')}
                </Title>
              </div>
              <div className='px-7 pb-8 pt-7 sm:px-8'>
                {newPassword && (
                  <div className='mb-5 rounded-lg border border-[#d8e6dc] bg-[#f5fbf7] px-4 py-4 text-sm text-[#2d5c46]'>
                    <p className='font-medium'>{t('密码已重置')}</p>
                    <p className='mt-1 text-[#52715f]'>
                      {t('新密码已生成，并已自动复制到剪贴板。')}
                    </p>
                  </div>
                )}
                {!isValidResetLink && (
                  <Banner
                    type='danger'
                    description={t('无效的重置链接，请重新发起密码重置请求')}
                    className='mb-4 !rounded-lg'
                    closeIcon={null}
                  />
                )}
                <Form
                  getFormApi={(api) => setFormApi(api)}
                  initValues={{
                    email: email || '',
                    newPassword: newPassword || '',
                  }}
                  className={authFormClassName}
                >
                  <Form.Input
                    field='email'
                    label={t('邮箱')}
                    name='email'
                    disabled={true}
                    autoComplete='email'
                    prefix={<IconMail />}
                    placeholder={email ? '' : t('等待获取邮箱信息...')}
                  />

                  {newPassword && (
                    <Form.Input
                      field='newPassword'
                      label={t('新密码')}
                      name='newPassword'
                      disabled={true}
                      prefix={<IconLock />}
                      suffix={
                        <Button
                          icon={<IconCopy />}
                          type='tertiary'
                          theme='outline'
                          className={subtleActionButtonClassName}
                          onClick={async () => {
                            await copy(newPassword);
                            showNotice(
                              `${t('密码已复制到剪贴板：')} ${newPassword}`,
                            );
                          }}
                        >
                          {t('复制')}
                        </Button>
                      }
                    />
                  )}

                  <div className='space-y-2 pt-2'>
                    <Button
                      theme='solid'
                      className={primaryButtonClassName}
                      type='primary'
                      htmlType='submit'
                      onClick={handleSubmit}
                      loading={loading}
                      disabled={
                        disableButton || newPassword || !isValidResetLink
                      }
                    >
                      {newPassword
                        ? t('密码重置完成')
                        : disableButton
                          ? `${t('重试')} (${countdown})`
                          : t('确认重置密码')}
                    </Button>
                  </div>
                </Form>

                <div className='mt-6 text-center text-sm'>
                  <Text className={auxiliaryTextClassName}>
                    <Link to='/login' className={authLinkClassName}>
                      {t('返回登录')}
                    </Link>
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirm;
