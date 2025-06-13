<template>
  <div class="language-switcher">
    <select
      id="language-select"
      v-model="currentLanguage"
      class="language-select"
      @change="handleLanguageChange"
      :aria-label="t('common.language')"
    >
      <option v-for="lang in availableLanguages" :key="lang.code" :value="lang.code">
        {{ lang.nativeName }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { availableLocales } from '../../../src/locales'

const { t, locale } = useI18n()

const availableLanguages = availableLocales

const currentLanguage = computed({
  get: () => locale.value,
  set: (value: string) => {
    locale.value = value
  },
})

// 語言偵測函數
function detectBrowserLanguage(): string {
  const browserLang =
    navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'zh-TW'

  // 檢查完全匹配
  if (availableLanguages.find((lang) => lang.code === browserLang)) {
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

// 儲存語言選擇
function saveLanguagePreference(language: string) {
  localStorage.setItem('lineage-w-language', language)
}

// 獲取儲存的語言
function getSavedLanguage(): string | null {
  return localStorage.getItem('lineage-w-language')
}

// 語言變更處理
function handleLanguageChange() {
  saveLanguagePreference(currentLanguage.value)
  updatePageMeta(t)
  console.log('Language changed to:', currentLanguage.value)
}

// 更新頁面 meta 資訊
function updatePageMeta(translator: (key: string) => string) {
  document.documentElement.lang = currentLanguage.value

  // 更新頁面標題
  const titleKey = getCurrentPageTitleKey()
  if (titleKey) {
    document.title = translator(titleKey)
  }
}

// 獲取當前頁面的標題鍵
function getCurrentPageTitleKey(): string | null {
  const path = window.location.pathname
  const titleMap: Record<string, string> = {
    '/': 'title.main',
    '/pet-evaluate': 'nav.petEvaluate',
    '/job-change': 'nav.jobChangeCalculator',
  }

  return titleMap[path] || null
}

// 初始化語言
function initializeLanguage() {
  const savedLanguage = getSavedLanguage()
  const detectedLanguage = detectBrowserLanguage()
  const initialLanguage = savedLanguage || detectedLanguage

  if (initialLanguage !== currentLanguage.value) {
    currentLanguage.value = initialLanguage
    saveLanguagePreference(initialLanguage)
  }

  updatePageMeta(t)
}

onMounted(() => {
  initializeLanguage()
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  align-items: center;
  height: 36px; /* 與主題按鈕同高 */
}

.language-select {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-base);
  outline: none;
  min-width: 120px;
  height: 36px; /* 固定高度確保對齊 */
  display: flex;
  align-items: center;
}

.language-select:hover {
  border-color: var(--color-text-accent);
  background: var(--color-text-accent);
  color: white;
  transform: scale(1.05);
}

.language-select:focus {
  border-color: var(--color-text-accent);
  background: var(--color-text-accent);
  color: white;
  box-shadow: 0 0 10px rgba(97, 218, 251, 0.4);
}

.language-select option {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-xs);
}

/* 確保下拉選項在hover狀態下正常顯示 */
.language-select:hover option,
.language-select:focus option {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .language-select {
    min-width: 100px;
    font-size: var(--font-size-xs);
    padding: 6px 8px;
  }
}
</style>
