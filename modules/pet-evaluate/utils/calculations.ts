import type {
  PetType,
  PetStats,
  StatAnalysis,
  PetCalculationResult,
  RatingLevel,
  OverallRating,
  StatType,
} from '../types'
import { STAT_NAMES, isMainStat } from './petData'
import {
  MAIN_STAT_EXPECTED_GROWTH,
  SUB_STAT_EXPECTED_GROWTH,
  GROWTH_SCORE_RULES,
  OVERALL_RATING_RULES,
} from '../constants'
import { MAIN_STAT_WEIGHT } from '../constants'
import { calculateCharacterBonus } from '../../shared/utils'

/**
 * 計算期望屬性值
 */
export function calculateExpectedStats(pet: PetType, level: number): PetStats {
  const expectedStats: PetStats = { ...pet.baseStats }
  const growthLevels = level - 1

  Object.keys(pet.baseStats).forEach((statName) => {
    const statKey = statName as keyof PetStats
    const baseValue = pet.baseStats[statKey]
    const isMainStatValue = isMainStat(pet, statKey)

    // 主屬性預期成長：每級 +3.75 點
    // 副屬性預期成長：每級 +1.25 點
    const expectedGrowthPerLevel = isMainStatValue
      ? MAIN_STAT_EXPECTED_GROWTH
      : SUB_STAT_EXPECTED_GROWTH
    const expectedGrowth = growthLevels * expectedGrowthPerLevel

    expectedStats[statKey] = Math.round((baseValue + expectedGrowth) * 100) / 100
  })

  return expectedStats
}

/**
 * 根據成長率獲取分數
 */
export function getScoreByGrowthRate(growthRate: number): number {
  const rule = GROWTH_SCORE_RULES.find((r) => growthRate >= r.minRate) || GROWTH_SCORE_RULES.at(-1)!
  return rule.score
}

/**
 * 根據分數獲取評級
 */
export function getRatingByScore(score: number): RatingLevel {
  const rule = GROWTH_SCORE_RULES.find((r) => score >= r.score) || GROWTH_SCORE_RULES.at(-1)!
  return rule.rating
}

/**
 * 根據整體平均分數獲取整體評價
 */
export function getOverallRating(averageScore: number): OverallRating {
  const rule =
    OVERALL_RATING_RULES.find((r) => averageScore >= r.minScore) || OVERALL_RATING_RULES.at(-1)!
  return rule.rating
}

/**
 * 分析單一屬性
 */
export function analyzeStatistic(
  statName: StatType,
  currentValue: number,
  expectedValue: number,
  baseValue: number,
  pet: PetType,
): StatAnalysis {
  const growth = currentValue - baseValue
  const expectedGrowth = expectedValue - baseValue

  // 計算成長率
  let growthRate = 0
  if (expectedGrowth > 0) {
    growthRate = growth / expectedGrowth
  } else if (growth === 0 && expectedGrowth === 0) {
    growthRate = 1.0 // 完美符合預期
  }

  // 積極性特殊處理
  if (statName === 'aggressiveness') {
    return {
      stat: statName,
      statName: STAT_NAMES[statName],
      currentValue,
      expectedValue,
      baseValue,
      growthValue: growth,
      growthRate: 1.0,
      score: 70,
      rating: 'not_rated' as RatingLevel,
      isMainStat: false,
      characterBonus: calculateCharacterBonus(statName, currentValue),
    }
  }

  const score = getScoreByGrowthRate(growthRate)
  const rating = getRatingByScore(score)

  return {
    stat: statName,
    statName: STAT_NAMES[statName],
    currentValue,
    expectedValue,
    baseValue,
    growthValue: growth,
    growthRate,
    score,
    rating,
    isMainStat: isMainStat(pet, statName),
    characterBonus: calculateCharacterBonus(statName, currentValue),
  }
}

/**
 * 完整的寵物評價計算
 */
export function calculatePetRating(
  pet: PetType,
  level: number,
  currentStats: PetStats,
): PetCalculationResult {
  const expectedStats = calculateExpectedStats(pet, level)
  const analysis: StatAnalysis[] = []

  let totalScore = 0
  let totalWeight = 0

  // 分析每個屬性
  Object.keys(pet.baseStats).forEach((statName) => {
    const statKey = statName as keyof PetStats

    const statAnalysis = analyzeStatistic(
      statKey,
      currentStats[statKey],
      expectedStats[statKey],
      pet.baseStats[statKey],
      pet,
    )

    analysis.push(statAnalysis)

    // 排除積極性的權重計算
    if (statKey !== 'aggressiveness') {
      const weight = statAnalysis.isMainStat ? MAIN_STAT_WEIGHT : 1.0
      totalScore += statAnalysis.score * weight
      totalWeight += weight
    }
  })

  // 計算整體評分
  const overallScore = Math.round((totalScore / totalWeight) * 100) / 100
  const rating = getOverallRating(overallScore)

  return {
    pet,
    level,
    currentStats,
    expectedStats,
    analysis,
    overallScore,
    rating,
  }
}

/**
 * 評級描述
 */
export function getRatingDescription(rating: string): string {
  const descriptions: Record<string, string> = {
    godTier: '🌟 神級寵物！屬性成長遠超預期，值得重點培養！',
    highQuality: '⭐ 優質寵物！屬性成長良好，推薦培養！',
    normalPet: '✅ 普通寵物，屬性成長合乎預期，可正常使用。',
    needImprovement: '⚠️ 屬性成長不佳，建議考慮重新培養。',
    tragic: '💔 悲劇寵物，屬性成長極差，強烈建議重新培養。',
    excellent: '🌟 頂級成長',
    good: '⭐ 優秀成長',
    average: '✅ 良好成長',
    poor: '➡️ 普通成長',
    bad: '⚠️ 待加強',
  }

  return descriptions[rating] || descriptions.normalPet
}
