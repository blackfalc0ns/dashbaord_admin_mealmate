# F071 — المصروفات التشغيلية

## Operating Expenses

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F071` |
| Module | M07 — النظام المالي والمحاسبي المركزي |
| Source Type | جديد |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **المصروفات التشغيلية** جزء من **النظام المالي والمحاسبي المركزي**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- الأدمن المالي
- النظام المحاسبي
- بوابة الدفع
- المدقق

## السيناريو الرئيسي
1. استقبال حدث مالي.
2. التحقق من المصدر.
3. اختيار قالب القيد.
4. موازنة القيد.
5. الترحيل.
6. تحديث التقارير.

## قواعد العمل الأساسية
- دفتر الأستاذ مصدر الحقيقة.
- كل قيد متوازن.
- التصحيح بقيد عكسي لا حذف.
- **قاعدة خاصة:** حفظ Snapshot للقواعد المؤثرة وقت التنفيذ.
- **قاعدة خاصة:** الـBackend هو المصدر النهائي للحسابات.
- **قاعدة خاصة:** العمليات المكررة تمنع بـIdempotency.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `Account`
- `JournalEntry`
- `JournalLine`
- `FinancialSetting`
- `DeferredRevenue`
- `Payable`
- `Settlement`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/operating_expenses`
- `GET /api/v1/operating_expenses/{id}`
- `POST /api/v1/operating_expenses`
- `PUT /api/v1/operating_expenses/{id}`
- `POST /api/v1/operating_expenses/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
