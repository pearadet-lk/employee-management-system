import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly tokenKey = 'ems_token';
  private readonly userKey = 'ems_user';

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getStoredUser<T>(): T | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const raw = localStorage.getItem(this.userKey);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  setStoredUser<T>(user: T): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  get apiUrl(): string {
    return environment.apiUrl;
  }
}
