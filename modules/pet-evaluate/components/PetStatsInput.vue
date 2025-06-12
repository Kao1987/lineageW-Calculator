<template>
  <section class="input-section">
    <!-- 屬性輸入區域 -->
    <div class="stats-input">
      <!-- 頂部控制區域 - 水平排列 -->
      <div class="top-controls">
        <h3>{{ t('stats.title', '當前屬性值') }}</h3>

        <div class="level-control">
          <label for="pet-level" class="level-label">
            {{ t('common.level', '寵物等級') }} (1-15)
          </label>
          <input
            id="pet-level"
            v-model.number="petLevel"
            type="number"
            min="1"
            max="15"
            class="level-input"
            @input="handleLevelChange"
          />
        </div>

        <button
          class="help-btn"
          @click="$emit('showHelp')"
          :aria-label="t('common.help', '使用說明')"
        >
          ❓ {{ t('common.help', '使用說明') }}
        </button>
      </div>

      <!-- 計算模式選擇 -->
      <div class="calculation-mode">
        <h4>{{ t('pets.calculationMode') }}</h4>
        <div class="mode-options">
          <label class="mode-option">
            <input
              type="radio"
              :value="'manual'"
              v-model="calculationMode"
              @change="handleModeChange"
            />
            <span class="mode-label">
              <strong>{{ t('pets.manualMode') }}</strong>
              <small>{{ t('pets.manualModeDesc') }}</small>
            </span>
          </label>
          <label class="mode-option">
            <input
              type="radio"
              :value="'smart'"
              v-model="calculationMode"
              @change="handleModeChange"
            />
            <span class="mode-label">
              <strong>{{ t('pets.smartMode') }}</strong>
              <small>{{ t('pets.smartModeDesc') }}</small>
            </span>
          </label>
        </div>
      </div>

      <!-- 手動模式警告 -->
      <div v-if="calculationMode === 'manual'" class="warning">
        ⚠️ {{ t('stats.warning', '請記得扣除技能加成的屬性點數') }}
      </div>

      <!-- 智能模式技能選擇 -->
      <PetSkillSelector
        v-if="calculationMode === 'smart'"
        :pet-level="petLevel"
        :selected-skills="selectedSkills"
        @update:selected-skills="selectedSkills = $event"
      />

      <div class="stats-grid">
        <!-- 忍耐力 -->
        <div class="stat-input" :class="{ 'main-stat': isMainStat('endurance') }">
          <div class="stat-title">
            <label for="stat-endurance">
              {{ t('stats.endurance', '忍耐力') }}
              <span v-if="isMainStat('endurance')" class="main-stat-indicator">{{
                t('pets.mainStat', '主屬性')
              }}</span>
            </label>
            <small class="stat-desc">
              {{ t('stats.enduranceDesc', '5點=1物防') }}
            </small>
          </div>
          <input
            id="stat-endurance"
            v-model.number="inputStats.endurance"
            type="number"
            min="0"
            class="stat-value-input"
          />
          <div v-if="expectedStats" class="expected-hint">
            {{ t('common.expectedValue', '期望值') }}: {{ expectedStats.endurance.toFixed(1) }}
          </div>
          <div v-if="skillBonus.endurance > 0" class="skill-bonus">
            {{ t('pets.skillBonus', '技能加成') }}: +{{ skillBonus.endurance }}
          </div>
        </div>

        <!-- 忠誠心 -->
        <div class="stat-input" :class="{ 'main-stat': isMainStat('loyalty') }">
          <div class="stat-title">
            <label for="stat-loyalty">
              {{ t('stats.loyalty', '忠誠心') }}
              <span v-if="isMainStat('loyalty')" class="main-stat-indicator">{{
                t('pets.mainStat', '主屬性')
              }}</span>
            </label>
            <small class="stat-desc">
              {{ t('stats.loyaltyDesc', '5點=1近/遠/魔命中') }}
            </small>
          </div>
          <input
            id="stat-loyalty"
            v-model.number="inputStats.loyalty"
            type="number"
            min="0"
            class="stat-value-input"
          />
          <div v-if="expectedStats" class="expected-hint">
            {{ t('common.expectedValue', '期望值') }}: {{ expectedStats.loyalty.toFixed(1) }}
          </div>
          <div v-if="skillBonus.loyalty > 0" class="skill-bonus">
            {{ t('pets.skillBonus', '技能加成') }}: +{{ skillBonus.loyalty }}
          </div>
        </div>

        <!-- 速度 -->
        <div class="stat-input" :class="{ 'main-stat': isMainStat('speed') }">
          <div class="stat-title">
            <label for="stat-speed">
              {{ t('stats.speed', '速度') }}
              <span v-if="isMainStat('speed')" class="main-stat-indicator">{{
                t('pets.mainStat', '主屬性')
              }}</span>
            </label>
            <small class="stat-desc">
              {{ t('stats.speedDesc', '10點=1近/遠迴避') }}
            </small>
          </div>
          <input
            id="stat-speed"
            v-model.number="inputStats.speed"
            type="number"
            min="0"
            class="stat-value-input"
          />
          <div v-if="expectedStats" class="expected-hint">
            {{ t('common.expectedValue', '期望值') }}: {{ expectedStats.speed.toFixed(1) }}
          </div>
          <div v-if="skillBonus.speed > 0" class="skill-bonus">
            {{ t('pets.skillBonus', '技能加成') }}: +{{ skillBonus.speed }}
          </div>
        </div>

        <!-- 積極性 -->
        <div class="stat-input skill-enhanced">
          <div class="stat-title">
            <label for="stat-aggressiveness">
              {{ t('stats.aggressiveness', '積極性') }}
            </label>
            <small class="stat-desc">
              {{ t('stats.aggressivenessDesc', '3點=1攻擊力') }}
            </small>
          </div>
          <input
            id="stat-aggressiveness"
            v-model.number="inputStats.aggressiveness"
            type="number"
            min="3"
            class="stat-value-input"
          />
          <div v-if="skillBonus.aggressiveness > 0" class="skill-bonus">
            {{ t('pets.skillBonus', '技能加成') }}: +{{ skillBonus.aggressiveness }}
          </div>
        </div>

        <!-- 體力 -->
        <div class="stat-input" :class="{ 'main-stat': isMainStat('hp') }">
          <div class="stat-title">
            <label for="stat-hp">
              {{ t('stats.hp', '體力') }}
              <span v-if="isMainStat('hp')" class="main-stat-indicator">{{
                t('pets.mainStat', '主屬性')
              }}</span>
            </label>
            <small class="stat-desc">
              {{ t('stats.hpDesc', '1點=30HP') }}
            </small>
          </div>
          <input
            id="stat-hp"
            v-model.number="inputStats.hp"
            type="number"
            min="0"
            class="stat-value-input"
          />
          <div v-if="expectedStats" class="expected-hint">
            {{ t('common.expectedValue', '期望值') }}: {{ expectedStats.hp.toFixed(1) }}
          </div>
          <div v-if="skillBonus.hp > 0" class="skill-bonus">
            {{ t('pets.skillBonus', '技能加成') }}: +{{ skillBonus.hp }}
          </div>
        </div>
      </div>
    </div>

    <!-- 計算按鈕 -->
    <div class="button-group">
      <button
        class="calculate-btn"
        :class="{ disabled: !canCalculate, loading: isCalculating }"
        :disabled="!canCalculate || isCalculating"
        @click="handleCalculate"
      >
        <span v-if="isCalculating" class="loading-spinner">⏳</span>
        🧮 {{ t('common.calculate', '計算屬性評價') }}
      </button>

      <button class="reset-btn" @click="handleReset" :disabled="isCalculating">
        🔄 {{ t('common.reset', '重置') }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { usePetEvaluateStore } from '../stores'
import type { CalculationMode, SelectedSkill } from '../types'
import PetSkillSelector from './PetSkillSelector.vue'
import { calculateSkillBonus } from '../utils/skillData'

const { t } = useI18n()

const petStore = usePetEvaluateStore()
const { petLevel, inputStats, expectedStats, canCalculate, isCalculating, selectedPet } =
  storeToRefs(petStore)

const { setPetLevel, resetInputStats, performCalculation } = petStore

// 計算模式狀態
const calculationMode = ref<CalculationMode>('manual')
const selectedSkills = ref<SelectedSkill[]>([])

// 計算技能加成
const skillBonus = computed(() => {
  if (calculationMode.value === 'smart' && selectedSkills.value.length > 0) {
    return calculateSkillBonus(selectedSkills.value)
  }
  return {
    endurance: 0,
    loyalty: 0,
    speed: 0,
    aggressiveness: 0,
    hp: 0,
  }
})

// 處理模式切換
function handleModeChange() {
  if (calculationMode.value === 'manual') {
    // 切換到手動模式時清空技能選擇
    selectedSkills.value = []
  }
}

// Check if it's the main stat
function isMainStat(statName: string): boolean {
  return selectedPet.value?.mainStat === statName
}

function handleLevelChange(event: Event) {
  const target = event.target as HTMLInputElement
  setPetLevel(parseInt(target.value) || 1)
}

function handleReset() {
  resetInputStats()
}

async function handleCalculate() {
  if (!canCalculate.value) return

  try {
    // 如果是智能模式，需要先計算技能加成並調整輸入值
    if (calculationMode.value === 'smart' && selectedSkills.value.length > 0) {
      await performCalculationWithSkills()
    } else {
      await performCalculation()
    }
  } catch (error) {
    console.error('Calculation error:', error)
    // TODO: Show error notification
  }
}

// 帶技能計算的函數
async function performCalculationWithSkills() {
  const skillBonusValue = calculateSkillBonus(selectedSkills.value)

  // 創建調整後的輸入值（原始值 - 技能加成）
  const adjustedStats = {
    endurance: Math.max(0, inputStats.value.endurance - skillBonusValue.endurance),
    loyalty: Math.max(0, inputStats.value.loyalty - skillBonusValue.loyalty),
    speed: Math.max(0, inputStats.value.speed - skillBonusValue.speed),
    aggressiveness: Math.max(0, inputStats.value.aggressiveness - skillBonusValue.aggressiveness),
    hp: Math.max(0, inputStats.value.hp - skillBonusValue.hp),
  }

  // 暫時保存原始值
  const originalStats = { ...inputStats.value }

  // 使用調整後的值進行計算
  Object.assign(inputStats.value, adjustedStats)

  try {
    const result = await performCalculation()

    // 將技能信息添加到計算結果中
    if (result && petStore.calculationResult) {
      petStore.calculationResult.skillBonus = skillBonusValue
      petStore.calculationResult.selectedSkills = [...selectedSkills.value]
    }

    return result
  } finally {
    // 恢復原始值
    Object.assign(inputStats.value, originalStats)
  }
}
</script>

<style scoped>
.input-section {
  margin-bottom: 40px;
}

.stats-input {
  background: var(--color-bg-secondary);
  border-radius: 15px;
  padding: 25px;
  border: 2px solid var(--color-border-primary);
  box-shadow: var(--shadow-sm);
}

.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.top-controls h3 {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.level-control {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.level-control .level-label {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 1rem;
  white-space: nowrap;
  margin: 0;
}

.level-control .level-input {
  width: 80px;
  padding: 8px 12px;
  border: 2px solid var(--color-border-primary);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  text-align: center;
}

.level-control .level-input:focus {
  outline: none;
  border-color: var(--color-text-accent);
  box-shadow: 0 0 10px rgba(97, 218, 251, 0.3);
}

.help-btn {
  background: var(--color-text-accent);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.help-btn:hover {
  background: #4fa8c5;
  transform: translateY(-2px);
}

/* 計算模式選擇 */
.calculation-mode {
  margin-bottom: 20px;
}

.calculation-mode h4 {
  color: var(--color-text-secondary);
  margin: 0 0 15px 0;
  font-size: 1.2rem;
}

.mode-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.mode-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: var(--color-bg-primary);
  border: 2px solid var(--color-border-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-option:hover {
  border-color: var(--color-text-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(97, 218, 251, 0.2);
}

.mode-option input[type='radio'] {
  margin: 0;
  transform: scale(1.2);
}

.mode-option input[type='radio']:checked + .mode-label {
  color: var(--color-text-accent);
}

.mode-option:has(input[type='radio']:checked) {
  border-color: var(--color-text-accent);
  background: rgba(97, 218, 251, 0.05);
}

.mode-label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mode-label strong {
  color: var(--color-text-primary);
  font-size: 1rem;
}

.mode-label small {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  line-height: 1.3;
}

.warning {
  background: rgba(229, 192, 123, 0.1);
  border: 1px solid #e5c07b;
  color: #e5c07b;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

/* 默認佈局 (中等螢幕) - 3+2 */
.stat-input:nth-child(1) {
  grid-column: 1 / 3;
}
.stat-input:nth-child(2) {
  grid-column: 3 / 5;
}
.stat-input:nth-child(3) {
  grid-column: 5 / 7;
}
.stat-input:nth-child(4) {
  grid-column: 2 / 4;
}
.stat-input:nth-child(5) {
  grid-column: 4 / 6;
}

.stat-input {
  background: var(--color-bg-primary);
  border-radius: 10px;
  padding: 20px;
  border: 2px solid var(--color-border-primary);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.stat-input:hover {
  border-color: var(--color-text-accent);
  box-shadow: 0 4px 15px rgba(97, 218, 251, 0.1);
}

.stat-input.main-stat {
  border-color: var(--color-text-warning);
  background: rgba(229, 192, 123, 0.05);
}

.stat-input.disabled {
  opacity: 0.7;
  background: #1a1d23;
}

.stat-title {
  text-align: center;
  margin-bottom: 12px;
}

.stat-title label {
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 1.1rem;
}

.main-stat-indicator {
  color: var(--color-text-warning);
  margin-left: 8px;
  background: rgba(255, 200, 1, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 0 5px rgba(255, 200, 1, 0.5);
}

.stat-desc {
  display: block;
  color: #5c6370;
  font-size: 0.85rem;
  font-style: italic;
}

.stat-value-input {
  width: 100%;
  padding: 12px;
  border: 2px solid var(--color-border-primary);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  text-align: center;
}

.stat-value-input:focus {
  outline: none;
  border-color: var(--color-text-accent);
  box-shadow: 0 0 10px rgba(97, 218, 251, 0.3);
  background: #21252b;
}

.stat-value-input:disabled {
  background-color: #21252b;
  color: #5c6370;
  cursor: not-allowed;
  border-color: #2c313c;
}

.expected-hint {
  text-align: center;
  margin-top: 8px;
  color: var(--color-text-accent);
  font-size: 0.8rem;
  opacity: 0.8;
}

.aggressiveness-note {
  display: block;
  margin-top: 8px;
  color: #5c6370;
  font-size: 0.75rem;
  text-align: center;
  font-style: italic;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.calculate-btn,
.reset-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.calculate-btn {
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
  color: white;
}

.calculate-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(97, 218, 251, 0.3);
}

.calculate-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.calculate-btn.loading {
  pointer-events: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

.reset-btn {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 2px solid var(--color-border-primary);
}

.reset-btn:hover {
  border-color: var(--color-text-warning);
  color: var(--color-text-warning);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 大螢幕 (1200px+): 1 row (5個一行) */
@media (min-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }

  /* 重置為單列佈局 */
  .stat-input:nth-child(1) {
    grid-column: 1;
  }
  .stat-input:nth-child(2) {
    grid-column: 2;
  }
  .stat-input:nth-child(3) {
    grid-column: 3;
  }
  .stat-input:nth-child(4) {
    grid-column: 4;
  }
  .stat-input:nth-child(5) {
    grid-column: 5;
  }
}

/* 小螢幕 (768px以下): 1 column */
@media (max-width: 768px) {
  .mode-options {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .mode-option {
    padding: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  /* 重置為垂直佈局 */
  .stat-input:nth-child(1),
  .stat-input:nth-child(2),
  .stat-input:nth-child(3),
  .stat-input:nth-child(4),
  .stat-input:nth-child(5) {
    grid-column: 1;
  }

  .top-controls {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .level-control {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .level-control .level-input {
    width: 120px;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }

  .calculate-btn,
  .reset-btn {
    width: 100%;
    max-width: 300px;
  }
}

.stat-input.skill-enhanced {
  border-color: var(--color-text-warning);
  background: rgba(229, 192, 123, 0.05);
}

.skill-note {
  display: block;
  margin-top: 8px;
  color: var(--color-text-warning);
  font-size: 0.75rem;
  text-align: center;
  font-style: italic;
  font-weight: 500;
}

.skill-bonus {
  text-align: center;
  margin-top: 8px;
  color: var(--color-text-accent);
  font-size: 0.75rem;
  font-style: italic;
}
</style>
