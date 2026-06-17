# F052 — إنشاء شكوى

## Complaint Creation

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F052` |
| Module | M06 — الشكاوى والدعم |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **إنشاء شكوى** جزء من **الشكاوى والدعم**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- العميل
- الدعم
- الأدمن
- المطعم
- المالية

## السيناريو الرئيسي
1. إنشاء الحالة.
2. فحص الطلب والأدلة.
3. التصنيف والإسناد.
4. جمع رد المطعم.
5. قرار موثق.
6. تعويض/خصم بعد الموافقة.

## قواعد العمل الأساسية
- الصور مطلوبة حسب نوع الشكوى.
- قرار المسؤولية والتعويض قابل للتدقيق.
- التعويض المالي يحتاج صلاحية.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `Complaint`
- `ComplaintEvidence`
- `RestaurantResponse`
- `Compensation`
- `Deduction`
- `SupportTicket`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/complaint_creation`
- `GET /api/v1/complaint_creation/{id}`
- `POST /api/v1/complaint_creation`
- `PUT /api/v1/complaint_creation/{id}`
- `POST /api/v1/complaint_creation/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
