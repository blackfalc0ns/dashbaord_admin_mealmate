# F121 — متابعة نافذة 72 ساعة

## 72h Operations Monitoring

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F121` |
| Module | M12 — لوحة تحكم الأدمن |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **متابعة نافذة 72 ساعة** جزء من **لوحة تحكم الأدمن**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- Super Admin
- Country Admin
- Operations Admin
- Finance Admin
- Support Admin

## السيناريو الرئيسي
1. فتح الصفحة.
2. تطبيق RBAC/Scope.
3. عرض KPIs والبيانات.
4. تنفيذ إجراء.
5. تحديث النتيجة.
6. تسجيل الإجراء.

## قواعد العمل الأساسية
- البيانات داخل Scope فقط.
- الإجراءات الحساسة بصلاحية وسبب.
- كل صفحة تدعم Loading/Empty/Error/Denied.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `DashboardWidget`
- `ApprovalQueue`
- `OperationalAlert`
- `KPI`
- `ReportDefinition`
- `Notification`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/72h_operations_monitoring`
- `GET /api/v1/72h_operations_monitoring/{id}`
- `POST /api/v1/72h_operations_monitoring`
- `PUT /api/v1/72h_operations_monitoring/{id}`
- `POST /api/v1/72h_operations_monitoring/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
