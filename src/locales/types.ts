/**
 * 翻譯檔案型別定義
 * 確保所有語言檔案的結構一致性
 */

export interface CommonTranslations {
  calculate: string
  help: string
  close: string
  level: string
  currentValue: string
  baseValue: string
  growthValue: string
  expectedValue: string
  characterBonus: string
  rating: string
  contact: string
  language: string
  quantity: string
  loading: string
  reset: string
  error: string
  confirm: string
  cancel: string
  save: string
  delete: string
  edit: string
  view: string
  back: string
  next: string
  previous: string
  submit: string
  new: string
  viewDetails: string
  history: string
  clearHistory: string
  score: string
  toggleTheme: string
  startNow: string
  comingSoon: string
  switchTheme: string
  switchLanguage: string
}

export interface CurrencyTranslations {
  diamond: string
  coin: string
  diamondUnit: string
  coinUnit: string
}

export interface TitleTranslations {
  main: string
  subtitle: string
  lab: string
}

export interface NavTranslations {
  home: string
  petEvaluate: string
  jobChangeCalculator: string
  moreFeatures: string
}

export interface HomeTranslations {
  welcome: {
    title: string
    subtitle: string
  }
  announcement: {
    title: string
    content: string
  }
  features: {
    title: string
    petEvaluate: {
      title: string
      desc: string
      btn: string
    }
    jobChange: {
      title: string
      desc: string
      btn: string
    }
    moreComing: {
      title: string
      desc: string
      btn: string
    }
  }
  howToUse: {
    title: string
    step1: {
      title: string
      desc: string
    }
    step2: {
      title: string
      desc: string
    }
    step3: {
      title: string
      desc: string
    }
  }
  news: {
    title: string
    item1: {
      title: string
      content: string
    }
    item2: {
      title: string
      content: string
    }
    item3: {
      title: string
      content: string
    }
  }
  stats: {
    title: string
    petEvaluations: string
    jobCalculations: string
    languages: string
    version: string
  }
  guide: {
    title: string
    step1: {
      title: string
      desc: string
    }
    step2: {
      title: string
      desc: string
    }
    step3: {
      title: string
      desc: string
    }
  }
}

export interface PetsTranslations {
  select: string
  subtitle: string
  wolf: string
  dog: string
  shepherd: string
  hound: string
  wolfDesc: string
  dogDesc: string
  shepherdDesc: string
  houndDesc: string
  mainStat: string
  calculationMode: string
  manualMode: string
  smartMode: string
  manualModeDesc: string
  smartModeDesc: string
  skillSelection: string
  skillStage: string
  skillValue: string
  selectedSkills: string
  addSkill: string
  removeSkill: string
  noSkillSelected: string
  skillUnlockLevel: string
  availableSkills: string
  skillBonus: string
  stage1Skills: string
  stage2Skills: string
  stage3Skills: string
}

export interface StatsTranslations {
  title: string
  warning: string
  endurance: string
  loyalty: string
  speed: string
  aggressiveness: string
  hp: string
  attackPower: string
  enduranceDesc: string
  loyaltyDesc: string
  speedDesc: string
  aggressivenessDesc: string
  hpDesc: string
  aggressivenessNote: string
  skillBonus: string
}

export interface ResultsTranslations {
  title: string
  waiting: string
  waitingDesc: string
  overallRating: string
  attribute: string
}

export interface RatingsTranslations {
  excellent: string
  good: string
  average: string
  normal: string
  poor: string
  bad: string
  godTier: string
  highQuality: string
  normalPet: string
  needImprovement: string
  tragic: string
  poorQuality: string
  not_rated: string
}

export interface DescriptionsTranslations {
  godTier: string
  highQuality: string
  normalPet: string
  needImprovement: string
  tragic: string
  excellent: string
  good: string
  average: string
  poor: string
  bad: string
}

export interface HelpTranslations {
  title: string
  usage: string
  calculation: string
  ratingSystem: string
  steps: {
    title: string
    step1: string
    step2: string
    step3: string
    step4: string
  }
  baseData: {
    title: string
  }
  calculationPrinciple: {
    title: string
    upgradeRates: string
    mainStat: string
    mainStatExpected: string
    subStat: string
    subStatExpected: string
    formula: string
    formula1: string
    formula1Desc: string
    formula2: string
    formula2Desc: string
    formula3: string
    formula3Desc: string
  }
  skillRules: {
    title: string
    rule1: string
  }
}

export interface JobChangeTranslations {
  title: string
  subtitle: string
  description: string
  selectSubtype: string
  selectQuality: string
  emptyCart: string
  emptyCartHint: string
  packageDiscount: string
  packageNote: string
  packageTitle: string
  packageBadge: string
  packageNewTitle: string
  packageNewSubtitle: string
  packageNewDiscount: string
  cashEquipmentCost: string
  costSummaryTitle: string
  costSummaryBadge: string
  help: {
    title: string
    steps: {
      title: string
      step1: string
      step2: string
      step3: string
      step4: string
      step5: string
      step6: string
    }
    costs: {
      title: string
      rare: string
      hero: string
      legend: string
      mythic: string
      cash: string
      rareCost: string
      heroCost: string
      legendCost: string
      mythicCost: string
      cashCost: string
    }
    limits: {
      title: string
      weapon: string
      armor: string
      accessory: string
      rune: string
      cashLimit: string
    }
    package: {
      title: string
      description: string
    }
    notes: {
      title: string
      baseCost: string
      crackEarring: string
      cashEquipment: string
      skillSpell: string
    }
  }
  terms: {
    title: string
    usage: {
      title: string
      copyright: string
      scope: string
      commercial: string
      protection: string
      accuracy: string
    }
    disclaimer: {
      title: string
      reference: string
      responsibility: string
      official: string
    }
    contact: {
      title: string
      description: string
    }
    footer: {
      updated: string
      agreement: string
    }
  }
  tabs: {
    simple: string
    detailed: string
    cart: string
  }
  categories: {
    equipment: string
    weapon: string
    armor: string
    accessory: string
    skill: string
    spell: string
    cash: string
  }
  quality: {
    rare: string
    hero: string
    legend: string
    mythic: string
    cash: string
  }
  cost: {
    baseCost: string
    coinCost: string
    packageDiscount: string
    finalCost: string
    totalCost: string
  }
  cart: {
    addToCart: string
    removeFromCart: string
    clearCart: string
    cartItems: string
    totalItems: string
    calculate: string
  }
  validation: {
    maxWeaponExceeded: string
    maxArmorExceeded: string
    maxAccessoryExceeded: string
    invalidQuantity: string
    exceedsLimit: string
  }
}

export interface ModalTranslations {
  info: {
    title: string
    equipmentCost: string
    skillCost: string
    spellCost: string
  }
}

export interface NotificationsTranslations {
  success: string
  error: string
  warning: string
  info: string
  calculationComplete: string
  dataLoaded: string
  languageChanged: string
}

/**
 * 完整的翻譯檔案結構
 */
export interface SkillsTranslations {
  // 1階段技能
  novice_energy: string
  novice_loyalty: string
  novice_focus: string
  novice_toughness: string
  novice_speed: string
  // 2階段技能
  beginner_energy: string
  beginner_loyalty: string
  beginner_focus: string
  beginner_toughness: string
  beginner_speed: string
  // 3階段技能
  improved_energy: string
  improved_loyalty: string
  improved_focus: string
  improved_toughness: string
  improved_speed: string
}

export interface FooterTranslations {
  links: {
    title: string
    privacyPolicy: string
  }
  feedback: {
    title: string
    subtitle: string
    button: string
  }
  meta: {
    lastUpdated: string
    copyright: string
  }
}

export interface TranslationSchema extends Record<string, unknown> {
  common: CommonTranslations
  currency: CurrencyTranslations
  title: TitleTranslations
  nav: NavTranslations
  home: HomeTranslations
  pets: PetsTranslations
  skills: SkillsTranslations
  stats: StatsTranslations
  results: ResultsTranslations
  ratings: RatingsTranslations
  descriptions: DescriptionsTranslations
  help: HelpTranslations
  jobChange: JobChangeTranslations
  modal: ModalTranslations
  notifications: NotificationsTranslations
  footer: FooterTranslations
}

/**
 * 語言代碼型別
 */
export type LanguageCode = 'zh-TW' | 'en' | 'ko'

/**
 * 可用語言設定
 */
export interface LanguageOption {
  code: LanguageCode
  name: string
  nativeName: string
}
