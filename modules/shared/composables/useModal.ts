// 模態視窗管理 Composable

import { reactive, computed } from 'vue'

export interface ModalConfig {
  id: string
  title: string
  content?: string
  type?: 'help' | 'info' | 'custom'
  closable?: boolean
  size?: 'small' | 'medium' | 'large'
  component?: string
}

interface ModalState {
  isOpen: boolean
  activeModal: ModalConfig | null
  modals: Map<string, ModalConfig>
}

// 全局模態視窗狀態
const modalState = reactive<ModalState>({
  isOpen: false,
  activeModal: null,
  modals: new Map(),
})

/**
 * 模態視窗管理 Composable
 */
export function useModal() {
  // 註冊模態視窗
  const registerModal = (config: ModalConfig) => {
    modalState.modals.set(config.id, {
      closable: true,
      size: 'medium',
      type: 'custom',
      ...config,
    })
  }

  // 開啟模態視窗
  const openModal = (modalId: string, customContent?: string) => {
    const modal = modalState.modals.get(modalId)
    if (!modal) {
      console.warn(`Modal with id "${modalId}" not found`)
      return
    }

    modalState.activeModal = customContent ? { ...modal, content: customContent } : modal
    modalState.isOpen = true

    // 禁用背景滾動
    document.body.style.overflow = 'hidden'

    // 設置 ARIA 屬性
    document.body.setAttribute('aria-hidden', 'true')
  }

  // 關閉模態視窗
  const closeModal = () => {
    modalState.isOpen = false
    modalState.activeModal = null

    // 恢復背景滾動
    document.body.style.overflow = ''
    document.body.removeAttribute('aria-hidden')
  }

  // 按 ESC 關閉
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && modalState.isOpen && modalState.activeModal?.closable) {
      closeModal()
    }
  }

  // 點擊背景關閉
  const handleBackdropClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.classList.contains('modal-backdrop')) {
      closeModal()
    }
  }

  // 計算屬性
  const isOpen = computed(() => modalState.isOpen)
  const activeModal = computed(() => modalState.activeModal)

  return {
    // 狀態
    isOpen,
    activeModal,

    // 方法
    registerModal,
    openModal,
    closeModal,
    handleEscape,
    handleBackdropClick,
  }
}

/**
 * 預設模態視窗配置
 */
export const defaultModals: ModalConfig[] = [
  {
    id: 'help-modal',
    title: '🐾 使用說明',
    type: 'help',
    size: 'large',
  },
  {
    id: 'info-modal',
    title: '💰 轉職硬幣消耗說明',
    type: 'info',
    size: 'medium',
  },
  {
    id: 'complex-calc-modal',
    title: '💰 複雜計算說明',
    type: 'info',
    size: 'medium',
  },
]

/**
 * 寵物評價幫助內容
 */
export const petEvaluateHelpContent = {
  usage: {
    title: '🚀 使用步驟',
    steps: [
      { num: 1, text: '選擇您的寵物類型' },
      { num: 2, text: '輸入寵物等級（1-15）' },
      { num: 3, text: '輸入各屬性數值（⚠️請扣除技能加成）' },
      { num: 4, text: '點擊計算按鈕查看評價' },
    ],
  },
  calculation: {
    title: '🧮 計算原理',
    upgradeRates: {
      mainStat: '+1(5%)，+2(15%)，+3(30%)，+4(20%)，+5(15%)，+6(10%)，+7(5%)',
      mainExpected: '期望值：每級+3.75點',
      subStat: '+0(15%)，+1(50%)，+2(30%)，+3(5%)',
      subExpected: '期望值：每級+1.25點',
    },
    formula: [
      { step: 1, title: '計算期望值', desc: '期望值 = 基礎值 + (等級-1) × 每級期望成長' },
      { step: 2, title: '計算成長率', desc: '成長率 = (當前值 - 基礎值) ÷ (期望值 - 基礎值)' },
      { step: 3, title: '主屬性加權', desc: '主屬性分數 × 1.5倍權重' },
    ],
    baseData: [
      { pet: '狼', endurance: 6, loyalty: 6, speed: 6, aggressiveness: 3, hp: 14 },
      { pet: '杜賓狗', endurance: 6, loyalty: 14, speed: 6, aggressiveness: 3, hp: 6 },
      { pet: '牧羊犬', endurance: 14, loyalty: 6, speed: 6, aggressiveness: 3, hp: 6 },
      { pet: '小獵犬', endurance: 6, loyalty: 6, speed: 14, aggressiveness: 3, hp: 6 },
    ],
  },
  rating: {
    title: '⭐ 評價等級',
    individual: [
      {
        level: 'excellent',
        badge: '頂級',
        desc: '🌟 頂級（>=1.40倍）：100分 - 成長率達140%以上',
        score: 100,
      },
      {
        level: 'good',
        badge: '優秀',
        desc: '⭐ 優秀（1.20-1.39倍）：85分 - 成長率120%-139%',
        score: 85,
      },
      {
        level: 'average',
        badge: '良好',
        desc: '✅ 良好（1.00-1.19倍）：70分 - 成長率100%-119%',
        score: 70,
      },
      {
        level: 'normal',
        badge: '普通',
        desc: '➡️ 普通（0.85-0.99倍）：55分 - 成長率85%-99%',
        score: 55,
      },
      {
        level: 'poor',
        badge: '待加強',
        desc: '⚠️ 待加強（<0.85倍）：30分 - 成長率低於85%',
        score: 30,
      },
      {
        level: 'fixed',
        badge: '固定值',
        desc: '🔒 積極性：固定為3，象徵分數70，不參與平均',
        score: 70,
      },
    ],
    overall: [
      {
        level: 'godTier',
        badge: '神級寵物',
        desc: '🌟 神級寵物（>=95分）：極品成長，值得重點培養',
        threshold: 95,
      },
      {
        level: 'highQuality',
        badge: '優質寵物',
        desc: '⭐ 優質寵物（80-94分）：品質良好，推薦培養',
        threshold: 80,
      },
      {
        level: 'normalPet',
        badge: '普通寵物',
        desc: '✅ 普通寵物（60-79分）：合乎預期，可正常使用',
        threshold: 60,
      },
      {
        level: 'needImprovement',
        badge: '待加強',
        desc: '⚠️ 待加強（45-59分）：低於平均，需要強化',
        threshold: 45,
      },
      {
        level: 'tragic',
        badge: '悲劇',
        desc: '💔 悲劇（<45分）：成長極差，建議重新培養',
        threshold: 0,
      },
    ],
    bonusEffects: [
      '忍耐力：每5點 = +1物理防禦',
      '忠誠心：每5點 = +1近距離/遠距離/魔法 命中',
      '速度：每10點 = +1近距離/遠距離 迴避',
      '體力：每1點 = +30 HP',
      '積極性：影響攻擊積極性，固定為3',
    ],
  },
}
