import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'
import { trackEvent } from '../../modules/shared/utils/analytics'
import { useI18n } from 'vue-i18n'
import { nextTick } from 'vue'

// 路由配置介面
export interface RouterMeta {
  title: string
  requiresAuth?: boolean
  keepAlive?: boolean
  showInNav?: boolean
  icon?: string
  level?: number
}

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    requiresAuth?: boolean
    keepAlive?: boolean
    showInNav?: boolean
    icon?: string
    level?: number
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: {
      title: 'nav.home',
      showInNav: true,
      icon: '🏠',
      level: 1,
    },
  },
  {
    path: '/pet-evaluate',
    name: 'PetEvaluate',
    component: () => import('@/views/PetEvaluatePage.vue'),
    meta: {
      title: 'nav.petEvaluate',
      showInNav: true,
      icon: '🐾',
      level: 1,
      keepAlive: true,
    },
  },
  {
    path: '/job-change',
    name: 'JobChange',
    component: () => import('@/views/JobChangePage.vue'),
    meta: {
      title: 'nav.jobChangeCalculator',
      showInNav: true,
      icon: '💎',
      level: 1,
      keepAlive: true,
    },
  },
  {
    path: '/job-change/simple',
    name: 'JobChangeSimple',
    component: () => import('@/views/JobChangePage.vue'),
    meta: {
      title: 'jobChange.simpleCalculator',
      showInNav: false,
      level: 2,
    },
  },
  {
    path: '/job-change/detailed',
    name: 'JobChangeDetailed',
    component: () => import('@/views/JobChangePage.vue'),
    meta: {
      title: 'jobChange.detailedCalculator',
      showInNav: false,
      level: 2,
    },
  },
  // 重定向路由
  {
    path: '/pet',
    redirect: '/pet-evaluate',
  },
  {
    path: '/job',
    redirect: '/job-change',
  },
  // 404 頁面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundPage.vue'),
    meta: {
      title: 'error.notFound',
      showInNav: false,
    },
  },
]

// 只在開發模式下加入管理頁面路由
if (import.meta.env.DEV) {
  routes.push({
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminPage.vue'),
    meta: {
      title: '公告管理',
      showInNav: false,
    },
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 保存的滾動位置
    if (savedPosition) {
      return savedPosition
    }

    // 有hash錨點則滾動到錨點
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    // 預設滾動到頂部
    return { top: 0, behavior: 'smooth' }
  },
})

// 需要修改
interface ExtendedRouter {
  _startTime?: number
  _pageStartTime?: number
}

const extendedRouter = router as ExtendedRouter

// 路由前置守衛
router.beforeEach(async (to, from, next) => {
  const startTime = Date.now()
  extendedRouter._startTime = startTime

  try {
    if (to.meta.requiresAuth) {
      console.log('檢查權限:', to.name)
    }

    nextTick(() => {
      updatePageTitle(to.meta.title)
    })

    next()
  } catch (error) {
    console.error('路由導航錯誤:', error)
    next({ name: 'NotFound' })
  }
})

// 路由後置守衛
router.afterEach((to, from) => {
  const endTime = Date.now()
  const loadTime = endTime - (extendedRouter._startTime || 0)

  trackEvent('page_view', {
    category: 'Navigation',
    label: to.name as string,
    page_path: to.path,
    page_title: to.meta.title,
    from_page: from.name as string,
    load_time: loadTime,
  })

  if (from.name && extendedRouter._pageStartTime) {
    const stayTime = endTime - extendedRouter._pageStartTime
    trackEvent('page_stay_time', {
      category: 'User Engagement',
      label: from.name as string,
      value: stayTime,
      page_path: from.path,
    })
  }

  extendedRouter._pageStartTime = endTime
})

// 移除未使用的參數
router.onError((routerError: Error) => {
  console.error('路由錯誤:', routerError)

  trackEvent('router_error', {
    category: 'Error',
    label: routerError.message,
    error_type: 'router_navigation',
    error_message: routerError.message,
  })
})

/**
 * 更新頁面標題
 */
function updatePageTitle(titleKey: string): void {
  try {
    const { t } = useI18n()
    const baseTitle = t('title.main') // 使用 i18n 的主標題
    const pageTitle = t(titleKey)
    document.title = `${pageTitle} - ${baseTitle}`
  } catch (error) {
    console.warn('無法更新頁面標題:', error)
    document.title = 'LineageW 數據實驗室' // 備用標題也統一
  }
}

/**
 * 獲取導航路由列表
 */
export function getNavigationRoutes(): RouteRecordRaw[] {
  return routes.filter((route) => route.meta?.showInNav && route.meta?.level === 1)
}

/**
 * 路由工具函數
 */
export const routerUtils = {
  // 獲取當前路由的麵包屑
  getBreadcrumbs(
    currentRoute: RouteLocationNormalized,
  ): Array<{ name: string; path: string; title: string }> {
    const breadcrumbs: Array<{ name: string; path: string; title: string }> = []

    // 根據路由層級建立麵包屑
    if (currentRoute.meta?.level && currentRoute.meta.level > 1) {
      // 找到父級路由
      const parentRoute = routes.find(
        (route) => currentRoute.path.startsWith(route.path) && route.meta?.level === 1,
      )

      if (parentRoute && parentRoute.name) {
        breadcrumbs.push({
          name: parentRoute.name.toString(),
          path: parentRoute.path,
          title: parentRoute.meta?.title || '',
        })
      }
    }

    // 當前路由
    if (currentRoute.name) {
      breadcrumbs.push({
        name: currentRoute.name.toString(),
        path: currentRoute.path,
        title: currentRoute.meta?.title || '',
      })
    }

    return breadcrumbs
  },

  // 檢查路由是否激活
  isRouteActive(routeName: string, currentRoute: RouteLocationNormalized): boolean {
    return currentRoute.name === routeName
  },

  // 獲取頁面標題
  getPageTitle(route: RouteLocationNormalized): string {
    return route.meta?.title || 'Unknown Page'
  },
}

export default router
