import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-state',
  imports: [MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading-state">
      <mat-spinner diameter="40" />
      @if (message()) {
        <p>{{ message() }}</p>
      }
    </div>
  `,
  styles: `
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
    }
  `
})
export class LoadingStateComponent {
  readonly message = input('Loading...');
}
