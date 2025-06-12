// 共用的基礎類型
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface User {
  id: string
  username: string
  email: string
  preferences: UserPreferences
}

export interface UserPreferences {
  language: string
  theme: 'light' | 'dark'
  notifications: boolean
}

// 共用的 UI 類型
export interface NotificationOptions {
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  duration?: number
}

// 新增：模態視窗相關型別
export interface ModalOptions {
  id: string
  title: string
  content?: string
  type?: 'help' | 'info' | 'custom'
  closable?: boolean
  size?: 'small' | 'medium' | 'large'
}

// 新增：路由 Meta 型別
export interface RouteMetaData {
  title: string
  requiresAuth?: boolean
  keepAlive?: boolean
  showInNav?: boolean
  icon?: string
  level?: number
}
