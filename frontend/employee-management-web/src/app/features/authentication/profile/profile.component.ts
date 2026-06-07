import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [MatCardModule, PageHeaderComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Profile" subtitle="Your account details" />

    @if (profile.isLoading()) {
      <app-loading-state message="Loading profile..." />
    } @else if (profile.hasValue()) {
      <mat-card>
        <mat-card-content class="profile-grid">
          <div><strong>Username</strong><div>{{ profile.value().username }}</div></div>
          <div><strong>Email</strong><div>{{ profile.value().email }}</div></div>
          <div><strong>Role</strong><div>{{ profile.value().role }}</div></div>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    .profile-grid {
      display: grid;
      gap: 1rem;
      max-width: 480px;
    }
  `
})
export class ProfileComponent {
  private readonly auth = inject(AuthService);

  readonly profile = resource({
    loader: () => this.auth.loadProfile().then(user => {
      if (!user) {
        throw new Error('Profile unavailable');
      }
      return user;
    })
  });
}
