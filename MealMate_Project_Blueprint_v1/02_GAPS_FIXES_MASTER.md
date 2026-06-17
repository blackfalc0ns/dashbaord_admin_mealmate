# MealMate — Master Gaps & Fixes

## الفجوات المتكررة على مستوى المشروع
- غياب State Machines تفصيلية في كثير من الميزات.
- API contracts غير مكتملة في الملفات الأصلية.
- نموذج البيانات يحتاج علاقات وقيود وفهارس واضحة.
- RBAC + Scope غير مفصلين كفاية في كل الإجراءات.
- Audit موجود كمبدأ لكنه يحتاج event schema إلزامية.
- الأثر المالي يحتاج Business Events وLedger/Journal بدل تعديل مباشر.
- معايير القبول تحتاج تحويل إلى Given/When/Then واختبارات.

## طريقة المعالجة في هذه النسخة
كل ميزة تحتوي على ملف `02_FIXED_WEAKNESSES_AND_GAPS.md` يلخص الفجوات ويغلقها تصميميًا، وملف `03_SPEC_AFTER_FIXES.md` يحول المعالجة إلى مواصفة تنفيذ.

## فهرس سريع
- [M01 — M01 — إدارة الحسابات والوصول](M01_identity_access/MODULE_ANALYSIS.md)
- [M02 — M02 — البرامج والاشتراكات](M02_programs_subscriptions/MODULE_ANALYSIS.md)
- [M03 — M03 — التقويم والوجبات](M03_calendar_meals/MODULE_ANALYSIS.md)
- [M04 — M04 — المطاعم والتشغيل](M04_restaurant_operations/MODULE_ANALYSIS.md)
- [M05 — M05 — السائق والتوصيل](M05_driver_delivery/MODULE_ANALYSIS.md)
- [M06 — M06 — الشكاوى والدعم](M06_complaints_support/MODULE_ANALYSIS.md)
- [M07 — M07 — النظام المالي والمحاسبي المركزي](M07_central_accounting/MODULE_ANALYSIS.md)
- [M08 — M08 — النظام المالي للعميل](M08_customer_finance/MODULE_ANALYSIS.md)
- [M09 — M09 — النظام المالي للمطعم](M09_restaurant_finance/MODULE_ANALYSIS.md)
- [M10 — M10 — نظام المؤثرين](M10_influencers/MODULE_ANALYSIS.md)
- [M11 — M11 — الحملات التشاركية](M11_collaborative_campaigns/MODULE_ANALYSIS.md)
- [M12 — M12 — لوحة تحكم الأدمن](M12_admin_dashboard/MODULE_ANALYSIS.md)
