// 導入多語系模組
import i18n from './modules/i18n.js';

// 寵物基礎數據
const petData = {
    wolf: {
        name: '狼',
        emoji: '🐺',
        image: 'assets/images/pets/wolf.png',
        mainStat: 'hp',
        baseStats: {
            endurance: 6,    // 忍耐力
            loyalty: 6,      // 忠誠心
            speed: 6,        // 速度
            aggressiveness: 3, // 積極性
            hp: 14          // 體力
        }
    },
    dog: {
        name: '杜賓狗',
        emoji: '🐕',
        image: 'assets/images/pets/dubin.png',
        mainStat: 'loyalty',
        baseStats: {
            endurance: 6,
            loyalty: 14,
            speed: 6,
            aggressiveness: 3,
            hp: 6
        }
    },
    shepherd: {
        name: '牧羊犬',
        emoji: '🐕‍🦺',
        image: 'assets/images/pets/sheepdog.png',
        mainStat: 'endurance',
        baseStats: {
            endurance: 14,
            loyalty: 6,
            speed: 6,
            aggressiveness: 3,
            hp: 6
        }
    },
    hound: {
        name: '小獵犬',
        emoji: '🐶',
        image: 'assets/images/pets/beagle.png',
        mainStat: 'speed',
        baseStats: {
            endurance: 6,
            loyalty: 6,
            speed: 14,
            aggressiveness: 3,
            hp: 6
        }
    }
};

// 升級機率表
const upgradeRates = {
    main: [
        { level: 1, rate: 0.05 },
        { level: 2, rate: 0.15 },
        { level: 3, rate: 0.30 },
        { level: 4, rate: 0.20 },
        { level: 5, rate: 0.15 },
        { level: 6, rate: 0.10 },
        { level: 7, rate: 0.05 }
    ],
    sub: [
        { level: 0, rate: 0.15 },
        { level: 1, rate: 0.50 },
        { level: 2, rate: 0.30 },
        { level: 3, rate: 0.05 }
    ]
};

// 屬性名稱對應
const statNames = {
    endurance: '忍耐力',
    loyalty: '忠誠心',
    speed: '速度',
    aggressiveness: '積極性',
    hp: '體力'
};

// 現代通知系統
function showNotification(messageKey, type = 'warning', params = {}) {
    // 使用多語系翻譯
    const message = i18n.t(`notifications.${messageKey}`, params);
    
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="${i18n.t('common.close')}">&times;</button>
    `;
    
    // 添加到頁面
    document.body.appendChild(notification);
    
    // 自動關閉
    const autoCloseTimer = setTimeout(() => {
        closeNotification(notification);
    }, 4000);
    
    // 點擊關閉
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoCloseTimer);
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.classList.add('fade-out');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// 計算角色加成
function calculateCharacterBonus(statName, value) {
    switch(statName) {
        case 'endurance':
            return `+${Math.floor(value / 5)} ${i18n.t('characterBonus.endurance')}`;
        case 'loyalty':
            return `+${Math.floor(value / 5)} ${i18n.t('characterBonus.loyalty')}`;
        case 'speed':
            return `+${Math.floor(value / 10)} ${i18n.t('characterBonus.speed')}`;
        case 'hp':
            return `+${value * 30} ${i18n.t('characterBonus.hp')}`;
        case 'aggressiveness':
            return i18n.t('characterBonus.none');
        default:
            return '';
    }
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 全域變數
let selectedPet = null;

// DOM 元素
const petCards = document.querySelectorAll('.pet-card');
const calculateBtn = document.getElementById('calculate');
const resultsSection = document.getElementById('results');
const levelInput = document.getElementById('level');
const helpBtn = document.getElementById('help-btn');
const helpModal = document.getElementById('help-modal');
const closeBtn = document.querySelector('.close');
const helpTabBtns = document.querySelectorAll('.help-tab-btn');
const helpTabContents = document.querySelectorAll('.help-tab-content');

// 初始化應用程式
async function initializeApp() {
    try {
        // 載入所有語言檔案
        await i18n.loadAllLanguages();
        
        // 初始化多語系內容
        i18n.updatePageContent();
        
        // 建立語言切換器
        createLanguageSwitcher();
        
        // 設置事件監聽器
        setupEventListeners();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// 建立語言切換器
function createLanguageSwitcher() {
    const headerElement = document.querySelector('header');
    if (!headerElement) return;
    
    const languageContainer = document.createElement('div');
    languageContainer.className = 'language-switcher';
    languageContainer.innerHTML = `
        <label for="language-select" data-i18n="common.language">${i18n.t('common.language')}</label>:
        <select id="language-select" class="language-select">
            <option value="zh-TW">繁體中文</option>
            <option value="en">English</option>
            <option value="ko">한국어</option>
        </select>
    `;
    
    headerElement.appendChild(languageContainer);
    
    // 設置當前語言
    const languageSelect = document.getElementById('language-select');
    languageSelect.value = i18n.getCurrentLanguage();
    
    // 語言切換事件
    languageSelect.addEventListener('change', async function() {
        const newLanguage = this.value;
        const success = await i18n.changeLanguage(newLanguage);
        if (success) {
            // 更新寵物名稱顯示
            updatePetNamesDisplay();
            // 重新計算如果有選中的寵物
            if (selectedPet) {
                updateBaseStatsDisplay();
            }
            showNotification('languageChanged', 'success');
        }
    });
}

// 更新寵物名稱顯示
function updatePetNamesDisplay() {
    petCards.forEach(card => {
        const petType = card.dataset.pet;
        const petNameElement = card.querySelector('h3');
        const petDescElement = card.querySelector('p');
        
        if (petNameElement && petDescElement) {
            petNameElement.textContent = i18n.t(`pets.${petType}`);
            petDescElement.textContent = i18n.t(`pets.${petType}Desc`);
        }
    });
}

// 事件監聽器設置
function setupEventListeners() {
    // 寵物選擇
    petCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除其他選中狀態
            petCards.forEach(c => c.classList.remove('selected'));
            // 選中當前寵物
            this.classList.add('selected');
            selectedPet = this.dataset.pet;
            
            // 更新基礎屬性顯示
            updateBaseStatsDisplay();
        });
    });

    // 計算按鈕
    calculateBtn.addEventListener('click', calculatePetStats);
    
    // 等級輸入變化時更新基礎值 - 使用防抖
    const debouncedUpdateBaseStats = debounce(updateBaseStatsDisplay, 300);
    levelInput.addEventListener('input', debouncedUpdateBaseStats);
    
    // 說明按鈕事件
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            helpModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滾動
        });
    }
    
    // 關閉按鈕事件
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            helpModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // 恢復背景滾動
        });
    }
    
    // 點擊視窗外部關閉
    window.addEventListener('click', function(event) {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // ESC鍵關閉視窗
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && helpModal && helpModal.style.display === 'block') {
            helpModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // 說明標籤切換
    helpTabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // 移除所有active狀態
            helpTabBtns.forEach(b => b.classList.remove('active'));
            helpTabContents.forEach(content => content.classList.remove('active'));
            
            // 添加當前標籤的active狀態
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 更新基礎屬性顯示
function updateBaseStatsDisplay() {
    if (!selectedPet) return;
    
    const level = parseInt(levelInput.value) || 1;
    const pet = petData[selectedPet];
    
    // 計算預期的基礎值
    const expectedStats = calculateExpectedStats(pet, level);
    
    // 更新輸入框的 placeholder
    Object.keys(expectedStats).forEach(stat => {
        const input = document.getElementById(stat);
        if (input && stat !== 'aggressiveness') {
            input.placeholder = `預期: ${expectedStats[stat].toFixed(1)}`;
        }
    });
}

// 計算預期屬性值
function calculateExpectedStats(pet, level) {
    const stats = { ...pet.baseStats };
    const upgradesNeeded = level - 1;
    
    // 計算每個屬性的預期增長
    Object.keys(stats).forEach(stat => {
        // 積極性不升級
        if (stat === 'aggressiveness') {
            return;
        }
        
        const isMainStat = stat === pet.mainStat;
        const rates = isMainStat ? upgradeRates.main : upgradeRates.sub;
        
        // 修正：計算每次升級的期望值
        let expectedPerLevel = 0;
        rates.forEach(rate => {
            expectedPerLevel += rate.level * rate.rate;
        });
        
        // 總期望增長 = 每次升級期望值 × 升級次數
        const totalExpectedIncrease = expectedPerLevel * upgradesNeeded;
        stats[stat] += totalExpectedIncrease;
    });
    
    return stats;
}

// 計算寵物屬性
function calculatePetStats() {
    if (!selectedPet) {
        showNotification('selectPet', 'warning');
        return;
    }
    
    const level = parseInt(levelInput.value) || 1;
    const currentStats = {
        endurance: parseInt(document.getElementById('endurance').value) || 0,
        loyalty: parseInt(document.getElementById('loyalty').value) || 0,
        speed: parseInt(document.getElementById('speed').value) || 0,
        aggressiveness: 3, // 固定為3
        hp: parseInt(document.getElementById('hp').value) || 0
    };
    
    // 驗證輸入
    if (level < 1 || level > 15) {
        showNotification('invalidLevel', 'error');
        return;
    }
    
    // 修正：調整屬性值合理範圍檢查，根據預期值動態計算
    const pet = petData[selectedPet];
    const expectedStats = calculateExpectedStats(pet, level);
    
    for (const [stat, value] of Object.entries(currentStats)) {
        if (stat !== 'aggressiveness' && value > 0) {
            // 設定合理上限為預期值的1.5倍（允許優質寵物）
            const maxReasonableValue = Math.ceil(expectedStats[stat] * 1.5);
            if (value > maxReasonableValue) {
                const statName = i18n.t(`stats.${stat}`);
                showNotification('valueToohigh', 'warning', { stat: statName, max: maxReasonableValue });
                return;
            }
        }
        if (value < 0) {
            const statName = i18n.t(`stats.${stat}`);
            showNotification('negativeValue', 'error', { stat: statName });
            return;
        }
    }
    
    if (Object.values(currentStats).filter((val, index) => index !== 3).every(val => val === 0)) {
        showNotification('noAttributes', 'warning');
        return;
    }
    
    const analysis = analyzeStats(pet, level, currentStats, expectedStats);
    
    displayResults(pet, level, currentStats, expectedStats, analysis);
    showNotification('calculateComplete', 'success');
}

// 分析屬性
function analyzeStats(pet, level, currentStats, expectedStats) {
    const analysis = {};
    let totalScore = 0;
    let validStats = 0;
    
    Object.keys(currentStats).forEach(stat => {
        if (stat === 'aggressiveness' || currentStats[stat] > 0) {
            const baseValue = pet.baseStats[stat];
            const expectedValue = expectedStats[stat];
            const currentValue = currentStats[stat];
            const growthValue = currentValue - baseValue;
            
            let rating, ratingClass, score;
            
            // 積極性特殊處理
            if (stat === 'aggressiveness') {
                rating = i18n.t('ratings.fixed');
                ratingClass = 'rating-good';
                score = 70; // 給予中等分數，但不影響平均
            } else {
                // 修正：計算成長率 (相對於預期值)，防止除零錯誤
                let growthRate;
                if (expectedValue > baseValue) {
                    growthRate = (currentValue - baseValue) / (expectedValue - baseValue);
                } else {
                    // 如果預期值等於基礎值（等級1的情況），直接比較當前值與基礎值
                    growthRate = currentValue >= baseValue ? 1 : 0.5;
                }
                
                // 防止負成長率異常情況
                if (growthRate < 0) {
                    growthRate = 0;
                }
                
                if (growthRate >= 1.4) {
                    rating = i18n.t('ratings.excellent');
                    ratingClass = 'rating-excellent';
                    score = 100;
                } else if (growthRate >= 1.2) {
                    rating = i18n.t('ratings.good');
                    ratingClass = 'rating-excellent';
                    score = 85;
                } else if (growthRate >= 1.05) {
                    rating = i18n.t('ratings.average');
                    ratingClass = 'rating-good';
                    score = 70;
                } else if (growthRate >= 1.0) {
                    rating = i18n.t('ratings.normal');
                    ratingClass = 'rating-average';
                    score = 55;
                } else if (growthRate >= 0.85) {
                    rating = i18n.t('ratings.poor');
                    ratingClass = 'rating-average';
                    score = 40;
                } else {
                    rating = i18n.t('ratings.bad');
                    ratingClass = 'rating-poor';
                    score = 30;
                }
                
                // 主屬性加權
                if (stat === pet.mainStat) {
                    score *= 1.5;
                }
                
                totalScore += score;
                validStats++;
            }
            
            analysis[stat] = {
                current: currentValue,
                base: baseValue,
                expected: expectedValue,
                growth: growthValue,
                rating: rating,
                ratingClass: ratingClass,
                score: score,
                isMain: stat === pet.mainStat,
                characterBonus: calculateCharacterBonus(stat, currentValue)
            };
        }
    });
    
    // 計算整體評價（排除積極性）
    const averageScore = validStats > 0 ? totalScore / validStats : 0;
    let overallRating, overallClass, description;
    
    if (averageScore >= 95) {
        overallRating = i18n.t('ratings.godTier');
        overallClass = 'excellent';
        description = i18n.t('descriptions.godTier');
    } else if (averageScore >= 80) {
        overallRating = i18n.t('ratings.highQuality');
        overallClass = 'excellent';
        description = i18n.t('descriptions.highQuality');
    } else if (averageScore >= 65) {
        overallRating = i18n.t('ratings.normalPet');
        overallClass = 'good';
        description = i18n.t('descriptions.normal');
    } else if (averageScore >= 50) {
        overallRating = i18n.t('ratings.needImprovement');
        overallClass = 'average';
        description = i18n.t('descriptions.needImprovement');
    } else {
        overallRating = i18n.t('ratings.poorQuality');
        overallClass = 'poor';
        description = i18n.t('descriptions.poor');
    }
    
    return {
        stats: analysis,
        overall: {
            rating: overallRating,
            class: overallClass,
            description: description,
            score: averageScore
        }
    };
}

// 顯示結果
function displayResults(pet, level, currentStats, expectedStats, analysis) {
    // 顯示寵物資訊 - 使用圖片替代emoji
    const petEmojiElement = document.querySelector('.pet-emoji');
    if (petEmojiElement) {
        // 如果存在舊的圖片或文字，先清除
        petEmojiElement.innerHTML = '';
        // 創建圖片元素
        const petImg = document.createElement('img');
        petImg.src = pet.image;
        petImg.alt = i18n.t(`pets.${selectedPet}`);
        petImg.className = 'pet-image';
        petEmojiElement.appendChild(petImg);
    }
    
    document.querySelector('.pet-name').textContent = i18n.t(`pets.${selectedPet}`);
    document.querySelector('.pet-level').textContent = `Lv.${level}`;
    
    // 清空之前的比較表格
    const comparisonGrid = document.querySelector('.comparison-grid');
    comparisonGrid.innerHTML = `
        <div class="stat-row header">
            <div>${i18n.t('results.attribute')}</div>
            <div>${i18n.t('common.currentValue')}</div>
            <div>${i18n.t('common.baseValue')}</div>
            <div>${i18n.t('common.growthValue')}</div>
            <div>${i18n.t('common.expectedValue')}</div>
            <div>${i18n.t('common.characterBonus')}</div>
            <div>${i18n.t('common.rating')}</div>
        </div>
    `;
    
    // 添加屬性行
    Object.keys(analysis.stats).forEach(stat => {
        const data = analysis.stats[stat];
        const statRow = document.createElement('div');
        statRow.className = 'stat-row';
        
        const mainIndicator = data.isMain ? ' ⭐' : '';
        
        statRow.innerHTML = `
            <div>${i18n.t(`stats.${stat}`)}${mainIndicator}</div>
            <div>${data.current}</div>
            <div>${data.base}</div>
            <div>+${data.growth}</div>
            <div>${formatNumber(data.expected)}</div>
            <div>${data.characterBonus}</div>
            <div><span class="${data.ratingClass}">${data.rating}</span></div>
        `;
        
        comparisonGrid.appendChild(statRow);
    });
    
    // 顯示整體評價
    const ratingBadge = document.querySelector('.rating-badge');
    const ratingDescription = document.querySelector('.rating-description');
    
    ratingBadge.textContent = analysis.overall.rating;
    ratingBadge.className = `rating-badge ${analysis.overall.class}`;
    ratingDescription.textContent = analysis.overall.description;
    
    // 顯示結果區域
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// 工具函數：格式化數字
function formatNumber(num) {
    return Math.round(num * 10) / 10;
}

// 應用程式初始化
document.addEventListener('DOMContentLoaded', initializeApp);
