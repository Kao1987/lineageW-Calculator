// 需要修改
// Korean translation file
export default {
    common: {
        calculate: '🧮 펫 능력치 계산',
        help: '❓ 도움말',
        close: '닫기',
        level: '펫 레벨',
        currentValue: '현재값',
        baseValue: '기본값',
        growthValue: '성장값',
        expectedValue: '예상값',
        characterBonus: '캐릭터 보너스',
        rating: '평가',
        contact: '📝문의하기',
        language: '언어'
    },
    
    title: {
        main: '⚔️ 리니지W 종합 계산기',
        subtitle: '전문 게임 보조 도구'
    },
    
    nav: {
        petCalculator: '🐾 펫 능력치 계산기',
        jobChangeCalculator: '💎 전직 비용 계산기',
        moreFeatures: '🚀 더 많은 기능'
    },
    
    pets: {
        select: '펫 선택',
        wolf: '늑대',
        dog: '도베르만',
        shepherd: '양치기개',
        hound: '비글',
        wolfDesc: '주능력: 체력(HP)',
        dogDesc: '주능력: 충성심(명중)',
        shepherdDesc: '주능력: 인내력(물방)',
        houndDesc: '주능력: 스피드(회피)'
    },
    
    stats: {
        title: '현재 능력치',
        warning: '⚠️ 스킬 보너스를 제외한 능력치를 입력해주세요',
        endurance: '인내력',
        loyalty: '충성심',
        speed: '스피드',
        aggressiveness: '적극성',
        hp: '체력',
        enduranceDesc: '5포인트=물방1',
        loyaltyDesc: '5포인트=명중1',
        speedDesc: '10포인트=회피1',
        aggressivenessDesc: '3포인트=공격력1',
        hpDesc: '1포인트=HP30',
        aggressivenessNote: '※적극성은 3으로 고정, 레벨업 없음'
    },
    
    results: {
        title: '계산 결과',
        overallRating: '종합 평가',
        attribute: '능력치'
    },
    
    ratings: {
        excellent: '전설급',
        good: '우수',
        average: '양호',
        normal: '보통',
        poor: '개선필요',
        bad: '불량',
        fixed: '고정값',
        godTier: '신급 펫',
        highQuality: '고품질 펫',
        normalPet: '일반 펫',
        needImprovement: '개선필요',
        poorQuality: '품질불량'
    },
    
    descriptions: {
        godTier: '축하합니다! 이것은 뛰어난 성장 능력치를 가진 전설급 펫입니다. 집중 육성을 권장합니다!',
        highQuality: '평균 이상의 성장을 보이는 고품질 펫입니다. 지속적인 육성을 권장합니다.',
        normal: '이 펫의 성장은 예상 범위 내이며 정상적으로 사용할 수 있습니다.',
        needImprovement: '이 펫의 성장이 평균 이하입니다. 강화하거나 더 좋은 대체재를 찾는 것을 고려해보세요.',
        poor: '이 펫의 능력치 성장이 현저히 좋지 않습니다. 재육성하거나 펫을 교체하는 것을 권장합니다.'
    },
    
    help: {
        title: '🐾 도움말',
        usage: '사용법',
        calculation: '계산 원리',
        ratingSystem: '평가 등급',
        
        steps: {
            title: '🚀 사용 단계',
            step1: '펫 유형 선택',
            step2: '펫 레벨 입력 (1-15)',
            step3: '능력치 수치 입력 (⚠️스킬 보너스 제외)',
            step4: '계산 버튼을 클릭하여 평가 확인'
        },
        
        baseData: {
            title: '🎯 펫 기본 데이터'
        },
        
        calculationPrinciple: {
            title: '🧮 계산 원리',
            upgradeRates: '업그레이드 확률',
            mainStat: '주능력: +1(5%), +2(15%), +3(30%), +4(20%), +5(15%), +6(10%), +7(5%)',
            mainStatExpected: '예상값: 레벨당 +3.75',
            subStat: '부능력: +0(15%), +1(50%), +2(30%), +3(5%)',
            subStatExpected: '예상값: 레벨당 +1.25',
            formula: '평가 공식',
            formula1: '1. 예상값 계산',
            formula1Desc: '예상값 = 기본값 + (레벨-1) × 레벨당 예상 성장',
            formula2: '2. 성장률 계산',
            formula2Desc: '성장률 = (현재값 - 기본값) ÷ (예상값 - 기본값)',
            formula3: '3. 주능력 가중치',
            formula3Desc: '주능력 점수 × 1.5배 가중치'
        },
        
        ratingLevels: {
            title: '🏆 평가 등급',
            excellent140: '신급 펫, 전설적 성장',
            excellent120: '고품질, 육성 권장',
            good105: '예상 초과, 육성 가치 있음',
            normal100: '예상 부합, 정상 사용 가능',
            poor85: '평균 이하, 강화 또는 교체 고려',
            bad: '현저히 불량, 재육성 권장',
            
            explanation: '💡 평가 설명',
            expected: '예상값 (100%): 업그레이드 확률로 계산된 평균 성장 성능',
            logic: '평가 논리: 예상값을 기준으로 펫의 실제 성장이 이론적 평균값 대비 얼마나 우수한지 평가',
            mainWeight: '주능력 가중치: 주능력 점수 × 1.5배, 펫의 주요 특성 중시',
            overall: '종합 평가: 모든 능력치의 가중 평균 점수',
            improvement: '"개선필요": 해당 펫에 더 많은 투자가 필요하거나 교체를 고려해야 함을 명확히 표시',
            
            bonusTitle: '💪 캐릭터 보너스 효과',
            enduranceBonus: '인내력: 5포인트당 = +물리방어1',
            loyaltyBonus: '충성심: 5포인트당 = +근거리/원거리/마법 명중1',
            speedBonus: '스피드: 10포인트당 = +근거리/원거리 회피1',
            hpBonus: '체력: 1포인트당 = +HP30',
            aggressivenessBonus: '적극성: 공격 적극성에 영향, 3으로 고정'
        }
    },
    
    footer: {
        contact: '📝문의하기',
        contactDesc: '제안이나 의견이 있으신가요? 피드백 양식을 작성해 주세요!',
        feedbackLink: '🔗 피드백 양식으로 이동',
        createdBy: '제작자',
        author: 'Orion',
        lastUpdate: '최근 업데이트: 2025/06/02 V2.4'
    },
    
    notifications: {
        selectPet: '먼저 펫을 선택해주세요',
        invalidLevel: '레벨은 1-15 사이여야 합니다',
        valueToohigh: '{{stat}} 수치가 너무 높습니다. 올바른지 확인해주세요 ({{max}} 이하 권장)',
        negativeValue: '{{stat}}는 음수가 될 수 없습니다',
        noAttributes: '최소 하나의 능력치를 입력해주세요 (적극성 제외)',
        calculateComplete: '계산 완료!',
        languageChanged: '언어가 한국어로 변경되었습니다'
    },
    
    characterBonus: {
        endurance: '물리방어',
        loyalty: '명중률',
        speed: '회피율',
        hp: 'HP',
        none: '보너스 없음'
    },
    
    jobChange: {
        title: '💎 전직 비용 계산기',
        description: 'NCSOFT 규격에 따른 전직 비용 계산',
        simpleCalculator: '📊 간단 계산',
        detailedCalculator: '🔍 상세 계산',
        
        costSummary: {
            baseCost: '기본 전직 비용:',
            coinCost: '전직 코인 총 비용:',
            totalCost: '총 비용:',
            packageDiscount: '전직 코인 패키지 (-300개)',
            packageNote: '체크하면 전직 코인 300개 절약'
        },
        
        categories: {
            equipment: '🛡️ 장비',
            weapon: '⚔️ 무기',
            armor: '🛡️ 방어구', 
            accessory: '💍  액세서리',
            skill: '⚡ 스킬',
            spell: '🃏 마법 카드',
            cash: '🛍️ 캐시 장비',
            itemSelection: '전직 아이템 선택'
        },
        
        items: {
            rareWeapon: '레어 무기:',
            heroWeapon: '영웅 무기:',
            legendWeapon: '전설 무기:',
            mythicWeapon: '신화 무기:',
            rareArmor: '레어 방어구:',
            heroArmor: '영웅 방어구:',
            legendArmor: '전설 방어구:',
            mythicArmor: '신화 방어구:',
            rareAccessory: '레어 액세서리:',
            heroAccessory: '영웅 액세서리:',
            legendAccessory: '전설 액세서리:',
            mythicAccessory: '신화 액세서리:',
            rareSkill: '레어 스킬:',
            heroSkill: '영웅 스킬:',
            legendSkill: '전설 스킬:',
            mythicSkill: '신화 스킬:',
            rareSpell: '레어 마법 카드:',
            heroSpell: '영웅 마법 카드:',
            legendSpell: '전설 마법 카드:',
            mythicSpell: '신화 마법 카드:',
            cashShirt: '캐시 티셔츠:',
            cashShoulder: '캐시 어깨 방어구:',
            cashMask: '캐시 마스크:'
        },
        
        costs: {
            onePerItem: '(1개/아이템)',
            ninePerItem: '(9개/아이템)',
            twentySevenPerItem: '(27개/아이템)',
            eightyOnePerItem: '(81개/아이템)',
            onePerSkill: '(1개/스킬)',
            onePerCard: '(1개/카드)',
            eightyOnePerCard: '(81개/카드)',
            fivePerItem: '(5개/아이템)',
            complexCalculation: '(복합 계산)'
        },
        
        costDetails: {
            title: '상세 비용 내역',
            noItems: '전직할 아이템을 선택해주세요'
        },
        
        detailed: {
            title: '상세 장비 분류'
        },
        
        qualities: {
            rare: '레어',
            hero: '영웅', 
            legend: '전설',
            mythic: '신화'
        }
    }
}; 