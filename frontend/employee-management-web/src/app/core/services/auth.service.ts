import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, UserProfile } from '../models/auth.models';
import { AuthApiService } from '../api/auth-api.service';
import { TokenStorageService } from './token-storage.service';
import { LoggerService } from './logger.service';
import { ROLES, UserRole } from '../constants/roles';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentUser = signal<UserProfile | null>(this.readStoredUser());
  readonly token = signal<string | null>(this.readStoredToken());

  isAuthenticated(): boolean {
    return !!this.token();
  }

  hasRole(...roles: UserRole[]): boolean {
    const user = this.currentUser();
    return !!user && roles.includes(user.role);
  }

  canWriteEmployees(): boolean {
    return this.hasRole(ROLES.Admin, ROLES.HR);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await this.authApi.login(request);
    this.tokenStorage.setToken(response.token);
    this.tokenStorage.setStoredUser(response.user);
    this.token.set(response.token);
    this.currentUser.set(response.user);
    this.logger.info('User logged in', response.user.username);
    return response;
  }

  logout(): void {
    this.tokenStorage.clearToken();
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  async loadProfile(): Promise<UserProfile | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const profile = await this.authApi.getProfile();
      this.currentUser.set(profile);
      this.tokenStorage.setStoredUser(profile);
      return profile;
    } catch (error) {
      this.logger.error('Failed to load profile', error);
      this.logout();
      return null;
    }
  }

  private readStoredUser(): UserProfile | null {
    return isPlatformBrowser(this.platformId) ? this.tokenStorage.getStoredUser<UserProfile>() : null;
  }

  private readStoredToken(): string | null {
    return isPlatformBrowser(this.platformId) ? this.tokenStorage.getToken() : null;
  }
}
