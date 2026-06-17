# F009 — إدارة البرامج الغذائية

## Nutrition Programs Management

| Item | Value |
|---|---|
| Module | M02 — M02 — البرامج والاشتراكات |
| Status | Corrected Blueprint |
| Generated | 2026-06-15 |

## الملفات
- [01_FEATURE_ANALYSIS.md](01_FEATURE_ANALYSIS.md)
- [02_FIXED_WEAKNESSES_AND_GAPS.md](02_FIXED_WEAKNESSES_AND_GAPS.md)
- [03_SPEC_AFTER_FIXES.md](03_SPEC_AFTER_FIXES.md)
- [04_ACCEPTANCE_TESTS.md](04_ACCEPTANCE_TESTS.md)
- [05_DIAGRAMS.md](05_DIAGRAMS.md)

## ملخص
ميزة **إدارة البرامج الغذائية** جزء من **البرامج والاشتراكات**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

يجب أن يعتمد التسعير ومحتوى الباقة على `SubscriptionSnapshot` وقت الشراء حتى لا تتأثر الاشتراكات القديمة بأي تغيير لاحق في الأسعار أو الخصومات أو المطاعم داخل الباقة. إذا اشترك العميل في باقة تحتوي 20 مطعم، يتم حفظ عدد وقائمة المطاعم داخل الـ snapshot، وأي مطعم يضاف بعد ذلك لا يظهر لهذا الاشتراك القديم إلا بترقية/تجديد أو قرار واضح.
