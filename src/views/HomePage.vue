<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">🎮</div>
        <h1 class="hero-title">{{ t('home.welcome.title', '歡迎使用專業遊戲計算工具') }}</h1>
        <p class="hero-subtitle">
          {{ t('home.welcome.subtitle', '提供精確的寵物評估和轉職計算服務') }}
        </p>
      </div>
    </div>

    <!-- Announcement Banner -->
    <div class="announcement-banner">
      <div class="announcement-icon">📢</div>
      <div class="announcement-content">
        <h3>{{ t('home.announcement.title', '系統公告') }}</h3>
        <p>{{ t('home.announcement.content', '專業的遊戲輔助計算工具，持續更新中...') }}</p>
      </div>
    </div>

    <!-- Features Grid -->
    <div class="features-section">
      <h2 class="section-title">{{ t('home.features.title', '功能列表') }}</h2>
      <div class="features-grid">
        <FeatureCard
          icon="🐾"
          :title="t('nav.petEvaluate')"
          :description="t('home.features.petEvaluate.desc')"
          route="/pet-evaluate"
        />

        <FeatureCard
          icon="💎"
          :title="t('nav.jobChangeCalculator')"
          :description="t('home.features.jobChange.desc')"
          route="/job-change"
        />

        <FeatureCard
          icon="🚀"
          :title="t('nav.moreFeatures')"
          :description="t('home.features.moreComing.desc')"
          :disabled="true"
        />
      </div>
    </div>

    <!-- How to Use Section -->
    <div class="how-to-use-section">
      <h2 class="section-title">{{ t('home.howToUse.title', '使用方法') }}</h2>
      <div class="steps-container">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h3>{{ t('home.howToUse.step1.title', '選擇功能') }}</h3>
            <p>{{ t('home.howToUse.step1.desc', '選擇您需要的計算功能') }}</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h3>{{ t('home.howToUse.step2.title', '輸入數據') }}</h3>
            <p>{{ t('home.howToUse.step2.desc', '根據提示輸入相關數據') }}</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h3>{{ t('home.howToUse.step3.title', '查看結果') }}</h3>
            <p>{{ t('home.howToUse.step3.desc', '獲得詳細的分析結果') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { setPageMeta, pageMeta } from '../../modules/shared/utils/seo'
import { trackPageView } from '../../modules/shared/utils/analytics'

const { t } = useI18n()

onMounted(() => {
  // 設置頁面 Meta 標籤
  setPageMeta({ ...pageMeta.home, title: '首頁 - LineageW 數據實驗室' })

  // 追蹤頁面瀏覽
  trackPageView('home', '首頁 - LineageW 數據實驗室')
})
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

/* 大螢幕優化 */
@media (min-width: 1200px) {
  .home-page {
    max-width: 1400px;
    padding: 0 var(--spacing-xl);
  }

  .features-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
  }

  .steps-container {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xl);
  }

  .hero-section {
    padding: var(--spacing-2xl) 0;
  }

  .hero-icon {
    font-size: 5rem;
  }

  .hero-title {
    font-size: var(--font-size-4xl);
  }

  .section-title {
    font-size: var(--font-size-3xl);
  }
}

@media (min-width: 1400px) {
  .home-page {
    max-width: 1600px;
  }

  .hero-icon {
    font-size: 6rem;
  }
}

@media (min-width: 1600px) {
  .home-page {
    max-width: none;
    padding: 0 5%;
  }

  .hero-section {
    max-width: 1200px;
    margin: 0 auto;
  }

  .features-grid,
  .steps-container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

/* 手機版優化 */
@media (max-width: 768px) {
  .home-page {
    padding: 0 var(--spacing-md);
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .hero-section {
    border-width: 1px;
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .announcement-banner {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
    border-width: 1px;
  }

  .features-section,
  .how-to-use-section {
    padding: var(--spacing-md);
    border-width: 1px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .steps-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .step {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }

  .step-number {
    align-self: center;
  }
}

@media (max-width: 480px) {
  .home-page {
    padding: 0 var(--spacing-sm);
  }

  .hero-icon {
    font-size: 3rem;
  }

  .hero-title {
    font-size: var(--font-size-xl);
  }

  .section-title {
    font-size: var(--font-size-lg);
  }

  .announcement-banner {
    padding: var(--spacing-sm);
  }

  .features-section,
  .how-to-use-section {
    padding: var(--spacing-sm);
  }
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: var(--spacing-xl) 0;
  margin-bottom: var(--spacing-xl);
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border-primary);
  box-shadow: var(--shadow-lg);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-base);
}

.hero-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 60px rgba(97, 218, 251, 0.15);
  border-color: var(--color-text-accent);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.hero-icon {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

.hero-title {
  font-size: var(--font-size-4xl);
  margin: 0;
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  margin: 0;
  opacity: 0.9;
}

/* Announcement Banner */
.announcement-banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: linear-gradient(135deg, rgba(229, 192, 123, 0.1), rgba(229, 192, 123, 0.05));
  border: 2px solid var(--color-text-warning);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(229, 192, 123, 0.15);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-base);
}

.announcement-banner:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(229, 192, 123, 0.25);
  border-color: var(--color-text-warning);
}

.announcement-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, var(--color-text-warning), #f5c842);
}

.announcement-banner::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(229, 192, 123, 0.08));
  pointer-events: none;
}

.announcement-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  color: var(--color-text-warning);
}

.announcement-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-warning);
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.announcement-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  opacity: 0.95;
}

/* Features Section */
.features-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.features-section:hover {
  border-color: var(--color-text-accent);
  box-shadow: var(--shadow-lg);
}

.section-title {
  text-align: center;
  font-size: var(--font-size-2xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

/* How to Use Section */
.how-to-use-section {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-primary);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.how-to-use-section:hover {
  border-color: var(--color-text-accent);
  box-shadow: var(--shadow-lg);
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.step {
  display: flex;
  gap: var(--spacing-md);
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-text-accent);
  background: var(--color-bg-secondary);
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
  color: white;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.step-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.step-content p {
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1.6;
}

/* Animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
