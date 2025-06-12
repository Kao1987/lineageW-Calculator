/**
 * 共用工具函數模組
 * 移轉自 assets/js/utils/common.js
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
