import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  CreateEmployeeRequest,
  Employee,
  EmployeeQuery,
  PagedResult,
  UpdateEmployeeRequest
} from '../models/employee.models';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly http = inject(HttpClient);
  private readonly tokenStorage = inject(TokenStorageService);

  getEmployees(query: EmployeeQuery): Promise<PagedResult<Employee>> {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return firstValueFrom(
      this.http.get<PagedResult<Employee>>(`${this.tokenStorage.apiUrl}/employees`, { params })
    );
  }

  getById(id: number): Promise<Employee> {
    return firstValueFrom(
      this.http.get<Employee>(`${this.tokenStorage.apiUrl}/employees/${id}`)
    );
  }

  create(request: CreateEmployeeRequest): Promise<Employee> {
    return firstValueFrom(
      this.http.post<Employee>(`${this.tokenStorage.apiUrl}/employees`, request)
    );
  }

  update(id: number, request: UpdateEmployeeRequest): Promise<Employee> {
    return firstValueFrom(
      this.http.put<Employee>(`${this.tokenStorage.apiUrl}/employees/${id}`, request)
    );
  }

  delete(id: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.tokenStorage.apiUrl}/employees/${id}`)
    );
  }
}
