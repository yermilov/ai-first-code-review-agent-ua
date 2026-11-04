import { createContext, ReactNode, useContext } from 'react';

/**
 * Runtime UA ↔ EN switch, ported from dou-days-2026 via pragmatic-vibe-clauding-en.
 *
 * Ukrainian is this deck's home language (the talk was given in Ukrainian at the
 * AI-First Meetup); English is the alternate. Switch with the `english` /
 * `ukrainian` commands or `?lang=en`.
 */
export type Lang = 'uk' | 'en';

export const LANG_STORAGE_KEY = 'deckLang';

export const LANG_URL_PARAM = 'lang';

/** Parse a command or URL value into a language; accepts the colloquial `ua`. */
export function parseLang(value: string | null | undefined): Lang | null {
  switch (value?.trim().toLowerCase()) {
    case 'en':
    case 'english':
      return 'en';
    case 'uk':
    case 'ua':
    case 'ukrainian':
      return 'uk';
    default:
      return null;
  }
}

/** `?lang=` in the URL wins over the stored preference, so links are shareable. */
export function getInitialLang(): Lang {
  const fromUrl = parseLang(new URLSearchParams(window.location.search).get(LANG_URL_PARAM));
  if (fromUrl) return fromUrl;
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) === 'en' ? 'en' : 'uk';
  } catch {
    return 'uk';
  }
}

export const LanguageContext = createContext<Lang>('uk');

export const useLang = () => useContext(LanguageContext);

/** Pick the value for the active language: `tr(lang, 'привіт', 'hello')`. */
export function tr<T>(lang: Lang, uk: T, en: T): T {
  return lang === 'uk' ? uk : en;
}

/** Inline bilingual text for static JSX; reads the language from context. */
export function T({ uk, en }: { uk: ReactNode; en: ReactNode }) {
  const lang = useLang();
  return <>{tr(lang, uk, en)}</>;
}
