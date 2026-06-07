import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { EmployeeApiService } from '../../../core/api/employee-api.service';
import { CreateEmployeeRequest } from '../../../core/models/employee.models';

@Component({
  selector: 'app-employee-create',
  imports: [MatCardModule, MatSnackBarModule, PageHeaderComponent, EmployeeFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="New Employee" subtitle="Create a new employee record" />
    <mat-card>
      <mat-card-content>
        <app-employee-form submitLabel="Create" (saved)="create($event)" />
      </mat-card-content>
    </mat-card>
  `
})
export class EmployeeCreateComponent {
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  async create(request: CreateEmployeeRequest): Promise<void> {
    const employee = await this.employeeApi.create(request);
    this.snackBar.open('Employee created', 'Close', { duration: 3000 });
    await this.router.navigate(['/employees', employee.id]);
  }
}
