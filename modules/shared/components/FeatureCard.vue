<template>
  <div class="feature-card" :class="{ disabled: disabled }" @click="handleClick">
    <div class="feature-icon">{{ icon }}</div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>

    <div class="feature-action">
      <button v-if="!disabled" class="action-btn" @click.stop="handleNavigation">
        {{ t('common.startNow') }}
      </button>
      <span v-else class="disabled-text">{{ t('common.comingSoon') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface Props {
  icon: string
  title: string
  description: string
  route?: string
  disabled?: boolean
}

const props = defineProps<Props>()
const router = useRouter()
const { t } = useI18n()

function handleClick() {
  if (!props.disabled && props.route) {
    handleNavigation()
  }
}

function handleNavigation() {
  if (props.route) {
    router.push(props.route)
  }
}
</script>

<style scoped>
.feature-card {
  background: var(--color-bg-secondary);
  border: 2px solid var(--color-border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-sm);
}

.feature-card:not(.disabled):hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-text-accent);
}

.feature-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-title {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
}

.feature-description {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
  flex: 1;
}

.feature-action {
  margin-top: auto;
}

.action-btn {
  background: linear-gradient(135deg, var(--color-text-accent), var(--color-text-purple));
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  width: 100%;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.disabled-text {
  color: var(--color-text-muted);
  font-style: italic;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .feature-card {
    padding: var(--spacing-md);
  }

  .feature-icon {
    font-size: 2.5rem;
    height: 60px;
    margin-bottom: var(--spacing-sm);
  }

  .feature-title {
    font-size: var(--font-size-lg);
  }

  .feature-description {
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-sm);
  }

  .action-btn {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 480px) {
  .feature-icon {
    font-size: 2rem;
    height: 50px;
  }

  .feature-title {
    font-size: var(--font-size-base);
  }
}
</style>
