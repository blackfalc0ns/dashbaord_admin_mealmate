# MealMate — Architecture Blueprint

> الغرض: تحديد شكل الحل قبل بدء الكود، وحدود كل تطبيق وخدمة، وقواعد التواصل بين الأنظمة.

---

## 1. النظرة العامة

MealMate يتكون من:

| الجزء | التقنية المقترحة | الدور |
|-------|------------------|-------|
| Backend API | ASP.NET Core Web API | منطق الأعمال، الحسابات، الصلاحيات، التكاملات |
| Admin Dashboard | Angular | إدارة المنصة، التسعير، التقارير، الاستثناءات |
| Restaurant Dashboard | Angular | إدارة المطعم، الطلبات، التأكيد، القوائم، التسويات |
| Customer App | Flutter | الاشتراك، التقويم، الدفع، التتبع، الشكاوى |
| Driver App | Flutter | الاستلام، التوصيل، الباركود، الموقع |
| Database | SQL Server / PostgreSQL | البيانات التشغيلية والمالية |
| Background Jobs | .NET Worker / Hangfire / Quartz | القفل الزمني، الإشعارات، التأكيدات، التقارير |

---

## 2. Backend Solution Structure

اقتراح مشاريع .NET:

```text
MealMate.sln
├── src/
│   ├── MealMate.Api/
│   ├── MealMate.Application/
│   ├── MealMate.Domain/
│   ├── MealMate.Infrastructure/
│   ├── MealMate.Persistence/
│   └── MealMate.Worker/
└── tests/
    ├── MealMate.UnitTests/
    ├── MealMate.IntegrationTests/
    └── MealMate.ApiTests/
```

### `MealMate.Domain`

- الكيانات الأساسية: Restaurant, Subscription, Order, Payment, Refund, Wallet, Settlement.
- القواعد الثابتة والدومين إن أمكن.
- Value Objects: Money, DateRange, Percentage.
- Enums: OrderStatus, SubscriptionStatus, RestaurantTier, PaymentStatus.

### `MealMate.Application`

- Use cases / services.
- DTOs داخلية.
- Validators.
- Interfaces للخدمات الخارجية.
- منطق التسعير، العمولة، الإلغاء، اللمت، التصنيف.

### `MealMate.Infrastructure`

- Payment provider.
- Notification provider.
- File storage.
- Email/SMS/WhatsApp integrations.
- External maps/location integrations.

### `MealMate.Persistence`

- EF Core DbContext.
- Entity configurations.
- Migrations.
- Query implementations.

### `MealMate.Api`

- Controllers / Minimal APIs.
- Auth.
- Request/Response DTOs.
- ProblemDetails.
- Swagger/OpenAPI.

### `MealMate.Worker`

- قفل الطلب عند `-72h`.
- متابعة تأكيد المطعم خلال 24h.
- فتح/إغلاق نافذة المطعم البديل.
- إشعار `-24h`.
- توليد فواتير/باركود/ملصقات.
- تقارير وربحية.

---

## 3. Frontend Applications

### Admin Dashboard

مسؤول عن:

- اعتماد العملاء/المطاعم/السائقين.
- المناطق والدول.
- الأسعار والعمولات.
- الاستثناءات التشغيلية.
- الشكاوى والاستردادات.
- التقارير والإنذار المبكر للربحية.
- التسويات والمحاسبة.

### Restaurant Dashboard

مسؤول عن:

- القوائم والوجبات.
- أسعار 26 يوم.
- الطاقة و Busy.
- الطلبات اليومية.
- تأكيد الطلب خلال 24h.
- قائمة توصيل `-24h`.
- الفواتير والملصقات والباركود.
- التسويات والخصومات.

### Customer App

مسؤول عن:

- التسجيل والاشتراك.
- اختيار البرنامج/الباقة/التصنيف.
- التقويم الذكي.
- الدفع والفواتير.
- التتبع.
- الإلغاء والتجميد.
- الشكاوى والمحفظة.

### Driver App

مسؤول عن:

- الطلبات المخصصة.
- الاستلام من المطعم.
- مسح الباركود.
- التوصيل والتتبع.
- الاتصال عند 3 كم.
- إثبات التسليم.

---

## 4. Cross-Cutting Rules

| الموضوع | القاعدة |
|---------|---------|
| الوقت | UTC داخلياً، تحويل محلي عند العرض |
| المال | `decimal` في backend |
| الصلاحيات | backend enforce دائماً |
| الخصوصية | أقل بيانات ممكنة لكل دور |
| القوائم | pagination افتراضي |
| الأخطاء | ProblemDetails أو format موحد |
| الحسابات | دوال مركزية قابلة للاختبار |
| Audit | إلزامي للمال، الخصوصية، والاستثناءات |

---

## 5. Key Workflows

### Order Timeline

```text
قبل -72h: العميل يختار/يعدل
-72h: قفل العميل + إرسال للمطعم
-72h إلى -48h: المطعم يؤكد خلال 24h
-48h إلى -24h: بديل عند عدم التأكيد
-24h: إشعار تحضير نهائي + فواتير/باركود
التوصيل: مندوب + scan pickup/delivery
```

### Pricing

- التصنيف يحسب ديناميكياً.
- الوصول في التقويم تراكمي.
- السعر غير تراكمي: كل تصنيف من مطاعم نفس التصنيف فقط.
- العمولة خطية بين `max_commission` و `min_commission`.
- تغييرات الأسعار للاشتراكات الجديدة فقط.

---

## 6. Suggested Build Order

1. Auth + roles + ownership.
2. Admin basics: restaurants, users, areas.
3. Restaurant profile + menus + pricing.
4. Classification + pricing calculations.
5. Customer subscription + payment skeleton.
6. Smart calendar + order generation.
7. 72h/24h operational jobs.
8. Driver delivery flow.
9. Cancellation/refund/wallet.
10. Settlements/reports/profitability.

---

## 7. Required Quality Gates

- Unit tests for formulas.
- Integration tests for auth/ownership and EF queries.
- API contract tests for critical endpoints.
- E2E/manual QA for 72h order lifecycle.
- Security review before payment/refund/wallet release.
