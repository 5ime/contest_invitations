import sharp from 'sharp'
import type { ServerConfig } from '~/types'

const BASE_IMAGE_NAME = 'invitations.png'
const FONT_FILE_NAME = 'NotoSansSC.woff2'
const ASSETS_STORAGE = 'assets:server'
const FALLBACK_DIMENSIONS = { width: 1000, height: 800 } as const

let cachedFontDataUri: string | null = null

function escapeXmlEntities(text: string): string {
  return text.replace(/[<>&"']/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[char] ?? char
  })
}

function sanitizeFontFamily(fontFamily: string): string {
  return fontFamily.replace(/[<>"']/g, '')
}

function calculateFontSize(textLength: number, config: ServerConfig): number {
  const ratio = Math.min(1, 30 / textLength)
  return Math.max(
    config.imageMinFontSize,
    Math.floor(config.imageDefaultFontSize * ratio),
  )
}

function generateSvgOverlay(
  teamName: string,
  width: number,
  height: number,
  config: ServerConfig,
  fontDataUri: string,
): string {
  const fontSize = calculateFontSize(teamName.length, config)
  const escapedName = escapeXmlEntities(teamName)
  const safeFontFamily = sanitizeFontFamily(config.imageFontFamily)

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style><![CDATA[
          @font-face {
            font-family: '${safeFontFamily}';
            src: url('${fontDataUri}') format('woff2');
          }
        ]]></style>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="${config.imageShadowDx}"
            dy="${config.imageShadowDy}"
            stdDeviation="${config.imageShadowStdDeviation}"
            flood-color="${config.imageShadowFloodColor}"
            flood-opacity="${config.imageShadowFloodOpacity}"
          />
        </filter>
      </defs>
      <text
        x="50%"
        y="${height / 2 + config.imagePositionYOffset}"
        font-family="${safeFontFamily}"
        font-size="${fontSize}"
        fill="${config.imageTextColor}"
        dominant-baseline="middle"
        text-anchor="middle"
        filter="url(#shadow)"
      >
        ${escapedName}
      </text>
    </svg>`
}

async function getAssetBuffer(fileName: string): Promise<Buffer> {
  const storage = useStorage(ASSETS_STORAGE)
  const item = await storage.getItemRaw(fileName)

  if (item instanceof Buffer) {
    return item
  }

  if (item instanceof Uint8Array) {
    return Buffer.from(item)
  }

  throw new Error(`Asset not found: ${fileName}`)
}

async function getFontDataUri(): Promise<string> {
  if (cachedFontDataUri) {
    return cachedFontDataUri
  }

  const fontBuffer = await getAssetBuffer(FONT_FILE_NAME)
  cachedFontDataUri = `data:font/woff2;base64,${fontBuffer.toString('base64')}`
  return cachedFontDataUri
}

export async function generatePosterImage(
  teamName: string,
  config: ServerConfig,
): Promise<Buffer> {
  const [baseImageBuffer, fontDataUri] = await Promise.all([
    getAssetBuffer(BASE_IMAGE_NAME),
    getFontDataUri(),
  ])

  const metadata = await sharp(baseImageBuffer)
    .metadata()
    .catch(() => FALLBACK_DIMENSIONS)

  const width = metadata.width ?? FALLBACK_DIMENSIONS.width
  const height = metadata.height ?? FALLBACK_DIMENSIONS.height
  const svgOverlay = generateSvgOverlay(teamName, width, height, config, fontDataUri)

  return sharp(baseImageBuffer)
    .composite([{ input: Buffer.from(svgOverlay), blend: 'over' }])
    .png({
      quality: config.imageQuality,
      compressionLevel: config.imageCompressionLevel,
      progressive: true,
    })
    .toBuffer()
}

export function validateTeamName(
  name: unknown,
  config: ServerConfig,
): { ok: true, teamName: string } | { ok: false, statusMessage: string } {
  if (!name || typeof name !== 'string') {
    return { ok: false, statusMessage: config.errorInvalidNameType }
  }

  const teamName = name.trim()

  if (teamName.length === 0) {
    return { ok: false, statusMessage: config.errorNameEmpty }
  }

  if (teamName.length > config.imageMaxNameLength) {
    return { ok: false, statusMessage: config.errorNameTooLong }
  }

  return { ok: true, teamName }
}
