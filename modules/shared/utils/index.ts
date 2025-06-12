/**
 * 共用工具函數模組
 * 完整移轉自 assets/js/utils/common.js
 */

/**
 * 防抖函數
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 格式化數字 - 添加千分位分隔符
 */
export function formatNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0'
  }
  return num.toLocaleString()
}

/**
 * 安全獲取數字值
 */
export function safeNumber(
  value: string | number | null | undefined,
  defaultValue: number = 0,
): number {
  const num = parseFloat(String(value))
  return isNaN(num) ? defaultValue : num
}

/**
 * 驗證輸入值是否為有效數字
 */
export function isValidNumber(
  value: string | number | null | undefined,
  min: number | null = null,
  max: number | null = null,
): boolean {
  const num = parseFloat(String(value))
  if (isNaN(num)) return false
  if (min !== null && num < min) return false
  if (max !== null && num > max) return false
  return true
}

/**
 * 生成唯一 ID
 */
export function generateUniqueId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 深拷貝物件
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T
  }

  if (typeof obj === 'object') {
    const clonedObj: Record<string, unknown> = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone((obj as Record<string, unknown>)[key])
      }
    }
    return clonedObj as T
  }

  return obj
}

/**
 * 事件追蹤（整合 GA4）
 */
export function trackEvent(eventName: string, parameters: Record<string, unknown> = {}): void {
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).trackEvent) {
    ;(
      (window as unknown as Record<string, unknown>).trackEvent as (
        name: string,
        params: Record<string, unknown>,
      ) => void
    )(eventName, {
      event_category: parameters.category || 'User Interaction',
      event_label: parameters.label || '',
      value: parameters.value || 0,
      calculator_type: parameters.calculator_type || '',
      language: parameters.language || 'zh-TW',
      ...parameters,
    })
  } else {
    console.log('追蹤事件:', eventName, parameters)
  }
}

/**
 * 計算角色加成
 */
export function calculateCharacterBonus(statName: string, value: number): string {
  if (typeof value !== 'number' || value < 0) {
    return '無加成'
  }

  switch (statName) {
    case 'endurance':
      return `+${Math.floor(value / 5)} 物防`
    case 'loyalty':
      return `+${Math.floor(value / 5)} 命中`
    case 'speed':
      return `+${Math.floor(value / 10)} 迴避`
    case 'hp':
      return `+${value * 30} HP`
    case 'aggressiveness':
      return `+${Math.floor(value / 3)} 攻擊力`
    default:
      return ''
  }
}

/**
 * 等待元素載入完成
 */
export function waitForElement(selector: string, timeout: number = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector)
      if (element) {
        obs.disconnect()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Element ${selector} not found within ${timeout}ms`))
    }, timeout)
  })
}

/**
 * 驗證數字輸入框
 */
export interface ValidationResult {
  valid: boolean
  corrected: boolean
  value: number
}

export function validateNumberInput(
  input: HTMLInputElement,
  options: { max?: number; min?: number } = {},
): ValidationResult {
  const value = parseInt(input.value) || 0
  const max = options.max || parseInt(input.getAttribute('max') || '999')
  const min = options.min || parseInt(input.getAttribute('min') || '0')

  if (value < min) {
    input.value = min.toString()
    return { valid: false, corrected: true, value: min }
  }

  if (value > max) {
    input.value = max.toString()
    return { valid: false, corrected: true, value: max }
  }

  return { valid: true, corrected: false, value }
}

/**
 * 安全的元素查詢和更新
 */
export function safeUpdateElement(
  selector: string,
  content: string | number,
  attribute: string | null = null,
): void {
  const element = document.querySelector(selector)
  if (element) {
    if (attribute) {
      element.setAttribute(attribute, content.toString())
    } else {
      element.textContent = content.toString()
    }
  }
}

/**
 * 批量更新元素內容
 */
export function batchUpdateElements(updates: Record<string, string | number>): void {
  Object.entries(updates).forEach(([selector, content]) => {
    safeUpdateElement(selector, content)
  })
}

/**
 * 本地存儲工具
 */
export const storage = {
  /**
   * 儲存資料到 localStorage
   */
  set(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('無法儲存到 localStorage:', error)
    }
  },

  /**
   * 從 localStorage 讀取資料
   */
  get<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn('無法從 localStorage 讀取:', error)
      return defaultValue
    }
  },

  /**
   * 移除 localStorage 中的資料
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn('無法從 localStorage 移除:', error)
    }
  },

  /**
   * 清空 localStorage
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.warn('無法清空 localStorage:', error)
    }
  },
}

/**
 * 節流函數
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function executedFunction(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 檢查是否為移動設備
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 獲取 URL 參數
 */
export function getUrlParams(url: string = window.location.href): Record<string, string> {
  const params: Record<string, string> = {}
  const urlObj = new URL(url)
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value
  })
  return params
}
