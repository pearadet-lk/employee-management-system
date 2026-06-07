import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  resource,
  signal
} from '@angular/core';
import { form, FormField, FormRoot, required, submit } from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentApiService } from '../../../core/api/department-api.service';
import {
  CreateEmployeeRequest,
  Employee,
  EmployeeStatus
} from '../../../core/models/employee.models';

@Component({
  selector: 'app-employee-form',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, FormField, FormRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formRoot]="employeeForm" (submit)="onSubmit($event)">
      <div class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Code</mat-label>
          <input matInput [formField]="employeeForm.code" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput [formField]="employeeForm.firstName" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last Name</mat-label>
          <input matInput [formField]="employeeForm.lastName" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" [formField]="employeeForm.email" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <mat-select [formField]="employeeForm.departmentId">
            @if (departments.hasValue()) {
              @for (dept of departments.value(); track dept.id) {
                <mat-option [value]="dept.id">{{ dept.name }}</mat-option>
              }
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Salary</mat-label>
          <input matInput type="number" [formField]="employeeForm.salary" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Hire Date</mat-label>
          <input matInput type="date" [formField]="employeeForm.hireDate" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [formField]="employeeForm.status">
            <mat-option [value]="statuses.Active">Active</mat-option>
            <mat-option [value]="statuses.OnLeave">On Leave</mat-option>
            <mat-option [value]="statuses.Terminated">Terminated</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <button mat-flat-button color="primary" type="submit">{{ submitLabel() }}</button>
    </form>
  `,
  styles: `
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }
  `
})
export class EmployeeFormComponent {
  private readonly departmentApi = inject(DepartmentApiService);

  readonly employee = input<Employee | null>(null);
  readonly submitLabel = input('Save');
  readonly saved = output<CreateEmployeeRequest>();

  readonly statuses = EmployeeStatus;

  readonly departments = resource({
    loader: () => this.departmentApi.getAll()
  });

  readonly employeeModel = signal<CreateEmployeeRequest>({
    code: '',
    firstName: '',
    lastName: '',
    email: '',
    departmentId: 0,
    salary: 0,
    hireDate: new Date().toISOString().slice(0, 10),
    status: EmployeeStatus.Active
  });

  readonly employeeForm = form(this.employeeModel, fields => {
    required(fields.code);
    required(fields.firstName);
    required(fields.lastName);
    required(fields.email);
    required(fields.departmentId);
    required(fields.salary);
    required(fields.hireDate);
    required(fields.status);
  });

  constructor() {
    effect(() => {
      const employee = this.employee();
      if (!employee) {
        return;
      }

      this.employeeModel.set({
        code: employee.code,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        departmentId: employee.departmentId,
        salary: employee.salary,
        hireDate: employee.hireDate,
        status: employee.status
      });
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.employeeForm, async () => {
      this.saved.emit({ ...this.employeeModel() });
    });
  }
}
