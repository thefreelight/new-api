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

import React from 'react';
import { Typography, Button, Input } from '@douyinfe/semi-ui';
import { Copy, Users, BarChart2, TrendingUp, Gift, Zap } from 'lucide-react';

const { Text } = Typography;

const InvitationCard = ({
  t,
  userState,
  renderQuota,
  setOpenTransfer,
  affLink,
  handleAffLinkClick,
}) => {
  const invitationMetrics = [
    {
      label: t('待使用收益'),
      value: renderQuota(userState?.user?.aff_quota || 0),
      icon: TrendingUp,
    },
    {
      label: t('总收益'),
      value: renderQuota(userState?.user?.aff_history_quota || 0),
      icon: BarChart2,
    },
    {
      label: t('邀请人数'),
      value: userState?.user?.aff_count || 0,
      icon: Users,
    },
  ];

  const rewardNotes = [
    t('邀请好友注册，好友充值后您可获得相应奖励'),
    t('通过划转功能将奖励额度转入到您的账户余额中'),
    t('邀请的好友越多，获得的奖励越多'),
  ];

  return (
    <section className='topup-premium-surface topup-premium-surface--secondary'>
      <div className='topup-premium-shell topup-premium-shell--aside'>
        <div className='topup-premium-header topup-premium-header--stacked'>
          <div className='topup-premium-heading'>
            <div className='topup-premium-emblem topup-premium-emblem--gift'>
              <Gift size={18} />
            </div>
            <div className='topup-premium-heading-copy'>
              <span className='topup-premium-overline'>Referral desk</span>
              <Text className='topup-premium-heading-title'>
                {t('邀请奖励')}
              </Text>
              <Text className='topup-premium-heading-subtitle'>
                {t('邀请好友获得额外奖励')}
              </Text>
            </div>
          </div>

          <Button
            type='primary'
            theme='solid'
            disabled={
              !userState?.user?.aff_quota || userState?.user?.aff_quota <= 0
            }
            onClick={() => setOpenTransfer(true)}
            icon={<Zap size={14} />}
            className='topup-premium-action-button topup-premium-action-button--full'
          >
            {t('划转到余额')}
          </Button>
        </div>

        <div className='topup-premium-metrics topup-premium-metrics--aside'>
          {invitationMetrics.map((item) => {
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

        <div className='topup-premium-section'>
          <div className='topup-premium-section-head'>
            <div>
              <div className='topup-premium-section-title'>{t('邀请链接')}</div>
              <div className='topup-premium-section-copy'>
                Share the invite route and grow your reward pool.
              </div>
            </div>
            <span className='topup-premium-chip'>
              {userState?.user?.aff_count || 0} invites
            </span>
          </div>

          <Input
            value={affLink}
            readonly
            className='topup-premium-link-input'
            suffix={
              <Button
                type='primary'
                theme='solid'
                onClick={handleAffLinkClick}
                icon={<Copy size={14} />}
                className='topup-premium-primary-button'
              >
                {t('复制')}
              </Button>
            }
          />
        </div>

        <div className='topup-premium-section'>
          <div className='topup-premium-section-head'>
            <div>
              <div className='topup-premium-section-title'>{t('奖励说明')}</div>
              <div className='topup-premium-section-copy'>
                Transfer rewards into balance after referrals convert.
              </div>
            </div>
            <span className='topup-premium-chip'>Guide</span>
          </div>

          <div className='topup-premium-note-list'>
            {rewardNotes.map((note) => (
              <div key={note} className='topup-premium-note'>
                <span className='topup-premium-note-dot' />
                <Text className='topup-premium-note-text'>{note}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvitationCard;
