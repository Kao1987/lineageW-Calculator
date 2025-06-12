import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 主題狀態
  const isDarkTheme = ref(false)

  // 載入狀態
  const isLoading = ref(false)

  // 通知訊息
  const notifications = ref<
    Array<{
      id: string
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
      duration?: number
    }>
  >([])

  // 切換主題
  function toggleTheme() {
    isDarkTheme.value = !isDarkTheme.value
    // 持久化儲存
    localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light')
    // 應用主題到根元素
    applyThemeToDOM()
  }

  // 初始化主題
  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDarkTheme.value = savedTheme === 'dark'
    } else {
      // 預設使用系統偏好
      isDarkTheme.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    // 應用主題到根元素
    applyThemeToDOM()
  }

  // 應用主題到DOM
  function applyThemeToDOM() {
    const root = document.documentElement
    if (isDarkTheme.value) {
      root.classList.add('dark-theme')
    } else {
      root.classList.remove('dark-theme')
    }
  }

  // 設定載入狀態
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  // 顯示通知
  function showNotification(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 3000,
  ) {
    const id = Date.now().toString()
    notifications.value.push({ id, type, message, duration })

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  // 移除通知
  function removeNotification(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    // 狀態
    isDarkTheme,
    isLoading,
    notifications,

    // 方法
    toggleTheme,
    initTheme,
    setLoading,
    showNotification,
    removeNotification,
  }
})
