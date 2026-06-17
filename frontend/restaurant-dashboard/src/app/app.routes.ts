import { Routes } from '@angular/router';

/** Root routes — mount F06 under /restaurant/orders */
export const APP_ROUTES: Routes = [
  {
    path: 'restaurant/orders',
    loadChildren: () =>
      import('./features/restaurant/order-72h-rule/order-72h-rule.routes').then(
        (m) => m.ORDER_72H_RULE_ROUTES
      ),
  },
];
