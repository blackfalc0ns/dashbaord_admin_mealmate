# F008 — سجل التدقيق العام

## System Audit Log

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F008` |
| Module | M01 — إدارة الحسابات والوصول |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **سجل التدقيق العام** جزء من **إدارة الحسابات والوصول**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- العميل
- المطعم
- السائق
- المؤثر
- الأدمن

## السيناريو الرئيسي
1. بدء الطلب.
2. التحقق من الهوية والحالة.
3. تطبيق الصلاحية والنطاق.
4. حفظ النتيجة.
5. إرسال إشعار وتسجيل التدقيق.

## قواعد العمل الأساسية
- التحقق من الهوية وحالة الحساب قبل الوصول.
- التفويض يعتمد Role + Permission + Scope.
- كل اعتماد أو رفض أو تعديل صلاحيات يُسجل.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `User`
- `Role`
- `Permission`
- `Scope`
- `Document`
- `AuditLog`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/system_audit_log`
- `GET /api/v1/system_audit_log/{id}`
- `POST /api/v1/system_audit_log`
- `PUT /api/v1/system_audit_log/{id}`
- `POST /api/v1/system_audit_log/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
