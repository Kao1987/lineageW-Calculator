/**
 * Korean translation file
 * Migrated from assets/js/modules/languages/ko.js
 */
import type { TranslationSchema } from './types'

const ko: TranslationSchema = {
  common: {
    calculate: '🧮 펫 능력치 계산',
    help: '❓ 도움말',
    close: '닫기',
    level: '펫 레벨',
    currentValue: '현재값',
    baseValue: '기본값',
    growthValue: '성장값',
    expectedValue: '기댓값',
    characterBonus: '캐릭터 보너스',
    rating: '평가',
    contact: '📝문의하기',
    language: '🌐 언어',
    quantity: '수량:',
    loading: '로딩 중...',
    reset: '초기화',
    error: '오류 발생',
    confirm: '확인',
    cancel: '취소',
    save: '저장',
    delete: '삭제',
    edit: '편집',
    view: '보기',
    back: '뒤로',
    next: '다음',
    previous: '이전',
    submit: '제출',
    new: '새로운',
    viewDetails: '자세한 설명 보기',
    history: '계산 기록',
    clearHistory: '기록 삭제',
    score: '점',
    toggleTheme: '테마 전환',
    startNow: '지금 시작',
    comingSoon: '곧 출시 예정',
    switchTheme: '테마 변경',
    switchLanguage: '언어 변경',
  },

  currency: {
    diamond: '다이아',
    coin: '개',
    diamondUnit: '다이아',
    coinUnit: '개',
  },

  title: {
    main: '⚔️ 리니지W 종합 계산기',
    subtitle: '전문 게임 보조 도구',
    lab: '데이터 연구소',
  },

  nav: {
    home: '🏠 홈',
    petEvaluate: '🐾 펫 평가 시스템',
    jobChangeCalculator: '💎 전직 비용 계산기',
    moreFeatures: '🚀 더 많은 기능',
  },

  home: {
    welcome: {
      title: '전문 게임 도구에 오신 것을 환영합니다',
      subtitle:
        '정확한 펫 평가 및 전직 계산 서비스를 제공하여 리니지W에서 최적의 결정을 내릴 수 있도록 도와드립니다',
    },

    announcement: {
      title: '시스템 공지',
      content: '전문 게임 보조 계산 도구, 지속적으로 업데이트 중...',
    },

    features: {
      title: '기능 목록',
      petEvaluate: {
        title: '펫 평가 시스템',
        desc: '펫의 능력치를 정확하게 평가하고 성장 잠재력과 가치를 분석합니다',
        btn: '평가 시작 →',
      },
      jobChange: {
        title: '전직 비용 계산기',
        desc: '전직에 필요한 재료와 비용을 계산하고 가장 경제적인 전직 경로를 계획합니다',
        btn: '계산 시작 →',
      },
      moreComing: {
        title: '더 많은 기능',
        desc: '더 많은 기능이 개발 중입니다...',
        btn: '곧 출시 예정',
      },
    },

    howToUse: {
      title: '사용 방법',
      step1: {
        title: '기능 선택',
        desc: '필요한 계산 기능을 선택하세요',
      },
      step2: {
        title: '데이터 입력',
        desc: '안내에 따라 관련 데이터를 입력하세요',
      },
      step3: {
        title: '결과 확인',
        desc: '상세한 분석 결과를 확인하세요',
      },
    },

    news: {
      title: '📢 최신 소식',
      item1: {
        title: '✨ V3.0 메이저 업데이트',
        content:
          'Vue 3 + TypeScript를 사용한 완전한 아키텍처 재구축으로 더 나은 성능과 사용자 경험 제공',
      },
      item2: {
        title: '🔧 기능 최적화',
        content: '전직 계산기 로직 최적화, 장바구니 기능 및 상세 비용 분석 추가',
      },
      item3: {
        title: '🌍 다국어 지원',
        content: '번체 중국어, 영어, 한국어 삼개국어 시스템 완성 및 동적 언어 전환 지원',
      },
    },

    stats: {
      title: '📊 사용 통계',
      petEvaluations: '펫 평가 횟수',
      jobCalculations: '전직 계산 횟수',
      languages: '지원 언어',
      version: '현재 버전',
    },

    guide: {
      title: '🚀 빠른 시작',
      step1: {
        title: '기능 선택',
        desc: '상단 네비게이션이나 기능 카드에서 필요한 계산기를 선택하세요',
      },
      step2: {
        title: '데이터 입력',
        desc: '인터페이스 안내에 따라 펫 능력치나 전직 요구사항을 입력하세요',
      },
      step3: {
        title: '결과 확인',
        desc: '상세한 계산 결과와 권장사항을 확인하세요',
      },
    },
  },

  pets: {
    select: '펫 선택',
    subtitle: '펫의 성장 잠재력과 평가 계산',
    wolf: '늑대',
    dog: '도베르만',
    shepherd: '셰퍼드',
    hound: '비글',
    wolfDesc: '주능력: 체력(HP)',
    dogDesc: '주능력: 충성심(명중)',
    shepherdDesc: '주능력: 인내력(물방)',
    houndDesc: '주능력: 속도(회피)',
    mainStat: '주능력',
    calculationMode: '계산 모드',
    manualMode: '수동 모드',
    smartMode: '스마트 모드',
    manualModeDesc: '스킬 보너스를 수동으로 차감',
    smartModeDesc: '스킬 보너스를 자동으로 계산',
    skillSelection: '펫 스킬 선택',
    skillStage: '스킬 단계',
    skillValue: '보너스 수치',
    selectedSkills: '선택된 스킬',
    addSkill: '스킬 추가',
    removeSkill: '스킬 제거',
    noSkillSelected: '선택된 스킬 없음',
    skillUnlockLevel: '해금 레벨',
    availableSkills: '사용 가능한 스킬',
    skillBonus: '스킬 보너스',
    stage1Skills: '1단계 스킬 (Lv5 해금)',
    stage2Skills: '2단계 스킬 (Lv10 해금)',
    stage3Skills: '3단계 스킬 (Lv15 해금)',
  },

  skills: {
    // 1단계 스킬
    novice_energy: '초보자 에너지',
    novice_loyalty: '초보자 충성',
    novice_focus: '초보자 집중',
    novice_toughness: '초보자 강인함',
    novice_speed: '초보자 신속',
    // 2단계 스킬
    beginner_energy: '초급자 에너지',
    beginner_loyalty: '초급자 충성',
    beginner_focus: '초급자 집중',
    beginner_toughness: '초급자 강인함',
    beginner_speed: '초급자 신속',
    // 3단계 스킬
    improved_energy: '향상된 에너지',
    improved_loyalty: '향상된 충성',
    improved_focus: '향상된 집중',
    improved_toughness: '향상된 강인함',
    improved_speed: '향상된 신속',
  },

  stats: {
    title: '현재 능력치',
    warning: '⚠️ 스킬 보너스를 제외한 능력치를 입력해주세요',
    endurance: '인내력',
    loyalty: '충성심',
    speed: '속도',
    aggressiveness: '적극성',
    hp: '체력',
    attackPower: '공격력',
    enduranceDesc: '5포인트=1물리방어',
    loyaltyDesc: '5포인트=명중률1',
    speedDesc: '10포인트=회피1',
    aggressivenessDesc: '3포인트=공격력1',
    hpDesc: '1포인트=HP30',
    aggressivenessNote: '※공격성은 3으로 고정되며 레벨업하지 않습니다',
    skillBonus: '⚡ 스킬을 통해 획득한 추가 포인트',
  },

  results: {
    title: '계산 결과',
    waiting: '계산 대기',
    waitingDesc: '위의 수치 입력을 완료하면, 펫 평가 결과가 여기에 표시됩니다.',
    overallRating: '종합 평가',
    attribute: '능력치',
  },

  ratings: {
    excellent: '신급',
    good: '훌륭함',
    average: '쓸만함',
    normal: '보통',
    poor: '보통',
    bad: '쓰레기',
    godTier: '신급 펫',
    highQuality: '고품질 펫',
    normalPet: '일반 펫',
    needImprovement: '개선 필요',
    tragic: '비극',
    poorQuality: '품질 불량',
    not_rated: '평가 안 함',
  },

  descriptions: {
    godTier: '🌟 신급 펫! 능력치 성장이 예상을 훨씬 뛰어넘어, 육성에 강력히 추천합니다!',
    highQuality: '⭐ 고품질 펫! 능력치 성장이 양호하여, 육성을 추천합니다.',
    normalPet: '✅ 일반 펫, 능력치 성장이 예상에 부합하여, 정상적으로 사용할 수 있습니다.',
    needImprovement: '⚠️ 능력치 성장이 부진하여, 재육성을 고려해 보세요.',
    tragic: '💔 비극적인 펫, 능력치 성장이 매우 저조하여, 재육성을 강력히 권장합니다.',
    excellent: '🌟 최고급 성장',
    good: '⭐ 우수한 성장',
    average: '✅ 양호한 성장',
    poor: '➡️ 평균적인 성장',
    bad: '⚠️ 개선 필요',
  },

  help: {
    title: '📘 사용 설명 및 데이터 참고',
    usage: '사용법',
    calculation: '계산 원리',
    ratingSystem: '🏆 평가 등급',
    steps: {
      title: '🚀 사용 단계',
      step1: '펫 종류를 선택하세요',
      step2: '펫 레벨을 입력하세요 (1-15)',
      step3: '각 능력치를 입력하세요 (⚠️스킬 보너스는 제외해주세요)',
      step4: '계산 버튼을 클릭하여 평가를 확인하세요',
    },
    baseData: {
      title: '📋 레벨별 펫 기본 능력치 (체력/인내/충성/속도)',
    },
    calculationPrinciple: {
      title: '🧮 계산 원리',
      upgradeRates: '업그레이드 확률',
      mainStat: '주 능력치: +1(5%), +2(15%), +3(30%), +4(20%), +5(15%), +6(10%), +7(5%)',
      mainStatExpected: '기대값: 레벨당 +3.75 포인트',
      subStat: '부 능력치: +0(15%), +1(50%), +2(30%), +3(5%)',
      subStatExpected: '기대값: 레벨당 +1.25 포인트',
      formula: '평가 점수 = (실제 성장치 / 기대 성장치 - 1) * 100',
      formula1: '기대 성장치 = (레벨 - 1) * (주 능력치 기대 성장률 + 부 능력치 기대 성장률 * 3)',
      formula1Desc: ' ',
      formula2: '성장값 ÷ 기대 성장값',
      formula2Desc: '성장값 ÷ 기대 성장값',
      formula3: '속성 평가 점수',
      formula3Desc: '주 능력치 가중치 1.5, 부 능력치 1.0',
    },
    skillRules: {
      title: '스킬 규칙',
      rule1: '각 스킬 단계(1단계, 2단계, 3단계)별로 최대 3개의 스킬만 선택할 수 있습니다.',
    },
  },

  jobChange: {
    title: '전직 비용 계산기',
    subtitle: '전직에 필요한 재료와 비용의 정확한 계산',
    description: '전직에 필요한 다이아몬드 계산',
    selectSubtype: '구체적 유형 선택',
    selectQuality: '품질 선택',
    emptyCart: '선택된 계산 항목이 없습니다',
    emptyCartHint: '위의 선택기를 사용하여 전직 아이템을 추가하세요',
    packageDiscount: '전직 코인 패키지',
    packageNote: '체크하면 전직 코인 300개를 절약할 수 있습니다',
    packageTitle: '300개 이상의 전직 코인 필요시 전직 패키지 구매 고려',
    packageBadge: '-300개',
    packageNewTitle: '전직 코인 패키지',
    packageNewSubtitle: '전직 코인 비용이 너무 클 경우 구매를 고려하세요',
    packageNewDiscount: '체크시 전직 코인 300개 절약',
    cashEquipmentCost: '캐시 장비 전직 코인',
    costSummaryTitle: '전직 비용 상세',
    costSummaryBadge: '상세 계산',

    help: {
      title: '전직 비용 계산기 사용법',
      steps: {
        title: '사용 단계',
        step1: '전직할 장비 유형을 선택하세요',
        step2: '구체적인 장비 하위 유형을 선택하세요',
        step3: '장비 품질을 선택하세요 (레어, 영웅, 전설, 신화)',
        step4: '전직할 수량을 입력하세요',
        step5: '"계산에 추가" 버튼을 클릭하세요',
        step6: '할인을 원하면 "전직 코인 패키지"를 체크하여 300개 할인을 받으세요',
      },
      costs: {
        title: '비용 정보',
        rare: '레어 품질',
        hero: '영웅 품질',
        legend: '전설 품질',
        mythic: '신화 품질',
        cash: '캐시 장비',
        rareCost: '전직 코인 1개',
        heroCost: '전직 코인 9개',
        legendCost: '전직 코인 27개',
        mythicCost: '전직 코인 81개',
        cashCost: '전직 코인 5개',
      },
      limits: {
        title: '수량 제한',
        weapon: '무기: 최대 3개 (품질 무관)',
        armor: '방어구 각 부위: 헬멧, 갑옷, 팔갑, 장갑, 다리갑, 신발, 벨트, 망토 각각 최대 2개',
        accessory: '액세서리: 목걸이, 귀걸이 각각 최대 2개, 반지 최대 4개, 균열 귀걸이 최대 1개',
        rune: '룬스톤: 최대 2개',
        cashLimit: '캐시 장비: 티셔츠 최대 3개, 어깨갑, 안면갑 각각 최대 1개',
      },
      package: {
        title: '패키지 정보',
        description:
          '"전직 코인 패키지 (-300개)"를 체크하면 전직 코인 300개 할인 혜택을 받을 수 있습니다.',
      },
      notes: {
        title: '주의사항',
        baseCost: '기본 전직 비용은 다이아몬드 500개입니다',
        crackEarring: '균열 귀걸이는 레어와 영웅 품질만 있습니다',
        cashEquipment: '캐시 장비는 품질 구분이 없으며, 전직 코인 5개를 일괄 소모합니다',
        skillSpell: '스킬과 마법 카드는 복잡한 누진 비용이 있으니 공식 안내를 참조하세요',
      },
    },

    terms: {
      title: 'OrionLabs 이용약관',
      usage: {
        title: '사용 규범',
        copyright:
          '저작권 고지: 본 도구는 OrionLabs에서 개발한 원작으로 저작권법의 보호를 받습니다',
        scope: '사용 범위: 개인 학습 연구 및 게임 보조 용도로만 사용',
        commercial: '상업적 제한: 모든 형태의 상업적 용도나 영리 행위 금지',
        protection: '코드 보호: 도용, 수정, 역컴파일 또는 재배포 금지',
        accuracy: '데이터 정확성: 계산 결과는 참고용이며, 실제 비용은 게임 내 기준',
      },
      disclaimer: {
        title: '면책조항',
        reference: '본 도구가 제공하는 데이터와 계산 결과는 참고용입니다',
        responsibility: 'OrionLabs는 본 도구 사용으로 인한 어떤 손실에도 책임지지 않습니다',
        official: '게임 규칙 변경 시 공식 공지를 기준으로 하세요',
      },
      contact: {
        title: '연락처',
        description: '문의사항이나 제안이 있으시면 다음 방법으로 연락주세요:',
      },
      footer: {
        updated: '최종 업데이트: 2025년 1월',
        agreement: '본 도구를 계속 사용하시면 위 약관에 동의하는 것으로 간주됩니다',
      },
    },

    tabs: {
      simple: '간단 계산기',
      detailed: '상세 계산기',
      cart: '계산 항목 모드',
    },

    categories: {
      equipment: '장비',
      weapon: '무기',
      armor: '방어구',
      accessory: '액세서리',
      skill: '스킬',
      spell: '마법 카드',
      cash: '캐시 장비',
    },

    quality: {
      rare: '레어',
      hero: '영웅',
      legend: '전설',
      mythic: '신화',
      cash: '캐시',
    },

    cost: {
      baseCost: '기본 전직 비용',
      coinCost: '전직 코인 비용',
      packageDiscount: '패키지 할인',
      finalCost: '최종 비용',
      totalCost: '총 비용',
    },

    cart: {
      addToCart: '계산에 추가',
      removeFromCart: '제거',
      clearCart: '계산 항목 지우기',
      cartItems: '계산 항목 목록',
      totalItems: '총 항목 수',
      calculate: '총 비용 계산',
    },

    validation: {
      maxWeaponExceeded: '모든 등급 무기 총합은 3개를 초과할 수 없습니다',
      maxArmorExceeded: '모든 등급 방어구 총합은 14개를 초과할 수 없습니다',
      maxAccessoryExceeded: '모든 등급 액세서리 총합은 9개를 초과할 수 없습니다',
      invalidQuantity: '수량은 양의 정수여야 합니다',
      exceedsLimit: '수량 제한을 초과했습니다',
    },
  },

  modal: {
    info: {
      title: '정보',
      equipmentCost: '장비 전직 코인 소모량',
      skillCost: '스킬 전직 코인 소모량',
      spellCost: '마법 카드 전직 코인 소모량',
    },
  },

  notifications: {
    success: '작업 성공',
    error: '작업 실패',
    warning: '경고',
    info: '정보',
    calculationComplete: '계산 완료',
    dataLoaded: '데이터 로드 성공',
    languageChanged: '언어 변경됨',
  },

  footer: {
    links: {
      title: '관련 링크',
      privacyPolicy: '개인정보 처리방침',
    },
    feedback: {
      title: '제안이나 의견이 있으신가요?',
      subtitle: '여러분의 피드백이 저희의 발전에 원동력이 됩니다!',
      button: '피드백 양식 작성하기',
    },
    meta: {
      lastUpdated: '마지막 업데이트:',
      copyright: '© {year} OrionLabs. Created by Orion.',
    },
  },
}

export default ko
