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

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import RehypeHighlight from 'rehype-highlight';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clipboard,
  Code2,
  KeyRound,
  Menu,
  Search,
  TerminalSquare,
  X,
} from 'lucide-react';
import 'highlight.js/styles/github-dark.css';
import './docs.css';

const navigation = [
  {
    label: '开始使用',
    items: [
      { id: 'quick-start', label: '快速开始' },
      { id: 'api-key', label: '创建 API Key' },
      { id: 'api-overview', label: '接口与模型' },
    ],
  },
  {
    label: 'API 参考',
    items: [
      { id: 'chat-api', label: '文字对话' },
      { id: 'sdk', label: 'OpenAI SDK' },
      { id: 'image-api', label: '图片生成' },
    ],
  },
  {
    label: '工具接入',
    id: 'tools',
    items: [
      { id: 'claude-code', label: 'Claude Code' },
      { id: 'codex', label: 'Codex' },
      { id: 'cursor', label: 'Cursor' },
    ],
  },
  {
    label: '帮助',
    items: [
      { id: 'errors', label: '常见问题' },
      { id: 'support', label: '获得支持' },
    ],
  },
];

const flatNavigation = navigation.flatMap((group) => group.items);

function CodeBlock({ language, children }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const source = String(children).trim();
  const markdown = `\`\`\`${language}\n${source}\n\`\`\``;

  const copyCode = async () => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className='docs-code-block'>
      <div className='docs-code-topbar'>
        <span>{language}</span>
        <button type='button' onClick={copyCode} aria-label={t('复制代码')}>
          {copied ? <Check size={15} /> : <Clipboard size={15} />}
          {copied ? t('已复制') : t('复制')}
        </button>
      </div>
      <ReactMarkdown rehypePlugins={[[RehypeHighlight, { detect: false }]]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className='docs-step'>
      <span>{number}</span>
      <div>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function Docs() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('quick-start');
  const apiBase = `${window.location.origin}/v1`;

  const filteredNavigation = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return navigation;
    return navigation
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          t(item.label).toLowerCase().includes(keyword),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query, t]);

  useEffect(() => {
    document.title = t('NavtoAI 开发文档');
    const sections = flatNavigation
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-18% 0px -70% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [t]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className='docs-page'>
      <header className='docs-mobile-header'>
        <Link className='docs-brand' to='/'>
          <span>N</span>
          <strong>NavtoAI Docs</strong>
        </Link>
        <button
          type='button'
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? t('关闭目录') : t('打开目录')}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <aside className={`docs-sidebar ${menuOpen ? 'is-open' : ''}`}>
        <Link className='docs-brand' to='/'>
          <span>N</span>
          <strong>NavtoAI Docs</strong>
        </Link>
        <label className='docs-search'>
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('搜索文档')}
            aria-label={t('搜索文档')}
          />
        </label>
        <nav aria-label={t('文档目录')}>
          {filteredNavigation.map((group) => (
            <div className='docs-nav-group' key={group.label}>
              <p>{t(group.label)}</p>
              {group.items.map((item) => (
                <a
                  className={activeId === item.id ? 'active' : ''}
                  href={`#${item.id}`}
                  key={item.id}
                  onClick={closeMenu}
                >
                  {t(item.label)}
                  <ChevronRight size={14} />
                </a>
              ))}
            </div>
          ))}
          {filteredNavigation.length === 0 && (
            <p className='docs-search-empty'>{t('没有找到相关文档')}</p>
          )}
        </nav>
        <Link className='docs-back-link' to='/'>
          <ArrowLeft size={16} /> {t('返回首页')}
        </Link>
      </aside>

      {menuOpen && (
        <button
          className='docs-overlay'
          type='button'
          onClick={closeMenu}
          aria-label={t('关闭目录')}
        />
      )}

      <main className='docs-main'>
        <article className='docs-article'>
          <section className='docs-intro' id='quick-start'>
            <p className='docs-kicker'>{t('开始使用')}</p>
            <h1>{t('接入 NavtoAI')}</h1>
            <p className='docs-lead'>
              {t(
                '用一个 API Key 调用已开通的主流模型。接口兼容 OpenAI 常见请求格式，可以从现有项目平滑迁移。',
              )}
            </p>
            <div className='docs-callout'>
              <Code2 size={19} />
              <div>
                <strong>{t('你的 Base URL')}</strong>
                <code>{apiBase}</code>
              </div>
            </div>
            <div className='docs-steps'>
              <Step number='1' title={t('注册并登录')}>
                <p>{t('创建 NavtoAI 账号，然后进入控制台。')}</p>
                <Link to='/register'>{t('注册账号')}</Link>
              </Step>
              <Step number='2' title={t('创建 API Key')}>
                <p>
                  {t(
                    '在令牌页面创建密钥，并按项目设置额度、模型范围和过期时间。',
                  )}
                </p>
                <Link to='/console/token'>{t('前往令牌管理')}</Link>
              </Step>
              <Step number='3' title={t('发起第一条请求')}>
                <p>{t('将下面的 Key 和模型名替换成控制台中的实际值。')}</p>
              </Step>
            </div>
            <CodeBlock language='bash'>{`curl ${apiBase}/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "${t('你好')}"}]
  }'`}</CodeBlock>
          </section>

          <section id='api-key'>
            <p className='docs-kicker'>{t('鉴权')}</p>
            <h2>{t('创建与保护 API Key')}</h2>
            <p>
              {t(
                '请求通过 Bearer Token 鉴权。密钥只应保存在服务端环境变量中，不要提交到 Git，也不要放进浏览器端代码。',
              )}
            </p>
            <CodeBlock language='bash'>{`export OPENAI_API_KEY="sk-your-api-key"
export OPENAI_BASE_URL="${apiBase}"`}</CodeBlock>
            <div className='docs-note'>
              <KeyRound size={18} />
              <p>
                {t(
                  '建议为每个项目创建独立 Key。发现泄露时可单独禁用，不影响其他业务。',
                )}
              </p>
            </div>
          </section>

          <section id='api-overview'>
            <p className='docs-kicker'>{t('概览')}</p>
            <h2>{t('接口与模型')}</h2>
            <p>
              {t(
                'NavtoAI 提供 OpenAI 兼容接口。可用模型与价格以控制台模型列表为准，调用时请使用列表中显示的模型 ID。',
              )}
            </p>
            <div className='docs-endpoint-list'>
              <div>
                <code>POST /v1/chat/completions</code>
                <span>{t('文字与多模态对话')}</span>
              </div>
              <div>
                <code>POST /v1/responses</code>
                <span>Responses API</span>
              </div>
              <div>
                <code>POST /v1/images/generations</code>
                <span>{t('图片生成')}</span>
              </div>
              <div>
                <code>GET /v1/models</code>
                <span>{t('查询可用模型')}</span>
              </div>
            </div>
          </section>

          <section id='chat-api'>
            <p className='docs-kicker'>{t('API 参考')}</p>
            <h2>{t('文字对话')}</h2>
            <p>
              {t('发送消息数组并指定模型。需要流式返回时加入 stream: true。')}
            </p>
            <CodeBlock language='json'>{`{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "system", "content": "${t('你是一名简洁的技术助手。')}" },
    { "role": "user", "content": "${t('解释什么是 API 网关')}" }
  ],
  "temperature": 0.7,
  "stream": false
}`}</CodeBlock>
          </section>

          <section id='sdk'>
            <p className='docs-kicker'>SDK</p>
            <h2>{t('使用 OpenAI SDK')}</h2>
            <p>{t('只需替换 base_url，其余调用方式与官方 SDK 保持一致。')}</p>
            <div className='docs-code-grid'>
              <div>
                <h3>Python</h3>
                <CodeBlock language='python'>{`from openai import OpenAI

client = OpenAI(
    api_key="sk-your-api-key",
    base_url="${apiBase}",
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "${t('你好')}"}],
)
print(response.choices[0].message.content)`}</CodeBlock>
              </div>
              <div>
                <h3>JavaScript</h3>
                <CodeBlock language='javascript'>{`import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "sk-your-api-key",
  baseURL: "${apiBase}",
});

const response = await client.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "${t('你好')}" }],
});

console.log(response.choices[0].message.content);`}</CodeBlock>
              </div>
            </div>
          </section>

          <section id='image-api'>
            <p className='docs-kicker'>{t('图片生成')}</p>
            <h2>{t('图片生成')}</h2>
            <p>{t('选择控制台已开通的图片模型，并描述期望的画面。')}</p>
            <CodeBlock language='bash'>{`curl ${apiBase}/images/generations \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "your-image-model",
    "prompt": "${t('雨后的未来城市街道，电影感摄影')}",
    "size": "1024x1024"
  }'`}</CodeBlock>
          </section>

          <section id='tools'>
            <p className='docs-kicker'>{t('工具接入')}</p>
            <h2>{t('开发工具接入')}</h2>
            <p>
              {t(
                '下面的示例使用当前站点地址。模型与 Key 请替换为控制台中的实际值。',
              )}
            </p>
          </section>

          <section id='claude-code' className='docs-tool-section'>
            <div className='docs-tool-title'>
              <TerminalSquare size={20} />
              <h2>Claude Code</h2>
            </div>
            <CodeBlock language='bash'>{`export ANTHROPIC_BASE_URL="${window.location.origin}"
export ANTHROPIC_AUTH_TOKEN="sk-your-api-key"
claude`}</CodeBlock>
          </section>

          <section id='codex' className='docs-tool-section'>
            <div className='docs-tool-title'>
              <TerminalSquare size={20} />
              <h2>Codex</h2>
            </div>
            <p>{t('在 ~/.codex/config.toml 中添加服务商配置：')}</p>
            <CodeBlock language='toml'>{`model = "gpt-5.1-codex"
model_provider = "navtoai"

[model_providers.navtoai]
name = "NavtoAI"
base_url = "${apiBase}"
env_key = "OPENAI_API_KEY"
wire_api = "responses"`}</CodeBlock>
          </section>

          <section id='cursor' className='docs-tool-section'>
            <div className='docs-tool-title'>
              <TerminalSquare size={20} />
              <h2>Cursor</h2>
            </div>
            <p>
              {t(
                '在 Cursor 的 Models 设置中启用 OpenAI API Key，填入你的密钥，并将 Override OpenAI Base URL 设置为 {{apiBase}}。',
                { apiBase },
              )}
            </p>
          </section>

          <section id='errors'>
            <p className='docs-kicker'>{t('常见问题')}</p>
            <h2>{t('常见问题')}</h2>
            <div className='docs-faq'>
              <details open>
                <summary>{t('401：鉴权失败')}</summary>
                <p>
                  {t(
                    '检查 Key 是否完整、是否已启用，以及请求头是否为 Authorization: Bearer YOUR_KEY。',
                  )}
                </p>
              </details>
              <details>
                <summary>{t('模型不可用')}</summary>
                <p>
                  {t(
                    '模型 ID 必须与控制台模型列表完全一致，同时确认令牌没有限制该模型。',
                  )}
                </p>
              </details>
              <details>
                <summary>{t('请求地址返回 404')}</summary>
                <p>
                  {t(
                    'OpenAI 兼容请求应使用以 /v1 结尾的 Base URL，避免重复拼接版本路径。',
                  )}
                </p>
              </details>
              <details>
                <summary>{t('余额或额度不足')}</summary>
                <p>
                  {t(
                    '检查账户余额、令牌额度和令牌过期时间。调整后可重新发起请求。',
                  )}
                </p>
              </details>
            </div>
          </section>

          <section id='support' className='docs-support'>
            <p className='docs-kicker'>{t('获得支持')}</p>
            <h2>{t('仍然没有解决？')}</h2>
            <p>
              {t(
                '请在控制台中保存请求时间、模型名称与错误信息，联系站点客服协助排查。不要发送完整 API Key。',
              )}
            </p>
            <Link to='/console/log'>
              {t('查看调用日志')} <ChevronRight size={16} />
            </Link>
          </section>
        </article>

        <aside className='docs-toc'>
          <strong>{t('本页目录')}</strong>
          {flatNavigation.map((item) => (
            <a
              className={activeId === item.id ? 'active' : ''}
              href={`#${item.id}`}
              key={item.id}
            >
              {t(item.label)}
            </a>
          ))}
        </aside>
      </main>
    </div>
  );
}
