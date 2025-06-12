// 共用的基本類型定義

// 基本 API 回應結構
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 通用的選項介面
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

// 通用的分頁介面
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 統一從模組重新匯出，移除重複定義
export type {
  PetType,
  PetStats,
  StatType,
  StatAnalysis,
  PetCalculationResult,
  RatingLevel,
  OverallRating,
  PetEvaluateConfig,
  UpgradeRate,
  UpgradeRateTable,
} from '../../modules/pet-evaluate/types'

export type {
  JobChangeData,
  RequiredItem,
  JobInfo,
  QualityLevel,
  EquipmentType,
  CalculatorMode,
  JobChangeCalculationResult,
} from '../../modules/job-change/types'

// 移除所有重複的型別定義
