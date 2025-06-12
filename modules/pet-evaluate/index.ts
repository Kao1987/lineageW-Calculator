// 寵物評價模組的統一出口
export * from './types'
export * from './stores'
export * from './utils/petData'
export * from './utils/calculations'

// Composables 導出
export * from './composables/usePetCalculator'

// 預設組件導出
export { default as PetSelector } from './components/PetSelector.vue'
export { default as PetStatsInput } from './components/PetStatsInput.vue'
export { default as PetResultDisplay } from './components/PetResultDisplay.vue'

// 頁面組件
export { default as PetEvaluateMain } from './components/PetEvaluateMain.vue'

// 默認導出主頁面組件
export { default } from './components/PetEvaluateMain.vue'
