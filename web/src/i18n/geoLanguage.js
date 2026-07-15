import { normalizeLanguage } from './language';

export const GEO_LANGUAGE_COOKIE = 'navtoai_geo_language';

export const getGeoLockedLanguage = () => {
  if (typeof document === 'undefined') return '';

  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${GEO_LANGUAGE_COOKIE}=`));

  if (!cookie) return '';

  const language = decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1));
  return normalizeLanguage(language);
};
