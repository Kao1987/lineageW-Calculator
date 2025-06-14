/**
 * English translation file
 * Migrated from assets/js/modules/languages/en.js
 */
import type { TranslationSchema } from './types'

const en: TranslationSchema = {
  common: {
    calculate: '🧮 Calculate Pet Stats',
    help: '❓ Help',
    close: 'Close',
    level: 'Pet Level',
    currentValue: 'Current',
    baseValue: 'Base',
    growthValue: 'Growth',
    expectedValue: 'Expected',
    characterBonus: 'Character Bonus',
    rating: 'Rating',
    contact: '📝Contact Me',
    language: '🌐 Language',
    quantity: 'Quantity:',
    loading: 'Loading...',
    reset: 'Reset',
    errorTitle: 'Error occurred',
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    new: 'New',
    viewDetails: 'View Details',
    history: 'History',
    clearHistory: 'Clear History',
    score: 'Score',
    toggleTheme: 'Toggle Theme',
    startNow: 'Start Now',
    comingSoon: 'Coming Soon',
    switchTheme: 'Switch Theme',
    switchLanguage: 'Switch Language',
    screenshot: 'Screenshot',
    screenshotSuccess: 'Screenshot successful',
    screenshotFail: 'Screenshot failed',
    calculating: 'Calculating...',
    generating: 'Generating image...',
    shareResult: 'Share Evaluation Result',
    shareHint: 'Click to generate an image of the evaluation result for sharing or saving',
  },

  errors: {
    imageFailed: 'Failed to generate image',
  },

  currency: {
    diamond: 'Diamonds',
    coin: 'Coins',
    diamondUnit: 'D',
    coinUnit: 'C',
  },

  title: {
    main: 'LineageW Data Lab',
    subtitle: 'Professional game assistant tools',
    lab: 'Data Lab',
  },

  nav: {
    home: '🏠 Home',
    petEvaluate: '🐾 Pet Evaluation System',
    jobChangeCalculator: '💎 Class Change Calculator',
    moreFeatures: '🚀 More Features',
  },

  home: {
    welcome: {
      title: 'Welcome to Professional Gaming Tools',
      subtitle:
        'Providing accurate pet evaluation and class change calculation services to help you make optimal decisions in Lineage W',
    },

    announcement: {
      title: 'System Announcement',
      content: 'Professional game assistant calculation tools, continuously updating...',
    },

    features: {
      title: 'Feature List',
      petEvaluate: {
        title: 'Pet Evaluation System',
        desc: 'Accurately assess your pet attributes, analyze growth potential and value',
        btn: 'Start Evaluation →',
      },
      jobChange: {
        title: 'Class Change Calculator',
        desc: 'Calculate materials and costs needed for class change, plan the most economical path',
        btn: 'Start Calculation →',
      },
      moreComing: {
        title: 'More Features',
        desc: 'More features are under development...',
        btn: 'Coming Soon',
      },
    },

    howToUse: {
      title: 'How to Use',
      step1: {
        title: 'Choose Feature',
        desc: 'Select the calculation feature you need',
      },
      step2: {
        title: 'Input Data',
        desc: 'Enter relevant data according to prompts',
      },
      step3: {
        title: 'View Results',
        desc: 'Get detailed analysis results',
      },
    },

    news: {
      title: '📢 Latest News',
      item1: {
        title: '✨ V3.0 Major Update',
        content:
          'Complete architecture rebuild using Vue 3 + TypeScript, providing better performance and user experience',
      },
      item2: {
        title: '🔧 Feature Optimization',
        content:
          'Optimized job change calculator logic, added shopping cart feature and detailed cost analysis',
      },
      item3: {
        title: '🌍 Multi-language Support',
        content:
          'Complete Traditional Chinese, English, and Korean trilingual system with dynamic language switching',
      },
    },

    stats: {
      title: '📊 Usage Statistics',
      petEvaluations: 'Pet Evaluations',
      jobCalculations: 'Job Calculations',
      languages: 'Supported Languages',
      version: 'Current Version',
    },

    guide: {
      title: '🚀 Quick Start',
      step1: {
        title: 'Choose Feature',
        desc: 'Select the calculator you need from the top navigation or feature cards',
      },
      step2: {
        title: 'Input Data',
        desc: 'Follow the interface prompts to enter your pet attributes or job change requirements',
      },
      step3: {
        title: 'Get Results',
        desc: 'View detailed calculation results and recommendations',
      },
    },
  },

  pets: {
    select: 'Select Pet',
    subtitle: 'Calculate your pet growth potential and evaluation',
    wolf: 'Wolf',
    dog: 'Doberman',
    shepherd: 'Sheepdog',
    hound: 'Beagle',
    wolfDesc: 'Main: HP',
    dogDesc: 'Main: Loyalty (Hit)',
    shepherdDesc: 'Main: Endurance (P.Def)',
    houndDesc: 'Main: Speed (Dodge)',
    mainStat: 'Main Stat',
    calculationMode: 'Calculation Mode',
    manualMode: 'Manual Mode',
    smartMode: 'Smart Mode',
    manualModeDesc: 'Manually deduct skill bonuses',
    smartModeDesc: 'Automatically calculate skill bonuses',
    skillSelection: 'Pet Skill Selection',
    skillStage: 'Skill Stage',
    skillValue: 'Bonus Value',
    selectedSkills: 'Selected Skills',
    addSkill: 'Add Skill',
    removeSkill: 'Remove Skill',
    noSkillSelected: 'No skill selected',
    skillUnlockLevel: 'Unlock Level',
    availableSkills: 'Available Skills',
    skillBonus: 'Skill Bonus',
    stage1Skills: 'Stage 1 Skills (Unlocked at Lv5)',
    stage2Skills: 'Stage 2 Skills (Unlocked at Lv10)',
    stage3Skills: 'Stage 3 Skills (Unlocked at Lv15)',
  },

  skills: {
    // Stage 1 skills
    novice_energy: 'Novice Energy',
    novice_loyalty: 'Novice Loyalty',
    novice_focus: 'Novice Focus',
    novice_toughness: 'Novice Toughness',
    novice_speed: 'Novice Speed',
    // Stage 2 skills
    beginner_energy: 'Beginner Energy',
    beginner_loyalty: 'Beginner Loyalty',
    beginner_focus: 'Beginner Focus',
    beginner_toughness: 'Beginner Toughness',
    beginner_speed: 'Beginner Speed',
    // Stage 3 skills
    improved_energy: 'Improved Energy',
    improved_loyalty: 'Improved Loyalty',
    improved_focus: 'Improved Focus',
    improved_toughness: 'Improved Toughness',
    improved_speed: 'Improved Speed',
  },

  stats: {
    title: 'Current Attributes',
    warning: '⚠️ Please deduct skill bonus from attribute values',
    endurance: 'Endurance',
    loyalty: 'Loyalty',
    speed: 'Speed',
    aggressiveness: 'Aggressiveness',
    hp: 'HP',
    attackPower: 'Attack Power',
    enduranceDesc: '5 points = 1 physical defense',
    loyaltyDesc: '5pts=1 Hit Rate',
    speedDesc: '10pts=1 Dodge',
    aggressivenessDesc: '3pts=1 Attack',
    hpDesc: '1pt=30 HP',
    aggressivenessNote: '※Aggressiveness is fixed at 3, no level up',
    skillBonus: '⚡ Additional points gained through skills',
  },

  results: {
    title: 'Results',
    waiting: 'Waiting for Calculation',
    waitingDesc:
      'After completing the input above, your pet evaluation results will be displayed here.',
    overallRating: 'Overall Rating',
    attribute: 'Attribute',
  },

  ratings: {
    excellent: 'Godlike',
    good: 'Great',
    average: 'Decent',
    normal: 'Common',
    poor: 'Common',
    bad: 'Trash',
    godTier: 'God-tier Pet',
    highQuality: 'High Quality Pet',
    normalPet: 'Normal Pet',
    needImprovement: 'Needs Improvement',
    tragic: 'Tragic',
    poorQuality: 'Poor Quality',
    not_rated: 'Not Rated',
  },

  descriptions: {
    godTier:
      '🌟 God-tier Pet! Attribute growth far exceeds expectations, highly recommended for training!',
    highQuality: '⭐ High Quality Pet! Attribute growth is good, recommended for training.',
    normalPet: '✅ Normal Pet, attribute growth meets expectations, can be used normally.',
    needImprovement: '⚠️ Attribute growth is poor, consider re-training.',
    tragic: '💔 Tragic Pet, attribute growth is extremely poor, strongly recommend re-training.',
    excellent: '🌟 Top-tier growth',
    good: '⭐ Excellent growth',
    average: '✅ Good growth',
    poor: '➡️ Average growth',
    bad: '⚠️ Needs improvement',
  },

  help: {
    title: '🐾 Help',
    usage: 'Usage',
    calculation: 'Calculation Theory',
    ratingSystem: '🏆 Rating System',
    steps: {
      title: '🚀 Usage Steps',
      step1: 'Select your pet type',
      step2: 'Enter pet level (1-15)',
      step3: 'Enter attribute values (⚠️Please deduct skill bonuses)',
      step4: 'Click the calculate button to see the evaluation',
    },
    baseData: {
      title: '📋 Pet Base Stats by Level (HP/Endurance/Loyalty/Speed)',
    },
    calculationPrinciple: {
      title: '🧮 Calculation Principle',
      upgradeRates: 'Upgrade Probabilities',
      mainStat: 'Main Stat: +1(5%), +2(15%), +3(30%), +4(20%), +5(15%), +6(10%), +7(5%)',
      mainStatExpected: 'Expected Value: +3.75 points per level',
      subStat: 'Sub Stat: +0(15%), +1(50%), +2(30%), +3(5%)',
      subStatExpected: 'Expected Value: +1.25 points per level',
      formula: 'Rating Score = (Actual Growth / Expected Growth - 1) * 100',
      formula1:
        'Expected Growth = (Level - 1) * (Expected Main Stat Growth + Expected Sub Stat Growth * 3)',
      formula1Desc: ' ',
      formula2: 'Growth Value / Expected Growth Value',
      formula2Desc: 'Growth Value / Expected Growth Value',
      formula3: 'Attribute Rating Score',
      formula3Desc: 'Main stat weight is 1.5, sub-stat is 1.0',
    },
    skillRules: {
      title: 'Skill Rules',
      rule1:
        'A maximum of 3 skills can be selected for each skill stage (Stage 1, Stage 2, Stage 3).',
    },
  },

  jobChange: {
    title: 'Class Change Calculator',
    subtitle: 'Accurate calculation of materials and costs for class change',
    description: 'Calculate diamonds required for class change',
    selectSubtype: 'Select Specific Type',
    selectQuality: 'Select Quality',
    emptyCart: 'No calculation items selected',
    emptyCartHint: 'Use the selector above to add class change items',
    packageDiscount: 'Class Change Coin Package',
    packageNote: 'Check to save 300 class change coins',
    packageTitle: 'Consider purchasing class change package if over 300 coins needed',
    packageBadge: '-300 coins',
    packageNewTitle: 'Class Change Coin Package',
    packageNewSubtitle: 'Consider purchasing if class change coin cost is too high',
    packageNewDiscount: 'Save 300 coins when checked',
    cashEquipmentCost: 'Cash Equipment Class Change Coins',
    costSummaryTitle: 'Class Change Cost Details',
    costSummaryBadge: 'Detailed Calculation',

    help: {
      title: 'Class Change Cost Calculator Guide',
      steps: {
        title: 'Usage Steps',
        step1: 'Select the equipment type for class change',
        step2: 'Choose specific equipment subtype',
        step3: 'Select equipment quality (Rare, Hero, Legend, Mythic)',
        step4: 'Enter the quantity to class change',
        step5: 'Click "Add to Calculation" button',
        step6: 'For discount, check "Class Change Coin Package" to get 300 coins off',
      },
      costs: {
        title: 'Cost Information',
        rare: 'Rare Quality',
        hero: 'Hero Quality',
        legend: 'Legend Quality',
        mythic: 'Mythic Quality',
        cash: 'Cash Equipment',
        rareCost: '1 Class Change Coin',
        heroCost: '9 Class Change Coins',
        legendCost: '27 Class Change Coins',
        mythicCost: '81 Class Change Coins',
        cashCost: '5 Class Change Coins',
      },
      limits: {
        title: 'Quantity Limits',
        weapon: 'Weapons: Maximum 3 (regardless of quality)',
        armor: 'Armor pieces: Helmet, Chest, Arms, Gloves, Legs, Shoes, Belt, Cloak max 2 each',
        accessory: 'Accessories: Necklace, Earring max 2 each, Ring max 4, Crack Earring max 1',
        rune: 'Runes: Maximum 2',
        cashLimit: 'Cash Equipment: T-shirt max 3, Shoulder Guard, Face Guard max 1 each',
      },
      package: {
        title: 'Package Information',
        description:
          'Check "Class Change Coin Package (-300 coins)" to enjoy 300 class change coins discount.',
      },
      notes: {
        title: 'Important Notes',
        baseCost: 'Base class change cost is 500 diamonds',
        crackEarring: 'Crack Earrings only have Rare and Hero quality',
        cashEquipment:
          'Cash equipment has no quality distinction, uniformly consumes 5 class change coins',
        skillSpell:
          'Skills and spell cards have complex progressive costs, please refer to official guide',
      },
    },

    terms: {
      title: 'OrionLabs Terms of Use',
      usage: {
        title: 'Usage Guidelines',
        copyright:
          'Copyright: This tool is originally developed by OrionLabs, protected by copyright law',
        scope: 'Usage Scope: For personal study, research and game assistance only',
        commercial:
          'Commercial Restriction: Any form of commercial use or profit-making is prohibited',
        protection:
          'Code Protection: Copying, modifying, decompiling or redistributing source code is prohibited',
        accuracy:
          'Data Accuracy: Calculation results are for reference only, actual costs in-game prevail',
      },
      disclaimer: {
        title: 'Disclaimer',
        reference: 'Data and calculation results provided by this tool are for reference only',
        responsibility:
          'OrionLabs assumes no responsibility for any losses caused by using this tool',
        official: 'If game rules change, please refer to official announcements',
      },
      contact: {
        title: 'Contact Information',
        description: 'If you have questions or suggestions, please contact us through:',
      },
      footer: {
        updated: 'Last Updated: January 2025',
        agreement: 'Continued use of this tool indicates your agreement to the above terms',
      },
    },

    tabs: {
      simple: 'Simple Calculator',
      detailed: 'Detailed Calculator',
      cart: 'Calculation Items Mode',
    },

    categories: {
      equipment: 'Equipment',
      weapon: 'Weapon',
      armor: 'Armor',
      accessory: 'Accessory',
      skill: 'Skill',
      spell: 'Spell Card',
      cash: 'Cash Equipment',
    },

    quality: {
      rare: 'Rare',
      hero: 'Hero',
      legend: 'Legend',
      mythic: 'Mythic',
      cash: 'Cash',
    },

    cost: {
      baseCost: 'Base Class Change Cost',
      coinCost: 'Class Change Coin Cost',
      packageDiscount: 'Package Discount',
      finalCost: 'Final Cost',
      totalCost: 'Total Cost',
    },

    cart: {
      addToCart: 'Add to Calculation',
      removeFromCart: 'Remove',
      clearCart: 'Clear Calculation Items',
      cartItems: 'Calculation Items List',
      totalItems: 'Total Items',
      calculate: 'Calculate Total Cost',
    },

    validation: {
      maxWeaponExceeded: 'Total weapons across all qualities cannot exceed 3',
      maxArmorExceeded: 'Total armor across all qualities cannot exceed 14',
      maxAccessoryExceeded: 'Total accessories across all qualities cannot exceed 9',
      invalidQuantity: 'Quantity must be a positive integer',
      exceedsLimit: 'Exceeds quantity limit',
    },
  },

  modal: {
    info: {
      title: 'Information',
      equipmentCost: 'Equipment Class Change Coin Cost',
      skillCost: 'Skill Class Change Coin Cost',
      spellCost: 'Spell Card Class Change Coin Cost',
    },
  },

  notifications: {
    success: 'Operation successful',
    error: 'Operation failed',
    warning: 'Warning',
    info: 'Information',
    calculationComplete: 'Calculation complete',
    dataLoaded: 'Data loaded successfully',
    languageChanged: 'Language changed',
  },

  footer: {
    links: {
      title: 'Links',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
    },
    feedback: {
      title: 'Your feedback drives our improvement',
      subtitle: 'If you find any issues or have feature suggestions, please let us know!',
      button: 'Go to Feedback Form',
    },
    meta: {
      lastUpdated: 'Last Updated:',
      copyright: 'OrionLabs. Built by Orion.',
    },
  },
}

export default en
