// 天堂W 轉職花費計算器 - 根據官方數據重構版
class JobChangeCalculator {
    constructor() {
        this.initializeData();
        this.bindEvents();
        this.updateCostDisplay(); // 初始化顯示
        this.updateDetailedCostDisplay(); // 初始化詳細顯示
    }

    initializeData() {
        // 基於截圖官方數據的轉職硬幣消耗表
        this.jobChangeCosts = {
            // 裝備轉職硬幣消耗（按品質）
            equipment: {
                weapon: {
                    rare: 1,
                    hero: 9,
                    legend: 27,
                    mythic: 81
                },
                armor: {
                    rare: 1,
                    hero: 9,
                    legend: 27,
                    mythic: 81
                },
                accessory: {
                    rare: 1,
                    hero: 9,
                    legend: 27,
                    mythic: 81
                }
            },
            
            // 詳細裝備分類限制和消耗
            detailedEquipment: {
                weapon: { max: 3, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                helmet: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                chest: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                arms: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                gloves: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                legs: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                boots: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                belt: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                cloak: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                necklace: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                earring: { max: 2, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                ring: { max: 4, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } },
                rune: { max: 1, costs: { rare: 1, hero: 9, legend: 27, mythic: 81 } }
            },

            // 商城裝備消耗（固定5枚硬幣）
            cashEquipment: {
                shirt: { max: 3, cost: 5 },
                shoulder: { max: 2, cost: 5 },
                mask: { max: 5, cost: 5 }
            },
            
            // 技能轉職硬幣消耗（按品質，包含複雜計算規則）
            skills: {
                rare: { base: 1, rules: [] }, // 稀有技能：1個
                hero: { 
                    base: 9, 
                    rules: [
                        { threshold: 6, extraCost: 18 }, // 7個(6+1)時，超過1個需18個
                        { threshold: 7, extraCost: 27 }  // 8個(7+1)時，超過1個需27個
                    ]
                },
                legend: { 
                    base: 27, 
                    rules: [
                        { threshold: 3, extraCost: 54 }, // 4個(3+1)時，超過1個需54個
                        { threshold: 4, extraCost: 81 }  // 5個(4+1)時，超過1個需81個
                    ]
                },
                mythic: { 
                    base: 81, 
                    rules: [
                        { threshold: 1, extraCost: 162 } // 2個(1+1)時，超過1個需162個
                    ]
                }
            },
            
            // 咒語卡轉職硬幣消耗（按品質，包含複雜計算規則）
            spells: {
                rare: { 
                    base: 1, 
                    rules: [
                        { threshold: 10, extraCost: 1 } // 11個(10+1)時，超過1個需1個
                    ]
                },
                hero: { 
                    base: 9, 
                    rules: [
                        { threshold: 10, extraCost: 18 }, // 11個(10+1)時，超過1個需18個
                        { threshold: 11, extraCost: 27 }  // 12個(11+1)時，超過1個需27個
                    ]
                },
                legend: { 
                    base: 27, 
                    rules: [
                        { threshold: 10, extraCost: 54 }, // 11個(10+1)時，超過1個需54個
                        { threshold: 11, extraCost: 81 }  // 12個(11+1)時，超過1個需81個
                    ]
                },
                mythic: { 
                    base: 81, 
                    rules: [] // 神話咒語卡暫無額外規則
                }
            }
        };

        // 基本轉職費用（固定不變）
        this.baseDiamondCost = 2000;
        
        // 品質顯示名稱映射
        this.qualityNames = {
            rare: '稀有',
            hero: '英雄',
            legend: '傳說',
            mythic: '神話'
        };

        // 信息內容映射
        this.infoContent = {
            weapon: {
                title: '武器轉職硬幣消耗',
                table: [
                    ['品質', '消耗硬幣'],
                    ['稀有', '1枚'],
                    ['英雄', '9枚'],
                    ['傳說', '27枚'],
                    ['神話', '81枚']
                ]
            },
            armor: {
                title: '防具轉職硬幣消耗',
                table: [
                    ['品質', '消耗硬幣'],
                    ['稀有', '1枚'],
                    ['英雄', '9枚'],
                    ['傳說', '27枚'],
                    ['神話', '81枚']
                ]
            },
            accessory: {
                title: '飾品轉職硬幣消耗',
                table: [
                    ['品質', '消耗硬幣'],
                    ['稀有', '1枚'],
                    ['英雄', '9枚'],
                    ['傳說', '27枚'],
                    ['神話', '81枚']
                ]
            },
            cash: {
                title: '商城裝備轉職硬幣消耗',
                table: [
                    ['裝備類型', '消耗硬幣', '上限數量'],
                    ['商城T恤', '5枚', '3件'],
                    ['商城肩甲', '5枚', '2件'],
                    ['商城面甲', '5枚', '5件']
                ],
                specialRules: {
                    title: '特殊說明',
                    rules: [
                        '商城裝備統一消耗5枚轉職硬幣',
                        '包括燦爛系列、閃耀系列等特殊外觀裝備',
                        '不受品質影響，均為5枚硬幣'
                    ]
                }
            },
            skill: {
                title: '技能轉職硬幣消耗',
                table: [
                    ['品質', '基本消耗', '特殊規則'],
                    ['稀有', '1枚', '-'],
                    ['英雄', '9枚', '7個時超過部分18枚，8個時超過部分27枚'],
                    ['傳說', '27枚', '4個時超過部分54枚，5個時超過部分81枚'],
                    ['神話', '81枚', '2個時超過部分162枚']
                ],
                specialRules: {
                    title: '特殊計算規則',
                    rules: [
                        '英雄技能：前6個每個9枚，第7個起每個18枚，第8個起每個27枚',
                        '傳說技能：前3個每個27枚，第4個起每個54枚，第5個起每個81枚',
                        '神話技能：第1個81枚，第2個起每個162枚'
                    ]
                }
            },
            spell: {
                title: '咒語卡轉職硬幣消耗',
                table: [
                    ['品質', '基本消耗', '特殊規則'],
                    ['稀有', '1枚', '11個時超過部分1枚'],
                    ['英雄', '9枚', '11個時超過部分18枚，12個時超過部分27枚'],
                    ['傳說', '27枚', '11個時超過部分54枚，12個時超過部分81枚'],
                    ['神話', '81枚', '-']
                ],
                specialRules: {
                    title: '特殊計算規則',
                    rules: [
                        '稀有咒語卡：前10個每個1枚，第11個起每個1枚',
                        '英雄咒語卡：前10個每個9枚，第11個起每個18枚，第12個起每個27枚',
                        '傳說咒語卡：前10個每個27枚，第11個起每個54枚，第12個起每個81枚'
                    ]
                }
            }
        };
    }

    bindEvents() {
        // 綁定所有輸入框的即時計算事件
        this.bindInputEvents();
        
        // 綁定頁面切換事件
        this.bindPageSwitchEvents();

        // 綁定子頁面切換事件
        this.bindSubPageSwitchEvents();

        // 綁定信息圖標事件
        this.bindInfoIconEvents();

        // 綁定禮包勾選事件
        this.bindPackageEvents();

        // 綁定詳細計算器事件
        this.bindDetailedInputEvents();
    }

    bindInputEvents() {
        // 裝備輸入框（簡易版）
        const equipmentInputs = document.querySelectorAll('.equipment-input');
        equipmentInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateInput(input);
                this.updateCostDisplay();
            });
            
            input.addEventListener('change', () => {
                this.validateInput(input);
                this.updateCostDisplay();
            });
        });
    }

    bindDetailedInputEvents() {
        // 詳細計算器輸入框
        const detailedInputs = document.querySelectorAll('.detailed-input');
        detailedInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.validateDetailedInput(input);
                this.updateDetailedCostDisplay();
            });
            
            input.addEventListener('change', () => {
                this.validateDetailedInput(input);
                this.updateDetailedCostDisplay();
            });
        });
    }

    bindInfoIconEvents() {
        const infoIcons = document.querySelectorAll('.info-icon');
        const infoModal = document.getElementById('info-modal');
        const closeBtn = infoModal?.querySelector('.close');

        infoIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const infoType = icon.dataset.info;
                this.showInfoModal(infoType);
            });
        });

        // 關閉信息視窗事件
        if (closeBtn && infoModal) {
            closeBtn.addEventListener('click', () => {
                infoModal.style.display = 'none';
                infoModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            });
        }

        // 點擊外部關閉視窗
        if (infoModal) {
            infoModal.addEventListener('click', (e) => {
                if (e.target === infoModal) {
                    infoModal.style.display = 'none';
                    infoModal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = 'auto';
                }
            });
        }

        // ESC 鍵關閉視窗
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && infoModal && infoModal.style.display === 'block') {
                infoModal.style.display = 'none';
                infoModal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = 'auto';
            }
        });
    }

    showInfoModal(infoType) {
        const infoModal = document.getElementById('info-modal');
        const infoContent = document.getElementById('info-content');
        
        if (!infoModal || !infoContent || !this.infoContent[infoType]) return;

        const content = this.infoContent[infoType];
        let html = `<h3>${content.title}</h3>`;

        // 生成表格
        if (content.table) {
            html += '<table class="cost-table">';
            content.table.forEach((row, index) => {
                if (index === 0) {
                    // 表頭
                    html += '<tr>';
                    row.forEach(cell => {
                        html += `<th>${cell}</th>`;
                    });
                    html += '</tr>';
                } else {
                    // 數據行
                    html += '<tr>';
                    row.forEach((cell, cellIndex) => {
                        if (cellIndex === 0) {
                            // 品質列
                            const qualityClass = cell === '稀有' ? 'rare' : 
                                                 cell === '英雄' ? 'hero' : 
                                                 cell === '傳說' ? 'legend' : 
                                                 cell === '神話' ? 'mythic' : '';
                            html += `<td class="${qualityClass}">${cell}</td>`;
                        } else {
                            html += `<td>${cell}</td>`;
                        }
                    });
                    html += '</tr>';
                }
            });
            html += '</table>';
        }

        // 特殊規則
        if (content.specialRules) {
            html += `<div class="special-rule">
                        <h4>${content.specialRules.title}</h4>
                        <ul>`;
            content.specialRules.rules.forEach(rule => {
                html += `<li>${rule}</li>`;
            });
            html += '</ul></div>';
        }

        infoContent.innerHTML = html;

        // 顯示視窗
        infoModal.style.display = 'block';
        infoModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    validateInput(input) {
        const value = parseInt(input.value) || 0;
        const min = parseInt(input.getAttribute('min')) || 0;
        
        // 簡易計算器不限制上限，只檢查最小值
        if (value < min) {
            input.value = min;
        }
    }

    bindPageSwitchEvents() {
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (tab.classList.contains('disabled')) return;
                
                const targetPage = tab.dataset.page;
                this.switchPage(targetPage);
                
                // 更新活動標籤
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    switchPage(pageName) {
        // 隱藏所有頁面
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // 顯示目標頁面
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }

    bindSubPageSwitchEvents() {
        const subNavTabs = document.querySelectorAll('.sub-nav-tab');
        subNavTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetSubPage = tab.dataset.subPage;
                this.switchSubPage(targetSubPage);
                
                // 更新活動標籤
                subNavTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    switchSubPage(subPageName) {
        // 隱藏所有子頁面
        const subPages = document.querySelectorAll('.sub-page-content');
        subPages.forEach(page => {
            page.classList.remove('active');
        });

        // 顯示目標子頁面
        const targetSubPage = document.getElementById(subPageName);
        if (targetSubPage) {
            targetSubPage.classList.add('active');
        }
    }

    updateCostDisplay() {
        try {
            // 計算各類物品消耗
            const equipmentCost = this.calculateEquipmentCost();
            const skillCost = this.calculateSkillCost();
            const spellCost = this.calculateSpellCost();
            const cashCost = this.calculateCashEquipmentCost(); // 添加商城裝備計算
            
            let totalCoinCost = equipmentCost.totalCoins + skillCost.totalCoins + spellCost.totalCoins + cashCost.totalCoins;

            // 檢查禮包減免
            const packageCheckbox = document.getElementById('coin-package');
            const packageDiscount = packageCheckbox && packageCheckbox.checked ? 300 : 0;
            
            // 應用禮包減免（但不能低於0）
            const finalCoinCost = Math.max(0, totalCoinCost - packageDiscount);

            // 更新即時顯示
            this.updateLiveCostDisplay(finalCoinCost, packageDiscount, totalCoinCost);
            
            // 更新詳細明細
            this.updateCostDetails({
                equipment: equipmentCost,
                skills: skillCost,
                spells: spellCost,
                cash: cashCost, // 添加商城裝備
                totalCoins: totalCoinCost,
                finalCoins: finalCoinCost,
                packageDiscount: packageDiscount
            });

        } catch (error) {
            console.error('計算轉職花費時發生錯誤:', error);
        }
    }

    calculateEquipmentCost() {
        let totalCoins = 0;
        const details = [];
        let weaponCost = 0;
        let armorCost = 0;
        let accessoryCost = 0;

        // 武器
        ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
            const count = parseInt(document.getElementById(`weapon-${quality}`)?.value) || 0;
            if (count > 0) {
                const cost = this.jobChangeCosts.equipment.weapon[quality] * count;
                weaponCost += cost;
                totalCoins += cost;
                details.push(`${this.qualityNames[quality]}武器 x${count}: ${cost}枚`);
            }
        });

        // 防具
        ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
            const count = parseInt(document.getElementById(`armor-${quality}`)?.value) || 0;
            if (count > 0) {
                const cost = this.jobChangeCosts.equipment.armor[quality] * count;
                armorCost += cost;
                totalCoins += cost;
                details.push(`${this.qualityNames[quality]}防具 x${count}: ${cost}枚`);
            }
        });

        // 飾品
        ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
            const count = parseInt(document.getElementById(`accessory-${quality}`)?.value) || 0;
            if (count > 0) {
                const cost = this.jobChangeCosts.equipment.accessory[quality] * count;
                accessoryCost += cost;
                totalCoins += cost;
                details.push(`${this.qualityNames[quality]}飾品 x${count}: ${cost}枚`);
            }
        });

        // 更新個別顯示
        this.updateTypeDisplay('weapon-cost', weaponCost);
        this.updateTypeDisplay('armor-cost', armorCost);
        this.updateTypeDisplay('accessory-cost', accessoryCost);
        this.updateTypeDisplay('equipment-cost', totalCoins);

        return { totalCoins, details, weaponCost, armorCost, accessoryCost };
    }

    updateTypeDisplay(elementId, cost) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `${cost}枚`;
        }
    }

    calculateSkillCost() {
        let totalCoins = 0;
        const details = [];

        ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
            const count = parseInt(document.getElementById(`skill-${quality}`)?.value) || 0;
            if (count > 0) {
                const cost = this.calculateComplexCost(count, this.jobChangeCosts.skills[quality]);
                totalCoins += cost;
                details.push(`${this.qualityNames[quality]}技能 x${count}: ${cost}枚`);
            }
        });

        // 更新技能總花費顯示
        this.updateTypeDisplay('skill-cost', totalCoins);

        return { totalCoins, details };
    }

    calculateSpellCost() {
        let totalCoins = 0;
        const details = [];

        ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
            const count = parseInt(document.getElementById(`spell-${quality}`)?.value) || 0;
            if (count > 0) {
                const cost = this.calculateComplexCost(count, this.jobChangeCosts.spells[quality]);
                totalCoins += cost;
                details.push(`${this.qualityNames[quality]}咒語卡 x${count}: ${cost}枚`);
            }
        });

        // 更新咒語卡總花費顯示
        this.updateTypeDisplay('spell-cost', totalCoins);

        return { totalCoins, details };
    }

    // 計算複雜成本（根據閾值和額外成本規則）
    calculateComplexCost(count, costData) {
        if (count === 0) return 0;

        let totalCost = 0;
        const { base, rules } = costData;

        // 找到適用的規則
        let applicableRule = null;
        for (const rule of rules) {
            if (count > rule.threshold) {
                applicableRule = rule;
            }
        }

        if (applicableRule) {
            // 應用特殊規則
            const baseCount = applicableRule.threshold;
            const extraCount = count - baseCount;
            totalCost = (baseCount * base) + (extraCount * applicableRule.extraCost);
        } else {
            // 使用基本費率
            totalCost = count * base;
        }

        return totalCost;
    }

    updateLiveCostDisplay(finalCoinCost, packageDiscount, originalCost) {
        // 更新即時費用顯示
        const liveCoinCost = document.getElementById('live-coin-cost');
        const liveTotalCost = document.getElementById('live-total-cost');
        
        if (liveCoinCost) {
            if (packageDiscount > 0 && originalCost > 0) {
                liveCoinCost.innerHTML = `${finalCoinCost}枚 <small style="text-decoration: line-through; opacity: 0.7;">(原${originalCost}枚)</small>`;
            } else {
                liveCoinCost.textContent = `${finalCoinCost}枚`;
            }
        }
        
        if (liveTotalCost) {
            if (finalCoinCost > 0) {
                if (packageDiscount > 0) {
                    liveTotalCost.innerHTML = `2000鑽 + ${finalCoinCost}枚轉職硬幣 <small style="opacity: 0.8;">(已享禮包優惠)</small>`;
                } else {
                    liveTotalCost.textContent = `2000鑽 + ${finalCoinCost}枚轉職硬幣`;
                }
            } else {
                liveTotalCost.textContent = '2000鑽';
            }
        }
    }

    updateCostDetails(costs) {
        const costDetails = document.getElementById('cost-details');
        if (!costDetails) return;

        let detailsHTML = '';
        
        // 裝備詳細
        if (costs.equipment.details.length > 0) {
            detailsHTML += '<h5>🛡️ 裝備轉職硬幣</h5><ul>';
            costs.equipment.details.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }
        
        // 技能詳細
        if (costs.skills.details.length > 0) {
            detailsHTML += '<h5>⚡ 技能轉職硬幣</h5><ul>';
            costs.skills.details.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }
        
        // 咒語卡詳細
        if (costs.spells.details.length > 0) {
            detailsHTML += '<h5>🃏 咒語卡轉職硬幣</h5><ul>';
            costs.spells.details.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }

        // 商城裝備詳細
        if (costs.cash && costs.cash.details.length > 0) {
            detailsHTML += '<h5>🛍️ 商城裝備轉職硬幣</h5><ul>';
            costs.cash.details.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }

        // 禮包減免信息
        if (costs.packageDiscount > 0) {
            detailsHTML += '<h5>💎 禮包優惠</h5><ul>';
            detailsHTML += `<li><span>轉職硬幣禮包優惠</span><span>-${costs.packageDiscount}枚</span></li>`;
            detailsHTML += '</ul>';
        }

        // 總計信息
        if (costs.totalCoins > 0) {
            detailsHTML += '<h5>📊 費用總計</h5><ul>';
            detailsHTML += `<li><span>基本轉職費用</span><span>2000鑽</span></li>`;
            if (costs.packageDiscount > 0) {
                detailsHTML += `<li><span>轉職硬幣原價</span><span>${costs.totalCoins}枚</span></li>`;
                detailsHTML += `<li><span>禮包優惠</span><span>-${costs.packageDiscount}枚</span></li>`;
                detailsHTML += `<li style="font-weight: 600; color: #98c379;"><span>轉職硬幣實付</span><span>${costs.finalCoins}枚</span></li>`;
            } else {
                detailsHTML += `<li><span>轉職硬幣費用</span><span>${costs.finalCoins}枚</span></li>`;
            }
            detailsHTML += '</ul>';
        }

        if (detailsHTML === '') {
            detailsHTML = '<p class="no-items">請選擇要轉職的物品</p>';
        }

        costDetails.innerHTML = detailsHTML;
    }

    showAlert(message, type = 'info') {
        // 創建提示訊息
        const alertDiv = document.createElement('div');
        alertDiv.className = `notification ${type}`;
        alertDiv.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // 添加到頁面
        document.body.appendChild(alertDiv);

        // 自動移除
        setTimeout(() => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, 3000);

        // 手動關閉
        alertDiv.querySelector('.notification-close').addEventListener('click', () => {
            alertDiv.classList.add('fade-out');
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        });
    }

    bindPackageEvents() {
        const packageCheckbox = document.getElementById('coin-package');
        if (packageCheckbox) {
            packageCheckbox.addEventListener('change', () => {
                this.updateCostDisplay();
            });
        }

        // 詳細版禮包
        const detailedPackageCheckbox = document.getElementById('detailed-coin-package');
        if (detailedPackageCheckbox) {
            detailedPackageCheckbox.addEventListener('change', () => {
                this.updateDetailedCostDisplay();
            });
        }
    }

    validateDetailedInput(input) {
        const value = parseInt(input.value) || 0;
        const max = parseInt(input.getAttribute('max')) || 999;
        const min = parseInt(input.getAttribute('min')) || 0;
        
        // 詳細計算器保持上限檢查
        if (value > max) {
            input.value = max;
            this.showAlert(`數量不能超過上限 ${max}`, 'warning');
        } else if (value < min) {
            input.value = min;
        }
    }

    // 計算商城裝備費用（簡易版）
    calculateCashEquipmentCost() {
        let totalCoins = 0;
        const details = [];

        // 商城T恤
        const shirtCount = parseInt(document.getElementById('cash-shirt')?.value) || 0;
        if (shirtCount > 0) {
            const cost = this.jobChangeCosts.cashEquipment.shirt.cost * shirtCount;
            totalCoins += cost;
            details.push(`商城T恤 x${shirtCount}: ${cost}枚`);
        }

        // 商城肩甲
        const shoulderCount = parseInt(document.getElementById('cash-shoulder')?.value) || 0;
        if (shoulderCount > 0) {
            const cost = this.jobChangeCosts.cashEquipment.shoulder.cost * shoulderCount;
            totalCoins += cost;
            details.push(`商城肩甲 x${shoulderCount}: ${cost}枚`);
        }

        // 商城面甲
        const maskCount = parseInt(document.getElementById('cash-mask')?.value) || 0;
        if (maskCount > 0) {
            const cost = this.jobChangeCosts.cashEquipment.mask.cost * maskCount;
            totalCoins += cost;
            details.push(`商城面甲 x${maskCount}: ${cost}枚`);
        }

        // 更新商城裝備總花費顯示
        this.updateTypeDisplay('cash-cost', totalCoins);

        return { totalCoins, details };
    }

    // 詳細計算器 - 計算詳細裝備費用
    calculateDetailedEquipmentCost() {
        let weaponCost = 0;
        let armorCost = 0;
        let accessoryCost = 0;
        let cashCost = 0;
        const details = { weapon: [], armor: [], accessory: [], cash: [] };

        // 武器類
        const weaponSlots = ['weapon'];
        weaponSlots.forEach(slot => {
            ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
                const count = parseInt(document.getElementById(`detailed-${slot}-${quality}`)?.value) || 0;
                if (count > 0) {
                    const cost = this.jobChangeCosts.detailedEquipment[slot].costs[quality] * count;
                    weaponCost += cost;
                    details.weapon.push(`${this.qualityNames[quality]}${slot === 'weapon' ? '武器' : slot} x${count}: ${cost}枚`);
                }
            });
        });

        // 防具類
        const armorSlots = ['helmet', 'chest', 'arms', 'gloves', 'legs', 'boots', 'belt', 'cloak'];
        const armorNames = {
            helmet: '頭盔',
            chest: '盔甲', 
            arms: '臂甲',
            gloves: '手套',
            legs: '脛甲',
            boots: '鞋子',
            belt: '皮帶',
            cloak: '斗篷'
        };
        
        armorSlots.forEach(slot => {
            ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
                const count = parseInt(document.getElementById(`detailed-${slot}-${quality}`)?.value) || 0;
                if (count > 0) {
                    const cost = this.jobChangeCosts.detailedEquipment[slot].costs[quality] * count;
                    armorCost += cost;
                    details.armor.push(`${this.qualityNames[quality]}${armorNames[slot]} x${count}: ${cost}枚`);
                }
            });
        });

        // 飾品類
        const accessorySlots = ['necklace', 'earring', 'ring', 'rune'];
        const accessoryNames = {
            necklace: '項鍊',
            earring: '耳環',
            ring: '戒指',
            rune: '符石'
        };
        
        accessorySlots.forEach(slot => {
            ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
                const count = parseInt(document.getElementById(`detailed-${slot}-${quality}`)?.value) || 0;
                if (count > 0) {
                    const cost = this.jobChangeCosts.detailedEquipment[slot].costs[quality] * count;
                    accessoryCost += cost;
                    details.accessory.push(`${this.qualityNames[quality]}${accessoryNames[slot]} x${count}: ${cost}枚`);
                }
            });
        });

        // 商城裝備類
        const cashSlots = ['shirt', 'shoulder', 'mask'];
        const cashNames = {
            shirt: 'T恤',
            shoulder: '肩甲',
            mask: '面甲'
        };
        
        cashSlots.forEach(slot => {
            const count = parseInt(document.getElementById(`detailed-cash-${slot}`)?.value) || 0;
            if (count > 0) {
                const cost = this.jobChangeCosts.cashEquipment[slot].cost * count;
                cashCost += cost;
                details.cash.push(`商城${cashNames[slot]} x${count}: ${cost}枚`);
            }
        });

        // 更新各類別顯示
        this.updateTypeDisplay('detailed-weapon-cost', weaponCost);
        this.updateTypeDisplay('detailed-armor-cost', armorCost);
        this.updateTypeDisplay('detailed-accessory-cost', accessoryCost);
        this.updateTypeDisplay('detailed-cash-cost', cashCost);

        const totalCoins = weaponCost + armorCost + accessoryCost + cashCost;
        
        return { 
            totalCoins, 
            weaponCost, 
            armorCost, 
            accessoryCost, 
            cashCost,
            details 
        };
    }

    // 詳細計算器 - 計算技能費用
    calculateDetailedSkillCost() {
        let totalCoins = 0;
        const details = [];

        ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
            const count = parseInt(document.getElementById(`detailed-skill-${quality}`)?.value) || 0;
            if (count > 0) {
                const cost = this.calculateComplexCost(count, this.jobChangeCosts.skills[quality]);
                totalCoins += cost;
                details.push(`${this.qualityNames[quality]}技能 x${count}: ${cost}枚`);
            }
        });

        // 更新技能總花費顯示
        this.updateTypeDisplay('detailed-skill-cost', totalCoins);

        return { totalCoins, details };
    }

    // 詳細計算器 - 計算咒語卡費用
    calculateDetailedSpellCost() {
        let totalCoins = 0;
        const details = [];

        ['rare', 'hero', 'legend', 'mythic'].forEach(quality => {
            const count = parseInt(document.getElementById(`detailed-spell-${quality}`)?.value) || 0;
            if (count > 0) {
                const cost = this.calculateComplexCost(count, this.jobChangeCosts.spells[quality]);
                totalCoins += cost;
                details.push(`${this.qualityNames[quality]}咒語卡 x${count}: ${cost}枚`);
            }
        });

        // 更新咒語卡總花費顯示
        this.updateTypeDisplay('detailed-spell-cost', totalCoins);

        return { totalCoins, details };
    }

    // 詳細計算器 - 更新費用顯示
    updateDetailedCostDisplay() {
        try {
            // 計算各類物品消耗
            const equipmentCost = this.calculateDetailedEquipmentCost();
            const skillCost = this.calculateDetailedSkillCost();
            const spellCost = this.calculateDetailedSpellCost();
            
            let totalCoinCost = equipmentCost.totalCoins + skillCost.totalCoins + spellCost.totalCoins;

            // 檢查禮包減免
            const packageCheckbox = document.getElementById('detailed-coin-package');
            const packageDiscount = packageCheckbox && packageCheckbox.checked ? 300 : 0;
            
            // 應用禮包減免（但不能低於0）
            const finalCoinCost = Math.max(0, totalCoinCost - packageDiscount);

            // 更新即時顯示
            this.updateDetailedLiveCostDisplay(finalCoinCost, packageDiscount, totalCoinCost);
            
            // 更新詳細明細
            this.updateDetailedCostDetails({
                equipment: equipmentCost,
                skills: skillCost,
                spells: spellCost,
                totalCoins: totalCoinCost,
                finalCoins: finalCoinCost,
                packageDiscount: packageDiscount
            });

        } catch (error) {
            console.error('計算詳細轉職花費時發生錯誤:', error);
        }
    }

    updateDetailedLiveCostDisplay(finalCoinCost, packageDiscount, originalCost) {
        // 更新詳細版即時費用顯示
        const liveCoinCost = document.getElementById('detailed-live-coin-cost');
        const liveTotalCost = document.getElementById('detailed-live-total-cost');
        
        if (liveCoinCost) {
            if (packageDiscount > 0 && originalCost > 0) {
                liveCoinCost.innerHTML = `${finalCoinCost}枚 <small style="text-decoration: line-through; opacity: 0.7;">(原${originalCost}枚)</small>`;
            } else {
                liveCoinCost.textContent = `${finalCoinCost}枚`;
            }
        }
        
        if (liveTotalCost) {
            if (finalCoinCost > 0) {
                if (packageDiscount > 0) {
                    liveTotalCost.innerHTML = `2000鑽 + ${finalCoinCost}枚轉職硬幣 <small style="opacity: 0.8;">(已享禮包優惠)</small>`;
                } else {
                    liveTotalCost.textContent = `2000鑽 + ${finalCoinCost}枚轉職硬幣`;
                }
            } else {
                liveTotalCost.textContent = '2000鑽';
            }
        }
    }

    updateDetailedCostDetails(costs) {
        const costDetails = document.getElementById('detailed-cost-details');
        if (!costDetails) return;

        let detailsHTML = '';
        
        // 武器類詳細
        if (costs.equipment.details.weapon.length > 0) {
            detailsHTML += '<h5>⚔️ 武器類轉職硬幣</h5><ul>';
            costs.equipment.details.weapon.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }

        // 防具類詳細
        if (costs.equipment.details.armor.length > 0) {
            detailsHTML += '<h5>🛡️ 防具類轉職硬幣</h5><ul>';
            costs.equipment.details.armor.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }

        // 飾品類詳細
        if (costs.equipment.details.accessory.length > 0) {
            detailsHTML += '<h5>💍 飾品類轉職硬幣</h5><ul>';
            costs.equipment.details.accessory.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }

        // 商城裝備詳細
        if (costs.equipment.details.cash.length > 0) {
            detailsHTML += '<h5>🛍️ 商城裝備轉職硬幣</h5><ul>';
            costs.equipment.details.cash.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }
        
        // 技能詳細
        if (costs.skills.details.length > 0) {
            detailsHTML += '<h5>⚡ 技能轉職硬幣</h5><ul>';
            costs.skills.details.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }
        
        // 咒語卡詳細
        if (costs.spells.details.length > 0) {
            detailsHTML += '<h5>🃏 咒語卡轉職硬幣</h5><ul>';
            costs.spells.details.forEach(detail => {
                detailsHTML += `<li><span>${detail.split(':')[0]}</span><span>${detail.split(':')[1]}</span></li>`;
            });
            detailsHTML += '</ul>';
        }

        // 禮包減免信息
        if (costs.packageDiscount > 0) {
            detailsHTML += '<h5>💎 禮包優惠</h5><ul>';
            detailsHTML += `<li><span>轉職硬幣禮包優惠</span><span>-${costs.packageDiscount}枚</span></li>`;
            detailsHTML += '</ul>';
        }

        // 總計信息
        if (costs.totalCoins > 0) {
            detailsHTML += '<h5>📊 費用總計</h5><ul>';
            detailsHTML += `<li><span>基本轉職費用</span><span>2000鑽</span></li>`;
            if (costs.packageDiscount > 0) {
                detailsHTML += `<li><span>轉職硬幣原價</span><span>${costs.totalCoins}枚</span></li>`;
                detailsHTML += `<li><span>禮包優惠</span><span>-${costs.packageDiscount}枚</span></li>`;
                detailsHTML += `<li style="font-weight: 600; color: #98c379;"><span>轉職硬幣實付</span><span>${costs.finalCoins}枚</span></li>`;
            } else {
                detailsHTML += `<li><span>轉職硬幣費用</span><span>${costs.finalCoins}枚</span></li>`;
            }
            detailsHTML += '</ul>';
        }

        if (detailsHTML === '') {
            detailsHTML = '<p class="no-items">請選擇要轉職的物品</p>';
        }

        costDetails.innerHTML = detailsHTML;
    }
}

// 當頁面載入完成後初始化計算器
document.addEventListener('DOMContentLoaded', () => {
    const jobChangeCalculator = new JobChangeCalculator();
    
    // 確保現有的寵物計算器功能仍然正常運作
    if (typeof window.petCalculator === 'undefined' && typeof initPetCalculator === 'function') {
        initPetCalculator();
    }
}); 