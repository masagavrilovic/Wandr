import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError } from 'rxjs';
import { unlink } from 'fs/promises';

@Injectable()
export class CleanupUploadOnErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      catchError(async (err) => {
        if (req.file?.path) await unlink(req.file.path).catch(() => undefined);
        throw err;
      }),
    );
  }
}