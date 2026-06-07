import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { DepartmentApiService } from '../../../core/api/department-api.service';

@Component({
  selector: 'app-department-list',
  imports: [RouterLink, MatCardModule, MatTableModule, PageHeaderComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Departments" subtitle="Organization structure" />

    @if (departments.isLoading()) {
      <app-loading-state />
    } @else if (departments.hasValue()) {
      <table mat-table [dataSource]="departments.value()" class="department-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let row">
            <a [routerLink]="['/departments', row.id]">{{ row.name }}</a>
          </td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>Description</th>
          <td mat-cell *matCellDef="let row">{{ row.description || '—' }}</td>
        </ng-container>

        <ng-container matColumnDef="employees">
          <th mat-header-cell *matHeaderCellDef>Employees</th>
          <td mat-cell *matCellDef="let row">{{ row.employeeCount }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    }
  `,
  styles: `
    .department-table {
      width: 100%;
    }
  `
})
export class DepartmentListComponent {
  private readonly departmentApi = inject(DepartmentApiService);

  readonly displayedColumns = ['name', 'description', 'employees'];

  readonly departments = resource({
    loader: () => this.departmentApi.getAll()
  });
}
