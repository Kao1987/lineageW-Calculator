import { Plugin } from 'vite'

export function createCspPlugin(mode: string): Plugin {
  return {
    name: 'vite-plugin-csp',
    transformIndexHtml(html) {
      const isDev = mode === 'development'

      const cspContent = [
        "default-src 'self'",
        `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://www.googletagmanager.com`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://www.google-analytics.com",
        "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com",
        "object-src 'none'",
        "frame-src 'none'",
        "base-uri 'self'",
      ].join('; ')

      const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="${cspContent}">`

      // 找到 <head> 標籤並插入 CSP
      return html.replace('</head>', `${cspMetaTag}\n</head>`)
    },
  }
}
