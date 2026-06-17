import { Routes } from '@angular/router';
import { order72hMonitorGuard } from './features/admin/order-72h-rule/guards/order-72h-permissions.guard';
import { ADMIN_STUB_ROUTES } from './features/admin/admin-stub.routes';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/admin-login-page/admin-login-page.component').then(
        (m) => m.AdminLoginPageComponent,
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./core/layout/admin-shell/admin-shell.component').then(
        (m) => m.AdminShellComponent,
      ),
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        loadComponent: () =>
          import('./features/admin/overview/pages/overview-page/overview-page.component').then(
            (m) => m.OverviewPageComponent,
          ),
      },
      {
        path: 'security',
        loadComponent: () =>
          import('./features/admin/security/pages/security-workspace-page/security-workspace-page.component').then(
            (m) => m.SecurityWorkspacePageComponent,
          ),
      },
      {
        path: 'security/roles',
        redirectTo: '/admin/security?tab=access&panel=roles',
        pathMatch: 'full',
      },
      {
        path: 'security/roles/matrix',
        redirectTo: '/admin/security?tab=access&panel=matrix',
        pathMatch: 'full',
      },
      {
        path: 'security/roles/scopes',
        redirectTo: '/admin/security?tab=access&panel=scopes',
        pathMatch: 'full',
      },
      {
        path: 'security/users',
        redirectTo: '/admin/security?tab=users&panel=directory',
        pathMatch: 'full',
      },
      {
        path: 'security/users/invitations',
        redirectTo: '/admin/security?tab=users&panel=invites',
        pathMatch: 'full',
      },
      ...ADMIN_STUB_ROUTES,
      {
        path: 'operations/72h-rule',
        canActivate: [order72hMonitorGuard],
        loadChildren: () =>
          import('./features/admin/order-72h-rule/order-72h-rule.routes').then(
            (m) => m.ORDER_72H_RULE_ROUTES,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
