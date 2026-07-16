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

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Code2,
  FileText,
  Image,
  Languages,
  LineChart,
  Lock,
  Monitor,
  Route,
  Sparkles,
  Sun,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { API } from '../../helpers';
import NoticeModal from '../../components/layout/NoticeModal';
import { StatusContext } from '../../context/Status';
import { UserContext } from '../../context/User';
import { useActualTheme } from '../../context/Theme';
import { useIsMobile } from '../../hooks/common/useIsMobile';
import { saveLanguagePreference } from '../../i18n/languagePreference';
import ModelGlobe from '../../components/home/ModelGlobe';
import './home.css';

const navItems = [
  { label: '首页', href: '#top' },
  { label: '模型', href: '#models' },
  { label: '价格', href: '#pricing' },
  { label: '代理合作', href: '#agent' },
  { label: '试验场', href: '/console/playground' },
  { label: '提示词库', href: '/console/playground?mode=image' },
  { label: '文档', href: '/docs' },
];

const homeLanguageOptions = [
  { value: 'zh-CN', label: '简体中文', code: 'ZH' },
  { value: 'zh-TW', label: '繁體中文', code: 'ZH' },
  { value: 'en', label: 'English', code: 'EN' },
  { value: 'fr', label: 'Français', code: 'FR' },
  { value: 'ja', label: '日本語', code: 'JA' },
  { value: 'ko', label: '한국어', code: 'KO' },
  { value: 'ru', label: 'Русский', code: 'RU' },
  { value: 'vi', label: 'Tiếng Việt', code: 'VI' },
];

const capabilities = [
  {
    title: '多模型统一接入',
    body: '通过一个网关统一管理可用模型，后续可按业务需要扩展更多模型渠道。',
    Icon: Sparkles,
  },
  {
    title: '计费与配额',
    body: '支持套餐、用量扣费、剩余额度和团队分配策略，方便统一成本管理。',
    Icon: WalletCards,
  },
  {
    title: 'Token 多渠道管理',
    body: '按用户、项目、场景拆分 Key，独立控制模型权限、过期时间与额度。',
    Icon: Lock,
  },
  {
    title: '日志与监控',
    body: '聚合请求日志、调用成功率、消耗趋势和异常事件，便于排障与审计。',
    Icon: LineChart,
  },
  {
    title: '异步任务追踪',
    body: '图片、视频等长耗时任务可在后台执行，并通过任务日志查看状态与结果。',
    Icon: Route,
  },
  {
    title: '提示词与 Playground',
    body: '从真实案例挑选提示词，一键带入 Playground，缩短从参考到生成的路径。',
    Icon: Image,
  },
];

const operationCards = [
  {
    title: '我们做什么',
    body: '把已开通的模型能力统一收敛到一个稳定入口，降低接入、密钥管理和用量排障成本。',
  },
  {
    title: '我们怎么交付',
    body: '围绕控制台持续维护渠道、模型、日志、额度和价格体系，协助客户完成配置和问题定位。',
  },
  {
    title: '适合谁使用',
    body: '适合需要多模型调用、团队额度管理、代理分销和客户 API 交付的开发者与团队。',
  },
];

const promptCards = [
  {
    title: '人像与摄影',
    body: '查找光线、镜头、构图和人物风格描述。',
    code: 'cinematic portrait, neon convenience store',
    Icon: UserRound,
  },
  {
    title: '海报与插画',
    body: '快速参考版式、色彩、材质和视觉主题。',
    code: 'bold poster layout, high contrast typography',
    Icon: FileText,
  },
  {
    title: 'UI 与社媒 Mockup',
    body: '用于产品截图、社交封面和界面概念图。',
    code: 'mobile app dashboard, glass card composition',
    Icon: Monitor,
  },
];

const agentItems = [
  {
    title: '统一项目资料',
    body: '提供产品介绍、常见问题、客户沟通口径和直播课资料，帮助代理讲清楚项目价值。',
    Icon: FileText,
  },
  {
    title: '推广素材支持',
    body: '围绕朋友圈、社群、私聊和短视频分发，提供可直接执行的素材和话术参考。',
    Icon: Sparkles,
  },
  {
    title: '客户承接协助',
    body: '代理引流来的客户，可通过官网、资料、直播课和团队支持完成进一步了解与转化。',
    Icon: UserRound,
  },
];

const pricingRows = [
  ['普通客户', '按需充值', '注册后在控制台查看已开通模型和余额消耗。'],
  ['联盟计划', '免费加入', '分享专属推荐链接，按有效推荐获得推广奖励。'],
  ['团队客户', '客服确认', '按实际渠道、额度、模型和支持需求确认。'],
];

const globeLabels = [
  {
    className: 'globe-label-models',
    title: '67 种模型',
    body: 'GPT / Claude / Gemini / 图像',
  },
  {
    className: 'globe-label-batch',
    title: '按批次开通模型',
    body: '以控制台已开通为准',
  },
  {
    className: 'globe-label-code',
    title: '代码/长文本场景',
    body: 'Claude / GPT 长上下文',
  },
  {
    className: 'globe-label-image',
    title: '多模态能力扩展',
    body: 'Gemini / 图像生成',
  },
  {
    className: 'globe-label-api',
    title: '主流接口兼容',
    body: 'OpenAI-compatible API',
  },
];

const terminalLines = [
  [{ className: 'token-comment', text: '// 配置兼容工具' }],
  [
    { className: 'token-keyword', text: 'export' },
    ' ',
    { className: 'token-variable', text: 'ANTHROPIC_BASE_URL' },
    { className: 'token-operator', text: '=' },
    { className: 'token-string', text: '"https://api.navtoai.com"' },
  ],
  [
    { className: 'token-keyword', text: 'export' },
    ' ',
    { className: 'token-variable', text: 'AI_GATEWAY_KEY' },
    { className: 'token-operator', text: '=' },
    { className: 'token-string', text: '"navtoai-demo-key"' },
  ],
  [
    { className: 'token-prompt', text: '$' },
    ' ',
    { className: 'token-command', text: 'your-ai-tool' },
  ],
  [],
  [{ className: 'token-comment', text: '// 配置 Codex' }],
  [
    { className: 'token-keyword', text: 'export' },
    ' ',
    { className: 'token-variable', text: 'OPENAI_BASE_URL' },
    { className: 'token-operator', text: '=' },
    { className: 'token-string', text: '"https://api.navtoai.com/v1"' },
  ],
  [
    { className: 'token-keyword', text: 'export' },
    ' ',
    { className: 'token-variable', text: 'OPENAI_API_KEY' },
    { className: 'token-operator', text: '=' },
    { className: 'token-string', text: '"navtoai-codex-demo-key"' },
  ],
  [
    { className: 'token-prompt', text: '$' },
    ' ',
    { className: 'token-command', text: 'codex' },
    ' ',
    { className: 'token-flag', text: '--model' },
    ' ',
    { className: 'token-argument', text: '已开通模型ID' },
  ],
];

const ProviderVisual = () => {
  const { t } = useTranslation();
  return (
    <div className='model-globe' aria-label={t('NavtoAI 多模型网络地球仪')}>
      <div className='globe-stage'>
        <div className='globe-canvas-shell'>
          <ModelGlobe />
        </div>

        {globeLabels.map((label) => (
          <div className={`globe-label ${label.className}`} key={label.title}>
            <span />
            <strong>{t(label.title)}</strong>
            <small>{t(label.body)}</small>
          </div>
        ))}

        <p className='globe-hint'>{t('拖动旋转')}</p>
      </div>
    </div>
  );
};

const LineIcon = ({ Icon }) => (
  <span className='line-icon'>
    <Icon size={20} strokeWidth={1.8} />
  </span>
);

const HighlightedTerminal = () => {
  const { t } = useTranslation();
  return (
    <pre aria-label='NavtoAI API terminal setup'>
      <code className='terminal-code'>
        {terminalLines.map((line, lineIndex) => (
          <span className='terminal-line' key={`terminal-line-${lineIndex}`}>
            {line.map((part, partIndex) =>
              typeof part === 'string' ? (
                <React.Fragment key={`terminal-text-${lineIndex}-${partIndex}`}>
                  {part}
                </React.Fragment>
              ) : (
                <span
                  className={part.className}
                  key={`terminal-token-${lineIndex}-${partIndex}`}
                >
                  {t(part.text)}
                </span>
              ),
            )}
          </span>
        ))}
      </code>
    </pre>
  );
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const [userState, userDispatch] = useContext(UserContext);
  const actualTheme = useActualTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState(
    () => localStorage.getItem('home_page_content') || '',
  );
  const [noticeVisible, setNoticeVisible] = useState(false);
  const customHomeIframeRef = useRef(null);
  const isMobile = useIsMobile();
  const isLocalPreview =
    import.meta.env.DEV &&
    ['127.0.0.1', 'localhost'].includes(window.location.hostname);

  const displayBrandName = 'NavtoAI';
  const currentUser = userState?.user;
  const accountLabel =
    currentUser?.display_name || currentUser?.username || t('我的账户');
  const isSetupComplete = statusState?.status?.setup !== false;
  const primaryLink = isSetupComplete ? '/console/token' : '/setup';
  const primaryActionLabel = isSetupComplete ? t('开始使用') : t('完成初始化');

  const docsLink = '/docs';

  const handleHomeLanguageChange = async (language) => {
    const previousLanguage = i18n.language;
    saveLanguagePreference(language);
    await i18n.changeLanguage(language);

    if (!currentUser?.id) return;

    try {
      const response = await API.put('/api/user/self', { language });
      if (!response.data.success) throw new Error('language update failed');

      let settings = {};
      if (currentUser.setting) {
        try {
          settings = JSON.parse(currentUser.setting) || {};
        } catch (error) {
          settings = {};
        }
      }
      settings.language = language;

      const nextUser = {
        ...currentUser,
        setting: JSON.stringify(settings),
      };
      userDispatch({ type: 'login', payload: nextUser });
      localStorage.setItem('user', JSON.stringify(nextUser));
    } catch (error) {
      saveLanguagePreference(previousLanguage);
      await i18n.changeLanguage(previousLanguage);
      console.error('Failed to save language preference:', error);
    }
  };

  const postIframePreferences = () => {
    const iframe = customHomeIframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage({ themeMode: actualTheme }, '*');
    iframe.contentWindow.postMessage({ lang: i18n.language }, '*');
  };

  const displayHomePageContent = async () => {
    try {
      const res = await API.get('/api/home_page_content', {
        skipErrorHandler: true,
      });
      const { success, data } = res.data;
      if (success) {
        let content = data;
        if (!data.startsWith('https://')) {
          content = marked.parse(data);
        }
        setHomePageContent(content);
        localStorage.setItem('home_page_content', content);
      } else {
        setHomePageContent('');
      }
    } catch {
      if (!homePageContent) {
        setHomePageContent('');
      }
    } finally {
      setHomePageContentLoaded(true);
    }
  };

  useEffect(() => {
    if (isLocalPreview) return;

    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice', {
            skipErrorHandler: true,
          });
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch {
          // Ignore notice failures on the public homepage.
        }
      }
    };

    checkNoticeAndShow();
  }, [isLocalPreview]);

  useEffect(() => {
    if (isLocalPreview) {
      setHomePageContent('');
      setHomePageContentLoaded(true);
      return;
    }

    displayHomePageContent().then();
  }, [isLocalPreview]);

  useEffect(() => {
    if (homePageContentLoaded && homePageContent === '') {
      document.title = 'NavtoAI API';
    }
  }, [homePageContent, homePageContentLoaded]);

  useEffect(() => {
    if (homePageContent.startsWith('https://')) {
      postIframePreferences();
    }
  }, [actualTheme, homePageContent, i18n.language]);

  if (homePageContentLoaded && homePageContent !== '') {
    return (
      <div className='overflow-x-hidden w-full'>
        <NoticeModal
          visible={noticeVisible}
          onClose={() => setNoticeVisible(false)}
          isMobile={isMobile}
        />
        {homePageContent.startsWith('https://') ? (
          <iframe
            ref={customHomeIframeRef}
            src={homePageContent}
            title={t('自定义首页内容')}
            className='w-full h-screen border-none'
            onLoad={postIframePreferences}
          />
        ) : (
          <div
            className='mt-[60px]'
            dangerouslySetInnerHTML={{ __html: homePageContent }}
          />
        )}
      </div>
    );
  }

  if (!homePageContentLoaded) {
    return (
      <div className='navto-site navto-site-loading'>
        <NoticeModal
          visible={noticeVisible}
          onClose={() => setNoticeVisible(false)}
          isMobile={isMobile}
        />
      </div>
    );
  }

  return (
    <main className='navto-site' id='top'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile}
      />

      <header className='site-header'>
        <div className='site-container nav-inner'>
          <Link
            className='brand'
            to='/'
            aria-label={`${displayBrandName} ${t('首页')}`}
          >
            <span className='brand-mark' aria-hidden='true'>
              <img src='/navtoai-logo.svg' alt='' />
            </span>
            <span>{displayBrandName}</span>
          </Link>

          <nav className='site-nav' aria-label={t('主导航')}>
            {navItems.map((item) =>
              item.href.startsWith('#') ? (
                <a key={item.label} href={item.href}>
                  {t(item.label)}
                </a>
              ) : (
                <Link key={item.label} to={item.href}>
                  {t(item.label)}
                </Link>
              ),
            )}
          </nav>

          <div className='nav-actions'>
            <button
              className='icon-button'
              type='button'
              aria-label={t('通知')}
            >
              <Bell size={18} />
            </button>
            <button
              className='icon-button'
              type='button'
              aria-label={t('切换主题')}
            >
              <Sun size={18} />
            </button>
            <button
              className='icon-button language-button'
              type='button'
              aria-label={t('语言')}
            >
              <Languages size={18} />
            </button>
            <div className='language-popover' aria-label={t('语言选项')}>
              {homeLanguageOptions.map((option) => (
                <button
                  type='button'
                  key={option.value}
                  className={i18n.language === option.value ? 'active' : ''}
                  onClick={() => handleHomeLanguageChange(option.value)}
                >
                  <span>{option.label}</span>
                  <b>{option.code}</b>
                </button>
              ))}
            </div>
            {currentUser ? (
              <>
                <Link className='login-link' to='/console'>
                  {t('控制台')}
                </Link>
                <Link
                  className='orange-button nav-register'
                  to='/console/personal'
                >
                  {accountLabel}
                </Link>
              </>
            ) : (
              <>
                <Link className='login-link' to='/login'>
                  {t('登录')}
                </Link>
                <Link className='orange-button nav-register' to='/register'>
                  {t('注册')}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className='hero-section'>
        <div className='site-container hero-grid'>
          <div className='hero-copy'>
            <p className='eyebrow'>{t('多模型统一网关')}</p>
            <h1>
              <span>{t('一站式AI')}</span>
              <span>{t('大模型网关')}</span>
            </h1>
            <p className='hero-lead'>
              {t(
                'NavtoAI 面向团队和开发者提供统一的模型网关入口，用一套控制台处理鉴权、额度、计费、日志和多端同步。',
              )}
            </p>
            <div className='hero-actions'>
              <Link className='orange-button' to={primaryLink}>
                {primaryActionLabel}
                <ArrowRight size={18} />
              </Link>
              <a className='ghost-button' href={docsLink}>
                {t('文档')}
              </a>
            </div>
          </div>

          <ProviderVisual />
        </div>
      </section>

      <section className='provider-strip'>
        <div className='site-container provider-inner'>
          <p>{t('兼容常见 API 接入习惯，统一管理模型调用、额度和日志')}</p>
          <div>
            <span>{t('文字对话')}</span>
            <span>{t('代码')}</span>
            <span>{t('图片生成')}</span>
            <span>AWS BEDROCK</span>
          </div>
        </div>
      </section>

      <section className='site-section quick-section' id='quick-start'>
        <div className='site-container two-column'>
          <div className='section-copy'>
            <p className='section-kicker'>{t('快速开始')}</p>
            <h2>{t('几分钟接入常用 AI 工具')}</h2>
            <p>
              {t(
                '把 Base URL 和 API Key 指向 NavtoAI，即可让常见开发工具和兼容 SDK 走同一个网关；具体模型以控制台已开通为准。',
              )}
            </p>
            <div className='feature-list'>
              <article>
                <LineIcon Icon={Code2} />
                <div>
                  <h3>{t('兼容主流调用习惯')}</h3>
                  <p>
                    {t(
                      '保留常见接口环境变量和请求格式，迁移成本更低；正式调用以控制台已开通模型为准。',
                    )}
                  </p>
                </div>
              </article>
              <article>
                <LineIcon Icon={Route} />
                <div>
                  <h3>{t('统一分发与计费')}</h3>
                  <p>
                    {t(
                      '模型选择、额度扣减、请求日志和异常排查都收敛到同一个控制面。',
                    )}
                  </p>
                </div>
              </article>
            </div>
            <div className='hero-actions compact'>
              <a className='orange-button' href={docsLink}>
                {t('查看 API 文档')}
              </a>
              <Link className='ghost-button' to='/console/playground'>
                {t('打开 Playground')}
              </Link>
            </div>
          </div>

          <div className='terminal-card'>
            <div className='terminal-top'>
              <div className='traffic'>
                <span />
                <span />
                <span />
              </div>
              <strong>TERMINAL - ZSH</strong>
              <em>{t('文字对话')}</em>
              <em>{t('代码')}</em>
            </div>
            <HighlightedTerminal />
          </div>
        </div>
      </section>

      <section className='site-section trust-section'>
        <div className='site-container'>
          <div className='section-heading split'>
            <div>
              <p className='section-kicker'>{t('真实运营')}</p>
              <h2>{t('NavtoAI，专注 AI 网关与企业级模型接入')}</h2>
              <p>
                {t(
                  'NavtoAI 打造统一的大模型中转与管理平台，为个人开发者、团队和企业客户提供模型接入、Token 管理、渠道调度、用量监控、价格核算和客户支持等一体化服务。',
                )}
              </p>
            </div>
            <a className='ghost-button' href={docsLink}>
              {t('查看接入文档')}
            </a>
          </div>

          <div className='company-intro'>
            {operationCards.map((item) => (
              <article key={item.title}>
                <span>{t(item.title)}</span>
                <p>{t(item.body)}</p>
              </article>
            ))}
          </div>

          <div
            className='trust-gallery'
            aria-label={t('NavtoAI 国际团队与交付现场')}
          >
            <article className='trust-photo trust-photo-large'>
              <img
                src='/static/trust/global/international-engineering-office.webp'
                alt={t('国际 AI 网关工程团队在开放式办公室工作')}
                loading='lazy'
                decoding='async'
              />
              <div className='trust-caption'>
                <span>{t('全球工程团队')}</span>
                <strong>{t('跨时区维护 AI 网关与模型渠道')}</strong>
              </div>
            </article>
            <article className='trust-photo'>
              <img
                src='/static/trust/global/international-reception.webp'
                alt={t('海外科技公司前台接待企业客户')}
                loading='lazy'
                decoding='async'
              />
              <div className='trust-caption'>
                <span>{t('客户接待')}</span>
                <strong>{t('为海外企业客户提供专业接入服务')}</strong>
              </div>
            </article>
            <article className='trust-photo'>
              <img
                src='/static/trust/global/international-strategy-meeting.webp'
                alt={t('多元化国际团队讨论 API 架构和模型路由')}
                loading='lazy'
                decoding='async'
              />
              <div className='trust-caption'>
                <span>{t('方案会议')}</span>
                <strong>{t('围绕 API 架构、路由策略和企业交付协作')}</strong>
              </div>
            </article>
            <article className='trust-photo trust-photo-wide'>
              <img
                src='/static/trust/global/international-customer-success.webp'
                alt={t('海外客户成功团队处理 API 用量和账单请求')}
                loading='lazy'
                decoding='async'
              />
              <div className='trust-caption'>
                <span>{t('客户成功')}</span>
                <strong>{t('持续跟进工单、配额、API Key 和异常请求')}</strong>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className='site-section core-section' id='models'>
        <div className='site-container'>
          <p className='section-kicker'>{t('核心能力')}</p>
          <div className='section-heading'>
            <h2>{t('从 API 接入到本地开发工作流')}</h2>
            <p>
              {t(
                '统一入口负责模型分发、密钥额度、价格透明、日志排障，也提供 Playground 和提示词库帮助用户直接验证效果。',
              )}
            </p>
          </div>
          <div className='ability-grid'>
            {capabilities.map(({ title, body, Icon }) => (
              <article key={title}>
                <LineIcon Icon={Icon} />
                <h3>{t(title)}</h3>
                <p>{t(body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='site-section prompt-section'>
        <div className='site-container prompt-layout'>
          <div className='section-copy'>
            <p className='section-kicker'>{t('图片提示词')}</p>
            <h2>{t('从提示词案例开始生成图片')}</h2>
            <p>
              {t(
                '提示词库收录社区案例，支持按分类搜索、复制 prompt，并可直接带入 Playground 试图。',
              )}
            </p>
            <div className='hero-actions compact'>
              <Link
                className='orange-button'
                to='/console/playground?mode=image'
              >
                {t('浏览提示词库')}
              </Link>
              <Link
                className='ghost-button'
                to='/console/playground?mode=image'
              >
                {t('打开生图试验场')}
              </Link>
            </div>
          </div>
          <div className='prompt-cards'>
            {promptCards.map(({ title, body, code, Icon }) => (
              <article key={title}>
                <LineIcon Icon={Icon} />
                <h3>{t(title)}</h3>
                <p>{t(body)}</p>
                <code>{code}</code>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className='site-section affiliate-section' id='agent'>
        <div className='site-container affiliate-layout'>
          <div className='section-copy'>
            <p className='section-kicker'>{t('合作伙伴权益')}</p>
            <h2>{t('合作伙伴权益与成长支持')}</h2>
            <p>
              {t(
                'NavtoAI 为合作伙伴提供产品介绍、技术培训、推广素材和客户接入支持，帮助团队在本地市场长期服务客户。',
              )}
            </p>
            <div className='hero-actions compact'>
              <Link className='orange-button' to='/register'>
                {t('了解合作伙伴计划')}
              </Link>
            </div>
          </div>
          <div className='affiliate-list'>
            {agentItems.map(({ title, body, Icon }) => (
              <article key={title}>
                <LineIcon Icon={Icon} />
                <div>
                  <h3>{t(title)}</h3>
                  <p>{t(body)}</p>
                </div>
              </article>
            ))}
          </div>
          <aside className='commission-card'>
            <div className='commission-head'>
              <p>{t('代理权益')}</p>
              <LineIcon Icon={BadgeCheck} />
            </div>
            <h3>{t('合作伙伴支持方案')}</h3>
            <dl>
              <dt>{t('产品培训')}</dt>
              <dd>{t('在线技术课程')}</dd>
              <dt>{t('市场素材')}</dt>
              <dd>{t('持续更新')}</dd>
              <dt>{t('客户支持')}</dt>
              <dd>{t('团队协助')}</dd>
            </dl>
            <div className='ledger'>
              <strong>{t('权益概览')}</strong>
              <p>
                <span>{t('资料')}</span>
                <b>{t('产品介绍与销售资料')}</b>
              </p>
              <p>
                <span>{t('启用')}</span>
                <b>{t('7 天上线计划')}</b>
              </p>
              <p>
                <span>{t('支持')}</span>
                <b>{t('社区与团队协助')}</b>
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className='site-section pricing-preview' id='pricing'>
        <div className='site-container'>
          <div className='section-heading split'>
            <div>
              <p className='section-kicker'>{t('价格')}</p>
              <h2>{t('以控制台显示的实时价格为准')}</h2>
              <p>
                {t(
                  '模型和区域会分批开放。注册后可在控制台查看当前可用模型、实时价格和团队方案。',
                )}
              </p>
            </div>
            <a className='ghost-button' href='#pricing'>
              {t('查看价格说明')}
            </a>
          </div>
          <div className='pricing-table'>
            <div className='pricing-tabs'>
              <strong>{t('计费说明')}</strong>
              <span>{t('透明定价')}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>{t('对象')}</th>
                  <th>{t('方式')}</th>
                  <th>{t('说明')}</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map(([target, method, description]) => (
                  <tr key={target}>
                    <td>{t(target)}</td>
                    <td>{t(method)}</td>
                    <td>{t(description)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className='next-step'>
        <div className='site-container next-card'>
          <p className='section-kicker'>{t('下一步')}</p>
          <h2>{t('立即开始使用 NavtoAI')}</h2>
          <p>
            {t(
              '接入模型、管理 API Key、追踪用量，并通过一个控制台服务全球团队。',
            )}
          </p>
          <div className='hero-actions compact center'>
            <Link
              className='orange-button'
              to={currentUser ? '/console' : '/register'}
            >
              {currentUser ? t('打开控制台') : t('注册 NavtoAI')}
            </Link>
            <Link
              className='ghost-button'
              to={currentUser ? '/console/token' : '/login'}
            >
              {currentUser ? t('管理令牌') : t('登录控制台')}
            </Link>
          </div>
        </div>
      </section>

      <footer className='site-footer'>
        <div className='site-container footer-inner'>
          <div>
            <strong>{displayBrandName}</strong>
            <p>
              {t('为 AI 应用、团队和渠道提供统一网关、额度管理与日志服务。')}
            </p>
          </div>
          <nav>
            <a href='#models'>{t('模型状态')}</a>
            <a href='#pricing'>{t('隐私')}</a>
            <a href='#pricing'>{t('条款')}</a>
            <a href='#pricing'>{t('退款')}</a>
            <Link to={currentUser ? '/console' : '/login'}>{t('控制台')}</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
};

export default Home;
