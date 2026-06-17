# F022 — قاعدة قفل 72 ساعة

## 72-Hour Lock Rule

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F022` |
| Module | M03 — التقويم والوجبات |
| Source Type | قديم / Miro |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **قاعدة قفل 72 ساعة** جزء من **التقويم والوجبات**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- العميل
- المطعم
- الأدمن التشغيلي
- Scheduler

## السيناريو الرئيسي
1. فتح التقويم.
2. تحميل اليوم والقيود.
3. تطبيق الوقت والطاقة والتفضيلات.
4. تنفيذ الاختيار.
5. تأكيد الحالة.
6. إشعار الأطراف.

## قواعد العمل الأساسية
- قفل اليوم عند 72 ساعة.
- الاختيار التلقائي يطبق الحساسية والمنطقة والطاقة والـLimit.
- Override يحتاج سببًا وسجلًا.
- **قاعدة خاصة:** قبل 72 ساعة يمكن التعديل.
- **قاعدة خاصة:** عند 72 ساعة يُقفل اليوم ويرسل للمطعم.
- **قاعدة خاصة:** تأخر التأكيد يولد تصعيدًا.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `SubscriptionCalendar`
- `CalendarDay`
- `MealSelection`
- `Preference`
- `Allergy`
- `FreezeRequest`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/72_hour_lock_rule`
- `GET /api/v1/72_hour_lock_rule/{id}`
- `POST /api/v1/72_hour_lock_rule`
- `PUT /api/v1/72_hour_lock_rule/{id}`
- `POST /api/v1/72_hour_lock_rule/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
