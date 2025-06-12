/**
 * 通知系統組合式函數
 * 完整移轉自 assets/js/utils/notification.js
 */
import { ref, computed, nextTick } from 'vue'
import { trackEvent, generateUniqueId } from '../utils'

// 通知類型
export type NotificationType = 'info' | 'warning' | 'error' | 'success'

// 通知位置
export type NotificationPosition = 
  | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' 
  | 'top-center' | 'bottom-center'

// 通知選項介面
export interface NotificationOptions {
  duration?: number
  closable?: boolean
  position?: NotificationPosition
  trackEvent?: boolean
  className?: string
  onClick?: (notification: NotificationItem) => void
  onClose?: (notification: NotificationItem) => void
}

// 通知項目介面
export interface NotificationItem {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration: number
  closable: boolean
  position: NotificationPosition
  className?: string
  timestamp: number
  isVisible: boolean
  onClick?: (notification: NotificationItem) => void
  onClose?: (notification: NotificationItem) => void
}

/**
 * 通知系統組合式函數
 */
export function useNotifications() {
  // 響應式狀態
  const notifications = ref<Map<string, NotificationItem>>(new Map())
  const timers = ref<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // 計算屬性
  const visibleNotifications = computed(() => 
    Array.from(notifications.value.values()).filter(n => n.isVisible)
  )

  const notificationsByPosition = computed(() => {
    const grouped: Record<NotificationPosition, NotificationItem[]> = {
      'top-right': [],
      'top-left': [],
      'bottom-right': [],
      'bottom-left': [],
      'top-center': [],
      'bottom-center': []
    }

    visibleNotifications.value.forEach(notification => {
      grouped[notification.position].push(notification)
    })

    // 按時間戳排序
    Object.keys(grouped).forEach(position => {
      grouped[position as NotificationPosition].sort((a, b) => b.timestamp - a.timestamp)
    })

    return grouped
  })

  const hasNotifications = computed(() => notifications.value.size > 0)

  /**
   * 顯示通知
   */
  function showNotification(
    message: string, 
    type: NotificationType = 'warning', 
    options: NotificationOptions = {}
  ): string {
    const {
      duration = getDefaultDuration(type),
      closable = true,
      position = 'top-right',
      trackEvent: shouldTrack = true,
      className = '',
      onClick = undefined,
      onClose = undefined
    } = options

    const id = generateUniqueId('notification')
    const timestamp = Date.now()

    const notification: NotificationItem = {
      id,
      type,
      message,
      duration,
      closable,
      position,
      className,
      timestamp,
      isVisible: true,
      onClick,
      onClose
    }

    // 添加到通知列表
    notifications.value.set(id, notification)

    // 設置自動關閉
    if (duration > 0) {
      const timer = setTimeout(() => {
        hideNotification(id)
      }, duration)
      
      timers.value.set(id, timer)
    }

    // 事件追蹤
    if (shouldTrack) {
      trackEvent('notification_shown', {
        category: 'User Interface',
        label: type,
        notification_type: type,
        message_length: message.length,
        position: position
      })
    }

    return id
  }

  /**
   * 隱藏通知
   */
  function hideNotification(id: string): void {
    const notification = notifications.value.get(id)
    if (!notification) return

    // 設置為不可見
    notification.isVisible = false

    // 清除計時器
    const timer = timers.value.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.value.delete(id)
    }

    // 執行關閉回調
    if (notification.onClose) {
      notification.onClose(notification)
    }

    // 延遲移除（給動畫時間）
    setTimeout(() => {
      notifications.value.delete(id)
    }, 300)

    // 事件追蹤
    trackEvent('notification_closed', {
      category: 'User Interface',
      label: 'manual_close',
      notification_type: notification.type
    })
  }

  /**
   * 關閉所有通知
   */
  function hideAllNotifications(): void {
    const currentIds = Array.from(notifications.value.keys())
    currentIds.forEach(id => hideNotification(id))
  }

  /**
   * 通知點擊處理
   */
  function handleNotificationClick(id: string): void {
    const notification = notifications.value.get(id)
    if (!notification) return

    if (notification.onClick) {
      notification.onClick(notification)
    }

    trackEvent('notification_clicked', {
      category: 'User Interface',
      label: notification.type,
      notification_type: notification.type
    })
  }

  /**
   * 便捷方法：顯示成功通知
   */
  function showSuccess(message: string, options: NotificationOptions = {}): string {
    return showNotification(message, 'success', options)
  }

  /**
   * 便捷方法：顯示警告通知
   */
  function showWarning(message: string, options: NotificationOptions = {}): string {
    return showNotification(message, 'warning', options)
  }

  /**
   * 便捷方法：顯示錯誤通知
   */
  function showError(message: string, options: NotificationOptions = {}): string {
    return showNotification(message, 'error', {
      duration: 6000, // 錯誤訊息顯示更長時間
      ...options
    })
  }

  /**
   * 便捷方法：顯示資訊通知
   */
  function showInfo(message: string, options: NotificationOptions = {}): string {
    return showNotification(message, 'info', options)
  }

  /**
   * 更新通知內容
   */
  function updateNotification(id: string, updates: Partial<NotificationItem>): void {
    const notification = notifications.value.get(id)
    if (!notification) return

    Object.assign(notification, updates)
  }

  /**
   * 獲取通知詳情
   */
  function getNotification(id: string): NotificationItem | undefined {
    return notifications.value.get(id)
  }

  /**
   * 檢查通知是否存在
   */
  function hasNotification(id: string): boolean {
    return notifications.value.has(id)
  }

  /**
   * 獲取指定類型的通知數量
   */
  function getNotificationCount(type?: NotificationType): number {
    if (!type) return notifications.value.size

    return Array.from(notifications.value.values())
      .filter(n => n.type === type && n.isVisible).length
  }

  /**
   * 清理所有資源
   */
  function cleanup(): void {
    // 清除所有計時器
    timers.value.forEach(timer => clearTimeout(timer))
    timers.value.clear()

    // 清除所有通知
    notifications.value.clear()
  }

  return {
    // 狀態
    notifications: computed(() => notifications.value),
    visibleNotifications,
    notificationsByPosition,
    hasNotifications,

    // 方法
    showNotification,
    hideNotification,
    hideAllNotifications,
    handleNotificationClick,
    
    // 便捷方法
    showSuccess,
    showWarning,
    showError,
    showInfo,
    
    // 工具方法
    updateNotification,
    getNotification,
    hasNotification,
    getNotificationCount,
    cleanup
  }
}

/**
 * 獲取預設持續時間
 */
function getDefaultDuration(type: NotificationType): number {
  const durations: Record<NotificationType, number> = {
    success: 3000,
    info: 4000,
    warning: 4000,
    error: 6000
  }
  return durations[type] || 4000
}

/**
 * 獲取通知圖標
 */
export function getNotificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    success: '✅'
  }
  return icons[type] || icons.info
}

/**
 * 獲取通知顏色
 */
export function getNotificationColor(type: NotificationType): string {
  const colors: Record<NotificationType, string> = {
    info: '#3b82f6',
    warning: '#f59e0b',
    error: '#ef4444',
    success: '#10b981'
  }
  return colors[type] || colors.info
}

/**
 * 全域通知系統實例（單例）
 */
let globalNotifications: ReturnType<typeof useNotifications> | null = null

export function useGlobalNotifications() {
  if (!globalNotifications) {
    globalNotifications = useNotifications()
  }
  return globalNotifications
} 