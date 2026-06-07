import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounced } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmployeeApiService } from '../../../core/api/employee-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { employeeStatusLabel, formatCurrency } from '../../../shared/utils/formatters';

@Component({
  selector: 'app-employee-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    PageHeaderComponent,
    LoadingStateComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  private readonly employeeApi = inject(EmployeeApiService);
  private readonly auth = inject(AuthService);

  readonly searchTerm = signal('');
  readonly debouncedSearch = debounced(() => this.searchTerm(), 300);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly canWrite = computed(() => this.auth.canWriteEmployees());

  readonly employees = resource({
    params: () => ({
      search: this.debouncedSearch.hasValue() ? this.debouncedSearch.value() : this.searchTerm(),
      page: this.page(),
      pageSize: this.pageSize(),
      sortBy: 'lastName',
      sortDirection: 'asc' as const
    }),
    loader: ({ params }) => this.employeeApi.getEmployees(params)
  });

  readonly displayedColumns = ['code', 'name', 'email', 'department', 'salary', 'status', 'actions'];
  readonly statusLabel = employeeStatusLabel;
  readonly formatCurrency = formatCurrency;

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.page.set(1);
  }

  onPageChange(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }
}
