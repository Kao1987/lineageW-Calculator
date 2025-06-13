<template>
  <section class="skill-selector">
    <div class="skill-header" @click="toggleCollapse">
      <div class="header-left">
        <h3>🎯 {{ t('pets.skillSelection') }}</h3>
        <div class="unlock-info">{{ t('pets.skillUnlockLevel') }}: Lv{{ petLevel }}</div>
      </div>
      <div class="collapse-btn">
        <span class="collapse-icon" :class="{ collapsed: isCollapsed }">▼</span>
      </div>
    </div>

    <!-- 技能階段分組 -->
    <div v-show="!isCollapsed" class="skill-stages">
      <!-- 1階段技能 -->
      <div v-if="petLevel >= 5" class="skill-stage-group">
        <h4 class="stage-title">{{ t('pets.stage1Skills') }}</h4>
        <div class="skill-grid">
          <div v-for="skill in stage1Skills" :key="skill.id" class="skill-card">
            <div class="skill-header">
              <div class="skill-name">{{ t(`skills.${skill.id}`) }}</div>
              <div class="skill-effect">
                (增加{{ getStatName(skill.targetStat) }}:{{ getSelectedSkillValue(skill.id) || 0 }})
              </div>
            </div>

            <!-- 階段選擇按鈕 -->
            <div class="stage-buttons">
              <button
                v-for="stage in getAvailableStages(skill)"
                :key="stage"
                class="stage-btn"
                :class="{
                  active: isSkillStageSelected(skill.id, stage),
                  disabled: !canSelectStage(skill, stage),
                }"
                @click="selectSkillStage(skill, stage)"
              >
                {{ stage }}階段
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2階段技能 -->
      <div v-if="petLevel >= 10" class="skill-stage-group">
        <h4 class="stage-title">{{ t('pets.stage2Skills') }}</h4>
        <div class="skill-grid">
          <div v-for="skill in stage2Skills" :key="skill.id" class="skill-card">
            <div class="skill-header">
              <div class="skill-name">{{ t(`skills.${skill.id}`) }}</div>
              <div class="skill-effect">
                (增加{{ getStatName(skill.targetStat) }}:{{ getSelectedSkillValue(skill.id) || 0 }})
              </div>
            </div>

            <!-- 階段選擇按鈕 -->
            <div class="stage-buttons">
              <button
                v-for="stage in getAvailableStages(skill)"
                :key="stage"
                class="stage-btn"
                :class="{
                  active: isSkillStageSelected(skill.id, stage),
                  disabled: !canSelectStage(skill, stage),
                }"
                @click="selectSkillStage(skill, stage)"
              >
                {{ stage }}階段
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 3階段技能 -->
      <div v-if="petLevel >= 15" class="skill-stage-group">
        <h4 class="stage-title">{{ t('pets.stage3Skills') }}</h4>
        <div class="skill-grid">
          <div v-for="skill in stage3Skills" :key="skill.id" class="skill-card">
            <div class="skill-header">
              <div class="skill-name">{{ t(`skills.${skill.id}`) }}</div>
              <div class="skill-effect">
                (增加{{ getStatName(skill.targetStat) }}:{{ getSelectedSkillValue(skill.id) || 0 }})
              </div>
            </div>

            <!-- 階段選擇按鈕 -->
            <div class="stage-buttons">
              <button
                v-for="stage in getAvailableStages(skill)"
                :key="stage"
                class="stage-btn"
                :class="{
                  active: isSkillStageSelected(skill.id, stage),
                  disabled: !canSelectStage(skill, stage),
                }"
                @click="selectSkillStage(skill, stage)"
              >
                {{ stage }}階段
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 已選擇的技能摘要 -->
    <div v-if="selectedSkills.length > 0 && !isCollapsed" class="selected-skills-summary">
      <h4>{{ t('pets.selectedSkills') }} ({{ selectedSkills.length }})</h4>
      <div class="skill-tags-container">
        <div
          v-for="selectedSkill in selectedSkills"
          :key="`${selectedSkill.skillId}-${selectedSkill.stage}`"
          class="skill-tag"
        >
          <span class="skill-tag-name">{{ getSkillDisplayName(selectedSkill.skillId) }}</span>
          <span class="skill-tag-stage">{{ selectedSkill.stage }}階</span>
          <button
            @click="removeSkill(selectedSkill.skillId, selectedSkill.stage)"
            class="skill-tag-remove"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- 無技能提示 -->
    <div v-else-if="selectedSkills.length === 0 && !isCollapsed" class="no-skills">
      <p>{{ t('pets.noSkillSelected') }}</p>
      <small v-if="petLevel < 5">需要達到 Lv5 才能解鎖技能</small>
    </div>

    <!-- 折疊時的簡要信息 -->
    <div v-if="isCollapsed && selectedSkills.length > 0" class="collapsed-summary">
      <span class="summary-text">已選擇 {{ selectedSkills.length }} 個技能</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PetSkill, SelectedSkill, StatType } from '../types'
import { getSkillsByStage } from '../utils/skillData'

interface Props {
  petLevel: number
  selectedSkills: SelectedSkill[]
}

interface Emits {
  (e: 'update:selectedSkills', skills: SelectedSkill[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()

// 折疊狀態
const isCollapsed = ref(false)

// 切換折疊狀態
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

// 計算各階段可用技能
const stage1Skills = computed(() => getSkillsByStage(1))
const stage2Skills = computed(() => getSkillsByStage(2))
const stage3Skills = computed(() => getSkillsByStage(3))

// 獲取屬性名稱
function getStatName(stat: StatType): string {
  return t(`stats.${stat}`)
}

// 檢查特定技能的特定階段是否已選擇
function isSkillStageSelected(skillId: string, stage: number): boolean {
  return props.selectedSkills.some((s) => s.skillId === skillId && s.stage === stage)
}

// 檢查技能是否可以選擇
function canSelectStage(skill: PetSkill, stage: number): boolean {
  const isSelected = isSkillStageSelected(skill.id, stage)
  if (isSelected) return true // Alway allow deselecting

  const skillDefs = [...stage1Skills.value, ...stage2Skills.value, ...stage3Skills.value]
  const skillDef = skillDefs.find((s) => s.id === skill.id)

  if (!skillDef) return false

  let stageGroup: number | undefined
  if (stage1Skills.value.some((s) => s.id === skill.id)) {
    stageGroup = 1
  } else if (stage2Skills.value.some((s) => s.id === skill.id)) {
    stageGroup = 2
  } else if (stage3Skills.value.some((s) => s.id === skill.id)) {
    stageGroup = 3
  }

  if (!stageGroup) return true // Fallback, should not happen

  const selectedInGroup = props.selectedSkills.filter((s) => {
    if (stageGroup === 1) return stage1Skills.value.some((sd) => sd.id === s.skillId)
    if (stageGroup === 2) return stage2Skills.value.some((sd) => sd.id === s.skillId)
    if (stageGroup === 3) return stage3Skills.value.some((sd) => sd.id === s.skillId)
    return false
  }).length

  // 每個技能階段最多3個技能
  if (stageGroup === 1) return selectedInGroup < 3
  if (stageGroup === 2) return selectedInGroup < 3
  if (stageGroup === 3) return selectedInGroup < 3

  return true
}

// 獲取已選技能的總數值
function getSelectedSkillValue(skillId: string): number {
  return props.selectedSkills
    .filter((skill) => skill.skillId === skillId)
    .reduce((total, skill) => total + skill.value, 0)
}

// 獲取技能可用階段
function getAvailableStages(skill: PetSkill): number[] {
  const stages: number[] = []
  for (let i = 1; i <= skill.maxValue; i++) {
    stages.push(i)
  }
  return stages
}

// 選擇技能階段
function selectSkillStage(skill: PetSkill, stage: number) {
  const existingSkillIndex = props.selectedSkills.findIndex(
    (s) => s.skillId === skill.id && s.stage === stage,
  )

  const updatedSkills = [...props.selectedSkills]

  if (existingSkillIndex !== -1) {
    // 技能的此階段已被選擇，移除它
    updatedSkills.splice(existingSkillIndex, 1)
  } else {
    // 技能的此階段未被選擇，添加它
    if (!canSelectStage(skill, stage)) {
      // 在這裡可以選擇性地顯示一個提示給用戶
      console.warn(`Cannot select more skills for this stage group.`)
      return
    }

    const newSkill: SelectedSkill = {
      skillId: skill.id,
      stage,
      value: stage, // 假設 value 等於 stage
    }
    updatedSkills.push(newSkill)
  }

  emit('update:selectedSkills', updatedSkills)
}

// 移除技能（現在需要 stage）
function removeSkill(skillId: string, stage: number) {
  const updatedSkills = props.selectedSkills.filter(
    (s) => !(s.skillId === skillId && s.stage === stage),
  )
  emit('update:selectedSkills', updatedSkills)
}

// 獲取技能顯示名稱
function getSkillDisplayName(skillId: string): string {
  return t(`skills.${skillId}`)
}
</script>

<style scoped>
.skill-selector {
  background: #2c313a;
  border: 2px solid #ffc801;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 200, 1, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.skill-header:hover {
  background: rgba(255, 200, 1, 0.05);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-header h3 {
  color: #abb2bf;
  margin: 0;
  font-size: 1.3rem;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 200, 1, 0.1);
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background: rgba(255, 200, 1, 0.2);
  transform: scale(1.1);
}

.collapse-icon {
  color: #ffc801;
  font-size: 0.9rem;
  transition: transform 0.3s ease;
  user-select: none;
}

.collapse-icon.collapsed {
  transform: rotate(-90deg);
}

.unlock-info {
  color: #5c6370;
  font-size: 0.9rem;
  background: rgba(255, 200, 1, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 200, 1, 0.3);
}

.skill-stages {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.skill-stage-group {
  background: rgba(26, 29, 35, 0.5);
  border-radius: 8px;
  padding: 1.5rem;
}

.stage-title {
  color: #ffc801;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.skill-card {
  background: #21252b;
  border: 2px solid #3a3f4b;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.skill-card:hover {
  border-color: #ffc801;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 200, 1, 0.2);
}

.skill-header {
  margin-bottom: 1rem;
}

.skill-name {
  color: #abb2bf;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.skill-effect {
  color: #98c379;
  font-size: 0.9rem;
  font-weight: 500;
}

.stage-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stage-btn {
  background: #1a1d23;
  border: 2px solid #3a3f4b;
  border-radius: 6px;
  color: #abb2bf;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 70px;
}

.stage-btn:hover:not(.disabled) {
  border-color: #ffc801;
  background: rgba(255, 200, 1, 0.1);
  transform: translateY(-1px);
}

.stage-btn.active {
  border-color: #ffc801;
  background: #ffc801;
  color: #1a1d23;
  font-weight: 600;
}

.stage-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #1a1d23;
}

.selected-skills-summary {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 200, 1, 0.3);
}

.selected-skills-summary h4 {
  color: #abb2bf;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.skill-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 200, 1, 0.15);
  border: 1px solid rgba(255, 200, 1, 0.4);
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  background: rgba(255, 200, 1, 0.25);
  transform: translateY(-1px);
}

.skill-tag-name {
  color: #abb2bf;
  font-weight: 500;
  margin-right: 0.5rem;
}

.skill-tag-stage {
  color: #98c379;
  font-weight: 600;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.skill-tag-remove {
  background: #e06c75;
  color: white;
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  margin-left: 0.25rem;
}

.skill-tag-remove:hover {
  background: #be5046;
  transform: scale(1.2);
}

.no-skills {
  text-align: center;
  padding: 2rem;
  color: #5c6370;
}

.no-skills p {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.no-skills small {
  font-size: 0.85rem;
  opacity: 0.8;
}

.collapsed-summary {
  padding: 1rem;
  text-align: center;
  background: rgba(255, 200, 1, 0.1);
  border: 1px solid rgba(255, 200, 1, 0.3);
  border-radius: 8px;
  margin-top: 1rem;
}

.summary-text {
  color: #abb2bf;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .skill-selector {
    padding: 1rem;
  }

  .skill-header {
    padding: 0.75rem;
  }

  .header-left {
    gap: 0.25rem;
  }

  .skill-header h3 {
    font-size: 1.1rem;
  }

  .collapse-btn {
    width: 28px;
    height: 28px;
  }

  .collapse-icon {
    font-size: 0.8rem;
  }

  .skill-grid {
    grid-template-columns: 1fr;
  }

  .skill-tags-container {
    gap: 0.4rem;
  }

  .skill-tag {
    font-size: 0.8rem;
    padding: 0.35rem 0.7rem;
  }

  .skill-tag-name {
    margin-right: 0.4rem;
  }

  .skill-tag-stage {
    margin-right: 0.4rem;
    font-size: 0.75rem;
  }

  .skill-tag-remove {
    width: 16px;
    height: 16px;
    font-size: 0.65rem;
    margin-left: 0.2rem;
  }
}

@media (max-width: 480px) {
  .skill-selector {
    padding: 0.75rem;
  }

  .skill-stage-group {
    padding: 1rem;
  }

  .stage-buttons {
    justify-content: center;
  }

  .stage-btn {
    flex: 1;
    min-width: 60px;
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .skill-tag {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }

  .skill-tag-name {
    margin-right: 0.3rem;
  }

  .skill-tag-stage {
    margin-right: 0.3rem;
    font-size: 0.7rem;
  }

  .skill-tag-remove {
    width: 14px;
    height: 14px;
    font-size: 0.6rem;
    margin-left: 0.15rem;
  }
}
</style>
