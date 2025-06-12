<template>
  <nav class="mobile-nav">
    <router-link to="/" class="nav-item" exact>
      <div class="nav-icon">🏠</div>
      <span class="nav-label">{{ t('nav.home', '首頁') }}</span>
    </router-link>

    <router-link to="/pet-evaluate" class="nav-item">
      <div class="nav-icon">🐾</div>
      <span class="nav-label">{{ t('nav.petEvaluate', '寵物評估') }}</span>
    </router-link>

    <router-link to="/job-change" class="nav-item">
      <div class="nav-icon">💎</div>
      <span class="nav-label">{{ t('nav.jobChangeCalculator', '轉職計算') }}</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border-primary);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-xs);
  z-index: 100;
  backdrop-filter: blur(10px);
  min-height: 70px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-muted);
  transition: all var(--transition-base);
  flex: 1;
  min-width: 0;
  max-width: 120px;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: var(--color-text-accent);
  background: color-mix(in hsl, var(--color-text-accent) 10%, transparent);
}

.nav-icon {
  font-size: var(--font-size-lg);
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  width: 100%;
  word-break: keep-all;
  overflow-wrap: normal;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 只在小螢幕顯示 */
@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}

/* 小螢幕優化 */
@media (max-width: 480px) {
  .mobile-nav {
    padding: 6px 4px;
    min-height: 65px;
  }

  .nav-item {
    padding: 6px 2px;
    max-width: 110px;
  }

  .nav-label {
    font-size: 0.6rem;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .nav-icon {
    font-size: 1.1rem;
  }
}

/* 為內容區域添加底部間距 */
@media (max-width: 768px) {
  :global(body) {
    padding-bottom: 80px;
  }
}
</style>
