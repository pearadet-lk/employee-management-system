import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DashboardStats } from '../models/dashboard.models';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  getStats(): Promise<DashboardStats> {
    return firstValueFrom(
      this.http.get<DashboardStats>(`${this.tokenStorage.apiUrl}/dashboard/stats`)
    );
  }
}
