import { ChangeDetectionStrategy, Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { DepartmentApiService } from '../../../core/api/department-api.service';
import { formatCurrency } from '../../../shared/utils/formatters';
import { employeeStatusLabel } from '../../../shared/utils/formatters';

@Component({
  selector: 'app-department-detail',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatTableModule, PageHeaderComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (departmentResource.isLoading()) {
      <app-loading-state />
    } @else if (departmentResource.hasValue()) {
      <app-page-header
        [title]="departmentResource.value().name"
        [subtitle]="departmentResource.value().description || 'Department details'"
      >
        <a mat-button routerLink="/departments">Back to list</a>
      </app-page-header>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Employees in department</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="departmentResource.value().employees" class="employee-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let row">
                <a [routerLink]="['/employees', row.id]">{{ row.firstName }} {{ row.lastName }}</a>
              </td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let row">{{ row.email }}</td>
            </ng-container>
            <ng-container matColumnDef="salary">
              <th mat-header-cell *matHeaderCellDef>Salary</th>
              <td mat-cell *matCellDef="let row">{{ formatCurrency(row.salary) }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let row">{{ statusLabel(row.status) }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    .employee-table {
      width: 100%;
    }
  `
})
export class DepartmentDetailComponent {
  readonly id = input.required<string>();

  private readonly departmentApi = inject(DepartmentApiService);

  readonly departmentResource = resource({
    params: () => ({ id: Number(this.id()) }),
    loader: ({ params }) => this.departmentApi.getById(params.id)
  });

  readonly employeeCount = computed(() => this.departmentResource.value()?.employees.length ?? 0);
  readonly displayedColumns = ['name', 'email', 'salary', 'status'];
  readonly formatCurrency = formatCurrency;
  readonly statusLabel = employeeStatusLabel;
}
