import { ref, computed, nextTick } from 'vue'
import { trackEvent } from '../utils'

// 模態窗狀態介面
export interface ModalState {
  id: string
  isVisible: boolean
  options: ModalOptions
}

// 模態窗選項介面
export interface ModalOptions {
  closable?: boolean
  maskClosable?: boolean
  escClosable?: boolean
  trackEvent?: boolean
  onShow?: (modal: HTMLElement) => void
  onHide?: (modal: HTMLElement) => void
  className?: string
}

// 標籤頁狀態介面
export interface TabState {
  containerId: string
  activeTab: string
  tabs: Array<{
    id: string
    label: string
    content?: string
  }>
}

/**
 * 模態窗組合式函數
 * 移轉自 assets/js/utils/modal.js 的完整功能
 */
export function useModal() {
  // 狀態管理
  const openModals = ref<Map<string, ModalState>>(new Map())
  const tabStates = ref<Map<string, TabState>>(new Map())

  // 計算屬性
  const hasOpenModals = computed(() => openModals.value.size > 0)
  const visibleModals = computed(() => 
    Array.from(openModals.value.values()).filter(modal => modal.isVisible)
  )

  /**
   * 顯示模態窗
   */
  function showModal(modalId: string, options: ModalOptions = {}): void {
    const modal = document.getElementById(modalId)
    if (!modal) {
      console.warn(`找不到 ID 為 ${modalId} 的模態窗`)
      return
    }

    const modalOptions: ModalOptions = {
      closable: true,
      maskClosable: true,
      escClosable: true,
      trackEvent: true,
      ...options
    }

    // 更新狀態
    openModals.value.set(modalId, {
      id: modalId,
      isVisible: true,
      options: modalOptions
    })

    // 顯示模態窗
    modal.style.display = 'block'
    modal.setAttribute('aria-hidden', 'false')

    // 添加CSS類別
    if (modalOptions.className) {
      modal.classList.add(modalOptions.className)
    }

    // 設定關閉事件
    setupModalCloseEvents(modal, modalOptions)

    // 聚焦處理
    nextTick(() => {
      const firstFocusableElement = modal.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      if (firstFocusableElement) {
        firstFocusableElement.focus()
      }
    })

    // 事件追蹤
    if (modalOptions.trackEvent) {
      trackEvent('modal_opened', {
        category: 'User Interface',
        label: modalId,
        modal_type: modalId
      })
    }

    // 執行回調
    if (modalOptions.onShow) {
      modalOptions.onShow(modal)
    }
  }

  /**
   * 隱藏模態窗
   */
  function hideModal(modalId: string, options: ModalOptions = {}): void {
    const modal = document.getElementById(modalId)
    if (!modal) {
      console.warn(`找不到 ID 為 ${modalId} 的模態窗`)
      return
    }

    const modalState = openModals.value.get(modalId)
    const modalOptions = modalState?.options || options

    // 更新狀態
    openModals.value.delete(modalId)

    // 隱藏模態窗
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')

    // 移除CSS類別
    if (modalOptions.className) {
      modal.classList.remove(modalOptions.className)
    }

    // 移除事件監聽器
    removeModalEventListeners(modal)

    // 事件追蹤
    if (modalOptions.trackEvent !== false) {
      trackEvent('modal_closed', {
        category: 'User Interface',
        label: modalId,
        modal_type: modalId
      })
    }

    // 執行回調
    if (modalOptions.onHide) {
      modalOptions.onHide(modal)
    }
  }

  /**
   * 切換模態窗顯示狀態
   */
  function toggleModal(modalId: string, options: ModalOptions = {}): void {
    const modal = document.getElementById(modalId)
    if (!modal) return

    const isVisible = modal.style.display === 'block'
    if (isVisible) {
      hideModal(modalId, options)
    } else {
      showModal(modalId, options)
    }
  }

  /**
   * 關閉所有模態窗
   */
  function hideAllModals(): void {
    Array.from(openModals.value.keys()).forEach(modalId => {
      hideModal(modalId)
    })
  }

  /**
   * 設定模態窗關閉事件
   */
  function setupModalCloseEvents(modal: HTMLElement, options: ModalOptions): void {
    const modalId = modal.id

    // 點擊外部關閉
    if (options.maskClosable) {
      const clickOutsideHandler = (e: Event) => {
        if (e.target === modal) {
          hideModal(modalId)
        }
      }
      modal.addEventListener('click', clickOutsideHandler)
      ;(modal as any)._clickOutsideHandler = clickOutsideHandler
    }

    // ESC 鍵關閉
    if (options.escClosable) {
      const escKeyHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
          hideModal(modalId)
        }
      }
      document.addEventListener('keydown', escKeyHandler)
      ;(modal as any)._escKeyHandler = escKeyHandler
    }

    // 關閉按鈕點擊事件
    if (options.closable) {
      const closeButtons = modal.querySelectorAll('.close, [data-close-modal]')
      const closeButtonHandler = () => hideModal(modalId)
      
      closeButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', closeButtonHandler)
        if (!(closeBtn as any)._closeHandlers) {
          ;(closeBtn as any)._closeHandlers = []
        }
        ;(closeBtn as any)._closeHandlers.push(closeButtonHandler)
      })
    }
  }

  /**
   * 移除模態窗事件監聽器
   */
  function removeModalEventListeners(modal: HTMLElement): void {
    // 移除點擊外部事件
    if ((modal as any)._clickOutsideHandler) {
      modal.removeEventListener('click', (modal as any)._clickOutsideHandler)
      delete (modal as any)._clickOutsideHandler
    }

    // 移除 ESC 鍵事件
    if ((modal as any)._escKeyHandler) {
      document.removeEventListener('keydown', (modal as any)._escKeyHandler)
      delete (modal as any)._escKeyHandler
    }

    // 移除關閉按鈕事件
    const closeButtons = modal.querySelectorAll('.close, [data-close-modal]')
    closeButtons.forEach(closeBtn => {
      if ((closeBtn as any)._closeHandlers) {
        ;(closeBtn as any)._closeHandlers.forEach((handler: EventListener) => {
          closeBtn.removeEventListener('click', handler)
        })
        delete (closeBtn as any)._closeHandlers
      }
    })
  }

  /**
   * 初始化所有模態窗
   */
  function initAllModals(): void {
    const modals = document.querySelectorAll('.modal')
    
    modals.forEach(modal => {
      const modalId = (modal as HTMLElement).id
      if (!modalId) {
        console.warn('發現沒有 ID 的模態窗:', modal)
        return
      }

      // 確保初始狀態正確
      if ((modal as HTMLElement).style.display !== 'block') {
        ;(modal as HTMLElement).style.display = 'none'
        modal.setAttribute('aria-hidden', 'true')
      }
    })

    // 設定觸發按鈕事件
    const modalTriggers = document.querySelectorAll('[data-modal-target]')
    modalTriggers.forEach(trigger => {
      const targetModalId = trigger.getAttribute('data-modal-target')
      if (targetModalId) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault()
          showModal(targetModalId)
        })
      }
    })
  }

  /**
   * 標籤頁管理
   */
  function initTabs(containerSelector: string = '.modal'): void {
    const containers = document.querySelectorAll(containerSelector)
    
    containers.forEach(container => {
      const tabButtons = container.querySelectorAll('.help-tab-btn, .tab-btn')
      const tabContents = container.querySelectorAll('.help-tab-content, .tab-content')

      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          const targetTab = button.getAttribute('data-tab')
          if (targetTab) {
            switchTab(container as HTMLElement, targetTab, tabButtons, tabContents)
          }
        })
      })
    })
  }

  /**
   * 切換標籤頁
   */
  function switchTab(
    container: HTMLElement, 
    targetTab: string, 
    tabButtons: NodeListOf<Element>, 
    tabContents: NodeListOf<Element>
  ): void {
    // 移除所有活動狀態
    tabButtons.forEach(btn => btn.classList.remove('active'))
    tabContents.forEach(content => content.classList.remove('active'))

    // 設定新的活動狀態
    const activeButton = container.querySelector(`[data-tab="${targetTab}"]`)
    const activeContent = container.querySelector(`#${targetTab}`)

    if (activeButton) activeButton.classList.add('active')
    if (activeContent) activeContent.classList.add('active')

    // 更新狀態
    const containerId = container.id || 'default'
    const currentState = tabStates.value.get(containerId)
    if (currentState) {
      currentState.activeTab = targetTab
    }

    // 事件追蹤
    trackEvent('tab_switched', {
      category: 'User Interface',
      label: targetTab,
      container_id: containerId
    })
  }

  return {
    // 狀態
    openModals: computed(() => openModals.value),
    tabStates: computed(() => tabStates.value),
    hasOpenModals,
    visibleModals,
    
    // 方法
    showModal,
    hideModal,
    toggleModal,
    hideAllModals,
    initAllModals,
    initTabs,
    switchTab
  }
}
