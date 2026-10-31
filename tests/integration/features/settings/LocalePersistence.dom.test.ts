/** @vitest-environment jsdom */
import '@/providers';

import { deserialize, serialize } from 'node:v8';

import { createFeatureHostFixture } from '@test/helpers/FeatureHostFixture';
import { createObsidianPlugin } from '@test/helpers/ObsidianSettingsHost';
import { within } from '@testing-library/dom';

import { ClaudianSettingTab } from '@/features/settings/ClaudianSettings';
import { setLocale, t } from '@/i18n/i18n';

afterEach(() => { setLocale('en'); document.body.replaceChildren(); });

// English-only build: the language and title-language pickers are not offered,
// and a stored non-English locale keeps the interface in English.
it.each(['en', 'ja', 'zh-CN'])('renders general settings in English without language pickers (stored locale %s)', async locale => {
  globalThis.structuredClone ??= value => deserialize(serialize(value));
  const { host } = await createFeatureHostFixture({
    settings: { locale, enableAutoTitleGeneration: true },
  });
  const tab = new ClaudianSettingTab(host.app, createObsidianPlugin(host.app), host);
  const container = document.body.createDiv();
  tab['renderGeneralTab'](container);
  setLocale(locale as never);

  // The surface rendered, and the query still addresses real controls.
  expect(within(container).getByRole('combobox', { name: t('settings.chatViewPlacement.name') })).toBeTruthy();
  expect(t('settings.chatViewPlacement.name')).toBe('Open Claudian in');
  expect(within(container).queryByRole('combobox', { name: t('settings.language.name') })).toBeNull();
  expect(within(container).queryByRole('combobox', { name: t('settings.titleLanguage.name') })).toBeNull();
});
