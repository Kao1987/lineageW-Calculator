// Google Analytics 4 配置和追蹤工具

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[][]
    trackEvent: (eventName: string, parameters?: TrackEventParams) => void
  }
}

export interface TrackEventParams {
  category?: string
  label?: string
  value?: number
  calculator_type?: string
  language?: string
  pet_type?: string
  [key: string]: unknown
}

/**
 * 初始化 Google Analytics
 */
export function initializeGA() {
  // 載入 gtag script
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-6RPKQGPBG0'
  document.head.appendChild(script)

  // 初始化 dataLayer
  window.dataLayer = window.dataLayer || []

  // 定義 gtag 函數
  window.gtag = (...args: unknown[]) => {
    window.dataLayer.push(args)
  }

  window.gtag('js', new Date())

  // GA4 Enhanced Configuration
  window.gtag('config', 'G-6RPKQGPBG0', {
    // 增強測量
    enhanced_measurement: true,
    // 頁面標題追蹤
    page_title: 'LineageW 數據實驗室',
    // 自定義維度
    custom_map: {
      custom_parameter_1: 'calculator_type',
      custom_parameter_2: 'language',
      custom_parameter_3: 'pet_type',
    },
    // 隱私設置
    anonymize_ip: true,
    // 廣告功能
    allow_ad_personalization_signals: false,
    // Cookie 設置
    cookie_flags: 'SameSite=None;Secure',
  })
}

/**
 * 追蹤自定義事件
 */
export function trackEvent(eventName: string, parameters: TrackEventParams = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      event_category: parameters.category || 'User Interaction',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      calculator_type: parameters.calculator_type || '',
      language: parameters.language || 'zh-TW',
      pet_type: parameters.pet_type || '',
      ...parameters,
    })
  }
}

/**
 * 追蹤頁面瀏覽
 */
export function trackPageView(pageName: string, pageTitle?: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle || pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    })
  }
}

/**
 * 追蹤錯誤
 */
export function trackError(error: Error, context?: string) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'exception', {
      description: error.stack || error.message,
      fatal: false,
      event_category: 'JavaScript Error',
      event_label: context || 'unknown',
    })
  }
}

/**
 * 追蹤效能指標
 */
export function trackPerformance() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (perfData && typeof window.gtag === 'function') {
        window.gtag('event', 'timing_complete', {
          name: 'page_load_time',
          value: Math.round(perfData.loadEventEnd - perfData.fetchStart),
        })

        window.gtag('event', 'timing_complete', {
          name: 'dom_content_loaded',
          value: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
        })
      }
    }, 0)
  })
}

/**
 * 初始化全局錯誤追蹤
 */
export function initializeErrorTracking() {
  // JavaScript 錯誤追蹤
  window.addEventListener('error', (e) => {
    trackError(e.error || new Error(e.message), e.filename || 'unknown')
  })

  // Promise 錯誤追蹤
  window.addEventListener('unhandledrejection', (e) => {
    trackError(
      new Error(e.reason?.toString() || 'Promise rejection'),
      'unhandled_promise_rejection',
    )
  })
}

/**
 * 設置全局 trackEvent 函數
 */
export function setupGlobalTrackEvent() {
  window.trackEvent = trackEvent
}

/**
 * @param {string} from - 源路由
 * @param {string} to - 目標路由
 */
export const trackNavigation = (from: string, to: string, loadTime: number) => {
  if (!window.gtag) return

  window.gtag('event', 'navigation', {
    event_category: 'Navigation',
    event_label: `${from} -> ${to}`,
    value: loadTime,
    page_title: 'LineageW 數據實驗室',
    page_path: to,
  })
}
