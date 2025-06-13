<template>
  <div class="help-modal-overlay" @click="closeModal">
    <div class="help-modal" @click.stop>
      <div class="modal-header">
        <h2>{{ t('help.title') }}</h2>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="modal-content">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <div class="tab-content">
          <!-- 使用方法 -->
          <div v-if="activeTab === 'usage'" class="content-section">
            <h3>{{ t('help.steps.title') }}</h3>
            <div class="steps-list">
              <div class="step-item">
                <div class="step-number">1</div>
                <div class="step-desc">{{ t('help.steps.step1') }}</div>
              </div>
              <div class="step-item">
                <div class="step-number">2</div>
                <div class="step-desc">{{ t('help.steps.step2') }}</div>
              </div>
              <div class="step-item">
                <div class="step-number">3</div>
                <div class="step-desc">
                  {{ t('help.steps.step3') }}
                </div>
              </div>
              <div class="step-item">
                <div class="step-number">4</div>
                <div class="step-desc">{{ t('help.steps.step4') }}</div>
              </div>
            </div>
          </div>

          <!-- 計算原理 -->
          <div v-if="activeTab === 'theory'" class="content-section">
            <h3>{{ t('help.calculationPrinciple.title') }}</h3>
            <div class="theory-content">
              <h4>{{ t('help.calculationPrinciple.upgradeRates') }}</h4>
              <p>
                <strong>{{ t('help.calculationPrinciple.mainStat') }}</strong>
              </p>
              <p>{{ t('help.calculationPrinciple.mainStatExpected') }}</p>

              <p>
                <strong>{{ t('help.calculationPrinciple.subStat') }}</strong>
              </p>
              <p>{{ t('help.calculationPrinciple.subStatExpected') }}</p>
            </div>
          </div>

          <!-- 評價等級 -->
          <div v-if="activeTab === 'grades'" class="content-section">
            <h3>{{ t('help.ratingSystem') }}</h3>
            <div class="grade-list">
              <div class="grade-item mythic-quality">
                <span class="grade-label">{{ t('ratings.excellent') }}</span>
                <span class="grade-range">≥140%</span>
                <span class="grade-desc">{{ t('descriptions.excellent') }}</span>
              </div>
              <div class="grade-item legend-quality">
                <span class="grade-label">{{ t('ratings.good') }}</span>
                <span class="grade-range">120-139%</span>
                <span class="grade-desc">{{ t('descriptions.good') }}</span>
              </div>
              <div class="grade-item hero-quality">
                <span class="grade-label">{{ t('ratings.average') }}</span>
                <span class="grade-range">100-119%</span>
                <span class="grade-desc">{{ t('descriptions.average') }}</span>
              </div>
              <div class="grade-item rare-quality">
                <span class="grade-label">{{ t('ratings.normal') }}</span>
                <span class="grade-range">85-99%</span>
                <span class="grade-desc">{{ t('descriptions.normalGrowth') }}</span>
              </div>
              <div class="grade-item normal-quality">
                <span class="grade-label">{{ t('ratings.poor') }}</span>
                <span class="grade-range">&lt;85%</span>
                <span class="grade-desc">{{ t('descriptions.poor') }}</span>
              </div>
            </div>
          </div>

          <!-- 新增技能規則 -->
          <div v-if="activeTab === 'skillRules'" class="content-section">
            <h3>{{ t('help.skillRules.title') }}</h3>
            <div class="rules-list">
              <div class="rule-item">
                <div class="rule-icon">📜</div>
                <div class="rule-desc">{{ t('help.skillRules.rule1') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 定義 emit
const emit = defineEmits<{
  close: []
}>()

// 響應式數據
const activeTab = ref('usage')

const tabs = computed(() => [
  { id: 'usage', label: t('help.usage') },
  { id: 'theory', label: t('help.calculation') },
  { id: 'grades', label: t('help.ratingSystem') },
  { id: 'skillRules', label: t('help.skillRules.title') },
])

// 方法
function closeModal() {
  emit('close')
}
</script>

<style scoped>
.help-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.help-modal {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-primary);
  max-width: 800px;
  max-height: 80vh;
  width: 90%;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-primary);
  background: var(--color-bg-tertiary);
}

.modal-header h2 {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xl);
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.close-btn:hover {
  background: var(--color-bg-primary);
  color: var(--color-text-error);
}

.modal-content {
  padding: var(--spacing-lg);
  overflow-y: auto;
  max-height: 60vh;
}

.tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-primary);
}

.tab-btn {
  background: none;
  border: none;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  cursor: pointer;
  transition: all var(--transition-base);
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

.tab-btn.active {
  background: var(--color-bg-primary);
  color: var(--color-text-accent);
  border-bottom-color: var(--color-text-accent);
}

.content-section h3 {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-lg);
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.step-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-primary);
}

.step-number {
  background: var(--color-text-accent);
  color: var(--color-bg-primary);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step-desc {
  color: var(--color-text-primary);
  font-size: var(--font-size-base);
}

.theory-content {
  line-height: 1.6;
}

.theory-content h4 {
  color: var(--color-text-secondary);
  margin: var(--spacing-lg) 0 var(--spacing-sm) 0;
}

.theory-content p {
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.grade-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.grade-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.grade-item.mythic-quality {
  background: rgba(255, 200, 1, 0.1);
  border-left-color: var(--quality-mythic);
}

.grade-item.legend-quality {
  background: rgba(78, 1, 128, 0.1);
  border-left-color: var(--quality-legend);
}

.grade-item.hero-quality {
  background: rgba(233, 0, 3, 0.1);
  border-left-color: var(--quality-hero);
}

.grade-item.rare-quality {
  background: rgba(1, 84, 160, 0.1);
  border-left-color: var(--quality-rare);
}

.grade-item.normal-quality {
  background: rgba(171, 178, 191, 0.1);
  border-left-color: #9ca3af;
}

.grade-label {
  font-weight: bold;
  min-width: 60px;
  color: var(--color-text-secondary);
}

.grade-range {
  font-family: monospace;
  min-width: 80px;
  color: var(--color-text-accent);
}

.grade-desc {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.rule-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-primary);
}

.rule-icon {
  font-size: 1.5rem;
}

.rule-desc {
  color: var(--color-text-primary);
}

@media (max-width: 768px) {
  .help-modal {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header {
    padding: var(--spacing-md);
  }

  .modal-content {
    padding: var(--spacing-md);
  }

  .tabs {
    flex-direction: column;
    gap: 0;
  }

  .tab-btn {
    border-radius: 0;
    border-bottom: 1px solid var(--color-border-primary);
    border-right: 2px solid transparent;
  }

  .tab-btn.active {
    border-bottom-color: var(--color-border-primary);
    border-right-color: var(--color-text-accent);
  }

  .step-item {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }

  .grade-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }
}
</style>
