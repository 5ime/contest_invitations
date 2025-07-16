// 应用配置类型
export interface AppConfig {
  APP_NAME: string;
  APP_DESCRIPTION: string;
  CONTEST: {
    START_TIME: string;
    END_TIME: string;
    TITLE: string;
  };
  IMAGE: {
    MAX_NAME_LENGTH: number;
    DEFAULT_FONT_SIZE: number;
    MIN_FONT_SIZE: number;
    FONT_FAMILY: string;
    TEXT_COLOR: string;
    POSITION_Y_OFFSET: number;
    OUTPUT_FORMAT: string;
    QUALITY: number;
    COMPRESSION_LEVEL: number;
    SHADOW_CONFIG: {
      DX: number;
      DY: number;
      STD_DEVIATION: number;
      FLOOD_COLOR: string;
      FLOOD_OPACITY: number;
    };
  };
  API: {
    CACHE_CONTROL: string;
    CORS_ORIGIN: string;
  };
  ERRORS: {
    NAME_REQUIRED: string;
    NAME_EMPTY: string;
    NAME_TOO_LONG: string;
    GENERATE_FAILED: string;
    INTERNAL_ERROR: string;
    INVALID_NAME_TYPE: string;
  };
}

// API 相关类型
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  data?: any;
}

// 组件 Props 类型
export interface HeaderSectionProps {
  isLoading: boolean;
}

export interface PosterGeneratorProps {
  posterUrl: string | null;
  isLoading: boolean;
}

// 生成海报相关类型
export interface GeneratePosterRequest {
  name: string;
}

export interface GeneratePosterResponse {
  imageUrl: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

// 工具函数类型
export type DebounceFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

// 事件类型
export interface GenerateEvent {
  teamName: string;
  timestamp: number;
} 