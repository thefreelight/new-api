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

import React, { useEffect, useRef, useState } from 'react';
import {
  Typography,
  Button,
  Banner,
  Skeleton,
  Form,
  Space,
  Row,
  Col,
  Spin,
  Tooltip,
  Tag,
} from '@douyinfe/semi-ui';
import { SiAlipay, SiWechat, SiStripe } from 'react-icons/si';
import {
  CreditCard,
  Coins,
  Wallet,
  BarChart2,
  TrendingUp,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { IconGift } from '@douyinfe/semi-icons';
import { useMinimumLoadingTime } from '../../hooks/common/useMinimumLoadingTime';
import { getCurrencyConfig } from '../../helpers/render';
import SubscriptionPlansCard from './SubscriptionPlansCard';

const { Text } = Typography;

const RechargeCard = ({
  t,
  enableOnlineTopUp,
  enableStripeTopUp,
  enableCreemTopUp,
  creemProducts,
  creemPreTopUp,
  presetAmounts,
  selectedPreset,
  selectPresetAmount,
  formatLargeNumber,
  priceRatio,
  topUpCount,
  minTopUp,
  renderQuotaWithAmount,
  getAmount,
  setTopUpCount,
  setSelectedPreset,
  renderAmount,
  amountLoading,
  payMethods,
  preTopUp,
  paymentLoading,
  payWay,
  redemptionCode,
  setRedemptionCode,
  topUp,
  isSubmitting,
  topUpLink,
  openTopUpLink,
  userState,
  renderQuota,
  statusLoading,
  topupInfo,
  onOpenHistory,
  enableWaffoTopUp,
  enableWaffoPancakeTopUp,
  subscriptionLoading = false,
  subscriptionPlans = [],
  billingPreference,
  onChangeBillingPreference,
  activeSubscriptions = [],
  allSubscriptions = [],
  reloadSubscriptionSelf,
}) => {
  const onlineFormApiRef = useRef(null);
  const redeemFormApiRef = useRef(null);
  const initialTabSetRef = useRef(false);
  const showAmountSkeleton = useMinimumLoadingTime(amountLoading);
  const [activeTab, setActiveTab] = useState('topup');
  const shouldShowSubscription =
    !subscriptionLoading && subscriptionPlans.length > 0;
  const regularPayMethods = payMethods || [];
  const onlineTopUpEnabled =
    enableOnlineTopUp ||
    enableStripeTopUp ||
    enableCreemTopUp ||
    enableWaffoTopUp ||
    enableWaffoPancakeTopUp;

  useEffect(() => {
    if (initialTabSetRef.current) return;
    if (subscriptionLoading) return;
    setActiveTab(shouldShowSubscription ? 'subscription' : 'topup');
    initialTabSetRef.current = true;
  }, [shouldShowSubscription, subscriptionLoading]);

  useEffect(() => {
    if (!shouldShowSubscription && activeTab !== 'topup') {
      setActiveTab('topup');
    }
  }, [shouldShowSubscription, activeTab]);

  const accountMetrics = [
    {
      label: t('当前余额'),
      value: renderQuota(userState?.user?.quota),
      icon: Wallet,
    },
    {
      label: t('历史消耗'),
      value: renderQuota(userState?.user?.used_quota),
      icon: TrendingUp,
    },
    {
      label: t('请求次数'),
      value: userState?.user?.request_count || 0,
      icon: BarChart2,
    },
  ];

  const amountNote = (
    <Skeleton
      loading={showAmountSkeleton}
      active
      placeholder={
        <Skeleton.Title
          style={{
            width: 140,
            height: 18,
            borderRadius: 999,
          }}
        />
      }
    >
      <Text className='topup-premium-helper-text'>
        {t('实付金额：')}
        <span className='topup-premium-helper-value'>{renderAmount()}</span>
      </Text>
    </Skeleton>
  );

  const topupContent = (
    <div className='topup-premium-stack'>
      <div className='topup-premium-section'>
        <div className='topup-premium-section-head'>
          <div>
            <div className='topup-premium-section-title'>{t('在线充值')}</div>
            <div className='topup-premium-section-copy'>
              {t('多种充值方式，安全便捷')}
            </div>
          </div>
          <span className='topup-premium-chip'>
            {renderQuotaWithAmount(minTopUp)}
          </span>
        </div>

        {statusLoading ? (
          <div className='topup-premium-loading'>
            <Spin size='large' />
          </div>
        ) : onlineTopUpEnabled ? (
          <Form
            getFormApi={(api) => (onlineFormApiRef.current = api)}
            initValues={{ topUpCount: topUpCount }}
          >
            <div className='space-y-6'>
              {(enableOnlineTopUp ||
                enableStripeTopUp ||
                enableWaffoTopUp ||
                enableWaffoPancakeTopUp) && (
                <Row gutter={16}>
                  <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                    <Form.InputNumber
                      field='topUpCount'
                      label={t('充值数量')}
                      disabled={
                        !enableOnlineTopUp &&
                        !enableStripeTopUp &&
                        !enableWaffoTopUp &&
                        !enableWaffoPancakeTopUp
                      }
                      placeholder={
                        t('充值数量，最低 ') + renderQuotaWithAmount(minTopUp)
                      }
                      value={topUpCount}
                      min={minTopUp}
                      max={999999999}
                      step={1}
                      precision={0}
                      onChange={async (value) => {
                        if (value && value >= 1) {
                          setTopUpCount(value);
                          setSelectedPreset(null);
                          await getAmount(value);
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (!value || value < 1) {
                          setTopUpCount(1);
                          getAmount(1);
                        }
                      }}
                      formatter={(value) => (value ? `${value}` : '')}
                      parser={(value) =>
                        value ? parseInt(value.replace(/[^\d]/g, '')) : 0
                      }
                      extraText={amountNote}
                      style={{ width: '100%' }}
                    />
                  </Col>

                  {regularPayMethods.length > 0 && (
                    <Col xs={24} sm={24} md={24} lg={15} xl={15}>
                      <Form.Slot label={t('选择支付方式')}>
                        <div className='topup-premium-payment-grid'>
                          {regularPayMethods.map((payMethod) => {
                            const minTopupVal =
                              Number(payMethod.min_topup) || 0;
                            const isStripe = payMethod.type === 'stripe';
                            const isWaffo =
                              typeof payMethod.type === 'string' &&
                              payMethod.type.startsWith('waffo:');
                            const isWaffoPancake =
                              payMethod.type === 'waffo_pancake';
                            const disabled =
                              (!enableOnlineTopUp &&
                                !isStripe &&
                                !isWaffo &&
                                !isWaffoPancake) ||
                              (!enableStripeTopUp && isStripe) ||
                              (!enableWaffoTopUp && isWaffo) ||
                              (!enableWaffoPancakeTopUp && isWaffoPancake) ||
                              minTopupVal > Number(topUpCount || 0);

                            const buttonEl = (
                              <Button
                                key={payMethod.type}
                                theme='light'
                                type='tertiary'
                                onClick={() => preTopUp(payMethod.type)}
                                disabled={disabled}
                                loading={
                                  paymentLoading && payWay === payMethod.type
                                }
                                icon={
                                  payMethod.type === 'alipay' ? (
                                    <SiAlipay size={18} color='#5fb4ff' />
                                  ) : payMethod.type === 'wxpay' ? (
                                    <SiWechat size={18} color='#59f0a5' />
                                  ) : payMethod.type === 'stripe' ? (
                                    <SiStripe size={18} color='#91a8ff' />
                                  ) : payMethod.icon ? (
                                    <img
                                      src={payMethod.icon}
                                      alt={payMethod.name}
                                      style={{
                                        width: 18,
                                        height: 18,
                                        objectFit: 'contain',
                                      }}
                                    />
                                  ) : (
                                    <CreditCard size={18} color='#d6eeff' />
                                  )
                                }
                                className='topup-premium-pay-button !h-11 !justify-start !px-4'
                              >
                                {payMethod.name}
                              </Button>
                            );

                            return disabled &&
                              minTopupVal > Number(topUpCount || 0) ? (
                              <Tooltip
                                content={
                                  t('此支付方式最低充值金额为') +
                                  ' ' +
                                  minTopupVal
                                }
                                key={payMethod.type}
                              >
                                {buttonEl}
                              </Tooltip>
                            ) : (
                              <React.Fragment key={payMethod.type}>
                                {buttonEl}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </Form.Slot>
                    </Col>
                  )}
                </Row>
              )}

              {(enableOnlineTopUp || enableStripeTopUp || enableWaffoTopUp) && (
                <Form.Slot
                  label={
                    <div className='topup-premium-slot-label'>
                      <span>{t('选择充值额度')}</span>
                      {(() => {
                        const { symbol, rate, type } = getCurrencyConfig();
                        if (type === 'USD') return null;

                        return (
                          <span className='topup-premium-slot-meta'>
                            (1 $ = {rate.toFixed(2)} {symbol})
                          </span>
                        );
                      })()}
                    </div>
                  }
                >
                  <div className='topup-premium-choice-grid'>
                    {presetAmounts.map((preset, index) => {
                      const discount =
                        preset.discount ||
                        topupInfo?.discount?.[preset.value] ||
                        1.0;
                      const originalPrice = preset.value * priceRatio;
                      const discountedPrice = originalPrice * discount;
                      const hasDiscount = discount < 1.0;
                      const actualPay = discountedPrice;
                      const save = originalPrice - discountedPrice;

                      const { symbol, rate, type } = getCurrencyConfig();
                      const statusStr = localStorage.getItem('status');
                      let usdRate = 7;
                      try {
                        if (statusStr) {
                          const s = JSON.parse(statusStr);
                          usdRate = s?.usd_exchange_rate || 7;
                        }
                      } catch (e) {}

                      let displayValue = preset.value;
                      let displayActualPay = actualPay;
                      let displaySave = save;

                      if (type === 'USD') {
                        displayActualPay = actualPay / usdRate;
                        displaySave = save / usdRate;
                      } else if (type === 'CNY') {
                        displayValue = preset.value * usdRate;
                      } else if (type === 'CUSTOM') {
                        displayValue = preset.value * rate;
                        displayActualPay = (actualPay / usdRate) * rate;
                        displaySave = (save / usdRate) * rate;
                      }

                      return (
                        <button
                          key={index}
                          type='button'
                          className={`topup-premium-choice ${
                            selectedPreset === preset.value
                              ? 'topup-premium-choice--active'
                              : ''
                          }`}
                          onClick={() => {
                            selectPresetAmount(preset);
                            onlineFormApiRef.current?.setValue(
                              'topUpCount',
                              preset.value,
                            );
                          }}
                          aria-pressed={selectedPreset === preset.value}
                        >
                          <div className='topup-premium-choice-top'>
                            <div className='topup-premium-choice-value'>
                              <Coins size={16} />
                              {formatLargeNumber(displayValue)} {symbol}
                            </div>
                            {hasDiscount && (
                              <Tag
                                size='small'
                                className='topup-premium-inline-tag'
                              >
                                {t('折').includes('off')
                                  ? ((1 - parseFloat(discount)) * 100).toFixed(
                                      1,
                                    )
                                  : (discount * 10).toFixed(1)}
                                {t('折')}
                              </Tag>
                            )}
                          </div>
                          <div className='topup-premium-choice-meta'>
                            {t('实付')} {symbol}
                            {displayActualPay.toFixed(2)}
                          </div>
                          <div className='topup-premium-choice-sub'>
                            {t('节省')} {symbol}
                            {hasDiscount ? displaySave.toFixed(2) : '0.00'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Form.Slot>
              )}

              {enableCreemTopUp && creemProducts.length > 0 && (
                <Form.Slot label={t('Creem 充值')}>
                  <div className='topup-premium-choice-grid topup-premium-choice-grid--product'>
                    {creemProducts.map((product, index) => (
                      <button
                        key={index}
                        type='button'
                        onClick={() => creemPreTopUp(product)}
                        className='topup-premium-choice topup-premium-choice--product'
                      >
                        <div className='topup-premium-choice-top'>
                          <div className='topup-premium-choice-value'>
                            {product.name}
                          </div>
                          <span className='topup-premium-chip'>
                            {product.currency === 'EUR' ? '€' : '$'}
                            {product.price}
                          </span>
                        </div>
                        <div className='topup-premium-choice-meta'>
                          {t('充值额度')}: {product.quota}
                        </div>
                        <div className='topup-premium-choice-sub'>
                          Creem checkout
                        </div>
                      </button>
                    ))}
                  </div>
                </Form.Slot>
              )}
            </div>
          </Form>
        ) : (
          <Banner
            type='info'
            description={t(
              '管理员未开启在线充值功能，请联系管理员开启或使用兑换码充值。',
            )}
            className='topup-premium-banner'
            closeIcon={null}
          />
        )}
      </div>

      <div className='topup-premium-section'>
        <div className='topup-premium-section-head'>
          <div>
            <div className='topup-premium-section-title'>{t('兑换码充值')}</div>
            <div className='topup-premium-section-copy'>
              {t('请输入兑换码')}
            </div>
          </div>
          <span className='topup-premium-chip'>Gift code</span>
        </div>

        <Form
          getFormApi={(api) => (redeemFormApiRef.current = api)}
          initValues={{ redemptionCode: redemptionCode }}
        >
          <Form.Input
            field='redemptionCode'
            noLabel={true}
            placeholder={t('请输入兑换码')}
            value={redemptionCode}
            onChange={(value) => setRedemptionCode(value)}
            prefix={<IconGift />}
            suffix={
              <div className='flex items-center gap-2'>
                <Button
                  type='primary'
                  theme='solid'
                  onClick={topUp}
                  loading={isSubmitting}
                  className='topup-premium-primary-button'
                >
                  {t('兑换额度')}
                </Button>
              </div>
            }
            showClear
            style={{ width: '100%' }}
            extraText={
              topUpLink && (
                <Text className='topup-premium-helper-text'>
                  {t('在找兑换码？')}
                  <Text
                    className='topup-premium-inline-link'
                    underline
                    onClick={openTopUpLink}
                  >
                    {t('购买兑换码')}
                  </Text>
                </Text>
              )
            }
          />
        </Form>
      </div>
    </div>
  );

  return (
    <section className='topup-premium-surface topup-premium-surface--primary'>
      <div className='topup-premium-shell'>
        <div className='topup-premium-header'>
          <div className='topup-premium-heading'>
            <div className='topup-premium-emblem'>
              <CreditCard size={18} />
            </div>
            <div className='topup-premium-heading-copy'>
              <span className='topup-premium-overline'>Funding console</span>
              <Text className='topup-premium-heading-title'>
                {t('账户充值')}
              </Text>
              <Text className='topup-premium-heading-subtitle'>
                {t('多种充值方式，安全便捷')}
              </Text>
            </div>
          </div>

          <Button
            icon={<Receipt size={16} />}
            theme='light'
            type='primary'
            onClick={onOpenHistory}
            className='topup-premium-action-button'
          >
            {t('账单')}
          </Button>
        </div>

        <div className='topup-premium-metrics'>
          {accountMetrics.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className='topup-premium-metric'>
                <div className='topup-premium-metric-label'>
                  <span className='topup-premium-metric-icon'>
                    <Icon size={14} />
                  </span>
                  {item.label}
                </div>
                <div className='topup-premium-metric-value'>{item.value}</div>
              </article>
            );
          })}
        </div>

        {shouldShowSubscription && (
          <div className='topup-premium-segmented' role='tablist'>
            {[
              {
                key: 'subscription',
                icon: Sparkles,
                label: t('订阅套餐'),
                count: subscriptionPlans.length,
              },
              {
                key: 'topup',
                icon: Wallet,
                label: t('额度充值'),
                count: presetAmounts.length,
              },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type='button'
                  className={`topup-premium-segment ${
                    isActive ? 'topup-premium-segment--active' : ''
                  }`}
                  onClick={() => setActiveTab(item.key)}
                  aria-pressed={isActive}
                >
                  <span className='topup-premium-segment-label'>
                    <Icon size={14} />
                    {item.label}
                  </span>
                  <span className='topup-premium-segment-count'>
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className='topup-premium-body'>
          {shouldShowSubscription && activeTab === 'subscription' ? (
            <SubscriptionPlansCard
              t={t}
              loading={subscriptionLoading}
              plans={subscriptionPlans}
              payMethods={payMethods}
              enableOnlineTopUp={enableOnlineTopUp}
              enableStripeTopUp={enableStripeTopUp}
              enableCreemTopUp={enableCreemTopUp}
              billingPreference={billingPreference}
              onChangeBillingPreference={onChangeBillingPreference}
              activeSubscriptions={activeSubscriptions}
              allSubscriptions={allSubscriptions}
              reloadSubscriptionSelf={reloadSubscriptionSelf}
              withCard={false}
            />
          ) : (
            topupContent
          )}
        </div>
      </div>
    </section>
  );
};

export default RechargeCard;
