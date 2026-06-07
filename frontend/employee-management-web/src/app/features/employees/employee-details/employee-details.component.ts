import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmployeeApiService } from '../../../core/api/employee-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { employeeStatusLabel, formatCurrency } from '../../../shared/utils/formatters';

@Component({
  selector: 'app-employee-details',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    PageHeaderComponent,
    LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (employeeResource.isLoading()) {
      <app-loading-state />
    } @else if (employeeResource.hasValue()) {
      <app-page-header
        [title]="fullName()"
        [subtitle]="employeeResource.value().code"
      >
        @if (canWrite()) {
          <a mat-flat-button color="primary" [routerLink]="['/employees', id(), 'edit']">Edit</a>
        }
      </app-page-header>

      <mat-card>
        <mat-card-content class="details-grid">
          <div><strong>Email</strong><div>{{ employeeResource.value().email }}</div></div>
          <div><strong>Department</strong><div>{{ employeeResource.value().departmentName }}</div></div>
          <div><strong>Salary</strong><div>{{ formatCurrency(employeeResource.value().salary) }}</div></div>
          <div><strong>Hire Date</strong><div>{{ employeeResource.value().hireDate }}</div></div>
          <div><strong>Status</strong><div><mat-chip>{{ statusLabel(employeeResource.value().status) }}</mat-chip></div></div>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
  `
})
export class EmployeeDetailsComponent {
  readonly id = input.required<string>();

  private readonly employeeApi = inject(EmployeeApiService);
  private readonly auth = inject(AuthService);

  readonly employeeResource = resource({
    params: () => ({ id: Number(this.id()) }),
    loader: ({ params }) => this.employeeApi.getById(params.id)
  });

  readonly canWrite = computed(() => this.auth.canWriteEmployees());
  readonly fullName = computed(() => {
    const employee = this.employeeResource.value();
    return employee ? `${employee.firstName} ${employee.lastName}` : '';
  });

  readonly statusLabel = employeeStatusLabel;
  readonly formatCurrency = formatCurrency;
}
