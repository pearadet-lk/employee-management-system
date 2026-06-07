import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  if (auth.isAuthenticated()) {
    return true;
  }

  logger.warn('Navigation blocked: user not authenticated');
  return router.createUrlTree(['/auth/login']);
};
