import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ROLES } from './core/constants/roles';

export const routes: Routes = [
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/authentication/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/employee-list/employee-list.component').then(
            m => m.EmployeeListComponent
          )
      },
      {
        path: 'employees/new',
        canActivate: [roleGuard(ROLES.Admin, ROLES.HR)],
        loadComponent: () =>
          import('./features/employees/employee-create/employee-create.component').then(
            m => m.EmployeeCreateComponent
          )
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import('./features/employees/employee-details/employee-details.component').then(
            m => m.EmployeeDetailsComponent
          )
      },
      {
        path: 'employees/:id/edit',
        canActivate: [roleGuard(ROLES.Admin, ROLES.HR)],
        loadComponent: () =>
          import('./features/employees/employee-edit/employee-edit.component').then(
            m => m.EmployeeEditComponent
          )
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/department-list/department-list.component').then(
            m => m.DepartmentListComponent
          )
      },
      {
        path: 'departments/:id',
        loadComponent: () =>
          import('./features/departments/department-detail/department-detail.component').then(
            m => m.DepartmentDetailComponent
          )
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then(m => m.ReportsComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/authentication/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
