import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../shared/components/loading-state/loading-state.component';
import { ReportsApiService } from '../../core/api/reports-api.service';
import {
  DepartmentReportItem,
  HiringTrendItem,
  SalaryRangeReportItem
} from '../../core/models/report.models';

@Component({
  selector: 'app-reports',
  imports: [MatCardModule, MatTabsModule, PageHeaderComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Reports" subtitle="Workforce analytics" />

    <mat-tab-group>
      <mat-tab label="By Department">
        @if (byDepartment.isLoading()) {
          <app-loading-state />
        } @else if (byDepartment.hasValue()) {
          <div class="chart-list">
            @for (item of byDepartment.value(); track item.departmentName) {
              <div class="chart-row">
                <span>{{ item.departmentName }}</span>
                <div class="bar-track">
                  <div class="bar-fill" [style.width.%]="barWidth(item.employeeCount, maxDepartmentCount())"></div>
                </div>
                <strong>{{ item.employeeCount }}</strong>
              </div>
            }
          </div>
        }
      </mat-tab>

      <mat-tab label="Salary Range">
        @if (bySalary.isLoading()) {
          <app-loading-state />
        } @else if (bySalary.hasValue()) {
          <div class="chart-list">
            @for (item of bySalary.value(); track item.rangeLabel) {
              <div class="chart-row">
                <span>{{ item.rangeLabel }}</span>
                <div class="bar-track">
                  <div class="bar-fill salary" [style.width.%]="barWidth(item.employeeCount, maxSalaryCount())"></div>
                </div>
                <strong>{{ item.employeeCount }}</strong>
              </div>
            }
          </div>
        }
      </mat-tab>

      <mat-tab label="Hiring Trend">
        @if (hiringTrend.isLoading()) {
          <app-loading-state />
        } @else if (hiringTrend.hasValue()) {
          <div class="chart-list">
            @for (item of hiringTrend.value(); track item.month) {
              <div class="chart-row">
                <span>{{ item.month }}</span>
                <div class="bar-track">
                  <div class="bar-fill trend" [style.width.%]="barWidth(item.hireCount, maxHireCount())"></div>
                </div>
                <strong>{{ item.hireCount }}</strong>
              </div>
            }
          </div>
        }
      </mat-tab>
    </mat-tab-group>
  `,
  styles: `
    .chart-list {
      display: grid;
      gap: 0.75rem;
      padding: 1rem 0;
    }

    .chart-row {
      display: grid;
      grid-template-columns: 140px 1fr 48px;
      gap: 1rem;
      align-items: center;
    }

    .bar-track {
      background: #eceff1;
      border-radius: 999px;
      height: 12px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: #3f51b5;
    }

    .bar-fill.salary {
      background: #00897b;
    }

    .bar-fill.trend {
      background: #6a1b9a;
    }
  `
})
export class ReportsComponent {
  private readonly reportsApi = inject(ReportsApiService);

  readonly byDepartment = resource<DepartmentReportItem[], void>({
    loader: () => this.reportsApi.getByDepartment()
  });
  readonly bySalary = resource<SalaryRangeReportItem[], void>({
    loader: () => this.reportsApi.getBySalaryRange()
  });
  readonly hiringTrend = resource<HiringTrendItem[], void>({
    loader: () => this.reportsApi.getHiringTrend(12)
  });

  readonly maxDepartmentCount = computed(() =>
    Math.max(...(this.byDepartment.value()?.map(x => x.employeeCount) ?? [1]), 1)
  );
  readonly maxSalaryCount = computed(() =>
    Math.max(...(this.bySalary.value()?.map(x => x.employeeCount) ?? [1]), 1)
  );
  readonly maxHireCount = computed(() =>
    Math.max(...(this.hiringTrend.value()?.map(x => x.hireCount) ?? [1]), 1)
  );

  barWidth(value: number, max: number): number {
    return Math.round((value / max) * 100);
  }
}
