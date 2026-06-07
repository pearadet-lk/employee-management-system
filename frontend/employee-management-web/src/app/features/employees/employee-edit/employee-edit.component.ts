import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { EmployeeApiService } from '../../../core/api/employee-api.service';
import { DepartmentApiService } from '../../../core/api/department-api.service';
import { UpdateEmployeeRequest } from '../../../core/models/employee.models';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-edit',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    PageHeaderComponent,
    LoadingStateComponent,
    EmployeeFormComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Edit Employee" [subtitle]="employeeSubtitle()">
      <a mat-button routerLink="/employees/{{ id() }}">Back to details</a>
    </app-page-header>

    @if (employeeResource.isLoading()) {
      <app-loading-state />
    } @else if (employeeResource.hasValue()) {
      <mat-card>
        <mat-card-content>
          @if (departmentHint()) {
            <p class="hint">{{ departmentHint() }}</p>
          }
          <app-employee-form
            [employee]="employeeResource.value()"
            submitLabel="Update"
            (saved)="update($event)"
          />
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    .hint {
      margin: 0 0 1rem;
      color: rgba(0, 0, 0, 0.6);
    }
  `
})
export class EmployeeEditComponent {
  readonly id = input.required<string>();

  private readonly employeeApi = inject(EmployeeApiService);
  private readonly departmentApi = inject(DepartmentApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly auth = inject(AuthService);

  readonly employeeResource = resource({
    params: () => ({ id: Number(this.id()) }),
    loader: ({ params }) => this.employeeApi.getById(params.id)
  });

  readonly departmentId = linkedSignal({
    source: () => this.employeeResource.value()?.departmentId ?? null,
    computation: (departmentId, previous) => departmentId ?? previous?.value ?? null
  });

  readonly departmentHint = computed(() => {
    const deptId = this.departmentId();
    const departments = this.departmentsCache.value();
    if (!deptId || !departments) {
      return '';
    }
    const dept = departments.find(d => d.id === deptId);
    return dept ? `Assigned department: ${dept.name}` : '';
  });

  readonly employeeSubtitle = computed(() => {
    const employee = this.employeeResource.value();
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  });

  private readonly departmentsCache = resource({
    loader: () => this.departmentApi.getAll()
  });

  async update(request: UpdateEmployeeRequest): Promise<void> {
    if (!this.auth.canWriteEmployees()) {
      return;
    }
    await this.employeeApi.update(Number(this.id()), request);
    this.snackBar.open('Employee updated', 'Close', { duration: 3000 });
    await this.router.navigate(['/employees', this.id()]);
  }
}
