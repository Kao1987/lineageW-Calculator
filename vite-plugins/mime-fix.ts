import type { Plugin } from 'vite'

export function createMimeFixPlugin(): Plugin {
  return {
    name: 'vite-plugin-mime-fix',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.includes('.ts') && !req.url?.includes('node_modules')) {
          // 確保 TypeScript 檔案以正確的 MIME type 提供
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
          res.setHeader('X-Content-Type-Options', 'nosniff')
        }
        next()
      })
    },
  }
}
