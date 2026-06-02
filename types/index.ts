export interface AppConfig {
  appName: string
  appDescription: string
  contestTitle: string
  contestStartTime: string
  contestEndTime: string
  errorNameRequired: string
  errorGenerateFailed: string
}

export interface ServerConfig {
  imageMaxNameLength: number
  imageDefaultFontSize: number
  imageMinFontSize: number
  imageFontFamily: string
  imageTextColor: string
  imagePositionYOffset: number
  imageQuality: number
  imageCompressionLevel: number
  imageShadowDx: string
  imageShadowDy: string
  imageShadowStdDeviation: string
  imageShadowFloodColor: string
  imageShadowFloodOpacity: string
  apiCacheControl: string
  errorInvalidNameType: string
  errorNameEmpty: string
  errorNameTooLong: string
  errorInternalError: string
  errorTooManyRequests: string
}

export interface GeneratePosterRequest {
  name: string
}

export interface HeaderSectionProps {
  isLoading: boolean
}

export interface PosterGeneratorProps {
  posterUrl: string | null
  teamName: string | null
  isLoading: boolean
}

export type DebounceFunction<T extends (...args: never[]) => unknown> = (
  ...args: Parameters<T>
) => void
