import { Routes } from '@angular/router';
import { adminPermissionGuard } from '@/core/auth/admin-permission.guard';
import { AdminPermissions } from '@/core/auth/admin-permissions';

const loadPlaceholder = () =>
  import('./shared/pages/admin-placeholder-page/admin-placeholder-page.component').then(
    (m) => m.AdminPlaceholderPageComponent,
  );

/** مسارات placeholder للصفحات الظاهرة في الـ sidebar */
export const ADMIN_STUB_ROUTES: Routes = [
  {
    path: 'accounts/pending',
    canActivate: [adminPermissionGuard(AdminPermissions.accountsView)],
    loadComponent: () =>
      import('./accounts/pages/pending-accounts-page/pending-accounts-page.component').then(
        (m) => m.PendingAccountsPageComponent,
      ),
  },
  {
    path: 'accounts/pending/:id',
    canActivate: [adminPermissionGuard(AdminPermissions.accountsView)],
    loadComponent: () =>
      import('./accounts/pages/pending-account-detail-page/pending-account-detail-page.component').then(
        (m) => m.PendingAccountDetailPageComponent,
      ),
  },
  {
    path: 'accounts/restaurants',
    loadComponent: () =>
      import('./accounts/pages/restaurants-accounts-page/restaurants-accounts-page.component').then(
        (m) => m.RestaurantsAccountsPageComponent,
      ),
  },
  {
    path: 'accounts/restaurants/:id',
    loadComponent: () =>
      import('./accounts/pages/restaurant-detail-page/restaurant-detail-page.component').then(
        (m) => m.RestaurantDetailPageComponent,
      ),
  },
  {
    path: 'accounts/drivers',
    loadComponent: () =>
      import('./accounts/pages/drivers-accounts-page/drivers-accounts-page.component').then(
        (m) => m.DriversAccountsPageComponent,
      ),
  },
  {
    path: 'accounts/drivers/:id',
    loadComponent: () =>
      import('./accounts/pages/driver-detail-page/driver-detail-page.component').then(
        (m) => m.DriverDetailPageComponent,
      ),
  },
  {
    path: 'accounts/customers',
    loadComponent: () =>
      import('./accounts/pages/customers-accounts-page/customers-accounts-page.component').then(
        (m) => m.CustomersAccountsPageComponent,
      ),
  },
  {
    path: 'accounts/customers/:id',
    loadComponent: () =>
      import('./accounts/pages/customer-detail-page/customer-detail-page.component').then(
        (m) => m.CustomerDetailPageComponent,
      ),
  },
  { path: 'accounts/documents', redirectTo: 'accounts/pending', pathMatch: 'full' },
  { path: 'marketing/referrals', loadComponent: loadPlaceholder },
  {
    path: 'finance/cancellations',
    canActivate: [adminPermissionGuard(AdminPermissions.financeView)],
    loadComponent: () =>
      import('./finance/pages/cancellations-workspace-page/cancellations-workspace-page.component').then(
        (m) => m.CancellationsWorkspacePageComponent,
      ),
  },
  {
    path: 'finance/settlements',
    canActivate: [adminPermissionGuard(AdminPermissions.financeView)],
    loadComponent: () =>
      import('./finance/pages/settlements-workspace-page/settlements-workspace-page.component').then(
        (m) => m.SettlementsWorkspacePageComponent,
      ),
  },
  {
    path: 'finance/reports',
    canActivate: [adminPermissionGuard(AdminPermissions.financeView)],
    loadComponent: () =>
      import('./finance/pages/financial-reports-page/financial-reports-page.component').then(
        (m) => m.FinancialReportsPageComponent,
      ),
  },
  {
    path: 'support/complaints',
    loadComponent: () =>
      import('./support/pages/complaints-support-page/complaints-support-page.component').then(
        (m) => m.ComplaintsSupportPageComponent,
      ),
  },
  {
    path: 'support/wallet',
    loadComponent: () =>
      import('./support/pages/wallet-support-page/wallet-support-page.component').then(
        (m) => m.WalletSupportPageComponent,
      ),
  },
  { path: 'support/loyalty', loadComponent: loadPlaceholder },
  { path: 'support/ratings', loadComponent: loadPlaceholder },
  { path: 'settings/areas', loadComponent: loadPlaceholder },
  { path: 'settings/general', loadComponent: loadPlaceholder },
  { path: 'settings/exit-policy', loadComponent: loadPlaceholder },
  { path: 'settings/communication', loadComponent: loadPlaceholder },
  { path: 'settings/languages', loadComponent: loadPlaceholder },
  { path: 'settings/privacy', loadComponent: loadPlaceholder },
  { path: 'settings/multitenancy', loadComponent: loadPlaceholder },
];
