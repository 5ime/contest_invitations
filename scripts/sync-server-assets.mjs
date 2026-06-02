import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const assetsDir = join(rootDir, 'server', 'assets')

const assets = [
  {
    label: 'base image',
    source: join(rootDir, 'public', 'invitations.png'),
    target: join(assetsDir, 'invitations.png'),
  },
  {
    label: 'poster font',
    source: join(
      rootDir,
      'node_modules',
      '@fontsource',
      'noto-sans-sc',
      'files',
      'noto-sans-sc-chinese-simplified-400-normal.woff2',
    ),
    target: join(assetsDir, 'NotoSansSC.woff2'),
  },
]

mkdirSync(assetsDir, { recursive: true })

for (const { label, source, target } of assets) {
  if (!existsSync(source)) {
    console.error(`[sync-server-assets] Missing ${label}: ${source}`)
    process.exit(1)
  }

  copyFileSync(source, target)
  console.log(`[sync-server-assets] Copied ${source} -> ${target}`)
}
