import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  JobChangeCalculationResult,
  CartItem,
  CalculatorMode,
  CostCalculationDetails,
  ValidationResult
} from '../types'
import { calculateJobChangeCost } from '../utils/calculations'
import { generateUniqueId } from '../utils/index'

export const useJobChangeStore = defineStore('jobChange', () => {
  // 基本狀態
  const currentMode = ref<CalculatorMode>('simple')
  const currentPage = ref<string>('simple-calc')
  const currentSubPage = ref<string>('equipment')
  const hasPackageDiscount = ref<boolean>(false)
  const isCalculating = ref<boolean>(false)

  // 購物車狀態
  const cartItems = ref<CartItem[]>([])
  
  // 輸入值狀態 (用於簡易和詳細計算器)
  const inputValues = ref<Record<string, number>>({})
  
  // 計算結果
  const calculationResult = ref<JobChangeCalculationResult | null>(null)
  const lastCalculatedAt = ref<Date | null>(null)

  // 計算屬性
  const totalCartItems = computed(() => cartItems.value.length)
  const totalCartCost = computed(() => 
    cartItems.value.reduce((sum, item) => sum + item.cost, 0)
  )
  
  const canCalculate = computed(() => {
    if (currentMode.value === 'cart') {
      return cartItems.value.length > 0
    }
    return Object.values(inputValues.value).some(value => value > 0)
  })

  const currentCosts = computed((): CostCalculationDetails | null => {
    if (!canCalculate.value) return null
    
    const inputGetter = (id: string) => inputValues.value[id] || 0
    const isDetailed = currentMode.value === 'detailed'
    
    return calculateJobChangeCost(
      inputGetter,
      currentMode.value === 'cart' ? cartItems.value : [],
      hasPackageDiscount.value,
      isDetailed
    )
  })

  // 動作
  function setMode(mode: CalculatorMode) {
    currentMode.value = mode
    resetInputs()
  }

  function setPage(page: string) {
    currentPage.value = page
  }

  function setSubPage(subPage: string) {
    currentSubPage.value = subPage
  }

  function setPackageDiscount(enabled: boolean) {
    hasPackageDiscount.value = enabled
  }

  function updateInputValue(inputId: string, value: number) {
    inputValues.value[inputId] = Math.max(0, value)
  }

  function resetInputs() {
    inputValues.value = {}
  }

  function addToCart(item: Omit<CartItem, 'id'>): boolean {
    try {
      const newItem: CartItem = {
        ...item,
        id: generateUniqueId('cart')
      }
      cartItems.value.push(newItem)
      return true
    } catch (error) {
      console.error('添加到購物車失敗:', error)
      return false
    }
  }

  function removeFromCart(itemId: string): boolean {
    const index = cartItems.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      cartItems.value.splice(index, 1)
      return true
    }
    return false
  }

  function clearCart() {
    cartItems.value = []
  }

  function updateCartItem(itemId: string, updates: Partial<CartItem>): boolean {
    const index = cartItems.value.findIndex(item => item.id === itemId)
    if (index !== -1) {
      cartItems.value[index] = { ...cartItems.value[index], ...updates }
      return true
    }
    return false
  }

  async function performCalculation(): Promise<JobChangeCalculationResult> {
    if (!canCalculate.value) {
      throw new Error('無法進行計算：請檢查輸入條件')
    }

    isCalculating.value = true
    try {
      // 模擬計算延遲
      await new Promise(resolve => setTimeout(resolve, 300))

      const costs = currentCosts.value!
      const validation: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: []
      }

      const result: JobChangeCalculationResult = {
        costs,
        items: [...cartItems.value],
        validation,
        calculatedAt: new Date()
      }

      calculationResult.value = result
      lastCalculatedAt.value = new Date()

      return result

    } catch (error) {
      console.error('計算失敗:', error)
      throw error
    } finally {
      isCalculating.value = false
    }
  }

  function clearResults() {
    calculationResult.value = null
    lastCalculatedAt.value = null
  }

  function resetAll() {
    resetInputs()
    clearCart()
    clearResults()
    setMode('simple')
    setPage('simple-calc')
    setSubPage('equipment')
    setPackageDiscount(false)
  }

  return {
    // 狀態
    currentMode,
    currentPage,
    currentSubPage,
    hasPackageDiscount,
    isCalculating,
    cartItems,
    inputValues,
    calculationResult,
    lastCalculatedAt,
    
    // 計算屬性
    totalCartItems,
    totalCartCost,
    canCalculate,
    currentCosts,
    
    // 動作
    setMode,
    setPage,
    setSubPage,
    setPackageDiscount,
    updateInputValue,
    resetInputs,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
    performCalculation,
    clearResults,
    resetAll
  }
})
