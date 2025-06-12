import { ref, computed, reactive, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  JobChangeCosts,
  CartItem,
  CostCalculationDetails,
  ValidationResult,
  CalculatorMode,
  QualityLevel,
  EquipmentType,
  CashEquipmentType,
  JobChangeCalculatorState,
  CartItemInput,
  EquipmentCategory
} from '../types'
import {
  calculateJobChangeCost,
  calculateCartCost,
  calculateItemCost,
  safeNumber,
  calculateTotalCost,
  validateCartItems,
  formatCost,
  formatCostSummary,
  calculateSingleItemCost
} from '../utils/calculations'
import {
  JOB_CHANGE_COSTS,
  BASE_COST,
  PACKAGE_DISCOUNT,
  QUALITY_NAMES,
  EQUIPMENT_NAMES,
  INFO_CONTENT,
  EQUIPMENT_OPTIONS,
  QUALITY_OPTIONS,
  SKILL_QUALITY_OPTIONS,
  SPELL_QUALITY_OPTIONS,
  getEquipmentName,
  getEquipmentIcon
} from '../utils/costData'
import { useJobChangeStore } from '../stores'
import { trackEvent as sharedTrackEvent } from '../../shared/utils/analytics'

// 轉職計算器服務介面
export interface JobChangeCalculatorService {
  // 狀態
  state: JobChangeCalculatorState
  cartItems: Ref<CartItem[]>
  costDetails: Ref<CostCalculationDetails | null>
  isCalculating: Ref<boolean>
  
  // 計算方法
  calculate: () => Promise<CostCalculationDetails>
  addToCart: (item: Omit<CartItem, 'id' | 'cost'>) => boolean
  removeFromCart: (index: number) => void
  clearCart: () => void
  updateCartItem: (index: number, updates: Partial<CartItem>) => boolean
  
  // 驗證方法
  validateInput: (equipmentType: string, quality: string, quantity: number) => ValidationResult
  validateCart: () => ValidationResult
  
  // 工具方法
  formatCurrency: (amount: number, type?: 'coin' | 'diamond') => string
  getQualityName: (quality: QualityLevel) => string
  getEquipmentName: (equipment: EquipmentType | CashEquipmentType) => string
  getInfoContent: (type: string) => any
  
  // 狀態管理
  setMode: (mode: CalculatorMode) => void
  setPackageDiscount: (enabled: boolean) => void
  reset: () => void
}

/**
 * 追蹤事件函數
 */
const trackEvent = (eventName: string, params: Record<string, any>) => {
  // 使用共用的 trackEvent 函數
  sharedTrackEvent(eventName, params)
}

/**
 * 生成唯一ID
 */
const generateId = (): string => {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 轉職計算器 Composable
 * 整合原 assets/js/modules/jobChangeCalculator.js 的完整功能
 */
export function useJobChangeCalculator(): JobChangeCalculatorService {
  const { t } = useI18n()
  const store = useJobChangeStore()

  // 響應式狀態
  const state = reactive<JobChangeCalculatorState>({
    mode: 'cart',
    cartItems: [],
    hasPackageDiscount: false,
    currentPage: 'equipment',
    currentSubPage: ''
  })

  const cartItems = ref<CartItem[]>([])
  const costDetails = ref<CostCalculationDetails | null>(null)
  const isCalculating = ref<boolean>(false)

  // 輸入值獲取器（模擬原始的 DOM 操作）
  const createInputGetter = () => {
    const inputValues = new Map<string, number>()
    
    return (id: string): number => {
      // 在實際使用中，這裡應該從組件的響應式數據獲取值
      // 這裡提供一個基本實現
      return inputValues.get(id) || 0
    }
  }

  const inputGetter = createInputGetter()

  // 計算轉職成本
  const calculate = async (): Promise<CostCalculationDetails> => {
    if (isCalculating.value) {
      return costDetails.value || getDefaultCostDetails()
    }

    isCalculating.value = true

    try {
      const result = calculateJobChangeCost(
        inputGetter,
        cartItems.value,
        state.hasPackageDiscount,
        state.mode === 'detailed'
      )

      costDetails.value = result

      // 追蹤計算事件
      trackEvent('cost_calculated', {
        category: 'Job Change Calculator',
        label: `${state.mode}_calculator`,
        value: result.totalCost,
        mode: state.mode,
        cart_items: cartItems.value.length,
        package_discount: state.hasPackageDiscount
      })

      return result
    } catch (error) {
      console.error('計算失敗:', error)
      throw error
    } finally {
      isCalculating.value = false
    }
  }

  // 加入購物車
  const addToCart = (item: Omit<CartItem, 'id' | 'cost'>): boolean => {
    try {
      // 驗證輸入
      const validation = validateInput(item.equipmentType, item.quality, item.quantity)
      if (!validation.isValid) {
        console.warn('加入購物車失敗:', validation.errors)
        return false
      }

      // 計算成本
      const cost = calculateItemCost(item.subtype, item.quality, item.quantity)

      // 建立購物車項目
      const cartItem: CartItem = {
        ...item,
        id: generateId(),
        cost,
        unitCost: cost / item.quantity,
        name: `${getEquipmentName(item.subtype)} (${getQualityName(item.quality as QualityLevel)})`
      }

      cartItems.value.push(cartItem)
      state.cartItems = cartItems.value

      // 重新計算總成本
      calculate()

      // 追蹤事件
      trackEvent('item_added_to_cart', {
        category: 'Job Change Calculator',
        label: `${item.equipmentType}_${item.quality}`,
        equipment_type: item.equipmentType,
        quality: item.quality,
        quantity: item.quantity,
        cost: cost
      })

      return true
    } catch (error) {
      console.error('加入購物車失敗:', error)
      return false
    }
  }

  // 從購物車移除
  const removeFromCart = (index: number): void => {
    if (index >= 0 && index < cartItems.value.length) {
      const removedItem = cartItems.value.splice(index, 1)[0]
      state.cartItems = cartItems.value

      // 重新計算總成本
      calculate()

      // 追蹤事件
      trackEvent('item_removed_from_cart', {
        category: 'Job Change Calculator',
        label: removedItem.equipmentType,
        item_id: removedItem.id
      })
    }
  }

  // 清空購物車
  const clearCart = (): void => {
    const itemCount = cartItems.value.length
    cartItems.value = []
    state.cartItems = []
    costDetails.value = null

    // 追蹤事件
    trackEvent('cart_cleared', {
      category: 'Job Change Calculator',
      label: 'manual_clear',
      items_removed: itemCount
    })
  }

  // 更新購物車項目
  const updateCartItem = (index: number, updates: Partial<CartItem>): boolean => {
    if (index >= 0 && index < cartItems.value.length) {
      const item = cartItems.value[index]
      Object.assign(item, updates)

      // 如果數量改變，重新計算成本
      if (updates.quantity !== undefined) {
        const newCost = calculateItemCost(item.subtype, item.quality, item.quantity)
        item.cost = newCost
        item.unitCost = newCost / item.quantity
      }

      // 重新計算總成本
      calculate()

      return true
    }
    return false
  }

  // 驗證輸入
  const validateInput = (
    equipmentType: string,
    quality: string,
    quantity: number
  ): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    // 基本驗證
    if (quantity <= 0) {
      errors.push(t('validation.quantity_positive') || '數量必須大於0')
    }

    if (quantity > 999) {
      errors.push(t('validation.quantity_max') || '數量不能超過999')
    }

    // 檢查裝備類型限制
    if (quality !== 'cash') {
      const equipmentConfig = JOB_CHANGE_COSTS.detailedEquipment[equipmentType as EquipmentType]
      if (equipmentConfig && quantity > equipmentConfig.max) {
        errors.push(
          t('validation.equipment_max', { max: equipmentConfig.max }) ||
          `${getEquipmentName(equipmentType as EquipmentType)}最多只能轉職${equipmentConfig.max}件`
        )
      }
    } else {
      const cashConfig = JOB_CHANGE_COSTS.cashEquipment[equipmentType as CashEquipmentType]
      if (cashConfig && quantity > cashConfig.max) {
        errors.push(
          t('validation.cash_equipment_max', { max: cashConfig.max }) ||
          `${getEquipmentName(equipmentType as CashEquipmentType)}最多只能轉職${cashConfig.max}件`
        )
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // 驗證購物車
  const validateCart = (): ValidationResult => {
    const errors: string[] = []
    const warnings: string[] = []

    if (cartItems.value.length === 0) {
      warnings.push(t('validation.cart_empty') || '購物車是空的')
    }

    // 檢查重複項目
    const duplicates = cartItems.value.filter((item, index) =>
      cartItems.value.findIndex(other =>
        other.equipmentType === item.equipmentType &&
        other.quality === item.quality &&
        other.subtype === item.subtype
      ) !== index
    )

    if (duplicates.length > 0) {
      warnings.push(t('validation.duplicate_items') || '購物車中有重複的項目')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  // 格式化貨幣
  const formatCurrency = (amount: number, type: 'coin' | 'diamond' = 'coin'): string => {
    const units = {
      coin: '枚',
      diamond: '鑽'
    }
    return `${amount.toLocaleString()} ${units[type]}`
  }

  // 獲取品質名稱
  const getQualityName = (quality: QualityLevel): string => {
    return QUALITY_NAMES[quality] || quality
  }

  // 獲取裝備名稱
  const getEquipmentName = (equipment: EquipmentType | CashEquipmentType): string => {
    return EQUIPMENT_NAMES[equipment] || equipment
  }

  // 獲取信息內容
  const getInfoContent = (type: string) => {
    return INFO_CONTENT[type] || null
  }

  // 設置計算器模式
  const setMode = (mode: CalculatorMode): void => {
    state.mode = mode
    
    trackEvent('calculator_mode_changed', {
      category: 'Job Change Calculator',
      label: mode
    })
  }

  // 設置禮包優惠
  const setPackageDiscount = (enabled: boolean): void => {
    state.hasPackageDiscount = enabled
    
    // 重新計算成本
    calculate()
    
    trackEvent('package_discount_toggled', {
      category: 'Job Change Calculator',
      label: enabled ? 'enabled' : 'disabled'
    })
  }

  // 重置計算器
  const reset = (): void => {
    cartItems.value = []
    state.cartItems = []
    state.hasPackageDiscount = false
    costDetails.value = null
    
    trackEvent('calculator_reset', {
      category: 'Job Change Calculator',
      label: 'manual_reset'
    })
  }

  // 預設成本詳情
  const getDefaultCostDetails = (): CostCalculationDetails => ({
    equipmentCost: 0,
    skillCost: 0,
    spellCost: 0,
    cashCost: 0,
    totalCoinCost: 0,
    packageDiscount: 0,
    finalCoinCost: 0,
    baseCost: BASE_COST,
    totalCost: BASE_COST
  })

  // 監聽購物車變化，自動重新計算
  watch(() => cartItems.value.length, () => {
    if (cartItems.value.length > 0) {
      calculate()
    }
  })

  // 初始化追蹤
  trackEvent('job_change_calculator_initialized', {
    category: 'Job Change Calculator',
    label: 'calculator_ready',
    calculator_type: 'job_change_calculator'
  })

  return {
    // 狀態
    state,
    cartItems,
    costDetails,
    isCalculating,

    // 計算方法
    calculate,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,

    // 驗證方法
    validateInput,
    validateCart,

    // 工具方法
    formatCurrency,
    getQualityName,
    getEquipmentName,
    getInfoContent,

    // 狀態管理
    setMode,
    setPackageDiscount,
    reset
  }
}

/**
 * 全域轉職計算器實例（單例模式）
 */
let globalCalculatorInstance: ReturnType<typeof useJobChangeCalculator> | null = null

/**
 * 獲取全域轉職計算器實例
 */
export function useGlobalJobChangeCalculator() {
  if (!globalCalculatorInstance) {
    globalCalculatorInstance = useJobChangeCalculator()
  }
  return globalCalculatorInstance
}
