import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { BadRequestException } from '@nestjs/common';

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export const tripImageStorage = diskStorage({
  destination: './uploads/trips',
  filename: (req, file, cb) => {
    cb(null, `${randomUUID()}${ALLOWED_MIME[file.mimetype]}`);
  },
});

export const imageFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb:(error: Error | null, acceptFile: boolean) => void,
) => {
  if (!ALLOWED_MIME[file.mimetype]) {
    return cb(new BadRequestException('Only JPEG, PNG and WebP images are allowed'), false);
  }
  cb(null, true);
};

export async function deleteImage(imageUrl?: string | null) {
  if (!imageUrl) return;
  await unlink(join(process.cwd(), imageUrl)).catch(() => undefined);
}