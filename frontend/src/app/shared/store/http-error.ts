import { HttpErrorResponse } from '@angular/common/http';

export function extractErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Server unavailable';

    const message: unknown = error.error?.message;
    if (Array.isArray(message)) {
      const parts = message.filter((m): m is string => typeof m === 'string');
      if (parts.length > 0) return parts.join(', ');
    } else if (typeof message === 'string' && message.length > 0) {
      return message;
    }
    return error.message;
  }

  if (error instanceof Error) return error.message;
  return 'Unknown error';
}

export function isNotFound(error: unknown): boolean {
  return error instanceof HttpErrorResponse && error.status === 404;
}