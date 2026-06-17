# F098 — تأثير الإلغاء على العمولة

## Cancellation Impact on Commission

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F098` |
| Module | M10 — نظام المؤثرين |
| Source Type | جديد |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **تأثير الإلغاء على العمولة** جزء من **نظام المؤثرين**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- المؤثر
- العميل
- الأدمن
- المالية

## السيناريو الرئيسي
1. ربط المؤثر/الكود.
2. تحديد العملية المؤهلة.
3. احتساب العمولة.
4. فترة انتظار.
5. اعتماد التحصيل.
6. تحديث السجل.

## قواعد العمل الأساسية
- الربط برقم هاتف موحد.
- العمولة للعمليات المؤهلة فقط.
- الإلغاء قد يعكس العمولة.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `Influencer`
- `InfluencerLink`
- `InfluencerCode`
- `CommissionEntry`
- `InfluencerWithdrawal`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/cancellation_impact_on_commission`
- `GET /api/v1/cancellation_impact_on_commission/{id}`
- `POST /api/v1/cancellation_impact_on_commission`
- `PUT /api/v1/cancellation_impact_on_commission/{id}`
- `POST /api/v1/cancellation_impact_on_commission/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
