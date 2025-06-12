// 轉職計算模組專用類型
export interface JobChangeData {
  fromJob: string
  toJob: string
  requiredItems: RequiredItem[]
  totalCost: number
}

export interface RequiredItem {
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface JobInfo {
  id: string
  name: string
  description: string
  icon: string
  requirements: string[]
}

// 品質等級
export type QualityLevel = 'rare' | 'hero' | 'legend' | 'mythic'

// 裝備類型
export type EquipmentType =
  | 'weapon'
  | 'helmet'
  | 'chest'
  | 'arms'
  | 'gloves'
  | 'legs'
  | 'boots'
  | 'belt'
  | 'cloak'
  | 'necklace'
  | 'earring'
  | 'ring'
  | 'rune'

// 商城裝備類型
export type CashEquipmentType = 'shirt' | 'shoulder' | 'mask'

// 計算器模式
export type CalculatorMode = 'simple' | 'detailed' | 'cart'

// 成本計算規則
export interface CostRule {
  threshold: number
  extraCost: number
}

// 成本數據結構
export interface CostData {
  base: number
  rules: CostRule[]
}

// 裝備成本配置
export interface EquipmentCostConfig {
  max: number
  costs: Record<QualityLevel, number>
}

// 商城裝備成本配置
export interface CashEquipmentCostConfig {
  max: number
  cost: number
}

// 轉職硬幣消耗配置
export interface JobChangeCosts {
  equipment: Record<string, Record<QualityLevel, number>>
  detailedEquipment: Record<EquipmentType, EquipmentCostConfig>
  cashEquipment: Record<CashEquipmentType, CashEquipmentCostConfig>
  skills: Record<QualityLevel, CostData>
  spells: Record<QualityLevel, CostData>
}

// 裝備大類
export type EquipmentCategory = 'weapon' | 'armor' | 'accessory' | 'cash' | 'skill' | 'spell'

// 購物車輸入
export interface CartItemInput {
  equipmentType: string
  subtype: string
  quality: string
  quantity: number
}

// 購物車項目
export interface CartItem {
  id: string
  equipmentType: EquipmentCategory
  subtype: EquipmentType | CashEquipmentType
  quality: QualityLevel | 'cash'
  quantity: number
  unitCost: number
  cost: number
  name: string
  icon?: string
  timestamp?: number
}

// 計算結果詳情
export interface CostCalculationDetails {
  equipmentCost: number
  skillCost: number
  spellCost: number
  cashCost: number
  totalCoinCost: number
  packageDiscount: number
  finalCoinCost: number
  baseCost: number
  totalCost: number
}

// 分類成本結果
export interface CategoryCostResult {
  totalCoins: number
  itemCosts?: Record<string, number>
}

// 計算器狀態
export interface JobChangeCalculatorState {
  mode: CalculatorMode
  cartItems: CartItem[]
  hasPackageDiscount: boolean
  currentPage: string
  currentSubPage: string
}

// 驗證結果
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// 信息內容結構
export interface InfoContent {
  title: string
  table: string[][]
  specialRules?: {
    title: string
    rules: string[]
  }
}

// 轉職計算結果
export interface JobChangeCalculationResult {
  costs: CostCalculationDetails
  items: CartItem[]
  validation: ValidationResult
  calculatedAt: Date
}
