import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGlobalNotifications } from './useNotifications'
import { trackEvent, debounce, throttle } from '../utils'

// 應用狀態介面
export interface AppState {
  isLoading: boolean
  isInitialized: boolean
  currentPage: string
  language: string
  theme: 'light' | 'dark' | 'auto'
  isMobile: boolean
  isOnline: boolean
  lastActivity: number
  debugMode: boolean
}

// 效能監控介面
export interface PerformanceMetrics {
  initTime: number
  pageLoadTime: number
  memoryUsage?: number
  errors: number
}

/**
 * 應用管理組合式函數
 * 完整移轉自 assets/js/app.js 的應用程式初始化和管理邏輯
 */
export function useAppManage() {
  const router = useRouter()
  const route = useRoute()
  const notifications = useGlobalNotifications()

  // 應用狀態
  const appState = ref<AppState>({
    isLoading: true,
    isInitialized: false,
    currentPage: '',
    language: 'zh-TW',
    theme: 'auto',
    isMobile: false,
    isOnline: navigator.onLine || true,
    lastActivity: Date.now(),
    debugMode: typeof window !== 'undefined' && location.hostname === 'localhost'
  })

  // 效能指標
  const performanceMetrics = ref<PerformanceMetrics>({
    initTime: 0,
    pageLoadTime: 0,
    errors: 0
  })

  // 事件監聽器清理函數
  const cleanupFunctions = ref<Array<() => void>>([])

  // 計算屬性
  const isReady = computed(() => appState.value.isInitialized && !appState.value.isLoading)
  const isDarkMode = computed(() => 
    appState.value.theme === 'dark' || 
    (appState.value.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  /**
   * 初始化應用程式
   */
  async function initializeApp(): Promise<void> {
    const startTime = performance.now()
    
    try {
      console.log('🚀 開始初始化應用程式...')
      appState.value.isLoading = true

      // 檢測裝置類型
      detectDeviceType()

      // 初始化主題
      await initializeTheme()

      // 初始化語言
      await initializeLanguage()

      // 設置事件監聽器
      setupEventListeners()

      // 設置錯誤處理
      setupErrorHandling()

      // 設置效能監控
      setupPerformanceMonitoring()

      // 載入使用者設定
      await loadUserSettings()

      // 初始化完成
      appState.value.isInitialized = true
      appState.value.isLoading = false
      
      const endTime = performance.now()
      performanceMetrics.value.initTime = endTime - startTime

      console.log(`✅ 應用程式初始化完成，耗時: ${performanceMetrics.value.initTime.toFixed(2)}ms`)

      // 追蹤初始化事件
      trackEvent('app_initialized', {
        category: 'App Lifecycle',
        label: 'success',
        value: Math.round(performanceMetrics.value.initTime),
        language: appState.value.language,
        theme: appState.value.theme,
        is_mobile: appState.value.isMobile
      })

      // 顯示歡迎通知
      if (!localStorage.getItem('welcome_shown')) {
        setTimeout(() => {
          notifications.showSuccess('歡迎使用天堂W計算器', {
            duration: 5000,
            position: 'top-center'
          })
          localStorage.setItem('welcome_shown', 'true')
        }, 1000)
      }

    } catch (error) {
      console.error('❌ 應用程式初始化失敗:', error)
      appState.value.isLoading = false
      performanceMetrics.value.errors++
      
      notifications.showError('應用程式初始化失敗', {
        duration: 0 // 不自動關閉
      })

      trackEvent('app_initialization_error', {
        category: 'Error',
        label: error instanceof Error ? error.message : 'unknown',
        error_type: 'initialization',
        error_message: error instanceof Error ? error.message : String(error)
      })
    }
  }

  /**
   * 檢測裝置類型
   */
  function detectDeviceType(): void {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                     window.innerWidth <= 768

    appState.value.isMobile = isMobile
    
    // 設置 CSS 變數
    document.documentElement.classList.toggle('mobile', isMobile)
    document.documentElement.classList.toggle('desktop', !isMobile)
  }

  /**
   * 初始化主題
   */
  async function initializeTheme(): Promise<void> {
    const savedTheme = localStorage.getItem('app_theme') as AppState['theme'] || 'auto'
    appState.value.theme = savedTheme
    applyTheme(savedTheme)
  }

  /**
   * 應用主題
   */
  function applyTheme(theme: AppState['theme']): void {
    const html = document.documentElement
    html.classList.remove('light', 'dark')

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      html.classList.add(prefersDark ? 'dark' : 'light')
    } else {
      html.classList.add(theme)
    }

    // 更新 meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode.value ? '#1f2937' : '#ffffff')
    }
  }

  /**
   * 切換主題
   */
  function toggleTheme(): void {
    const themes: AppState['theme'][] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(appState.value.theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    
    setTheme(nextTheme)
  }

  /**
   * 設置主題
   */
  function setTheme(theme: AppState['theme']): void {
    appState.value.theme = theme
    localStorage.setItem('app_theme', theme)
    applyTheme(theme)

    trackEvent('theme_changed', {
      category: 'User Preference',
      label: theme,
      theme: theme
    })
  }

  /**
   * 初始化語言
   */
  async function initializeLanguage(): Promise<void> {
    const savedLanguage = localStorage.getItem('app_language') || 'zh-TW'
    appState.value.language = savedLanguage
  }

  /**
   * 設置事件監聽器
   */
  function setupEventListeners(): void {
    // 視窗大小變化
    const handleResize = debounce(() => {
      detectDeviceType()
      updateViewportHeight()
    }, 250)

    window.addEventListener('resize', handleResize)
    cleanupFunctions.value.push(() => window.removeEventListener('resize', handleResize))

    // 網路連線狀態
    const handleOnline = () => {
      appState.value.isOnline = true
      notifications.showSuccess('網路連線已恢復', { duration: 3000 })
    }

    const handleOffline = () => {
      appState.value.isOnline = false
      notifications.showWarning('網路連線中斷', { duration: 0 })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    cleanupFunctions.value.push(() => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    })

    // 使用者活動追蹤
    const updateActivity = throttle(() => {
      appState.value.lastActivity = Date.now()
    }, 30000) // 每30秒更新一次

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, true)
      cleanupFunctions.value.push(() => 
        document.removeEventListener(event, updateActivity, true)
      )
    })

    // 主題媒體查詢變化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (appState.value.theme === 'auto') {
        applyTheme('auto')
      }
    }

    mediaQuery.addEventListener('change', handleThemeChange)
    cleanupFunctions.value.push(() => mediaQuery.removeEventListener('change', handleThemeChange))

    // 鍵盤快捷鍵
    const handleKeydown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K 開啟搜尋
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // TODO: 開啟搜尋功能
      }

      // Esc 關閉模態框
      if (e.key === 'Escape') {
        // TODO: 關閉模態框
      }
    }

    document.addEventListener('keydown', handleKeydown)
    cleanupFunctions.value.push(() => document.removeEventListener('keydown', handleKeydown))
  }

  /**
   * 設置錯誤處理
   */
  function setupErrorHandling(): void {
    // 全域錯誤處理
    const handleError = (event: ErrorEvent) => {
      console.error('全域錯誤:', event.error)
      performanceMetrics.value.errors++

      trackEvent('javascript_error', {
        category: 'Error',
        label: event.error?.name || 'unknown',
        error_type: 'javascript',
        error_message: event.message,
        error_filename: event.filename,
        error_line: event.lineno
      })

      if (appState.value.debugMode) {
        notifications.showError(`錯誤: ${event.message}`, { duration: 0 })
      }
    }

    // Promise 錯誤處理
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('未處理的 Promise 拒絕:', event.reason)
      performanceMetrics.value.errors++

      trackEvent('promise_rejection', {
        category: 'Error',
        label: 'unhandled_promise_rejection',
        error_type: 'promise',
        error_message: String(event.reason)
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    cleanupFunctions.value.push(() => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    })
  }

  /**
   * 設置效能監控
   */
  function setupPerformanceMonitoring(): void {
    // 監控記憶體使用（如果支援）
    if ('memory' in performance) {
      const updateMemoryUsage = () => {
        const memory = (performance as any).memory
        performanceMetrics.value.memoryUsage = memory.usedJSHeapSize
      }

      const memoryInterval = setInterval(updateMemoryUsage, 30000)
      cleanupFunctions.value.push(() => clearInterval(memoryInterval))
    }

    // 監控頁面載入時間
    if ('navigation' in performance) {
      nextTick(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        performanceMetrics.value.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart
      })
    }
  }

  /**
   * 載入使用者設定
   */
  async function loadUserSettings(): Promise<void> {
    try {
      const settings = localStorage.getItem('app_settings')
      if (settings) {
        const parsed = JSON.parse(settings)
        // 套用使用者設定
        if (parsed.theme) setTheme(parsed.theme)
        if (parsed.language) appState.value.language = parsed.language
      }
    } catch (error) {
      console.warn('載入使用者設定失敗:', error)
    }
  }

  /**
   * 儲存使用者設定
   */
  function saveUserSettings(): void {
    const settings = {
      theme: appState.value.theme,
      language: appState.value.language,
      lastVisit: Date.now()
    }

    localStorage.setItem('app_settings', JSON.stringify(settings))
  }

  /**
   * 更新視窗高度 CSS 變數
   */
  function updateViewportHeight(): void {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }

  /**
   * 重新載入應用程式
   */
  function reloadApp(): void {
    trackEvent('app_reload', {
      category: 'App Lifecycle',
      label: 'manual_reload'
    })
    
    window.location.reload()
  }

  /**
   * 清理資源
   */
  function cleanup(): void {
    // 儲存設定
    saveUserSettings()

    // 清理事件監聽器
    cleanupFunctions.value.forEach(cleanup => cleanup())
    cleanupFunctions.value.length = 0

    // 清理通知
    notifications.cleanup()

    console.log('🧹 應用程式資源清理完成')
  }

  /**
   * 監聽路由變化並更新狀態
   */
  function setupRouterWatcher(): void {
    router.afterEach((to) => {
      appState.value.currentPage = to.name as string || 'unknown'
      
      // 更新頁面標題
      nextTick(() => {
        const title = to.meta?.title || 'app.title'
        document.title = `${title} - 天堂W 綜合計算器`
      })
    })
  }

  // Vue 生命週期鉤子
  onMounted(() => {
    initializeApp()
    setupRouterWatcher()
    updateViewportHeight()
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    // 狀態
    appState: computed(() => appState.value),
    performanceMetrics: computed(() => performanceMetrics.value),
    isReady,
    isDarkMode,

    // 方法
    initializeApp,
    setTheme,
    toggleTheme,
    reloadApp,
    saveUserSettings,
    cleanup,

    // 工具方法
    detectDeviceType,
    updateViewportHeight
  }
}

/**
 * 全域應用管理實例（單例）
 */
let globalAppManager: ReturnType<typeof useAppManage> | null = null

export function useGlobalAppManage() {
  if (!globalAppManager) {
    globalAppManager = useAppManage()
  }
  return globalAppManager
}
