export const MAIN_STAT_WEIGHT = 1.5

// 成長期望值
export const MAIN_STAT_EXPECTED_GROWTH = 3.75 // 每級主屬性期望
export const SUB_STAT_EXPECTED_GROWTH = 1.25 // 每級副屬性期望

// 分數與評級對照
export interface GrowthScoreRule {
  minRate: number
  score: number
  rating: 'excellent' | 'good' | 'average' | 'poor' | 'bad'
}

export const GROWTH_SCORE_RULES: GrowthScoreRule[] = [
  { minRate: 1.4, score: 100, rating: 'excellent' },
  { minRate: 1.2, score: 85, rating: 'good' },
  { minRate: 1.0, score: 70, rating: 'average' },
  { minRate: 0.85, score: 55, rating: 'poor' },
  { minRate: 0, score: 30, rating: 'bad' },
]

export interface OverallRatingRule {
  minScore: number
  rating: 'godTier' | 'highQuality' | 'normalPet' | 'needImprovement' | 'tragic'
}

export const OVERALL_RATING_RULES: OverallRatingRule[] = [
  { minScore: 95, rating: 'godTier' },
  { minScore: 80, rating: 'highQuality' },
  { minScore: 60, rating: 'normalPet' },
  { minScore: 45, rating: 'needImprovement' },
  { minScore: 0, rating: 'tragic' },
]
