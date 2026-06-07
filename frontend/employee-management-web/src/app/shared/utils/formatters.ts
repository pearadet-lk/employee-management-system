import { EmployeeStatus } from '../../core/models/employee.models';

const labels: Record<EmployeeStatus, string> = {
  [EmployeeStatus.Active]: 'Active',
  [EmployeeStatus.OnLeave]: 'On Leave',
  [EmployeeStatus.Terminated]: 'Terminated'
};

export function employeeStatusLabel(status: EmployeeStatus): string {
  return labels[status] ?? 'Unknown';
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}
