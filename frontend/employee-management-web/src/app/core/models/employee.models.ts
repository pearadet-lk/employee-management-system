export enum EmployeeStatus {
  Active = 0,
  OnLeave = 1,
  Terminated = 2
}

export interface Employee {
  id: number;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  departmentName: string;
  salary: number;
  hireDate: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeQuery {
  search?: string;
  departmentId?: number;
  status?: EmployeeStatus;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateEmployeeRequest {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  salary: number;
  hireDate: string;
  status: EmployeeStatus;
}

export type UpdateEmployeeRequest = CreateEmployeeRequest;
