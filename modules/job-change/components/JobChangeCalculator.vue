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
  <div class="job-change-calculator">
    <!-- Header -->
    <header class="calculator-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">
            🏰 {{ t('jobChange.title') }}
            <span class="subtitle">{{ t('jobChange.subtitle') }}</span>
          </h1>
          <p class="description">{{ t('jobChange.description') }}</p>
        </div>
      </div>
    </header>

    <!-- 裝備選擇器 -->
    <section class="selector-section">
      <!-- 幫助按鈕 -->
      <div class="help-section">
        <button class="help-btn" @click="showHelpModal = true" :title="t('common.help')">
          <span class="help-icon">❓</span>
          <span class="help-text">{{ t('common.help') }}</span>
        </button>
      </div>

      <!-- 選擇器表單 -->
      <div class="selector-form">
        <!-- 裝備類型選擇 -->
        <select
          v-model="selectedEquipmentType"
          class="equipment-type-select"
          @change="onEquipmentTypeChange"
        >
          <option value="">{{ t('jobChange.categories.equipment') }}</option>
          <option v-for="(config, key) in equipmentOptions" :key="key" :value="key">
            {{ t(`jobChange.categories.${key}`) }}
          </option>
        </select>

        <!-- 具體類型選擇 -->
        <select
          v-model="selectedSubtype"
          class="equipment-subtype-select"
          :disabled="!selectedEquipmentType"
        >
          <option value="">{{ t('jobChange.selectSubtype') }}</option>
          <option v-for="(name, key) in subtypeOptions" :key="key" :value="key">
            {{ name }}
          </option>
        </select>

        <!-- 品質選擇 -->
        <select v-model="selectedQuality" class="quality-select" :disabled="!selectedSubtype">
          <option value="">{{ t('jobChange.selectQuality') }}</option>
          <option v-for="(name, key) in qualityOptions" :key="key" :value="key">
            {{ t(`jobChange.quality.${key}`) }}
          </option>
        </select>

        <!-- 數量輸入 -->
        <input
          v-model.number="selectedQuantity"
          type="number"
          class="quantity-input"
          min="1"
          :placeholder="t('common.quantity')"
          :disabled="!selectedQuality"
        />

        <!-- 添加按鈕 -->
        <button
          class="add-to-calculation-btn"
          :disabled="!canAddToCalculation"
          @click="handleAddToCalculation"
        >
          <i class="icon-plus"></i>
          {{ t('jobChange.cart.addToCart') }}
        </button>
      </div>

      <!-- 驗證錯誤提示 -->
      <div v-if="validationErrors.length > 0" class="validation-errors">
        <div v-for="error in validationErrors" :key="error" class="error-message">
          ⚠️ {{ error }}
        </div>
      </div>
    </section>

    <!-- 使用說明彈窗 -->
    <div v-if="showHelpModal" class="modal-overlay" @click="showHelpModal = false">
      <div class="help-modal" @click.stop>
        <div class="modal-header">
          <h3>📚 {{ t('jobChange.help.title') }}</h3>
          <button class="close-btn" @click="showHelpModal = false">✕</button>
        </div>

        <div class="modal-content">
          <div class="help-section-content">
            <h4>🎯 {{ t('jobChange.help.steps.title') }}</h4>
            <ol>
              <li>{{ t('jobChange.help.steps.step1') }}</li>
              <li>{{ t('jobChange.help.steps.step2') }}</li>
              <li>{{ t('jobChange.help.steps.step3') }}</li>
              <li>{{ t('jobChange.help.steps.step4') }}</li>
              <li>{{ t('jobChange.help.steps.step5') }}</li>
              <li>{{ t('jobChange.help.steps.step6') }}</li>
            </ol>
          </div>

          <div class="help-section-content">
            <h4>💰 {{ t('jobChange.help.costs.title') }}</h4>
            <div class="cost-table">
              <div class="cost-row">
                <span class="quality-label rare">{{ t('jobChange.help.costs.rare') }}</span>
                <span class="cost-value">{{ t('jobChange.help.costs.rareCost') }}</span>
              </div>
              <div class="cost-row">
                <span class="quality-label hero">{{ t('jobChange.help.costs.hero') }}</span>
                <span class="cost-value">{{ t('jobChange.help.costs.heroCost') }}</span>
              </div>
              <div class="cost-row">
                <span class="quality-label legend">{{ t('jobChange.help.costs.legend') }}</span>
                <span class="cost-value">{{ t('jobChange.help.costs.legendCost') }}</span>
              </div>
              <div class="cost-row">
                <span class="quality-label mythic">{{ t('jobChange.help.costs.mythic') }}</span>
                <span class="cost-value">{{ t('jobChange.help.costs.mythicCost') }}</span>
              </div>
              <div class="cost-row">
                <span class="quality-label cash">{{ t('jobChange.help.costs.cash') }}</span>
                <span class="cost-value">{{ t('jobChange.help.costs.cashCost') }}</span>
              </div>
            </div>
          </div>

          <div class="help-section-content">
            <h4>📊 {{ t('jobChange.help.limits.title') }}</h4>
            <ul>
              <li>{{ t('jobChange.help.limits.weapon') }}</li>
              <li>{{ t('jobChange.help.limits.armor') }}</li>
              <li>{{ t('jobChange.help.limits.accessory') }}</li>
              <li>{{ t('jobChange.help.limits.rune') }}</li>
              <li>{{ t('jobChange.help.limits.cashLimit') }}</li>
            </ul>
          </div>

          <div class="help-section-content">
            <h4>🎁 {{ t('jobChange.help.package.title') }}</h4>
            <p>{{ t('jobChange.help.package.description') }}</p>
          </div>

          <div class="help-section-content">
            <h4>⚠️ {{ t('jobChange.help.notes.title') }}</h4>
            <ul>
              <li>{{ t('jobChange.help.notes.baseCost') }}</li>
              <li>{{ t('jobChange.help.notes.crackEarring') }}</li>
              <li>{{ t('jobChange.help.notes.cashEquipment') }}</li>
              <li>{{ t('jobChange.help.notes.skillSpell') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 計算項目清單 -->
    <section class="calculation-container">
      <div class="calculation-header">
        <h3>📊 計算區</h3>
        <button
          class="clear-calculation-btn"
          @click="clearCart"
          :disabled="state.cartItems.length === 0"
        >
          {{ t('jobChange.cart.clearCart') }}
        </button>
      </div>

      <div class="calculation-content">
        <!-- 空計算項目提示 -->
        <div v-if="state.cartItems.length === 0" class="empty-calculation">
          <i class="icon-calculator"></i>
          <p>{{ t('jobChange.emptyCart') }}</p>
          <small>{{ t('jobChange.emptyCartHint') }}</small>
        </div>

        <!-- 計算項目列表 -->
        <div v-else class="calculation-items">
          <CartItem
            v-for="item in state.cartItems"
            :key="item.id"
            :item="item"
            @remove="removeFromCart"
            @update-quantity="updateCartItemQuantity"
            @show-info="handleShowInfo"
          />
        </div>
      </div>
    </section>

    <!-- 轉職硬幣禮包選項 - 重新設計版 -->
    <section class="package-option">
      <div class="package-card-new">
        <div class="package-main-content">
          <div class="package-info">
            <h3 class="package-title">🎁 {{ t('jobChange.packageNewTitle') }}</h3>
            <p class="package-subtitle">{{ t('jobChange.packageNewSubtitle') }}</p>
          </div>

          <div class="package-toggle">
            <label class="toggle-switch">
              <input v-model="state.hasPackageDiscount" type="checkbox" class="toggle-input" />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="package-discount-info">
          <span class="discount-text">{{ t('jobChange.packageNewDiscount') }}</span>
          <div class="discount-badge">-300 💰</div>
        </div>
      </div>
    </section>

    <!-- 費用總計顯示 - 優化版 -->
    <section v-if="costDetails" class="cost-summary">
      <div class="summary-header">
        <h3>💰 {{ t('jobChange.costSummaryTitle') }}</h3>
        <span class="summary-badge">{{ t('jobChange.costSummaryBadge') }}</span>
      </div>
      <div class="cost-breakdown">
        <!-- 基本轉職費用 -->
        <div class="cost-item">
          <span class="cost-label">{{ t('jobChange.cost.baseCost') }}:</span>
          <span class="cost-value">{{ formatCost(costDetails.baseCost, 'diamond') }}</span>
        </div>

        <!-- 各類成本明細 -->
        <div v-if="costDetails.equipmentCost > 0" class="cost-item">
          <span class="cost-label">{{ t('modal.info.equipmentCost') }}:</span>
          <span class="cost-value">{{ formatCost(costDetails.equipmentCost) }}</span>
        </div>

        <div v-if="costDetails.skillCost > 0" class="cost-item">
          <span class="cost-label">{{ t('modal.info.skillCost') }}:</span>
          <span class="cost-value">{{ formatCost(costDetails.skillCost) }}</span>
        </div>

        <div v-if="costDetails.spellCost > 0" class="cost-item">
          <span class="cost-label">{{ t('modal.info.spellCost') }}:</span>
          <span class="cost-value">{{ formatCost(costDetails.spellCost) }}</span>
        </div>

        <div v-if="costDetails.cashCost > 0" class="cost-item">
          <span class="cost-label">{{ t('jobChange.cashEquipmentCost') }}:</span>
          <span class="cost-value">{{ formatCost(costDetails.cashCost) }}</span>
        </div>

        <!-- 套餐折扣 -->
        <div v-if="costDetails.packageDiscount > 0" class="cost-item discount">
          <span class="cost-label">{{ t('jobChange.cost.packageDiscount') }}:</span>
          <span class="cost-value">-{{ formatCost(costDetails.packageDiscount) }}</span>
        </div>

        <!-- 總計 -->
        <div class="cost-item total-cost">
          <span class="cost-label">{{ t('jobChange.cost.coinCost') }}:</span>
          <span class="cost-value">{{ formatCost(costDetails.finalCoinCost) }}</span>
        </div>

        <div class="cost-item grand-total">
          <span class="cost-label">{{ t('jobChange.cost.totalCost') }}:</span>
          <span class="cost-value">
            {{ formatCost(costDetails.baseCost, 'diamond') }} +
            {{ formatCost(costDetails.finalCoinCost) }}
          </span>
        </div>
      </div>

      <!-- 驗證警告 -->
      <div v-if="validation.warnings.length > 0" class="validation-warnings">
        <div v-for="warning in validation.warnings" :key="warning" class="warning-message">
          ⚠️ {{ warning }}
        </div>
      </div>

      <!-- 驗證錯誤 -->
      <div v-if="validation.errors.length > 0" class="validation-errors">
        <div v-for="error in validation.errors" :key="error" class="error-message">
          ❌ {{ error }}
        </div>
      </div>
    </section>

    <!-- 移除自定義 Footer，使用共用的 AppFooter -->

    <!-- 使用條款彈窗 (點擊時才顯示) -->
    <div v-if="showTermsModal" class="modal-overlay" @click="showTermsModal = false">
      <div class="terms-modal" @click.stop>
        <div class="modal-header">
          <h3>📜 {{ t('jobChange.terms.title') }}</h3>
          <button class="close-btn" @click="showTermsModal = false">✕</button>
        </div>

        <div class="modal-content">
          <div class="terms-content">
            <h4>📋 {{ t('jobChange.terms.usage.title') }}</h4>
            <ol>
              <li>
                <strong>{{ t('jobChange.terms.usage.copyright') }}</strong>
              </li>
              <li>
                <strong>{{ t('jobChange.terms.usage.scope') }}</strong>
              </li>
              <li>
                <strong>{{ t('jobChange.terms.usage.commercial') }}</strong>
              </li>
              <li>
                <strong>{{ t('jobChange.terms.usage.protection') }}</strong>
              </li>
              <li>
                <strong>{{ t('jobChange.terms.usage.accuracy') }}</strong>
              </li>
            </ol>

            <h4>⚠️ {{ t('jobChange.terms.disclaimer.title') }}</h4>
            <ul>
              <li>{{ t('jobChange.terms.disclaimer.reference') }}</li>
              <li>{{ t('jobChange.terms.disclaimer.responsibility') }}</li>
              <li>{{ t('jobChange.terms.disclaimer.official') }}</li>
            </ul>

            <h4>📞 {{ t('jobChange.terms.contact.title') }}</h4>
            <p>{{ t('jobChange.terms.contact.description') }}</p>
            <ul>
              <li>Email: orion@lineagew-labs.com</li>
              <li>
                Website:
                <a href="https://orionlabs.pro" target="_blank" rel="noopener noreferrer"
                  >orionlabs.pro</a
                >
              </li>
              <li>
                GitHub:
                <a
                  href="https://github.com/kao1987/OrionLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  >kao1987/OrionLabs</a
                >
              </li>
            </ul>

            <div class="terms-footer">
              <p>
                <strong>{{ t('jobChange.terms.footer.updated') }}</strong>
              </p>
              <p>{{ t('jobChange.terms.footer.agreement') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useJobChangeCalculator } from '../composables/useJobChangeCalculator'
import type {
  EquipmentCategory,
  EquipmentType,
  CashEquipmentType,
  QualityLevel,
  InfoContent,
} from '../types'
import CartItem from './CartItem.vue'
import {
  EQUIPMENT_OPTIONS,
  QUALITY_OPTIONS,
  SKILL_QUALITY_OPTIONS,
  SPELL_QUALITY_OPTIONS,
} from '../utils/costData'
// === 組件事件 ===
const emit = defineEmits<{
  'show-help': []
  'show-info': [content: InfoContent]
}>()

// === 使用 Composable ===
const { t } = useI18n()
const calculatorService = useJobChangeCalculator()

const {
  // 狀態
  state,
  costDetails,
  cartItems,

  // 購物車操作
  addToCart,
  removeFromCart: removeFromCartService,
  clearCart,

  // 工具函數
  formatCurrency,
} = calculatorService

// 本地狀態
const selectedEquipmentType = ref<string>('')
const selectedSubtype = ref<string>('')
const selectedQuality = ref<string>('')
const selectedQuantity = ref<number>(1)
const showHelpModal = ref<boolean>(false)
const showTermsModal = ref<boolean>(false)

// 計算屬性
const validation = computed(() => ({
  isValid: true,
  errors: [] as string[],
  warnings: [] as string[],
}))

const validationErrors = computed(() => [])

const subtypeOptions = computed(() => {
  if (!selectedEquipmentType.value) return {}

  const equipmentConfig =
    EQUIPMENT_OPTIONS[selectedEquipmentType.value as keyof typeof EQUIPMENT_OPTIONS]
  return equipmentConfig?.subtypes || {}
})

const qualityOptions = computed(() => {
  if (selectedEquipmentType.value === 'skill') {
    return SKILL_QUALITY_OPTIONS
  } else if (selectedEquipmentType.value === 'spell') {
    return SPELL_QUALITY_OPTIONS
  } else if (selectedEquipmentType.value === 'cash') {
    return { cash: '💼 商城' }
  } else {
    return QUALITY_OPTIONS
  }
})

const canAddToCalculation = computed(() => {
  return (
    selectedEquipmentType.value &&
    selectedSubtype.value &&
    selectedQuality.value &&
    selectedQuantity.value > 0
  )
})

const equipmentOptions = computed(() => EQUIPMENT_OPTIONS)

// 函數包裝
const removeFromCart = (itemId: string) => {
  const index = cartItems.value.findIndex((item) => item.id === itemId)
  if (index !== -1) {
    removeFromCartService(index)
  }
}

const updateCartItemQuantity = (_itemId: string, _quantity: number) => {
  // 實現更新計算項目數量
  console.log('更新計算項目數量:', _itemId, _quantity)
}

const resetForm = () => {
  selectedEquipmentType.value = ''
  selectedSubtype.value = ''
  selectedQuality.value = ''
  selectedQuantity.value = 1
}

const formatCost = (amount: number, type?: 'coin' | 'diamond') => {
  return formatCurrency(amount, type)
}

// 移除不再使用的 formatDate 函數

// === 事件處理 ===

/**
 * 處理裝備類型變更
 */
function onEquipmentTypeChange() {
  selectedSubtype.value = ''
  selectedQuality.value = ''
}

/**
 * 處理添加到購物車
 */
function handleAddToCalculation() {
  const item = {
    equipmentType: selectedEquipmentType.value as EquipmentCategory,
    subtype: selectedSubtype.value as EquipmentType | CashEquipmentType,
    quality: selectedQuality.value as QualityLevel | 'cash',
    quantity: selectedQuantity.value,
    name: `${selectedSubtype.value} (${selectedQuality.value})`,
    unitCost: 0,
  }
  const success = addToCart(item)
  if (success) {
    // 可以添加成功提示
    console.log('已添加到購物車')
    resetForm()
  }
}

/**
 * 處理顯示信息
 */
function handleShowInfo(content: InfoContent) {
  emit('show-info', content)
}

// === 監聽器 ===

// 監聽購物車變化，自動計算成本
watch(
  () => state.cartItems.length,
  (newLength) => {
    console.log(`購物車項目數量: ${newLength}`)
  },
)
</script>

<style scoped>
/* 基礎樣式 */
.job-change-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: var(--text-color, #2c3e50);
  background: transparent;
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* 大螢幕響應式設計 */
@media (min-width: 1400px) {
  .job-change-calculator {
    max-width: 1400px;
    padding: 3rem;
  }
}

@media (min-width: 1600px) {
  .job-change-calculator {
    max-width: 1600px;
    padding: 4rem;
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .job-change-calculator {
    --text-color: #e9ecef;
    --bg-color: #1a1a1a;
    --card-bg: #2d2d2d;
    --border-color: #495057;
    --input-bg: #343a40;
    --package-bg-start: #332a1a;
    --package-bg-end: #4a3728;
    --package-border: #ff9800;
    --package-text: #ffb74d;
    --package-note: #ff8a65;
  }
}

[data-theme='dark'] .job-change-calculator {
  --text-color: #e9ecef;
  --bg-color: #1a1a1a;
  --card-bg: #2d2d2d;
  --border-color: #495057;
  --input-bg: #343a40;
  --package-bg-start: #332a1a;
  --package-bg-end: #4a3728;
  --package-border: #ff9800;
  --package-text: #ffb74d;
  --package-note: #ff8a65;
}

/* 選擇器區域 */
.selector-section {
  background: #282c34;
  border: 2px solid #ffc801;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow:
    0 0 20px rgba(255, 200, 1, 0.3),
    inset 0 1px 0 rgba(255, 200, 1, 0.1);
  transition: all 0.3s ease;
}

.help-section {
  text-align: right;
  margin-bottom: 1.5rem;
}

.help-btn {
  background: linear-gradient(135deg, #17a2b8, #138496);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(23, 162, 184, 0.3);
}

.help-btn:hover {
  background: linear-gradient(135deg, #138496, #117a8b);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(23, 162, 184, 0.4);
}

.selector-form {
  display: grid;
  grid-template-columns: 2fr 2fr 2fr 1fr 2fr;
  gap: 1.5rem;
  align-items: stretch;
  min-height: 60px;
}

@media (max-width: 1024px) {
  .selector-form {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
  }

  .add-to-calculation-btn {
    grid-column: 1 / -1;
    justify-self: center;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .job-change-calculator {
    padding: 1.5rem;
  }

  .selector-form {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .add-to-calculation-btn {
    grid-column: 1;
    padding: 1rem 2rem;
    font-size: 0.9rem;
  }

  .calculation-header {
    padding: 1rem 1.5rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .calculation-content {
    padding: 1.5rem;
  }

  .help-section {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .job-change-calculator {
    padding: 1rem;
  }

  .selector-section {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .selector-form {
    gap: 0.75rem;
    align-items: center;
  }

  .equipment-type-select,
  .equipment-subtype-select,
  .quality-select {
    padding: 0.75rem;
    font-size: 0.9rem;
    min-height: 44px;
  }

  .quantity-input {
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
    padding: 0.75rem;
    text-align: center;
  }

  .add-to-calculation-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.85rem;
    min-width: 100px;
    height: 44px;
  }

  .calculation-header {
    padding: 1rem;
    flex-direction: column;
    gap: 0.75rem;
  }

  .calculation-header h3 {
    font-size: 1.1rem;
  }

  .clear-calculation-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    width: 100%;
  }

  .calculation-content {
    padding: 1rem;
  }

  .help-btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    width: 100%;
  }

  .help-modal {
    width: 95%;
    max-height: 90vh;
  }

  .modal-content {
    padding: 1rem;
    font-size: 0.9rem;
  }

  .cost-row {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

.equipment-type-select,
.equipment-subtype-select,
.quality-select {
  padding: 1rem;
  border: 1px solid #ffc801;
  border-radius: 8px;
  background: #21252b;
  color: #abb2bf;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 200, 1, 0.1);
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.equipment-type-select:hover,
.equipment-subtype-select:hover,
.quality-select:hover {
  border-color: #ffc801;
  box-shadow: 0 0 15px rgba(255, 200, 1, 0.4);
  background: #2c313a;
}

.equipment-type-select:focus,
.equipment-subtype-select:focus,
.quality-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15);
  transform: translateY(-1px);
}

.quantity-input {
  padding: 1rem;
  border: 2px solid var(--border-color, #ced4da);
  border-radius: 8px;
  width: 120px;
  text-align: center;
  background: var(--input-bg, white);
  color: var(--text-color, #495057);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.add-to-calculation-btn {
  background: linear-gradient(135deg, #ffc801, #ffb347);
  color: #1a1d23;
  border: none;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 6px 20px rgba(255, 200, 1, 0.25);
  text-transform: none;
  letter-spacing: 0.5px;
  white-space: nowrap;
  min-width: 120px;
  height: 48px;
  position: relative;
  overflow: hidden;
}

.add-to-calculation-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.add-to-calculation-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #ffb347, #ffa000);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 200, 1, 0.4);
}

.add-to-calculation-btn:hover:not(:disabled)::before {
  left: 100%;
}

.add-to-calculation-btn:disabled {
  background: #5c6370;
  color: #abb2bf;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.6;
}

/* 計算項目容器 */
.calculation-container {
  background: #282c34;
  border: 2px solid #ffc801;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow:
    0 0 20px rgba(255, 200, 1, 0.3),
    inset 0 1px 0 rgba(255, 200, 1, 0.1);
  overflow: hidden;
}

.calculation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #21252b, #2c313a);
  border-bottom: 1px solid #ffc801;
  position: relative;
  overflow: hidden;
}

.calculation-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 200, 1, 0.05), transparent);
  animation: headerFlow 6s ease-in-out infinite;
}

@keyframes headerFlow {
  0%,
  100% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
}

.calculation-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #abb2bf;
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.clear-calculation-btn {
  background: linear-gradient(135deg, #e06c75, #be5046);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(224, 108, 117, 0.3);
  position: relative;
  z-index: 1;
}

.clear-calculation-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #be5046, #a0403b);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(224, 108, 117, 0.4);
}

.calculation-content {
  padding: 2rem;
  background: rgba(26, 29, 35, 0.3);
}

.empty-calculation {
  text-align: center;
  padding: 3rem 2rem;
  color: #5c6370;
}

.empty-calculation i {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.calculation-items > * + * {
  margin-top: 1.5rem;
}

/* 轉職硬幣禮包 - 重新設計 */
.package-option {
  margin: 2rem 0;
}

.package-card-new {
  background: linear-gradient(135deg, #1a1d23 0%, #282c34 50%, #21252b 100%);
  border: 2px solid #ffc801;
  border-radius: 16px;
  padding: 0;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(255, 200, 1, 0.3),
    0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.package-card-new::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 200, 1, 0.1), transparent);
  animation: packageShimmer 4s ease-in-out infinite;
}

.package-card-new:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 40px rgba(255, 200, 1, 0.4),
    0 12px 40px rgba(0, 0, 0, 0.3);
}

.package-main-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  position: relative;
  z-index: 1;
}

.package-info {
  flex: 1;
}

.package-title {
  color: #abb2bf;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.package-subtitle {
  color: #5c6370;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
  font-style: italic;
}

.package-toggle {
  margin-left: 2rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  cursor: pointer;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #5c6370;
  border: 2px solid #3a3f4b;
  border-radius: 34px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 24px;
  width: 24px;
  left: 3px;
  bottom: 3px;
  background: linear-gradient(135deg, #e8e8e8, #c0c0c0);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.toggle-input:checked + .toggle-slider {
  background: linear-gradient(135deg, #ffc801, #ffb347);
  border-color: #ffc801;
  box-shadow:
    inset 0 2px 4px rgba(255, 200, 1, 0.3),
    0 0 20px rgba(255, 200, 1, 0.4);
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(26px);
  background: linear-gradient(135deg, #fff, #f8f8f8);
  box-shadow: 0 2px 12px rgba(255, 200, 1, 0.5);
}

.package-discount-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 200, 1, 0.1);
  border-top: 1px solid rgba(255, 200, 1, 0.2);
  position: relative;
  z-index: 1;
}

.discount-text {
  color: #abb2bf;
  font-size: 0.95rem;
  font-weight: 500;
}

.discount-badge {
  background: linear-gradient(135deg, #ffc801, #ffb347);
  color: #1a1d23;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(255, 200, 1, 0.3);
  border: 1px solid rgba(255, 200, 1, 0.5);
}

@keyframes packageShimmer {
  0%,
  100% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
}

/* RWD 響應式設計 */

/* 桌面版 (1024px+) - 已為預設樣式 */

/* 平板版 (768px - 1023px) */
@media (max-width: 1023px) and (min-width: 768px) {
  .package-card-new {
    border-radius: 12px;
  }

  .package-main-content {
    padding: 1.25rem 1.5rem;
  }

  .package-title {
    font-size: 1.3rem;
  }

  .package-subtitle {
    font-size: 0.85rem;
  }

  .package-toggle {
    margin-left: 1.5rem;
  }

  .toggle-switch {
    width: 55px;
    height: 30px;
  }

  .toggle-slider:before {
    height: 22px;
    width: 22px;
    left: 2px;
    bottom: 2px;
  }

  .toggle-input:checked + .toggle-slider:before {
    transform: translateX(23px);
  }

  .package-discount-info {
    padding: 0.875rem 1.5rem;
  }
}

/* 手機版 (480px - 767px) */
@media (max-width: 767px) and (min-width: 480px) {
  .package-card-new {
    border-radius: 12px;
    margin: 1.5rem 0;
  }

  .package-main-content {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem;
    gap: 1rem;
  }

  .package-info {
    width: 100%;
  }

  .package-title {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
  }

  .package-subtitle {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .package-toggle {
    margin-left: 0;
    align-self: center;
  }

  .toggle-switch {
    width: 50px;
    height: 28px;
  }

  .toggle-slider:before {
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
  }

  .toggle-input:checked + .toggle-slider:before {
    transform: translateX(20px);
  }

  .package-discount-info {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 1.25rem;
    text-align: center;
  }

  .discount-text {
    font-size: 0.9rem;
  }

  .discount-badge {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

/* 小手機版 (479px以下) */
@media (max-width: 479px) {
  .package-option {
    margin: 1.5rem 0;
  }

  .package-card-new {
    border-radius: 10px;
    border-width: 1.5px;
  }

  .package-main-content {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .package-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .package-subtitle {
    font-size: 0.8rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .package-toggle {
    margin-left: 0;
    align-self: center;
  }

  .toggle-switch {
    width: 45px;
    height: 26px;
  }

  .toggle-slider:before {
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
  }

  .toggle-input:checked + .toggle-slider:before {
    transform: translateX(17px);
  }

  .package-discount-info {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    text-align: center;
  }

  .discount-text {
    font-size: 0.85rem;
    line-height: 1.3;
  }

  .discount-badge {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
  }
}

/* 費用總計 - 現代化設計 */
.cost-summary {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 0;
  box-shadow:
    0 20px 60px rgba(102, 126, 234, 0.2),
    0 8px 32px rgba(118, 75, 162, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.summary-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.summary-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.cost-breakdown {
  display: grid;
  gap: 1rem;
  padding: 2rem;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  border-left: 5px solid #6c757d;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cost-item:hover {
  transform: translateX(8px) translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.cost-item.discount {
  border-left-color: #28a745;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(40, 167, 69, 0.02) 100%);
}

.cost-item.discount:hover {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.15) 0%, rgba(40, 167, 69, 0.05) 100%);
}

.cost-item.total-cost {
  border-left-color: #007bff;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.08) 0%, rgba(0, 123, 255, 0.02) 100%);
  font-weight: 600;
}

.cost-item.total-cost:hover {
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.15) 0%, rgba(0, 123, 255, 0.05) 100%);
}

.cost-item.grand-total {
  border-left-color: #dc3545;
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.08) 0%, rgba(220, 53, 69, 0.02) 100%);
  font-weight: 700;
  font-size: 1.15rem;
  padding: 1.25rem 1.5rem;
}

.cost-item.grand-total:hover {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(220, 53, 69, 0.05) 100%);
}

.cost-label {
  font-weight: 500;
  color: var(--text-color, #495057);
}

.cost-value {
  font-weight: 600;
  color: var(--text-color, #2c3e50);
}

/* 驗證消息 */
.validation-warnings,
.validation-errors {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
}

.validation-warnings {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid #ffc107;
}

.validation-errors {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
}

.warning-message,
.error-message {
  padding: 0.5rem;
  margin: 0.25rem 0;
  border-radius: 4px;
}

.warning-message {
  background: rgba(255, 193, 7, 0.2);
  color: #856404;
}

.error-message {
  background: rgba(220, 53, 69, 0.2);
  color: #721c24;
}

/* 微互動和動畫 */
.cost-breakdown {
  animation: fadeInUp 0.6s ease-out;
}

.cost-item {
  opacity: 0;
  animation: slideInLeft 0.5s ease-out forwards;
}

.cost-item:nth-child(1) {
  animation-delay: 0.1s;
}
.cost-item:nth-child(2) {
  animation-delay: 0.2s;
}
.cost-item:nth-child(3) {
  animation-delay: 0.3s;
}
.cost-item:nth-child(4) {
  animation-delay: 0.4s;
}
.cost-item:nth-child(5) {
  animation-delay: 0.5s;
}
.cost-item:nth-child(6) {
  animation-delay: 0.6s;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .job-change-calculator {
    padding: 1rem;
  }

  .selector-section,
  .calculation-container,
  .cost-summary .cost-breakdown {
    padding: 1.5rem;
  }

  .summary-header {
    padding: 1.2rem 1.5rem;
  }

  .summary-header h3 {
    font-size: 1.2rem;
  }

  .package-card {
    padding: 1.2rem;
  }

  .cost-item {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }

  .cost-item.grand-total {
    padding: 1rem 1rem;
    font-size: 1.05rem;
    .add-to-calculation-btn {
      padding: 1rem 1.5rem;
      font-size: 0.9rem;
    }
  }
}

/* 使用說明彈窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.help-modal {
  background: var(--card-bg, white);
  border-radius: 16px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-content {
  padding: 2rem;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
  color: var(--text-color, #2c3e50);
}

.help-section-content {
  margin-bottom: 2rem;
}

.help-section-content h4 {
  color: var(--text-color, #2c3e50);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.help-section-content ol,
.help-section-content ul {
  padding-left: 1.5rem;
  line-height: 1.6;
}

.help-section-content li {
  margin-bottom: 0.5rem;
}

.cost-table {
  background: var(--card-bg, #f8f9fa);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quality-label {
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  color: white;
  font-size: 0.9rem;
}

.quality-label.rare {
  background: #0154a0;
}

.quality-label.hero {
  background: #e90003;
}

.quality-label.legend {
  background: #4e0180;
}

.quality-label.mythic {
  background: #ffc801;
  color: #2c3e50;
}

.quality-label.cash {
  background: #6c757d;
}

.cost-value {
  font-weight: 600;
  color: var(--text-color, #2c3e50);
}

/* 動畫效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Footer */
/* Footer 樣式已移除，使用共用的 AppFooter */

/* 使用條款彈窗樣式 */
.terms-modal {
  background: var(--card-bg, white);
  border-radius: 16px;
  max-width: 700px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideInUp 0.3s ease-out;
}

.terms-content {
  line-height: 1.6;
}

.terms-content h4 {
  color: var(--text-color, #2c3e50);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.terms-content ol,
.terms-content ul {
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.terms-content li {
  margin-bottom: 0.75rem;
}

.terms-content a {
  color: #007bff;
  text-decoration: none;
}

.terms-content a:hover {
  text-decoration: underline;
}

.terms-footer {
  background: var(--card-bg, #f8f9fa);
  padding: 1rem;
  margin: 1.5rem -1rem -1rem -1rem;
  border-radius: 0 0 8px 8px;
  text-align: center;
  border-top: 1px solid #e9ecef;
}

.terms-footer p {
  margin: 0.25rem 0;
  color: var(--text-color, #6c757d);
  font-size: 0.9rem;
}
</style>
