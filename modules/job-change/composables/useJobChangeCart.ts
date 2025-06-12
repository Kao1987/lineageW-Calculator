/**
 * 轉職計算器購物車組合式函數
 * 完整移轉自 assets/js/modules/jobChangeCalculator.js 的購物車功能
 */
import { ref, computed, watch } from 'vue'
import type {
  CartItem,
  EquipmentType,
  CashEquipmentType,
  QualityLevel,
  EquipmentCategory,
  CartItemInput,
} from '../types'
import { calculateItemCost, calculateCartCost } from '../utils/calculations'
import { BASE_COST } from '../utils/costData'
import { trackEvent } from '../../shared/utils'

/**
 * 購物車管理組合式函數
 */
export function useJobChangeCart() {
  // 響應式狀態
  const cartItems = ref<CartItem[]>([])
  const cartInput = ref<CartItemInput>({
    equipmentType: '',
    subtype: '',
    quality: '',
    quantity: 1,
  })

  // 計算屬性
  const totalCoinCost = computed(() => calculateCartCost(cartItems.value))
  const itemCount = computed(() => cartItems.value.length)
  const totalQuantity = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0),
  )

  const isEmpty = computed(() => cartItems.value.length === 0)

  /**
   * 獲取子類型選項
   */
  function getSubtypeOptions(equipmentType: EquipmentCategory): Array<{
    value: string
    text: string
    max: number
  }> {
    const options: Array<{ value: string; text: string; max: number }> = []

    switch (equipmentType) {
      case 'armor':
        options.push(
          { value: 'helmet', text: '頭盔', max: 2 },
          { value: 'cloak', text: '斗篷', max: 2 },
          { value: 'chest', text: '盔甲', max: 2 },
          { value: 'arms', text: '臂甲', max: 2 },
          { value: 'boots', text: '鞋子', max: 2 },
          { value: 'gloves', text: '手套', max: 2 },
          { value: 'legs', text: '脛甲', max: 2 },
          { value: 'belt', text: '腰帶', max: 2 },
        )
        break
      case 'accessory':
        options.push(
          { value: 'necklace', text: '項鍊', max: 2 },
          { value: 'earring', text: '耳環', max: 2 },
          { value: 'crack-earring', text: '裂痕耳環', max: 1 },
          { value: 'ring', text: '戒指', max: 4 },
          { value: 'rune', text: '符石', max: 2 },
        )
        break
      case 'cash':
        options.push(
          { value: 'shirt', text: 'T恤', max: 3 },
          { value: 'shoulder', text: '肩甲', max: 1 },
          { value: 'mask', text: '面甲', max: 1 },
        )
        break
      case 'weapon':
        options.push({ value: 'weapon', text: '武器', max: 3 })
        break
    }

    return options
  }

  /**
   * 獲取品質選項
   */
  function getQualityOptions(subtypeValue: string): Array<{
    value: string
    text: string
    quality: string
    cost: number | 'complex'
    max: number
  }> {
    const options: Array<{
      value: string
      text: string
      quality: string
      cost: number | 'complex'
      max: number
    }> = []

    // 判斷裝備類型
    if (subtypeValue === 'rune') {
      // 符石只有英雄和傳說
      options.push(
        { value: 'hero', text: '英雄', quality: 'hero', cost: 9, max: 2 },
        { value: 'legend', text: '傳說', quality: 'legend', cost: 27, max: 2 },
      )
    } else if (subtypeValue === 'crack-earring') {
      // 裂痕耳環只有稀有及英雄
      options.push(
        { value: 'rare', text: '稀有', quality: 'rare', cost: 1, max: 1 },
        { value: 'hero', text: '英雄', quality: 'hero', cost: 9, max: 1 },
      )
    } else if (['shirt', 'shoulder', 'mask'].includes(subtypeValue)) {
      // 商城裝備沒有品質概念
      const maxCount = getSubtypeMaxCount(subtypeValue)
      options.push({ value: 'normal', text: '一般', quality: 'mythic', cost: 5, max: maxCount })
    } else {
      // 其他一般裝備四種品質
      const maxCount = getSubtypeMaxCount(subtypeValue)
      const isWeapon = subtypeValue === 'weapon'

      options.push(
        {
          value: 'rare',
          text: '稀有',
          quality: 'rare',
          cost: 1,
          max: isWeapon ? 3 : maxCount,
        },
        {
          value: 'hero',
          text: '英雄',
          quality: 'hero',
          cost: 9,
          max: isWeapon ? 3 : maxCount,
        },
        {
          value: 'legend',
          text: '傳說',
          quality: 'legend',
          cost: 27,
          max: isWeapon ? 3 : maxCount,
        },
        {
          value: 'mythic',
          text: '神話',
          quality: 'mythic',
          cost: 81,
          max: isWeapon ? 3 : maxCount,
        },
      )
    }

    return options
  }

  /**
   * 獲取子類型最大數量
   */
  function getSubtypeMaxCount(subtypeValue: string): number {
    const maxCounts: Record<string, number> = {
      weapon: 3,
      helmet: 2,
      cloak: 2,
      chest: 2,
      arms: 2,
      boots: 2,
      gloves: 2,
      legs: 2,
      belt: 2,
      necklace: 2,
      earring: 2,
      'crack-earring': 1,
      ring: 4,
      rune: 2,
      shirt: 3,
      shoulder: 1,
      mask: 1,
    }
    return maxCounts[subtypeValue] || 1
  }

  /**
   * 驗證購物車輸入
   */
  function validateCartInput(): boolean {
    const { equipmentType, subtype, quality, quantity } = cartInput.value

    // 檢查必填欄位
    if (!equipmentType || !subtype || !quality || quantity <= 0) {
      return false
    }

    // 檢查數量上限
    const maxCount = getSubtypeMaxCount(subtype)
    if (quantity > maxCount) {
      return false
    }

    return true
  }

  /**
   * 添加項目到購物車
   */
  function addToCart(): boolean {
    if (!validateCartInput()) {
      return false
    }

    const { equipmentType, subtype, quality, quantity } = cartInput.value

    try {
      // 計算成本
      const cost = calculateItemCost(
        subtype as EquipmentType | CashEquipmentType,
        quality as QualityLevel | 'cash',
        quantity,
      )

      // 創建購物車項目
      const cartItem: CartItem = {
        id: `${Date.now()}-${Math.random()}`,
        equipmentType: equipmentType as EquipmentCategory,
        subtype: subtype as EquipmentType | CashEquipmentType,
        quality: quality as QualityLevel | 'cash',
        quantity,
        cost,
        unitCost: cost / quantity,
        timestamp: Date.now(),
        name: getItemDisplayName(subtype, quality),
        icon: getEquipmentIcon(equipmentType as EquipmentCategory),
      }

      // 檢查是否已存在相同項目
      const existingIndex = cartItems.value.findIndex(
        (item) => item.subtype === cartItem.subtype && item.quality === cartItem.quality,
      )

      if (existingIndex >= 0) {
        // 更新現有項目
        const existingItem = cartItems.value[existingIndex]
        const newQuantity = existingItem.quantity + quantity
        const maxCount = getSubtypeMaxCount(subtype)

        if (newQuantity <= maxCount) {
          existingItem.quantity = newQuantity
          existingItem.cost = existingItem.unitCost * newQuantity
        } else {
          // 超出限制，設為最大值
          existingItem.quantity = maxCount
          existingItem.cost = existingItem.unitCost * maxCount
        }
      } else {
        // 添加新項目
        cartItems.value.push(cartItem)
      }

      // 重置輸入
      resetCartInput()

      // 追蹤事件
      trackEvent('cart_item_added', {
        category: 'Job Change Calculator',
        label: `${subtype}_${quality}`,
        value: quantity,
        equipment_type: equipmentType,
        subtype,
        quality,
        quantity,
        cost,
      })

      return true
    } catch (error) {
      console.error('添加到購物車失敗:', error)
      return false
    }
  }

  /**
   * 移除購物車項目
   */
  function removeCartItem(itemId: string): void {
    const index = cartItems.value.findIndex((item) => item.id === itemId)
    if (index >= 0) {
      const removedItem = cartItems.value[index]
      cartItems.value.splice(index, 1)

      trackEvent('cart_item_removed', {
        category: 'Job Change Calculator',
        label: `${removedItem.subtype}_${removedItem.quality}`,
        value: removedItem.quantity,
        equipment_type: removedItem.equipmentType,
        subtype: removedItem.subtype,
        quality: removedItem.quality,
      })
    }
  }

  /**
   * 清空購物車
   */
  function clearCart(): void {
    const itemCount = cartItems.value.length
    cartItems.value.length = 0

    trackEvent('cart_cleared', {
      category: 'Job Change Calculator',
      label: 'manual_clear',
      value: itemCount,
    })
  }

  /**
   * 更新購物車項目數量
   */
  function updateCartItemQuantity(itemId: string, newQuantity: number): void {
    const item = cartItems.value.find((item) => item.id === itemId)
    if (!item) return

    const maxCount = getSubtypeMaxCount(item.subtype)
    const validQuantity = Math.min(Math.max(1, newQuantity), maxCount)

    item.quantity = validQuantity
    item.cost = item.unitCost * validQuantity
  }

  /**
   * 重置購物車輸入
   */
  function resetCartInput(): void {
    cartInput.value = {
      equipmentType: '',
      subtype: '',
      quality: '',
      quantity: 1,
    }
  }

  /**
   * 獲取項目顯示名稱
   */
  function getItemDisplayName(subtype: string, quality: string): string {
    const subtypeNames: Record<string, string> = {
      weapon: '武器',
      helmet: '頭盔',
      cloak: '斗篷',
      chest: '盔甲',
      arms: '臂甲',
      boots: '鞋子',
      gloves: '手套',
      legs: '脛甲',
      belt: '腰帶',
      necklace: '項鍊',
      earring: '耳環',
      'crack-earring': '裂痕耳環',
      ring: '戒指',
      rune: '符石',
      shirt: 'T恤',
      shoulder: '肩甲',
      mask: '面甲',
    }

    const qualityNames: Record<string, string> = {
      rare: '稀有',
      hero: '英雄',
      legend: '傳說',
      mythic: '神話',
      normal: '一般',
    }

    return `${qualityNames[quality] || quality} ${subtypeNames[subtype] || subtype}`
  }

  /**
   * 獲取裝備圖標
   */
  function getEquipmentIcon(equipmentType: EquipmentCategory): string {
    const icons: Record<EquipmentCategory, string> = {
      weapon: '⚔️',
      armor: '🛡️',
      accessory: '💍',
      cash: '👕',
      skill: '📚',
      spell: '✨',
    }
    return icons[equipmentType] || '📦'
  }

  /**
   * 獲取品質CSS類名
   */
  function getQualityClass(quality: string): string {
    const classNames: Record<string, string> = {
      rare: 'text-blue-600',
      hero: 'text-purple-600',
      legend: 'text-orange-600',
      mythic: 'text-red-600',
      normal: 'text-gray-600',
    }
    return classNames[quality] || 'text-gray-600'
  }

  /**
   * 計算總轉職成本（包含基礎費用）
   */
  function calculateTotalJobChangeCost(hasPackageDiscount: boolean = false): {
    coinCost: number
    packageDiscount: number
    finalCoinCost: number
    baseCost: number
    totalCost: number
  } {
    const coinCost = totalCoinCost.value
    const packageDiscount = hasPackageDiscount ? 300 : 0
    const finalCoinCost = Math.max(0, coinCost - packageDiscount)
    const baseCost = BASE_COST
    const totalCost = baseCost + finalCoinCost

    return {
      coinCost,
      packageDiscount,
      finalCoinCost,
      baseCost,
      totalCost,
    }
  }

  /**
   * 匯出購物車數據
   */
  function exportCartData(): string {
    const data = {
      items: cartItems.value,
      totalCost: totalCoinCost.value,
      timestamp: Date.now(),
      version: '1.0',
    }
    return JSON.stringify(data, null, 2)
  }

  /**
   * 匯入購物車數據
   */
  function importCartData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      if (data.items && Array.isArray(data.items)) {
        cartItems.value = data.items
        trackEvent('cart_imported', {
          category: 'Job Change Calculator',
          label: 'data_import',
          value: data.items.length,
        })
        return true
      }
    } catch (error) {
      console.error('匯入購物車數據失敗:', error)
    }
    return false
  }

  // 監聽購物車變化
  watch(
    cartItems,
    (newItems) => {
      // 可以在這裡添加自動保存邏輯
      if (newItems.length > 0) {
        localStorage.setItem('job_change_cart', JSON.stringify(newItems))
      } else {
        localStorage.removeItem('job_change_cart')
      }
    },
    { deep: true },
  )

  // 初始化時載入保存的購物車
  function loadSavedCart(): void {
    try {
      const saved = localStorage.getItem('job_change_cart')
      if (saved) {
        cartItems.value = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('載入保存的購物車失敗:', error)
    }
  }

  // 載入保存的購物車
  loadSavedCart()

  return {
    // 狀態
    cartItems: computed(() => cartItems.value),
    cartInput,
    totalCoinCost,
    itemCount,
    totalQuantity,
    isEmpty,

    // 方法
    getSubtypeOptions,
    getQualityOptions,
    getSubtypeMaxCount,
    validateCartInput,
    addToCart,
    removeCartItem,
    clearCart,
    updateCartItemQuantity,
    resetCartInput,
    getItemDisplayName,
    getEquipmentIcon,
    getQualityClass,
    calculateTotalJobChangeCost,
    exportCartData,
    importCartData,
    loadSavedCart,
  }
}
