# F033 — الطلبات اليومية للمطعم

## Restaurant Daily Orders

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F033` |
| Module | M04 — المطاعم والتشغيل |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **الطلبات اليومية للمطعم** جزء من **المطاعم والتشغيل**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- المطعم
- مدير المطعم
- الأدمن
- السائق

## السيناريو الرئيسي
1. فتح وظيفة المطعم.
2. تحميل بيانات النطاق.
3. تطبيق الطاقة والوقت.
4. تنفيذ الإجراء.
5. تحديث التشغيل.
6. تسجيل الحدث.

## قواعد العمل الأساسية
- الطاقة بعدد البوكسات المؤكدة.
- Busy تلقائي عند بلوغ الطاقة.
- تأكيد المطعم داخل SLA.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `Restaurant`
- `Menu`
- `Meal`
- `RestaurantCapacity`
- `RestaurantOrderBatch`
- `Barcode`
- `RestaurantDriver`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/restaurant_daily_orders`
- `GET /api/v1/restaurant_daily_orders/{id}`
- `POST /api/v1/restaurant_daily_orders`
- `PUT /api/v1/restaurant_daily_orders/{id}`
- `POST /api/v1/restaurant_daily_orders/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
