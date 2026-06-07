import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ title() }}</h2>
    <mat-dialog-content>{{ message() }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancelled.emit()">Cancel</button>
      <button mat-flat-button color="warn" (click)="confirmed.emit()">Confirm</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  readonly title = input('Confirm');
  readonly message = input.required<string>();
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
