export type AppLanguage = 'en' | 'pt-br'
export type SanityLocale = 'en' | 'ptBr'

export const DEFAULT_LANGUAGE: AppLanguage = 'en'

// Stored values come from older builds or manual edits, e.g. "pt-BR".
export const parseAppLanguage = (value: string | null): AppLanguage | null => {
  const normalized = value?.trim().toLowerCase()
  return normalized === 'en' || normalized === 'pt-br' ? normalized : null
}

const languageToSanityLocale: Record<AppLanguage, SanityLocale> = {
  en: 'en',
  'pt-br': 'ptBr',
}

export const getSanityLocale = (language: AppLanguage): SanityLocale =>
  languageToSanityLocale[language]
