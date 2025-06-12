import type { 
  JobChangeCosts, 
  QualityLevel, 
  EquipmentType, 
  CashEquipmentType,
  InfoContent,
  CostData,
  EquipmentCostConfig,
  CashEquipmentCostConfig
} from '../types'

/**
 * 轉職硬幣消耗配置
 * 基於原 jobChangeCalculator.js 的 initializeData() 方法
 */
export const JOB_CHANGE_COSTS: JobChangeCosts = {
  // 裝備轉職硬幣消耗（按品質）
  equipment: {
    weapon: {
      rare: 1,
      hero: 9,
      legend: 27,
      mythic: 81
    },
    armor: {
      rare: 1,
      hero: 9,
      legend: 27,
      mythic: 81
    },
    accessory: {
      rare: 1,
      hero: 9,
      legend: 27,
      mythic: 81
    }
  },
  
  // 詳細裝備分類限制和消耗
  detailedEquipment: {
    weapon: { max: 3, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    helmet: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    chest: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    arms: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    gloves: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    legs: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    boots: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    belt: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    cloak: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    necklace: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    earring: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    ring: { max: 4, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    rune: { max: 2, costs: { hero: 9, legend: 27 } as any } // 符石沒有稀有和神話
  },

  // 商城裝備消耗（固定5枚硬幣）
  cashEquipment: {
    shirt: { max: 3, cost: 5 },
    shoulder: { max: 1, cost: 5 },
    mask: { max: 1, cost: 5 }
  },
  
  // 技能轉職硬幣消耗（按品質，包含複雜計算規則）
  skills: {
    rare: { base: 1, rules: [] },
    hero: { 
      base: 9, 
      rules: [
        { threshold: 6, extraCost: 18 },
        { threshold: 7, extraCost: 27 }
      ]
    },
    legend: { 
      base: 27, 
      rules: [
        { threshold: 3, extraCost: 54 },
        { threshold: 4, extraCost: 81 }
      ]
    },
    mythic: { 
      base: 81, 
      rules: [
        { threshold: 1, extraCost: 162 }
      ]
    }
  },
  
  // 咒語卡轉職硬幣消耗
  spells: {
    rare: { 
      base: 1, 
      rules: [
        { threshold: 10, extraCost: 1 }
      ]
    },
    hero: { 
      base: 9, 
      rules: [
        { threshold: 10, extraCost: 18 },
        { threshold: 11, extraCost: 27 }
      ]
    },
    legend: { 
      base: 27, 
      rules: [
        { threshold: 10, extraCost: 54 },
        { threshold: 11, extraCost: 81 }
      ]
    },
    mythic: { 
      base: 81, 
      rules: []
    }
  }
}

/**
 * 基本轉職費用
 */
export const BASE_COST = 2000

/**
 * 禮包優惠
 */
export const PACKAGE_DISCOUNT = 300

/**
 * 品質名稱對照
 */
export const QUALITY_NAMES: Record<QualityLevel, string> = {
  rare: '稀有',
  hero: '英雄',
  legend: '傳說',
  mythic: '神話'
}

/**
 * 裝備類型名稱對照
 */
export const EQUIPMENT_NAMES: Record<EquipmentType | CashEquipmentType, string> = {
  weapon: '武器',
  helmet: '頭盔',
  chest: '盔甲',
  arms: '臂甲',
  gloves: '手套',
  legs: '脛甲',
  boots: '鞋子',
  belt: '皮帶',
  cloak: '斗篷',
  necklace: '項鍊',
  earring: '耳環',
  ring: '戒指',
  rune: '符石',
  shirt: '商城T恤',
  shoulder: '商城肩甲',
  mask: '商城面甲'
}

/**
 * 信息內容配置
 * 基於原 setupInfoContent() 方法
 */
export const INFO_CONTENT: Record<string, InfoContent> = {
  weapon: {
    title: '武器轉職硬幣消耗',
    table: [
      ['品質', '消耗硬幣'],
      ['稀有', '1枚'],
      ['英雄', '9枚'],
      ['傳說', '27枚'],
      ['神話', '81枚']
    ]
  },
  armor: {
    title: '防具轉職硬幣消耗',
    table: [
      ['品質', '消耗硬幣'],
      ['稀有', '1枚'],
      ['英雄', '9枚'],
      ['傳說', '27枚'],
      ['神話', '81枚']
    ]
  },
  accessory: {
    title: '飾品轉職硬幣消耗',
    table: [
      ['品質', '消耗硬幣'],
      ['稀有', '1枚'],
      ['英雄', '9枚'],
      ['傳說', '27枚'],
      ['神話', '81枚']
    ]
  },
  skill: {
    title: '技能轉職硬幣消耗',
    table: [
      ['品質', '基本消耗', '特殊規則'],
      ['稀有', '1枚', '最多5個'],
      ['英雄', '9枚', '基本6個9枚/個，第7個18枚，第8-10個27枚/個'],
      ['傳說', '27枚', '基本3個27枚/個，第4個54枚，第5-7個81枚/個'],
      ['神話', '81枚', '第1個81枚，第2個起162枚/個']
    ]
  },
  spell: {
    title: '咒語卡片轉職硬幣消耗',
    table: [
      ['品質', '基本消耗', '特殊規則'],
      ['稀有', '1枚', '前10個1枚/個，第11個起2枚/個'],
      ['英雄', '9枚', '前10個9枚/個，第11個18枚，第12個起27枚/個'],
      ['傳說', '27枚', '前10個27枚/個，第11個54枚，第12個起81枚/個'],
      ['神話', '81枚', '固定81枚/個']
    ]
  },
  cash: {
    title: '商城裝備轉職硬幣消耗',
    table: [
      ['類型', '消耗硬幣', '數量限制'],
      ['商城T恤', '5枚', '最多3個'],
      ['商城肩甲', '5枚', '最多1個'],
      ['商城面甲', '5枚', '最多1個']
    ]
  }
}

/**
 * 基本轉職費用（鑽石）
 */
export const BASE_JOB_CHANGE_COST = 2000

/**
 * 轉職硬幣禮包折扣（硬幣）
 */
export const PACKAGE_DISCOUNT_AMOUNT = 300

/**
 * 裝備類型映射
 */
export const EQUIPMENT_TYPE_MAP: Record<string, EquipmentType> = {
  'weapon': 'weapon',
  'helmet': 'helmet',
  'chest': 'chest',
  'arms': 'arms',
  'gloves': 'gloves',
  'legs': 'legs',
  'boots': 'boots',
  'belt': 'belt',
  'cloak': 'cloak',
  'necklace': 'necklace',
  'earring': 'earring',
  'ring': 'ring',
  'rune': 'rune'
}

/**
 * 商城裝備類型映射
 */
export const CASH_EQUIPMENT_TYPE_MAP: Record<string, CashEquipmentType> = {
  'shirt': 'shirt',
  'shoulder': 'shoulder',
  'mask': 'mask'
}

/**
 * 裝備選項配置
 */
export const EQUIPMENT_OPTIONS = {
  weapon: {
    name: '⚔️ 武器',
    subtypes: {
      'weapon': '武器'
    }
  },
  armor: {
    name: '🛡️ 防具',
    subtypes: {
      'helmet': '頭盔',
      'chest': '胸甲',
      'arms': '臂甲',
      'gloves': '手套',
      'legs': '腿甲',
      'boots': '靴子',
      'belt': '腰帶',
      'cloak': '斗篷'
    }
  },
  accessory: {
    name: '💍 飾品',
    subtypes: {
      'necklace': '項鍊',
      'earring': '耳環',
      'ring': '戒指',
      'rune': '符文'
    }
  },
  skill: {
    name: '⚡ 技能',
    subtypes: {
      'skill': '技能'
    }
  },
  spell: {
    name: '🃏 咒語卡片',
    subtypes: {
      'spell': '咒語卡片'
    }
  },
  cash: {
    name: '🛍️ 商城裝備',
    subtypes: {
      'shirt': '襯衫',
      'shoulder': '肩甲',
      'mask': '面具'
    }
  }
}

/**
 * 品質選項
 */
export const QUALITY_OPTIONS: Record<QualityLevel, string> = {
  'rare': '🔵 稀有',
  'hero': '🟣 英雄',
  'legend': '🟠 傳說',
  'mythic': '🔴 神話'
}

/**
 * 技能品質選項
 */
export const SKILL_QUALITY_OPTIONS: Record<QualityLevel, string> = {
  'rare': '🔵 稀有',
  'hero': '🟣 英雄', 
  'legend': '🟠 傳說',
  'mythic': '🔴 神話'
}

/**
 * 咒語卡片品質選項
 */
export const SPELL_QUALITY_OPTIONS: Record<QualityLevel, string> = {
  'rare': '🔵 稀有',
  'hero': '🟣 英雄',
  'legend': '🟠 傳說', 
  'mythic': '🔴 神話'
}

/**
 * 創建裝備成本配置
 */
function createEquipmentCostConfig(max: number, rare: number, hero: number, legend: number, mythic: number): EquipmentCostConfig {
  return {
    max,
    costs: {
      rare,
      hero,
      legend,
      mythic
    }
  }
}

/**
 * 創建商城裝備成本配置
 */
function createCashEquipmentCostConfig(max: number, cost: number): CashEquipmentCostConfig {
  return { max, cost }
}

/**
 * 創建技能/咒語成本數據
 */
function createSkillSpellCostData(base: number): CostData {
  return {
    base,
    rules: [
      { threshold: 50, extraCost: 10 },
      { threshold: 100, extraCost: 20 },
      { threshold: 200, extraCost: 30 }
    ]
  }
}

/**
 * 轉職硬幣消耗配置
 */
export const LINEAGE_JOB_CHANGE_COSTS: JobChangeCosts = {
  // 基本裝備成本（相容性）
  equipment: {
    weapon: { rare: 1, hero: 9, legend: 27, mythic: 81 },
    armor: { rare: 1, hero: 9, legend: 27, mythic: 81 },
    accessory: { rare: 1, hero: 9, legend: 27, mythic: 81 },
    cash: { rare: 5, hero: 5, legend: 5, mythic: 5 }
  },

  // 詳細裝備成本配置
  detailedEquipment: {
    // 武器
    weapon: { max: 3, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    
    // 防具
    helmet: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    chest: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    arms: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    gloves: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    legs: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    boots: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    belt: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    cloak: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    
    // 飾品
    necklace: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    earring: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    ring: { max: 4, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
    rune: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } }
  },

  // 商城裝備成本
  cashEquipment: {
    shirt: { max: 3, cost: 5 },
    shoulder: { max: 1, cost: 5 },
    mask: { max: 1, cost: 5 }
  },

  // 技能成本
  skills: {
    rare: { 
      base: 1, 
      rules: []
    },
    hero: { 
      base: 9, 
      rules: [
        { threshold: 6, extraCost: 18 },
        { threshold: 7, extraCost: 27 }
      ]
    },
    legend: { 
      base: 27, 
      rules: [
        { threshold: 3, extraCost: 54 },
        { threshold: 4, extraCost: 81 }
      ]
    },
    mythic: { 
      base: 81, 
      rules: [
        { threshold: 1, extraCost: 162 }
      ]
    }
  },

  // 咒語卡片成本
  spells: {
    rare: { 
      base: 1, 
      rules: [
        { threshold: 10, extraCost: 1 }
      ]
    },
    hero: { 
      base: 9, 
      rules: [
        { threshold: 10, extraCost: 18 },
        { threshold: 11, extraCost: 27 }
      ]
    },
    legend: { 
      base: 27, 
      rules: [
        { threshold: 10, extraCost: 54 },
        { threshold: 11, extraCost: 81 }
      ]
    },
    mythic: { 
      base: 81, 
      rules: []
    }
  }
}

/**
 * 獲取裝備成本
 */
export function getEquipmentCost(equipmentType: EquipmentType, quality: QualityLevel): number {
  const config = LINEAGE_JOB_CHANGE_COSTS.detailedEquipment[equipmentType]
  return config ? config.costs[quality] : 0
}

/**
 * 獲取商城裝備成本
 */
export function getCashEquipmentCost(equipmentType: CashEquipmentType): number {
  const config = LINEAGE_JOB_CHANGE_COSTS.cashEquipment[equipmentType]
  return config ? config.cost : 0
}

/**
 * 計算技能/咒語成本（包含複雜規則）
 */
export function calculateSkillSpellCost(type: 'skills' | 'spells', quality: QualityLevel, quantity: number): number {
  const costData = LINEAGE_JOB_CHANGE_COSTS[type][quality]
  if (!costData) return 0

  let totalCost = 0
  let remaining = quantity

  // 基本成本
  const basicQuantity = Math.min(remaining, costData.rules.length > 0 ? costData.rules[0].threshold : remaining)
  totalCost += basicQuantity * costData.base
  remaining -= basicQuantity

  // 應用規則
  for (const rule of costData.rules) {
    if (remaining <= 0) break
    
    const applicable = Math.min(remaining, rule.threshold)
    totalCost += applicable * (costData.base + rule.extraCost)
    remaining -= applicable
  }

  // 剩餘數量使用最高成本
  if (remaining > 0 && costData.rules.length > 0) {
    const highestRule = costData.rules[costData.rules.length - 1]
    totalCost += remaining * (costData.base + highestRule.extraCost)
  } else if (remaining > 0) {
    totalCost += remaining * costData.base
  }

  return totalCost
}

/**
 * 獲取裝備名稱
 */
export function getEquipmentName(category: string, subtype: string, quality?: QualityLevel): string {
  const categoryConfig = EQUIPMENT_OPTIONS[category as keyof typeof EQUIPMENT_OPTIONS]
  if (!categoryConfig) return `未知裝備`

  const subtypeName = categoryConfig.subtypes[subtype as keyof typeof categoryConfig.subtypes] || subtype
  
  if (quality && quality in QUALITY_OPTIONS) {
    const qualityName = QUALITY_OPTIONS[quality] || quality
    return `${qualityName} ${subtypeName}`
  }
  
  return subtypeName
}

/**
 * 獲取裝備圖標
 */
export function getEquipmentIcon(category: string, subtype: string): string {
  const iconMap: Record<string, string> = {
    'weapon': '⚔️',
    'helmet': '⛑️',
    'chest': '🛡️',
    'arms': '🛡️',
    'gloves': '🧤',
    'legs': '👖',
    'boots': '👢',
    'belt': '📿',
    'cloak': '🧥',
    'necklace': '📿',
    'earring': '💎',
    'ring': '💍',
    'rune': '🗿',
    'shirt': '👔',
    'shoulder': '🎽',
    'mask': '🎭',
    'skill': '⚡',
    'spell': '🃏'
  }
  
  return iconMap[subtype] || iconMap[category] || '📦'
}
