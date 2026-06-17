# Admin — F06: Order 72h Rule

## الصفحات

| الصفحة | المسار | الغرض |
|--------|--------|-------|
| `Order72hMonitorPage` | `/admin/operations/72h-rule` | مراقبة قفل −72h وحالات الطلب |
| `ConfirmationOverduePage` | `/admin/operations/72h-rule/overdue` | مطاعم لم تؤكّد خلال 24h |
| `ReplacementWindowPage` | `/admin/operations/72h-rule/replacement` | نوافذ بديل العميل (24h) |
| `Preparation24hPage` | `/admin/operations/72h-rule/preparation` | متابعة −24h والتحضير النهائي |
| `OrderExceptionPage` | `/admin/operations/72h-rule/exceptions` | استثناءات طارئة موثّقة |

## API (MVP)

- `GET /api/admin/orders/confirmation-overdue`
- `POST /api/admin/orders/{id}/open-replacement-window`
- `POST /api/admin/orders/{id}/manual-reassign`
- `POST /api/admin/orders/{id}/exception`

## الصلاحيات

- `order-72h:monitor` — عرض القوائم
- `order-72h:open-replacement` — فتح نافذة بديل
- `order-72h:manual-reassign` — تعيين مطعم يدويًا
- `order-72h:exception` — تنفيذ استثناء طارئ

## UX States

كل صفحة: `loading` | `empty` | `error` | `retry` | `success`
