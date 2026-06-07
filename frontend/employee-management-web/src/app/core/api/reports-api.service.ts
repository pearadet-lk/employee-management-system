import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  DepartmentReportItem,
  HiringTrendItem,
  SalaryRangeReportItem
} from '../models/report.models';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class ReportsApiService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  getByDepartment(): Promise<DepartmentReportItem[]> {
    return firstValueFrom(
      this.http.get<DepartmentReportItem[]>(`${this.tokenStorage.apiUrl}/reports/by-department`)
    );
  }

  getBySalaryRange(): Promise<SalaryRangeReportItem[]> {
    return firstValueFrom(
      this.http.get<SalaryRangeReportItem[]>(`${this.tokenStorage.apiUrl}/reports/by-salary-range`)
    );
  }

  getHiringTrend(months = 12): Promise<HiringTrendItem[]> {
    const params = new HttpParams().set('months', months);
    return firstValueFrom(
      this.http.get<HiringTrendItem[]>(`${this.tokenStorage.apiUrl}/reports/hiring-trend`, { params })
    );
  }
}
