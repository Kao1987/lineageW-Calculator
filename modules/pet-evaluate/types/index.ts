// 寵物評價模組專用類型
export interface PetType {
  id: string
  name: string
  emoji: string
  image: string
  mainStat: StatType
  baseStats: PetStats
}

export interface PetStats {
  endurance: number // 忍耐力
  loyalty: number // 忠誠心
  speed: number // 速度
  aggressiveness: number // 積極性
  hp: number // 體力
}

export type StatType = 'endurance' | 'loyalty' | 'speed' | 'aggressiveness' | 'hp'

export interface PetCalculationResult {
  pet: PetType
  level: number
  currentStats: PetStats
  expectedStats: PetStats
  analysis: StatAnalysis[]
  overallScore: number
  rating: OverallRating
  skillBonus?: SkillBonus // 新增：技能加成信息
  selectedSkills?: SelectedSkill[] // 新增：選擇的技能
}

export interface StatAnalysis {
  stat: StatType
  statName: string
  currentValue: number
  expectedValue: number
  baseValue: number // 新增：基礎值
  growthValue: number // 新增：成長值
  growthRate: number
  score: number
  rating: RatingLevel
  isMainStat: boolean
  characterBonus: string
}

export type RatingLevel = 'excellent' | 'good' | 'average' | 'poor' | 'bad' | 'fixed' // 新增 'fixed'

// 新增 OverallRating 類型定義
export type OverallRating = 'godTier' | 'highQuality' | 'normalPet' | 'needImprovement' | 'tragic'

// 新增：升級機率表類型定義
export interface UpgradeRate {
  level: number
  rate: number
}

export interface UpgradeRateTable {
  main: UpgradeRate[] // 主屬性升級機率
  sub: UpgradeRate[] // 副屬性升級機率
}

// 寵物技能相關類型
export interface PetSkill {
  id: string
  name: string
  stage: 1 | 2 | 3 // 技能階段
  unlockLevel: 5 | 10 | 15 // 解鎖等級
  targetStat: StatType // 影響的屬性
  minValue: number // 最小加成值
  maxValue: number // 最大加成值
}

export interface SelectedSkill {
  skillId: string
  stage: number // 實際階段 (1-3 for 1階段, 1-4 for 2階段, 1-5 for 3階段)
  value: number // 實際加成值
}

export interface SkillBonus {
  [key: string]: number // StatType -> bonus value
}

// 計算模式類型
export type CalculationMode = 'manual' | 'smart'

// 寵物評價模組的配置
export interface PetEvaluateConfig {
  maxLevel: number
  minLevel: number
  historyLimit: number
  autoSave: boolean // 新增：自動保存功能開關
}
