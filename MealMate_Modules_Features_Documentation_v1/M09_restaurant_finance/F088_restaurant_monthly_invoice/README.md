# F088 — الفاتورة الشهرية للمطعم

## Restaurant Monthly Invoice

> This folder contains the feature explanation, weaknesses, proposed improvements, and diagrams.

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | `F088` |
| Module | M09 — النظام المالي للمطعم |
| Source Type | جديد |
| Status | Draft for Review |
| Generated | 2026-06-15 |

## الشرح المختصر
ميزة **الفاتورة الشهرية للمطعم** جزء من **النظام المالي للمطعم**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## الهدف
- توحيد تنفيذ الميزة وتقليل الأخطاء اليدوية.
- جعل القرارات والحالات قابلة للتتبع والقياس.
- دعم تعدد الدول والمناطق والعملات واللغات.
- توفير أساس واضح للتطوير والاختبار والتسليم.

## المستخدمون والأطراف
- المطعم
- الأدمن المالي
- النظام المحاسبي

## السيناريو الرئيسي
1. احتساب المستحق.
2. إنشاء فاتورة/طلب.
3. المراجعة.
4. اعتماد الدفع.
5. ربط الإيصال.
6. تحديث المتبقي.

## قواعد العمل الأساسية
- المستحق من الوجبات المسلمة فقط.
- الخصومات تظهر كبنود مستقلة.
- الدفع الجزئي لا يغلق الفاتورة.
- **قاعدة خاصة:** فاتورة شهرية من الوجبات والتسويات.
- **قاعدة خاصة:** إجمالي/خصومات/مدفوع/متبقي.
- **قاعدة خاصة:** Unpaid/Partially Paid/Paid.
- تخزين الوقت UTC وعرضه حسب الدولة.
- تخزين المال Decimal مع Currency Code.
- حفظ Before/After/Reason في العمليات الحساسة.

## البيانات والتكامل
### البيانات
- `RestaurantPayable`
- `DeliveredMeal`
- `RestaurantInvoice`
- `RestaurantPayment`
- `TransferReceipt`
### حقول قياسية
`Id`, `Status`, `CountryId`, `CreatedAtUtc`, `CreatedBy`, `UpdatedAtUtc`, `UpdatedBy`, `RowVersion`, `Reason`, `SourceReference`.

### APIs
- `GET /api/v1/restaurant_monthly_invoice`
- `GET /api/v1/restaurant_monthly_invoice/{id}`
- `POST /api/v1/restaurant_monthly_invoice`
- `PUT /api/v1/restaurant_monthly_invoice/{id}`
- `POST /api/v1/restaurant_monthly_invoice/{id}/actions/{action}`
### معايير API
Pagination، Filtering، Sorting، Problem Details، Correlation ID، Idempotency-Key.

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
