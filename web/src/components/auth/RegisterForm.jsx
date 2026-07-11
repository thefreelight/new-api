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

import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  API,
  showError,
  showInfo,
  showSuccess,
  updateAPI,
  getOAuthProviderIcon,
  setUserData,
  onDiscordOAuthClicked,
  onCustomOAuthClicked,
} from '../../helpers';
import Turnstile from 'react-turnstile';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Icon,
  Modal,
} from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';
import {
  IconGithubLogo,
  IconMail,
  IconUser,
  IconLock,
  IconKey,
} from '@douyinfe/semi-icons';
import {
  onGitHubOAuthClicked,
  onLinuxDOOAuthClicked,
  onOIDCClicked,
} from '../../helpers';
import OIDCIcon from '../common/logo/OIDCIcon';
import LinuxDoIcon from '../common/logo/LinuxDoIcon';
import WeChatIcon from '../common/logo/WeChatIcon';
import TelegramLoginButton from 'react-telegram-login/src';
import { UserContext } from '../../context/User';
import { StatusContext } from '../../context/Status';
import { useTranslation } from 'react-i18next';
import { SiDiscord } from 'react-icons/si';

const RegisterForm = () => {
  let navigate = useNavigate();
  const { t } = useTranslation();
  const githubButtonTextKeyByState = {
    idle: '使用 GitHub 继续',
    redirecting: '正在跳转 GitHub...',
    timeout: '请求超时，请刷新页面后重新发起 GitHub 登录',
  };
  const [inputs, setInputs] = useState({
    username: '',
    password: '',
    password2: '',
    email: '',
    verification_code: '',
    wechat_verification_code: '',
  });
  const { username, password, password2 } = inputs;
  const [, userDispatch] = useContext(UserContext);
  const [statusState] = useContext(StatusContext);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [showWeChatLoginModal, setShowWeChatLoginModal] = useState(false);
  const [showEmailRegister, setShowEmailRegister] = useState(false);
  const [wechatLoading, setWechatLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(false);
  const [oidcLoading, setOidcLoading] = useState(false);
  const [linuxdoLoading, setLinuxdoLoading] = useState(false);
  const [emailRegisterLoading, setEmailRegisterLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [verificationCodeLoading, setVerificationCodeLoading] = useState(false);
  const [otherRegisterOptionsLoading, setOtherRegisterOptionsLoading] =
    useState(false);
  const [wechatCodeSubmitLoading, setWechatCodeSubmitLoading] = useState(false);
  const [customOAuthLoading, setCustomOAuthLoading] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [hasUserAgreement, setHasUserAgreement] = useState(false);
  const [hasPrivacyPolicy, setHasPrivacyPolicy] = useState(false);
  const [githubButtonState, setGithubButtonState] = useState('idle');
  const [githubButtonDisabled, setGithubButtonDisabled] = useState(false);
  const githubTimeoutRef = useRef(null);
  const githubButtonText = t(githubButtonTextKeyByState[githubButtonState]);
  const authFormClassName =
    'space-y-3 [&_.semi-input-wrapper]:!rounded-md [&_.semi-input-wrapper]:!border [&_.semi-input-wrapper]:!border-[#dfe3e8] [&_.semi-input-wrapper]:!bg-[#fbfbf9] [&_.semi-input-wrapper]:!shadow-none [&_.semi-input-wrapper:hover]:!border-[#cbd1d8] [&_.semi-input-wrapper:focus-within]:!border-[#ff5a1f] [&_.semi-input-wrapper:focus-within]:!bg-white [&_.semi-input-wrapper:focus-within]:!shadow-[0_0_0_3px_rgba(255,90,31,0.14)] [&_.semi-input]:!text-[#171d27] [&_.semi-input-prefix]:!text-[#7b8490] [&_.semi-input-suffix]:!text-[#7b8490]';
  const authLinkClassName =
    'font-medium text-[#ff5a1f] underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 hover:text-[#d94a15] hover:decoration-current';
  const oauthButtonClassName =
    'flex h-11 w-full items-center justify-center !rounded-md border border-[#dfe3e8] bg-white text-[#171d27] transition duration-200 hover:border-[#cbd1d8] hover:bg-[#fbfbf9] disabled:border-[#e6eaef] disabled:bg-[#f7f8f6] disabled:text-[#a1a8b3]';
  const primaryButtonClassName =
    'flex h-11 w-full items-center justify-center !rounded-md !bg-[#ff5a1f] font-medium !text-[#14100d] transition duration-200 hover:!bg-[#ff6a32] disabled:!bg-[#f0b49b] disabled:!text-[#fff5ef]';
  const secondaryButtonClassName =
    'h-11 w-full !rounded-md border border-[#dfe3e8] !bg-white font-medium !text-[#4f5864] transition duration-200 hover:!border-[#cbd1d8] hover:!bg-[#fbfbf9] hover:!text-[#171d27]';
  const verificationButtonClassName =
    'h-8 !rounded-md border border-[#dfe3e8] !bg-white px-3 !text-xs font-medium !text-[#4f5864] transition duration-200 hover:!border-[#cbd1d8] hover:!bg-[#fbfbf9] hover:!text-[#171d27] disabled:!border-[#e6eaef] disabled:!bg-[#f7f8f6] disabled:!text-[#a1a8b3]';
  const termsTextClassName = 'text-[#5c6672] leading-6';
  const auxiliaryTextClassName = '!text-[#6d7681]';

  let affCode = new URLSearchParams(window.location.search).get('aff');
  if (affCode) {
    localStorage.setItem('aff', affCode);
  }

  const status = useMemo(() => {
    if (statusState?.status) return statusState.status;
    const savedStatus = localStorage.getItem('status');
    if (!savedStatus) return {};
    try {
      return JSON.parse(savedStatus) || {};
    } catch (err) {
      return {};
    }
  }, [statusState?.status]);
  const hasCustomOAuthProviders =
    (status.custom_oauth_providers || []).length > 0;
  const hasOAuthRegisterOptions = Boolean(
    status.github_oauth ||
    status.discord_oauth ||
    status.oidc_enabled ||
    status.wechat_login ||
    status.linuxdo_oauth ||
    status.telegram_oauth ||
    hasCustomOAuthProviders,
  );

  const [showEmailVerification, setShowEmailVerification] = useState(false);

  useEffect(() => {
    setShowEmailVerification(!!status?.email_verification);
    if (status?.turnstile_check) {
      setTurnstileEnabled(true);
      setTurnstileSiteKey(status.turnstile_site_key);
    }

    // 从 status 获取用户协议和隐私政策的启用状态
    setHasUserAgreement(status?.user_agreement_enabled || false);
    setHasPrivacyPolicy(status?.privacy_policy_enabled || false);
  }, [status]);

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
    return () => clearInterval(countdownInterval); // Clean up on unmount
  }, [disableButton, countdown]);

  useEffect(() => {
    return () => {
      if (githubTimeoutRef.current) {
        clearTimeout(githubTimeoutRef.current);
      }
    };
  }, []);

  const onWeChatLoginClicked = () => {
    setWechatLoading(true);
    setShowWeChatLoginModal(true);
    setWechatLoading(false);
  };

  const onSubmitWeChatVerificationCode = async () => {
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setWechatCodeSubmitLoading(true);
    try {
      const res = await API.get(
        `/api/oauth/wechat?code=${inputs.wechat_verification_code}`,
      );
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        setUserData(data);
        updateAPI();
        navigate('/');
        showSuccess('登录成功！');
        setShowWeChatLoginModal(false);
      } else {
        showError(message);
      }
    } catch (error) {
      showError('登录失败，请重试');
    } finally {
      setWechatCodeSubmitLoading(false);
    }
  };

  function handleChange(name, value) {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  async function handleSubmit() {
    if (password.length < 8) {
      showInfo('密码长度不得小于 8 位！');
      return;
    }
    if (password !== password2) {
      showInfo('两次输入的密码不一致');
      return;
    }
    if (username && password) {
      if (turnstileEnabled && turnstileToken === '') {
        showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
        return;
      }
      setRegisterLoading(true);
      try {
        if (!affCode) {
          affCode = localStorage.getItem('aff');
        }
        inputs.aff_code = affCode;
        const res = await API.post(
          `/api/user/register?turnstile=${turnstileToken}`,
          inputs,
        );
        const { success, message } = res.data;
        if (success) {
          navigate('/login');
          showSuccess('注册成功！');
        } else {
          showError(message);
        }
      } catch (error) {
        showError('注册失败，请重试');
      } finally {
        setRegisterLoading(false);
      }
    }
  }

  const sendVerificationCode = async () => {
    if (inputs.email === '') return;
    if (turnstileEnabled && turnstileToken === '') {
      showInfo('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setVerificationCodeLoading(true);
    try {
      const res = await API.get(
        `/api/verification?email=${encodeURIComponent(inputs.email)}&turnstile=${turnstileToken}`,
      );
      const { success, message } = res.data;
      if (success) {
        showSuccess('验证码发送成功，请检查你的邮箱！');
        setDisableButton(true); // 发送成功后禁用按钮，开始倒计时
      } else {
        showError(message);
      }
    } catch (error) {
      showError('发送验证码失败，请重试');
    } finally {
      setVerificationCodeLoading(false);
    }
  };

  const handleGitHubClick = () => {
    if (githubButtonDisabled) {
      return;
    }
    setGithubLoading(true);
    setGithubButtonDisabled(true);
    setGithubButtonState('redirecting');
    if (githubTimeoutRef.current) {
      clearTimeout(githubTimeoutRef.current);
    }
    githubTimeoutRef.current = setTimeout(() => {
      setGithubLoading(false);
      setGithubButtonState('timeout');
      setGithubButtonDisabled(true);
    }, 20000);
    try {
      onGitHubOAuthClicked(status.github_client_id, { shouldLogout: true });
    } finally {
      setTimeout(() => setGithubLoading(false), 3000);
    }
  };

  const handleDiscordClick = () => {
    setDiscordLoading(true);
    try {
      onDiscordOAuthClicked(status.discord_client_id, { shouldLogout: true });
    } finally {
      setTimeout(() => setDiscordLoading(false), 3000);
    }
  };

  const handleOIDCClick = () => {
    setOidcLoading(true);
    try {
      onOIDCClicked(
        status.oidc_authorization_endpoint,
        status.oidc_client_id,
        false,
        { shouldLogout: true },
      );
    } finally {
      setTimeout(() => setOidcLoading(false), 3000);
    }
  };

  const handleLinuxDOClick = () => {
    setLinuxdoLoading(true);
    try {
      onLinuxDOOAuthClicked(status.linuxdo_client_id, { shouldLogout: true });
    } finally {
      setTimeout(() => setLinuxdoLoading(false), 3000);
    }
  };

  const handleCustomOAuthClick = (provider) => {
    setCustomOAuthLoading((prev) => ({ ...prev, [provider.slug]: true }));
    try {
      onCustomOAuthClicked(provider, { shouldLogout: true });
    } finally {
      setTimeout(() => {
        setCustomOAuthLoading((prev) => ({ ...prev, [provider.slug]: false }));
      }, 3000);
    }
  };

  const handleEmailRegisterClick = () => {
    setEmailRegisterLoading(true);
    setShowEmailRegister(true);
    setEmailRegisterLoading(false);
  };

  const handleOtherRegisterOptionsClick = () => {
    setOtherRegisterOptionsLoading(true);
    setShowEmailRegister(false);
    setOtherRegisterOptionsLoading(false);
  };

  const onTelegramLoginClicked = async (response) => {
    const fields = [
      'id',
      'first_name',
      'last_name',
      'username',
      'photo_url',
      'auth_date',
      'hash',
      'lang',
    ];
    const params = {};
    fields.forEach((field) => {
      if (response[field]) {
        params[field] = response[field];
      }
    });
    try {
      const res = await API.get(`/api/oauth/telegram/login`, { params });
      const { success, message, data } = res.data;
      if (success) {
        userDispatch({ type: 'login', payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        showSuccess('登录成功！');
        setUserData(data);
        updateAPI();
        navigate('/');
      } else {
        showError(message);
      }
    } catch (error) {
      showError('登录失败，请重试');
    }
  };

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

  const renderOAuthOptions = () => {
    return (
      <div className='flex flex-col items-center'>
        <div className='w-full max-w-md'>
          <Card className='overflow-hidden border border-[#dfe3e8] !rounded-lg bg-[#ffffff] shadow-[0_24px_90px_rgba(17,23,34,0.08)]'>
            <div className='flex justify-center px-8 pb-2 pt-8'>
              <Title
                heading={3}
                className='!m-0 !text-[24px] !font-medium !text-[#111722]'
              >
                {t('注册')}
              </Title>
            </div>
            <div className='px-7 pb-8 pt-7 sm:px-8'>
              <div className='space-y-3'>
                {status.wechat_login && (
                  <Button
                    theme='outline'
                    className={oauthButtonClassName}
                    type='tertiary'
                    icon={
                      <Icon svg={<WeChatIcon />} style={{ color: '#07C160' }} />
                    }
                    onClick={onWeChatLoginClicked}
                    loading={wechatLoading}
                  >
                    <span className='ml-3'>{t('使用 微信 继续')}</span>
                  </Button>
                )}

                {status.github_oauth && (
                  <Button
                    theme='outline'
                    className={oauthButtonClassName}
                    type='tertiary'
                    icon={<IconGithubLogo size='large' />}
                    onClick={handleGitHubClick}
                    loading={githubLoading}
                    disabled={githubButtonDisabled}
                  >
                    <span className='ml-3'>{githubButtonText}</span>
                  </Button>
                )}

                {status.discord_oauth && (
                  <Button
                    theme='outline'
                    className={oauthButtonClassName}
                    type='tertiary'
                    icon={
                      <SiDiscord
                        style={{
                          color: '#5865F2',
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    }
                    onClick={handleDiscordClick}
                    loading={discordLoading}
                  >
                    <span className='ml-3'>{t('使用 Discord 继续')}</span>
                  </Button>
                )}

                {status.oidc_enabled && (
                  <Button
                    theme='outline'
                    className={oauthButtonClassName}
                    type='tertiary'
                    icon={<OIDCIcon style={{ color: '#1877F2' }} />}
                    onClick={handleOIDCClick}
                    loading={oidcLoading}
                  >
                    <span className='ml-3'>{t('使用 OIDC 继续')}</span>
                  </Button>
                )}

                {status.linuxdo_oauth && (
                  <Button
                    theme='outline'
                    className={oauthButtonClassName}
                    type='tertiary'
                    icon={
                      <LinuxDoIcon
                        style={{
                          color: '#E95420',
                          width: '20px',
                          height: '20px',
                        }}
                      />
                    }
                    onClick={handleLinuxDOClick}
                    loading={linuxdoLoading}
                  >
                    <span className='ml-3'>{t('使用 LinuxDO 继续')}</span>
                  </Button>
                )}

                {status.custom_oauth_providers &&
                  status.custom_oauth_providers.map((provider) => (
                    <Button
                      key={provider.slug}
                      theme='outline'
                      className={oauthButtonClassName}
                      type='tertiary'
                      icon={getOAuthProviderIcon(provider.icon || '', 20)}
                      onClick={() => handleCustomOAuthClick(provider)}
                      loading={customOAuthLoading[provider.slug]}
                    >
                      <span className='ml-3'>
                        {t('使用 {{name}} 继续', { name: provider.name })}
                      </span>
                    </Button>
                  ))}

                {status.telegram_oauth && (
                  <div className='flex justify-center my-2'>
                    <TelegramLoginButton
                      dataOnauth={onTelegramLoginClicked}
                      botName={status.telegram_bot_name}
                    />
                  </div>
                )}

                <Divider margin='12px' align='center'>
                  {t('或')}
                </Divider>

                <Button
                  theme='solid'
                  type='primary'
                  className={primaryButtonClassName}
                  icon={<IconMail size='large' />}
                  onClick={handleEmailRegisterClick}
                  loading={emailRegisterLoading}
                >
                  <span className='ml-3'>{t('使用 用户名 注册')}</span>
                </Button>
              </div>

              <div className='mt-6 text-center text-sm'>
                <Text className={auxiliaryTextClassName}>
                  {t('已有账户？')}{' '}
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
    );
  };

  const renderEmailRegisterForm = () => {
    return (
      <div className='flex flex-col items-center'>
        <div className='w-full max-w-md'>
          <Card className='overflow-hidden border border-[#dfe3e8] !rounded-lg bg-[#ffffff] shadow-[0_24px_90px_rgba(17,23,34,0.08)]'>
            <div className='flex justify-center px-8 pb-2 pt-8'>
              <Title
                heading={3}
                className='!m-0 !text-[24px] !font-medium !text-[#111722]'
              >
                {t('注册')}
              </Title>
            </div>
            <div className='px-7 pb-8 pt-7 sm:px-8'>
              <Form className={authFormClassName}>
                <Form.Input
                  field='username'
                  label={t('用户名')}
                  placeholder={t('请输入用户名')}
                  name='username'
                  autoComplete='username'
                  onChange={(value) => handleChange('username', value)}
                  prefix={<IconUser />}
                />

                <Form.Input
                  field='password'
                  label={t('密码')}
                  placeholder={t('输入密码，最短 8 位，最长 20 位')}
                  name='password'
                  mode='password'
                  autoComplete='new-password'
                  onChange={(value) => handleChange('password', value)}
                  prefix={<IconLock />}
                />

                <Form.Input
                  field='password2'
                  label={t('确认密码')}
                  placeholder={t('确认密码')}
                  name='password2'
                  mode='password'
                  autoComplete='new-password'
                  onChange={(value) => handleChange('password2', value)}
                  prefix={<IconLock />}
                />

                {showEmailVerification && (
                  <>
                    <Form.Input
                      field='email'
                      label={t('邮箱')}
                      placeholder={t('输入邮箱地址')}
                      name='email'
                      type='email'
                      autoComplete='email'
                      onChange={(value) => handleChange('email', value)}
                      prefix={<IconMail />}
                      suffix={
                        <Button
                          onClick={sendVerificationCode}
                          theme='outline'
                          type='tertiary'
                          className={verificationButtonClassName}
                          loading={verificationCodeLoading}
                          disabled={disableButton || verificationCodeLoading}
                        >
                          {disableButton
                            ? `${t('重新发送')} (${countdown})`
                            : t('获取验证码')}
                        </Button>
                      }
                    />
                    <Form.Input
                      field='verification_code'
                      label={t('验证码')}
                      placeholder={t('输入验证码')}
                      name='verification_code'
                      onChange={(value) =>
                        handleChange('verification_code', value)
                      }
                      prefix={<IconKey />}
                    />
                  </>
                )}

                {(hasUserAgreement || hasPrivacyPolicy) && (
                  <div className='pt-4'>
                    <Checkbox
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    >
                      <Text size='small' className={termsTextClassName}>
                        {t('我已阅读并同意')}
                        {hasUserAgreement && (
                          <>
                            {' '}
                            <a
                              href='/user-agreement'
                              target='_blank'
                              rel='noopener noreferrer'
                              className={authLinkClassName}
                            >
                              {t('用户协议')}
                            </a>
                          </>
                        )}
                        {hasUserAgreement && hasPrivacyPolicy && ` ${t('和')} `}
                        {hasPrivacyPolicy && (
                          <>
                            {' '}
                            <a
                              href='/privacy-policy'
                              target='_blank'
                              rel='noopener noreferrer'
                              className={authLinkClassName}
                            >
                              {t('隐私政策')}
                            </a>
                          </>
                        )}
                      </Text>
                    </Checkbox>
                  </div>
                )}

                <div className='space-y-2 pt-2'>
                  <Button
                    theme='solid'
                    className={primaryButtonClassName}
                    type='primary'
                    htmlType='submit'
                    onClick={handleSubmit}
                    loading={registerLoading}
                    disabled={
                      (hasUserAgreement || hasPrivacyPolicy) && !agreedToTerms
                    }
                  >
                    {t('注册')}
                  </Button>
                </div>
              </Form>

              {hasOAuthRegisterOptions && (
                <>
                  <Divider margin='12px' align='center'>
                    {t('或')}
                  </Divider>

                  <div className='mt-4 text-center'>
                    <Button
                      theme='outline'
                      type='tertiary'
                      className={secondaryButtonClassName}
                      onClick={handleOtherRegisterOptionsClick}
                      loading={otherRegisterOptionsLoading}
                    >
                      {t('其他注册选项')}
                    </Button>
                  </div>
                </>
              )}

              <div className='mt-6 text-center text-sm'>
                <Text className={auxiliaryTextClassName}>
                  {t('已有账户？')}{' '}
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
    );
  };

  const renderWeChatLoginModal = () => {
    return (
      <Modal
        title={t('微信扫码登录')}
        visible={showWeChatLoginModal}
        maskClosable={true}
        onOk={onSubmitWeChatVerificationCode}
        onCancel={() => setShowWeChatLoginModal(false)}
        okText={t('登录')}
        centered={true}
        okButtonProps={{
          loading: wechatCodeSubmitLoading,
        }}
      >
        <div className='flex flex-col items-center'>
          <img src={status.wechat_qrcode} alt='微信二维码' className='mb-4' />
        </div>

        <div className='text-center mb-4'>
          <p>
            {t('微信扫码关注公众号，输入「验证码」获取验证码（三分钟内有效）')}
          </p>
        </div>

        <Form className={authFormClassName}>
          <Form.Input
            field='wechat_verification_code'
            placeholder={t('验证码')}
            label={t('验证码')}
            value={inputs.wechat_verification_code}
            onChange={(value) =>
              handleChange('wechat_verification_code', value)
            }
          />
        </Form>
      </Modal>
    );
  };

  return (
    <div className='relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[linear-gradient(#eef2f4_1px,transparent_1px),linear-gradient(90deg,#eef2f4_1px,transparent_1px),#fbfaf8] bg-[length:42px_42px] px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8'>
      <div className='relative z-10 w-full max-w-[460px]'>
        {showEmailRegister || !hasOAuthRegisterOptions
          ? renderEmailRegisterForm()
          : renderOAuthOptions()}
        {renderWeChatLoginModal()}
      </div>
    </div>
  );
};

export default RegisterForm;
