import { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

export function createApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-local-api',
    configureServer(server) {
      server.middlewares.use('/api/update-announcements', (req, res, next) => {
        if (req.method !== 'POST') {
          return next()
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk.toString()
        })

        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const filePath = path.resolve(process.cwd(), 'public/announcements.json')
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2))

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: '儲存成功！' }))
          } catch (error) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: '儲存失敗', error: (error as Error).message }))
          }
        })
      })
    },
  }
}
