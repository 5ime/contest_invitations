import { defineEventHandler, readBody } from 'h3';
import sharp from 'sharp';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const name = body.name;

  try {
    const baseImage = 'public/logo.png';
    
    // 使用 sharp 获取图片尺寸
    const metadata = await sharp(baseImage).metadata();

    const width = metadata.width || 1000;  // 如果未能获取宽度，默认值为 1000
    const height = metadata.height || 800; // 如果未能获取高度，默认值为 800

    const fontSize = 100
    const textX = width / 2;  // 文本的 x 位置为图片宽度的一半
    // const textY = height / 2; // 文本的 y 位置为图片高度的一半
    const textY = height / 2 - 250;
    
    const textImage = Buffer.from(
      `<svg width="${width}" height="${height}">
        <text x="${textX}" y="${textY}" font-family="Arial" font-size="${fontSize}" fill="black" dominant-baseline="middle" text-anchor="middle">${name}</text>
      </svg>`
    );

    const image = await sharp(baseImage)
      .composite([{ input: textImage, top: 0, left: 0 }])
      .png()
      .toBuffer();

    event.res.setHeader('Content-Type', 'image/png');
    return new Response(image, { headers: { 'Content-Type': 'image/png' } });
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
});
