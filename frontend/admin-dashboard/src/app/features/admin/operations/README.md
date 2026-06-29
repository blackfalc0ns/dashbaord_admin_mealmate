# Admin - Operations Module

## Pages

| Page | Path | Purpose |
|------|------|---------|
| `OrdersWorkspacePage` | `/admin/operations/orders` | Unified operational order queue |
| `OrderDetailPage` | `/admin/operations/orders/:id` | Order details and lifecycle panels |
| `DeliveryWorkspacePage` | `/admin/operations/delivery` | Delivery tracking and hold cases |
| `OperationsAuditPage` | `/admin/operations/audit` | Operational exception audit |
| `AutoSelectionWorkspacePage` | `/admin/operations/auto-selection` | Automatic meal assignment monitoring |
| `MenuApprovalWorkspacePage` | `/admin/operations/menus` | Restaurant menu and meal approval |
| `InvoiceLabelsWorkspacePage` | `/admin/operations/invoices` | Invoice, barcode, and meal-label templates |
| `InvoiceTemplateDesignerPage` | `/admin/operations/invoices/:id/design` | Full-page document template designer |

## Redirects

| Legacy path | Redirects to |
|-------------|--------------|
| `/admin/operations/72h-rule` | `/admin/operations/orders` |
| `.../overdue` | `/admin/operations/orders` |
| `.../replacement` | `/admin/operations/orders` |
| `.../preparation` | `/admin/operations/orders` |
| `.../exceptions` | `/admin/operations/audit` |
| `.../delivery/tracking` | `/admin/operations/delivery?tab=tracking` |
| `.../delivery/hold` | `/admin/operations/delivery?tab=hold` |
