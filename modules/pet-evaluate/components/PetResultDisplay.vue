<template>
  <section v-if="result" class="result-section">
    <div class="result-header">
      <h2 class="result-title">{{ t('results.title', '計算結果') }}</h2>
      <button class="save-btn" @click="saveResult">
        <i class="fas fa-save"></i> {{ t('common.save', '儲存結果') }}
      </button>
    </div>

    <!-- 寵物資訊顯示 -->
    <div class="pet-info">
      <div class="selected-pet-display">
        <span class="pet-emoji">{{ result.pet.emoji }}</span>
        <span class="pet-name">{{ result.pet.name }}</span>
        <span class="pet-level">Lv.{{ result.level }}</span>
      </div>
    </div>

    <!-- 屬性比較表格 -->
    <div class="stats-comparison">
      <div class="comparison-grid">
        <!-- 表頭 -->
        <div class="stat-row header">
          <div>{{ t('results.attribute', '屬性') }}</div>
          <div>{{ t('common.currentValue', '當前值') }}</div>
          <div>{{ t('common.baseValue', '基礎值') }}</div>
          <div>{{ t('common.growthValue', '成長值') }}</div>
          <div>{{ t('common.expectedValue', '期望值') }}</div>
          <div>{{ t('common.characterBonus', '角色加成') }}</div>
          <div>{{ t('common.rating', '評價') }}</div>
        </div>

        <!-- 屬性行 -->
        <div
          v-for="analysis in result.analysis"
          :key="analysis.stat"
          class="stat-row"
          :class="getRatingClass(analysis.rating)"
        >
          <div class="stat-name">
            {{ analysis.statName }}
            <span v-if="analysis.isMainStat" class="main-stat-badge">{{ t('pets.mainStat') }}</span>
          </div>
          <div class="current-value">{{ analysis.currentValue }}</div>
          <div class="base-value">{{ analysis.baseValue }}</div>
          <div class="growth-value">+{{ analysis.growthValue }}</div>
          <div class="expected-value">{{ analysis.expectedValue.toFixed(1) }}</div>
          <div class="character-bonus">{{ analysis.characterBonus }}</div>
          <div class="rating-cell">
            <span class="rating-badge" :class="`rating-${analysis.rating}`">
              {{ getRatingText(analysis.rating) }}
            </span>
            <div class="growth-rate">{{ (analysis.growthRate * 100).toFixed(1) }}%</div>
          </div>
        </div>

        <!-- 攻擊力顯示行 (當有積極性技能加成時) -->
        <div v-if="hasAggressivenessBonus" class="stat-row skill-bonus-row">
          <div class="stat-name">
            {{ t('stats.attackPower', '攻擊力') }}
            <span class="skill-bonus-badge">{{ t('pets.skillBonus', '技能加成') }}</span>
          </div>
          <div class="current-value">{{ getAttackPowerWithBonus() }}</div>
          <div class="base-value">{{ getBaseAttackPower() }}</div>
          <div class="growth-value skill-bonus-text">+{{ getAttackPowerBonus() }}</div>
          <div class="expected-value">-</div>
          <div class="character-bonus">-</div>
          <div class="rating-cell">
            <span class="rating-badge rating-skill">{{ t('pets.skillBonus', '技能加成') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 整體評價 -->
    <div class="overall-rating">
      <h3>{{ t('results.overallRating', '整體評價') }}</h3>
      <div class="rating-display">
        <div class="score-circle">
          <svg class="progress-ring" width="120" height="120">
            <circle
              class="progress-ring__circle_bg"
              stroke-width="8"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
            />
            <circle
              class="progress-ring__circle"
              stroke-width="8"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
              :style="{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset }"
            />
          </svg>
          <div class="score-text">{{ result.overallScore.toFixed(1) }}</div>
        </div>
        <div class="rating-details">
          <span class="rating-badge" :class="`rating-${result.rating}`">
            {{ getOverallRatingText(result.rating) }}
          </span>
          <p class="rating-description">
            {{ getRatingDescription(result.rating) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PetCalculationResult, RatingLevel, OverallRating } from '../types'
import { getRatingDescription } from '../utils/calculations'
import { useI18n } from 'vue-i18n'
import { usePetEvaluateStore } from '../stores'
import { computed } from 'vue'

const { t } = useI18n()
const petStore = usePetEvaluateStore()

interface Props {
  result: PetCalculationResult | null
}

const props = defineProps<Props>()

function saveResult() {
  if (props.result) {
    petStore.addToHistory(props.result)
    // Optionally, show a success message
  }
}

const circumference = computed(() => 2 * Math.PI * 52)
const strokeDashoffset = computed(() => {
  if (!props.result) return circumference.value
  const progress = props.result.overallScore / 100
  return circumference.value - progress * circumference.value
})

// 檢查是否有積極性技能加成
const hasAggressivenessBonus = computed(() => {
  return props.result?.skillBonus?.aggressiveness && props.result.skillBonus.aggressiveness > 0
})

// 計算基礎攻擊力 (積極性 ÷ 3)
function getBaseAttackPower(): number {
  if (!props.result) return 0
  const aggressivenessAnalysis = props.result.analysis.find((a) => a.stat === 'aggressiveness')
  if (!aggressivenessAnalysis) return 0
  return Math.floor(
    (aggressivenessAnalysis.currentValue - (props.result.skillBonus?.aggressiveness || 0)) / 3,
  )
}

// 計算技能加成攻擊力
function getAttackPowerBonus(): number {
  if (!props.result?.skillBonus?.aggressiveness) return 0
  return Math.floor(props.result.skillBonus.aggressiveness / 3)
}

// 計算總攻擊力
function getAttackPowerWithBonus(): number {
  return getBaseAttackPower() + getAttackPowerBonus()
}

function getRatingClass(rating: RatingLevel): string {
  const classMap: Record<RatingLevel, string> = {
    excellent: 'rating-excellent',
    good: 'rating-good',
    average: 'rating-average',
    poor: 'rating-poor',
    bad: 'rating-poor',
    not_rated: 'rating-not-rated',
  }
  return classMap[rating] || 'rating-average'
}

function getRatingText(rating: RatingLevel): string {
  return t(`ratings.${rating}`)
}

function getOverallRatingText(rating: OverallRating): string {
  return t(`ratings.${rating}`)
}
</script>

<style scoped>
.result-section {
  margin-top: 40px;
  animation: resultFadeIn 0.6s ease-out;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-title {
  color: var(--color-text-secondary);
  margin-bottom: 30px;
  font-size: 2rem;
  text-align: center;
  position: relative;
}

.result-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
  border-radius: 2px;
}

.save-btn {
  background: var(--color-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--transition-base);
}

.save-btn:hover {
  background: var(--color-primary-hover);
}

.pet-info {
  margin-bottom: 30px;
}

.selected-pet-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: var(--color-bg-secondary);
  padding: 20px;
  border-radius: 15px;
  border: 1px solid var(--color-border-primary);
  transition: all 0.3s ease;
}

.selected-pet-display:hover {
  box-shadow: 0 8px 25px rgba(97, 218, 251, 0.1);
}

.pet-emoji {
  font-size: 2.5rem;
  animation: petBounce 2s infinite;
}

.pet-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.pet-level {
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
}

@keyframes petBounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.stats-comparison {
  margin-bottom: 30px;
}

.comparison-grid {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-primary);
}

.stat-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1.5fr;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-primary);
  transition: all var(--transition-base);
  align-items: center;
  text-align: center;
}

.stat-row > div {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-row.header {
  background: var(--color-bg-tertiary);
  font-weight: 600;
  color: var(--color-text-secondary);
}

.stat-row:not(.header):hover {
  background: color-mix(in hsl, var(--color-text-accent) 5%, transparent);
}

.stat-name {
  display: flex;
  align-items: center;
  justify-content: flex-start !important;
  gap: 8px;
  font-weight: 500;
  text-align: left;
}

.main-stat-badge {
  background: linear-gradient(135deg, #e5c07b, #d19a66);
  color: #282c34;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid #e5c07b;
}

.current-value,
.base-value,
.growth-value,
.expected-value,
.character-bonus,
.rating-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  text-align: center;
}

.growth-value {
  color: var(--color-text-success);
  font-weight: 600;
}

.character-bonus {
  color: var(--color-text-accent);
  font-size: 0.9rem;
  font-weight: 600;
}

.rating-cell {
  flex-direction: column;
  gap: 4px;
}

.rating-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 4px;
}

/* 預設暗色系底色 */
.rating-excellent,
.rating-good,
.rating-average,
.rating-poor,
.rating-bad {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

/* Hover效果 - 根據rule.txt規範 */
.rating-excellent:hover {
  background: rgba(255, 200, 1, 0.15); /* 金色 */
  color: #ffc801;
  border-left: 3px solid #ffc801;
  box-shadow: 0 0 15px rgba(255, 200, 1, 0.2);
}

.rating-good:hover {
  background: rgba(78, 1, 128, 0.15); /* 紫色 */
  color: #4e0180;
  border-left: 3px solid #4e0180;
  box-shadow: 0 0 15px rgba(78, 1, 128, 0.2);
}

.rating-average:hover {
  background: rgba(233, 0, 3, 0.15); /* 紅色 */
  color: #e90003;
  border-left: 3px solid #e90003;
  box-shadow: 0 0 15px rgba(233, 0, 3, 0.2);
}

.rating-poor:hover {
  background: rgba(1, 84, 160, 0.15); /* 藍色 */
  color: #0154a0;
  border-left: 3px solid #0154a0;
  box-shadow: 0 0 15px rgba(1, 84, 160, 0.2);
}

.rating-bad:hover {
  background: rgba(255, 255, 255, 0.1); /* 白色 */
  color: #ffffff;
  border-left: 3px solid #ffffff;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
}

.rating-not-rated {
  background: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
  border-left: 3px solid var(--color-text-secondary);
}

.growth-rate {
  font-size: 0.75rem;
  color: #5c6370;
}

.overall-rating {
  text-align: center;
  background: var(--color-bg-secondary);
  padding: 30px;
  border-radius: 15px;
  border: 1px solid var(--color-border-primary);
}

.overall-rating h3 {
  color: var(--color-text-secondary);
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.rating-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.overall-rating .rating-badge {
  font-size: 1.2rem;
  padding: 12px 24px;
  border-radius: 25px;
}

.overall-score {
  font-size: 1.1rem;
  color: var(--text-accent);
  font-weight: 600;
}

.rating-description {
  color: var(--text-primary);
  font-size: 1rem;
  margin: 0;
  max-width: 400px;
}

.score-circle {
  position: relative;
  width: 120px;
  height: 120px;
}

.progress-ring__circle_bg {
  stroke: var(--color-border-primary);
}

.progress-ring__circle {
  transform-origin: center;
  transform: rotate(-90deg);
  transition: stroke-dashoffset 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  stroke: var(--color-accent);
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--font-size-2xl);
  font-weight: bold;
}

.rating-details {
  flex-basis: 250px;
  text-align: center;
}

.rating-details .rating-badge {
  display: inline-block;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-lg);
}

.rating-description {
  color: var(--color-text-secondary);
}

/* 評價徽章樣式 - 符合rule.txt規範 */
.rating-badge.rating-excellent {
  background: #ffc801; /* 金色 - 頂級 */
  color: #282c34;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(255, 200, 1, 0.3);
}
.rating-badge.rating-good {
  background: #4e0180; /* 紫色 - 優秀 */
  color: white;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(78, 1, 128, 0.3);
}
.rating-badge.rating-average {
  background: #e90003; /* 紅色 - 良好 */
  color: white;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(233, 0, 3, 0.3);
}
.rating-badge.rating-poor {
  background: #0154a0; /* 藍色 - 普通 */
  color: white;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(1, 84, 160, 0.3);
}
.rating-badge.rating-bad {
  background: rgba(255, 255, 255, 0.9); /* 白色 - 待加強 */
  color: #282c34;
  font-weight: 600;
  border: 1px solid #ffffff;
}
.rating-badge.rating-not-rated {
  background: rgba(92, 99, 112, 0.8);
  color: #abb2bf;
  border: 1px solid #5c6370;
}

/* 整體評價徽章 - 符合rule.txt規範 */
.rating-godTier {
  background: #ffc801; /* 金色 - 神級寵物 */
  color: #282c34;
  border: 2px solid #ffc801;
  box-shadow: 0 0 20px rgba(255, 200, 1, 0.4);
  animation: goldenPulse 2s infinite;
}
.rating-highQuality {
  background: #4e0180; /* 紫色 - 優質寵物 */
  color: white;
  border: 2px solid #4e0180;
  box-shadow: 0 0 15px rgba(78, 1, 128, 0.3);
}
.rating-normalPet {
  background: #e90003; /* 紅色 - 普通寵物 */
  color: white;
  border: 2px solid #e90003;
  box-shadow: 0 0 15px rgba(233, 0, 3, 0.3);
}
.rating-needImprovement {
  background: #0154a0; /* 藍色 - 待加強 */
  color: white;
  border: 2px solid #0154a0;
  box-shadow: 0 0 15px rgba(1, 84, 160, 0.3);
}
.rating-tragic {
  background: rgba(255, 255, 255, 0.1); /* 白色 - 悲劇 */
  color: #ffffff;
  border: 2px solid #ffffff;
}

@keyframes goldenPulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(255, 200, 1, 0.4);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 200, 1, 0.6);
  }
}

@keyframes resultFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .stat-row {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }

  .stat-row.header {
    display: none;
  }

  .stat-row:not(.header) {
    background: #21252b;
    margin-bottom: 10px;
    border-radius: 8px;
    padding: 15px;
  }

  .stat-row:not(.header) > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
  }

  .stat-row:not(.header) > div::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--text-secondary);
  }

  .selected-pet-display {
    flex-direction: column;
    gap: 10px;
  }

  .pet-emoji {
    font-size: 2rem;
  }
}

.skill-bonus-row {
  background: rgba(97, 218, 251, 0.05);
  border-left: 3px solid var(--color-text-accent);
}

.skill-bonus-badge {
  background: linear-gradient(135deg, var(--color-text-accent), #4fa8c5);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid var(--color-text-accent);
}

.skill-bonus-text {
  color: var(--color-text-accent) !important;
  font-weight: 700;
}

.rating-skill {
  background: var(--color-text-accent);
  color: white;
}
</style>
