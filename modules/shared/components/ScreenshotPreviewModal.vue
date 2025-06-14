<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ t('common.screenshotPreview', '截圖預覽') }}</h3>
          <button class="close-btn" @click="close">&times;</button>
        </div>
        <div class="modal-body">
          <img v-if="imageUrl" :src="imageUrl" alt="Screenshot preview" />
          <div v-else class="loading-placeholder">
            <div class="spinner"></div>
            <p>{{ t('common.generating', '圖片產生中...') }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-btn copy-btn" @click="onCopy" :disabled="isCopied">
            <i class="fas fa-copy"></i>
            {{ isCopied ? t('common.copied', '已複製') : t('common.copy', '複製') }}
          </button>
          <button class="modal-btn download-btn" @click="onDownload">
            <i class="fas fa-download"></i> {{ t('common.download', '下載') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  show: boolean
  imageUrl: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'copy'): void
  (e: 'download'): void
}>()

const { t } = useI18n()
const isCopied = ref(false)

const close = () => {
  emit('close')
}

const onCopy = () => {
  emit('copy')
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

const onDownload = () => {
  emit('download')
}

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      isCopied.value = false
    }
  },
)
</script>

<style scoped>
/* Styles for the modal */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border-primary);
}

.modal-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-primary);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: var(--spacing-lg);
  overflow-y: auto;
  text-align: center;
}

.modal-body img {
  max-width: 100%;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-secondary);
}

.loading-placeholder {
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
}

.modal-footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border-primary);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.modal-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  transition: all var(--transition-base);
}

.copy-btn {
  background-color: var(--color-accent-primary);
  color: var(--color-text-light);
}

.copy-btn:disabled {
  background-color: var(--color-success);
}

.download-btn {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-primary);
}
</style>
