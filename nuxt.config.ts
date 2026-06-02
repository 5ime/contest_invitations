export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],
  nitro: {
    preset: 'vercel',
  },
  app: {
    head: {
      title: `${process.env.APP_NAME || 'MoeCTF 2024'} - Contest Invitation Generator`,
      meta: [
        { name: 'description', content: process.env.APP_DESCRIPTION || 'Generate custom invitation posters for MoeCTF 2024' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  runtimeConfig: {
    // 服务端配置
    imageMaxNameLength: process.env.IMAGE_MAX_NAME_LENGTH || '50',
    imageDefaultFontSize: process.env.IMAGE_DEFAULT_FONT_SIZE || '100',
    imageMinFontSize: process.env.IMAGE_MIN_FONT_SIZE || '24',
    imageFontFamily: process.env.IMAGE_FONT_FAMILY || 'Arial, sans-serif',
    imageTextColor: process.env.IMAGE_TEXT_COLOR || 'white',
    imagePositionYOffset: process.env.IMAGE_POSITION_Y_OFFSET || '25',
    imageQuality: process.env.IMAGE_QUALITY || '90',
    imageCompressionLevel: process.env.IMAGE_COMPRESSION_LEVEL || '6',
    imageShadowDx: process.env.IMAGE_SHADOW_DX || '2',
    imageShadowDy: process.env.IMAGE_SHADOW_DY || '2',
    imageShadowStdDeviation: process.env.IMAGE_SHADOW_STD_DEVIATION || '3',
    imageShadowFloodColor: process.env.IMAGE_SHADOW_FLOOD_COLOR || '#000',
    imageShadowFloodOpacity: process.env.IMAGE_SHADOW_FLOOD_OPACITY || '0.3',
    
    // 客户端配置
    public: {
      apiBase: '/api',
      appName: process.env.APP_NAME || 'MoeCTF 2024',
      appDescription: process.env.APP_DESCRIPTION || 'Generate custom invitation posters for MoeCTF 2024',
      contestStartTime: process.env.CONTEST_START_TIME || '2024/01/01 00:00(UTC+8)',
      contestEndTime: process.env.CONTEST_END_TIME || '2024/01/03 22:00(UTC+8)',
      contestTitle: process.env.CONTEST_TITLE || 'MoeCTF 2024'
    }
  }
})