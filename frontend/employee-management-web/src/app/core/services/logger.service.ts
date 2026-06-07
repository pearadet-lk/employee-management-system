import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  error(message: string, context?: unknown): void {
    console.error(`[EMS] ${message}`, context ?? '');
  }

  warn(message: string, context?: unknown): void {
    console.warn(`[EMS] ${message}`, context ?? '');
  }

  info(message: string, context?: unknown): void {
    console.info(`[EMS] ${message}`, context ?? '');
  }
}
