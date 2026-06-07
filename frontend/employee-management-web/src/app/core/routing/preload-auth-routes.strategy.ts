import { Injectable, inject } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class PreloadAuthRoutesStrategy implements PreloadingStrategy {
  private readonly auth = inject(AuthService);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const path = route.path ?? '';
    const shouldPreload =
      this.auth.isAuthenticated() && (path === 'employees' || path === 'departments');

    return shouldPreload ? load() : of(null);
  }
}
