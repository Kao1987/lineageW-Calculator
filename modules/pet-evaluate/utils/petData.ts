import type { PetType, StatType, UpgradeRateTable } from '../types'

/**
 * 寵物基礎數據
 */
export const PET_DATA: Record<string, PetType> = {
  wolf: {
    id: 'wolf',
    name: '狼',
    emoji: '🐺',
    image: '/pets/wolf.png',
    mainStat: 'hp',
    baseStats: {
      endurance: 6,    // 忍耐力
      loyalty: 6,      // 忠誠心
      speed: 6,        // 速度
      aggressiveness: 3, // 積極性
      hp: 14          // 體力
    }
  },
  dog: {
    id: 'dog',
    name: '杜賓狗',
    emoji: '🐕',
    image: '/pets/dubin.png',
    mainStat: 'loyalty',
    baseStats: {
      endurance: 6,
      loyalty: 14,
      speed: 6,
      aggressiveness: 3,
      hp: 6
    }
  },
  shepherd: {
    id: 'shepherd',
    name: '牧羊犬',
    emoji: '🐕‍🦺',
    image: '/pets/sheepdog.png',
    mainStat: 'endurance',
    baseStats: {
      endurance: 14,
      loyalty: 6,
      speed: 6,
      aggressiveness: 3,
      hp: 6
    }
  },
  hound: {
    id: 'hound',
    name: '小獵犬',
    emoji: '🐶',
    image: '/pets/beagle.png',
    mainStat: 'speed',
    baseStats: {
      endurance: 6,
      loyalty: 6,
      speed: 14,
      aggressiveness: 3,
      hp: 6
    }
  }
}

/**
 * 升級機率表
 */
export const UPGRADE_RATES: UpgradeRateTable = {
  main: [
    { level: 1, rate: 0.05 },
    { level: 2, rate: 0.15 },
    { level: 3, rate: 0.30 },
    { level: 4, rate: 0.20 },
    { level: 5, rate: 0.15 },
    { level: 6, rate: 0.10 },
    { level: 7, rate: 0.05 }
  ],
  sub: [
    { level: 0, rate: 0.15 },
    { level: 1, rate: 0.50 },
    { level: 2, rate: 0.30 },
    { level: 3, rate: 0.05 }
  ]
}

/**
 * 屬性名稱對應
 */
export const STAT_NAMES: Record<StatType, string> = {
  endurance: '忍耐力',
  loyalty: '忠誠心',
  speed: '速度',
  aggressiveness: '積極性',
  hp: '體力'
}

/**
 * 屬性描述對應
 */
export const STAT_DESCRIPTIONS: Record<StatType, string> = {
  endurance: '5點=1物防',
  loyalty: '5點=1近/遠/魔命中',
  speed: '10點=1近/遠迴避',
  aggressiveness: '3點=1攻擊力',
  hp: '1點=30HP'
}

/**
 * 計算期望值
 */
export function calculateExpectedValue(rates: Array<{level: number, rate: number}>): number {
  return rates.reduce((sum, item) => sum + (item.level * item.rate), 0)
}

/**
 * 主屬性期望值（每級）
 */
export const MAIN_STAT_EXPECTED = calculateExpectedValue(UPGRADE_RATES.main) // 3.75

/**
 * 副屬性期望值（每級）
 */
export const SUB_STAT_EXPECTED = calculateExpectedValue(UPGRADE_RATES.sub) // 1.25

/**
 * 獲取寵物列表
 */
export function getPetList(): PetType[] {
  return Object.values(PET_DATA)
}

/**
 * 根據ID獲取寵物
 */
export function getPetById(id: string): PetType | undefined {
  return PET_DATA[id]
}

/**
 * 獲取寵物的主屬性名稱
 */
export function getMainStatName(pet: PetType): string {
  return STAT_NAMES[pet.mainStat]
}

/**
 * 檢查是否為主屬性
 */
export function isMainStat(pet: PetType, stat: StatType): boolean {
  return pet.mainStat === stat
}
