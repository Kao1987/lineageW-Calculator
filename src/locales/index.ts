import { createI18n } from 'vue-i18n'
import zhTW from './zh-TW'
import en from './en'
import ko from './ko'

// 使用 any 來避免 Vue i18n 的嚴格型別檢查
const messages: any = {
  'zh-TW': zhTW,
  'en': en,
  'ko': ko
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages
})

import type { LanguageOption } from './types'

export const availableLocales: LanguageOption[] = [
  { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ko', name: '한국어', nativeName: '한국어' }
]

// 導出型別定義
export * from './types'
