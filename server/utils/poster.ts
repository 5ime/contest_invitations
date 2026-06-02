import opentype from 'opentype.js'
import sharp from 'sharp'
import type { ServerConfig } from '~/types'

const BASE_IMAGE_NAME = 'invitations.png'
const FONT_FILE_NAME = 'NotoSansSC.woff'
const ASSETS_STORAGE = 'assets:server'
const BASE64_PREFIX = '\0base64:'
const FALLBACK_DIMENSIONS = { width: 1000, height: 800 } as const

let cachedFont: opentype.Font | null = null

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
  font: opentype.Font,
): string {
  const fontSize = calculateFontSize(teamName.length, config)
  const probe = font.getPath(teamName, 0, 0, fontSize)
  const bbox = probe.getBoundingBox()
  const textWidth = bbox.x2 - bbox.x1
  const centerY = height / 2 + config.imagePositionYOffset
  const x = (width - textWidth) / 2 - bbox.x1
  const y = centerY - (bbox.y1 + bbox.y2) / 2
  const pathData = font.getPath(teamName, x, y, fontSize).toPathData(2)

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
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
      <path
        d="${pathData}"
        fill="${config.imageTextColor}"
        filter="url(#shadow)"
      />
    </svg>`
}

function isByteRecord(value: unknown): value is Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  const keys = Object.keys(value)
  return keys.length > 0 && keys.every(key => /^\d+$/.test(key))
}

function normalizeAssetBuffer(data: unknown, fileName: string): Buffer {
  if (data == null) {
    throw new Error(`Asset not found: ${fileName}`)
  }

  if (Buffer.isBuffer(data)) {
    return data
  }

  if (data instanceof Uint8Array) {
    return Buffer.from(data)
  }

  if (data instanceof ArrayBuffer) {
    return Buffer.from(data)
  }

  if (typeof data === 'string') {
    if (data.startsWith(BASE64_PREFIX)) {
      return Buffer.from(data.slice(BASE64_PREFIX.length), 'base64')
    }

    return Buffer.from(data, 'latin1')
  }

  if (isByteRecord(data)) {
    const length = Math.max(...Object.keys(data).map(key => Number.parseInt(key, 10))) + 1
    const bytes = new Uint8Array(length)

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'number') {
        bytes[Number.parseInt(key, 10)] = value
      }
    }

    return Buffer.from(bytes)
  }

  throw new Error(`Unsupported asset data for ${fileName}`)
}

function assertFontBuffer(buffer: Buffer): void {
  if (buffer.length < 4) {
    throw new Error('Font asset is empty')
  }

  const magic = buffer.subarray(0, 4).toString('ascii')
  const validMagic = magic === 'wOFF' || magic === 'wOF2' || magic === 'OTTO'
    || (buffer[0] === 0x00 && buffer[1] === 0x01 && buffer[2] === 0x00 && buffer[3] === 0x00)

  if (!validMagic) {
    throw new Error(`Invalid font asset (magic: ${buffer.subarray(0, 4).toString('hex')})`)
  }
}

async function getAssetBuffer(fileName: string): Promise<Buffer> {
  const storage = useStorage(ASSETS_STORAGE)
  let item = await storage.getItemRaw(fileName)

  if (item == null) {
    item = await storage.getItem(fileName)
  }

  return normalizeAssetBuffer(item, fileName)
}

async function getFont(): Promise<opentype.Font> {
  if (cachedFont) {
    return cachedFont
  }

  const fontBuffer = await getAssetBuffer(FONT_FILE_NAME)
  assertFontBuffer(fontBuffer)
  cachedFont = opentype.parse(toArrayBuffer(fontBuffer))
  return cachedFont
}

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer
}

export async function generatePosterImage(
  teamName: string,
  config: ServerConfig,
): Promise<Buffer> {
  const [baseImageBuffer, font] = await Promise.all([
    getAssetBuffer(BASE_IMAGE_NAME),
    getFont(),
  ])

  const metadata = await sharp(baseImageBuffer)
    .metadata()
    .catch(() => FALLBACK_DIMENSIONS)

  const width = metadata.width ?? FALLBACK_DIMENSIONS.width
  const height = metadata.height ?? FALLBACK_DIMENSIONS.height
  const svgOverlay = generateSvgOverlay(teamName, width, height, config, font)

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
