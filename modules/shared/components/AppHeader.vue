<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <router-link to="/" class="logo-link">
          <div class="logo-content">
            <span class="logo-icon">⚔️</span>
            <div class="logo-text">
              <h1 class="app-title">LineageW</h1>
              <span class="app-subtitle">數據實驗室</span>
            </div>
          </div>
        </router-link>
      </div>

      <nav class="main-nav">
        <router-link to="/pet-evaluate" class="nav-link">
          <span class="nav-icon">🐾</span>
          {{ t('nav.petEvaluate', '寵物評估') }}
        </router-link>
        <router-link to="/job-change" class="nav-link">
          <span class="nav-icon">💎</span>
          {{ t('nav.jobChangeCalculator', '轉職計算') }}
        </router-link>
      </nav>

      <div class="header-actions">
        <LanguageSwitcher />
        <button
          class="theme-toggle-btn"
          @click="toggleTheme"
          :aria-label="t('common.toggleTheme', '切換主題')"
        >
          {{ isDarkTheme ? '🌞' : '🌙' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../stores/app'
import { storeToRefs } from 'pinia'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const appStore = useAppStore()
const { isDarkTheme } = storeToRefs(appStore)
const { toggleTheme } = appStore
</script>

<style scoped>
.app-header {
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border-primary);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
}

.logo-link {
  text-decoration: none;
}

.logo-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  font-size: 1.8rem;
  animation: logoFloat 3s ease-in-out infinite;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.app-title {
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
}

.app-subtitle {
  background: linear-gradient(45deg, #ffc801, #ffeb3b, #ffc801, #ff9800);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: var(--font-size-sm);
  font-weight: 600;
  animation: goldenShimmer 3s ease-in-out infinite;
  position: relative;
  display: inline-block;
}

.main-nav {
  display: flex;
  gap: var(--spacing-lg);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 500;
  transition: all var(--transition-base);
  position: relative;
  border: 2px solid transparent;
  background: var(--color-bg-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-link:hover {
  color: var(--color-text-accent);
  background: color-mix(in hsl, var(--color-text-accent) 10%, transparent);
  border-color: var(--color-text-accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(97, 218, 251, 0.2);
}

.nav-link.router-link-active {
  color: var(--color-text-accent);
  background: color-mix(in hsl, var(--color-text-accent) 15%, transparent);
  border-color: var(--color-text-accent);
  box-shadow: 0 4px 12px rgba(97, 218, 251, 0.3);
}

.nav-icon {
  font-size: var(--font-size-base);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  height: 40px; /* 統一高度確保對齊 */
  justify-content: flex-end;
}

.theme-toggle-btn {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--color-text-primary);
  height: 36px; /* 與語言選擇器同高 */
  min-width: 44px; /* 確保按鈕有足夠寬度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle-btn:hover {
  background: var(--color-text-accent);
  transform: scale(1.05);
  border-color: var(--color-text-accent);
  color: white;
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-2px) rotate(5deg);
  }
}

@keyframes goldenShimmer {
  0% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 8px rgba(255, 200, 1, 0.6))
      drop-shadow(0 0 15px rgba(255, 235, 59, 0.4));
  }
  25% {
    background-position: 50% 50%;
    filter: drop-shadow(0 0 12px rgba(255, 200, 1, 0.8))
      drop-shadow(0 0 20px rgba(255, 235, 59, 0.6));
  }
  50% {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 15px rgba(255, 200, 1, 1)) drop-shadow(0 0 25px rgba(255, 235, 59, 0.8));
  }
  75% {
    background-position: 50% 50%;
    filter: drop-shadow(0 0 12px rgba(255, 200, 1, 0.8))
      drop-shadow(0 0 20px rgba(255, 235, 59, 0.6));
  }
  100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 8px rgba(255, 200, 1, 0.6))
      drop-shadow(0 0 15px rgba(255, 235, 59, 0.4));
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-nav {
    display: none;
  }

  .header-container {
    padding: 0 var(--spacing-md);
    gap: var(--spacing-md);
  }

  .logo-content {
    gap: var(--spacing-xs);
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .app-title {
    font-size: var(--font-size-lg);
  }

  .header-actions {
    gap: var(--spacing-sm);
  }

  .theme-toggle-btn {
    padding: var(--spacing-xs);
    font-size: var(--font-size-base);
  }
}

/* 平板和大螢幕優化 */
@media (min-width: 1200px) {
  .header-container {
    max-width: 1400px;
    padding: 0 var(--spacing-xl);
  }

  .main-nav {
    gap: var(--spacing-xl);
  }

  .nav-link {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-lg);
  }

  .logo-icon {
    font-size: 2rem;
  }

  .app-title {
    font-size: var(--font-size-2xl);
  }
}

@media (min-width: 1400px) {
  .header-container {
    max-width: 1600px;
  }
}

@media (min-width: 1600px) {
  .header-container {
    max-width: none;
    padding: 0 5%;
  }

  .main-nav {
    gap: var(--spacing-2xl);
  }

  .nav-link {
    font-size: var(--font-size-xl);
    padding: var(--spacing-md) var(--spacing-lg);
  }
}
</style>
