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

import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from '@douyinfe/semi-ui';
import SettingsGeneralPayment from '../../pages/Setting/Payment/SettingsGeneralPayment';
import SettingsPaymentGateway from '../../pages/Setting/Payment/SettingsPaymentGateway';
import SettingsPaymentGatewayStripe from '../../pages/Setting/Payment/SettingsPaymentGatewayStripe';
import SettingsPaymentGatewayCreem from '../../pages/Setting/Payment/SettingsPaymentGatewayCreem';
import SettingsPaymentGatewayWaffo from '../../pages/Setting/Payment/SettingsPaymentGatewayWaffo';
import { API, showError, toBoolean } from '../../helpers';
import { useTranslation } from 'react-i18next';
import { Wallet, CreditCard, ShieldCheck, Sparkles, Coins } from 'lucide-react';

const PREMIUM_SUBTAB_STYLES = `
  .settings-premium-subtabs.semi-tabs .semi-tabs-bar {
    margin-bottom: 8px !important;
  }

  .settings-premium-subtabs .semi-tabs-tab {
    min-height: 32px !important;
    margin: 0 6px 6px 0 !important;
    padding: 0 10px !important;
  }
`;

const tabLabel = (Icon, label) => (
  <span className='settings-premium-tab-label'>
    <span className='settings-premium-tab-icon'>
      <Icon size={16} />
    </span>
    <span>{label}</span>
  </span>
);

const PaymentSetting = () => {
  const { t } = useTranslation();
  let [inputs, setInputs] = useState({
    ServerAddress: '',
    PayAddress: '',
    EpayId: '',
    EpayKey: '',
    Price: 7.3,
    MinTopUp: 1,
    TopupGroupRatio: '',
    CustomCallbackAddress: '',
    PayMethods: '',
    AmountOptions: '',
    AmountDiscount: '',

    StripeApiSecret: '',
    StripeWebhookSecret: '',
    StripePriceId: '',
    StripeUnitPrice: 8.0,
    StripeMinTopUp: 1,
    StripePromotionCodesEnabled: false,

    WaffoPancakeEnabled: false,
    WaffoPancakeSandbox: false,
    WaffoPancakeMerchantID: '',
    WaffoPancakePrivateKey: '',
    WaffoPancakeStoreID: '',
    WaffoPancakeProductID: '',
    WaffoPancakeReturnURL: '',
    WaffoPancakeCurrency: 'USD',
    WaffoPancakeUnitPrice: 1.0,
    WaffoPancakeMinTopUp: 1,
  });

  let [loading, setLoading] = useState(false);

  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        switch (item.key) {
          case 'TopupGroupRatio':
            try {
              newInputs[item.key] = JSON.stringify(
                JSON.parse(item.value),
                null,
                2,
              );
            } catch (error) {
              newInputs[item.key] = item.value;
            }
            break;
          case 'payment_setting.amount_options':
            try {
              newInputs['AmountOptions'] = JSON.stringify(
                JSON.parse(item.value),
                null,
                2,
              );
            } catch (error) {
              newInputs['AmountOptions'] = item.value;
            }
            break;
          case 'payment_setting.amount_discount':
            try {
              newInputs['AmountDiscount'] = JSON.stringify(
                JSON.parse(item.value),
                null,
                2,
              );
            } catch (error) {
              newInputs['AmountDiscount'] = item.value;
            }
            break;
          case 'Price':
          case 'MinTopUp':
          case 'StripeUnitPrice':
          case 'StripeMinTopUp':
          case 'WaffoPancakeUnitPrice':
          case 'WaffoPancakeMinTopUp':
            newInputs[item.key] = parseFloat(item.value);
            break;
          case 'WaffoPancakeMerchantID':
          case 'WaffoPancakePrivateKey':
          case 'WaffoPancakeStoreID':
          case 'WaffoPancakeProductID':
          case 'WaffoPancakeReturnURL':
          case 'WaffoPancakeCurrency':
            newInputs[item.key] = item.value;
            break;
          case 'WaffoPancakeSandbox':
            newInputs[item.key] = toBoolean(item.value);
            break;
          default:
            if (item.key.endsWith('Enabled')) {
              newInputs[item.key] = toBoolean(item.value);
            } else {
              newInputs[item.key] = item.value;
            }
            break;
        }
      });

      setInputs((prev) => ({ ...prev, ...newInputs }));
    } else {
      showError(t(message));
    }
  };

  async function onRefresh() {
    try {
      setLoading(true);
      await getOptions();
    } catch (error) {
      showError(t('刷新失败'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <>
      <Spin spinning={loading} size='large'>
        <style>{PREMIUM_SUBTAB_STYLES}</style>
        <div className='relative rounded-lg border border-[#e2e7ec] bg-white p-3 shadow-none sm:p-4'>
          <div className='relative'>
            <Tabs
              className='settings-premium-tabs settings-premium-subtabs'
              type='card'
              defaultActiveKey='general'
              contentStyle={{ paddingTop: 12 }}
            >
              <Tabs.TabPane
                tab={tabLabel(Wallet, t('通用设置'))}
                itemKey='general'
              >
                <SettingsGeneralPayment
                  options={inputs}
                  refresh={onRefresh}
                  hideSectionTitle
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={tabLabel(Coins, t('易支付设置'))}
                itemKey='epay'
              >
                <SettingsPaymentGateway
                  options={inputs}
                  refresh={onRefresh}
                  hideSectionTitle
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={tabLabel(CreditCard, t('Stripe 设置'))}
                itemKey='stripe'
              >
                <SettingsPaymentGatewayStripe
                  options={inputs}
                  refresh={onRefresh}
                  hideSectionTitle
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={tabLabel(Sparkles, t('Creem 设置'))}
                itemKey='creem'
              >
                <SettingsPaymentGatewayCreem
                  options={inputs}
                  refresh={onRefresh}
                  hideSectionTitle
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={tabLabel(ShieldCheck, t('Waffo 设置'))}
                itemKey='waffo'
              >
                <SettingsPaymentGatewayWaffo
                  options={inputs}
                  refresh={onRefresh}
                  hideSectionTitle
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default PaymentSetting;
