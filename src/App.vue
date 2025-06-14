<!--
/**
 * OrionLabs 轉職計算器
 * Copyright (c) 2025 Orion
 *
 * 本代碼受版權保護，未經授權不得用於商業用途
 * This code is protected by copyright, unauthorized commercial use is prohibited
 *
 * GitHub: https://github.com/kao1987/OrionLabs
 * Website: https://orionlabs.pro
 */
-->

<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <AppHeader />

    <main class="main-container">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- 全局模態視窗 -->
    <AppModal />

    <AppFooter />

    <!-- 手機版底部導航 -->
    <AppNavigation />
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '../modules/shared/stores/app'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'
import AppFooter from '../modules/shared/components/AppFooter.vue'
import AppHeader from '../modules/shared/components/AppHeader.vue'
import AppNavigation from '../modules/shared/components/AppNavigation.vue'
import AppModal from '../modules/shared/components/AppModal.vue'
import {
  initializeGA,
  initializeErrorTracking,
  trackPerformance,
  setupGlobalTrackEvent,
} from '../modules/shared/utils/analytics'
import { setFavicon } from '../modules/shared/utils/seo'
import { useModal, defaultModals } from '../modules/shared/composables/useModal'

const appStore = useAppStore()
const { isDarkTheme } = storeToRefs(appStore)
const { initTheme } = appStore

const { registerModal, handleEscape } = useModal()

onMounted(() => {
  // 初始化主題
  initTheme()

  // 初始化 Google Analytics
  initializeGA()

  // 初始化錯誤追蹤
  initializeErrorTracking()

  // 追蹤效能指標
  trackPerformance()

  // 設置全局 trackEvent 函數
  setupGlobalTrackEvent()

  // 設置 Favicon
  setFavicon()

  // 註冊預設模態視窗
  defaultModals.forEach(registerModal)

  // 添加鍵盤事件監聽
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  // 清理事件監聽
  document.removeEventListener('keydown', handleEscape)
})
</script>
<style scoped>
/* 需要修改 */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 100vw; /* 防止超出視窗寬度 */
  overflow-x: hidden; /* 進一步保險 */
}

.main-container {
  flex: 1;
  min-height: calc(100vh - 200px);
  padding: var(--spacing-lg) 0;
}

/* 大螢幕優化 */
@media (min-width: 1200px) {
  .main-container {
    padding: var(--spacing-xl) 0;
  }
}

/* 頁面過渡動畫 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 手機版底部間距 */
@media (max-width: 768px) {
  .main-container {
    padding-bottom: 80px; /* 為底部導航留空間 */
  }
}
</style>
