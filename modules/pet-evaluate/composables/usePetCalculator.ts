import { ref, computed, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PetType, PetStats, PetCalculationResult, StatType } from '../types'
import { calculatePetRating, getRatingDescription } from '../utils/calculations'
import { calculateCharacterBonus } from '../../shared/utils'
import { PET_DATA, getPetById, getPetList } from '../utils/petData'

// 寵物計算器服務介面
export interface PetCalculatorService {
  // 狀態
  selectedPet: Ref<PetType | null>
  petLevel: Ref<number>
  currentStats: Ref<PetStats>
  calculationResult: Ref<PetCalculationResult | null>
  isCalculating: Ref<boolean>

  // 計算數據
  availablePets: Ref<PetType[]>
  expectedStats: Ref<PetStats | null>

  // 方法
  selectPet: (petId: string) => boolean
  updateLevel: (level: number) => void
  updateStat: (stat: StatType, value: number) => void
  calculate: () => Promise<boolean>
  reset: () => void
  validateInputs: () => string[]

  // 工具方法
  formatGrowthRate: (growthRate: number) => string
  getCharacterBonus: (stat: StatType, value: number) => string
  getRatingText: (rating: string) => string
}

// 追蹤事件函數
const trackEvent = (eventName: string, params: Record<string, any>) => {
  console.log(`[PetCalculator] ${eventName}:`, params)
  // TODO: 整合實際的分析工具
}

// 檢查數值是否有效
const isValidNumber = (value: number, min?: number, max?: number): boolean => {
  if (isNaN(value) || !isFinite(value)) return false
  if (min !== undefined && value < min) return false
  if (max !== undefined && value > max) return false
  return true
}

// 安全數值轉換
const safeNumber = (value: any, defaultValue: number = 0): number => {
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 寵物計算器 Composable
 * 將原本 assets/js/modules/petCalculator.js 的邏輯轉換為 Vue 3 Composable
 */
export function usePetCalculator(): PetCalculatorService {
  const { t } = useI18n()

  // 響應式狀態
  const selectedPet = ref<PetType | null>(null)
  const petLevel = ref<number>(1)
  const currentStats = ref<PetStats>({
    endurance: 0,
    loyalty: 0,
    speed: 0,
    aggressiveness: 3,
    hp: 0,
  })
  const calculationResult = ref<PetCalculationResult | null>(null)
  const isCalculating = ref<boolean>(false)

  // 可用寵物列表
  const availablePets = ref<PetType[]>(getPetList())

  // 期望屬性值（計算屬性）
  const expectedStats = computed<PetStats | null>(() => {
    if (!selectedPet.value) return null

    const expectedStats: PetStats = { ...selectedPet.value.baseStats }
    const growthLevels = petLevel.value - 1

    Object.keys(selectedPet.value.baseStats).forEach((statName) => {
      const statKey = statName as keyof PetStats
      const baseValue = selectedPet.value!.baseStats[statKey]
      const isMainStat = statKey === selectedPet.value!.mainStat

      // 主屬性預期成長：每級 +3.75 點
      // 副屬性預期成長：每級 +1.25 點
      const expectedGrowthPerLevel = isMainStat ? 3.75 : 1.25
      const expectedGrowth = growthLevels * expectedGrowthPerLevel

      expectedStats[statKey] = baseValue + expectedGrowth
    })

    return expectedStats
  })

  // 選擇寵物
  const selectPet = (petId: string): boolean => {
    const pet = getPetById(petId)
    if (!pet) {
      console.warn(`無效的寵物ID: ${petId}`)
      return false
    }

    selectedPet.value = pet

    // 重置屬性為基礎值
    currentStats.value = {
      endurance: pet.baseStats.endurance,
      loyalty: pet.baseStats.loyalty,
      speed: pet.baseStats.speed,
      aggressiveness: 3, // 固定值
      hp: pet.baseStats.hp,
    }

    // 清除之前的計算結果
    calculationResult.value = null

    // 追蹤寵物選擇事件
    trackEvent('pet_selection', {
      category: 'Pet Calculator',
      label: petId,
      pet_type: petId,
      calculator_type: 'pet_calculator',
    })

    return true
  }

  // 更新等級
  const updateLevel = (level: number): void => {
    const safeLevel = Math.max(1, Math.min(15, safeNumber(level, 1)))
    petLevel.value = safeLevel
  }

  // 更新屬性值
  const updateStat = (stat: StatType, value: number): void => {
    const safeValue = Math.max(0, safeNumber(value, 0))
    currentStats.value[stat] = safeValue
  }

  // 驗證輸入
  const validateInputs = (): string[] => {
    const errors: string[] = []

    if (!selectedPet.value) {
      errors.push(t('validation.selectPet') || '請先選擇寵物！')
      return errors
    }

    // 驗證等級
    if (!isValidNumber(petLevel.value, 1, 15)) {
      errors.push(t('validation.levelRange') || '寵物等級必須在 1-15 之間！')
    }

    // 驗證屬性值
    const pet = selectedPet.value
    const stats = currentStats.value

    Object.keys(pet.baseStats).forEach((statName) => {
      const statKey = statName as keyof PetStats
      const currentValue = stats[statKey]
      const baseValue = pet.baseStats[statKey]
      const statDisplayName = t(`stats.${statKey}`) || statKey

      if (currentValue < 0) {
        errors.push(`${statDisplayName}不能為負數！`)
      }

      if (statKey !== 'aggressiveness' && currentValue < baseValue) {
        errors.push(`${statDisplayName}不能低於基礎值 ${baseValue}！`)
      }
    })

    return errors
  }

  // 執行計算
  const calculate = async (): Promise<boolean> => {
    if (isCalculating.value) return false

    const errors = validateInputs()
    if (errors.length > 0) {
      console.warn('驗證失敗:', errors)
      return false
    }

    isCalculating.value = true

    try {
      const pet = selectedPet.value!
      const level = petLevel.value
      const stats = { ...currentStats.value }

      // 使用模組內的計算函數
      const result = calculatePetRating(pet, level, stats)
      calculationResult.value = result

      // 追蹤計算完成事件
      trackEvent('calculation_completed', {
        category: 'Pet Calculator',
        label: `${pet.id}_level_${level}`,
        value: Math.round(result.overallScore),
        pet_type: pet.id,
        pet_level: level,
        calculator_type: 'pet_calculator',
        overall_rating: result.rating,
      })

      return true
    } catch (error) {
      console.error('計算失敗:', error)
      return false
    } finally {
      isCalculating.value = false
    }
  }

  // 重置計算器
  const reset = (): void => {
    selectedPet.value = null
    petLevel.value = 1
    currentStats.value = {
      endurance: 0,
      loyalty: 0,
      speed: 0,
      aggressiveness: 3,
      hp: 0,
    }
    calculationResult.value = null

    trackEvent('calculator_reset', {
      category: 'Pet Calculator',
      label: 'manual_reset',
      calculator_type: 'pet_calculator',
    })
  }

  // 格式化成長率
  const formatGrowthRate = (growthRate: number): string => {
    return `${(growthRate * 100).toFixed(1)}%`
  }

  // 獲取角色加成
  const getCharacterBonus = (stat: StatType, value: number): string => {
    return calculateCharacterBonus(stat, value)
  }

  // 獲取評級文字
  const getRatingText = (rating: string): string => {
    return t(`ratings.${rating}`) || rating
  }

  // 監聽選中寵物變化，自動更新基礎屬性
  watch(selectedPet, (newPet) => {
    if (newPet) {
      currentStats.value = {
        endurance: newPet.baseStats.endurance,
        loyalty: newPet.baseStats.loyalty,
        speed: newPet.baseStats.speed,
        aggressiveness: 3,
        hp: newPet.baseStats.hp,
      }
    }
  })

  // 初始化追蹤
  trackEvent('pet_calculator_initialized', {
    category: 'Pet Calculator',
    label: 'calculator_ready',
    calculator_type: 'pet_calculator',
  })

  return {
    // 狀態
    selectedPet,
    petLevel,
    currentStats,
    calculationResult,
    isCalculating,

    // 計算數據
    availablePets,
    expectedStats,

    // 方法
    selectPet,
    updateLevel,
    updateStat,
    calculate,
    reset,
    validateInputs,

    // 工具方法
    formatGrowthRate,
    getCharacterBonus,
    getRatingText,
  }
}
