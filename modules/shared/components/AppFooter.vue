<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- 左欄：相關連結 -->
        <div class="footer-column footer-links-area">
          <h5 class="footer-title">相關連結</h5>
          <ul>
            <li><a href="#" @click.prevent="openPrivacyPolicy">隱私權政策</a></li>
          </ul>
        </div>

        <!-- 中欄：意見回饋 -->
        <div class="footer-column footer-feedback-area">
          <div class="feedback-icon">📝</div>
          <div class="feedback-text">
            <h4 class="feedback-title">有任何建議或意見嗎？</h4>
            <p class="feedback-subtitle">您的回饋是我們進步的動力！</p>
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfgqhDqccI-FwdwKCUL6EW7TqyJpCisUarKeyUu-Fv4BKidIA/viewform?usp=dialog"
            class="feedback-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            點擊填寫回饋表單
          </a>
        </div>

        <!-- 右欄：Meta 資訊 -->
        <div class="footer-column footer-meta-area">
          <div class="last-updated">
            最後更新：<span id="last-updated-time">{{ lastUpdated }}</span>
          </div>
          <div class="copyright-info">
            &copy; {{ new Date().getFullYear() }} OrionLabs. Created by Orion.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModal } from '@/shared/composables/useModal'

const lastUpdated = ref('讀取中...')
const { openModal, registerModal } = useModal()

// 隱私權政策模態視窗的 ID
const PRIVACY_POLICY_MODAL_ID = 'PrivacyPolicyModal'

// 打開隱私權政策模態視窗
const openPrivacyPolicy = () => {
  openModal(PRIVACY_POLICY_MODAL_ID)
}

onMounted(async () => {
  // 註冊隱私權政策模態視窗
  registerModal({
    id: PRIVACY_POLICY_MODAL_ID,
    component: 'PrivacyPolicy',
    title: '隱私權政策',
    size: 'large',
  })

  try {
    const response = await fetch('/build-info.json', { cache: 'no-cache' })
    if (!response.ok) {
      throw new Error('Build info not found')
    }
    const data = await response.json()
    const date = new Date(data.lastUpdated)
    lastUpdated.value = date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  } catch (error) {
    console.error('Failed to load build info:', error)
    lastUpdated.value = '2025/06/13'
  }
})
</script>

<style scoped>
.app-footer {
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  padding: var(--spacing-xl) 0;
  border-top: 1px solid var(--color-border-primary);
  transition:
    background-color var(--transition-base),
    color var(--transition-base);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.footer-column {
  display: flex;
  flex-direction: column;
}

/* 左欄：相關連結 */
.footer-links-area {
  align-items: flex-start;
  flex: 1;
}

/* 中欄：意見回饋 */
.footer-feedback-area {
  align-items: center;
  text-align: center;
  flex: 2; /* 讓中間區塊佔用更多空間 */
}

/* 右欄：Meta 資訊 */
.footer-meta-area {
  align-items: flex-end;
  text-align: right;
  flex: 1;
  gap: var(--spacing-xs); /* 為最後更新和版權資訊添加間距 */
}

.feedback-icon {
  font-size: var(--font-size-3xl);
  animation: pulse 2s infinite ease-in-out;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--spacing-sm);
}

.feedback-text {
  margin-bottom: var(--spacing-md);
}

.feedback-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.feedback-subtitle {
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
}

.feedback-button {
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-lg);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.feedback-button:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.footer-title {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  position: relative;
  display: inline-block;
}

.footer-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -5px;
  width: 100%;
  height: 2px;
  background: var(--gradient-primary);
}

.footer-links-area ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links-area a {
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
  position: relative;
  display: inline-block;
  padding: 2px 0;
}

.footer-links-area a:hover {
  color: var(--color-text-accent);
}

.copyright-info,
.last-updated {
  font-size: var(--font-size-sm);
}

.copyright-info {
  font-weight: 500;
  background: linear-gradient(135deg, #ffeb3b, #ffc107); /* 金色漸層 */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.6); /* 金色發光效果 */
  transition: text-shadow 0.3s ease;
}

.copyright-info:hover {
  text-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
}

#last-updated-time {
  color: var(--color-text-accent);
  font-weight: 500;
  background-color: rgba(var(--color-text-accent-rgb, 14, 165, 233), 0.1);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
}

/* Keyframes 和 Fallback Variables */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

:root {
  --color-text-accent-rgb: 14, 165, 233;
}
:root.dark-theme {
  --color-text-accent-rgb: 97, 218, 251;
}

/* 響應式設計 */
@media (max-width: 992px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-column {
    align-items: center !important;
    text-align: center !important;
    width: 100%;
  }

  .footer-meta-area {
    margin-top: var(--spacing-lg);
    border-top: 1px solid var(--color-border-primary);
    padding-top: var(--spacing-lg);
  }

  .app-footer {
    margin-bottom: 60px; /* 為手機版底部導航留空間 */
  }
}
</style>
