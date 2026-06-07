import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stat-card',
  imports: [MatCardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="stat-card">
      <mat-card-content>
        <div class="label">{{ label() }}</div>
        <div class="value">{{ value() }}</div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .stat-card {
      height: 100%;
    }

    .label {
      font-size: 0.875rem;
      color: rgba(0, 0, 0, 0.6);
      margin-bottom: 0.5rem;
    }

    .value {
      font-size: 1.75rem;
      font-weight: 600;
    }
  `
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
}
