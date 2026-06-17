import { Routes } from '@angular/router';

const loadPlaceholder = () =>
  import('./shared/pages/admin-placeholder-page/admin-placeholder-page.component').then(
    (m) => m.AdminPlaceholderPageComponent,
  );

/** مسارات placeholder للصفحات الظاهرة في الـ sidebar */
export const ADMIN_STUB_ROUTES: Routes = [
  { path: 'accounts/pending', loadComponent: loadPlaceholder },
  { path: 'accounts/restaurants', loadComponent: loadPlaceholder },
  { path: 'accounts/drivers', loadComponent: loadPlaceholder },
  { path: 'operations/delivery/tracking', loadComponent: loadPlaceholder },
  { path: 'operations/delivery/hold', loadComponent: loadPlaceholder },
  { path: 'subscriptions/programs', loadComponent: loadPlaceholder },
  { path: 'subscriptions/tiers', loadComponent: loadPlaceholder },
  { path: 'subscriptions/pricing', loadComponent: loadPlaceholder },
  { path: 'finance/cancellations', loadComponent: loadPlaceholder },
  { path: 'finance/settlements', loadComponent: loadPlaceholder },
  { path: 'finance/reports', loadComponent: loadPlaceholder },
  { path: 'support/complaints', loadComponent: loadPlaceholder },
  { path: 'support/wallet', loadComponent: loadPlaceholder },
  { path: 'settings/areas', loadComponent: loadPlaceholder },
  { path: 'settings/general', loadComponent: loadPlaceholder },
];
