# MealMate — API MVP Scope

> الغرض: تحديد أول نطاق API قابل للتنفيذ بدون تضخم، مع الحفاظ على قواعد المشروع الأساسية.

---

## 1. MVP Goal

إطلاق نسخة أولى تغطي:

- Auth + roles.
- إدارة المطاعم واعتمادها.
- أسعار المطاعم والقوائم.
- تصنيف المطاعم.
- إنشاء اشتراك العميل.
- التقويم وتوليد الطلبات.
- قفل 72 ساعة وتأكيد المطعم.
- الدفع والاسترداد الأساسي.
- التوصيل الأساسي بالباركود.
- شكاوى وتسويات أولية.

---

## 2. API Standards

| القاعدة | التفاصيل |
|---------|----------|
| Auth | Bearer JWT + Refresh Token |
| Errors | ProblemDetails |
| Pagination | إلزامي لكل list |
| Dates | UTC في API |
| Money | Decimal values + currency |
| Idempotency | Payment, refund, subscription creation, webhooks |
| Audit | admin/financial/privacy exceptions |

---

## 3. Auth APIs

### Customer / Restaurant / Driver / Admin

| Method | Endpoint | الغرض |
|--------|----------|-------|
| POST | `/api/auth/register/customer` | تسجيل عميل |
| POST | `/api/auth/register/restaurant` | تسجيل مطعم |
| POST | `/api/auth/register/driver` | تسجيل مندوب |
| POST | `/api/auth/login` | تسجيل دخول |
| POST | `/api/auth/refresh` | تجديد token |
| POST | `/api/auth/logout` | خروج |
| POST | `/api/auth/forgot-password` | استعادة كلمة المرور |
| POST | `/api/auth/reset-password` | إعادة تعيين |

### Required

- Rate limiting.
- Refresh token rotation.
- Audit for admin login and role changes.

---

## 4. Admin MVP APIs

### Accounts And Approvals

| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/restaurants/pending` |
| POST | `/api/admin/restaurants/{id}/approve` |
| POST | `/api/admin/restaurants/{id}/reject` |
| GET | `/api/admin/drivers/pending` |
| POST | `/api/admin/drivers/{id}/approve` |
| POST | `/api/admin/drivers/{id}/reject` |

### Areas

| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/areas` |
| POST | `/api/admin/areas` |
| PUT | `/api/admin/areas/{id}` |
| PATCH | `/api/admin/areas/{id}/status` |

### Pricing Settings

| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/pricing-settings` |
| PUT | `/api/admin/pricing-settings` |
| POST | `/api/admin/recalculate-classification` |

Must include:

- `max_commission`
- `min_commission`
- cancellation fee settings
- operational deduction days
- subscriber discount
- influencer commission

### Operational Exceptions

| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/orders/confirmation-overdue` |
| POST | `/api/admin/orders/{id}/open-replacement-window` |
| POST | `/api/admin/orders/{id}/manual-reassign` |
| POST | `/api/admin/orders/{id}/exception` |

Required:

- reason
- audit log
- actor
- affected customer/restaurant/order

---

## 5. Restaurant MVP APIs

### Profile And Documents

| Method | Endpoint |
|--------|----------|
| GET | `/api/restaurant/profile` |
| PUT | `/api/restaurant/profile` |
| GET | `/api/restaurant/documents` |
| POST | `/api/restaurant/documents` |

### Menus And Prices

| Method | Endpoint |
|--------|----------|
| GET | `/api/restaurant/meals` |
| POST | `/api/restaurant/meals` |
| PUT | `/api/restaurant/meals/{id}` |
| PATCH | `/api/restaurant/meals/{id}/availability` |
| GET | `/api/restaurant/prices` |
| PUT | `/api/restaurant/prices` |

### Capacity And Busy

| Method | Endpoint |
|--------|----------|
| GET | `/api/restaurant/capacity` |
| PUT | `/api/restaurant/capacity` |
| POST | `/api/restaurant/busy` |
| DELETE | `/api/restaurant/busy/{date}` |

### Orders

| Method | Endpoint |
|--------|----------|
| GET | `/api/restaurant/orders` |
| GET | `/api/restaurant/orders/{id}` |
| POST | `/api/restaurant/orders/{id}/confirm` |
| POST | `/api/restaurant/orders/{id}/reject-confirmation` |
| GET | `/api/restaurant/orders/upcoming-24h` |

### Invoices And Labels

| Method | Endpoint |
|--------|----------|
| GET | `/api/restaurant/orders/{id}/invoice` |
| GET | `/api/restaurant/orders/{id}/labels` |
| GET | `/api/restaurant/orders/{id}/barcode` |
| POST | `/api/restaurant/orders/{id}/printed` |

---

## 6. Customer MVP APIs

### Subscription Setup

| Method | Endpoint |
|--------|----------|
| GET | `/api/customer/programs` |
| GET | `/api/customer/bundles` |
| GET | `/api/customer/tiers` |
| POST | `/api/customer/subscriptions/quote` |
| POST | `/api/customer/subscriptions` |
| GET | `/api/customer/subscriptions/current` |

### Calendar

| Method | Endpoint |
|--------|----------|
| GET | `/api/customer/calendar` |
| GET | `/api/customer/calendar/{dayId}` |
| GET | `/api/customer/calendar/{dayId}/restaurants` |
| GET | `/api/customer/calendar/{dayId}/meals` |
| POST | `/api/customer/calendar/{dayId}/selection` |
| PUT | `/api/customer/calendar/{dayId}/selection` |

Rules:

- selection allowed only before `-72h`.
- replacement selection only during admin-opened 24h window.

### Payment And Wallet

| Method | Endpoint |
|--------|----------|
| POST | `/api/customer/payments/create-intent` |
| POST | `/api/customer/payments/confirm` |
| GET | `/api/customer/wallet` |
| GET | `/api/customer/invoices` |

### Cancellation

| Method | Endpoint |
|--------|----------|
| POST | `/api/customer/subscriptions/{id}/cancel/preview` |
| POST | `/api/customer/subscriptions/{id}/cancel` |

Preview must show:

- used days
- operational deduction days = 3
- remaining days
- cancellation fee percent
- final refund

### Complaints

| Method | Endpoint |
|--------|----------|
| POST | `/api/customer/orders/{id}/complaints` |
| GET | `/api/customer/complaints` |

---

## 7. Driver MVP APIs

| Method | Endpoint | الغرض |
|--------|----------|-------|
| GET | `/api/driver/assignments` | الطلبات |
| GET | `/api/driver/orders/{id}` | تفاصيل |
| POST | `/api/driver/orders/{id}/pickup-scan` | مسح الاستلام |
| POST | `/api/driver/orders/{id}/delivery-scan` | مسح التسليم |
| POST | `/api/driver/orders/{id}/location` | تحديث موقع |
| POST | `/api/driver/orders/{id}/hold` | Hold |
| POST | `/api/driver/orders/{id}/delivery-proof` | إثبات تسليم |

Privacy:

- no unnecessary customer data.
- contact only under 3 km or exception.

---

## 8. Accounting MVP APIs

### Admin

| Method | Endpoint |
|--------|----------|
| GET | `/api/admin/settlements/restaurants` |
| GET | `/api/admin/settlements/restaurants/{id}` |
| POST | `/api/admin/settlements/restaurants/{id}/approve` |
| GET | `/api/admin/refunds` |
| POST | `/api/admin/refunds/{id}/approve` |

### Restaurant

| Method | Endpoint |
|--------|----------|
| GET | `/api/restaurant/settlements` |
| GET | `/api/restaurant/settlements/{id}` |

---

## 9. Background Job APIs / Internal Jobs

These may be internal services, not public APIs:

| Job | التوقيت |
|-----|---------|
| LockSubscriptionDaysJob | عند `-72h` |
| RestaurantConfirmationDeadlineJob | بعد 24h من إرسال الطلب |
| ReplacementWindowCloseJob | عند نهاية نافذة البديل |
| Upcoming24hPreparationJob | عند `-24h` |
| InvoiceBarcodeGenerationJob | بعد تأكيد/عند `-24h` |
| ProfitabilityWarningJob | مجدول |

---

## 10. MVP Exclusions

لا تدخل في أول نسخة إلا لو ضرورية:

- Multi-country full tenant automation.
- Advanced ads bidding.
- Full loyalty marketplace.
- Advanced route optimization.
- Complex BI dashboards.
- Public restaurant marketplace.

---

## 11. MVP Acceptance Checklist

- Auth works for all roles.
- Admin can approve restaurant/driver.
- Restaurant can add prices and meals.
- Classification recalculates.
- Customer can quote, pay, and create subscription.
- Calendar selection works before `-72h`.
- Lock job sends order to restaurant.
- Restaurant confirms within 24h.
- `-24h` order list appears.
- Driver can scan pickup/delivery.
- Customer can preview cancellation refund.
- Admin can view basic settlement.
- Critical security and ownership tests pass.
