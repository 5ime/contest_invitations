import { createError, defineEventHandler, readBody, setHeader } from 'h3'
import { getServerConfig } from '~/utils/config'
import { checkRateLimit, getClientIp } from '~/server/utils/rate-limit'
import { generatePosterImage, validateTeamName } from '~/server/utils/poster'
import type { GeneratePosterRequest } from '~/types'

export default defineEventHandler(async (event) => {
  const config = getServerConfig()

  if (!checkRateLimit(getClientIp(event))) {
    throw createError({
      statusCode: 429,
      statusMessage: config.errorTooManyRequests,
    })
  }

  try {
    const body = await readBody<GeneratePosterRequest>(event)
    const validation = validateTeamName(body?.name, config)

    if (!validation.ok) {
      throw createError({
        statusCode: 400,
        statusMessage: validation.statusMessage,
      })
    }

    const processedImage = await generatePosterImage(validation.teamName, config)

    setHeader(event, 'Content-Type', 'image/png')
    setHeader(event, 'Content-Length', processedImage.length)
    setHeader(event, 'Cache-Control', config.apiCacheControl)

    return processedImage
  } catch (error: unknown) {
    console.error('生成邀请函时出错:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: config.errorInternalError,
    })
  }
})
