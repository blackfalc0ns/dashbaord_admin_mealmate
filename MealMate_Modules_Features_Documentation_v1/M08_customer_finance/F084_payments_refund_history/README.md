# F084 — سجل المدفوعات والاستردادات

## Payments & Refund History

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F084` |
| Module | M08 — النظام المالي للعميل |
| Source Type | جديد |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **سجل المدفوعات والاستردادات** جزء من **النظام المالي للعميل**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- العميل
- المالية
- المحفظة
- البنك

## السيناريو الرئيسي
1. عرض الرصيد.
2. التحقق من الأهلية.
3. إنشاء حركة Pending.
4. المراجعة.
5. التنفيذ.
6. تحديث الرصيد والسجل.

## قواعد العمل الأساسية
- النقدي قابل للسحب والترويجي غير قابل.
- الرصيد لا يصبح سالبًا.
- السحب يحتاج بيانات بنكية ومراجعة.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `CustomerWallet`
- `WalletTransaction`
- `Refund`
- `CancellationFee`
- `WithdrawalRequest`
- `BankAccount`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/payments_refund_history`
- `GET /api/v1/payments_refund_history/{id}`
- `POST /api/v1/payments_refund_history`
- `PUT /api/v1/payments_refund_history/{id}`
- `POST /api/v1/payments_refund_history/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
