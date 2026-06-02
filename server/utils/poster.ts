import sharp from 'sharp'
import type { ServerConfig } from '~/types'

const BASE_IMAGE_NAME = 'invitations.png'
const BASE_IMAGE_STORAGE = 'assets:server'
const FALLBACK_DIMENSIONS = { width: 1000, height: 800 } as const

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
): string {
  const fontSize = calculateFontSize(teamName.length, config)
  const escapedName = escapeXmlEntities(teamName)
  const safeFontFamily = sanitizeFontFamily(config.imageFontFamily)

  return `
    <svg width="${width}" height="${height}">
      <defs>
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

async function getBaseImageBuffer(): Promise<Buffer> {
  const storage = useStorage(BASE_IMAGE_STORAGE)
  const item = await storage.getItemRaw(BASE_IMAGE_NAME)

  if (item instanceof Buffer) {
    return item
  }

  if (item instanceof Uint8Array) {
    return Buffer.from(item)
  }

  throw new Error(`Base image not found: ${BASE_IMAGE_NAME}`)
}

export async function generatePosterImage(
  teamName: string,
  config: ServerConfig,
): Promise<Buffer> {
  const baseImageBuffer = await getBaseImageBuffer()

  const metadata = await sharp(baseImageBuffer)
    .metadata()
    .catch(() => FALLBACK_DIMENSIONS)

  const width = metadata.width ?? FALLBACK_DIMENSIONS.width
  const height = metadata.height ?? FALLBACK_DIMENSIONS.height
  const svgOverlay = generateSvgOverlay(teamName, width, height, config)

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
