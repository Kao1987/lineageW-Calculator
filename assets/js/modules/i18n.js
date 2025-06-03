// 需要修改
// 多語系核心模組
class I18n {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || this.detectLanguage();
        this.translations = {};
        this.fallbackLanguage = 'zh-TW';
    }

    // 偵測使用者語言
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const supportedLanguages = ['zh-TW', 'en', 'ko'];
        
        // 檢查完全匹配
        if (supportedLanguages.includes(browserLang)) {
            return browserLang;
        }
        
        // 檢查語言代碼匹配
        const langCode = browserLang.split('-')[0];
        const languageMap = {
            'zh': 'zh-TW',
            'en': 'en',
            'ko': 'ko'
        };
        
        return languageMap[langCode] || 'zh-TW';
    }

    // 獲取儲存的語言
    getStoredLanguage() {
        return localStorage.getItem('pet-calculator-language');
    }

    // 儲存語言選擇
    setStoredLanguage(language) {
        localStorage.setItem('pet-calculator-language', language);
    }

    // 載入語言檔案
    async loadLanguage(language) {
        try {
            const module = await import(`./languages/${language}.js`);
            this.translations[language] = module.default || module.translations;
            return true;
        } catch (error) {
            console.warn(`Failed to load language: ${language}`, error);
            return false;
        }
    }

    // 載入所有支援的語言
    async loadAllLanguages() {
        const languages = ['zh-TW', 'en', 'ko'];
        const loadPromises = languages.map(lang => this.loadLanguage(lang));
        await Promise.all(loadPromises);
    }

    // 取得翻譯
    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        // 嘗試取得當前語言的翻譯
        for (const k of keys) {
            translation = translation?.[k];
        }
        
        // 如果找不到，嘗試使用預設語言
        if (!translation && this.currentLanguage !== this.fallbackLanguage) {
            let fallbackTranslation = this.translations[this.fallbackLanguage];
            for (const k of keys) {
                fallbackTranslation = fallbackTranslation?.[k];
            }
            translation = fallbackTranslation;
        }
        
        // 如果還是找不到，返回 key
        if (!translation) {
            console.warn(`Translation not found for key: ${key}`);
            return key;
        }
        
        // 替換參數
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
                return params[param] || match;
            });
        }
        
        return translation;
    }

    // 切換語言
    async changeLanguage(language) {
        if (!this.translations[language]) {
            const loaded = await this.loadLanguage(language);
            if (!loaded) return false;
        }
        
        this.currentLanguage = language;
        this.setStoredLanguage(language);
        this.updatePageContent();
        return true;
    }

    // 更新頁面內容
    updatePageContent() {
        // 更新所有帶有 data-i18n 屬性的元素
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' && element.type !== 'button') {
                element.placeholder = translation;
            } else {
                // 檢查元素是否有子節點需要保留
                const childElements = element.querySelectorAll('*');
                if (childElements.length === 0) {
                    // 沒有子元素，直接設置文字內容
                    element.textContent = translation;
                } else {
                    // 有子元素，只更新直接的文字節點
                    this.updateTextNodeOnly(element, translation);
                }
            }
        });

        // 更新帶有 data-i18n-html 屬性的元素 (允許 HTML)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });

        // 更新帶有 data-i18n-attr 屬性的元素
        document.querySelectorAll('[data-i18n-attr]').forEach(element => {
            const attrData = element.getAttribute('data-i18n-attr');
            const [attr, key] = attrData.split(':');
            element.setAttribute(attr, this.t(key));
        });

        // 觸發語言變更事件
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    // 只更新文字節點，保留子元素
    updateTextNodeOnly(element, translation) {
        // 找到第一個文字節點並更新
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                node.textContent = translation;
                return;
            }
        }
        
        // 如果沒有找到文字節點，在開頭插入一個
        const textNode = document.createTextNode(translation);
        element.insertBefore(textNode, element.firstChild);
    }

    // 取得當前語言
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // 取得支援的語言列表
    getSupportedLanguages() {
        return [
            { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文' },
            { code: 'en', name: 'English', nativeName: 'English' },
            { code: 'ko', name: 'Korean', nativeName: '한국어' }
        ];
    }
}

// 建立全域實例
window.i18n = new I18n();

export default window.i18n; 