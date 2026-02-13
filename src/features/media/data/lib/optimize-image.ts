import sharp from 'sharp';

const SMALL_IMAGE_SIZE = 128;

export async function optimizePostImage(inputBuffer: Buffer): Promise<{
  small: Buffer;
  medium: Buffer;
  original: Buffer;
}> {
  const normalized = sharp(inputBuffer).rotate();

  const baseOptions = {
    quality: 80,
    effort: 4,
  };

  const [small, medium, original] = await Promise.all([
    normalized
      .clone()
      .resize(800, null, { withoutEnlargement: true })
      .webp(baseOptions)
      .toBuffer(),
    normalized
      .clone()
      .resize(1200, null, { withoutEnlargement: true })
      .webp(baseOptions)
      .toBuffer(),
    normalized.clone().webp(baseOptions).toBuffer(),
  ]);

  return { small, medium, original };
}

export async function optimizeProfileImage(inputBuffer: Buffer) {
  return await sharp(inputBuffer)
    .rotate()
    .resize(SMALL_IMAGE_SIZE, SMALL_IMAGE_SIZE, {
      fit: 'cover',
    })
    .webp({ quality: 80 })
    .toBuffer();
}
