import { Routes } from '@angular/router';

export const MARKETING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/marketing-overview-page/marketing-overview-page.component').then(
        (m) => m.MarketingOverviewPageComponent,
      ),
  },
  {
    path: 'influencers',
    loadComponent: () =>
      import('./pages/influencers-list-page/influencers-list-page.component').then(
        (m) => m.InfluencersListPageComponent,
      ),
  },
  {
    path: 'influencers/:id',
    loadComponent: () =>
      import('./pages/influencer-detail-page/influencer-detail-page.component').then(
        (m) => m.InfluencerDetailPageComponent,
      ),
  },
  {
    path: 'campaigns',
    loadComponent: () =>
      import('./pages/campaigns-list-page/campaigns-list-page.component').then(
        (m) => m.CampaignsListPageComponent,
      ),
  },
  {
    path: 'campaigns/:id',
    loadComponent: () =>
      import('./pages/campaign-detail-page/campaign-detail-page.component').then(
        (m) => m.CampaignDetailPageComponent,
      ),
  },
  {
    path: 'promo-codes',
    loadComponent: () =>
      import('./pages/promo-codes-page/promo-codes-page.component').then(
        (m) => m.PromoCodesPageComponent,
      ),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./pages/marketing-reports-page/marketing-reports-page.component').then(
        (m) => m.MarketingReportsPageComponent,
      ),
  },
];
