import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export const tripImageStorage = diskStorage({
  destination: './uploads/trips',
  filename: (req, file, cb) => {
    const ext = extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

export const imageFileFilter = (req: any, file: { mimetype: string; }, cb: (arg0: BadRequestException | null, arg1: boolean) => void) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
    return cb(new BadRequestException('Only image files allowed'), false);
  }
  cb(null, true);
};