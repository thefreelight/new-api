/**
 * Home page constants
 * All hardcoded data for home page sections
 */
import { type TFunction } from 'i18next'

// Layout - Main base classes
export const MAIN_BASE_CLASSES = 'relative w-full overflow-x-hidden bg-background text-foreground'

// Hero section - AI Applications (Left side)
export const AI_APPLICATIONS = [
  'OpenAI SDK',
  'Dify',
  'Open WebUI',
  'Cline',
] as const

// Hero section - AI Models (Right side)
export const AI_MODELS = [
  'GPT-4.1',
  'Claude 3.7',
  'Gemini 2.5',
  'OpenAI',
  'Bedrock',
  'DeepSeek',
] as const

// Hero section - Gateway Features
export const GATEWAY_FEATURES = [
  'Budget Controls',
  'Latency Routing',
  'Fallback Chains',
  'Usage Metering',
  'Guardrails',
  'Load Balancing',
  'Rate Limiting',
  'Token Accounting',
  'Prompt Caching',
  'OpenAI Compatibility',
] as const

export const HERO_SIGNAL_ITEMS = [
  {
    label: 'OpenAI-compatible edge',
    detail:
      'Keep SDKs, agents, and no-code tools on a familiar contract while you widen supplier choice.',
  },
  {
    label: 'Supplier market coverage',
    detail:
      'Put frontier, regional, and value models on the same shelf without rewriting app logic.',
  },
  {
    label: 'Policy before spend',
    detail:
      'Budgets, failover, and rate decisions happen before traffic leaves your edge.',
  },
] as const

export const MARKET_SEGMENTS = [
  'Chat',
  'Reasoning',
  'Vision',
  'Embeddings',
  'Audio',
  'Batch',
] as const

export const PROVIDER_FAMILIES = [
  'OpenAI',
  'Claude',
  'Gemini',
  'Azure OpenAI',
  'Bedrock',
  'DeepSeek',
  'Ollama',
  'Vertex',
] as const

// Stats section - Default statistics
export const DEFAULT_STATS = [
  {
    value: 50,
    suffix: '+',
    description: 'upstream suppliers',
    detail:
      'OpenAI, Claude, Gemini, Azure, Bedrock, and regional gateways behind one edge.',
  },
  {
    value: 100,
    suffix: '+',
    description: 'billable models',
    detail:
      'Per-model pricing, quota conversion, and normalized cost tracking for mixed suppliers.',
  },
  {
    value: 50,
    suffix: '+',
    description: 'compatible API routes',
    detail:
      'Chat, responses, embeddings, images, audio, and other familiar request surfaces.',
  },
  {
    value: 10,
    suffix: '+',
    description: 'traffic controls',
    detail:
      'Weights, fallback, caching, guardrails, rate limits, and budget-aware dispatch rules.',
  },
] as const

// Features section - Default features
export const DEFAULT_FEATURES = [
  {
    title: 'Supplier Coverage',
    description:
      'Bring frontier, regional, and private model inventory behind one dependable control plane.',
    iconName: 'Network',
  },
  {
    title: 'Policy Routing',
    description:
      'Route by tenant, latency, price, capability, or reliability instead of hard-coding vendors.',
    iconName: 'Shield',
  },
  {
    title: 'Cost Visibility',
    description:
      'Track usage, quotas, and effective request cost across all suppliers in one ledger.',
    iconName: 'DollarSign',
  },
  {
    title: 'Operator Telemetry',
    description:
      'Watch route health, latency, and failure patterns before they become app incidents.',
    iconName: 'Activity',
  },
] as const

export const FEATURE_PANELS = [
  {
    id: 'coverage',
    eyebrow: 'Coverage',
    title: 'Put the model market on one shelf',
    description:
      'Expose upstream breadth through a single contract so apps can shop for capability without learning every supplier surface.',
    bullets: [
      '40+ upstream integrations in one catalog',
      'Frontier, regional, and self-hosted lanes side by side',
      'Keep apps steady while supply changes underneath',
    ],
    accent: 'cyan',
  },
  {
    id: 'policy',
    eyebrow: 'Policy',
    title: 'Dispatch by price, latency, and guardrail fit',
    description:
      'Treat routing as an operator decision layer with weights, fallback chains, quotas, and tenant-specific budgets.',
    bullets: [
      'Weighted balancing and failover trees',
      'Per-user, per-channel, and per-model constraints',
      'Controls applied before traffic burns external spend',
    ],
    accent: 'amber',
  },
  {
    id: 'telemetry',
    eyebrow: 'Telemetry',
    title: 'See the real cost of every route decision',
    description:
      'Usage logs, spend attribution, and route health stay visible in one surface instead of scattered across vendors.',
    bullets: [
      'Normalized billing and token accounting',
      'Live request logs with latency and failure context',
      'Usage visibility for finance, platform, and support teams',
    ],
    accent: 'slate',
  },
  {
    id: 'teams',
    eyebrow: 'Operations',
    title: 'Run multi-tenant AI traffic without custom glue',
    description:
      'Separate teams, keys, quotas, and notifications while keeping one gateway as the shared control plane.',
    bullets: [
      'Project-level access and governance',
      'Shared infrastructure with segmented budgets',
      'Self-hosted friendly for internal or customer-facing workloads',
    ],
    accent: 'cyan',
  },
] as const

export const WORKFLOW_STEPS = [
  {
    number: '01',
    title: 'Connect supply',
    description:
      'Register provider keys, regional endpoints, and private model lanes in one inventory.',
    outcome: 'One catalog for OpenAI, Claude, Gemini, Azure, Bedrock, and beyond.',
  },
  {
    number: '02',
    title: 'Publish rules',
    description:
      'Set budgets, fallback chains, weights, caching, and access boundaries around each route.',
    outcome: 'Policy lives in the gateway instead of getting duplicated across apps.',
  },
  {
    number: '03',
    title: 'Dispatch and observe',
    description:
      'Requests land on the best lane while logs, cost, and uptime signals stay visible in real time.',
    outcome: 'Operations gets one feedback loop for spend, reliability, and performance.',
  },
] as const

export const CTA_POINTS = [
  'One endpoint for apps and internal tools',
  'Supplier coverage without route rewrites',
  'Budgets, logs, and governance built into the edge',
] as const

export function getGatewayFeatures(t: TFunction) {
  return GATEWAY_FEATURES.map((feature) => t(feature))
}

export function getHeroSignalItems(t: TFunction) {
  return HERO_SIGNAL_ITEMS.map((item) => ({
    label: t(item.label),
    detail: t(item.detail),
  }))
}

export function getMarketSegments(t: TFunction) {
  return MARKET_SEGMENTS.map((segment) => t(segment))
}

export function getProviderFamilies() {
  return [...PROVIDER_FAMILIES]
}

export function getDefaultStats(t: TFunction) {
  return DEFAULT_STATS.map((stat) => ({
    ...stat,
    description: stat.description ? t(stat.description) : undefined,
    detail: stat.detail ? t(stat.detail) : undefined,
  }))
}

export function getDefaultFeatures(t: TFunction) {
  return DEFAULT_FEATURES.map((feature) => ({
    ...feature,
    title: t(feature.title),
    description: t(feature.description),
  }))
}

export function getFeaturePanels(t: TFunction) {
  return FEATURE_PANELS.map((panel) => ({
    ...panel,
    eyebrow: t(panel.eyebrow),
    title: t(panel.title),
    description: t(panel.description),
    bullets: panel.bullets.map((bullet) => t(bullet)),
  }))
}

export function getWorkflowSteps(t: TFunction) {
  return WORKFLOW_STEPS.map((step) => ({
    ...step,
    title: t(step.title),
    description: t(step.description),
    outcome: t(step.outcome),
  }))
}

export function getCTAPoints(t: TFunction) {
  return CTA_POINTS.map((point) => t(point))
}
