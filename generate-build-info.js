import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const buildInfo = {
  lastUpdated: new Date().toISOString(),
}

// Ensure the 'public' directory exists.
const publicDir = resolve(__dirname, 'public')
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true })
}

const filePath = resolve(publicDir, 'build-info.json')

writeFileSync(filePath, JSON.stringify(buildInfo, null, 2))

console.log(`Build info generated successfully at ${filePath}`)
