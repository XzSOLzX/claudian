// @test-ci {"inputs":["src/i18n/locales/**/*.json"]}
import {
  getAvailableLocales,
  getLocaleDisplayName,
  setLocale,
  t,
} from '@/i18n/i18n';
import type { Locale, TranslationKey } from '@/i18n/types';

// English-only build: the other dictionaries stay in the repo but cannot be selected.
describe('i18n', () => {
  beforeEach(() => { setLocale('en'); });
  afterEach(() => { setLocale('en'); });

  it('offers only English', () => {
    expect(getAvailableLocales()).toEqual(['en']);
  });

  it('loads and selects the en dictionary', () => {
    expect(setLocale('en')).toBe(true);
    expect(t('common.delete')).toBe('Delete');
  });

  it.each<Locale>(['zh-CN', 'zh-TW', 'ja', 'ko', 'de', 'fr', 'es', 'ru', 'pt'])(
    'rejects the %s locale and keeps English',
    locale => {
      expect(setLocale(locale)).toBe(false);
      expect(t('common.delete')).toBe('Delete');
    },
  );

  it.each(['invalid', 'constructor', 'toString', '__proto__'])(
    'keeps the current dictionary when the invalid locale %s is requested',
    invalidLocale => {
      expect(setLocale(invalidLocale as Locale)).toBe(false);
      expect(t('common.save')).toBe('Save');
    },
  );

  it('interpolates numeric and string parameters', () => {
    expect(t('chat.rewind.notice', { count: 2 })).toBe('Rewound: 2 file(s) reverted');
    expect(t('chat.fork.failed', { error: 'Network timeout' })).toBe('Fork failed: Network timeout');
  });

  it('keeps placeholders whose parameters are missing', () => {
    expect(t('chat.rewind.notice', {})).toBe('Rewound: {count} file(s) reverted');
  });

  it('resolves nested keys', () => {
    expect(t('settings.userName.name')).toBe('What should Claudian call you?');
  });

  it('returns an unknown key', () => {
    expect(t('nonexistent.key.here' as TranslationKey)).toBe('nonexistent.key.here');
  });

  it('returns the key for a non-string dictionary entry', () => {
    expect(t('settings' as TranslationKey)).toBe('settings');
  });

  it.each<[string, string]>([
    ['de', 'Deutsch'],
    ['xx', 'xx'],
    ['constructor', 'constructor'],
    ['toString', 'toString'],
    ['__proto__', '__proto__'],
  ])('resolves the display name or falls back to the locale code for %s', (locale, expected) => {
    expect(getLocaleDisplayName(locale as Locale)).toBe(expected);
  });
});
