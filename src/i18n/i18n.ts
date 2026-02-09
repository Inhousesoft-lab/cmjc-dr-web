import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import koTranslationJson from './locales/ko/translation.json'
import enTranslationJson from './locales/en/translation.json'

export const LOCALE_KEY : string = 'APP_LOCALE'
export type Locale = 'ko' | 'en'

const resources = {
  ko: {
    translation: koTranslationJson
  },
  en: {
    translation: enTranslationJson
  }
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'ko',
    supportedLngs: ['ko', 'en'],
    interpolation: { escapeValue: false },

    detection: {
      // ✅ 새로고침 유지: localStorage(APP_LOCALE) 우선
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: LOCALE_KEY,
      caches: ['localStorage'],
    },
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng.startsWith('en') ? 'en' : 'ko'
})

export default i18n;