import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const source = join(rootDir, 'public', 'invitations.png')
const target = join(rootDir, 'server', 'assets', 'invitations.png')

if (!existsSync(source)) {
  console.error('[sync-base-image] Missing source file: public/invitations.png')
  process.exit(1)
}

mkdirSync(dirname(target), { recursive: true })
copyFileSync(source, target)
console.log('[sync-base-image] Copied public/invitations.png -> server/assets/invitations.png')
