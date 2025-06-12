import type {
  CostData,
  QualityLevel,
  EquipmentType,
  CashEquipmentType,
  CategoryCostResult,
  CostCalculationDetails,
  CartItem,
  ValidationResult,
} from '../types'
import {
  LINEAGE_JOB_CHANGE_COSTS,
  BASE_JOB_CHANGE_COST,
  PACKAGE_DISCOUNT_AMOUNT,
  getEquipmentCost,
  getCashEquipmentCost,
  calculateSkillSpellCost,
} from './costData'

/**
 * 安全數值轉換
 */
export const safeNumber = (value: unknown, defaultValue: number = 0): number => {
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 複雜成本計算（技能和咒語卡專用）
 * 基於原 calculateComplexCost() 方法
 */
export function calculateComplexCost(count: number, costData: CostData): number {
  if (count === 0) return 0

  const { base, rules } = costData

  if (rules.length === 0) {
    // 沒有特殊規則，直接按基本費率計算
    return count * base
  }

  // 對規則按threshold排序
  const sortedRules = [...rules].sort((a, b) => a.threshold - b.threshold)

  let remainingCount = count
  let currentCost = 0

  // 先計算基本數量的費用
  if (remainingCount > 0) {
    const baseQuantity = Math.min(remainingCount, sortedRules[0]?.threshold || remainingCount)
    currentCost += baseQuantity * base
    remainingCount -= baseQuantity
  }

  // 依序計算各階段的額外費用
  for (let i = 0; i < sortedRules.length && remainingCount > 0; i++) {
    const rule = sortedRules[i]
    const nextThreshold = sortedRules[i + 1]?.threshold || Infinity
    const quantityAtThisLevel = Math.min(remainingCount, nextThreshold - rule.threshold)

    if (quantityAtThisLevel > 0) {
      currentCost += quantityAtThisLevel * rule.extraCost
      remainingCount -= quantityAtThisLevel
    }
  }

  return currentCost
}

/**
 * 計算裝備成本（按類型）
 * 基於原 calculateEquipmentCostByType() 方法
 */
export function calculateEquipmentCostByType(
  equipmentTypes: EquipmentType | EquipmentType[],
  inputGetter: (id: string) => number,
  isDetailed: boolean = false,
  customCosts?: Record<QualityLevel, number>,
): number {
  const prefix = isDetailed ? 'detailed-' : ''
  const types = Array.isArray(equipmentTypes) ? equipmentTypes : [equipmentTypes]
  let totalCost = 0

  types.forEach((type) => {
    ;(['rare', 'hero', 'legend', 'mythic'] as QualityLevel[]).forEach((quality) => {
      const inputId = `${prefix}${type}-${quality}`
      const count = inputGetter(inputId)
      const cost =
        customCosts?.[quality] ||
        LINEAGE_JOB_CHANGE_COSTS.detailedEquipment[type]?.costs[quality] ||
        0
      totalCost += count * cost
    })
  })

  return totalCost
}

/**
 * 計算技能成本（舊版相容）
 */
export function calculateSkillCostLegacy(
  inputGetter: (id: string) => number,
  isDetailed: boolean = false,
): number {
  const prefix = isDetailed ? 'detailed-' : ''
  let totalCost = 0

  ;(['rare', 'hero', 'legend', 'mythic'] as QualityLevel[]).forEach((quality) => {
    const inputId = `${prefix}skill-${quality}`
    const count = inputGetter(inputId)

    if (count > 0) {
      const costData = LINEAGE_JOB_CHANGE_COSTS.skills[quality]
      totalCost += calculateComplexCost(count, costData)
    }
  })

  return totalCost
}

/**
 * 計算咒語卡成本（舊版相容）
 */
export function calculateSpellCostLegacy(
  inputGetter: (id: string) => number,
  isDetailed: boolean = false,
): number {
  const prefix = isDetailed ? 'detailed-' : ''
  let totalCost = 0

  ;(['rare', 'hero', 'legend', 'mythic'] as QualityLevel[]).forEach((quality) => {
    const inputId = `${prefix}spell-${quality}`
    const count = inputGetter(inputId)

    if (count > 0) {
      const costData = LINEAGE_JOB_CHANGE_COSTS.spells[quality]
      totalCost += calculateComplexCost(count, costData)
    }
  })

  return totalCost
}

/**
 * 計算商城裝備成本
 */
export function calculateCashCost(
  inputGetter: (id: string) => number,
  isDetailed: boolean = false,
): number {
  const prefix = isDetailed ? 'detailed-' : ''
  let totalCost = 0

  Object.entries(LINEAGE_JOB_CHANGE_COSTS.cashEquipment).forEach(([type, config]) => {
    const inputId = `${prefix}cash-${type}`
    const count = inputGetter(inputId)
    totalCost += count * config.cost
  })

  return totalCost
}

/**
 * 計算購物車總成本
 */
export function calculateCartCost(cartItems: CartItem[]): number {
  return cartItems.reduce((sum, item) => sum + item.cost, 0)
}

/**
 * 計算完整的轉職成本
 */
export function calculateJobChangeCost(
  inputGetter: (id: string) => number,
  cartItems: CartItem[] = [],
  hasPackageDiscount: boolean = false,
  isDetailed: boolean = false,
): CostCalculationDetails {
  // 如果有購物車項目，直接使用購物車計算
  if (cartItems.length > 0) {
    const totalCoinCost = calculateCartCost(cartItems)
    const packageDiscount = hasPackageDiscount ? PACKAGE_DISCOUNT_AMOUNT : 0
    const finalCoinCost = Math.max(0, totalCoinCost - packageDiscount)
    const totalCost = BASE_JOB_CHANGE_COST + finalCoinCost

    return {
      equipmentCost: 0,
      skillCost: 0,
      spellCost: 0,
      cashCost: 0,
      totalCoinCost,
      packageDiscount,
      finalCoinCost,
      baseCost: BASE_JOB_CHANGE_COST,
      totalCost,
    }
  }

  // 計算各類型成本
  const equipmentCost = calculateEquipmentCostForForm(inputGetter, isDetailed)
  const skillCost = calculateSkillCostLegacy(inputGetter, isDetailed)
  const spellCost = calculateSpellCostLegacy(inputGetter, isDetailed)
  const cashCost = calculateCashCost(inputGetter, isDetailed)

  const totalCoinCost = equipmentCost + skillCost + spellCost + cashCost
  const packageDiscount = hasPackageDiscount ? PACKAGE_DISCOUNT_AMOUNT : 0
  const finalCoinCost = Math.max(0, totalCoinCost - packageDiscount)
  const totalCost = BASE_JOB_CHANGE_COST + finalCoinCost

  return {
    equipmentCost,
    skillCost,
    spellCost,
    cashCost,
    totalCoinCost,
    packageDiscount,
    finalCoinCost,
    baseCost: BASE_JOB_CHANGE_COST,
    totalCost,
  }
}

/**
 * 計算裝備成本（舊版表單）
 */
function calculateEquipmentCostForForm(
  inputGetter: (id: string) => number,
  isDetailed: boolean = false,
): number {
  const weaponCost = calculateEquipmentCostByType(['weapon'], inputGetter, isDetailed)

  const armorCost = calculateEquipmentCostByType(
    ['helmet', 'chest', 'arms', 'gloves', 'legs', 'boots', 'belt', 'cloak'],
    inputGetter,
    isDetailed,
  )

  const accessoryCost = calculateEquipmentCostByType(
    ['necklace', 'earring', 'ring', 'rune'],
    inputGetter,
    isDetailed,
  )

  return weaponCost + armorCost + accessoryCost
}

/**
 * 計算單個物品成本
 */
export function calculateItemCost(
  equipmentType: EquipmentType | CashEquipmentType,
  quality: QualityLevel | 'cash',
  quantity: number,
): number {
  if (quality === 'cash') {
    const config = LINEAGE_JOB_CHANGE_COSTS.cashEquipment[equipmentType as CashEquipmentType]
    return config ? config.cost * quantity : 0
  }

  const config = LINEAGE_JOB_CHANGE_COSTS.detailedEquipment[equipmentType as EquipmentType]
  return config ? config.costs[quality as QualityLevel] * quantity : 0
}

/**
 * 計算購物車總成本（新版本）
 */
export function calculateTotalCost(
  cartItems: CartItem[],
  hasPackageDiscount: boolean = false,
): CostCalculationDetails {
  // 分類計算
  const equipmentResult = calculateEquipmentCostFromCart(cartItems)
  const skillResult = calculateSkillCostFromCart(cartItems)
  const spellResult = calculateSpellCostFromCart(cartItems)
  const cashResult = calculateCashEquipmentCostFromCart(cartItems)

  // 總硬幣成本
  const totalCoinCost =
    equipmentResult.totalCoins +
    skillResult.totalCoins +
    spellResult.totalCoins +
    cashResult.totalCoins

  // 套餐折扣
  const packageDiscount = hasPackageDiscount ? PACKAGE_DISCOUNT_AMOUNT : 0
  const finalCoinCost = Math.max(0, totalCoinCost - packageDiscount)

  // 總計費用
  const totalCost = BASE_JOB_CHANGE_COST + finalCoinCost

  return {
    equipmentCost: equipmentResult.totalCoins,
    skillCost: skillResult.totalCoins,
    spellCost: spellResult.totalCoins,
    cashCost: cashResult.totalCoins,
    totalCoinCost,
    packageDiscount,
    finalCoinCost,
    baseCost: BASE_JOB_CHANGE_COST,
    totalCost,
  }
}

/**
 * 計算裝備成本（從購物車）
 */
export function calculateEquipmentCostFromCart(cartItems: CartItem[]): CategoryCostResult {
  const equipmentItems = cartItems.filter((item) =>
    ['weapon', 'armor', 'accessory'].includes(item.equipmentType),
  )

  let totalCoins = 0
  const itemCosts: Record<string, number> = {}

  equipmentItems.forEach((item) => {
    const cost = getEquipmentCost(item.subtype as EquipmentType, item.quality as QualityLevel)
    const itemTotalCost = cost * item.quantity
    totalCoins += itemTotalCost

    const key = `${item.subtype}-${item.quality}`
    itemCosts[key] = (itemCosts[key] || 0) + itemTotalCost
  })

  return { totalCoins, itemCosts }
}

/**
 * 計算技能成本（從購物車）
 */
export function calculateSkillCostFromCart(cartItems: CartItem[]): CategoryCostResult {
  const skillItems = cartItems.filter((item) => item.equipmentType === 'skill')

  let totalCoins = 0
  const itemCosts: Record<string, number> = {}

  // 按品質分組計算
  const skillsByQuality: Record<QualityLevel, number> = {
    rare: 0,
    hero: 0,
    legend: 0,
    mythic: 0,
  }

  skillItems.forEach((item) => {
    if (item.quality in skillsByQuality) {
      skillsByQuality[item.quality as QualityLevel] += item.quantity
    }
  })

  // 計算每個品質的成本
  Object.entries(skillsByQuality).forEach(([quality, quantity]) => {
    if (quantity > 0) {
      const cost = calculateSkillSpellCost('skills', quality as QualityLevel, quantity)
      totalCoins += cost
      itemCosts[`skill-${quality}`] = cost
    }
  })

  return { totalCoins, itemCosts }
}

/**
 * 計算咒語卡片成本（從購物車）
 */
export function calculateSpellCostFromCart(cartItems: CartItem[]): CategoryCostResult {
  const spellItems = cartItems.filter((item) => item.equipmentType === 'spell')

  let totalCoins = 0
  const itemCosts: Record<string, number> = {}

  // 按品質分組計算
  const spellsByQuality: Record<QualityLevel, number> = {
    rare: 0,
    hero: 0,
    legend: 0,
    mythic: 0,
  }

  spellItems.forEach((item) => {
    if (item.quality in spellsByQuality) {
      spellsByQuality[item.quality as QualityLevel] += item.quantity
    }
  })

  // 計算每個品質的成本
  Object.entries(spellsByQuality).forEach(([quality, quantity]) => {
    if (quantity > 0) {
      const cost = calculateSkillSpellCost('spells', quality as QualityLevel, quantity)
      totalCoins += cost
      itemCosts[`spell-${quality}`] = cost
    }
  })

  return { totalCoins, itemCosts }
}

/**
 * 計算商城裝備成本（從購物車）
 */
export function calculateCashEquipmentCostFromCart(cartItems: CartItem[]): CategoryCostResult {
  const cashItems = cartItems.filter((item) => item.equipmentType === 'cash')

  let totalCoins = 0
  const itemCosts: Record<string, number> = {}

  cashItems.forEach((item) => {
    const cost = getCashEquipmentCost(item.subtype as CashEquipmentType)
    const itemTotalCost = cost * item.quantity
    totalCoins += itemTotalCost

    const key = `cash-${item.subtype}`
    itemCosts[key] = (itemCosts[key] || 0) + itemTotalCost
  })

  return { totalCoins, itemCosts }
}

/**
 * 驗證購物車項目
 */
export function validateCartItems(cartItems: CartItem[]): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // 檢查武器總數限制（所有品質加起來不超過3個）
  const weaponItems = cartItems.filter((item) => item.subtype === 'weapon')
  const totalWeapons = weaponItems.reduce((sum, item) => sum + item.quantity, 0)

  if (totalWeapons > 3) {
    errors.push(`武器總數 ${totalWeapons} 超過限制 (最多3個，包含所有品質)`)
  }

  // 檢查其他裝備數量限制
  const equipmentCounts: Record<string, number> = {}

  cartItems.forEach((item) => {
    if (item.subtype !== 'weapon') {
      // 武器已經單獨檢查了
      const key = item.subtype
      equipmentCounts[key] = (equipmentCounts[key] || 0) + item.quantity
    }
  })

  // 檢查詳細裝備限制
  Object.entries(equipmentCounts).forEach(([equipmentType, count]) => {
    const config = LINEAGE_JOB_CHANGE_COSTS.detailedEquipment[equipmentType as EquipmentType]
    if (config && count > config.max) {
      errors.push(`${equipmentType} 超過數量限制 (${count}/${config.max})`)
    }
  })

  // 檢查商城裝備限制
  cartItems
    .filter((item) => item.equipmentType === 'cash')
    .forEach((item) => {
      const config = LINEAGE_JOB_CHANGE_COSTS.cashEquipment[item.subtype as CashEquipmentType]
      if (config && item.quantity > config.max) {
        errors.push(`${item.subtype} 超過商城裝備數量限制 (${item.quantity}/${config.max})`)
      }
    })

  // 檢查技能和咒語的合理性
  const totalSkills = cartItems
    .filter((item) => item.equipmentType === 'skill')
    .reduce((sum, item) => sum + item.quantity, 0)

  const totalSpells = cartItems
    .filter((item) => item.equipmentType === 'spell')
    .reduce((sum, item) => sum + item.quantity, 0)

  if (totalSkills > 20) {
    warnings.push(`技能數量較多 (${totalSkills}個)，請確認是否合理`)
  }

  if (totalSpells > 20) {
    warnings.push(`咒語卡片數量較多 (${totalSpells}張)，請確認是否合理`)
  }

  // 檢查空計算項目
  if (cartItems.length === 0) {
    warnings.push('計算項目為空，請添加要轉職的物品')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * 格式化成本顯示
 */
export function formatCost(cost: number, unit: string = '枚'): string {
  if (cost === 0) return `0 ${unit}`
  return `${cost.toLocaleString()} ${unit}`
}

/**
 * 格式化費用總結
 */
export function formatCostSummary(details: CostCalculationDetails): string[] {
  const summary: string[] = []

  summary.push(`基本轉職費用: ${formatCost(details.baseCost, '鑽石')}`)

  if (details.equipmentCost > 0) {
    summary.push(`裝備轉職硬幣: ${formatCost(details.equipmentCost)}`)
  }

  if (details.skillCost > 0) {
    summary.push(`技能轉職硬幣: ${formatCost(details.skillCost)}`)
  }

  if (details.spellCost > 0) {
    summary.push(`咒語轉職硬幣: ${formatCost(details.spellCost)}`)
  }

  if (details.cashCost > 0) {
    summary.push(`商城裝備轉職硬幣: ${formatCost(details.cashCost)}`)
  }

  if (details.packageDiscount > 0) {
    summary.push(`套餐折扣: -${formatCost(details.packageDiscount)}`)
  }

  summary.push(`轉職硬幣小計: ${formatCost(details.finalCoinCost)}`)
  summary.push(
    `總計費用: ${formatCost(details.baseCost, '鑽石')} + ${formatCost(details.finalCoinCost)}`,
  )

  return summary
}

/**
 * 計算單項物品成本
 */
export function calculateSingleItemCost(
  equipmentType: string,
  subtype: string,
  quality: string,
  quantity: number,
): number {
  switch (equipmentType) {
    case 'skill':
      return calculateSkillSpellCost('skills', quality as QualityLevel, quantity)

    case 'spell':
      return calculateSkillSpellCost('spells', quality as QualityLevel, quantity)

    case 'cash':
      const cashCost = getCashEquipmentCost(subtype as CashEquipmentType)
      return cashCost * quantity

    default:
      // 一般裝備
      const equipCost = getEquipmentCost(subtype as EquipmentType, quality as QualityLevel)
      return equipCost * quantity
  }
}
