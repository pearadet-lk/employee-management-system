import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource
} from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { DashboardApiService } from '../../core/api/dashboard-api.service';
import { formatCurrency } from '../../shared/utils/formatters';

@Component({
  selector: 'app-dashboard',
  imports: [MatGridListModule, PageHeaderComponent, StatCardComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Dashboard" subtitle="Organization overview" />

    @if (dashboardStats.isLoading()) {
      <app-loading-state message="Loading dashboard..." />
    } @else if (dashboardStats.error()) {
      <p class="error">Failed to load dashboard stats.</p>
    } @else if (dashboardStats.hasValue()) {
      <div class="stats-grid">
        <app-stat-card label="Total Employees" [value]="totalEmployees()" />
        <app-stat-card label="Total Departments" [value]="totalDepartments()" />
        <app-stat-card label="New Hires This Month" [value]="newHires()" />
        <app-stat-card label="Average Salary" [value]="averageSalary()" />
      </div>

      @defer (hydrate on viewport) {
        <div class="refresh-note">Auto-refreshes every 60 seconds</div>
      } @placeholder {
        <div class="refresh-note skeleton">Loading refresh indicator...</div>
      }
    }
  `,
  styles: `
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }

    .refresh-note {
      margin-top: 1.5rem;
      color: rgba(0, 0, 0, 0.6);
      font-size: 0.875rem;
    }

    .skeleton {
      opacity: 0.5;
    }

    .error {
      color: #c62828;
    }
  `
})
export class DashboardComponent {
  private readonly dashboardApi = inject(DashboardApiService);

  readonly dashboardStats = resource({
    loader: () => this.dashboardApi.getStats()
  });

  readonly totalEmployees = computed(() => this.dashboardStats.value()?.totalEmployees ?? 0);
  readonly totalDepartments = computed(() => this.dashboardStats.value()?.totalDepartments ?? 0);
  readonly newHires = computed(() => this.dashboardStats.value()?.newEmployeesThisMonth ?? 0);
  readonly averageSalary = computed(() =>
    formatCurrency(this.dashboardStats.value()?.averageSalary ?? 0)
  );

  constructor() {
    effect(onCleanup => {
      const timer = setInterval(() => this.dashboardStats.reload(), 60_000);
      onCleanup(() => clearInterval(timer));
    });
  }
}
