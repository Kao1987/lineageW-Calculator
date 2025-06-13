// SEO 和 Meta 標籤管理工具

export interface MetaConfig {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterTitle?: string
  twitterDescription?: string
  canonical?: string
}

/**
 * 設置頁面 Meta 標籤
 */
export function setPageMeta(config: MetaConfig) {
  // 設置頁面標題
  if (config.title) {
    document.title = config.title
  } else {
    document.title = 'LineageW 數據實驗室'
  }

  // 設置或更新 meta 標籤
  updateMetaTag('description', config.description)
  updateMetaTag('keywords', config.keywords)

  // Open Graph 標籤
  updateMetaProperty('og:title', config.ogTitle || config.title)
  updateMetaProperty('og:description', config.ogDescription || config.description)
  updateMetaProperty('og:image', config.ogImage)
  updateMetaProperty('og:site_name', 'LineageW 數據實驗室')
  updateMetaProperty('og:type', 'website')

  // Twitter 標籤
  updateMetaProperty('twitter:card', 'summary')
  updateMetaProperty('twitter:title', config.twitterTitle || config.title)
  updateMetaProperty('twitter:description', config.twitterDescription || config.description)

  // Canonical URL
  if (config.canonical) {
    updateCanonicalLink(config.canonical)
  }
}

/**
 * 更新普通 meta 標籤
 */
function updateMetaTag(name: string, content?: string) {
  if (!content) return

  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta')
    meta.name = name
    document.head.appendChild(meta)
  }
  meta.content = content
}

/**
 * 更新 property meta 標籤
 */
export function updateMetaProperty(property: string, content?: string): void {
  if (content === undefined) return

  let element = document.querySelector(`meta[property="${property}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)

  // 特別處理 og:site_name
  if (property === 'og:site_name') {
    const siteNameElement = document.querySelector('meta[property="og:site_name"]')
    if (siteNameElement) {
      siteNameElement.setAttribute('content', 'LineageW 數據實驗室')
    }
  }
}

/**
 * 更新 canonical 連結
 */
function updateCanonicalLink(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

/**
 * 設置 Favicon
 */
export function setFavicon() {
  // SVG Favicon
  const svgFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement
  if (!svgFavicon) {
    const link = document.createElement('link')
    link.rel = 'icon'
    link.href =
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='16' fill='%2361dafb'/><text x='16' y='22' text-anchor='middle' font-size='18' fill='white'>O</text></svg>"
    document.head.appendChild(link)
  }

  // Apple Touch Icon
  const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement
  if (!appleTouchIcon) {
    const link = document.createElement('link')
    link.rel = 'apple-touch-icon'
    link.setAttribute('sizes', '180x180')
    link.href = '/assets/images/icons/OrionKao.png'
    document.head.appendChild(link)
  }
}

/**
 * 預設的 Meta 配置
 */
export const defaultMeta: MetaConfig = {
  title: 'LineageW 數據實驗室 - 專業遊戲數據分析工具',
  description:
    'LineageW數據實驗室 - 包含寵物屬性評估、轉職花費計算等專業遊戲數據分析工具，助您在天堂W中精確規劃成長路線。',
  keywords: 'LineageW,天堂W,數據實驗室,計算器,寵物屬性,轉職計算,花費估算,Lineage W',
  ogTitle: 'LineageW 數據實驗室',
  ogDescription: '專業的LineageW遊戲數據分析工具',
  twitterTitle: 'LineageW 數據實驗室',
  twitterDescription: '專業的LineageW遊戲數據分析工具',
}

/**
 * 各頁面的 Meta 配置
 */
export const pageMeta = {
  home: {
    ...defaultMeta,
    title: '首頁 - LineageW 數據實驗室',
    canonical: '/',
  },
  petEvaluate: {
    ...defaultMeta,
    title: '寵物評價系統 - LineageW 數據實驗室',
    description: '評估您的天堂W寵物屬性成長潛力，分析寵物品質等級，提供專業的寵物培養建議。',
    ogTitle: '寵物評價系統 - LineageW',
    ogDescription: '評估寵物屬性成長潛力，分析寵物品質等級',
    canonical: '/pet-evaluate',
  },
  jobChange: {
    ...defaultMeta,
    title: '轉職花費計算器 - LineageW 數據實驗室',
    description: '計算天堂W轉職所需的材料和費用，幫助您規劃最經濟的轉職路線，精確估算轉職成本。',
    ogTitle: '轉職花費計算器 - LineageW',
    ogDescription: '計算轉職所需材料和費用，規劃經濟轉職路線',
    canonical: '/job-change',
  },
}
