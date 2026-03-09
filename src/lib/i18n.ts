export type AppLanguage = 'en' | 'pt-br'
export type SanityLocale = 'en' | 'ptBr'

export const DEFAULT_LANGUAGE: AppLanguage = 'en'

const languageToSanityLocale: Record<AppLanguage, SanityLocale> = {
  en: 'en',
  'pt-br': 'ptBr',
}

export const getSanityLocale = (language: AppLanguage): SanityLocale =>
  languageToSanityLocale[language]
