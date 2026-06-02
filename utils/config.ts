import type { AppConfig, ServerConfig } from '~/types'

const ERROR_MESSAGES = {
  NAME_REQUIRED: '请输入团队名称',
  NAME_EMPTY: '团队名称不能为空',
  NAME_TOO_LONG: '团队名称不能超过字符限制',
  GENERATE_FAILED: '生成海报失败',
  INTERNAL_ERROR: '生成邀请函时发生内部服务器错误',
  INVALID_NAME_TYPE: '团队名称是必需的且必须是字符串',
  TOO_MANY_REQUESTS: '请求过于频繁，请稍后再试',
} as const

const API_CONFIG = {
  CACHE_CONTROL: 'no-store',
} as const

function parseEnvInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function getAppConfig(): AppConfig {
  const config = useRuntimeConfig()

  return {
    appName: config.public.appName,
    appDescription: config.public.appDescription,
    contestTitle: config.public.contestTitle,
    contestStartTime: config.public.contestStartTime,
    contestEndTime: config.public.contestEndTime,
    errorNameRequired: ERROR_MESSAGES.NAME_REQUIRED,
    errorGenerateFailed: ERROR_MESSAGES.GENERATE_FAILED,
  }
}

export function getServerConfig(): ServerConfig {
  const config = useRuntimeConfig()

  return {
    imageMaxNameLength: parseEnvInt(config.imageMaxNameLength, 50),
    imageDefaultFontSize: parseEnvInt(config.imageDefaultFontSize, 100),
    imageMinFontSize: parseEnvInt(config.imageMinFontSize, 24),
    imageFontFamily: config.imageFontFamily,
    imageTextColor: config.imageTextColor,
    imagePositionYOffset: parseEnvInt(config.imagePositionYOffset, 25),
    imageQuality: parseEnvInt(config.imageQuality, 90),
    imageCompressionLevel: parseEnvInt(config.imageCompressionLevel, 6),
    imageShadowDx: config.imageShadowDx,
    imageShadowDy: config.imageShadowDy,
    imageShadowStdDeviation: config.imageShadowStdDeviation,
    imageShadowFloodColor: config.imageShadowFloodColor,
    imageShadowFloodOpacity: config.imageShadowFloodOpacity,
    apiCacheControl: API_CONFIG.CACHE_CONTROL,
    errorInvalidNameType: ERROR_MESSAGES.INVALID_NAME_TYPE,
    errorNameEmpty: ERROR_MESSAGES.NAME_EMPTY,
    errorNameTooLong: ERROR_MESSAGES.NAME_TOO_LONG,
    errorInternalError: ERROR_MESSAGES.INTERNAL_ERROR,
    errorTooManyRequests: ERROR_MESSAGES.TOO_MANY_REQUESTS,
  }
}
