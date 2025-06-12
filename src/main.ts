/**
 * OrionLabs 轉職計算器
 * Copyright (c) 2025 Orion
 *
 * 本代碼受版權保護，未經授權不得用於商業用途
 * This code is protected by copyright, unauthorized commercial use is prohibited
 *
 * GitHub: https://github.com/kao1987/OrionLabs
 * Website: https://orionlabs.pro
 */

// 版權聲明 Console 輸出
console.log('%c🔒 OrionLabs 轉職計算器 🔒', 'color: #007bff; font-size: 20px; font-weight: bold;')
console.log('%cCopyright (c) 2025 Orion', 'color: #6c757d; font-size: 14px;')
console.log(
  '%c⚠️ 本代碼受版權保護，未經授權禁止使用',
  'color: #dc3545; font-size: 12px; font-weight: bold;',
)
console.log('%c🌐 Website: https://orionlabs.pro', 'color: #28a745; font-size: 12px;')
console.log('%c🔗 GitHub: https://github.com/kao1987/OrionLabs', 'color: #6f42c1; font-size: 12px;')

// 反除錯機制
if (import.meta.env.PROD) {
  // 禁用右鍵
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    console.warn('⚠️ 右鍵功能已被禁用 - OrionLabs 版權保護')
  })

  // 禁用F12、Ctrl+Shift+I等開發者工具快捷鍵
  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'C') ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault()
      console.warn('🚫 開發者工具已被禁用 - OrionLabs 版權保護')
    }
  })

  // 檢測開發者工具
  setInterval(() => {
    const threshold = 160
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      console.clear()
      console.log('%c🚫 請勿嘗試查看源代碼', 'color: #dc3545; font-size: 16px; font-weight: bold;')
      console.log('%c本工具受版權保護 - OrionLabs', 'color: #6c757d; font-size: 14px;')
    }
  }, 1000)
}

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './locales'
import { setPageMeta, defaultMeta } from '../modules/shared/utils/seo'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

// 設置預設 Meta 標籤
setPageMeta(defaultMeta)

// 錯誤處理
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err, info)
  // 整合錯誤追蹤
  import('../modules/shared/utils/analytics').then(({ trackError }) => {
    trackError(err as Error, info)
  })
}

app.mount('#app')
