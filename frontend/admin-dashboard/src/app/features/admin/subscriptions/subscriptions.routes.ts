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
  {
    path: 'family',
    loadComponent: () =>
      import(
        '@/features/admin/subscriptions/pages/family-subscriptions-workspace-page/family-subscriptions-workspace-page.component'
      ).then((m) => m.FamilySubscriptionsWorkspacePageComponent),
  },
  {
    path: 'individual',
    loadComponent: () =>
      import(
        '@/features/admin/subscriptions/pages/individual-subscriptions-workspace-page/individual-subscriptions-workspace-page.component'
      ).then((m) => m.IndividualSubscriptionsWorkspacePageComponent),
  },
  {
    path: 'freeze',
    loadComponent: () =>
      import(
        '@/features/admin/subscriptions/pages/freeze-workspace-page/freeze-workspace-page.component'
      ).then((m) => m.FreezeWorkspacePageComponent),
  },
  {
    path: 'renewals',
    loadComponent: () =>
      import(
        '@/features/admin/subscriptions/pages/renewals-workspace-page/renewals-workspace-page.component'
      ).then((m) => m.RenewalsWorkspacePageComponent),
  },
  {
    path: 'upgrades',
    loadComponent: () =>
      import(
        '@/features/admin/subscriptions/pages/upgrades-workspace-page/upgrades-workspace-page.component'
      ).then((m) => m.UpgradesWorkspacePageComponent),
  },
  { path: '', redirectTo: 'programs', pathMatch: 'full' },
];
