# Admin — Operations Module

## الصفحات

| الصفحة | المسار | الغرض |
|--------|--------|-------|
| `OrdersWorkspacePage` | `/admin/operations/orders` | مركز موحّد للطلبات (فلاتر: يحتاج تدخل، تأكيد، بديل، تحضير) |
| `OrderDetailPage` | `/admin/operations/orders/:id` | تفاصيل الطلب (6 تبويبات) |
| `DeliveryWorkspacePage` | `/admin/operations/delivery` | تتبع مباشر + Hold |
| `OperationsAuditPage` | `/admin/operations/audit` | سجل استثناءات التدقيق |

## Redirects (legacy)

| مسار قديم | يوجّه إلى |
|-----------|-----------|
| `/admin/operations/72h-rule` | `/admin/operations/orders` |
| `.../overdue` | `/admin/operations/orders` |
| `.../replacement` | `/admin/operations/orders` |
| `.../preparation` | `/admin/operations/orders` |
| `.../exceptions` | `/admin/operations/audit` |
| `.../delivery/tracking` | `/admin/operations/delivery?tab=tracking` |
| `.../delivery/hold` | `/admin/operations/delivery?tab=hold` |
