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

import React, { useMemo, useState } from 'react';
import {
  Button,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from '@douyinfe/semi-ui';
import { API, showError, showSuccess, renderQuota } from '../../helpers';
import { getCurrencyConfig } from '../../helpers/render';
import { RefreshCw, Sparkles } from 'lucide-react';
import SubscriptionPurchaseModal from './modals/SubscriptionPurchaseModal';
import {
  formatSubscriptionDuration,
  formatSubscriptionResetPeriod,
} from '../../helpers/subscriptionFormat';

const { Text } = Typography;

function getEpayMethods(payMethods = []) {
  return (payMethods || []).filter(
    (m) => m?.type && m.type !== 'stripe' && m.type !== 'creem',
  );
}

function submitEpayForm({ url, params }) {
  const form = document.createElement('form');
  form.action = url;
  form.method = 'POST';
  const isSafari =
    navigator.userAgent.indexOf('Safari') > -1 &&
    navigator.userAgent.indexOf('Chrome') < 1;
  if (!isSafari) form.target = '_blank';
  Object.keys(params || {}).forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = params[key];
    form.appendChild(input);
  });
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

const SubscriptionPlansCard = ({
  t,
  loading = false,
  plans = [],
  payMethods = [],
  enableOnlineTopUp = false,
  enableStripeTopUp = false,
  enableCreemTopUp = false,
  billingPreference,
  onChangeBillingPreference,
  activeSubscriptions = [],
  allSubscriptions = [],
  reloadSubscriptionSelf,
  withCard = true,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paying, setPaying] = useState(false);
  const [selectedEpayMethod, setSelectedEpayMethod] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const epayMethods = useMemo(() => getEpayMethods(payMethods), [payMethods]);

  const openBuy = (p) => {
    setSelectedPlan(p);
    setSelectedEpayMethod(epayMethods?.[0]?.type || '');
    setOpen(true);
  };

  const closeBuy = () => {
    setOpen(false);
    setSelectedPlan(null);
    setPaying(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reloadSubscriptionSelf?.();
    } finally {
      setRefreshing(false);
    }
  };

  const payStripe = async () => {
    if (!selectedPlan?.plan?.stripe_price_id) {
      showError(t('该套餐未配置 Stripe'));
      return;
    }
    setPaying(true);
    try {
      const res = await API.post('/api/subscription/stripe/pay', {
        plan_id: selectedPlan.plan.id,
      });
      if (res.data?.message === 'success') {
        window.open(res.data.data?.pay_link, '_blank');
        showSuccess(t('已打开支付页面'));
        closeBuy();
      } else {
        const errorMsg =
          typeof res.data?.data === 'string'
            ? res.data.data
            : res.data?.message || t('支付失败');
        showError(errorMsg);
      }
    } catch (e) {
      showError(t('支付请求失败'));
    } finally {
      setPaying(false);
    }
  };

  const payCreem = async () => {
    if (!selectedPlan?.plan?.creem_product_id) {
      showError(t('该套餐未配置 Creem'));
      return;
    }
    setPaying(true);
    try {
      const res = await API.post('/api/subscription/creem/pay', {
        plan_id: selectedPlan.plan.id,
      });
      if (res.data?.message === 'success') {
        window.open(res.data.data?.checkout_url, '_blank');
        showSuccess(t('已打开支付页面'));
        closeBuy();
      } else {
        const errorMsg =
          typeof res.data?.data === 'string'
            ? res.data.data
            : res.data?.message || t('支付失败');
        showError(errorMsg);
      }
    } catch (e) {
      showError(t('支付请求失败'));
    } finally {
      setPaying(false);
    }
  };

  const payEpay = async () => {
    if (!selectedEpayMethod) {
      showError(t('请选择支付方式'));
      return;
    }
    setPaying(true);
    try {
      const res = await API.post('/api/subscription/epay/pay', {
        plan_id: selectedPlan.plan.id,
        payment_method: selectedEpayMethod,
      });
      if (res.data?.message === 'success') {
        submitEpayForm({ url: res.data.url, params: res.data.data });
        showSuccess(t('已发起支付'));
        closeBuy();
      } else {
        const errorMsg =
          typeof res.data?.data === 'string'
            ? res.data.data
            : res.data?.message || t('支付失败');
        showError(errorMsg);
      }
    } catch (e) {
      showError(t('支付请求失败'));
    } finally {
      setPaying(false);
    }
  };

  const hasActiveSubscription = activeSubscriptions.length > 0;
  const hasAnySubscription = allSubscriptions.length > 0;
  const disableSubscriptionPreference = !hasActiveSubscription;
  const isSubscriptionPreference =
    billingPreference === 'subscription_first' ||
    billingPreference === 'subscription_only';
  const displayBillingPreference =
    disableSubscriptionPreference && isSubscriptionPreference
      ? 'wallet_first'
      : billingPreference;
  const subscriptionPreferenceLabel =
    billingPreference === 'subscription_only' ? t('仅用订阅') : t('优先订阅');

  const planPurchaseCountMap = useMemo(() => {
    const map = new Map();
    (allSubscriptions || []).forEach((sub) => {
      const planId = sub?.subscription?.plan_id;
      if (!planId) return;
      map.set(planId, (map.get(planId) || 0) + 1);
    });
    return map;
  }, [allSubscriptions]);

  const planTitleMap = useMemo(() => {
    const map = new Map();
    (plans || []).forEach((p) => {
      const plan = p?.plan;
      if (!plan?.id) return;
      map.set(plan.id, plan.title || '');
    });
    return map;
  }, [plans]);

  const getPlanPurchaseCount = (planId) =>
    planPurchaseCountMap.get(planId) || 0;

  const getRemainingDays = (sub) => {
    if (!sub?.subscription?.end_time) return 0;
    const now = Date.now() / 1000;
    const remaining = sub.subscription.end_time - now;
    return Math.max(0, Math.ceil(remaining / 86400));
  };

  const getUsagePercent = (sub) => {
    const total = Number(sub?.subscription?.amount_total || 0);
    const used = Number(sub?.subscription?.amount_used || 0);
    if (total <= 0) return 0;
    return Math.round((used / total) * 100);
  };

  const cardContent = loading ? (
    <div className='topup-premium-stack'>
      <div className='topup-premium-section'>
        <Skeleton.Title active style={{ width: 120, height: 20 }} />
        <div className='mt-4 space-y-3'>
          <Skeleton.Paragraph active rows={2} />
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-3'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='topup-subscription-plan topup-subscription-plan--loading'
          >
            <Skeleton.Title
              active
              style={{ width: '56%', height: 24, marginBottom: 10 }}
            />
            <Skeleton.Paragraph active rows={2} />
            <div className='mt-5'>
              <Skeleton.Title active style={{ width: '44%', height: 34 }} />
            </div>
            <div className='mt-5'>
              <Skeleton.Paragraph active rows={3} />
            </div>
            <Skeleton.Button
              active
              block
              style={{ marginTop: 18, height: 42 }}
            />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='topup-premium-stack'>
      <section className='topup-premium-section topup-subscription-summary'>
        <div className='topup-premium-section-head topup-premium-section-head--tight'>
          <div>
            <div className='topup-premium-section-title'>{t('我的订阅')}</div>
            <div className='topup-premium-section-copy'>
              {hasActiveSubscription
                ? `${activeSubscriptions.length} ${t('个生效中')}`
                : t('无生效')}
            </div>
          </div>

          <div className='topup-subscription-toolbar'>
            <Select
              value={displayBillingPreference}
              onChange={onChangeBillingPreference}
              size='small'
              optionList={[
                {
                  value: 'subscription_first',
                  label: disableSubscriptionPreference
                    ? `${t('优先订阅')} (${t('无生效')})`
                    : t('优先订阅'),
                  disabled: disableSubscriptionPreference,
                },
                { value: 'wallet_first', label: t('优先钱包') },
                {
                  value: 'subscription_only',
                  label: disableSubscriptionPreference
                    ? `${t('仅用订阅')} (${t('无生效')})`
                    : t('仅用订阅'),
                  disabled: disableSubscriptionPreference,
                },
                { value: 'wallet_only', label: t('仅用钱包') },
              ]}
              className='topup-premium-select'
            />
            <Button
              size='small'
              theme='light'
              type='tertiary'
              icon={
                <RefreshCw
                  size={13}
                  className={refreshing ? 'animate-spin' : ''}
                />
              }
              onClick={handleRefresh}
              loading={refreshing}
              className='topup-premium-icon-button'
            />
          </div>
        </div>

        <div className='topup-subscription-chip-row'>
          <span className='topup-premium-chip topup-premium-chip--live'>
            {hasActiveSubscription ? t('生效') : t('待机')}
          </span>
          {allSubscriptions.length > activeSubscriptions.length && (
            <span className='topup-premium-chip topup-premium-chip--muted'>
              {allSubscriptions.length - activeSubscriptions.length}{' '}
              {t('个已过期')}
            </span>
          )}
        </div>

        {disableSubscriptionPreference && isSubscriptionPreference && (
          <Text className='topup-premium-inline-note mt-3 block'>
            {t('已保存偏好为')}
            {subscriptionPreferenceLabel}
            {t('，当前无生效订阅，将自动使用钱包')}
          </Text>
        )}

        {hasAnySubscription ? (
          <div className='topup-premium-scroll topup-subscription-records'>
            {allSubscriptions.map((sub, subIndex) => {
              const subscription = sub.subscription;
              const totalAmount = Number(subscription?.amount_total || 0);
              const usedAmount = Number(subscription?.amount_used || 0);
              const remainAmount =
                totalAmount > 0 ? Math.max(0, totalAmount - usedAmount) : 0;
              const planTitle = planTitleMap.get(subscription?.plan_id) || '';
              const remainDays = getRemainingDays(sub);
              const usagePercent = getUsagePercent(sub);
              const now = Date.now() / 1000;
              const isExpired = (subscription?.end_time || 0) < now;
              const isCancelled = subscription?.status === 'cancelled';
              const isActive = subscription?.status === 'active' && !isExpired;
              const statusLabel = isActive
                ? t('生效')
                : isCancelled
                  ? t('已作废')
                  : t('已过期');
              const statusClass = isActive
                ? 'topup-premium-chip--live'
                : isCancelled
                  ? 'topup-premium-chip--warning'
                  : 'topup-premium-chip--muted';

              return (
                <article
                  key={subscription?.id || subIndex}
                  className='topup-subscription-record'
                >
                  <div className='topup-subscription-record-top'>
                    <div>
                      <div className='topup-subscription-record-title'>
                        {planTitle
                          ? `${planTitle} · ${t('订阅')} #${subscription?.id}`
                          : `${t('订阅')} #${subscription?.id}`}
                      </div>
                      <div className='topup-subscription-record-meta'>
                        {isActive
                          ? t('至')
                          : isCancelled
                            ? t('作废于')
                            : t('过期于')}{' '}
                        {new Date(
                          (subscription?.end_time || 0) * 1000,
                        ).toLocaleString()}
                      </div>
                    </div>

                    <div className='topup-subscription-record-side'>
                      <span className={`topup-premium-chip ${statusClass}`}>
                        {statusLabel}
                      </span>
                      {isActive && (
                        <span className='topup-premium-chip topup-premium-chip--outline'>
                          {t('剩余')} {remainDays} {t('天')}
                        </span>
                      )}
                    </div>
                  </div>

                  {isActive && subscription?.next_reset_time > 0 && (
                    <div className='topup-subscription-record-meta'>
                      {t('下一次重置')}:{' '}
                      {new Date(
                        subscription.next_reset_time * 1000,
                      ).toLocaleString()}
                    </div>
                  )}

                  <div className='topup-subscription-usage'>
                    <div className='topup-subscription-usage-top'>
                      <span>{t('总额度')}</span>
                      <span>
                        {totalAmount > 0 ? (
                          <Tooltip
                            content={`${t('原生额度')}：${usedAmount}/${totalAmount} · ${t('剩余')} ${remainAmount}`}
                          >
                            <span>
                              {renderQuota(usedAmount)}/
                              {renderQuota(totalAmount)} · {t('剩余')}{' '}
                              {renderQuota(remainAmount)}
                            </span>
                          </Tooltip>
                        ) : (
                          t('不限')
                        )}
                      </span>
                    </div>

                    {totalAmount > 0 && (
                      <>
                        <div className='topup-premium-progress-bar'>
                          <div
                            className='topup-premium-progress-fill'
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          />
                        </div>
                        <div className='topup-subscription-usage-top topup-subscription-usage-top--muted'>
                          <span>{t('已用')}</span>
                          <span>{usagePercent}%</span>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className='topup-premium-empty'>
            {t('购买套餐后即可享受模型权益')}
          </div>
        )}
      </section>

      {plans.length > 0 ? (
        <div className='topup-subscription-grid'>
          {plans.map((p, index) => {
            const plan = p?.plan;
            const totalAmount = Number(plan?.total_amount || 0);
            const { symbol, rate } = getCurrencyConfig();
            const price = Number(plan?.price_amount || 0);
            const convertedPrice = price * rate;
            const displayPrice = convertedPrice.toFixed(
              Number.isInteger(convertedPrice) ? 0 : 2,
            );
            const isPopular = index === 0 && plans.length > 1;
            const limit = Number(plan?.max_purchase_per_user || 0);
            const count = getPlanPurchaseCount(plan?.id);
            const reached = limit > 0 && count >= limit;
            const tip = reached
              ? t('已达到购买上限') + ` (${count}/${limit})`
              : '';
            const limitLabel = limit > 0 ? `${t('限购')} ${limit}` : null;
            const totalLabel =
              totalAmount > 0
                ? `${t('总额度')}: ${renderQuota(totalAmount)}`
                : `${t('总额度')}: ${t('不限')}`;
            const upgradeLabel = plan?.upgrade_group
              ? `${t('升级分组')}: ${plan.upgrade_group}`
              : null;
            const resetLabel =
              formatSubscriptionResetPeriod(plan, t) === t('不重置')
                ? null
                : `${t('额度重置')}: ${formatSubscriptionResetPeriod(plan, t)}`;
            const planBenefits = [
              {
                label: `${t('有效期')}: ${formatSubscriptionDuration(plan, t)}`,
              },
              resetLabel ? { label: resetLabel } : null,
              totalAmount > 0
                ? {
                    label: totalLabel,
                    tooltip: `${t('原生额度')}：${totalAmount}`,
                  }
                : { label: totalLabel },
              limitLabel ? { label: limitLabel } : null,
              upgradeLabel ? { label: upgradeLabel } : null,
            ].filter(Boolean);

            const buttonEl = (
              <Button
                theme='solid'
                type='primary'
                block
                disabled={reached}
                onClick={() => {
                  if (!reached) openBuy(p);
                }}
                className='topup-premium-primary-button'
              >
                {reached ? t('已达上限') : t('立即订阅')}
              </Button>
            );

            return (
              <article
                key={plan?.id}
                className={`topup-subscription-plan ${
                  isPopular ? 'topup-subscription-plan--featured' : ''
                }`}
              >
                <div className='topup-subscription-plan-top'>
                  <div className='topup-subscription-plan-badges'>
                    {isPopular && (
                      <span className='topup-premium-chip topup-premium-chip--accent'>
                        <Sparkles size={12} />
                        {t('推荐')}
                      </span>
                    )}
                    {count > 0 && (
                      <span className='topup-premium-chip topup-premium-chip--outline'>
                        {t('订阅')} {count}
                      </span>
                    )}
                  </div>
                  {limitLabel && (
                    <span className='topup-premium-chip topup-premium-chip--muted'>
                      {limitLabel}
                    </span>
                  )}
                </div>

                <div className='topup-subscription-plan-copy'>
                  <h3 className='topup-subscription-plan-title'>
                    {plan?.title || t('订阅套餐')}
                  </h3>
                  {plan?.subtitle && (
                    <Text className='topup-subscription-plan-subtitle'>
                      {plan.subtitle}
                    </Text>
                  )}
                </div>

                <div className='topup-subscription-plan-price'>
                  <span className='topup-subscription-plan-currency'>
                    {symbol}
                  </span>
                  <span className='topup-subscription-plan-amount'>
                    {displayPrice}
                  </span>
                </div>

                <div className='topup-subscription-plan-benefits'>
                  {planBenefits.map((item) => {
                    const content = (
                      <div className='topup-premium-benefit-row'>
                        <span className='topup-premium-note-dot' />
                        <span>{item.label}</span>
                      </div>
                    );

                    if (!item.tooltip) {
                      return <div key={item.label}>{content}</div>;
                    }

                    return (
                      <Tooltip key={item.label} content={item.tooltip}>
                        <div>{content}</div>
                      </Tooltip>
                    );
                  })}
                </div>

                <div className='topup-subscription-plan-footer'>
                  {reached ? (
                    <Tooltip content={tip} position='top'>
                      {buttonEl}
                    </Tooltip>
                  ) : (
                    buttonEl
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className='topup-premium-empty'>{t('暂无可购买套餐')}</div>
      )}
    </div>
  );

  return (
    <>
      {withCard ? (
        <section className='topup-premium-surface'>
          <div className='topup-premium-shell'>{cardContent}</div>
        </section>
      ) : (
        cardContent
      )}

      <SubscriptionPurchaseModal
        t={t}
        visible={open}
        onCancel={closeBuy}
        selectedPlan={selectedPlan}
        paying={paying}
        selectedEpayMethod={selectedEpayMethod}
        setSelectedEpayMethod={setSelectedEpayMethod}
        epayMethods={epayMethods}
        enableOnlineTopUp={enableOnlineTopUp}
        enableStripeTopUp={enableStripeTopUp}
        enableCreemTopUp={enableCreemTopUp}
        purchaseLimitInfo={
          selectedPlan?.plan?.id
            ? {
                limit: Number(selectedPlan?.plan?.max_purchase_per_user || 0),
                count: getPlanPurchaseCount(selectedPlan?.plan?.id),
              }
            : null
        }
        onPayStripe={payStripe}
        onPayCreem={payCreem}
        onPayEpay={payEpay}
      />
    </>
  );
};

export default SubscriptionPlansCard;
