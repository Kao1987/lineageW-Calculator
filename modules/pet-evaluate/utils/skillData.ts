import type { PetSkill, SelectedSkill, SkillBonus, StatType } from '../types'

/**
 * 寵物技能數據定義
 */
export const PET_SKILLS: PetSkill[] = [
  // 1階段技能 (Lv5解鎖)
  {
    id: 'novice_energy',
    name: '新手能量',
    stage: 1,
    unlockLevel: 5,
    targetStat: 'hp',
    minValue: 1,
    maxValue: 3,
  },
  {
    id: 'novice_loyalty',
    name: '新手忠誠',
    stage: 1,
    unlockLevel: 5,
    targetStat: 'loyalty',
    minValue: 1,
    maxValue: 3,
  },
  {
    id: 'novice_focus',
    name: '新手集中',
    stage: 1,
    unlockLevel: 5,
    targetStat: 'aggressiveness',
    minValue: 1,
    maxValue: 3,
  },
  {
    id: 'novice_toughness',
    name: '新手韌性',
    stage: 1,
    unlockLevel: 5,
    targetStat: 'endurance',
    minValue: 1,
    maxValue: 3,
  },
  {
    id: 'novice_speed',
    name: '新手迅速',
    stage: 1,
    unlockLevel: 5,
    targetStat: 'speed',
    minValue: 1,
    maxValue: 3,
  },

  // 2階段技能 (Lv10解鎖)
  {
    id: 'beginner_energy',
    name: '初學者能量',
    stage: 2,
    unlockLevel: 10,
    targetStat: 'hp',
    minValue: 1,
    maxValue: 4,
  },
  {
    id: 'beginner_loyalty',
    name: '初學者忠誠',
    stage: 2,
    unlockLevel: 10,
    targetStat: 'loyalty',
    minValue: 1,
    maxValue: 4,
  },
  {
    id: 'beginner_focus',
    name: '初學者集中',
    stage: 2,
    unlockLevel: 10,
    targetStat: 'aggressiveness',
    minValue: 1,
    maxValue: 4,
  },
  {
    id: 'beginner_toughness',
    name: '初學者韌性',
    stage: 2,
    unlockLevel: 10,
    targetStat: 'endurance',
    minValue: 1,
    maxValue: 4,
  },
  {
    id: 'beginner_speed',
    name: '初學者迅速',
    stage: 2,
    unlockLevel: 10,
    targetStat: 'speed',
    minValue: 1,
    maxValue: 4,
  },

  // 3階段技能 (Lv15解鎖)
  {
    id: 'improved_energy',
    name: '提高能量',
    stage: 3,
    unlockLevel: 15,
    targetStat: 'hp',
    minValue: 1,
    maxValue: 5,
  },
  {
    id: 'improved_loyalty',
    name: '提高忠誠',
    stage: 3,
    unlockLevel: 15,
    targetStat: 'loyalty',
    minValue: 1,
    maxValue: 5,
  },
  {
    id: 'improved_focus',
    name: '提高集中',
    stage: 3,
    unlockLevel: 15,
    targetStat: 'aggressiveness',
    minValue: 1,
    maxValue: 5,
  },
  {
    id: 'improved_toughness',
    name: '提高韌性',
    stage: 3,
    unlockLevel: 15,
    targetStat: 'endurance',
    minValue: 1,
    maxValue: 5,
  },
  {
    id: 'improved_speed',
    name: '提高迅速',
    stage: 3,
    unlockLevel: 15,
    targetStat: 'speed',
    minValue: 1,
    maxValue: 5,
  },
]

/**
 * 根據寵物等級獲取可用技能
 */
export function getAvailableSkills(level: number): PetSkill[] {
  return PET_SKILLS.filter((skill) => level >= skill.unlockLevel)
}

/**
 * 根據技能階段獲取技能列表
 */
export function getSkillsByStage(stage: 1 | 2 | 3): PetSkill[] {
  return PET_SKILLS.filter((skill) => skill.stage === stage)
}

/**
 * 根據ID獲取技能
 */
export function getSkillById(skillId: string): PetSkill | undefined {
  return PET_SKILLS.find((skill) => skill.id === skillId)
}

/**
 * 計算技能加成
 */
export function calculateSkillBonus(selectedSkills: SelectedSkill[]): SkillBonus {
  const bonus: SkillBonus = {
    endurance: 0,
    loyalty: 0,
    speed: 0,
    aggressiveness: 0,
    hp: 0,
  }

  selectedSkills.forEach((selectedSkill) => {
    const skill = getSkillById(selectedSkill.skillId)
    if (skill) {
      bonus[skill.targetStat] += selectedSkill.value
    }
  })

  return bonus
}

/**
 * 驗證技能選擇是否有效
 */
export function validateSkillSelection(
  selectedSkills: SelectedSkill[],
  petLevel: number,
): string[] {
  const errors: string[] = []
  const availableSkills = getAvailableSkills(petLevel)
  const availableSkillIds = availableSkills.map((skill) => skill.id)

  selectedSkills.forEach((selectedSkill) => {
    const skill = getSkillById(selectedSkill.skillId)

    if (!skill) {
      errors.push(`無效的技能ID: ${selectedSkill.skillId}`)
      return
    }

    if (!availableSkillIds.includes(selectedSkill.skillId)) {
      errors.push(`技能 ${skill.name} 需要等級 ${skill.unlockLevel} 才能解鎖`)
      return
    }

    // 驗證階段值範圍
    const maxStage = skill.maxValue
    if (selectedSkill.stage < 1 || selectedSkill.stage > maxStage) {
      errors.push(`技能 ${skill.name} 的階段必須在 1-${maxStage} 之間`)
      return
    }

    // 驗證數值範圍
    if (selectedSkill.value < skill.minValue || selectedSkill.value > skill.maxValue) {
      errors.push(`技能 ${skill.name} 的數值必須在 ${skill.minValue}-${skill.maxValue} 之間`)
    }
  })

  return errors
}

/**
 * 獲取技能的最大階段數
 */
export function getMaxStageForSkill(skill: PetSkill): number {
  return skill.maxValue
}

/**
 * 格式化技能描述
 */
export function formatSkillDescription(skill: PetSkill, stage: number, value: number): string {
  const statNames: Record<StatType, string> = {
    endurance: '忍耐力',
    loyalty: '忠誠心',
    speed: '速度',
    aggressiveness: '積極性',
    hp: '體力',
  }

  return `${skill.name} ${stage}階段 (${statNames[skill.targetStat]}+${value})`
}
