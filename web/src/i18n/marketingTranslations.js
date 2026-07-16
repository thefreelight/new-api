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

import { homeTranslations } from './homeTranslations';

export const marketingTranslations = {
  en: {
    ...homeTranslations.en,
    开始使用: 'Get started',
    快速开始: 'Quick start',
    '创建 API Key': 'Create an API key',
    接口与模型: 'APIs and models',
    'API 参考': 'API reference',
    鉴权: 'Authentication',
    概览: 'Overview',
    文字对话: 'Chat',
    图片生成: 'Image generation',
    工具接入: 'Developer tools',
    帮助: 'Help',
    常见问题: 'Troubleshooting',
    获得支持: 'Get support',
    复制代码: 'Copy code',
    已复制: 'Copied',
    复制: 'Copy',
    'NavtoAI 开发文档': 'NavtoAI Developer Documentation',
    关闭目录: 'Close navigation',
    打开目录: 'Open navigation',
    搜索文档: 'Search documentation',
    文档目录: 'Documentation navigation',
    没有找到相关文档: 'No matching documentation found',
    返回首页: 'Back to home',
    '接入 NavtoAI': 'Integrate with NavtoAI',
    '用一个 API Key 调用已开通的主流模型。接口兼容 OpenAI 常见请求格式，可以从现有项目平滑迁移。':
      'Access leading models with one API key. OpenAI-compatible request formats make migration straightforward.',
    '你的 Base URL': 'Your Base URL',
    注册并登录: 'Create an account',
    '创建 NavtoAI 账号，然后进入控制台。':
      'Create your NavtoAI account, then open the console.',
    注册账号: 'Create account',
    '在令牌页面创建密钥，并按项目设置额度、模型范围和过期时间。':
      'Create a key on the Tokens page and set its quota, model access, and expiration for each project.',
    前往令牌管理: 'Manage API keys',
    发起第一条请求: 'Send your first request',
    '将下面的 Key 和模型名替换成控制台中的实际值。':
      'Replace the key and model below with values from your console.',
    你好: 'Hello',
    '创建与保护 API Key': 'Create and protect API keys',
    '请求通过 Bearer Token 鉴权。密钥只应保存在服务端环境变量中，不要提交到 Git，也不要放进浏览器端代码。':
      'Requests use Bearer Token authentication. Store keys only in server-side environment variables. Never commit them to Git or expose them in browser code.',
    '建议为每个项目创建独立 Key。发现泄露时可单独禁用，不影响其他业务。':
      'Use a separate key for each project. If one is exposed, you can disable it without affecting other services.',
    'NavtoAI 提供 OpenAI 兼容接口。可用模型与价格以控制台模型列表为准，调用时请使用列表中显示的模型 ID。':
      'NavtoAI provides OpenAI-compatible APIs. Available models and pricing are shown in the console; use the exact model ID listed there.',
    文字与多模态对话: 'Text and multimodal chat',
    查询可用模型: 'List available models',
    '发送消息数组并指定模型。需要流式返回时加入 stream: true。':
      'Send a message array and specify a model. Add stream: true for streaming responses.',
    '你是一名简洁的技术助手。': 'You are a concise technical assistant.',
    '解释什么是 API 网关': 'Explain what an API gateway is',
    '使用 OpenAI SDK': 'Use the OpenAI SDK',
    '只需替换 base_url，其余调用方式与官方 SDK 保持一致。':
      'Only replace base_url; the rest of the integration matches the official SDK.',
    '选择控制台已开通的图片模型，并描述期望的画面。':
      'Choose an enabled image model in the console and describe the image you want.',
    '雨后的未来城市街道，电影感摄影':
      'A futuristic city street after rain, cinematic photography',
    开发工具接入: 'Developer tool setup',
    '下面的示例使用当前站点地址。模型与 Key 请替换为控制台中的实际值。':
      'These examples use the current site URL. Replace the model and key with values from your console.',
    '在 ~/.codex/config.toml 中添加服务商配置：':
      'Add the provider configuration to ~/.codex/config.toml:',
    '在 Cursor 的 Models 设置中启用 OpenAI API Key，填入你的密钥，并将 Override OpenAI Base URL 设置为 {{apiBase}}。':
      'In Cursor Models settings, enable OpenAI API Key, enter your key, and set Override OpenAI Base URL to {{apiBase}}.',
    '401：鉴权失败': '401: Authentication failed',
    '检查 Key 是否完整、是否已启用，以及请求头是否为 Authorization: Bearer YOUR_KEY。':
      'Check that the key is complete and enabled, and that the header is Authorization: Bearer YOUR_KEY.',
    模型不可用: 'Model unavailable',
    '模型 ID 必须与控制台模型列表完全一致，同时确认令牌没有限制该模型。':
      'The model ID must exactly match the console list. Also verify that the API key allows this model.',
    '请求地址返回 404': 'Request returns 404',
    'OpenAI 兼容请求应使用以 /v1 结尾的 Base URL，避免重复拼接版本路径。':
      'OpenAI-compatible requests should use a Base URL ending in /v1. Avoid adding the version path twice.',
    余额或额度不足: 'Insufficient balance or quota',
    '检查账户余额、令牌额度和令牌过期时间。调整后可重新发起请求。':
      'Check your account balance, key quota, and expiration. Retry after updating them.',
    '仍然没有解决？': 'Still need help?',
    '请在控制台中保存请求时间、模型名称与错误信息，联系站点客服协助排查。不要发送完整 API Key。':
      'Save the request time, model name, and error details from the console, then contact support. Never send your complete API key.',
    查看调用日志: 'View request logs',
    本页目录: 'On this page',
  },
  ja: {
    ...homeTranslations.ja,
    开始使用: 'はじめる',
    快速开始: 'クイックスタート',
    '创建 API Key': 'APIキーを作成',
    接口与模型: 'APIとモデル',
    'API 参考': 'APIリファレンス',
    鉴权: '認証',
    概览: '概要',
    文字对话: 'チャット',
    图片生成: '画像生成',
    工具接入: '開発ツール',
    帮助: 'ヘルプ',
    常见问题: 'トラブルシューティング',
    获得支持: 'サポート',
    复制代码: 'コードをコピー',
    已复制: 'コピー済み',
    复制: 'コピー',
    'NavtoAI 开发文档': 'NavtoAI 開発者ドキュメント',
    关闭目录: 'メニューを閉じる',
    打开目录: 'メニューを開く',
    搜索文档: 'ドキュメントを検索',
    文档目录: 'ドキュメントメニュー',
    没有找到相关文档: '該当するドキュメントがありません',
    返回首页: 'ホームに戻る',
    '接入 NavtoAI': 'NavtoAIを導入する',
    '用一个 API Key 调用已开通的主流模型。接口兼容 OpenAI 常见请求格式，可以从现有项目平滑迁移。':
      '1つのAPIキーで主要モデルを利用できます。OpenAI互換のリクエスト形式により、既存プロジェクトからスムーズに移行できます。',
    '你的 Base URL': 'Base URL',
    注册并登录: 'アカウントを作成',
    '创建 NavtoAI 账号，然后进入控制台。':
      'NavtoAIアカウントを作成し、コンソールを開きます。',
    注册账号: 'アカウント作成',
    '在令牌页面创建密钥，并按项目设置额度、模型范围和过期时间。':
      'トークン画面でキーを作成し、プロジェクトごとに上限、モデル範囲、有効期限を設定します。',
    前往令牌管理: 'APIキーを管理',
    发起第一条请求: '最初のリクエストを送信',
    '将下面的 Key 和模型名替换成控制台中的实际值。':
      '以下のキーとモデル名をコンソールの実際の値に置き換えてください。',
    你好: 'こんにちは',
    '创建与保护 API Key': 'APIキーの作成と保護',
    '请求通过 Bearer Token 鉴权。密钥只应保存在服务端环境变量中，不要提交到 Git，也不要放进浏览器端代码。':
      'リクエストはBearer Tokenで認証します。キーはサーバー側の環境変数だけに保存し、Gitやブラウザーコードに含めないでください。',
    '建议为每个项目创建独立 Key。发现泄露时可单独禁用，不影响其他业务。':
      'プロジェクトごとに個別のキーを作成してください。漏えい時も他のサービスに影響せず無効化できます。',
    'NavtoAI 提供 OpenAI 兼容接口。可用模型与价格以控制台模型列表为准，调用时请使用列表中显示的模型 ID。':
      'NavtoAIはOpenAI互換APIを提供します。利用可能なモデルと料金はコンソールで確認し、表示されたモデルIDを使用してください。',
    文字与多模态对话: 'テキスト・マルチモーダルチャット',
    查询可用模型: 'モデル一覧を取得',
    '发送消息数组并指定模型。需要流式返回时加入 stream: true。':
      'メッセージ配列とモデルを指定します。ストリーミングには stream: true を追加します。',
    '你是一名简洁的技术助手。': '簡潔に答える技術アシスタントです。',
    '解释什么是 API 网关': 'APIゲートウェイとは何か説明してください',
    '使用 OpenAI SDK': 'OpenAI SDKを使う',
    '只需替换 base_url，其余调用方式与官方 SDK 保持一致。':
      'base_urlを置き換えるだけで、その他は公式SDKと同じです。',
    '选择控制台已开通的图片模型，并描述期望的画面。':
      'コンソールで有効な画像モデルを選び、生成したい画像を記述します。',
    '雨后的未来城市街道，电影感摄影': '雨上がりの未来都市、映画のような写真',
    开发工具接入: '開発ツールの設定',
    '下面的示例使用当前站点地址。模型与 Key 请替换为控制台中的实际值。':
      '以下の例は現在のサイトURLを使用します。モデルとキーはコンソールの値に置き換えてください。',
    '在 ~/.codex/config.toml 中添加服务商配置：':
      '~/.codex/config.toml にプロバイダー設定を追加します：',
    '在 Cursor 的 Models 设置中启用 OpenAI API Key，填入你的密钥，并将 Override OpenAI Base URL 设置为 {{apiBase}}。':
      'CursorのModels設定でOpenAI API Keyを有効にし、キーを入力してOverride OpenAI Base URLを{{apiBase}}に設定します。',
    '401：鉴权失败': '401：認証に失敗',
    '检查 Key 是否完整、是否已启用，以及请求头是否为 Authorization: Bearer YOUR_KEY。':
      'キーが完全で有効か、ヘッダーが Authorization: Bearer YOUR_KEY か確認してください。',
    模型不可用: 'モデルを利用できません',
    '模型 ID 必须与控制台模型列表完全一致，同时确认令牌没有限制该模型。':
      'モデルIDがコンソールの一覧と完全に一致し、APIキーでそのモデルが許可されているか確認してください。',
    '请求地址返回 404': 'リクエストが404を返す',
    'OpenAI 兼容请求应使用以 /v1 结尾的 Base URL，避免重复拼接版本路径。':
      'OpenAI互換リクエストでは/v1で終わるBase URLを使い、バージョンパスを重複させないでください。',
    余额或额度不足: '残高または上限が不足',
    '检查账户余额、令牌额度和令牌过期时间。调整后可重新发起请求。':
      '残高、キー上限、有効期限を確認し、更新後に再試行してください。',
    '仍然没有解决？': '解決しない場合',
    '请在控制台中保存请求时间、模型名称与错误信息，联系站点客服协助排查。不要发送完整 API Key。':
      'コンソールのリクエスト時刻、モデル名、エラー内容を保存してサポートへ連絡してください。完全なAPIキーは送信しないでください。',
    查看调用日志: 'リクエストログを見る',
    本页目录: 'このページの内容',
  },
  ko: {
    ...homeTranslations.ko,
    开始使用: '시작하기',
    快速开始: '빠른 시작',
    '创建 API Key': 'API 키 만들기',
    接口与模型: 'API 및 모델',
    'API 参考': 'API 레퍼런스',
    鉴权: '인증',
    概览: '개요',
    文字对话: '채팅',
    图片生成: '이미지 생성',
    工具接入: '개발 도구',
    帮助: '도움말',
    常见问题: '문제 해결',
    获得支持: '지원 받기',
    复制代码: '코드 복사',
    已复制: '복사됨',
    复制: '복사',
    'NavtoAI 开发文档': 'NavtoAI 개발자 문서',
    关闭目录: '메뉴 닫기',
    打开目录: '메뉴 열기',
    搜索文档: '문서 검색',
    文档目录: '문서 메뉴',
    没有找到相关文档: '일치하는 문서가 없습니다',
    返回首页: '홈으로',
    '接入 NavtoAI': 'NavtoAI 연동하기',
    '用一个 API Key 调用已开通的主流模型。接口兼容 OpenAI 常见请求格式，可以从现有项目平滑迁移。':
      '하나의 API 키로 주요 모델을 이용하세요. OpenAI 호환 요청 형식으로 기존 프로젝트에서 쉽게 이전할 수 있습니다.',
    '你的 Base URL': 'Base URL',
    注册并登录: '계정 만들기',
    '创建 NavtoAI 账号，然后进入控制台。':
      'NavtoAI 계정을 만든 뒤 콘솔을 여세요.',
    注册账号: '계정 만들기',
    '在令牌页面创建密钥，并按项目设置额度、模型范围和过期时间。':
      '토큰 페이지에서 키를 만들고 프로젝트별 한도, 모델 범위, 만료 시간을 설정하세요.',
    前往令牌管理: 'API 키 관리',
    发起第一条请求: '첫 요청 보내기',
    '将下面的 Key 和模型名替换成控制台中的实际值。':
      '아래 키와 모델 이름을 콘솔의 실제 값으로 바꾸세요.',
    你好: '안녕하세요',
    '创建与保护 API Key': 'API 키 생성 및 보호',
    '请求通过 Bearer Token 鉴权。密钥只应保存在服务端环境变量中，不要提交到 Git，也不要放进浏览器端代码。':
      '요청은 Bearer Token으로 인증합니다. 키는 서버 환경 변수에만 보관하고 Git이나 브라우저 코드에 넣지 마세요.',
    '建议为每个项目创建独立 Key。发现泄露时可单独禁用，不影响其他业务。':
      '프로젝트마다 별도 키를 사용하세요. 유출 시 다른 서비스에 영향 없이 해당 키만 비활성화할 수 있습니다.',
    'NavtoAI 提供 OpenAI 兼容接口。可用模型与价格以控制台模型列表为准，调用时请使用列表中显示的模型 ID。':
      'NavtoAI는 OpenAI 호환 API를 제공합니다. 사용 가능한 모델과 가격은 콘솔에서 확인하고 표시된 모델 ID를 사용하세요.',
    文字与多模态对话: '텍스트 및 멀티모달 채팅',
    查询可用模型: '사용 가능한 모델 조회',
    '发送消息数组并指定模型。需要流式返回时加入 stream: true。':
      '메시지 배열과 모델을 지정하세요. 스트리밍 응답에는 stream: true를 추가합니다.',
    '你是一名简洁的技术助手。': '간결하게 답하는 기술 도우미입니다.',
    '解释什么是 API 网关': 'API 게이트웨이가 무엇인지 설명해 주세요',
    '使用 OpenAI SDK': 'OpenAI SDK 사용',
    '只需替换 base_url，其余调用方式与官方 SDK 保持一致。':
      'base_url만 바꾸면 나머지 사용법은 공식 SDK와 같습니다.',
    '选择控制台已开通的图片模型，并描述期望的画面。':
      '콘솔에서 활성화된 이미지 모델을 선택하고 원하는 장면을 설명하세요.',
    '雨后的未来城市街道，电影感摄影':
      '비가 그친 미래 도시 거리, 영화 같은 사진',
    开发工具接入: '개발 도구 설정',
    '下面的示例使用当前站点地址。模型与 Key 请替换为控制台中的实际值。':
      '아래 예시는 현재 사이트 주소를 사용합니다. 모델과 키는 콘솔의 실제 값으로 바꾸세요.',
    '在 ~/.codex/config.toml 中添加服务商配置：':
      '~/.codex/config.toml에 공급자 설정을 추가하세요:',
    '在 Cursor 的 Models 设置中启用 OpenAI API Key，填入你的密钥，并将 Override OpenAI Base URL 设置为 {{apiBase}}。':
      'Cursor의 Models 설정에서 OpenAI API Key를 활성화하고 키를 입력한 뒤 Override OpenAI Base URL을 {{apiBase}}로 설정하세요.',
    '401：鉴权失败': '401: 인증 실패',
    '检查 Key 是否完整、是否已启用，以及请求头是否为 Authorization: Bearer YOUR_KEY。':
      '키가 온전하고 활성화되어 있는지, 헤더가 Authorization: Bearer YOUR_KEY인지 확인하세요.',
    模型不可用: '모델을 사용할 수 없음',
    '模型 ID 必须与控制台模型列表完全一致，同时确认令牌没有限制该模型。':
      '모델 ID가 콘솔 목록과 정확히 일치하고 API 키에서 해당 모델을 허용하는지 확인하세요.',
    '请求地址返回 404': '요청이 404를 반환함',
    'OpenAI 兼容请求应使用以 /v1 结尾的 Base URL，避免重复拼接版本路径。':
      'OpenAI 호환 요청은 /v1로 끝나는 Base URL을 사용하고 버전 경로를 중복하지 마세요.',
    余额或额度不足: '잔액 또는 한도 부족',
    '检查账户余额、令牌额度和令牌过期时间。调整后可重新发起请求。':
      '계정 잔액, 키 한도, 만료 시간을 확인하고 수정 후 다시 요청하세요.',
    '仍然没有解决？': '아직 해결되지 않았나요?',
    '请在控制台中保存请求时间、模型名称与错误信息，联系站点客服协助排查。不要发送完整 API Key。':
      '콘솔에서 요청 시간, 모델 이름, 오류 내용을 저장한 뒤 지원팀에 문의하세요. 전체 API 키는 보내지 마세요.',
    查看调用日志: '요청 로그 보기',
    本页目录: '이 페이지의 내용',
  },
};

export const withMarketingTranslations = (translation, language) => ({
  translation: {
    ...translation.translation,
    ...(marketingTranslations[language] || {}),
  },
});
