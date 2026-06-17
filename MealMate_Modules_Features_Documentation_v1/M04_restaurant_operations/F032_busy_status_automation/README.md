# F032 — حالة Busy التلقائية

## Busy Status Automation

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F032` |
| Module | M04 — المطاعم والتشغيل |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **حالة Busy التلقائية** جزء من **المطاعم والتشغيل**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

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
- **قاعدة خاصة:** Busy = confirmed_boxes >= approved_capacity.
- **قاعدة خاصة:** منع اختيارات جديدة مع حفظ المؤكد.
- **قاعدة خاصة:** إعادة الفتح عند توافر طاقة.
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
- `GET /api/v1/busy_status_automation`
- `GET /api/v1/busy_status_automation/{id}`
- `POST /api/v1/busy_status_automation`
- `PUT /api/v1/busy_status_automation/{id}`
- `POST /api/v1/busy_status_automation/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
