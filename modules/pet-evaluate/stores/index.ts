import { defineStore } from 'pinia'
import type { PetType, PetStats, PetCalculationResult, PetEvaluateConfig } from '../types'
import { getPetList, getPetById } from '../utils/petData'
import { calculatePetRating, calculateExpectedStats } from '../utils/calculations'
import { ref, computed } from 'vue'

export const usePetEvaluateStore = defineStore('petEvaluate', () => {
  // 狀態
  const config: PetEvaluateConfig = {
    maxLevel: 15,
    minLevel: 1,
    historyLimit: 10,
    autoSave: true,
  }

  const selectedPet = ref<PetType | null>(null)
  const petLevel = ref(1)
  const inputStats = ref<PetStats>({
    endurance: 0,
    loyalty: 0,
    speed: 0,
    aggressiveness: 3,
    hp: 0,
  })
  const calculationResult = ref<PetCalculationResult | null>(null)
  const isCalculating = ref(false)
  const calculationHistory = ref<PetCalculationResult[]>([])

  // 計算屬性
  const availablePets = computed(() => getPetList())

  const canCalculate = computed(() => {
    const petSelected = !!selectedPet.value
    return (
      petSelected &&
      petLevel.value >= config.minLevel &&
      petLevel.value <= config.maxLevel &&
      hasValidInputs.value
    )
  })

  const hasValidInputs = computed(() => {
    return Object.values(inputStats.value).every((val) => typeof val === 'number' && val >= 0)
  })

  const expectedStats = computed(() => {
    // 如果沒有選擇寵物，使用預設寵物（狼）來計算期望值
    const pet = selectedPet.value || getPetById('wolf')
    if (!pet) return null
    return calculateExpectedStats(pet, petLevel.value)
  })

  // 動作
  function selectPet(petId: string) {
    const pet = getPetById(petId)
    if (pet) {
      selectedPet.value = pet
      resetInputStats()
    }
  }

  function setPetLevel(level: number) {
    petLevel.value = Math.max(config.minLevel, Math.min(config.maxLevel, level))
  }

  function updateStat(stat: keyof PetStats, value: number) {
    inputStats.value[stat] = Math.max(0, value)
  }

  function resetInputStats() {
    if (selectedPet.value) {
      inputStats.value = {
        ...selectedPet.value.baseStats,
        aggressiveness: 3, // 確保積極性始終為3
      }
    }
  }

  function resetAll() {
    selectedPet.value = null
    petLevel.value = 1
    calculationResult.value = null
    inputStats.value = {
      endurance: 0,
      loyalty: 0,
      speed: 0,
      aggressiveness: 3,
      hp: 0,
    }
  }

  async function performCalculation() {
    if (!canCalculate.value) {
      throw new Error('無法進行計算：請檢查輸入條件')
    }

    // 如果沒有選擇寵物，使用預設寵物（狼）
    const pet = selectedPet.value || getPetById('wolf')
    if (!pet) {
      throw new Error('無法找到寵物數據')
    }

    isCalculating.value = true
    try {
      // 模擬異步計算（顯示載入狀態）
      await new Promise((resolve) => setTimeout(resolve, 500))

      const result = calculatePetRating(pet, petLevel.value, inputStats.value)

      calculationResult.value = result

      // 添加到歷史記錄
      addToHistory(result)

      // 追蹤事件
      trackCalculation(result)

      return result
    } catch (error) {
      console.error('計算失敗:', error)
      throw error
    } finally {
      isCalculating.value = false
    }
  }

  function addToHistory(result: PetCalculationResult) {
    calculationHistory.value.unshift(result)
    if (calculationHistory.value.length > config.historyLimit) {
      calculationHistory.value = calculationHistory.value.slice(0, config.historyLimit)
    }

    // 如果啟用自動保存
    if (config.autoSave) {
      saveHistoryToLocalStorage()
    }
  }

  function clearHistory() {
    calculationHistory.value = []
    localStorage.removeItem('pet-evaluate-history')
  }

  function loadFromHistory(result: PetCalculationResult) {
    selectedPet.value = result.pet
    petLevel.value = result.level
    inputStats.value = { ...result.currentStats }
    calculationResult.value = result
  }

  function saveHistoryToLocalStorage() {
    try {
      localStorage.setItem('pet-evaluate-history', JSON.stringify(calculationHistory.value))
    } catch (error) {
      console.warn('無法保存歷史記錄到本地存儲:', error)
    }
  }

  function loadHistoryFromLocalStorage() {
    try {
      const saved = localStorage.getItem('pet-evaluate-history')
      if (saved) {
        calculationHistory.value = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('無法從本地存儲載入歷史記錄:', error)
    }
  }

  // 輔助函數
  function trackCalculation(result: PetCalculationResult) {
    // TODO: 整合 Google Analytics
    console.log('追蹤計算事件:', {
      pet: result.pet.name,
      level: result.level,
      score: result.overallScore,
      rating: result.rating,
    })
  }

  // 初始化
  function initialize() {
    loadHistoryFromLocalStorage()
  }

  return {
    // 狀態
    config,
    selectedPet,
    petLevel,
    inputStats,
    calculationResult,
    isCalculating,
    calculationHistory,
    // 計算屬性
    availablePets,
    canCalculate,
    hasValidInputs,
    expectedStats,
    // 動作
    selectPet,
    setPetLevel,
    updateStat,
    resetInputStats,
    resetAll,
    performCalculation,
    addToHistory,
    clearHistory,
    loadFromHistory,
    initialize,
  }
})
