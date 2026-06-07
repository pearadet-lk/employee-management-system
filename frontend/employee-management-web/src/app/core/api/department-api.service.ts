import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Department, DepartmentDetail } from '../models/department.models';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class DepartmentApiService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  getAll(): Promise<Department[]> {
    return firstValueFrom(
      this.http.get<Department[]>(`${this.tokenStorage.apiUrl}/departments`)
    );
  }

  getById(id: number): Promise<DepartmentDetail> {
    return firstValueFrom(
      this.http.get<DepartmentDetail>(`${this.tokenStorage.apiUrl}/departments/${id}`)
    );
  }
}
