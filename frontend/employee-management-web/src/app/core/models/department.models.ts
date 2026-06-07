import { Employee } from './employee.models';

export interface Department {
  id: number;
  name: string;
  description?: string;
  employeeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentDetail extends Omit<Department, 'employeeCount'> {
  employees: Employee[];
}
