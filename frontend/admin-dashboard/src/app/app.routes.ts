import { Routes } from '@angular/router';
import { adminPermissionGuard } from '@/core/auth/admin-permission.guard';
import { AdminPermissions } from '@/core/auth/admin-permissions';
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
        canActivate: [adminPermissionGuard(AdminPermissions.overviewView)],
        loadComponent: () =>
          import('./features/admin/overview/pages/overview-page/overview-page.component').then(
            (m) => m.OverviewPageComponent,
          ),
      },
      {
        path: 'forbidden',
        loadComponent: () =>
          import('./features/admin/shared/pages/forbidden-page/forbidden-page.component').then(
            (m) => m.ForbiddenPageComponent,
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
        path: 'subscriptions',
        canActivate: [adminPermissionGuard(AdminPermissions.subscriptionsView)],
        loadChildren: () =>
          import('./features/admin/subscriptions/subscriptions.routes').then(
            (m) => m.SUBSCRIPTIONS_ROUTES,
          ),
      },
      {
        path: 'operations',
        canActivate: [adminPermissionGuard(AdminPermissions.operationsView)],
        loadChildren: () =>
          import('./features/admin/operations/operations.routes').then(
            (m) => m.OPERATIONS_ROUTES,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
