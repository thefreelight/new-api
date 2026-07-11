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

import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  API,
  showError,
  showInfo,
  showSuccess,
  renderQuota,
  renderQuotaWithAmount,
  copy,
  getQuotaPerUnit,
} from '../../helpers';
import { Modal, Toast } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../context/User';
import { StatusContext } from '../../context/Status';

import RechargeCard from './RechargeCard';
import InvitationCard from './InvitationCard';
import TransferModal from './modals/TransferModal';
import PaymentConfirmModal from './modals/PaymentConfirmModal';
import TopupHistoryModal from './modals/TopupHistoryModal';
import ConsoleShell from '../layout/ConsoleShell';

const TOPUP_PAGE_STYLES = `
  .topup-page-shell {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .topup-page-shell::before {
    content: '';
    position: absolute;
    inset: 20px 10% auto;
    height: 320px;
    border-radius: 999px;
    background:
      radial-gradient(circle at 24% 30%, rgba(124, 239, 255, 0.18), rgba(124, 239, 255, 0) 46%),
      radial-gradient(circle at 72% 24%, rgba(255, 156, 244, 0.14), rgba(255, 156, 244, 0) 40%),
      radial-gradient(circle at 54% 82%, rgba(88, 255, 196, 0.12), rgba(88, 255, 196, 0) 44%);
    filter: blur(28px);
    opacity: 0.9;
    pointer-events: none;
    z-index: 0;
  }

  .topup-page-hero {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(143, 230, 255, 0.16);
    border-radius: 34px;
    background:
      linear-gradient(135deg, rgba(7, 13, 24, 0.98), rgba(11, 20, 35, 0.96)),
      linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
    box-shadow:
      0 32px 90px rgba(3, 9, 18, 0.38),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
    isolation: isolate;
    z-index: 1;
  }

  .topup-page-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(120deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 22%),
      linear-gradient(90deg, rgba(125, 240, 255, 0) 0%, rgba(125, 240, 255, 0.22) 48%, rgba(125, 240, 255, 0) 100%);
    opacity: 0.45;
    pointer-events: none;
  }

  .topup-page-hero::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(145, 232, 255, 0.36), rgba(255, 255, 255, 0));
    pointer-events: none;
  }

  .topup-page-hero-grid {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 28px;
    padding: clamp(24px, 3vw, 38px);
  }

  .topup-page-hero-copy {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .topup-page-kicker {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 10px;
    border-radius: 999px;
    border: 1px solid rgba(139, 225, 255, 0.16);
    background: rgba(255, 255, 255, 0.06);
    padding: 9px 14px;
    color: #97f4ff;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    backdrop-filter: blur(16px);
  }

  .topup-page-kicker-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #73ffbc;
    box-shadow: 0 0 14px rgba(115, 255, 188, 0.8);
  }

  .topup-page-title {
    margin: 0;
    max-width: 720px;
    color: #f5fbff;
    font-size: clamp(32px, 4.8vw, 58px);
    font-weight: 600;
    line-height: 0.94;
    letter-spacing: -0.05em;
    font-family: "Sora", "Avenir Next", "Segoe UI", sans-serif;
  }

  .topup-page-subtitle {
    max-width: 720px;
    color: #b4c8db;
    font-size: 15px;
    line-height: 1.8;
  }

  .topup-page-signal-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .topup-page-signal {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.05);
    padding: 18px 18px 16px;
    backdrop-filter: blur(18px);
  }

  .topup-page-signal::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(139, 225, 255, 0.4), rgba(255, 255, 255, 0));
  }

  .topup-page-signal-label {
    color: rgba(180, 200, 219, 0.76);
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .topup-page-signal-value {
    margin-top: 10px;
    color: #f5fbff;
    font-size: clamp(20px, 2vw, 28px);
    font-weight: 600;
    letter-spacing: -0.04em;
    font-family: "Sora", "Avenir Next", "Segoe UI", sans-serif;
  }

  .topup-page-content {
    position: relative;
    z-index: 1;
  }

  @media (min-width: 1120px) {
    .topup-page-hero-grid {
      grid-template-columns: minmax(0, 1.22fr) minmax(360px, 0.78fr);
      align-items: end;
    }
  }

  @media (max-width: 960px) {
    .topup-page-signal-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .topup-page-shell {
      gap: 18px;
    }

    .topup-page-hero {
      border-radius: 26px;
    }

    .topup-page-hero-grid {
      padding: 20px;
      gap: 20px;
    }

    .topup-page-kicker {
      letter-spacing: 0.22em;
      font-size: 10px;
      padding: 8px 12px;
    }

    .topup-page-subtitle {
      font-size: 14px;
      line-height: 1.7;
    }
  }
`;

const TOPUP_PANEL_STYLES = `
  .topup-premium-surface {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(139, 225, 255, 0.14);
    border-radius: 30px;
    background:
      radial-gradient(circle at top left, rgba(116, 248, 226, 0.12), transparent 28%),
      radial-gradient(circle at top right, rgba(139, 225, 255, 0.14), transparent 30%),
      linear-gradient(180deg, #0a131e 0%, #08111a 54%, #060d16 100%);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 32px 90px rgba(2, 8, 16, 0.42);
    color: #e8f5ff;
  }

  .topup-premium-surface::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background:
      linear-gradient(120deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0) 20%),
      linear-gradient(90deg, rgba(127, 244, 221, 0) 0%, rgba(127, 244, 221, 0.24) 48%, rgba(127, 244, 221, 0) 100%);
    mask:
      linear-gradient(#fff 0 0) top/100% 1px no-repeat,
      linear-gradient(#fff 0 0);
    -webkit-mask:
      linear-gradient(#fff 0 0) top/100% 1px no-repeat,
      linear-gradient(#fff 0 0);
    opacity: 0.9;
  }

  .topup-premium-surface::after {
    content: '';
    position: absolute;
    inset: 18px;
    border-radius: 24px;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0) 24%),
      repeating-linear-gradient(
        180deg,
        rgba(127, 244, 221, 0.035) 0,
        rgba(127, 244, 221, 0.035) 1px,
        transparent 1px,
        transparent 34px
      );
    opacity: 0.34;
  }

  .topup-premium-surface--secondary {
    background:
      radial-gradient(circle at top left, rgba(255, 212, 124, 0.09), transparent 24%),
      radial-gradient(circle at top right, rgba(127, 244, 221, 0.12), transparent 34%),
      linear-gradient(180deg, #0b131e 0%, #09111a 100%);
  }

  .topup-premium-shell {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: clamp(22px, 2.4vw, 30px);
  }

  .topup-premium-shell--aside {
    gap: 20px;
  }

  .topup-premium-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
  }

  .topup-premium-header--stacked {
    flex-direction: column;
  }

  .topup-premium-heading {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .topup-premium-heading-copy {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .topup-premium-emblem {
    position: relative;
    display: grid;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    place-items: center;
    border-radius: 18px;
    border: 1px solid rgba(127, 244, 221, 0.18);
    background:
      linear-gradient(180deg, rgba(13, 29, 44, 0.96) 0%, rgba(10, 22, 34, 0.96) 100%);
    color: #dcf9ff;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 18px 34px rgba(2, 10, 18, 0.26);
  }

  .topup-premium-emblem::after {
    content: '';
    position: absolute;
    top: 9px;
    right: 9px;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #7cf4dd;
    box-shadow: 0 0 0 6px rgba(124, 244, 221, 0.12);
  }

  .topup-premium-emblem--gift::after {
    background: #ffd68a;
    box-shadow: 0 0 0 6px rgba(255, 214, 138, 0.12);
  }

  .topup-premium-overline {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    color: rgba(174, 199, 221, 0.66);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
  }

  .topup-premium-overline::before {
    content: '';
    width: 26px;
    height: 1px;
    background: linear-gradient(90deg, rgba(127, 244, 221, 0.56), rgba(139, 225, 255, 0.1));
  }

  .topup-premium-heading-title {
    color: #f5fbff;
    font-size: clamp(22px, 2vw, 28px);
    font-weight: 600;
    letter-spacing: -0.05em;
    font-family: "Sora", "Avenir Next", "Segoe UI", sans-serif;
  }

  .topup-premium-heading-subtitle {
    color: rgba(181, 203, 225, 0.74);
    font-size: 13px;
    line-height: 1.6;
  }

  .topup-premium-metrics {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .topup-premium-metrics--aside {
    grid-template-columns: 1fr;
  }

  .topup-premium-metric {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    padding: 16px 18px;
    backdrop-filter: blur(16px);
  }

  .topup-premium-metric::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 2px;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(127, 244, 221, 0.72), rgba(139, 225, 255, 0));
  }

  .topup-premium-metric-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: rgba(171, 196, 218, 0.68);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .topup-premium-metric-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: rgba(127, 244, 221, 0.08);
    color: #bdfef2;
  }

  .topup-premium-metric-value {
    margin-top: 12px;
    color: #f5fbff;
    font-size: clamp(22px, 2vw, 30px);
    font-weight: 600;
    letter-spacing: -0.05em;
    font-family: "Sora", "Avenir Next", "Segoe UI", sans-serif;
  }

  .topup-premium-segmented {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 6px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.03);
  }

  .topup-premium-segment {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 50px;
    border: 0;
    border-radius: 16px;
    padding: 0 14px;
    background: transparent;
    color: rgba(183, 205, 225, 0.76);
    cursor: pointer;
    transition:
      transform 0.18s ease,
      background-color 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .topup-premium-segment:hover {
    color: #f5fbff;
    background: rgba(255, 255, 255, 0.04);
  }

  .topup-premium-segment--active {
    color: #f5fbff;
    background:
      linear-gradient(135deg, rgba(127, 244, 221, 0.18), rgba(139, 225, 255, 0.08)),
      rgba(255, 255, 255, 0.06);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 16px 28px rgba(2, 10, 18, 0.22);
  }

  .topup-premium-segment-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
  }

  .topup-premium-segment-count {
    min-width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 600;
  }

  .topup-premium-body,
  .topup-premium-stack {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .topup-premium-section {
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 24px;
    background:
      linear-gradient(180deg, rgba(9, 20, 32, 0.96) 0%, rgba(7, 16, 25, 0.96) 100%);
    padding: 20px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 22px 44px rgba(2, 10, 18, 0.2);
  }

  .topup-premium-section::before {
    content: '';
    position: absolute;
    inset: 0 0 auto;
    height: 1px;
    background: linear-gradient(90deg, rgba(127, 244, 221, 0), rgba(127, 244, 221, 0.36), rgba(255, 255, 255, 0));
    opacity: 0.8;
  }

  .topup-premium-section-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;
  }

  .topup-premium-section-head--tight {
    margin-bottom: 14px;
  }

  .topup-premium-section-title {
    color: #f5fbff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  .topup-premium-section-copy {
    margin-top: 5px;
    color: rgba(178, 202, 223, 0.72);
    font-size: 12px;
    line-height: 1.6;
  }

  .topup-premium-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: fit-content;
    min-height: 28px;
    padding: 0 12px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(224, 241, 255, 0.84);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .topup-premium-chip--accent {
    border-color: rgba(127, 244, 221, 0.2);
    background: rgba(127, 244, 221, 0.12);
    color: #cffff4;
  }

  .topup-premium-chip--live {
    border-color: rgba(127, 244, 221, 0.18);
    background: rgba(127, 244, 221, 0.1);
    color: #cffff4;
  }

  .topup-premium-chip--warning {
    border-color: rgba(255, 180, 120, 0.2);
    background: rgba(255, 180, 120, 0.1);
    color: #ffe0ba;
  }

  .topup-premium-chip--muted {
    color: rgba(182, 203, 224, 0.72);
  }

  .topup-premium-chip--outline {
    background: transparent;
  }

  .topup-premium-slot-label {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .topup-premium-slot-meta {
    color: rgba(171, 196, 218, 0.64);
    font-size: 11px;
    letter-spacing: 0.08em;
  }

  .topup-premium-payment-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .topup-premium-choice-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .topup-premium-choice-grid--product {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .topup-premium-choice {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 128px;
    width: 100%;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 22px;
    padding: 16px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.02));
    color: #e8f5ff;
    text-align: left;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 18px 34px rgba(2, 10, 18, 0.16);
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background-color 0.18s ease,
      box-shadow 0.18s ease;
    cursor: pointer;
  }

  .topup-premium-choice:hover {
    transform: translateY(-1px);
    border-color: rgba(127, 244, 221, 0.22);
    background:
      linear-gradient(180deg, rgba(127, 244, 221, 0.08), rgba(255, 255, 255, 0.02));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.05),
      0 22px 36px rgba(2, 10, 18, 0.2);
  }

  .topup-premium-choice--active {
    border-color: rgba(127, 244, 221, 0.32);
    background:
      linear-gradient(135deg, rgba(127, 244, 221, 0.14), rgba(139, 225, 255, 0.08)),
      rgba(255, 255, 255, 0.04);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 24px 40px rgba(2, 10, 18, 0.24);
  }

  .topup-premium-choice--product {
    min-height: 118px;
  }

  .topup-premium-choice-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }

  .topup-premium-choice-value {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #f5fbff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  .topup-premium-choice-meta {
    color: rgba(190, 211, 230, 0.78);
    font-size: 13px;
    line-height: 1.5;
  }

  .topup-premium-choice-sub {
    color: rgba(160, 188, 213, 0.62);
    font-size: 12px;
    letter-spacing: 0.04em;
  }

  .topup-premium-helper-text,
  .topup-premium-inline-note {
    color: rgba(180, 204, 225, 0.7);
    font-size: 12px;
    line-height: 1.6;
  }

  .topup-premium-helper-value {
    margin-left: 8px;
    color: #bfffee;
    font-weight: 600;
  }

  .topup-premium-inline-link {
    margin-left: 8px;
    color: #8be8ff !important;
    cursor: pointer;
  }

  .topup-premium-inline-link:hover {
    color: #c6fbff !important;
  }

  .topup-premium-loading {
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .topup-premium-note-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .topup-premium-note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: rgba(190, 211, 230, 0.8);
    font-size: 13px;
    line-height: 1.6;
  }

  .topup-premium-note-dot {
    width: 7px;
    height: 7px;
    margin-top: 7px;
    border-radius: 999px;
    flex-shrink: 0;
    background: #7cf4dd;
    box-shadow: 0 0 0 6px rgba(124, 244, 221, 0.1);
  }

  .topup-premium-note-text {
    color: inherit;
  }

  .topup-premium-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 160px;
    border: 1px dashed rgba(148, 163, 184, 0.16);
    border-radius: 22px;
    color: rgba(181, 203, 224, 0.72);
    font-size: 13px;
    text-align: center;
    background: rgba(255, 255, 255, 0.02);
  }

  .topup-premium-scroll {
    max-height: 420px;
    overflow-y: auto;
    padding-right: 6px;
  }

  .topup-premium-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .topup-premium-scroll::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(127, 244, 221, 0.3), rgba(139, 225, 255, 0.22));
  }

  .topup-subscription-summary {
    gap: 14px;
  }

  .topup-subscription-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .topup-subscription-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 4px;
  }

  .topup-subscription-records {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .topup-subscription-record {
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.03);
    padding: 16px;
  }

  .topup-subscription-record-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
  }

  .topup-subscription-record-side {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  .topup-subscription-record-title {
    color: #f5fbff;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .topup-subscription-record-meta {
    margin-top: 6px;
    color: rgba(171, 196, 218, 0.66);
    font-size: 12px;
    line-height: 1.6;
  }

  .topup-subscription-usage {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.1);
  }

  .topup-subscription-usage-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: rgba(231, 244, 255, 0.88);
    font-size: 12px;
    line-height: 1.6;
  }

  .topup-subscription-usage-top--muted {
    margin-top: 8px;
    color: rgba(171, 196, 218, 0.66);
  }

  .topup-premium-progress-bar {
    position: relative;
    overflow: hidden;
    height: 8px;
    margin-top: 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
  }

  .topup-premium-progress-fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: inherit;
    background: linear-gradient(90deg, rgba(127, 244, 221, 0.94), rgba(139, 225, 255, 0.72));
    box-shadow: 0 0 20px rgba(127, 244, 221, 0.18);
  }

  .topup-subscription-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .topup-subscription-plan {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-height: 100%;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 24px;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.02));
    padding: 20px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.04),
      0 20px 38px rgba(2, 10, 18, 0.18);
  }

  .topup-subscription-plan--featured {
    border-color: rgba(127, 244, 221, 0.24);
    background:
      radial-gradient(circle at top right, rgba(127, 244, 221, 0.12), transparent 34%),
      linear-gradient(180deg, rgba(127, 244, 221, 0.08), rgba(255, 255, 255, 0.02));
  }

  .topup-subscription-plan--loading {
    min-height: 320px;
  }

  .topup-subscription-plan-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .topup-subscription-plan-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .topup-subscription-plan-copy {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .topup-subscription-plan-title {
    margin: 0;
    color: #f5fbff;
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.04em;
    font-family: "Sora", "Avenir Next", "Segoe UI", sans-serif;
  }

  .topup-subscription-plan-subtitle {
    color: rgba(181, 203, 225, 0.72);
    font-size: 13px;
    line-height: 1.6;
  }

  .topup-subscription-plan-price {
    display: flex;
    align-items: baseline;
    gap: 4px;
    color: #d8fff5;
  }

  .topup-subscription-plan-currency {
    font-size: 18px;
    font-weight: 600;
  }

  .topup-subscription-plan-amount {
    font-size: clamp(32px, 2.4vw, 40px);
    font-weight: 600;
    letter-spacing: -0.06em;
    font-family: "Sora", "Avenir Next", "Segoe UI", sans-serif;
  }

  .topup-subscription-plan-benefits {
    display: flex;
    flex-direction: column;
    gap: 10px;
    color: rgba(198, 216, 233, 0.82);
    font-size: 13px;
  }

  .topup-premium-benefit-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    line-height: 1.55;
  }

  .topup-subscription-plan-footer {
    margin-top: auto;
    padding-top: 18px;
    border-top: 1px solid rgba(148, 163, 184, 0.1);
  }

  .topup-premium-surface .semi-form-field-label-text,
  .topup-premium-surface .semi-form-field-label-required {
    color: rgba(176, 200, 221, 0.72);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .topup-premium-surface .semi-input-wrapper,
  .topup-premium-surface .semi-input-number,
  .topup-premium-surface .semi-input-number-wrapper,
  .topup-premium-surface .semi-input-textarea-wrapper,
  .topup-premium-surface .semi-select,
  .topup-premium-surface .semi-select-selection {
    border-radius: 18px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background: rgba(8, 18, 29, 0.86);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    transition:
      border-color 0.18s ease,
      background-color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease;
  }

  .topup-premium-surface .semi-input-wrapper:hover,
  .topup-premium-surface .semi-input-number:hover,
  .topup-premium-surface .semi-input-number-wrapper:hover,
  .topup-premium-surface .semi-input-textarea-wrapper:hover,
  .topup-premium-surface .semi-select:hover,
  .topup-premium-surface .semi-select-selection:hover {
    border-color: rgba(127, 244, 221, 0.22);
    background: rgba(10, 21, 34, 0.92);
  }

  .topup-premium-surface .semi-input-wrapper:focus-within,
  .topup-premium-surface .semi-input-number:focus-within,
  .topup-premium-surface .semi-input-number-wrapper:focus-within,
  .topup-premium-surface .semi-input-textarea-wrapper:focus-within,
  .topup-premium-surface .semi-select:focus-within,
  .topup-premium-surface .semi-select-selection:focus-within {
    border-color: rgba(127, 244, 221, 0.32);
    background: rgba(10, 22, 35, 0.94);
    box-shadow:
      0 0 0 4px rgba(127, 244, 221, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .topup-premium-surface .semi-input,
  .topup-premium-surface .semi-input-number-input,
  .topup-premium-surface .semi-input-number-suffix,
  .topup-premium-surface .semi-input-prefix,
  .topup-premium-surface .semi-input-suffix,
  .topup-premium-surface .semi-select-selection-text,
  .topup-premium-surface .semi-select-selection-placeholder,
  .topup-premium-surface .semi-select-arrow {
    color: #e8f5ff;
  }

  .topup-premium-surface .semi-input::placeholder,
  .topup-premium-surface .semi-input-number-input::placeholder {
    color: rgba(171, 196, 218, 0.42);
  }

  .topup-premium-surface .semi-button {
    border-radius: 16px;
    font-weight: 600;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      background-color 0.18s ease,
      color 0.18s ease;
  }

  .topup-premium-surface .semi-button:not(.semi-button-borderless):not(.semi-button-disabled):hover {
    transform: translateY(-1px);
  }

  .topup-premium-surface .semi-button.semi-button-primary:not(.semi-button-borderless),
  .topup-premium-surface .topup-premium-primary-button.semi-button {
    border-color: rgba(127, 244, 221, 0.18);
    background:
      linear-gradient(135deg, rgba(127, 244, 221, 0.18), rgba(139, 225, 255, 0.12)),
      linear-gradient(180deg, rgba(12, 30, 44, 0.96), rgba(8, 22, 34, 0.96));
    color: #f5fbff;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 18px 30px rgba(2, 10, 18, 0.24);
  }

  .topup-premium-surface .semi-button.semi-button-primary:not(.semi-button-borderless):hover,
  .topup-premium-surface .topup-premium-primary-button.semi-button:hover {
    border-color: rgba(127, 244, 221, 0.3);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 22px 34px rgba(2, 10, 18, 0.3);
  }

  .topup-premium-surface .semi-button.semi-button-tertiary:not(.semi-button-borderless),
  .topup-premium-surface .semi-button.semi-button-light:not(.semi-button-borderless) {
    border-color: rgba(148, 163, 184, 0.14);
    background: rgba(255, 255, 255, 0.05);
    color: rgba(230, 244, 255, 0.88);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }

  .topup-premium-surface .semi-button.semi-button-disabled {
    opacity: 0.42;
    box-shadow: none;
  }

  .topup-premium-pay-button.semi-button {
    width: 100%;
    justify-content: flex-start;
    text-align: left;
  }

  .topup-premium-action-button.semi-button {
    min-height: 42px;
    padding: 0 16px;
  }

  .topup-premium-action-button--full.semi-button {
    width: 100%;
  }

  .topup-premium-icon-button.semi-button {
    width: 42px;
    min-width: 42px;
    height: 42px;
    padding: 0;
  }

  .topup-premium-link-input.semi-input-wrapper {
    padding-right: 6px;
  }

  .topup-premium-surface .semi-tag,
  .topup-premium-inline-tag.semi-tag {
    border: 1px solid rgba(127, 244, 221, 0.18);
    border-radius: 999px;
    background: rgba(127, 244, 221, 0.08);
    color: #d8fff5;
  }

  .topup-premium-banner.semi-banner {
    border-radius: 20px;
    border: 1px solid rgba(139, 225, 255, 0.12);
    background:
      linear-gradient(135deg, rgba(139, 225, 255, 0.08), rgba(127, 244, 221, 0.06)),
      rgba(7, 16, 25, 0.94);
  }

  .topup-premium-banner .semi-banner-content,
  .topup-premium-banner .semi-banner-description {
    color: rgba(214, 236, 255, 0.86);
  }

  @media (max-width: 1080px) {
    .topup-premium-metrics {
      grid-template-columns: 1fr;
    }

    .topup-premium-header {
      flex-direction: column;
    }
  }

  @media (max-width: 720px) {
    .topup-premium-surface {
      border-radius: 24px;
    }

    .topup-premium-shell {
      gap: 18px;
      padding: 18px;
    }

    .topup-premium-section {
      border-radius: 20px;
      padding: 16px;
    }

    .topup-premium-segmented {
      grid-template-columns: 1fr;
    }

    .topup-premium-choice-grid,
    .topup-subscription-grid {
      grid-template-columns: 1fr;
    }

    .topup-premium-section-head,
    .topup-subscription-record-top {
      flex-direction: column;
    }

    .topup-subscription-record-side {
      justify-content: flex-start;
    }
  }
`;

const TOPUP_ADMIN_OVERRIDES = `
  .topup-page-shell {
    gap: 12px;
  }

  .topup-page-shell::before,
  .topup-page-hero::before,
  .topup-page-hero::after,
  .topup-premium-surface::before,
  .topup-premium-surface::after,
  .topup-premium-section::before,
  .topup-premium-panel::before {
    display: none !important;
  }

  .topup-page-hero {
    border: 1px solid #dfe5eb !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    box-shadow: 0 18px 54px rgba(17, 23, 34, 0.06) !important;
  }

  .topup-page-hero-grid {
    grid-template-columns: minmax(0, 1fr) minmax(360px, 0.72fr);
    align-items: center;
    gap: 16px;
    padding: 16px 18px;
  }

  .topup-page-hero-copy {
    gap: 6px;
  }

  .topup-page-kicker {
    border: 1px solid #dfe5eb;
    border-radius: 999px;
    background: #f8fafc;
    padding: 2px 8px;
    color: #697584;
    font-size: 11px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0;
    text-transform: none;
    backdrop-filter: none;
  }

  .topup-page-kicker-dot {
    width: 6px;
    height: 6px;
    background: #2f5f8f;
    box-shadow: none;
  }

  .topup-page-title {
    color: #141a22;
    font-family: var(--console-font-display);
    font-size: 22px;
    font-weight: 700;
    line-height: 28px;
    letter-spacing: 0;
  }

  .topup-page-subtitle {
    max-width: none;
    color: #697584;
    font-size: 13px;
    line-height: 20px;
  }

  .topup-page-signal-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .topup-page-signal {
    border: 1px solid #dfe5eb;
    border-radius: 8px;
    background: #fbfcfd;
    padding: 10px 12px;
    backdrop-filter: none;
  }

  .topup-page-signal::before {
    display: none;
  }

  .topup-page-signal-label,
  .topup-premium-overline,
  .topup-premium-section-copy,
  .topup-premium-metric-label,
  .topup-premium-helper-text,
  .topup-premium-inline-note,
  .topup-premium-note-text {
    color: #697584 !important;
  }

  .topup-page-signal-value,
  .topup-premium-heading-title,
  .topup-premium-section-title,
  .topup-premium-metric-value,
  .topup-premium-helper-value {
    color: #141a22 !important;
  }

  .topup-page-content {
    gap: 12px;
  }

  .topup-premium-surface,
  .topup-premium-section,
  .topup-premium-panel,
  .topup-subscription-summary,
  .topup-subscription-card,
  .topup-subscription-record,
  .topup-premium-metric,
  .topup-premium-note,
  .topup-premium-choice,
  .topup-premium-method,
  .topup-premium-summary,
  .topup-premium-empty,
  .topup-premium-scroll {
    border-color: #dfe5eb !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    box-shadow: none !important;
  }

  .topup-premium-surface--secondary,
  .topup-premium-section,
  .topup-premium-panel,
  .topup-premium-metric,
  .topup-premium-note,
  .topup-premium-empty {
    background: #fbfcfd !important;
  }

  .topup-premium-shell {
    gap: 14px;
    padding: 16px;
  }

  .topup-premium-header {
    gap: 12px;
  }

  .topup-premium-header--stacked {
    gap: 12px;
  }

  .topup-premium-heading {
    gap: 10px;
  }

  .topup-premium-emblem {
    width: 34px;
    height: 34px;
    border-color: #dce3ea !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    color: #2f5f8f !important;
    box-shadow: none !important;
  }

  .topup-premium-heading-title {
    font-size: 18px !important;
    line-height: 24px !important;
    letter-spacing: 0 !important;
  }

  .topup-premium-heading-subtitle {
    color: #697584 !important;
    font-size: 13px !important;
    line-height: 20px !important;
  }

  .topup-premium-stack {
    gap: 12px;
  }

  .topup-premium-section {
    padding: 14px;
  }

  .topup-premium-section-head {
    gap: 10px;
    align-items: center;
  }

  .topup-premium-chip,
  .topup-premium-surface .semi-tag,
  .topup-premium-inline-tag.semi-tag {
    border-color: #dfe5eb !important;
    background: #f8fafc !important;
    color: #4c5968 !important;
  }

  .topup-premium-input.semi-input-wrapper,
  .topup-premium-link-input.semi-input-wrapper,
  .topup-premium-select .semi-select-selection,
  .topup-premium-surface .semi-input-wrapper,
  .topup-premium-surface .semi-input-number,
  .topup-premium-surface .semi-select-selection {
    border-color: #dfe5eb !important;
    border-radius: 6px !important;
    background: #ffffff !important;
    color: #141a22 !important;
    box-shadow: none !important;
  }

  .topup-premium-primary-button.semi-button,
  .topup-premium-action-button.semi-button {
    border-radius: 6px !important;
    box-shadow: none !important;
  }

  .topup-premium-segmented,
  .topup-premium-choice-grid,
  .topup-subscription-grid,
  .topup-premium-metrics {
    gap: 8px;
  }

  .topup-premium-banner.semi-banner {
    border-color: #dfe5eb !important;
    border-radius: 8px !important;
    background: #f8fafc !important;
  }

  .topup-premium-banner .semi-banner-content,
  .topup-premium-banner .semi-banner-description {
    color: #4c5968 !important;
  }

  .topup-premium-segmented {
    border-color: #dfe5eb !important;
    border-radius: 8px !important;
    background: #f8fafc !important;
    padding: 4px !important;
  }

  .topup-premium-segment {
    min-height: 34px !important;
    border-radius: 6px !important;
    color: #4c5968 !important;
    background: transparent !important;
    box-shadow: none !important;
    transform: none !important;
  }

  .topup-premium-segment:hover {
    color: #141a22 !important;
    background: #eef3f7 !important;
  }

  .topup-premium-segment--active {
    color: #141a22 !important;
    background: #ffffff !important;
    box-shadow: 0 1px 2px rgba(17, 23, 34, 0.06) !important;
  }

  .topup-premium-segment-count,
  .topup-premium-choice,
  .topup-premium-choice--active,
  .topup-subscription-plan,
  .topup-subscription-plan--featured,
  .topup-subscription-record {
    border-color: #dfe5eb !important;
    border-radius: 8px !important;
    background: #ffffff !important;
    color: #141a22 !important;
    box-shadow: none !important;
    transform: none !important;
  }

  .topup-premium-choice:hover {
    border-color: #cfd8e2 !important;
    background: #f8fafc !important;
    transform: none !important;
  }

  .topup-premium-choice--active,
  .topup-subscription-plan--featured {
    border-color: #c8d5e1 !important;
    background: #f3f6f9 !important;
  }

  .topup-premium-choice-value,
  .topup-subscription-record-title,
  .topup-subscription-plan-title,
  .topup-subscription-plan-price {
    color: #141a22 !important;
  }

  .topup-premium-choice-meta,
  .topup-premium-choice-sub,
  .topup-premium-slot-meta,
  .topup-subscription-record-meta,
  .topup-subscription-plan-subtitle,
  .topup-subscription-plan-benefits,
  .topup-subscription-usage-top,
  .topup-subscription-usage-top--muted {
    color: #697584 !important;
  }

  .topup-premium-note-dot,
  .topup-premium-emblem::after {
    box-shadow: none !important;
    background: #2f5f8f !important;
  }

  .topup-premium-progress-bar {
    background: #e8eef4 !important;
  }

  .topup-premium-progress-fill {
    background: #2f5f8f !important;
    box-shadow: none !important;
  }

  .topup-premium-surface .semi-form-field-label-text,
  .topup-premium-surface .semi-form-field-label-required {
    color: #697584 !important;
    font-size: 12px !important;
    letter-spacing: 0 !important;
    text-transform: none !important;
  }

  .topup-premium-surface .semi-input,
  .topup-premium-surface .semi-input-number-input,
  .topup-premium-surface .semi-input-number-suffix,
  .topup-premium-surface .semi-input-prefix,
  .topup-premium-surface .semi-input-suffix,
  .topup-premium-surface .semi-select-selection-text,
  .topup-premium-surface .semi-select-selection-placeholder,
  .topup-premium-surface .semi-select-arrow {
    color: #141a22 !important;
  }

  .topup-premium-surface .semi-button:not(.semi-button-borderless):not(.semi-button-disabled):hover {
    transform: none !important;
  }

  .topup-premium-surface .semi-button.semi-button-primary:not(.semi-button-borderless),
  .topup-premium-surface .topup-premium-primary-button.semi-button {
    border-color: #17202b !important;
    background: #17202b !important;
    color: #ffffff !important;
    box-shadow: none !important;
  }

  .topup-premium-surface .semi-button.semi-button-tertiary:not(.semi-button-borderless),
  .topup-premium-surface .semi-button.semi-button-light:not(.semi-button-borderless) {
    border-color: #dfe5eb !important;
    background: #ffffff !important;
    color: #4c5968 !important;
    box-shadow: none !important;
  }

  @media (max-width: 1080px) {
    .topup-page-hero-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .topup-page-hero-grid {
      padding: 14px;
    }

    .topup-page-signal-grid {
      grid-template-columns: 1fr;
    }

    .topup-premium-shell,
    .topup-premium-section {
      padding: 12px;
    }
  }
`;

const TopUp = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState] = useContext(StatusContext);

  const [redemptionCode, setRedemptionCode] = useState('');
  const [amount, setAmount] = useState(0.0);
  const [minTopUp, setMinTopUp] = useState(statusState?.status?.min_topup || 1);
  const [topUpCount, setTopUpCount] = useState(
    statusState?.status?.min_topup || 1,
  );
  const [topUpLink, setTopUpLink] = useState(
    statusState?.status?.top_up_link || '',
  );
  const [enableOnlineTopUp, setEnableOnlineTopUp] = useState(
    statusState?.status?.enable_online_topup || false,
  );
  const [priceRatio, setPriceRatio] = useState(statusState?.status?.price || 1);

  const [enableStripeTopUp, setEnableStripeTopUp] = useState(
    statusState?.status?.enable_stripe_topup || false,
  );
  const [statusLoading, setStatusLoading] = useState(true);

  // Creem 相关状态
  const [creemProducts, setCreemProducts] = useState([]);
  const [enableCreemTopUp, setEnableCreemTopUp] = useState(false);
  const [creemOpen, setCreemOpen] = useState(false);
  const [selectedCreemProduct, setSelectedCreemProduct] = useState(null);

  // Waffo 相关状态
  const [enableWaffoTopUp, setEnableWaffoTopUp] = useState(false);
  const [waffoPayMethods, setWaffoPayMethods] = useState([]);
  const [waffoMinTopUp, setWaffoMinTopUp] = useState(1);
  const [enableWaffoPancakeTopUp, setEnableWaffoPancakeTopUp] = useState(false);
  const [waffoPancakeMinTopUp, setWaffoPancakeMinTopUp] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [payWay, setPayWay] = useState('');
  const [amountLoading, setAmountLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [payMethods, setPayMethods] = useState([]);

  const affFetchedRef = useRef(false);

  // 邀请相关状态
  const [affLink, setAffLink] = useState('');
  const [openTransfer, setOpenTransfer] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);

  // 账单Modal状态
  const [openHistory, setOpenHistory] = useState(false);

  // 订阅相关
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [billingPreference, setBillingPreference] =
    useState('subscription_first');
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);
  const [allSubscriptions, setAllSubscriptions] = useState([]);

  // 预设充值额度选项
  const [presetAmounts, setPresetAmounts] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);

  // 充值配置信息
  const [topupInfo, setTopupInfo] = useState({
    amount_options: [],
    discount: {},
  });

  const confirmPayMethods = [
    ...payMethods,
    ...waffoPayMethods.map((method, index) => ({
      ...method,
      type: `waffo:${index}`,
      min_topup: waffoMinTopUp,
      color: method.color || 'rgba(var(--semi-primary-5), 1)',
    })),
  ];

  const getPayMethodConfig = (payment) =>
    confirmPayMethods.find((method) => method.type === payment);

  const getPaymentMinTopUp = (payment) => {
    const configuredMinTopUp = Number(getPayMethodConfig(payment)?.min_topup);
    return Number.isFinite(configuredMinTopUp) && configuredMinTopUp > 0
      ? configuredMinTopUp
      : minTopUp;
  };

  const requestAmountByPayment = async (payment, value) => {
    if (payment === 'stripe') {
      return getStripeAmount(value);
    }
    if (payment === 'waffo_pancake') {
      return getWaffoPancakeAmount(value);
    }
    if (typeof payment === 'string' && payment.startsWith('waffo:')) {
      return getWaffoAmount(value);
    }
    return getAmount(value);
  };

  const topUp = async () => {
    if (redemptionCode === '') {
      showInfo(t('请输入兑换码！'));
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await API.post('/api/user/topup', {
        key: redemptionCode,
      });
      const { success, message, data } = res.data;
      if (success) {
        showSuccess(t('兑换成功！'));
        Modal.success({
          title: t('兑换成功！'),
          content: t('成功兑换额度：') + renderQuota(data),
          centered: true,
        });
        if (userState.user) {
          const updatedUser = {
            ...userState.user,
            quota: userState.user.quota + data,
          };
          userDispatch({ type: 'login', payload: updatedUser });
        }
        setRedemptionCode('');
      } else {
        showError(message);
      }
    } catch (err) {
      showError(t('请求失败'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTopUpLink = () => {
    if (!topUpLink) {
      showError(t('超级管理员未设置充值链接！'));
      return;
    }
    window.open(topUpLink, '_blank');
  };

  const preTopUp = async (payment) => {
    if (payment === 'stripe') {
      if (!enableStripeTopUp) {
        showError(t('管理员未开启Stripe充值！'));
        return;
      }
    } else if (payment === 'waffo_pancake') {
      if (!enableWaffoPancakeTopUp) {
        showError(t('管理员未开启 Waffo Pancake 充值！'));
        return;
      }
    } else if (payment.startsWith('waffo:')) {
      if (!enableWaffoTopUp) {
        showError(t('管理员未开启 Waffo 充值！'));
        return;
      }
    } else {
      if (!enableOnlineTopUp) {
        showError(t('管理员未开启在线充值！'));
        return;
      }
    }

    setPayWay(payment);
    setPaymentLoading(true);
    try {
      const selectedMinTopUp = getPaymentMinTopUp(payment);
      await requestAmountByPayment(payment);

      if (topUpCount < selectedMinTopUp) {
        showError(t('充值数量不能小于') + selectedMinTopUp);
        return;
      }
      setOpen(true);
    } catch (error) {
      showError(t('获取金额失败'));
    } finally {
      setPaymentLoading(false);
    }
  };

  const onlineTopUp = async () => {
    if (payWay === 'waffo_pancake') {
      setConfirmLoading(true);
      try {
        await waffoPancakeTopUp();
      } finally {
        setOpen(false);
        setConfirmLoading(false);
      }
      return;
    }

    if (payWay.startsWith('waffo:')) {
      const payMethodIndex = Number(payWay.split(':')[1]);
      setConfirmLoading(true);
      try {
        await waffoTopUp(Number.isFinite(payMethodIndex) ? payMethodIndex : 0);
      } finally {
        setOpen(false);
        setConfirmLoading(false);
      }
      return;
    }

    if (payWay === 'stripe') {
      // Stripe 支付处理
      if (amount === 0) {
        await getStripeAmount();
      }
    } else {
      // 普通支付处理
      if (amount === 0) {
        await getAmount();
      }
    }

    if (topUpCount < minTopUp) {
      showError('充值数量不能小于' + minTopUp);
      return;
    }
    setConfirmLoading(true);
    try {
      let res;
      if (payWay === 'stripe') {
        // Stripe 支付请求
        res = await API.post('/api/user/stripe/pay', {
          amount: parseInt(topUpCount),
          payment_method: 'stripe',
        });
      } else {
        // 普通支付请求
        res = await API.post('/api/user/pay', {
          amount: parseInt(topUpCount),
          payment_method: payWay,
        });
      }

      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          if (payWay === 'stripe') {
            // Stripe 支付回调处理
            window.open(data.pay_link, '_blank');
          } else {
            // 普通支付表单提交
            let params = data;
            let url = res.data.url;
            let form = document.createElement('form');
            form.action = url;
            form.method = 'POST';
            let isSafari =
              navigator.userAgent.indexOf('Safari') > -1 &&
              navigator.userAgent.indexOf('Chrome') < 1;
            if (!isSafari) {
              form.target = '_blank';
            }
            for (let key in params) {
              let input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = params[key];
              form.appendChild(input);
            }
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        } else {
          const errorMsg =
            typeof data === 'string' ? data : message || t('支付失败');
          showError(errorMsg);
        }
      } else {
        showError(res);
      }
    } catch (err) {
      showError(t('支付请求失败'));
    } finally {
      setOpen(false);
      setConfirmLoading(false);
    }
  };

  const creemPreTopUp = async (product) => {
    if (!enableCreemTopUp) {
      showError(t('管理员未开启 Creem 充值！'));
      return;
    }
    setSelectedCreemProduct(product);
    setCreemOpen(true);
  };

  const onlineCreemTopUp = async () => {
    if (!selectedCreemProduct) {
      showError(t('请选择产品'));
      return;
    }
    // Validate product has required fields
    if (!selectedCreemProduct.productId) {
      showError(t('产品配置错误，请联系管理员'));
      return;
    }
    setConfirmLoading(true);
    try {
      const res = await API.post('/api/user/creem/pay', {
        product_id: selectedCreemProduct.productId,
        payment_method: 'creem',
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          processCreemCallback(data);
        } else {
          const errorMsg =
            typeof data === 'string' ? data : message || t('支付失败');
          showError(errorMsg);
        }
      } else {
        showError(res);
      }
    } catch (err) {
      showError(t('支付请求失败'));
    } finally {
      setCreemOpen(false);
      setConfirmLoading(false);
    }
  };

  const waffoTopUp = async (payMethodIndex) => {
    try {
      if (topUpCount < waffoMinTopUp) {
        showError(t('充值数量不能小于') + waffoMinTopUp);
        return;
      }
      setPaymentLoading(true);
      const requestBody = {
        amount: parseInt(topUpCount),
      };
      if (payMethodIndex != null) {
        requestBody.pay_method_index = payMethodIndex;
      }
      const res = await API.post('/api/user/waffo/pay', requestBody);
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success' && data?.payment_url) {
          window.open(data.payment_url, '_blank');
        } else {
          showError(data || t('支付请求失败'));
        }
      } else {
        showError(res);
      }
    } catch (e) {
      showError(t('支付请求失败'));
    } finally {
      setPaymentLoading(false);
    }
  };

  const getWaffoAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    setAmountLoading(true);
    try {
      const res = await API.post('/api/user/waffo/amount', {
        amount: parseInt(value),
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          setAmount(parseFloat(data));
        } else {
          setAmount(0);
          Toast.error({ content: '错误：' + data, id: 'getAmount' });
        }
      } else {
        showError(res);
      }
    } catch (err) {
      // amount fetch failed silently
    } finally {
      setAmountLoading(false);
    }
  };

  const waffoPancakeTopUp = async () => {
    const minTopUpValue = Number(waffoPancakeMinTopUp || 1);
    if (topUpCount < minTopUpValue) {
      showError(t('充值数量不能小于') + minTopUpValue);
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await API.post('/api/user/waffo-pancake/pay', {
        amount: parseInt(topUpCount),
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          const checkoutUrl = data?.checkout_url || '';
          if (checkoutUrl) {
            window.open(checkoutUrl, '_blank');
          } else {
            showError(t('支付请求失败'));
          }
        } else {
          const errorMsg =
            typeof data === 'string' ? data : message || t('支付请求失败');
          showError(errorMsg);
        }
      } else {
        showError(res);
      }
    } catch (e) {
      showError(t('支付请求失败'));
    } finally {
      setPaymentLoading(false);
    }
  };

  const getWaffoPancakeAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    setAmountLoading(true);
    try {
      const res = await API.post('/api/user/waffo-pancake/amount', {
        amount: parseInt(value),
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          setAmount(parseFloat(data));
        } else {
          setAmount(0);
          Toast.error({ content: '错误：' + data, id: 'getAmount' });
        }
      } else {
        showError(res);
      }
    } catch (err) {
      // amount fetch failed silently
    } finally {
      setAmountLoading(false);
    }
  };

  const processCreemCallback = (data) => {
    // 与 Stripe 保持一致的实现方式
    window.open(data.checkout_url, '_blank');
  };

  const getUserQuota = async () => {
    let res = await API.get(`/api/user/self`);
    const { success, message, data } = res.data;
    if (success) {
      userDispatch({ type: 'login', payload: data });
    } else {
      showError(message);
    }
  };

  const getSubscriptionPlans = async () => {
    setSubscriptionLoading(true);
    try {
      const res = await API.get('/api/subscription/plans');
      if (res.data?.success) {
        setSubscriptionPlans(res.data.data || []);
      }
    } catch (e) {
      setSubscriptionPlans([]);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const getSubscriptionSelf = async () => {
    try {
      const res = await API.get('/api/subscription/self');
      if (res.data?.success) {
        setBillingPreference(
          res.data.data?.billing_preference || 'subscription_first',
        );
        // Active subscriptions
        const activeSubs = res.data.data?.subscriptions || [];
        setActiveSubscriptions(activeSubs);
        // All subscriptions (including expired)
        const allSubs = res.data.data?.all_subscriptions || [];
        setAllSubscriptions(allSubs);
      }
    } catch (e) {
      // ignore
    }
  };

  const updateBillingPreference = async (pref) => {
    const previousPref = billingPreference;
    setBillingPreference(pref);
    try {
      const res = await API.put('/api/subscription/self/preference', {
        billing_preference: pref,
      });
      if (res.data?.success) {
        showSuccess(t('更新成功'));
        const normalizedPref =
          res.data?.data?.billing_preference || pref || previousPref;
        setBillingPreference(normalizedPref);
      } else {
        showError(res.data?.message || t('更新失败'));
        setBillingPreference(previousPref);
      }
    } catch (e) {
      showError(t('请求失败'));
      setBillingPreference(previousPref);
    }
  };

  // 获取充值配置信息
  const getTopupInfo = async () => {
    try {
      const res = await API.get('/api/user/topup/info');
      const { message, data, success } = res.data;
      if (success) {
        setTopupInfo({
          amount_options: data.amount_options || [],
          discount: data.discount || {},
        });

        // 处理支付方式
        let payMethods = data.pay_methods || [];
        try {
          if (typeof payMethods === 'string') {
            payMethods = JSON.parse(payMethods);
          }
          if (payMethods && payMethods.length > 0) {
            // 检查name和type是否为空
            payMethods = payMethods.filter((method) => {
              return method.name && method.type;
            });
            // 如果没有color，则设置默认颜色
            payMethods = payMethods.map((method) => {
              // 规范化最小充值数
              const normalizedMinTopup = Number(method.min_topup);
              method.min_topup = Number.isFinite(normalizedMinTopup)
                ? normalizedMinTopup
                : 0;

              // Stripe 的最小充值从后端字段回填
              if (
                method.type === 'stripe' &&
                (!method.min_topup || method.min_topup <= 0)
              ) {
                const stripeMin = Number(data.stripe_min_topup);
                if (Number.isFinite(stripeMin)) {
                  method.min_topup = stripeMin;
                }
              }

              if (!method.color) {
                if (method.type === 'alipay') {
                  method.color = 'rgba(var(--semi-blue-5), 1)';
                } else if (method.type === 'wxpay') {
                  method.color = 'rgba(var(--semi-green-5), 1)';
                } else if (method.type === 'stripe') {
                  method.color = 'rgba(var(--semi-purple-5), 1)';
                } else {
                  method.color = 'rgba(var(--semi-primary-5), 1)';
                }
              }
              return method;
            });
          } else {
            payMethods = [];
          }

          // 如果启用了 Stripe 支付，添加到支付方法列表
          // 这个逻辑现在由后端处理，如果 Stripe 启用，后端会在 pay_methods 中包含它

          setPayMethods(payMethods);
          const enableStripeTopUp = data.enable_stripe_topup || false;
          const enableOnlineTopUp = data.enable_online_topup || false;
          const enableCreemTopUp = data.enable_creem_topup || false;
          const enableWaffoTopUp = data.enable_waffo_topup || false;
          const enableWaffoPancakeTopUp =
            data.enable_waffo_pancake_topup || false;
          const minTopUpValue = enableOnlineTopUp
            ? data.min_topup
            : enableStripeTopUp
              ? data.stripe_min_topup
              : enableWaffoTopUp
                ? data.waffo_min_topup
                : enableWaffoPancakeTopUp
                  ? data.waffo_pancake_min_topup
                  : 1;
          setEnableOnlineTopUp(enableOnlineTopUp);
          setEnableStripeTopUp(enableStripeTopUp);
          setEnableCreemTopUp(enableCreemTopUp);
          setEnableWaffoTopUp(enableWaffoTopUp);
          setWaffoPayMethods(data.waffo_pay_methods || []);
          setWaffoMinTopUp(data.waffo_min_topup || 1);
          setEnableWaffoPancakeTopUp(enableWaffoPancakeTopUp);
          setWaffoPancakeMinTopUp(data.waffo_pancake_min_topup || 1);
          setMinTopUp(minTopUpValue);
          setTopUpCount(minTopUpValue);

          // 设置 Creem 产品
          try {
            const products = JSON.parse(data.creem_products || '[]');
            setCreemProducts(products);
          } catch (e) {
            setCreemProducts([]);
          }

          // 如果没有自定义充值数量选项，根据最小充值金额生成预设充值额度选项
          if (topupInfo.amount_options.length === 0) {
            setPresetAmounts(generatePresetAmounts(minTopUpValue));
          }

          // 初始化显示实付金额
          getAmount(minTopUpValue);
        } catch (e) {
          setPayMethods([]);
        }

        // 如果有自定义充值数量选项，使用它们替换默认的预设选项
        if (data.amount_options && data.amount_options.length > 0) {
          const customPresets = data.amount_options.map((amount) => ({
            value: amount,
            discount: data.discount[amount] || 1.0,
          }));
          setPresetAmounts(customPresets);
        }
      } else {
        showError(data || t('获取充值配置失败'));
      }
    } catch (error) {
      showError(t('获取充值配置异常'));
    }
  };

  // 获取邀请链接
  const getAffLink = async () => {
    const res = await API.get('/api/user/aff');
    const { success, message, data } = res.data;
    if (success) {
      let link = `${window.location.origin}/register?aff=${data}`;
      setAffLink(link);
    } else {
      showError(message);
    }
  };

  // 划转邀请额度
  const transfer = async () => {
    if (transferAmount < getQuotaPerUnit()) {
      showError(t('划转金额最低为') + ' ' + renderQuota(getQuotaPerUnit()));
      return;
    }
    const res = await API.post(`/api/user/aff_transfer`, {
      quota: transferAmount,
    });
    const { success, message } = res.data;
    if (success) {
      showSuccess(message);
      setOpenTransfer(false);
      getUserQuota().then();
    } else {
      showError(message);
    }
  };

  // 复制邀请链接
  const handleAffLinkClick = async () => {
    await copy(affLink);
    showSuccess(t('邀请链接已复制到剪切板'));
  };

  // URL 参数自动打开账单弹窗（支付回跳时触发）
  useEffect(() => {
    if (searchParams.get('show_history') === 'true') {
      setOpenHistory(true);
      searchParams.delete('show_history');
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  useEffect(() => {
    // 始终获取最新用户数据，确保余额等统计信息准确
    getUserQuota().then();
    setTransferAmount(getQuotaPerUnit());
  }, []);

  useEffect(() => {
    if (affFetchedRef.current) return;
    affFetchedRef.current = true;
    getAffLink().then();
  }, []);

  // 在 statusState 可用时获取充值信息
  useEffect(() => {
    getTopupInfo().then();
    getSubscriptionPlans().then();
    getSubscriptionSelf().then();
  }, []);

  useEffect(() => {
    if (statusState?.status) {
      // const minTopUpValue = statusState.status.min_topup || 1;
      // setMinTopUp(minTopUpValue);
      // setTopUpCount(minTopUpValue);
      setTopUpLink(statusState.status.top_up_link || '');
      setPriceRatio(statusState.status.price || 1);

      setStatusLoading(false);
    }
  }, [statusState?.status]);

  const renderAmount = () => {
    return amount + ' ' + t('元');
  };

  const getAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    setAmountLoading(true);
    try {
      const res = await API.post('/api/user/amount', {
        amount: parseFloat(value),
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          setAmount(parseFloat(data));
        } else {
          setAmount(0);
          Toast.error({ content: '错误：' + data, id: 'getAmount' });
        }
      } else {
        showError(res);
      }
    } catch (err) {
      // amount fetch failed silently
    }
    setAmountLoading(false);
  };

  const getStripeAmount = async (value) => {
    if (value === undefined) {
      value = topUpCount;
    }
    setAmountLoading(true);
    try {
      const res = await API.post('/api/user/stripe/amount', {
        amount: parseFloat(value),
      });
      if (res !== undefined) {
        const { message, data } = res.data;
        if (message === 'success') {
          setAmount(parseFloat(data));
        } else {
          setAmount(0);
          Toast.error({ content: '错误：' + data, id: 'getAmount' });
        }
      } else {
        showError(res);
      }
    } catch (err) {
      // amount fetch failed silently
    } finally {
      setAmountLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleTransferCancel = () => {
    setOpenTransfer(false);
  };

  const handleOpenHistory = () => {
    setOpenHistory(true);
  };

  const handleHistoryCancel = () => {
    setOpenHistory(false);
  };

  const handleCreemCancel = () => {
    setCreemOpen(false);
    setSelectedCreemProduct(null);
  };

  // 选择预设充值额度
  const selectPresetAmount = (preset) => {
    setTopUpCount(preset.value);
    setSelectedPreset(preset.value);

    // 计算实际支付金额，考虑折扣
    const discount = preset.discount || topupInfo.discount[preset.value] || 1.0;
    const discountedAmount = preset.value * priceRatio * discount;
    setAmount(discountedAmount);
  };

  // 格式化大数字显示
  const formatLargeNumber = (num) => {
    return num.toString();
  };

  // 根据最小充值金额生成预设充值额度选项
  const generatePresetAmounts = (minAmount) => {
    const multipliers = [1, 5, 10, 30, 50, 100, 300, 500];
    return multipliers.map((multiplier) => ({
      value: minAmount * multiplier,
    }));
  };

  const heroSignals = [
    {
      label: t('当前余额'),
      value: renderQuota(userState?.user?.quota || 0),
    },
    {
      label: t('充值数量'),
      value: renderQuotaWithAmount(minTopUp),
    },
    {
      label: t('订阅套餐'),
      value: subscriptionPlans.length || 0,
    },
  ];

  return (
    <ConsoleShell
      wide
      className='relative min-h-screen lg:min-h-0'
      contentClassName='mx-auto w-full max-w-[1360px]'
    >
      <style>{`${TOPUP_PAGE_STYLES}${TOPUP_PANEL_STYLES}${TOPUP_ADMIN_OVERRIDES}`}</style>
      {/* 划转模态框 */}
      <TransferModal
        t={t}
        openTransfer={openTransfer}
        transfer={transfer}
        handleTransferCancel={handleTransferCancel}
        userState={userState}
        renderQuota={renderQuota}
        getQuotaPerUnit={getQuotaPerUnit}
        transferAmount={transferAmount}
        setTransferAmount={setTransferAmount}
      />

      {/* 充值确认模态框 */}
      <PaymentConfirmModal
        t={t}
        open={open}
        onlineTopUp={onlineTopUp}
        handleCancel={handleCancel}
        confirmLoading={confirmLoading}
        topUpCount={topUpCount}
        renderQuotaWithAmount={renderQuotaWithAmount}
        amountLoading={amountLoading}
        renderAmount={renderAmount}
        payWay={payWay}
        payMethods={confirmPayMethods}
        amountNumber={amount}
        discountRate={topupInfo?.discount?.[topUpCount] || 1.0}
      />

      {/* 充值账单模态框 */}
      <TopupHistoryModal
        visible={openHistory}
        onCancel={handleHistoryCancel}
        t={t}
      />

      {/* Creem 充值确认模态框 */}
      <Modal
        title={t('确定要充值 $')}
        visible={creemOpen}
        onOk={onlineCreemTopUp}
        onCancel={handleCreemCancel}
        maskClosable={false}
        size='small'
        centered
        confirmLoading={confirmLoading}
      >
        {selectedCreemProduct && (
          <>
            <p>
              {t('产品名称')}：{selectedCreemProduct.name}
            </p>
            <p>
              {t('价格')}：{selectedCreemProduct.currency === 'EUR' ? '€' : '$'}
              {selectedCreemProduct.price}
            </p>
            <p>
              {t('充值额度')}：{selectedCreemProduct.quota}
            </p>
            <p>{t('是否确认充值？')}</p>
          </>
        )}
      </Modal>

      <div className='topup-page-shell'>
        <section className='topup-page-hero'>
          <div className='topup-page-hero-grid'>
            <div className='topup-page-hero-copy'>
              <span className='topup-page-kicker'>
                {t('个人中心')}
                <span className='topup-page-kicker-dot' />
                {t('钱包')}
              </span>
              <h1 className='topup-page-title'>{t('钱包管理')}</h1>
              <div className='topup-page-subtitle'>
                {t('多种充值方式，安全便捷')} · {t('订阅套餐')} ·{' '}
                {t('邀请奖励')}
              </div>
            </div>

            <div className='topup-page-signal-grid'>
              {heroSignals.map((item) => (
                <article key={item.label} className='topup-page-signal'>
                  <div className='topup-page-signal-label'>{item.label}</div>
                  <div className='topup-page-signal-value'>{item.value}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 主布局区域 */}
        <div className='topup-page-content grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.22fr)_minmax(360px,0.78fr)]'>
          <RechargeCard
            t={t}
            enableOnlineTopUp={enableOnlineTopUp}
            enableStripeTopUp={enableStripeTopUp}
            enableCreemTopUp={enableCreemTopUp}
            creemProducts={creemProducts}
            creemPreTopUp={creemPreTopUp}
            enableWaffoTopUp={enableWaffoTopUp}
            enableWaffoPancakeTopUp={enableWaffoPancakeTopUp}
            presetAmounts={presetAmounts}
            selectedPreset={selectedPreset}
            selectPresetAmount={selectPresetAmount}
            formatLargeNumber={formatLargeNumber}
            priceRatio={priceRatio}
            topUpCount={topUpCount}
            minTopUp={minTopUp}
            renderQuotaWithAmount={renderQuotaWithAmount}
            getAmount={getAmount}
            setTopUpCount={setTopUpCount}
            setSelectedPreset={setSelectedPreset}
            renderAmount={renderAmount}
            amountLoading={amountLoading}
            payMethods={confirmPayMethods}
            preTopUp={preTopUp}
            paymentLoading={paymentLoading}
            payWay={payWay}
            redemptionCode={redemptionCode}
            setRedemptionCode={setRedemptionCode}
            topUp={topUp}
            isSubmitting={isSubmitting}
            topUpLink={topUpLink}
            openTopUpLink={openTopUpLink}
            userState={userState}
            renderQuota={renderQuota}
            statusLoading={statusLoading}
            topupInfo={topupInfo}
            onOpenHistory={handleOpenHistory}
            subscriptionLoading={subscriptionLoading}
            subscriptionPlans={subscriptionPlans}
            billingPreference={billingPreference}
            onChangeBillingPreference={updateBillingPreference}
            activeSubscriptions={activeSubscriptions}
            allSubscriptions={allSubscriptions}
            reloadSubscriptionSelf={getSubscriptionSelf}
          />
          <InvitationCard
            t={t}
            userState={userState}
            renderQuota={renderQuota}
            setOpenTransfer={setOpenTransfer}
            affLink={affLink}
            handleAffLinkClick={handleAffLinkClick}
          />
        </div>
      </div>
    </ConsoleShell>
  );
};

export default TopUp;
