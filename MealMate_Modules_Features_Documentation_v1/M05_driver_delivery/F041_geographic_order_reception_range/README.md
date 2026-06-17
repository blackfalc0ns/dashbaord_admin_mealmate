# F041 — نطاق استقبال الطلبات

## Geographic Order Reception Range

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F041` |
| Module | M05 — السائق والتوصيل |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **نطاق استقبال الطلبات** جزء من **السائق والتوصيل**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- السائق
- العميل
- المطعم
- الأدمن

## السيناريو الرئيسي
1. فتح الطلب المسند.
2. التحقق من الحالة والنطاق.
3. تسجيل الموقع/التحقق.
4. تغيير الحالة.
5. بث التحديث.
6. فتح Hold عند الفشل.

## قواعد العمل الأساسية
- الاستلام والتسليم يحتاج تحققًا.
- الاتصال داخل 3 كم وبقناة مخفية.
- إظهار الرقم الحقيقي استثناء موثق.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `Driver`
- `DeliveryAssignment`
- `DeliveryEvent`
- `TrackingPoint`
- `ContactSession`
- `HoldCase`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/geographic_order_reception_range`
- `GET /api/v1/geographic_order_reception_range/{id}`
- `POST /api/v1/geographic_order_reception_range`
- `PUT /api/v1/geographic_order_reception_range/{id}`
- `POST /api/v1/geographic_order_reception_range/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
