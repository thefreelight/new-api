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
import { API, showError, showInfo, showSuccess } from '../../helpers';
import Turnstile from 'react-turnstile';
import { Button, Card, Form, Typography } from '@douyinfe/semi-ui';
import { IconMail } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const PasswordResetForm = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState({
    email: '',
  });
  const { email } = inputs;

  const [loading, setLoading] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const authFormClassName =
    'space-y-3 [&_.semi-input-wrapper]:!rounded-md [&_.semi-input-wrapper]:!border [&_.semi-input-wrapper]:!border-[#dfe3e8] [&_.semi-input-wrapper]:!bg-[#fbfbf9] [&_.semi-input-wrapper]:!shadow-none [&_.semi-input-wrapper:hover]:!border-[#cbd1d8] [&_.semi-input-wrapper:focus-within]:!border-[#ff5a1f] [&_.semi-input-wrapper:focus-within]:!bg-white [&_.semi-input-wrapper:focus-within]:!shadow-[0_0_0_3px_rgba(255,90,31,0.14)] [&_.semi-input]:!text-[#171d27] [&_.semi-input-prefix]:!text-[#7b8490] [&_.semi-input-suffix]:!text-[#7b8490]';
  const primaryButtonClassName =
    'flex h-11 w-full items-center justify-center !rounded-md !bg-[#ff5a1f] font-medium !text-[#14100d] transition duration-200 hover:!bg-[#ff6a32] disabled:!bg-[#f0b49b] disabled:!text-[#fff5ef]';
  const authLinkClassName =
    'font-medium text-[#ff5a1f] underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-[#d94a15] hover:decoration-current';
  const auxiliaryTextClassName = '!text-[#6d7681]';

  useEffect(() => {
    let status = localStorage.getItem('status');
    if (status) {
      status = JSON.parse(status);
      if (status.turnstile_check) {
        setTurnstileEnabled(true);
        setTurnstileSiteKey(status.turnstile_site_key);
      }
    }
  }, []);

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

  function handleChange(value) {
    setInputs((inputs) => ({ ...inputs, email: value }));
  }

  async function handleSubmit() {
    if (!email) {
      showError(t('请输入邮箱地址'));
      return;
    }
    if (turnstileEnabled && turnstileToken === '') {
      showInfo(t('请稍后几秒重试，Turnstile 正在检查用户环境！'));
      return;
    }
    setDisableButton(true);
    setLoading(true);
    const res = await API.get(
      `/api/reset_password?email=${email}&turnstile=${turnstileToken}`,
    );
    const { success, message } = res.data;
    if (success) {
      showSuccess(t('重置邮件发送成功，请检查邮箱！'));
      setInputs({ ...inputs, email: '' });
    } else {
      showError(message);
    }
    setLoading(false);
  }

  const renderTurnstileBlock = () => {
    if (!turnstileEnabled) {
      return null;
    }

    return (
      <div className='mt-6 rounded-lg border border-[#e3e7eb] bg-[#fbfbf9] px-4 py-4 text-center shadow-[0_10px_30px_rgba(17,23,34,0.03)]'>
        <p className='mb-3 text-xs leading-6 text-[#68717d]'>
          {t('安全检查完成后即可继续')}
        </p>
        <div className='flex justify-center overflow-hidden'>
          <Turnstile
            sitekey={turnstileSiteKey}
            onVerify={(token) => {
              setTurnstileToken(token);
            }}
          />
        </div>
      </div>
    );
  };

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
                  {t('密码重置')}
                </Title>
              </div>
              <div className='px-7 pb-8 pt-7 sm:px-8'>
                <Form className={authFormClassName}>
                  <Form.Input
                    field='email'
                    label={t('邮箱')}
                    placeholder={t('请输入您的邮箱地址')}
                    name='email'
                    value={email}
                    autoComplete='email'
                    onChange={handleChange}
                    prefix={<IconMail />}
                  />

                  <div className='space-y-2 pt-2'>
                    <Button
                      theme='solid'
                      className={primaryButtonClassName}
                      type='primary'
                      htmlType='submit'
                      onClick={handleSubmit}
                      loading={loading}
                      disabled={disableButton}
                    >
                      {disableButton
                        ? `${t('重试')} (${countdown})`
                        : t('提交')}
                    </Button>
                  </div>
                </Form>

                <div className='mt-6 text-center text-sm'>
                  <Text className={auxiliaryTextClassName}>
                    {t('想起来了？')}{' '}
                    <Link to='/login' className={authLinkClassName}>
                      {t('登录')}
                    </Link>
                  </Text>
                </div>

                {renderTurnstileBlock()}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetForm;
