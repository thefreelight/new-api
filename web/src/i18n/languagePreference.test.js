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

import { describe, expect, test } from 'bun:test';
import { resolveInitialLanguage } from './languagePreference';

describe('resolveInitialLanguage', () => {
  test('prefers an explicit user choice over IP and browser languages', () => {
    expect(
      resolveInitialLanguage({
        storedLanguage: 'ja',
        geoLanguage: 'en',
        browserLanguages: ['ko-KR'],
      }),
    ).toBe('ja');
  });

  test('uses the IP suggestion when no user choice exists', () => {
    expect(
      resolveInitialLanguage({
        storedLanguage: '',
        geoLanguage: 'ko',
        browserLanguages: ['ja-JP'],
      }),
    ).toBe('ko');
  });

  test('uses the first supported browser language without an IP suggestion', () => {
    expect(
      resolveInitialLanguage({
        storedLanguage: '',
        geoLanguage: '',
        browserLanguages: ['de-DE', 'ja-JP'],
      }),
    ).toBe('ja');
  });

  test('falls back to English when no supported language is available', () => {
    expect(
      resolveInitialLanguage({
        storedLanguage: '',
        geoLanguage: '',
        browserLanguages: ['de-DE'],
      }),
    ).toBe('en');
  });
});
