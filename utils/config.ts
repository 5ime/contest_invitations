const ERROR_MESSAGES = {
  NAME_REQUIRED: '请输入团队名称',
  NAME_EMPTY: '团队名称不能为空',
  NAME_TOO_LONG: '团队名称不能超过字符限制',
  GENERATE_FAILED: '生成海报失败',
  INTERNAL_ERROR: '生成邀请函时发生内部服务器错误',
  INVALID_NAME_TYPE: '团队名称是必需的且必须是字符串'
};

const API_CONFIG = {
  CACHE_CONTROL: 'public, max-age=3600',
  CORS_ORIGIN: '*'
};


// 配置辅助函数，用于类型安全的配置访问
export function getAppConfig() {
  const config = useRuntimeConfig();
  
  return {
    // 应用信息
    appName: config.public.appName as string,
    appDescription: config.public.appDescription as string,
    
    // 比赛信息
    contestTitle: config.public.contestTitle as string,
    contestStartTime: config.public.contestStartTime as string,
    contestEndTime: config.public.contestEndTime as string,
    
    // 错误消息
    errorNameRequired: ERROR_MESSAGES.NAME_REQUIRED,
    errorGenerateFailed: ERROR_MESSAGES.GENERATE_FAILED,
  };
}

// 服务端配置（仅在服务端可用）
export function getServerConfig() {
  const config = useRuntimeConfig();
  
  return {
    // 图片配置
    imageMaxNameLength: parseInt(config.imageMaxNameLength as string),
    imageDefaultFontSize: parseInt(config.imageDefaultFontSize as string),
    imageMinFontSize: parseInt(config.imageMinFontSize as string),
    imageFontFamily: config.imageFontFamily as string,
    imageTextColor: config.imageTextColor as string,
    imagePositionYOffset: parseInt(config.imagePositionYOffset as string),
    imageQuality: parseInt(config.imageQuality as string),
    imageCompressionLevel: parseInt(config.imageCompressionLevel as string),
    
    // 阴影配置
    imageShadowDx: config.imageShadowDx as string,
    imageShadowDy: config.imageShadowDy as string,
    imageShadowStdDeviation: config.imageShadowStdDeviation as string,
    imageShadowFloodColor: config.imageShadowFloodColor as string,
    imageShadowFloodOpacity: config.imageShadowFloodOpacity as string,
    
    // API配置
    apiCacheControl: API_CONFIG.CACHE_CONTROL,
    apiCorsOrigin: API_CONFIG.CORS_ORIGIN,
    
    // 错误消息
    errorInvalidNameType: ERROR_MESSAGES.INVALID_NAME_TYPE,
    errorNameEmpty: ERROR_MESSAGES.NAME_EMPTY,
    errorNameTooLong: ERROR_MESSAGES.NAME_TOO_LONG,
    errorInternalError: ERROR_MESSAGES.INTERNAL_ERROR,
  };
} 