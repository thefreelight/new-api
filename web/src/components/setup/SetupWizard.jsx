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

import React, { useEffect, useState, useRef } from 'react';
import { Form } from '@douyinfe/semi-ui';
import {
  CheckCircle2,
  Database,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { API, showError, showNotice } from '../../helpers';
import { useTranslation } from 'react-i18next';

import StepNavigation from './components/StepNavigation';
import DatabaseStep from './components/steps/DatabaseStep';
import AdminStep from './components/steps/AdminStep';
import UsageModeStep from './components/steps/UsageModeStep';
import CompleteStep from './components/steps/CompleteStep';
import './setup.css';

const SetupWizard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState({
    status: false,
    root_init: false,
    database_type: '',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    usageMode: 'external',
  });

  // 确保默认选中“对外运营模式”，并同步到表单
  useEffect(() => {
    if (formRef.current) {
      formRef.current.setValue('usageMode', 'external');
    }
  }, []);

  // 定义步骤内容
  const steps = [
    {
      title: t('数据库检查'),
      description: t('验证数据库连接状态'),
      icon: Database,
    },
    {
      title: t('管理员账号'),
      description: t('设置管理员登录信息'),
      icon: UserRound,
    },
    {
      title: t('使用模式'),
      description: t('选择系统运行模式'),
      icon: SlidersHorizontal,
    },
    {
      title: t('完成初始化'),
      description: t('确认设置并完成初始化'),
      icon: ShieldCheck,
    },
  ];

  useEffect(() => {
    fetchSetupStatus();
  }, []);

  const fetchSetupStatus = async () => {
    try {
      const res = await API.get('/api/setup');
      const { success, data } = res.data;
      if (success) {
        setSetupStatus(data);

        // If setup is already completed, redirect to home
        if (data.status) {
          window.location.href = '/';
          return;
        }

        // 设置当前步骤 - 默认从数据库检查开始
        setCurrentStep(0);
      } else {
        showError(t('获取初始化状态失败'));
      }
    } catch (error) {
      console.error('Failed to fetch setup status:', error);
      showError(t('获取初始化状态失败'));
    }
  };

  const handleUsageModeChange = (e) => {
    const nextMode = e?.target?.value ?? e;
    setFormData((prev) => ({ ...prev, usageMode: nextMode }));
    // 同步到表单，便于 getValues() 拿到 usageMode
    if (formRef.current) {
      formRef.current.setValue('usageMode', nextMode);
    }
  };

  const next = () => {
    // 验证当前步骤是否可以继续
    if (!canProceedToNext()) {
      return;
    }

    const current = currentStep + 1;
    setCurrentStep(current);
  };

  // 验证是否可以继续到下一步
  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // 数据库检查步骤
        return true; // 数据库检查总是可以继续
      case 1: // 管理员账号步骤
        if (setupStatus.root_init) {
          return true; // 如果已经初始化，可以继续
        }
        // 检查必填字段
        if (
          !formData.username ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          showError(t('请填写完整的管理员账号信息'));
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          showError(t('两次输入的密码不一致'));
          return false;
        }
        if (formData.password.length < 8) {
          showError(t('密码长度至少为8个字符'));
          return false;
        }
        return true;
      case 2: // 使用模式步骤
        if (!formData.usageMode) {
          showError(t('请选择使用模式'));
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const prev = () => {
    const current = currentStep - 1;
    setCurrentStep(current);
  };

  const onSubmit = () => {
    if (!formRef.current) {
      console.error('Form reference is null');
      showError(t('表单引用错误，请刷新页面重试'));
      return;
    }

    const values = formRef.current.getValues();

    // For root_init=false, validate admin username and password
    if (!setupStatus.root_init) {
      if (!values.username || !values.username.trim()) {
        showError(t('请输入管理员用户名'));
        return;
      }

      if (!values.password || values.password.length < 8) {
        showError(t('密码长度至少为8个字符'));
        return;
      }

      if (values.password !== values.confirmPassword) {
        showError(t('两次输入的密码不一致'));
        return;
      }
    }

    // Prepare submission data
    const formValues = { ...values };
    const usageMode = values.usageMode;
    formValues.SelfUseModeEnabled = usageMode === 'self';
    formValues.DemoSiteEnabled = usageMode === 'demo';

    // Remove usageMode as it's not needed by the backend
    delete formValues.usageMode;

    // 提交表单至后端
    setLoading(true);

    // Submit to backend
    API.post('/api/setup', formValues)
      .then((res) => {
        const { success, message } = res.data;

        if (success) {
          showNotice(t('系统初始化成功，正在跳转...'));
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          showError(message || t('初始化失败，请重试'));
        }
      })
      .catch((error) => {
        console.error('API error:', error);
        showError(t('系统初始化失败，请重试'));
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 获取步骤内容
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <DatabaseStep setupStatus={setupStatus} t={t} />;
      case 1:
        return (
          <AdminStep
            setupStatus={setupStatus}
            formData={formData}
            setFormData={setFormData}
            formRef={formRef}
            t={t}
          />
        );
      case 2:
        return (
          <UsageModeStep
            formData={formData}
            handleUsageModeChange={handleUsageModeChange}
            t={t}
          />
        );
      case 3:
        return (
          <CompleteStep setupStatus={setupStatus} formData={formData} t={t} />
        );
      default:
        return null;
    }
  };

  const stepNavigationProps = {
    currentStep,
    steps,
    prev,
    next,
    onSubmit,
    loading,
    t,
  };

  const databaseLabels = {
    sqlite: 'SQLite',
    mysql: 'MySQL',
    postgres: 'PostgreSQL',
  };
  const usageModeLabels = {
    external: t('对外运营模式'),
    self: t('自用模式'),
    demo: t('演示站点模式'),
  };
  const databaseLabel =
    databaseLabels[setupStatus.database_type] || t('检测中');
  const usageModeLabel = usageModeLabels[formData.usageMode] || t('未选择');
  const activeStep = steps[currentStep];
  const ActiveStepIcon = activeStep.icon;
  const progressValue = Math.round(((currentStep + 1) / steps.length) * 100);
  const setupHost =
    typeof window !== 'undefined' && window.location?.host
      ? window.location.host
      : 'api.navtoai.com';

  return (
    <div className='navtoai-setup-page'>
      <div className='navtoai-setup-hero'>
        <div className='navtoai-setup-logo-wrap'>
          <img
            src='/navtoai-logo.svg'
            alt='NavtoAI'
            className='navtoai-setup-logo'
          />
        </div>
        <div className='setup-kicker'>
          <Sparkles size={14} />
          <span>{t('NavtoAI API Gateway')}</span>
        </div>
        <h1>{t('初始化 New API')}</h1>
        <p>{t('请按照引导步骤在首次登录前准备您的工作区。')}</p>
      </div>

      <div className='setup-shell'>
        <div className='setup-shell-header'>
          <div>
            <div className='setup-eyebrow'>{t('系统设置向导')}</div>
            <h2>{t('完成这些步骤以完成初始安装。')}</h2>
          </div>
          <div className='setup-host-pill'>
            <span className='setup-host-dot' />
            {setupHost}
          </div>
        </div>

        <div className='setup-step-grid'>
          {steps.map((item, index) => {
            const StepIcon = item.icon;
            const stateClass =
              index === currentStep
                ? 'is-active'
                : index < currentStep
                  ? 'is-complete'
                  : 'is-pending';

            return (
              <button
                type='button'
                key={item.title}
                className={`setup-step-card ${stateClass}`}
                disabled={index > currentStep}
                onClick={() => {
                  if (index < currentStep) {
                    setCurrentStep(index);
                  }
                }}
              >
                <span className='setup-step-index'>
                  {index < currentStep ? <CheckCircle2 size={16} /> : index + 1}
                </span>
                <span className='setup-step-copy'>
                  <span className='setup-step-title'>
                    <StepIcon size={18} />
                    {item.title}
                  </span>
                  <span className='setup-step-description'>
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className='setup-progress-track'>
          <span style={{ width: `${progressValue}%` }} />
        </div>

        <Form
          getFormApi={(formApi) => {
            formRef.current = formApi;
          }}
          initValues={formData}
        >
          <div className='setup-workspace'>
            <section className='setup-main-panel'>
              <div className='setup-panel-heading'>
                <div className='setup-panel-icon'>
                  <ActiveStepIcon size={22} />
                </div>
                <div>
                  <h3>{activeStep.title}</h3>
                  <p>{activeStep.description}</p>
                </div>
              </div>

              <div className='setup-step-content'>
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    style={{ display: currentStep === idx ? 'block' : 'none' }}
                  >
                    {React.cloneElement(getStepContent(idx), {
                      ...stepNavigationProps,
                      renderNavigationButtons: () => (
                        <StepNavigation {...stepNavigationProps} />
                      ),
                    })}
                  </div>
                ))}
              </div>
            </section>

            <aside className='setup-side-panel'>
              <div className='setup-side-label'>{t('当前配置')}</div>
              <div className='setup-side-list'>
                <div className='setup-side-row'>
                  <span>{t('数据库')}</span>
                  <strong>{databaseLabel}</strong>
                </div>
                <div className='setup-side-row'>
                  <span>{t('管理员账号')}</span>
                  <strong>
                    {setupStatus.root_init
                      ? t('已初始化')
                      : formData.username || t('待设置')}
                  </strong>
                </div>
                <div className='setup-side-row'>
                  <span>{t('运行模式')}</span>
                  <strong>{usageModeLabel}</strong>
                </div>
              </div>
              <div className='setup-side-status'>
                <div className='setup-side-status-icon'>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>{t('生产初始化')}</strong>
                  <span>
                    {setupStatus.database_type === 'postgres'
                      ? t('PostgreSQL 已就绪')
                      : t('确认数据库与管理员信息后完成安装')}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SetupWizard;
