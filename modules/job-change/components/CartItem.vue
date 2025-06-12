<!--
/**
 * OrionLabs 轉職計算器 - 計算項目組件
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
  <div class="cart-item">
    <div class="item-info">
      <!-- 物品圖標 -->
      <div class="item-icon">
        {{ item.icon || '📦' }}
      </div>

      <!-- 物品詳情 -->
      <div class="item-details">
        <div class="item-name">{{ itemDisplayName }}</div>
        <div class="item-meta">
          <span class="item-type">{{ equipmentTypeName }}</span>
          <span :class="getQualityBadgeClasses(item.quality)" class="item-quality">
            {{ getQualityFullText(item.quality) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 數量控制 -->
    <div class="quantity-controls">
      <div class="quantity-display">× {{ item.quantity }}</div>
    </div>

    <!-- 成本顯示 -->
    <div class="cost-info">
      <div class="total-cost">
        {{ formatCost(item.cost) }}
      </div>
      <div class="unit-cost-hint">{{ formatCost(item.unitCost) }}/個</div>
    </div>

    <!-- 操作按鈕 -->
    <div class="item-actions">
      <button class="remove-btn" @click="removeItem" title="移除物品">🗑️</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CartItem, InfoContent } from '../types'
import { getEquipmentName } from '../utils/costData'
import { formatCost } from '../utils/calculations'
import { getQualityBadgeClasses, getQualityFullText } from '../../shared/utils/quality'

// === 組件屬性 ===
interface Props {
  item: CartItem
}

const props = defineProps<Props>()

// === 組件事件 ===
const emit = defineEmits<{
  remove: [itemId: string]
  'update-quantity': [itemId: string, quantity: number]
  'show-info': [content: InfoContent]
}>()

const { t } = useI18n()

// === 響應式狀態 ===
const localQuantity = ref(props.item.quantity)

// === 計算屬性 ===

/**
 * 物品顯示名稱
 */
const itemDisplayName = computed(() => {
  return (
    props.item.name ||
    getEquipmentName(
      props.item.equipmentType,
      props.item.subtype,
      props.item.quality === 'cash' ? undefined : props.item.quality,
    )
  )
})

/**
 * 裝備類型名稱
 */
const equipmentTypeName = computed(() => {
  return t(`jobChange.categories.${props.item.equipmentType}`)
})

// 移除未使用的計算屬性

// === 監聽器 ===

// 同步外部數量變化
watch(
  () => props.item.quantity,
  (newQuantity) => {
    localQuantity.value = newQuantity
  },
)

// === 事件處理 ===

/**
 * 移除物品
 */
function removeItem() {
  emit('remove', props.item.id)
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
}

.cart-item:hover {
  border-color: #ced4da;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item:last-child {
  margin-bottom: 0;
}

/* 物品信息 */
.item-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.item-icon {
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  word-break: break-word;
}

.item-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.item-type,
.item-quality {
  padding: 0.125rem 0.5rem;
  background: #e9ecef;
  border-radius: 12px;
  font-size: 0.75rem;
  white-space: nowrap;
}

/* 數量控制 */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 0.25rem;
}

.quantity-display {
  font-weight: 600;
  color: #2c3e50;
}

/* 成本信息 */
.cost-info {
  text-align: right;
  min-width: 6rem;
}

.total-cost {
  font-weight: 600;
  color: #1a73e8;
  font-size: 0.95rem;
}

.unit-cost-hint {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.25rem;
}

/* 操作按鈕 */
.item-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.remove-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.3s;
  background: #dc3545;
  color: white;
}

.remove-btn:hover {
  background: #c82333;
  transform: scale(1.05);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }

  .item-info {
    gap: 0.5rem;
  }

  .item-meta {
    flex-wrap: wrap;
  }

  .quantity-controls {
    align-self: center;
  }

  .cost-info {
    text-align: center;
  }

  .item-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .cart-item {
    padding: 0.75rem;
  }

  .item-icon {
    width: 2rem;
    height: 2rem;
    font-size: 1.25rem;
  }

  .item-name {
    font-size: 0.9rem;
  }

  .cost-info {
    font-size: 0.85rem;
  }
}
</style>
