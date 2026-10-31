/**
 * i18n Constants and Utilities
 *
 * Centralized constants for language management and UI display
 */

import type { Locale } from './types';

/**
 * Supported locales with metadata
 */
export interface LocaleInfo {
  code: Locale;
  name: string;           // Native name
  englishName: string;    // English name
  flag?: string;          // Optional flag emoji
}

/**
 * All supported locales with display information
 */
// English-only build: other locales are intentionally not listed.
export const SUPPORTED_LOCALES: LocaleInfo[] = [
  { code: 'en', name: 'English', englishName: 'English', flag: '🇺🇸' },
];

/**
 * Default locale
 */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Get locale info by code
 */
export function getLocaleInfo(code: string): LocaleInfo | undefined {
  return SUPPORTED_LOCALES.find(locale => locale.code === code);
}
