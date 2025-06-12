import type { ApiResponse } from '../types'

export interface ErrorInfo {
  message: string
  code?: string | number
  stack?: string
  timestamp: Date
}

export class AppError extends Error {
  public code?: string | number
  public timestamp: Date

  constructor(message: string, code?: string | number) {
    super(message)
    this.code = code
    this.timestamp = new Date()
    this.name = 'AppError'
  }
}

// 定義 API 錯誤類型
export interface ApiError {
  message: string
  code?: string | number
  status?: number
  response?: {
    data?: unknown
    status: number
    statusText: string
  }
}

// 類型安全的錯誤處理
export function handleApiError(error: Error | ApiError | unknown): ApiResponse<null> {
  let errorInfo: ErrorInfo

  if (error instanceof AppError) {
    errorInfo = {
      message: error.message,
      code: error.code,
      stack: error.stack,
      timestamp: error.timestamp,
    }
  } else if (error instanceof Error) {
    errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
    }
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    const apiError = error as ApiError
    errorInfo = {
      message: apiError.message || '未知 API 錯誤',
      code: apiError.code || apiError.status,
      timestamp: new Date(),
    }
  } else {
    errorInfo = {
      message: '未知錯誤',
      timestamp: new Date(),
    }
  }

  // 記錄錯誤
  console.error('API Error:', errorInfo)

  return {
    success: false,
    data: null,
    error: errorInfo.message,
  }
}

export function logError(error: Error | AppError | unknown, context?: string): void {
  const errorLog: Record<string, unknown> = {
    context,
    timestamp: new Date(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Server',
  }

  if (error instanceof Error) {
    errorLog.message = error.message
    errorLog.stack = error.stack
    errorLog.name = error.name
  } else {
    errorLog.message = String(error)
  }

  // 可以發送到錯誤追蹤服務
  console.error('Application Error:', errorLog)

  // 在生產環境中發送到錯誤追蹤服務
  if (import.meta.env.MODE === 'production') {
    // 例如：Sentry.captureException(error)
  }
}

// 錯誤邊界輔助函數
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => R,
  errorHandler?: (error: unknown) => R,
): (...args: T) => R {
  return (...args: T): R => {
    try {
      return fn(...args)
    } catch (error) {
      if (errorHandler) {
        return errorHandler(error)
      }
      logError(error, `Function: ${fn.name}`)
      throw error
    }
  }
}

// 異步錯誤處理
export async function withAsyncErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler?: (error: unknown) => Promise<R>,
): Promise<(...args: T) => Promise<R>> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      if (errorHandler) {
        return await errorHandler(error)
      }
      logError(error, `Async Function: ${fn.name}`)
      throw error
    }
  }
}
