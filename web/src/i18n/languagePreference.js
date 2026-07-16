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

import { normalizeLanguage, supportedLanguages } from './language';
import { getGeoSuggestedLanguage } from './geoLanguage';

export const LANGUAGE_PREFERENCE_KEY = 'navtoai_language_preference';

const getSupportedLanguage = (language) => {
  const normalized = normalizeLanguage(language);
  return supportedLanguages.includes(normalized) ? normalized : '';
};

export const resolveInitialLanguage = ({
  storedLanguage,
  geoLanguage,
  browserLanguages = [],
}) => {
  const stored = getSupportedLanguage(storedLanguage);
  if (stored) return stored;

  const geo = getSupportedLanguage(geoLanguage);
  if (geo) return geo;

  for (const browserLanguage of browserLanguages) {
    const browser = getSupportedLanguage(browserLanguage);
    if (browser) return browser;
  }

  return 'en';
};

export const getStoredLanguagePreference = () => {
  if (typeof localStorage === 'undefined') return '';
  return getSupportedLanguage(localStorage.getItem(LANGUAGE_PREFERENCE_KEY));
};

export const saveLanguagePreference = (language) => {
  const normalized = getSupportedLanguage(language);
  if (!normalized || typeof localStorage === 'undefined') return '';

  localStorage.setItem(LANGUAGE_PREFERENCE_KEY, normalized);
  localStorage.setItem('i18nextLng', normalized);
  return normalized;
};

export const getInitialLanguage = () =>
  resolveInitialLanguage({
    storedLanguage: getStoredLanguagePreference(),
    geoLanguage: getGeoSuggestedLanguage(),
    browserLanguages:
      typeof navigator === 'undefined'
        ? []
        : navigator.languages || [navigator.language],
  });
