<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isOpen"
        class="modal-backdrop"
        @click="handleBackdropClick"
        @keydown.esc="closeModal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="activeModal?.id + '-title'"
        aria-hidden="false"
      >
        <div
          class="modal-content"
          :class="[
            `modal-${activeModal?.size || 'medium'}`,
            `modal-${activeModal?.type || 'custom'}`,
          ]"
          @click.stop
        >
          <!-- 模態視窗標題 -->
          <div class="modal-header">
            <h2 :id="activeModal?.id + '-title'" class="modal-title">
              {{ activeModal?.title }}
            </h2>
            <button
              v-if="activeModal?.closable !== false"
              @click="closeModal"
              class="modal-close"
              aria-label="關閉視窗"
              type="button"
            >
              ×
            </button>
          </div>

          <!-- 模態視窗內容 -->
          <div class="modal-body">
            <!-- 幫助說明內容 -->
            <div v-if="activeModal?.type === 'help'" class="help-content">
              <HelpTabs />
            </div>

            <!-- 一般資訊內容 -->
            <div
              v-else-if="activeModal?.content"
              class="info-content"
              v-html="activeModal.content"
            ></div>

            <!-- 隱私權政策內容 -->
            <PrivacyPolicy v-else-if="activeModal?.component === 'PrivacyPolicy'" />

            <!-- 自定義內容插槽 -->
            <div v-else class="custom-content">
              <slot name="content" :modal="activeModal">
                <p>暫無內容</p>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useModal } from '../composables/useModal'
import HelpTabs from './HelpTabs.vue'
import PrivacyPolicy from './PrivacyPolicy.vue'

const { isOpen, activeModal, closeModal, handleBackdropClick } = useModal()
</script>

<style scoped>
/* 模態視窗背景 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* 模態視窗內容容器 */
.modal-content {
  background: var(--bg-primary, #ffffff);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color, #e1e5e9);
}

/* 模態視窗尺寸 */
.modal-small {
  width: 100%;
  max-width: 400px;
}

.modal-medium {
  width: 100%;
  max-width: 600px;
}

.modal-large {
  width: 100%;
  max-width: 800px;
}

/* 模態視窗標題 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color, #e1e5e9);
  background: var(--bg-secondary, #f8f9fa);
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary, #2d3748);
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary, #718096);
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  line-height: 1;
}

.modal-close:hover {
  background: var(--bg-hover, #edf2f7);
  color: var(--text-primary, #2d3748);
}

/* 模態視窗內容 */
.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.help-content,
.info-content,
.custom-content {
  line-height: 1.6;
}

/* 模態視窗類型樣式 */
.modal-help .modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-help .modal-title,
.modal-help .modal-close {
  color: white;
}

.modal-info .modal-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.modal-info .modal-title,
.modal-info .modal-close {
  color: white;
}

/* 過渡動畫 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .modal-backdrop {
    padding: 10px;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-large,
  .modal-medium,
  .modal-small {
    max-width: 100%;
  }

  .modal-header {
    padding: 16px 20px;
  }

  .modal-body {
    padding: 20px;
  }

  .modal-title {
    font-size: 1.1rem;
  }
}
</style>
