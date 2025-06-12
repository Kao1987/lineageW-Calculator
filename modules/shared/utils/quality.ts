import type { QualityLevel } from '../../job-change/types'

/**
 * 擴展的品質等級類型（包含商城）
 */
export type ExtendedQualityLevel = QualityLevel | 'cash'

/**
 * 品質等級顯示配置
 */
export const QUALITY_DISPLAY: Record<
  ExtendedQualityLevel,
  { text: string; className: string; emoji: string }
> = {
  rare: { text: '稀有', className: 'quality-rare', emoji: '🔵' },
  hero: { text: '英雄', className: 'quality-hero', emoji: '🟣' },
  legend: { text: '傳說', className: 'quality-legend', emoji: '🟠' },
  mythic: { text: '神話', className: 'quality-mythic', emoji: '🔴' },
  cash: { text: '商城', className: 'quality-cash', emoji: '💼' },
}

/**
 * 獲取品質顯示文字
 */
export function getQualityText(quality: ExtendedQualityLevel): string {
  return QUALITY_DISPLAY[quality]?.text || quality
}

/**
 * 獲取品質CSS類名
 */
export function getQualityClassName(quality: ExtendedQualityLevel): string {
  return QUALITY_DISPLAY[quality]?.className || ''
}

/**
 * 獲取品質emoji
 */
export function getQualityEmoji(quality: ExtendedQualityLevel): string {
  return QUALITY_DISPLAY[quality]?.emoji || ''
}

/**
 * 獲取完整的品質顯示（emoji + 文字）
 */
export function getQualityFullText(quality: ExtendedQualityLevel): string {
  const config = QUALITY_DISPLAY[quality]
  return config ? `${config.emoji} ${config.text}` : quality
}

/**
 * 生成品質徽章的HTML類名組合
 */
export function getQualityBadgeClasses(quality: ExtendedQualityLevel): string {
  return `quality-badge ${getQualityClassName(quality)}`
}
