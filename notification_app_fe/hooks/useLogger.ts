'use client';

import { logAction } from '@/app/actions';

export const logger = {
  debug: (pkg: string, msg: string) => logAction('frontend', 'debug', pkg, msg),
  info: (pkg: string, msg: string) => logAction('frontend', 'info', pkg, msg),
  warn: (pkg: string, msg: string) => logAction('frontend', 'warn', pkg, msg),
  error: (pkg: string, msg: string) => logAction('frontend', 'error', pkg, msg),
};
