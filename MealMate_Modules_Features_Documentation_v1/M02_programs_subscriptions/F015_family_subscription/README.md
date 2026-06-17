# F015 — الاشتراك العائلي

## Family Subscription

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F015` |
| Module | M02 — البرامج والاشتراكات |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **الاشتراك العائلي** جزء من **البرامج والاشتراكات**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

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
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
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
- `GET /api/v1/family_subscription`
- `GET /api/v1/family_subscription/{id}`
- `POST /api/v1/family_subscription`
- `PUT /api/v1/family_subscription/{id}`
- `POST /api/v1/family_subscription/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
