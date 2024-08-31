import { defineEventHandler, readBody } from 'h3';
import sharp from 'sharp';

export default defineEventHandler(async (event) => {
  try {
    const { name } = await readBody(event);
    const baseImage = '/public/invitations.png';

    const { width = 1000, height = 800 } = await sharp(baseImage).metadata();

    const svgText = `
      <svg width="${width}" height="${height}">
        <text x="50%" y="${height / 2 + 25}" font-family="Myriad Pro" font-size="100" fill="white" dominant-baseline="middle" text-anchor="middle">
          ${name}
        </text>
      </svg>`;

    const textImage = Buffer.from(svgText);

    const image = await sharp(baseImage)
      .composite([{ input: textImage }])
      .png()
      .toBuffer();

    event.res.setHeader('Content-Type', 'image/png');
    return new Response(image, { headers: { 'Content-Type': 'image/png' } });
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
});
