import { Routes } from '@angular/router';

export const ORDER_72H_RULE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/order-72h-monitor-page/order-72h-monitor-page.component').then(
        (m) => m.Order72hMonitorPageComponent
      ),
  },
  {
    path: 'overdue',
    loadComponent: () =>
      import(
        './pages/confirmation-overdue-page/confirmation-overdue-page.component'
      ).then((m) => m.ConfirmationOverduePageComponent),
  },
  {
    path: 'replacement',
    loadComponent: () =>
      import(
        './pages/replacement-window-page/replacement-window-page.component'
      ).then((m) => m.ReplacementWindowPageComponent),
  },
  {
    path: 'preparation',
    loadComponent: () =>
      import('./pages/preparation-24h-page/preparation-24h-page.component').then(
        (m) => m.Preparation24hPageComponent
      ),
  },
  {
    path: 'exceptions',
    loadComponent: () =>
      import('./pages/order-exception-page/order-exception-page.component').then(
        (m) => m.OrderExceptionPageComponent
      ),
  },
];
