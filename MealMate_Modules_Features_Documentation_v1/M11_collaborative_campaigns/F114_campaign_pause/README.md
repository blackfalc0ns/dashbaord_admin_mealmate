# F114 — إيقاف الحملة مؤقتًا

## Campaign Pause

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F114` |
| Module | M11 — الحملات التشاركية |
| Source Type | جديد |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **إيقاف الحملة مؤقتًا** جزء من **الحملات التشاركية**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- الأدمن
- المطعم
- العميل
- النظام المالي

## السيناريو الرئيسي
1. إنشاء/فتح الحملة.
2. التحقق من الحالة والفترة.
3. تطبيق الخصم والطاقة.
4. جمع الموافقات.
5. حفظ Snapshot.
6. تحديث التقارير.

## قواعد العمل الأساسية
- إجمالي الخصم = نصيب المطعم + المنصة.
- لا إطلاق قبل تحقق الطاقة.
- رفع السقف بعد الإطلاق يحتاج مراجعة.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `Campaign`
- `CampaignProgram`
- `CampaignBundle`
- `CampaignRestaurant`
- `CampaignCapacity`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/campaign_pause`
- `GET /api/v1/campaign_pause/{id}`
- `POST /api/v1/campaign_pause`
- `PUT /api/v1/campaign_pause/{id}`
- `POST /api/v1/campaign_pause/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
