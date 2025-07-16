import { defineEventHandler, readBody, createError, setHeader } from 'h3';
import sharp from 'sharp';
import { join } from 'path';
import { getServerConfig } from '~/utils/config';

interface RequestBody {
  name: string;
}

// 字符实体转义
const escapeXmlEntities = (text: string): string => {
  const entities: Record<string, string> = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return text.replace(/[<>&"']/g, (char) => entities[char] || char);
};

// 计算字体大小
const calculateFontSize = (textLength: number, config: ReturnType<typeof getServerConfig>): number => {
  const ratio = Math.min(1, 30 / textLength);
  return Math.max(
    config.imageMinFontSize,
    Math.floor(config.imageDefaultFontSize * ratio)
  );
};

// 生成SVG覆盖层
const generateSvgOverlay = (teamName: string, width: number, height: number, config: ReturnType<typeof getServerConfig>): string => {
  const fontSize = calculateFontSize(teamName.length, config);
  const escapedName = escapeXmlEntities(teamName);
  
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
        font-family="${config.imageFontFamily}" 
        font-size="${fontSize}" 
        fill="${config.imageTextColor}" 
        dominant-baseline="middle" 
        text-anchor="middle"
        filter="url(#shadow)"
      >
        ${escapedName}
      </text>
    </svg>`;
};

export default defineEventHandler(async (event) => {
  const config = getServerConfig();
  
  try {
    // 输入验证
    const body = await readBody(event) as RequestBody;
    const { name } = body;

    if (!name || typeof name !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: config.errorInvalidNameType
      });
    }

    const teamName = name.trim();
    
    if (teamName.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: config.errorNameEmpty
      });
    }

    if (teamName.length > config.imageMaxNameLength) {
      throw createError({
        statusCode: 400,
        statusMessage: config.errorNameTooLong
      });
    }

    // 基础图片路径
    const baseImagePath = join(process.cwd(), 'public', 'invitations.png');
    
    // 获取图片元数据
    const { width = 1000, height = 800 } = await sharp(baseImagePath)
      .metadata()
      .catch(() => ({ width: 1000, height: 800 }));

    // 生成SVG覆盖层
    const svgOverlay = generateSvgOverlay(teamName, width, height, config);
    const textBuffer = Buffer.from(svgOverlay);

    // 生成最终图片
    const processedImage = await sharp(baseImagePath)
      .composite([{ input: textBuffer, blend: 'over' }])
      .png({ 
        quality: config.imageQuality,
        compressionLevel: config.imageCompressionLevel,
        progressive: true
      })
      .toBuffer();

    // 设置适当的头部信息
    setHeader(event, 'Content-Type', 'image/png');
    setHeader(event, 'Content-Length', processedImage.length);
    setHeader(event, 'Cache-Control', config.apiCacheControl);
    setHeader(event, 'Access-Control-Allow-Origin', config.apiCorsOrigin);
    
    return processedImage;

  } catch (error: any) {
    console.error('生成邀请函时出错:', error);
    
    // 返回适当的错误响应
    if (error?.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: config.errorInternalError
    });
  }
}); 