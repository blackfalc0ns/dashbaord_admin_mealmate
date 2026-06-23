import { Routes } from '@angular/router';

const loadPlaceholder = () =>
  import('./shared/pages/admin-placeholder-page/admin-placeholder-page.component').then(
    (m) => m.AdminPlaceholderPageComponent,
  );

/** مسارات placeholder للصفحات الظاهرة في الـ sidebar */
export const ADMIN_STUB_ROUTES: Routes = [
  {
    path: 'accounts/pending',
    loadComponent: () =>
      import('./accounts/pages/pending-accounts-page/pending-accounts-page.component').then(
        (m) => m.PendingAccountsPageComponent,
      ),
  },
  {
    path: 'accounts/pending/:id',
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
  { path: 'finance/cancellations', loadComponent: loadPlaceholder },
  { path: 'finance/settlements', loadComponent: loadPlaceholder },
  { path: 'finance/reports', loadComponent: loadPlaceholder },
  { path: 'support/complaints', loadComponent: loadPlaceholder },
  { path: 'support/wallet', loadComponent: loadPlaceholder },
  { path: 'settings/areas', loadComponent: loadPlaceholder },
  { path: 'settings/general', loadComponent: loadPlaceholder },
];
