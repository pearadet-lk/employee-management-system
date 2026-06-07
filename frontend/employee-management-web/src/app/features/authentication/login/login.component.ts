import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, FormRoot, required, submit } from '@angular/forms/signals';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormField, FormRoot],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login-page">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Sign in</mat-card-title>
          <mat-card-subtitle>Employee Management System</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formRoot]="loginForm" (submit)="onSubmit($event)">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput [formField]="loginForm.username" autocomplete="username" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" [formField]="loginForm.password" autocomplete="current-password" />
            </mat-form-field>

            @if (errorMessage()) {
              <p class="error">{{ errorMessage() }}</p>
            }

            <button mat-flat-button color="primary" type="submit" [disabled]="loading()">
              {{ loading() ? 'Signing in...' : 'Login' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .login-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, #e8eaf6, #f5f5f5);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .error {
      color: #c62828;
      margin: 0 0 1rem;
    }
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly logger = inject(LoggerService);

  readonly loading = signal(false);
  readonly errorMessage = signal('');

  readonly loginModel = signal({ username: '', password: '' });
  readonly loginForm = form(this.loginModel, fields => {
    required(fields.username);
    required(fields.password);
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    this.errorMessage.set('');

    submit(this.loginForm, async () => {
      this.loading.set(true);
      try {
        await this.auth.login(this.loginModel());
        await this.router.navigate(['/dashboard']);
      } catch {
        this.errorMessage.set('Invalid username or password.');
        this.logger.error('Login validation failed');
      } finally {
        this.loading.set(false);
      }
    });
  }
}
