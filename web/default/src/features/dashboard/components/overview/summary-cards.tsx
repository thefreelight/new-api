import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, CreditCard } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { getCurrencyLabel, isCurrencyDisplayEnabled } from '@/lib/currency'
import { formatNumber, formatQuota } from '@/lib/format'
import { computeTimeRange } from '@/lib/time'
import { useStatus } from '@/hooks/use-status'
import { Button } from '@/components/ui/button'
import { StaggerContainer, StaggerItem } from '@/components/page-transition'
import { getUserQuotaDates } from '@/features/dashboard/api'
import { useSummaryCardsConfig } from '@/features/dashboard/hooks/use-dashboard-config'
import type { QuotaDataItem } from '@/features/dashboard/types'
import { StatCard } from '../ui/stat-card'

const SUMMARY_SPARKLINE_BUCKETS = 12

type SummarySparklineKey = 'balance' | 'usage' | 'requests'

function getBucketIndex(
  timestamp: number,
  start: number,
  end: number,
  bucketCount: number
): number {
  if (end <= start) return 0
  const ratio = (timestamp - start) / (end - start)
  return Math.min(bucketCount - 1, Math.max(0, Math.floor(ratio * bucketCount)))
}

function buildSummarySparklines(
  data: QuotaDataItem[],
  currentBalance: number,
  start: number,
  end: number
): Record<SummarySparklineKey, number[]> {
  const usage = Array.from({ length: SUMMARY_SPARKLINE_BUCKETS }, () => 0)
  const requests = Array.from({ length: SUMMARY_SPARKLINE_BUCKETS }, () => 0)

  for (const item of data) {
    const timestamp = Number(item.created_at) || start
    const index = getBucketIndex(
      timestamp,
      start,
      end,
      SUMMARY_SPARKLINE_BUCKETS
    )
    usage[index] += Number(item.quota) || 0
    requests[index] += Number(item.count) || 0
  }

  let balance = currentBalance
  const balanceTrend = Array.from(
    { length: SUMMARY_SPARKLINE_BUCKETS },
    () => 0
  )

  for (let index = SUMMARY_SPARKLINE_BUCKETS - 1; index >= 0; index--) {
    balanceTrend[index] = Math.max(0, balance)
    balance += usage[index]
  }

  return {
    balance: balanceTrend,
    usage,
    requests,
  }
}

export function SummaryCards() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.auth.user)
  const { status, loading } = useStatus()

  const summaryTimeRange = useMemo(() => computeTimeRange(1), [])

  const usageTrendQuery = useQuery({
    queryKey: [
      'dashboard',
      'overview',
      'summary-sparklines',
      summaryTimeRange.start_timestamp,
      summaryTimeRange.end_timestamp,
    ],
    queryFn: async () =>
      getUserQuotaDates({
        start_timestamp: summaryTimeRange.start_timestamp,
        end_timestamp: summaryTimeRange.end_timestamp,
        default_time: 'hour',
      }),
    staleTime: 60 * 1000,
  })

  const summaryValues = useMemo(() => {
    const remainQuota = Number(user?.quota ?? 0)
    const usedQuota = Number(user?.used_quota ?? 0)
    const requestCount = Number(user?.request_count ?? 0)

    return {
      remainDisplay: formatQuota(remainQuota),
      usedDisplay: formatQuota(usedQuota),
      requestCountDisplay: formatNumber(requestCount),
    }
  }, [user])

  const currencyEnabledFromStore = isCurrencyDisplayEnabled()
  const statusCurrencyFlag =
    typeof status?.display_in_currency === 'boolean'
      ? Boolean(status.display_in_currency)
      : undefined
  const currencyEnabled =
    statusCurrencyFlag !== undefined
      ? statusCurrencyFlag
      : currencyEnabledFromStore
  const currencyLabel = currencyEnabled ? getCurrencyLabel() : 'Tokens'

  const sparklineData = useMemo(
    () =>
      buildSummarySparklines(
        usageTrendQuery.data?.data ?? [],
        Number(user?.quota ?? 0),
        summaryTimeRange.start_timestamp,
        summaryTimeRange.end_timestamp
      ),
    [
      summaryTimeRange.end_timestamp,
      summaryTimeRange.start_timestamp,
      usageTrendQuery.data?.data,
      user?.quota,
    ]
  )

  const items = useSummaryCardsConfig({
    ...summaryValues,
    currencyEnabled,
    currencyLabel,
  }).map((config, index) => {
    const tones = ['rose', 'teal', 'gray'] as const

    return {
      title: config.title,
      value: config.value,
      desc: config.description,
      icon: config.icon,
      tone: tones[index] ?? 'gray',
      sparkline:
        config.key === 'balance'
          ? sparklineData.balance
          : config.key === 'usage'
            ? sparklineData.usage
            : sparklineData.requests,
    }
  })

  return (
    <div className='overflow-hidden rounded-[1.9rem] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--background)_96%,transparent),color-mix(in_oklch,var(--muted)_38%,transparent)_62%,color-mix(in_oklch,var(--warning)_12%,transparent))] shadow-[0_24px_60px_-40px_color-mix(in_oklch,var(--foreground)_24%,transparent),inset_0_1px_0_color-mix(in_oklch,var(--background)_90%,transparent)]'>
      <div className='grid xl:grid-cols-[minmax(0,1fr)_20rem]'>
        <div className='flex flex-col gap-4 p-4 sm:p-5'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='flex flex-col gap-1.5'>
              <div className='text-muted-foreground text-[11px] font-semibold tracking-[0.22em] uppercase'>
                {t('Traffic summary')}
              </div>
              <h3 className='text-lg font-semibold tracking-tight'>
                {t('Usage at a glance')}
              </h3>
              <p className='text-muted-foreground/78 max-w-2xl text-sm leading-relaxed'>
                {t('Monitor balance, usage, and request volume')}
              </p>
            </div>
          </div>
          <StaggerContainer className='grid gap-3 md:grid-cols-3'>
            {items.map((it) => (
              <StaggerItem
                key={it.title}
                className='rounded-[1.35rem] border border-border/60 bg-background/74 p-4 shadow-[inset_0_1px_0_color-mix(in_oklch,var(--background)_88%,transparent)] backdrop-blur'
              >
                <StatCard
                  title={it.title}
                  value={it.value}
                  description={it.desc}
                  icon={it.icon}
                  tone={it.tone}
                  sparkline={it.sparkline}
                  loading={loading}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <div className='flex flex-col justify-between gap-5 border-t border-border/60 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--warning)_18%,transparent),color-mix(in_oklch,var(--background)_92%,transparent))] p-4 sm:p-5 xl:border-t-0 xl:border-l'>
          <div className='flex flex-col gap-2.5'>
            <div className='text-muted-foreground text-[11px] font-semibold tracking-[0.2em] uppercase'>
              {t('Credit remaining')}
            </div>
            <div className='flex items-center gap-2.5'>
              <span className='font-mono text-3xl font-semibold tracking-tight'>
                {summaryValues.remainDisplay}
              </span>
              <CreditCard
                className='text-muted-foreground size-4'
                aria-hidden='true'
              />
            </div>
            <p className='text-muted-foreground/78 text-sm leading-relaxed'>
              {currencyEnabled
                ? `${t('Displayed in')} ${currencyLabel}`
                : t('Balance is shown in quota units')}
            </p>
          </div>
          <Button
            className='h-10 justify-between rounded-xl shadow-[0_16px_32px_-24px_color-mix(in_oklch,var(--foreground)_30%,transparent)]'
            render={<Link to='/wallet' />}
          >
            <span>{t('Recharge')}</span>
            <ArrowRight data-icon='inline-end' />
          </Button>
        </div>
      </div>
    </div>
  )
}
