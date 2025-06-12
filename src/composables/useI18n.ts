import { computed, ref } from 'vue'
import { useI18n as useVueI18n } from 'vue-i18n'

// I18N 介面定義
export interface I18nService {
  currentLanguage: string
  availableLanguages: Array<{
    code: string
    name: string
    nativeName: string
  }>
  isInitialized: boolean
  translations: Record<string, any>
  t: (key: string, params?: Record<string, any>) => string
  changeLanguage: (language: string) => Promise<boolean>
  getCurrentLanguage: () => string
  getSupportedLanguages: () => Array<{
    code: string
    name: string
    nativeName: string
  }>
  loadLanguage: (language: string) => Promise<boolean>
  init: () => Promise<void>
  updatePageContent: () => void
}

/**
 * 擴展的 I18N Composable
 * 整合原 assets/js/modules/i18n.js 的完整功能
 */
export function useI18n(): I18nService {
  const { t, locale, messages } = useVueI18n()
  const isInitialized = ref(false)
  const translations = ref<Record<string, any>>({})

  const availableLanguages = [
    { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ]

  const currentLanguage = computed({
    get: () => locale.value,
    set: (value: string) => {
      locale.value = value
    },
  })

  // 儲存語言選擇到 localStorage
  const setStoredLanguage = (language: string) => {
    localStorage.setItem('lineage-w-calculator-language', language)
  }

  // 獲取儲存的語言
  const getStoredLanguage = (): string | null => {
    return localStorage.getItem('lineage-w-calculator-language')
  }

  // 偵測使用者語言
  const detectLanguage = (): string => {
    const browserLang = navigator.language || (navigator as any).userLanguage
    const supportedLanguages = ['zh-TW', 'en', 'ko']

    // 檢查完全匹配
    if (supportedLanguages.includes(browserLang)) {
      return browserLang
    }

    // 檢查語言代碼匹配
    const langCode = browserLang.split('-')[0]
    const languageMap: Record<string, string> = {
      zh: 'zh-TW',
      en: 'en',
      ko: 'ko',
    }

    return languageMap[langCode] || 'zh-TW'
  }

  // 載入語言檔案（動態載入）
  const loadLanguage = async (language: string): Promise<boolean> => {
    try {
      // 檢查是否已經載入
      const currentMessages = messages.value[language]
      if (currentMessages) {
        translations.value[language] = currentMessages
        return true
      }

      // 動態載入獨立的翻譯檔案
      let loadedTranslations
      switch (language) {
        case 'zh-TW':
          loadedTranslations = (await import('../locales/zh-TW')).default
          break
        case 'en':
          loadedTranslations = (await import('../locales/en')).default
          break
        case 'ko':
          loadedTranslations = (await import('../locales/ko')).default
          break
        default:
          console.warn(`Unsupported language: ${language}`)
          return false
      }

      if (loadedTranslations) {
        // 設置到 vue-i18n
        messages.value[language] = loadedTranslations as any
        translations.value[language] = loadedTranslations
        return true
      }

      console.warn(`Language ${language} not found`)
      return false
    } catch (error) {
      console.warn(`Failed to load language: ${language}`, error)
      return false
    }
  }

  // 載入所有支援的語言
  const loadAllLanguages = async (): Promise<void> => {
    const loadPromises = availableLanguages.map((lang) => loadLanguage(lang.code))
    await Promise.all(loadPromises)
  }

  // 切換語言
  const changeLanguage = async (language: string): Promise<boolean> => {
    try {
      if (!availableLanguages.find((lang) => lang.code === language)) {
        console.warn(`Unsupported language: ${language}`)
        return false
      }

      // 確保語言已載入
      await loadLanguage(language)

      currentLanguage.value = language
      setStoredLanguage(language)

      // 更新頁面內容
      updatePageContent()

      // 觸發語言變更事件
      document.dispatchEvent(
        new CustomEvent('languageChanged', {
          detail: { language },
        }),
      )

      return true
    } catch (error) {
      console.error('切換語言失敗:', error)
      return false
    }
  }

  // 更新頁面內容（相容原有的 DOM 操作）
  const updatePageContent = (): void => {
    // 更新所有帶有 data-i18n 屬性的元素
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n')
      if (key) {
        const translation = t(key)

        if (element.tagName === 'INPUT' && (element as HTMLInputElement).type !== 'button') {
          ;(element as HTMLInputElement).placeholder = translation
        } else {
          // 檢查元素是否有子節點需要保留
          const childElements = element.querySelectorAll('*')
          if (childElements.length === 0) {
            // 沒有子元素，直接設置文字內容
            element.textContent = translation
          } else {
            // 有子元素，只更新直接的文字節點
            updateTextNodeOnly(element, translation)
          }
        }
      }
    })

    // 更新帶有 data-i18n-html 屬性的元素 (允許 HTML)
    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
      const key = element.getAttribute('data-i18n-html')
      if (key) {
        element.innerHTML = t(key)
      }
    })

    // 更新帶有 data-i18n-attr 屬性的元素
    document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
      const attrData = element.getAttribute('data-i18n-attr')
      if (attrData) {
        const [attr, key] = attrData.split(':')
        element.setAttribute(attr, t(key))
      }
    })
  }

  // 只更新文字節點，保留子元素
  const updateTextNodeOnly = (element: Element, translation: string): void => {
    // 找到第一個文字節點並更新
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
        node.textContent = translation
        return
      }
    }

    // 如果沒有找到文字節點，在開頭插入一個
    const textNode = document.createTextNode(translation)
    element.insertBefore(textNode, element.firstChild)
  }

  // 初始化語言設定
  const initLanguage = (): void => {
    const storedLang = getStoredLanguage()
    const detectedLang = detectLanguage()
    const initialLang = storedLang || detectedLang

    if (initialLang !== currentLanguage.value) {
      changeLanguage(initialLang)
    }
  }

  // 初始化 I18N 系統
  const init = async (): Promise<void> => {
    try {
      // 載入所有語言檔案
      await loadAllLanguages()

      // 初始化語言設定
      initLanguage()

      // 更新頁面內容
      updatePageContent()

      isInitialized.value = true
      console.log('國際化系統初始化完成，當前語言:', currentLanguage.value)
    } catch (error) {
      console.error('國際化系統初始化失敗:', error)
      throw error
    }
  }

  // 獲取當前語言
  const getCurrentLanguage = (): string => {
    return currentLanguage.value
  }

  // 獲取支援的語言列表
  const getSupportedLanguages = () => {
    return availableLanguages
  }

  // 自動初始化（如果尚未初始化）
  if (!isInitialized.value) {
    init()
  }

  return {
    currentLanguage: currentLanguage.value,
    availableLanguages,
    isInitialized: isInitialized.value,
    translations: translations.value,
    t: (key: string, params = {}) => t(key, params),
    changeLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    loadLanguage,
    init,
    updatePageContent,
  }
}
