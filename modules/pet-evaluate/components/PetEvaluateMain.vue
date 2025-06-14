<template>
  <div class="pet-evaluate-layout">
    <!-- Hero Section -->
    <div class="hero-section">
      <h1 class="hero-title">{{ t('nav.petEvaluate') }}</h1>
      <p class="hero-subtitle">{{ t('pets.subtitle', '計算您的寵物成長潛力與評價') }}</p>
    </div>

    <!-- Step 1: Pet Selection -->
    <div class="content-section">
      <h2 class="section-title">
        <span class="step-number">1</span>
        {{ t('help.steps.step1') }}
      </h2>
      <PetSelector />
    </div>

    <!-- Step 2: Stats Input -->
    <div class="content-section">
      <h2 class="section-title">
        <span class="step-number">2</span>
        {{ t('help.steps.step2') }}
      </h2>
      <PetStatsInput @show-help="showHelpModal" />
    </div>

    <!-- Step 3: Results Display -->
    <div class="content-section results-section" ref="resultsSectionRef">
      <h2 class="section-title">
        <span class="step-number">3</span>
        {{ t('results.title', '計算結果') }}
      </h2>

      <div class="results-content" ref="resultCardRef">
        <Transition name="fade-up" mode="out-in">
          <div v-if="isCalculating" class="calculating-overlay">
            <div class="spinner"></div>
            <p>{{ t('common.calculating', '計算中...') }}</p>
          </div>
          <PetResultDisplay
            v-else-if="calculationResult"
            :result="calculationResult"
            :key="calculationResult.pet.id + calculationResult.overallScore"
          />
          <div v-else class="placeholder">
            <h3 class="placeholder-title">{{ t('results.waiting', '等待計算') }}</h3>
            <p class="placeholder-text">
              {{ t('results.waitingDesc', '完成上方的數值輸入後，這裡將會顯示您的寵物評價結果。') }}
            </p>
          </div>
        </Transition>
      </div>

      <!-- Share Button -->
      <div v-if="calculationResult && !isCalculating" class="actions-container">
        <button class="share-button" @click="handleShareClick" :disabled="isCapturing">
          <span v-if="isCapturing">
            <i class="fas fa-spinner fa-spin"></i>
            {{ t('common.generating', '圖片產生中...') }}
          </span>
          <span v-else>
            <i class="fas fa-camera-retro"></i>
            {{ t('common.shareResult', '分享評鑑結果') }}
          </span>
        </button>
        <p class="share-hint">
          {{ t('common.shareHint', '點擊產生評鑑結果的圖片，可分享或儲存') }}
        </p>
      </div>

      <!-- Calculation History -->
      <Transition name="fade-up">
        <div v-if="calculationHistory.length > 0 && !isCalculating" class="history-section">
          <h3 class="history-title">{{ t('common.history', '計算歷史') }}</h3>
          <ul class="history-list">
            <li
              v-for="item in calculationHistory"
              :key="item.pet.id + item.level + item.overallScore"
              class="history-item"
              @click="loadFromHistory(item)"
            >
              <span>{{ t(`pets.${item.pet.id}`) }} (Lv.{{ item.level }})</span>
              <span class="history-score"
                >{{ item.overallScore.toFixed(1) }}{{ t('common.score', '分') }}</span
              >
            </li>
          </ul>
          <button class="clear-history-btn" @click="clearHistory">
            {{ t('common.clearHistory', '清除歷史') }}
          </button>
        </div>
      </Transition>
    </div>

    <!-- Screenshot Preview Modal -->
    <ScreenshotPreviewModal
      :show="showPreviewModal"
      :image-url="generatedImage?.url || null"
      @close="handleModalClose"
      @copy="handleCopy"
      @download="handleDownload"
    />

    <!-- Help Modal -->
    <HelpModal v-if="showHelp" @close="showHelp = false" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { usePetEvaluateStore } from '../stores'
import PetSelector from './PetSelector.vue'
import PetStatsInput from './PetStatsInput.vue'
import PetResultDisplay from './PetResultDisplay.vue'
import { defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, nextTick } from 'vue'
import { useScreenshot } from '@/modules/shared/composables/useScreenshot'
import ScreenshotPreviewModal from '@/modules/shared/components/ScreenshotPreviewModal.vue'

const { t } = useI18n()
const petStore = usePetEvaluateStore()
const { calculationResult, calculationHistory, isCalculating } = storeToRefs(petStore)
const { loadFromHistory, clearHistory } = petStore

const showHelp = ref(false)
const resultsSectionRef = ref<HTMLElement | null>(null)
const resultCardRef = ref<HTMLElement | null>(null)
const showPreviewModal = ref(false)

const { isCapturing, generatedImage, error, capture, copyToClipboard, downloadImage, reset } =
  useScreenshot(resultCardRef)

watch(error, (newError) => {
  if (newError) {
    alert(`${t('errors.imageFailed')}: ${newError}`)
  }
})

const handleShareClick = async () => {
  await capture()
  if (generatedImage.value) {
    showPreviewModal.value = true
  }
}

const handleModalClose = () => {
  reset()
  showPreviewModal.value = false
}

const handleCopy = () => {
  copyToClipboard()
  // The modal itself will show a "Copied" message.
  // No need to close it immediately.
}

const handleDownload = () => {
  downloadImage()
  // Keep the modal open after download.
}

const HelpModal = defineAsyncComponent(() => import('./HelpModal.vue'))

onMounted(() => {
  petStore.initialize()
})

function showHelpModal() {
  showHelp.value = true
}

watch(
  () => calculationResult.value,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      resultsSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  },
)
</script>

<style scoped>
.pet-evaluate-layout {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* 大螢幕優化 */
@media (min-width: 1200px) {
  .pet-evaluate-layout {
    max-width: 1400px;
    padding: var(--spacing-xl);
    gap: var(--spacing-2xl);
  }
}

@media (min-width: 1600px) {
  .pet-evaluate-layout {
    max-width: 1600px;
    padding: 0 5%;
  }
}

/* 手機版優化 */
@media (max-width: 768px) {
  .pet-evaluate-layout {
    padding: var(--spacing-md);
    gap: var(--spacing-lg);
  }
}

@media (max-width: 480px) {
  .pet-evaluate-layout {
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }
}

.hero-section {
  text-align: center;
  padding: var(--spacing-xl) 0;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border-primary);
  box-shadow: var(--shadow-lg);
}

.hero-title {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-accent);
}

.hero-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-lg);
}

.content-section {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border: 2px solid var(--color-border-primary);
  transition: all var(--transition-base);
}

.content-section:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--color-text-accent);
}

.results-section {
  border-color: var(--color-text-success);
}

.results-content {
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  border: 1px solid var(--color-border-secondary);
}

.section-title {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.step-number {
  background: linear-gradient(135deg, var(--color-gold-light), var(--color-gold-dark));
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 1px solid var(--color-gold-dark);
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
}

.placeholder {
  text-align: center;
  padding: var(--spacing-xl);
  margin: auto;
  color: var(--color-text-secondary);
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
}

.calculating-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--spacing-md);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--color-border-primary);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.history-section {
  margin-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-primary);
  padding-top: var(--spacing-lg);
}

.history-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-md);
}

.history-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-md) 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  background: var(--color-bg-hover);
  transform: translateX(4px);
}

.history-score {
  font-weight: bold;
  color: var(--color-accent);
}

.clear-history-btn {
  width: 100%;
  padding: var(--spacing-sm);
  background: var(--color-bg-danger);
  color: var(--color-text-danger);
  border: 1px solid var(--color-border-danger);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s ease;
}

.clear-history-btn:hover {
  background: var(--color-bg-danger-hover);
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.5s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  transform: translateY(30px);
  opacity: 0;
}

.actions-container {
  margin-top: var(--spacing-lg);
  text-align: center;
}

.share-button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
  font-weight: bold;
  color: var(--color-bg-primary);
  background: var(--gradient-primary);
  border: 2px solid transparent;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  animation: pulse 2.5s infinite;
}

.share-button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.03);
  box-shadow: var(--shadow-lg);
  animation-play-state: paused;
}

.share-button:disabled {
  background: var(--color-text-muted);
  cursor: not-allowed;
  animation: none;
  box-shadow: none;
  transform: none;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: var(--shadow-md);
  }
  50% {
    transform: scale(1.05);
    box-shadow: var(--shadow-lg);
  }
  100% {
    transform: scale(1);
    box-shadow: var(--shadow-md);
  }
}

.share-hint {
  margin-top: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}
</style>
