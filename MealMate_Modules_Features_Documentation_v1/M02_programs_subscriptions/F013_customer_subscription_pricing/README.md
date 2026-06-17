# F013 — تسعير اشتراك العميل

## Customer Subscription Pricing

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F013` |
| Module | M02 — البرامج والاشتراكات |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **تسعير اشتراك العميل** جزء من **البرامج والاشتراكات**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- العميل
- المطعم
- الأدمن
- محرك التسعير

## السيناريو الرئيسي
1. اختيار البرنامج/الباقة.
2. تحميل الإعدادات.
3. تطبيق الأهلية والحسابات.
4. عرض Preview.
5. تأكيد وحفظ Snapshot.
6. تحديث الاشتراك.

## قواعد العمل الأساسية
- التصنيف لكل Program + Bundle.
- الوصول تراكمي والتسعير من نفس التصنيف فقط.
- تعديل الأسعار يؤثر على الاشتراكات الجديدة فقط.
- **قاعدة خاصة:** R = R_min إذا الأيام ≥ 26.
- **قاعدة خاصة:** R = R_max - ((R_max-R_min)/25)×(days-1).
- **قاعدة خاصة:** السعر الأساسي = CEILING(متوسط التكلفة×(1+R)×الأيام).
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `Program`
- `Bundle`
- `RestaurantPrice`
- `Tier`
- `Subscription`
- `PromoCode`
- `PricingSnapshot`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/customer_subscription_pricing`
- `GET /api/v1/customer_subscription_pricing/{id}`
- `POST /api/v1/customer_subscription_pricing`
- `PUT /api/v1/customer_subscription_pricing/{id}`
- `POST /api/v1/customer_subscription_pricing/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
