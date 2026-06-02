declare module 'nuxt/schema' {
  interface RuntimeConfig {
    imageMaxNameLength: string
    imageDefaultFontSize: string
    imageMinFontSize: string
    imageFontFamily: string
    imageTextColor: string
    imagePositionYOffset: string
    imageQuality: string
    imageCompressionLevel: string
    imageShadowDx: string
    imageShadowDy: string
    imageShadowStdDeviation: string
    imageShadowFloodColor: string
    imageShadowFloodOpacity: string
  }

  interface PublicRuntimeConfig {
    apiBase: string
    appName: string
    appDescription: string
    contestStartTime: string
    contestEndTime: string
    contestTitle: string
  }
}

export {}
