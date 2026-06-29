import { Routes } from '@angular/router';

/** Legacy redirects from old 72h-rule and delivery paths. */
export const OPERATIONS_LEGACY_REDIRECTS: Routes = [
  { path: '72h-rule', redirectTo: 'orders', pathMatch: 'full' },
  { path: '72h-rule/overdue', redirectTo: 'orders', pathMatch: 'full' },
  { path: '72h-rule/replacement', redirectTo: 'orders', pathMatch: 'full' },
  { path: '72h-rule/preparation', redirectTo: 'orders', pathMatch: 'full' },
  { path: '72h-rule/exceptions', redirectTo: 'audit', pathMatch: 'full' },
  { path: 'delivery/tracking', redirectTo: 'delivery', pathMatch: 'full' },
  { path: 'delivery/hold', redirectTo: 'delivery', pathMatch: 'full' },
];

export const OPERATIONS_ROUTES: Routes = [
  ...OPERATIONS_LEGACY_REDIRECTS,
  {
    path: 'capacity',
    loadComponent: () =>
      import('./pages/capacity-workspace-page/capacity-workspace-page.component').then(
        (m) => m.CapacityWorkspacePageComponent,
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders-workspace-page/orders-workspace-page.component').then(
        (m) => m.OrdersWorkspacePageComponent,
      ),
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./pages/order-detail-page/order-detail-page.component').then(
        (m) => m.OrderDetailPageComponent,
      ),
  },
  {
    path: 'delivery',
    loadComponent: () =>
      import('./pages/delivery-workspace-page/delivery-workspace-page.component').then(
        (m) => m.DeliveryWorkspacePageComponent,
      ),
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('./pages/operations-audit-page/operations-audit-page.component').then(
        (m) => m.OperationsAuditPageComponent,
      ),
  },
  {
    path: 'auto-selection',
    loadComponent: () =>
      import('./pages/auto-selection-workspace-page/auto-selection-workspace-page.component').then(
        (m) => m.AutoSelectionWorkspacePageComponent,
      ),
  },
  {
    path: 'menus',
    loadComponent: () =>
      import('./pages/menu-approval-workspace-page/menu-approval-workspace-page.component').then(
        (m) => m.MenuApprovalWorkspacePageComponent,
      ),
  },
  {
    path: 'invoices/:id/design',
    loadComponent: () =>
      import('./pages/invoice-template-designer-page/invoice-template-designer-page.component').then(
        (m) => m.InvoiceTemplateDesignerPageComponent,
      ),
  },
  {
    path: 'invoices',
    loadComponent: () =>
      import('./pages/invoice-labels-workspace-page/invoice-labels-workspace-page.component').then(
        (m) => m.InvoiceLabelsWorkspacePageComponent,
      ),
  },
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
];
