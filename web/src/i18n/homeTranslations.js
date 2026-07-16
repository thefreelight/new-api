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

const rows = {
  首页: ['Home', 'ホーム', '홈'],
  模型: ['Models', 'モデル', '모델'],
  价格: ['Pricing', '料金', '가격'],
  代理合作: ['Partners', 'パートナー', '파트너'],
  试验场: ['Playground', 'プレイグラウンド', '플레이그라운드'],
  提示词库: ['Prompt library', 'プロンプト集', '프롬프트 라이브러리'],
  文档: ['Docs', 'ドキュメント', '문서'],
  登录: ['Sign in', 'ログイン', '로그인'],
  注册: ['Sign up', '新規登録', '회원가입'],
  控制台: ['Console', 'コンソール', '콘솔'],
  我的账户: ['My account', 'マイアカウント', '내 계정'],
  开始使用: ['Get started', 'はじめる', '시작하기'],
  完成初始化: ['Complete setup', '初期設定を完了', '설정 완료'],
  主导航: ['Main navigation', 'メインナビゲーション', '주요 탐색'],
  通知: ['Notifications', '通知', '알림'],
  切换主题: ['Change theme', 'テーマを変更', '테마 변경'],
  语言: ['Language', '言語', '언어'],
  语言选项: ['Language determined by region', '地域の言語', '지역 언어'],
  拖动旋转: ['Drag to rotate', 'ドラッグして回転', '드래그하여 회전'],
  自定义首页内容: [
    'Custom home page content',
    'カスタムホームページ',
    '사용자 지정 홈페이지 콘텐츠',
  ],
  'NavtoAI 多模型网络地球仪': [
    'NavtoAI global model network',
    'NavtoAIグローバルモデルネットワーク',
    'NavtoAI 글로벌 모델 네트워크',
  ],
  '67 种模型': ['67 models', '67モデル', '67개 모델'],
  'GPT / Claude / Gemini / 图像': [
    'GPT / Claude / Gemini / Image',
    'GPT / Claude / Gemini / 画像',
    'GPT / Claude / Gemini / 이미지',
  ],
  按批次开通模型: [
    'Models enabled in stages',
    'モデルを段階的に提供',
    '모델 단계별 제공',
  ],
  以控制台已开通为准: [
    'See enabled models in console',
    '利用可能なモデルはコンソールで確認',
    '활성 모델은 콘솔에서 확인',
  ],
  '代码/长文本场景': [
    'Code and long context',
    'コード・長文コンテキスト',
    '코드 및 긴 컨텍스트',
  ],
  'Claude / GPT 长上下文': [
    'Claude / GPT long context',
    'Claude / GPT 長文対応',
    'Claude / GPT 긴 컨텍스트',
  ],
  多模态能力扩展: [
    'Multimodal expansion',
    'マルチモーダル拡張',
    '멀티모달 확장',
  ],
  'Gemini / 图像生成': [
    'Gemini / Image generation',
    'Gemini / 画像生成',
    'Gemini / 이미지 생성',
  ],
  主流接口兼容: [
    'Mainstream API compatibility',
    '主要APIに対応',
    '주요 API 호환',
  ],
  '// 配置兼容工具': [
    '// Configure a compatible tool',
    '// 互換ツールを設定',
    '// 호환 도구 설정',
  ],
  '// 配置 Codex': ['// Configure Codex', '// Codexを設定', '// Codex 설정'],
  已开通模型ID: ['enabled-model-id', '利用可能なモデルID', '활성-모델-ID'],
  多模型统一网关: [
    'One gateway for every model',
    'マルチモデル統合ゲートウェイ',
    '멀티모델 통합 게이트웨이',
  ],
  代码: ['Code', 'コード', '코드'],
  真实运营: ['Real operations', '実際の運用体制', '실제 운영'],
  核心能力: ['Core capabilities', 'コア機能', '핵심 기능'],
  图片提示词: ['Image prompts', '画像プロンプト', '이미지 프롬프트'],
  一站式AI: ['One AI gateway', 'AIをひとつの', '하나의 AI'],
  大模型网关: ['for every model', 'ゲートウェイへ', '모델 게이트웨이'],
  'NavtoAI 面向团队和开发者提供统一的模型网关入口，用一套控制台处理鉴权、额度、计费、日志和多端同步。':
    [
      'NavtoAI gives developers and teams one gateway for authentication, quotas, billing, logs, and workflows across devices.',
      'NavtoAIは開発者とチームに、認証・上限・課金・ログ・複数端末の運用を一元管理できるモデルゲートウェイを提供します。',
      'NavtoAI는 개발자와 팀을 위해 인증, 한도, 과금, 로그, 멀티 디바이스 워크플로를 하나의 게이트웨이로 통합합니다.',
    ],
  '兼容常见 API 接入习惯，统一管理模型调用、额度和日志': [
    'OpenAI-compatible APIs with unified model, quota, and log management',
    '一般的なAPIに対応し、モデル・上限・ログを一元管理',
    '익숙한 API 형식으로 모델, 한도, 로그를 통합 관리',
  ],
  '几分钟接入常用 AI 工具': [
    'Connect your AI tools in minutes',
    '数分でAIツールを接続',
    '몇 분 만에 AI 도구 연결',
  ],
  '把 Base URL 和 API Key 指向 NavtoAI，即可让常见开发工具和兼容 SDK 走同一个网关；具体模型以控制台已开通为准。':
    [
      'Point your Base URL and API key to NavtoAI to route compatible SDKs and developer tools through one gateway. Enabled models are listed in the console.',
      'Base URLとAPIキーをNavtoAIに設定するだけで、互換SDKや開発ツールをひとつのゲートウェイに接続できます。利用可能なモデルはコンソールで確認できます。',
      'Base URL과 API 키를 NavtoAI로 설정하면 호환 SDK와 개발 도구를 하나의 게이트웨이로 연결할 수 있습니다. 활성 모델은 콘솔에서 확인하세요.',
    ],
  兼容主流调用习惯: [
    'Compatible by design',
    '使い慣れた形式に対応',
    '익숙한 호출 방식',
  ],
  '保留常见接口环境变量和请求格式，迁移成本更低；正式调用以控制台已开通模型为准。':
    [
      'Keep familiar environment variables and request formats for a low-friction migration. Use models enabled in your console.',
      '一般的な環境変数とリクエスト形式を維持し、移行負担を軽減します。利用可能なモデルはコンソールで確認してください。',
      '익숙한 환경 변수와 요청 형식을 유지해 이전 부담을 줄입니다. 콘솔에서 활성화된 모델을 사용하세요.',
    ],
  统一分发与计费: [
    'Unified routing and billing',
    'ルーティングと課金を一元化',
    '통합 라우팅 및 과금',
  ],
  '模型选择、额度扣减、请求日志和异常排查都收敛到同一个控制面。': [
    'Manage model routing, quota usage, request logs, and troubleshooting from one control plane.',
    'モデルルーティング、上限消費、リクエストログ、トラブル対応をひとつの管理画面に集約します。',
    '모델 라우팅, 한도 사용, 요청 로그, 문제 해결을 하나의 제어 화면에서 관리합니다.',
  ],
  '查看 API 文档': ['View API docs', 'APIドキュメントを見る', 'API 문서 보기'],
  '打开 Playground': ['Open Playground', 'Playgroundを開く', 'Playground 열기'],
  'NavtoAI，专注 AI 网关与企业级模型接入': [
    'Built for reliable enterprise AI access',
    '企業向けAIアクセスを支えるゲートウェイ',
    '안정적인 엔터프라이즈 AI 연동',
  ],
  'NavtoAI 打造统一的大模型中转与管理平台，为个人开发者、团队和企业客户提供模型接入、Token 管理、渠道调度、用量监控、价格核算和客户支持等一体化服务。':
    [
      'NavtoAI unifies model access, API key management, routing, usage monitoring, pricing, and customer success for developers, teams, and enterprises.',
      'NavtoAIは開発者、チーム、企業向けに、モデル接続、APIキー管理、ルーティング、利用状況、料金、サポートを一元化します。',
      'NavtoAI는 개발자, 팀, 기업을 위해 모델 연동, API 키 관리, 라우팅, 사용량 모니터링, 가격, 고객 지원을 통합합니다.',
    ],
  查看接入文档: ['Read integration docs', '導入ガイドを見る', '연동 문서 보기'],
  我们做什么: ['What we do', '提供するもの', '제공하는 가치'],
  '把已开通的模型能力统一收敛到一个稳定入口，降低接入、密钥管理和用量排障成本。':
    [
      'Bring enabled models behind one stable endpoint and reduce integration, key management, and troubleshooting overhead.',
      '利用可能なモデルを安定したひとつのエンドポイントにまとめ、導入・キー管理・障害対応の負担を減らします。',
      '활성 모델을 하나의 안정적인 엔드포인트로 통합해 연동, 키 관리, 문제 해결 비용을 줄입니다.',
    ],
  我们怎么交付: ['How we deliver', '提供方法', '제공 방식'],
  '围绕控制台持续维护渠道、模型、日志、额度和价格体系，协助客户完成配置和问题定位。':
    [
      'We continuously maintain providers, models, logs, quotas, and pricing, and help customers configure and troubleshoot integrations.',
      'プロバイダー、モデル、ログ、上限、料金を継続的に管理し、設定と問題解決を支援します。',
      '공급자, 모델, 로그, 한도, 가격을 지속적으로 관리하고 고객의 설정과 문제 해결을 지원합니다.',
    ],
  适合谁使用: ['Who it is for', '対象ユーザー', '대상 사용자'],
  '适合需要多模型调用、团队额度管理、代理分销和客户 API 交付的开发者与团队。': [
    'For developers and teams that need multi-model access, team quotas, partner distribution, and customer API delivery.',
    '複数モデル、チーム上限、パートナー展開、顧客向けAPI提供を必要とする開発者とチームに適しています。',
    '멀티모델 연동, 팀 한도, 파트너 유통, 고객 API 제공이 필요한 개발자와 팀에 적합합니다.',
  ],
  'NavtoAI 国际团队与交付现场': [
    'NavtoAI international operations',
    'NavtoAIの国際チーム',
    'NavtoAI 글로벌 운영',
  ],
  '国际 AI 网关工程团队在开放式办公室工作': [
    'International AI gateway engineers working in an open office',
    '国際的なAIゲートウェイ開発チーム',
    '오픈 오피스에서 일하는 글로벌 AI 게이트웨이 엔지니어',
  ],
  全球工程团队: [
    'Global engineering',
    'グローバル開発チーム',
    '글로벌 엔지니어링',
  ],
  '跨时区维护 AI 网关与模型渠道': [
    'Operating AI gateways and model providers across time zones',
    'タイムゾーンを越えてAIゲートウェイを運用',
    '여러 시간대에서 AI 게이트웨이와 모델 공급자 운영',
  ],
  海外科技公司前台接待企业客户: [
    'International technology office welcoming an enterprise customer',
    '海外テクノロジー企業の受付',
    '해외 기술 기업의 고객 리셉션',
  ],
  客户接待: ['Customer reception', 'カスタマー受付', '고객 리셉션'],
  为海外企业客户提供专业接入服务: [
    'Professional onboarding for international enterprise customers',
    '海外企業向けの専門的な導入支援',
    '해외 기업 고객을 위한 전문 온보딩',
  ],
  '多元化国际团队讨论 API 架构和模型路由': [
    'A diverse international team reviewing API architecture and model routing',
    '多国籍チームによるAPI設計会議',
    '다양한 글로벌 팀의 API 아키텍처 회의',
  ],
  方案会议: ['Solution design', 'ソリューション会議', '솔루션 설계'],
  '围绕 API 架构、路由策略和企业交付协作': [
    'Collaborating on API architecture, routing, and enterprise delivery',
    'API設計、ルーティング、企業導入を共同検討',
    'API 아키텍처, 라우팅, 기업 제공을 위한 협업',
  ],
  '海外客户成功团队处理 API 用量和账单请求': [
    'International customer success specialists handling API usage and billing',
    '海外カスタマーサクセスチーム',
    '해외 고객 성공 팀의 API 사용량 및 결제 지원',
  ],
  客户成功: ['Customer success', 'カスタマーサクセス', '고객 성공'],
  '持续跟进工单、配额、API Key 和异常请求': [
    'Ongoing support for tickets, quotas, API keys, and failed requests',
    'チケット、上限、APIキー、エラーを継続サポート',
    '티켓, 한도, API 키, 오류 요청을 지속 지원',
  ],
  '从 API 接入到本地开发工作流': [
    'From API integration to local development',
    'API導入からローカル開発まで',
    'API 연동부터 로컬 개발까지',
  ],
  '统一入口负责模型分发、密钥额度、价格透明、日志排障，也提供 Playground 和提示词库帮助用户直接验证效果。':
    [
      'One endpoint handles routing, key quotas, transparent pricing, and logs, while Playground and prompt examples help teams validate results quickly.',
      'ひとつのエンドポイントでルーティング、キー上限、料金、ログを管理し、Playgroundとプロンプト例ですぐに検証できます。',
      '하나의 엔드포인트에서 라우팅, 키 한도, 투명한 가격, 로그를 관리하고 Playground와 프롬프트 예제로 빠르게 검증할 수 있습니다.',
    ],
  多模型统一接入: [
    'Unified model access',
    'モデルアクセスを統合',
    '통합 모델 연동',
  ],
  '通过一个网关统一管理可用模型，后续可按业务需要扩展更多模型渠道。': [
    'Manage available models through one gateway and add providers as your business grows.',
    '利用可能なモデルをひとつのゲートウェイで管理し、事業に合わせてプロバイダーを追加できます。',
    '하나의 게이트웨이로 모델을 관리하고 비즈니스 성장에 따라 공급자를 확장하세요.',
  ],
  计费与配额: ['Billing and quotas', '課金と上限', '과금 및 한도'],
  '支持套餐、用量扣费、剩余额度和团队分配策略，方便统一成本管理。': [
    'Manage plans, usage billing, balances, and team allocation in one place.',
    'プラン、従量課金、残高、チーム配分を一元管理します。',
    '요금제, 사용량 과금, 잔액, 팀 배분을 한곳에서 관리합니다.',
  ],
  'Token 多渠道管理': ['API key controls', 'APIキー管理', 'API 키 관리'],
  '按用户、项目、场景拆分 Key，独立控制模型权限、过期时间与额度。': [
    'Separate keys by user, project, or workload, with independent model access, expiration, and quotas.',
    'ユーザー、プロジェクト、用途ごとにキーを分け、モデル権限、有効期限、上限を個別管理します。',
    '사용자, 프로젝트, 워크로드별로 키를 나누고 모델 권한, 만료, 한도를 독립적으로 관리합니다.',
  ],
  日志与监控: ['Logs and monitoring', 'ログと監視', '로그 및 모니터링'],
  '聚合请求日志、调用成功率、消耗趋势和异常事件，便于排障与审计。': [
    'Review request logs, success rates, usage trends, and errors for troubleshooting and audits.',
    'リクエストログ、成功率、利用傾向、エラーを確認し、障害対応と監査に活用できます。',
    '요청 로그, 성공률, 사용 추세, 오류를 확인해 문제 해결과 감사에 활용합니다.',
  ],
  异步任务追踪: ['Async task tracking', '非同期タスク追跡', '비동기 작업 추적'],
  '图片、视频等长耗时任务可在后台执行，并通过任务日志查看状态与结果。': [
    'Run long image and video jobs in the background and follow their status and results in task logs.',
    '画像や動画などの長時間処理をバックグラウンドで実行し、タスクログで状態と結果を確認できます。',
    '이미지와 비디오 작업을 백그라운드에서 실행하고 작업 로그에서 상태와 결과를 확인합니다.',
  ],
  '提示词与 Playground': [
    'Prompts and Playground',
    'プロンプトとPlayground',
    '프롬프트 및 Playground',
  ],
  '从真实案例挑选提示词，一键带入 Playground，缩短从参考到生成的路径。': [
    'Choose prompts from real examples and open them directly in Playground.',
    '実例からプロンプトを選び、Playgroundですぐに試せます。',
    '실제 사례에서 프롬프트를 선택해 Playground에서 바로 실행하세요.',
  ],
  从提示词案例开始生成图片: [
    'Start with proven image prompts',
    '実例プロンプトから画像を生成',
    '검증된 프롬프트로 이미지 생성',
  ],
  '提示词库收录社区案例，支持按分类搜索、复制 prompt，并可直接带入 Playground 试图。':
    [
      'Browse community examples by category, copy prompts, and test them directly in Playground.',
      'コミュニティの実例をカテゴリ検索し、プロンプトをコピーしてPlaygroundですぐに試せます。',
      '커뮤니티 사례를 카테고리별로 찾고 프롬프트를 복사해 Playground에서 바로 테스트하세요.',
    ],
  浏览提示词库: ['Browse prompts', 'プロンプトを見る', '프롬프트 둘러보기'],
  打开生图试验场: [
    'Open image Playground',
    '画像Playgroundを開く',
    '이미지 Playground 열기',
  ],
  人像与摄影: [
    'Portraits and photography',
    'ポートレート・写真',
    '인물 및 사진',
  ],
  '查找光线、镜头、构图和人物风格描述。': [
    'Explore lighting, lens, composition, and portrait styles.',
    '光、レンズ、構図、人物スタイルの表現を探せます。',
    '조명, 렌즈, 구도, 인물 스타일 표현을 찾아보세요.',
  ],
  海报与插画: [
    'Posters and illustration',
    'ポスター・イラスト',
    '포스터 및 일러스트',
  ],
  '快速参考版式、色彩、材质和视觉主题。': [
    'Reference layout, color, material, and visual themes.',
    'レイアウト、色、素材、ビジュアルテーマを参考にできます。',
    '레이아웃, 색상, 재질, 비주얼 테마를 참고하세요.',
  ],
  'UI 与社媒 Mockup': [
    'UI and social mockups',
    'UI・SNSモックアップ',
    'UI 및 소셜 목업',
  ],
  '用于产品截图、社交封面和界面概念图。': [
    'Create product shots, social covers, and interface concepts.',
    '製品画像、SNSカバー、UIコンセプトに活用できます。',
    '제품 이미지, 소셜 커버, 인터페이스 콘셉트를 만드세요.',
  ],
  合作伙伴权益与成长支持: [
    'Partner enablement built for growth',
    '成長を支えるパートナープログラム',
    '성장을 위한 파트너 프로그램',
  ],
  合作伙伴权益: ['Partner benefits', 'パートナー特典', '파트너 혜택'],
  代理权益: ['Partner benefits', 'パートナー特典', '파트너 혜택'],
  权益概览: ['Benefits overview', '特典の概要', '혜택 개요'],
  'NavtoAI 为合作伙伴提供产品介绍、技术培训、推广素材和客户接入支持，帮助团队在本地市场长期服务客户。':
    [
      'NavtoAI gives partners product materials, technical training, campaign assets, and onboarding support to serve customers in local markets.',
      'NavtoAIはパートナーに製品資料、技術研修、販促素材、導入支援を提供し、各地域での長期的な顧客対応を支えます。',
      'NavtoAI는 파트너에게 제품 자료, 기술 교육, 마케팅 자산, 온보딩 지원을 제공해 현지 시장의 고객을 장기적으로 지원합니다.',
    ],
  了解合作伙伴计划: [
    'Explore the partner program',
    'パートナープログラムを見る',
    '파트너 프로그램 보기',
  ],
  统一项目资料: ['Product resources', '製品資料', '제품 자료'],
  '提供产品介绍、常见问题、客户沟通口径和直播课资料，帮助代理讲清楚项目价值。':
    [
      'Use product overviews, FAQs, sales guidance, and training materials to communicate value clearly.',
      '製品概要、FAQ、営業ガイド、研修資料で価値を明確に伝えられます。',
      '제품 소개, FAQ, 영업 가이드, 교육 자료로 가치를 명확하게 전달하세요.',
    ],
  推广素材支持: ['Campaign assets', '販促素材', '마케팅 자산'],
  '围绕朋友圈、社群、私聊和短视频分发，提供可直接执行的素材和话术参考。': [
    'Get ready-to-use assets and messaging for social, community, direct, and video campaigns.',
    'SNS、コミュニティ、ダイレクト、動画施策向けの素材とメッセージを提供します。',
    '소셜, 커뮤니티, 다이렉트, 영상 캠페인에 바로 쓸 수 있는 자료와 메시지를 제공합니다.',
  ],
  客户承接协助: ['Customer onboarding', '顧客導入支援', '고객 온보딩'],
  '代理引流来的客户，可通过官网、资料、直播课和团队支持完成进一步了解与转化。':
    [
      'Help referred customers evaluate and onboard through the website, resources, online training, and team support.',
      '紹介顧客の検討と導入を、Webサイト、資料、オンライン研修、チームサポートで支援します。',
      '소개 고객이 웹사이트, 자료, 온라인 교육, 팀 지원을 통해 검토하고 도입하도록 돕습니다.',
    ],
  合作伙伴支持方案: [
    'Partner success package',
    'パートナー支援パッケージ',
    '파트너 성공 패키지',
  ],
  产品培训: ['Product training', '製品研修', '제품 교육'],
  在线技术课程: [
    'Online technical sessions',
    'オンライン技術講座',
    '온라인 기술 세션',
  ],
  市场素材: ['Market assets', 'マーケティング素材', '마케팅 자료'],
  持续更新: ['Continuous updates', '継続更新', '지속 업데이트'],
  客户支持: ['Customer support', 'カスタマーサポート', '고객 지원'],
  团队协助: ['Team assistance', 'チーム支援', '팀 지원'],
  资料: ['Resources', '資料', '자료'],
  产品介绍与销售资料: [
    'Product and sales materials',
    '製品・営業資料',
    '제품 및 영업 자료',
  ],
  启用: ['Launch', '開始', '출시'],
  '7 天上线计划': ['7-day launch plan', '7日間導入プラン', '7일 출시 계획'],
  支持: ['Support', 'サポート', '지원'],
  社区与团队协助: [
    'Community and team support',
    'コミュニティ・チーム支援',
    '커뮤니티 및 팀 지원',
  ],
  以控制台显示的实时价格为准: [
    'Live pricing in your console',
    '最新料金はコンソールで確認',
    '콘솔에서 실시간 가격 확인',
  ],
  '模型和区域会分批开放。注册后可在控制台查看当前可用模型、实时价格和团队方案。':
    [
      'Models and regions roll out in stages. Sign up to see available models, live pricing, and team plans.',
      'モデルと地域は段階的に追加されます。登録後、利用可能なモデル、最新料金、チームプランを確認できます。',
      '모델과 지역은 단계적으로 제공됩니다. 가입 후 사용 가능한 모델, 실시간 가격, 팀 요금제를 확인하세요.',
    ],
  查看价格说明: ['Pricing details', '料金詳細', '가격 안내'],
  计费说明: ['Billing', '課金', '과금'],
  透明定价: ['Transparent pricing', '透明な料金', '투명한 가격'],
  对象: ['Plan', 'プラン', '요금제'],
  方式: ['Price', '料金', '가격'],
  说明: ['Details', '詳細', '설명'],
  普通客户: ['Developer', '開発者', '개발자'],
  按需充值: ['Pay as you go', '従量課金', '사용량 기반'],
  '注册后在控制台查看已开通模型和余额消耗。': [
    'View enabled models and usage after signing up.',
    '登録後にモデルと利用状況を確認できます。',
    '가입 후 활성 모델과 사용량을 확인하세요.',
  ],
  联盟计划: ['Affiliate program', 'アフィリエイトプログラム', '제휴 프로그램'],
  免费加入: ['Free to join', '無料で参加', '무료 참여'],
  '分享专属推荐链接，按有效推荐获得推广奖励。': [
    'Share your referral link and earn rewards for qualified referrals.',
    '専用紹介リンクを共有し、条件を満たす紹介で報酬を獲得できます。',
    '전용 추천 링크를 공유하고 유효한 추천에 대해 리워드를 받으세요.',
  ],
  团队客户: ['Team', 'チーム', '팀'],
  客服确认: ['Contact sales', 'お問い合わせ', '영업 문의'],
  '按实际渠道、额度、模型和支持需求确认。': [
    'Tailored to providers, quotas, models, and support needs.',
    'プロバイダー、上限、モデル、支援内容に合わせます。',
    '공급자, 한도, 모델, 지원 요구에 맞춤 제공됩니다.',
  ],
  '立即开始使用 NavtoAI': [
    'Start building with NavtoAI',
    'NavtoAIを始める',
    'NavtoAI 시작하기',
  ],
  下一步: ['Next step', '次のステップ', '다음 단계'],
  '为 AI 应用、团队和渠道提供统一网关、额度管理与日志服务。': [
    'Unified gateway, quota management, and logging for AI applications, teams, and channels.',
    'AIアプリ、チーム、チャネル向けに、統合ゲートウェイ、上限管理、ログ機能を提供します。',
    'AI 애플리케이션, 팀, 채널을 위한 통합 게이트웨이, 한도 관리, 로그 기능을 제공합니다.',
  ],
  '接入模型、管理 API Key、追踪用量，并通过一个控制台服务全球团队。': [
    'Connect models, manage API keys, track usage, and support global teams from one console.',
    'モデル接続、APIキー管理、利用状況をひとつのコンソールで行い、グローバルチームを支えます。',
    '모델 연동, API 키 관리, 사용량 추적, 글로벌 팀 지원을 하나의 콘솔에서 처리하세요.',
  ],
  打开控制台: ['Open console', 'コンソールを開く', '콘솔 열기'],
  '注册 NavtoAI': ['Sign up for NavtoAI', 'NavtoAIに登録', 'NavtoAI 가입'],
  管理令牌: ['Manage API keys', 'APIキーを管理', 'API 키 관리'],
  登录控制台: ['Sign in to console', 'コンソールにログイン', '콘솔 로그인'],
  模型状态: ['Models', 'モデル', '모델'],
  隐私: ['Privacy', 'プライバシー', '개인정보'],
  条款: ['Terms', '利用規約', '이용약관'],
  退款: ['Refunds', '返金', '환불'],
};

const languages = ['en', 'ja', 'ko'];

export const homeTranslations = Object.fromEntries(
  languages.map((language, index) => [
    language,
    Object.fromEntries(
      Object.entries(rows).map(([key, values]) => [key, values[index]]),
    ),
  ]),
);
