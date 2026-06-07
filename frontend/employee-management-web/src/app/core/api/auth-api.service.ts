import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LoginRequest, LoginResponse, UserProfile } from '../models/auth.models';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  login(request: LoginRequest): Promise<LoginResponse> {
    return firstValueFrom(
      this.http.post<LoginResponse>(`${this.tokenStorage.apiUrl}/auth/login`, request)
    );
  }

  getProfile(): Promise<UserProfile> {
    return firstValueFrom(
      this.http.get<UserProfile>(`${this.tokenStorage.apiUrl}/auth/profile`)
    );
  }
}
