import { Routes } from '@angular/router';

export const SUBSCRIPTIONS_ROUTES: Routes = [
  {
    path: 'programs',
    loadComponent: () =>
      import(
        '@/features/admin/subscriptions/pages/programs-workspace-page/programs-workspace-page.component'
      ).then((m) => m.ProgramsWorkspacePageComponent),
  },
  {
    path: 'tiers',
    loadComponent: () =>
      import(
        '@/features/admin/subscriptions/pages/tiers-workspace-page/tiers-workspace-page.component'
      ).then((m) => m.TiersWorkspacePageComponent),
  },
  {
    path: 'pricing',
    loadComponent: () =>
      import(
        '@/features/admin/subscriptions/pages/pricing-workspace-page/pricing-workspace-page.component'
      ).then((m) => m.PricingWorkspacePageComponent),
  },
  { path: '', redirectTo: 'programs', pathMatch: 'full' },
];
