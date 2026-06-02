import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import opentype from 'opentype.js'

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
      'noto-sans-sc-chinese-simplified-400-normal.woff',
    ),
    target: join(assetsDir, 'NotoSansSC.woff'),
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

const fontPath = join(assetsDir, 'NotoSansSC.woff')
const fontBuffer = readFileSync(fontPath)
const font = opentype.parse(
  fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength),
)

for (const sample of ['123', '测试', 'ABC']) {
  for (const char of sample) {
    const glyph = font.charToGlyph(char)
    if (!glyph.path?.commands?.length) {
      console.error(`[sync-server-assets] Font missing glyph for "${char}"`)
      process.exit(1)
    }
  }
}

console.log('[sync-server-assets] Font glyph check passed')
