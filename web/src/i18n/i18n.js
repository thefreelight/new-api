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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import zhCNTranslation from './locales/zh-CN.json';
import zhTWTranslation from './locales/zh-TW.json';
import ruTranslation from './locales/ru.json';
import jaTranslation from './locales/ja.json';
import koTranslation from './locales/ko.json';
import viTranslation from './locales/vi.json';
import { supportedLanguages } from './language';
import { getGeoLockedLanguage } from './geoLanguage';
import { withMarketingTranslations } from './marketingTranslations';

const geoLockedLanguage = getGeoLockedLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    load: 'currentOnly',
    supportedLngs: supportedLanguages,
    resources: {
      en: withMarketingTranslations(enTranslation, 'en'),
      'zh-CN': zhCNTranslation,
      'zh-TW': zhTWTranslation,
      fr: frTranslation,
      ru: ruTranslation,
      ja: withMarketingTranslations(jaTranslation, 'ja'),
      ko: withMarketingTranslations(koTranslation, 'ko'),
      vi: viTranslation,
    },
    lng: geoLockedLanguage || undefined,
    fallbackLng: {
      ko: ['en'],
      default: ['zh-CN'],
    },
    nsSeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

if (geoLockedLanguage) {
  const changeLanguage = i18n.changeLanguage.bind(i18n);
  i18n.changeLanguage = () => changeLanguage(geoLockedLanguage);
  i18n.geoLockedLanguage = geoLockedLanguage;
}

window.__i18n = i18n;

export default i18n;
