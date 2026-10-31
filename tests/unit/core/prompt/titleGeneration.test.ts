import {
buildTitleGenerationSystemPrompt,
resolveTitleGenerationLocale
} from '@/core/prompt/titleGeneration';

// English-only build: any stored non-English locale resolves to English.
describe('titleGeneration', () => {

  it('uses the i18n default language when no locale is provided', () => {
    expect(buildTitleGenerationSystemPrompt()).toContain('Write the title in English');
  });

  it('writes English titles even when a non-English locale was stored', () => {
    expect(buildTitleGenerationSystemPrompt('ja')).toContain('Write the title in English');
  });

  it('falls back to the i18n default language for an invalid stored locale', () => {
    expect(buildTitleGenerationSystemPrompt('invalid-locale')).toContain(
      'Write the title in English',
    );
  });

  it('resolves a stored non-English interface locale to English', () => {
    expect(resolveTitleGenerationLocale({
      locale: 'ja',
      titleGenerationLocale: '',
    })).toBe('en');
  });

  it('resolves a stored non-English title locale to English', () => {
    expect(resolveTitleGenerationLocale({
      locale: 'en',
      titleGenerationLocale: 'ja',
    })).toBe('en');
  });

  it('uses the i18n default when both stored locales are invalid', () => {
    expect(resolveTitleGenerationLocale({
      locale: 'invalid-interface-locale',
      titleGenerationLocale: 'invalid-title-locale',
    })).toBe('en');
  });
});
