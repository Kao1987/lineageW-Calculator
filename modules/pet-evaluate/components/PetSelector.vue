<template>
  <section class="pet-selection" role="radiogroup" aria-labelledby="pet-selection-title">
    <h2 id="pet-selection-title" class="section-title">{{ t('pets.select') }}</h2>

    <div class="pet-grid">
      <div
        v-for="pet in availablePets"
        :key="pet.id"
        class="pet-card"
        :class="{ selected: selectedPet?.id === pet.id }"
        @click="handlePetSelection(pet.id)"
        @keydown.enter="handlePetSelection(pet.id)"
        @keydown.space.prevent="handlePetSelection(pet.id)"
        tabindex="0"
        role="radio"
        :aria-checked="selectedPet?.id === pet.id"
      >
        <div class="pet-image-wrapper">
          <img :src="pet.image" :alt="pet.name" class="pet-icon" />
        </div>

        <div class="pet-info">
          <h3 class="pet-name">{{ t(`pets.${pet.id}`) }}</h3>
          <div class="pet-main-stat">
            <span class="stat-label">{{ t('pets.mainStat') }}：</span>
            <span class="stat-value main-stat-highlight">{{ getStatName(pet.mainStat) }}</span>
          </div>
        </div>

        <div v-if="selectedPet?.id === pet.id" class="selected-indicator">✓</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { usePetEvaluateStore } from '../stores'
import type { StatType } from '../types'

// 使用 i18n
const { t } = useI18n()

const petStore = usePetEvaluateStore()
const { availablePets, selectedPet } = storeToRefs(petStore)
const { selectPet } = petStore

function handlePetSelection(petId: string) {
  selectPet(petId)

  // 追蹤選擇事件
  console.log('Pet selected:', petId)
}

function getStatName(stat: StatType): string {
  return t(`stats.${stat}`)
}
</script>

<style scoped>
.pet-selection {
  margin-bottom: 40px;
}

.section-title {
  color: var(--text-secondary);
  margin-bottom: 20px;
  font-size: 1.8rem;
  text-align: center;
}

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.pet-card {
  background: linear-gradient(135deg, #61dafb 0%, #56b6c2 100%);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  border: 2px solid transparent;
  box-shadow: 0 8px 25px rgba(97, 218, 251, 0.2);
  position: relative;
  overflow: hidden;
  outline: none;
}

.pet-image-wrapper {
  position: relative;
  margin-bottom: 15px;
}

.pet-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  display: block;
}

.pet-info {
  text-align: left;
}

.pet-name {
  font-size: 1.3rem;
  margin-bottom: 8px;
  font-weight: 600;
  text-align: center;
}

.pet-main-stat {
  text-align: center;
  margin-bottom: 15px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.stat-label {
  opacity: 0.8;
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 600;
  margin-left: 5px;
}

.main-stat-highlight {
  color: #ffd700;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  font-size: 1.1rem;
}

.selected-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ffc801, #ff9800);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(255, 200, 1, 0.4);
}

.pet-card:hover,
.pet-card:focus {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(97, 218, 251, 0.4);
  border-color: #61dafb;
}

.pet-card.selected {
  border-color: #ffc801;
  transform: scale(1.02);
  box-shadow: 0 12px 35px rgba(255, 200, 1, 0.5);
  background: linear-gradient(135deg, #ffc801 0%, #8b5cf6 50%, #3b82f6 100%);
  background-size: 200% 200%;
  animation: selectedGradient 4s ease-in-out infinite;
}

@keyframes selectedGradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@media (max-width: 768px) {
  .pet-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .pet-card {
    padding: 15px;
  }

  .pet-icon {
    width: 60px;
    height: 60px;
  }

  .pet-name {
    font-size: 1.1rem;
  }

  .pet-base-stats {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .stat-item {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .pet-grid {
    grid-template-columns: 1fr;
  }

  .pet-card {
    padding: 20px;
  }
}
</style>
