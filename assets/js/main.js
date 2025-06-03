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

// 簡化的通知系統（移除i18n依賴）
function showNotification(message, type = 'warning') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="關閉">&times;</button>
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
            return `+${Math.floor(value / 5)} 物防`;
        case 'loyalty':
            return `+${Math.floor(value / 5)} 命中`;
        case 'speed':
            return `+${Math.floor(value / 10)} 迴避`;
        case 'hp':
            return `+${value * 30} HP`;
        case 'aggressiveness':
            return '無加成';
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

// 初始化寵物計算器
function initPetCalculator() {
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

    // 設置事件監聽器
    setupEventListeners(petCards, calculateBtn, levelInput, helpBtn, helpModal, closeBtn, helpTabBtns, helpTabContents);
}

// 設置事件監聽器
function setupEventListeners(petCards, calculateBtn, levelInput, helpBtn, helpModal, closeBtn, helpTabBtns, helpTabContents) {
    // 寵物選擇事件
    petCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除其他卡片的選中狀態
            petCards.forEach(c => c.classList.remove('selected'));
            
            // 添加選中狀態
            this.classList.add('selected');
            
            // 設置選中的寵物
            selectedPet = this.dataset.pet;
            
            // 更新基礎屬性顯示
            updateBaseStatsDisplay();
        });
    });

    // 計算按鈕事件
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePetStats);
    }

    // 等級輸入事件（使用防抖）
    if (levelInput) {
        levelInput.addEventListener('input', debounce(updateBaseStatsDisplay, 300));
    }

    // 幫助按鈕事件
    if (helpBtn && helpModal) {
        helpBtn.addEventListener('click', () => {
            helpModal.style.display = 'block';
            helpModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    // 關閉幫助視窗事件
    if (closeBtn && helpModal) {
        closeBtn.addEventListener('click', () => {
            helpModal.style.display = 'none';
            helpModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        });
    }

    // 點擊外部關閉視窗
    if (helpModal) {
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.style.display = 'none';
                helpModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // 幫助標籤切換事件
    if (helpTabBtns && helpTabContents) {
        helpTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // 移除所有活動狀態
                helpTabBtns.forEach(b => b.classList.remove('active'));
                helpTabContents.forEach(content => content.classList.remove('active'));
                
                // 添加活動狀態
                btn.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // ESC 鍵關閉視窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && helpModal && helpModal.style.display === 'block') {
            helpModal.style.display = 'none';
            helpModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });
}

// 更新基礎屬性顯示
function updateBaseStatsDisplay() {
    if (!selectedPet) return;
    
    const pet = petData[selectedPet];
    const level = parseInt(document.getElementById('level')?.value) || 1;
    
    // 計算期望值並更新顯示
    const expectedStats = calculateExpectedStats(pet, level);
    
    // 這裡可以添加基礎屬性顯示邏輯（如果需要的話）
}

// 計算期望屬性值
function calculateExpectedStats(pet, level) {
    const expectedStats = {};
    const growthLevels = level - 1;
    
    Object.keys(pet.baseStats).forEach(statName => {
        const baseValue = pet.baseStats[statName];
        const isMainStat = statName === pet.mainStat;
        
        // 主屬性預期成長：每級 +3.75 點
        // 副屬性預期成長：每級 +1.25 點
        const expectedGrowthPerLevel = isMainStat ? 3.75 : 1.25;
        const expectedGrowth = growthLevels * expectedGrowthPerLevel;
        
        expectedStats[statName] = baseValue + expectedGrowth;
    });
    
    return expectedStats;
}

// 計算寵物屬性
function calculatePetStats() {
    if (!selectedPet) {
        showNotification('請先選擇一個寵物！', 'warning');
        return;
    }
    
    const pet = petData[selectedPet];
    const level = parseInt(document.getElementById('level')?.value) || 1;
    
    // 驗證等級
    if (level < 1 || level > 15) {
        showNotification('寵物等級必須在 1-15 之間！', 'warning');
        return;
    }
    
    // 獲取當前屬性值
    const currentStats = {
        endurance: parseInt(document.getElementById('endurance')?.value) || 0,
        loyalty: parseInt(document.getElementById('loyalty')?.value) || 0,
        speed: parseInt(document.getElementById('speed')?.value) || 0,
        aggressiveness: parseInt(document.getElementById('aggressiveness')?.value) || 3,
        hp: parseInt(document.getElementById('hp')?.value) || 0
    };
    
    // 驗證輸入
    for (const [statName, value] of Object.entries(currentStats)) {
        if (value < 0) {
            showNotification(`${statNames[statName]}不能為負數！`, 'warning');
            return;
        }
        
        if (statName !== 'aggressiveness' && value < pet.baseStats[statName]) {
            showNotification(`${statNames[statName]}不能低於基礎值 ${pet.baseStats[statName]}！`, 'warning');
            return;
        }
    }
    
    // 計算期望值
    const expectedStats = calculateExpectedStats(pet, level);
    
    // 分析屬性
    const analysis = analyzeStats(pet, level, currentStats, expectedStats);
    
    // 顯示結果
    displayResults(pet, level, currentStats, expectedStats, analysis);
}

// 分析屬性表現
function analyzeStats(pet, level, currentStats, expectedStats) {
    const analysis = {
        statAnalysis: {},
        overallScore: 0,
        rating: '',
        description: ''
    };
    
    let totalScore = 0;
    let weightedScore = 0;
    let totalWeight = 0;
    
    Object.keys(pet.baseStats).forEach(statName => {
        const current = currentStats[statName];
        const expected = expectedStats[statName];
        const base = pet.baseStats[statName];
        const growth = current - base;
        const expectedGrowth = expected - base;
        
        // 計算成長率 (相對於期望值的百分比)
        let growthRate = 0;
        if (expectedGrowth > 0) {
            growthRate = (growth / expectedGrowth) * 100;
        } else if (growth === 0 && expectedGrowth === 0) {
            growthRate = 100; // 沒有成長空間時視為100%
        }
        
        // 屬性評級
        let rating = '';
        if (growthRate >= 140) {
            rating = 'excellent';
        } else if (growthRate >= 120) {
            rating = 'good';
        } else if (growthRate >= 85) {
            rating = 'average';
        } else {
            rating = 'poor';
        }
        
        analysis.statAnalysis[statName] = {
            current: current,
            base: base,
            growth: growth,
            expected: expected,
            growthRate: growthRate,
            rating: rating,
            isMainStat: statName === pet.mainStat
        };
        
        // 權重計算（主屬性 1.5 倍權重）
        const weight = statName === pet.mainStat ? 1.5 : 1.0;
        weightedScore += growthRate * weight;
        totalWeight += weight;
    });
    
    // 計算整體評分
    analysis.overallScore = weightedScore / totalWeight;
    
    // 整體評級
    if (analysis.overallScore >= 140) {
        analysis.rating = 'excellent';
        analysis.description = window.i18n?.t('descriptions.godTier') || '🌟 極品寵物！屬性成長遠超預期，值得重點培養！';
    } else if (analysis.overallScore >= 120) {
        analysis.rating = 'good';
        analysis.description = window.i18n?.t('descriptions.highQuality') || '⭐ 優秀寵物！屬性成長良好，推薦培養！';
    } else if (analysis.overallScore >= 85) {
        analysis.rating = 'average';
        analysis.description = window.i18n?.t('descriptions.normal') || '✅ 普通寵物，屬性成長合乎預期，可正常使用。';
    } else {
        analysis.rating = 'poor';
        analysis.description = window.i18n?.t('descriptions.needImprovement') || '⚠️ 屬性成長不佳，建議考慮重新培養。';
    }
    
    return analysis;
}

// 顯示計算結果
function displayResults(pet, level, currentStats, expectedStats, analysis) {
    const resultsSection = document.getElementById('results');
    if (!resultsSection) return;
    
    // 顯示結果區域
    resultsSection.style.display = 'block';
    
    // 更新寵物信息
    const petEmoji = document.querySelector('.pet-emoji');
    const petName = document.querySelector('.pet-name');
    const petLevel = document.querySelector('.pet-level');
    
    if (petEmoji) petEmoji.textContent = pet.emoji;
    if (petName) petName.textContent = pet.name;
    if (petLevel) petLevel.textContent = `等級 ${level}`;
    
    // 更新比較表格
    const comparisonGrid = document.querySelector('.comparison-grid');
    if (comparisonGrid) {
        // 清除舊內容（保留標題行）
        const headerRow = comparisonGrid.querySelector('.stat-row.header');
        comparisonGrid.innerHTML = '';
        if (headerRow) {
            comparisonGrid.appendChild(headerRow);
        }
        
        // 添加屬性行
        Object.keys(pet.baseStats).forEach(statName => {
            const stat = analysis.statAnalysis[statName];
            
            const row = document.createElement('div');
            row.className = `stat-row rating-${stat.rating}`;
            
            row.innerHTML = `
                <div>${window.i18n?.t(`stats.${statName}`) || statNames[statName]}${stat.isMainStat ? ' ⭐' : ''}</div>
                <div>${stat.current}</div>
                <div>${stat.base}</div>
                <div>${stat.growth}</div>
                <div>${formatNumber(stat.expected)}</div>
                <div>${calculateCharacterBonus(statName, stat.current)}</div>
                <div>${formatNumber(stat.growthRate)}%</div>
            `;
            
            comparisonGrid.appendChild(row);
        });
    }
    
    // 更新整體評價
    const ratingBadge = document.querySelector('.rating-badge');
    const ratingDescription = document.querySelector('.rating-description');
    
    if (ratingBadge) {
        ratingBadge.className = `rating-badge ${analysis.rating}`;
        
        const ratingTexts = {
            excellent: window.i18n?.t('ratings.excellent') || '極品',
            good: window.i18n?.t('ratings.good') || '優秀', 
            average: window.i18n?.t('ratings.average') || '普通',
            poor: window.i18n?.t('ratings.poor') || '不佳'
        };
        
        ratingBadge.textContent = ratingTexts[analysis.rating] || '未知';
    }
    
    if (ratingDescription) {
        ratingDescription.textContent = analysis.description;
    }
    
    // 滾動到結果區域
    resultsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // 顯示成功通知
    showNotification('✅ 計算完成！請查看結果。', 'success');
}

// 格式化數字
function formatNumber(num) {
    return Math.round(num * 100) / 100;
}

// 初始化應用
document.addEventListener('DOMContentLoaded', async function() {
    // 初始化寵物計算器
    initPetCalculator();
    
    // 等待 i18n 模組載入 - 增加更長的等待時間和重試機制
    let retryCount = 0;
    const maxRetries = 10;
    
    const waitForI18n = async () => {
        if (window.i18n && typeof window.i18n.loadAllLanguages === 'function') {
            await initI18n();
            return true;
        }
        
        if (retryCount < maxRetries) {
            retryCount++;
            console.log(`等待 i18n 模組載入... (${retryCount}/${maxRetries})`);
            setTimeout(waitForI18n, 200);
        } else {
            console.error('無法載入 i18n 模組，請檢查 i18n.js 文件');
        }
    };
    
    // 開始等待並初始化 i18n
    await waitForI18n();
});

// 初始化多語系
async function initI18n() {
    try {
        console.log('開始初始化多語系...');
        
        // 檢查 i18n 是否存在
        if (!window.i18n) {
            console.error('i18n 模組未載入');
            return;
        }
        
        // 載入所有語言
        console.log('載入語言檔案...');
        await window.i18n.loadAllLanguages();
        
        // 設置語言選擇器
        console.log('設置語言選擇器...');
        setupLanguageSelector();
        
        // 更新頁面內容
        console.log('更新頁面內容...');
        window.i18n.updatePageContent();
        
        console.log('多語系初始化完成，當前語言：', window.i18n.getCurrentLanguage());
    } catch (error) {
        console.error('多語系初始化失敗:', error);
    }
}

// 設置語言選擇器
function setupLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        // 設置當前語言
        languageSelect.value = window.i18n.getCurrentLanguage();
        
        // 監聽語言變更
        languageSelect.addEventListener('change', async function() {
            const newLanguage = this.value;
            const success = await window.i18n.changeLanguage(newLanguage);
            
            if (success) {
                // 顯示語言切換成功通知
                const languageNames = {
                    'zh-TW': '繁體中文',
                    'en': 'English',
                    'ko': '한국어'
                };
                showNotification(`語言已切換至 ${languageNames[newLanguage]}`, 'success');
            } else {
                // 語言切換失敗，恢復原來的選擇
                languageSelect.value = window.i18n.getCurrentLanguage();
                showNotification('語言切換失敗', 'error');
            }
        });
    }
}
