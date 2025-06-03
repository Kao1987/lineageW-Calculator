// 需要修改
// 繁體中文翻譯檔案
export default {
    common: {
        calculate: '🧮 計算屬性評價',
        help: '❓ 使用說明',
        close: '關閉',
        level: '寵物等級',
        currentValue: '當前值',
        baseValue: '基礎值',
        growthValue: '成長值',
        expectedValue: '期望值',
        characterBonus: '角色加成',
        rating: '評價',
        contact: '📝與我聯繫',
        language: '語言'
    },
    
    title: {
        main: '🐾 天堂W 寵物屬性計算器',
        subtitle: '計算您的寵物成長潛力與評價'
    },
    
    pets: {
        select: '選擇寵物',
        wolf: '狼',
        dog: '杜賓狗',
        shepherd: '牧羊犬',
        hound: '小獵犬',
        wolfDesc: '主屬：體力(HP)',
        dogDesc: '主屬：忠誠心(命中)',
        shepherdDesc: '主屬：忍耐力(物防)',
        houndDesc: '主屬：速度(迴避)'
    },
    
    stats: {
        title: '當前屬性值',
        warning: '⚠️ 請記得扣除技能加成的屬性點數',
        endurance: '忍耐力',
        loyalty: '忠誠心',
        speed: '速度',
        aggressiveness: '積極性',
        hp: '體力',
        enduranceDesc: '5點=1物防',
        loyaltyDesc: '5點=1近/遠/魔命中',
        speedDesc: '10點=1近/遠迴避',
        aggressivenessDesc: '3點=1攻擊力',
        hpDesc: '1點=30HP',
        aggressivenessNote: '※積極性固定為3，不會升級'
    },
    
    results: {
        title: '計算結果',
        overallRating: '整體評價',
        attribute: '屬性'
    },
    
    ratings: {
        excellent: '頂級',
        good: '優秀',
        average: '良好',
        normal: '普通',
        poor: '待加強',
        bad: '不佳',
        fixed: '固定值',
        godTier: '神級寵物',
        highQuality: '優質寵物',
        normalPet: '普通寵物',
        needImprovement: '待加強',
        poorQuality: '品質不佳'
    },
    
    descriptions: {
        godTier: '恭喜！這是一隻極品寵物，屬性成長非常優秀，值得大力培養！',
        highQuality: '這是一隻品質很好的寵物，屬性成長超出平均水準，推薦繼續培養。',
        normal: '這隻寵物的屬性成長合乎預期，可正常使用。',
        needImprovement: '這隻寵物的成長低於平均，建議強化或尋找更好的替代。',
        poor: '這隻寵物的屬性成長明顯不佳，建議重新培養或更換寵物。'
    },
    
    help: {
        title: '🐾 使用說明',
        usage: '使用方法',
        calculation: '計算原理',
        ratingSystem: '評價等級',
        
        steps: {
            title: '🚀 使用步驟',
            step1: '選擇您的寵物類型',
            step2: '輸入寵物等級（1-15）',
            step3: '輸入各屬性數值（⚠️請扣除技能加成）',
            step4: '點擊計算按鈕查看評價'
        },
        
        baseData: {
            title: '🎯 寵物基礎數據'
        },
        
        calculationPrinciple: {
            title: '🧮 計算原理',
            upgradeRates: '升級機率',
            mainStat: '主屬性：+1(5%), +2(15%), +3(30%), +4(20%), +5(15%), +6(10%), +7(5%)',
            mainStatExpected: '預期值：每級 +3.75 點',
            subStat: '副屬性：+0(15%), +1(50%), +2(30%), +3(5%)',
            subStatExpected: '預期值：每級 +1.25 點',
            formula: '評分公式',
            formula1: '1. 計算預期值',
            formula1Desc: '預期值 = 基礎值 + (等級-1) × 每級預期成長',
            formula2: '2. 計算成長率',
            formula2Desc: '成長率 = (當前值 - 基礎值) ÷ (預期值 - 基礎值)',
            formula3: '3. 主屬性加權',
            formula3Desc: '主屬性分數 × 1.5 倍加權'
        },
        
        ratingLevels: {
            title: '🏆 評價等級',
            excellent140: '神級寵物，極品成長',
            excellent120: '品質優良，推薦培養',
            good105: '超出預期，值得培養',
            normal100: '合乎預期，可正常使用',
            poor85: '低於平均，建議強化或替換',
            bad: '明顯不佳，建議重練',
            
            explanation: '💡 評分說明',
            expected: '預期值 (100%)：根據升級機率計算的平均成長表現',
            logic: '評分邏輯：以預期值為基準，評估寵物實際成長相對於理論平均值的表現',
            mainWeight: '主屬性加權：主屬性評分 × 1.5 倍，更重視寵物的主要特性',
            overall: '整體評價：綜合所有屬性的加權平均分數',
            improvement: '「待加強」：明確提示該寵物需要更多投入或考慮替換',
            
            bonusTitle: '💪 角色加成效果',
            enduranceBonus: '忍耐力：每5點 = +1物理防禦',
            loyaltyBonus: '忠誠心：每5點 = +1近/遠/魔命中',
            speedBonus: '速度：每10點 = +1近/遠迴避',
            hpBonus: '體力：每1點 = +30HP',
            aggressivenessBonus: '積極性：影響攻擊積極度，固定為3'
        }
    },
    
    footer: {
        contact: '📝與我聯繫',
        contactDesc: '有任何建議或意見嗎？歡迎填寫回饋表單！',
        feedbackLink: '🔗 點擊前往意見回饋表單',
        createdBy: 'Created by',
        author: 'Orion',
        lastUpdate: 'Last Update: 2025/06/02 V2.4'
    },
    
    notifications: {
        selectPet: '請先選擇一隻寵物',
        invalidLevel: '等級必須在 1-15 之間',
        valueToohigh: '{{stat}}數值過高，請檢查是否正確（建議不超過{{max}}）',
        negativeValue: '{{stat}}不能為負數',
        noAttributes: '請輸入至少一個屬性值（積極性除外）',
        calculateComplete: '計算完成！',
        languageChanged: '語言已切換至繁體中文'
    },
    
    characterBonus: {
        endurance: '物理防禦',
        loyalty: '命中',
        speed: '迴避',
        hp: 'HP',
        none: '無加成'
    }
}; 