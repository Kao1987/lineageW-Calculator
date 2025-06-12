import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import type { ApiResponse } from '@/types'

// 建立 axios 實例
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 可以在這裡添加認證 token
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// 回應攔截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  (error: AxiosError): Promise<never> => {
    // 統一錯誤處理
    console.error('API Error:', error)

    // 您可以在這裡根據 error.response.status 做不同的處理
    // 例如：
    // if (error.response?.status === 401) {
    //   // 重新導向到登入頁
    // }

    return Promise.reject(error)
  },
)

export { apiClient }
export type { ApiResponse }
