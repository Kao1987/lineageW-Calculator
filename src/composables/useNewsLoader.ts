import { ref, reactive } from 'vue'

// News 資料介面
export interface NewsItem {
  date: string
  title: string | Record<string, string>
  content: string | Record<string, string>
  type?: 'update' | 'feature' | 'fix' | 'announcement'
  featured?: boolean
}

export interface NewsLoaderService {
  newsData: NewsItem[]
  isLoading: boolean
  lastUpdated: Date | null
  init: () => Promise<void>
  reload: () => Promise<void>
  getNewsData: () => NewsItem[]
  getLastUpdated: () => Date | null
}

// Google Sheets Service 介面
interface GoogleSheetsService {
  getNewsData: () => Promise<NewsItem[]>
}

declare global {
  interface Window {
    googleSheetsService?: GoogleSheetsService
  }
}

// 新聞載入器 Composable
export function useNewsLoader(): NewsLoaderService {
  const newsData = ref<NewsItem[]>([])
  const isLoading = ref(false)
  const lastUpdated = ref<Date | null>(null)
  const retryCount = ref(0)
  const maxRetries = 3

  // 追蹤事件函數（簡化版）
  const trackEvent = (eventName: string, params: Record<string, any>) => {
    console.log(`Event: ${eventName}`, params)
    // 可以在這裡整合實際的分析工具
  }

  // 延遲函數
  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 獲取備用新聞數據
  const getFallbackData = (): NewsItem[] => {
    return [
      {
        date: '2025/01/21',
        title: '系統維護通知',
        content: '系統將進行例行維護，期間可能影響服務使用。',
        type: 'announcement'
      },
      {
        date: '2025/01/20',
        title: '計算器功能優化',
        content: '優化了轉職計算器的計算邏輯和使用者介面。',
        type: 'update'
      },
      {
        date: '2025/01/15',
        title: '新增多語言支援',
        content: '新增韓文和英文介面，提供更好的國際化體驗。',
        type: 'feature'
      }
    ]
  }

  // 從本地 JSON 文件載入新聞
  const loadFromJSON = async (): Promise<NewsItem[]> => {
    try {
      const response = await fetch('./assets/data/news.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const loadedNews = data.news || []
      newsData.value = loadedNews
      lastUpdated.value = new Date()
      
      console.log(`成功從 JSON 載入 ${loadedNews.length} 則新聞`)
      return loadedNews
      
    } catch (error) {
      console.error('從 JSON 載入新聞失敗:', error)
      
      // 使用備用數據
      const fallbackNews = getFallbackData()
      newsData.value = fallbackNews
      lastUpdated.value = new Date()
      
      trackEvent('news_fallback', {
        category: 'Data Loading',
        label: 'json_failed',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      
      return fallbackNews
    }
  }

  // 載入新聞數據
  const loadNews = async (): Promise<NewsItem[]> => {
    if (isLoading.value) {
      return newsData.value
    }

    isLoading.value = true

    try {
      // 優先嘗試從 Google Sheets 載入
      if (window.googleSheetsService) {
        console.log('正在從 Google Sheets 載入新聞...')
        const loadedNews = await window.googleSheetsService.getNewsData()
        newsData.value = loadedNews
        lastUpdated.value = new Date()
        
        trackEvent('news_source', {
          category: 'Data Loading',
          label: 'google_sheets',
          value: loadedNews.length
        })
        
        console.log(`成功從 Google Sheets 載入 ${loadedNews.length} 則新聞`)
      } else {
        // 備援：從本地 JSON 文件載入
        console.log('Google Sheets 服務不可用，從本地 JSON 載入新聞...')
        await loadFromJSON()
        
        trackEvent('news_source', {
          category: 'Data Loading',
          label: 'local_json',
          value: newsData.value.length
        })
      }

      retryCount.value = 0
      return newsData.value

    } catch (error) {
      console.error('新聞載入失敗:', error)
      
      // 如果 Google Sheets 失敗，嘗試載入本地 JSON
      if (window.googleSheetsService && retryCount.value < maxRetries) {
        console.log('嘗試備援載入方式...')
        retryCount.value++
        
        // 增加重試延遲機制
        await delay(1000 * retryCount.value)
        return await loadFromJSON()
      }
      
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 初始化新聞載入器
  const init = async (): Promise<void> => {
    try {
      await loadNews()
      
      // 追蹤新聞載入成功
      trackEvent('news_loaded', {
        category: 'Data Loading',
        label: 'success',
        value: newsData.value.length
      })
      
    } catch (error) {
      console.error('新聞載入器初始化失敗:', error)
      
      // 追蹤新聞載入失敗
      trackEvent('news_load_failed', {
        category: 'Data Loading',
        label: 'initialization_error',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // 重新載入新聞
  const reload = async (): Promise<void> => {
    try {
      retryCount.value = 0
      await loadNews()
      
      trackEvent('news_reloaded', {
        category: 'User Interaction',
        label: 'manual_reload',
        value: newsData.value.length
      })
      
    } catch (error) {
      console.error('重新載入新聞失敗:', error)
    }
  }

  // 獲取新聞數據
  const getNewsData = (): NewsItem[] => {
    return newsData.value
  }

  // 獲取最後更新時間
  const getLastUpdated = (): Date | null => {
    return lastUpdated.value
  }

  return {
    newsData: newsData.value,
    isLoading: isLoading.value,
    lastUpdated: lastUpdated.value,
    init,
    reload,
    getNewsData,
    getLastUpdated
  }
}
