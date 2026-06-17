# F124 — Fixed Weaknesses & Gaps

## الهدف
هذا الملف يحول نقاط الضعف والفجوات إلى قرارات تصميمية مغلقة قابلة للتنفيذ.

## الفجوات التي تم إغلاقها تصميميًا
1. كتابة state machine مخصصة للميزة.
2. تعريف business owner وoperational owner.
3. تفصيل API contract كامل.
4. تفصيل data model والقيود والفهارس.
5. ربط كل عملية بـ RBAC + Scope + Audit.
6. إضافة KPIs خاصة بالميزة.
7. تحويل معايير القبول إلى test scenarios.
8. تحديد أثر الميزة على الموديولات المرتبطة.

## قرارات التصحيح المعتمدة
### Business
- كل ميزة يجب أن تملك KPI واحدًا على الأقل لقياس النجاح.
- كل قرار يدوي يحتاج owner وSLA وسبب واضح.
- أي أثر على العميل أو المطعم أو المالية يجب أن يظهر في الواجهة أو التقرير المناسب.

### Logic
- الحالات يجب أن تكون explicit ولا يسمح بالانتقال بينها إلا عبر action محدد.
- كل action حساس يحتاج idempotency وconcurrency control.
- أي override يجب أن يكون مسببًا ومقيدًا بصلاحية ونطاق.

### Data / API / Security
- كل API يرجع ProblemDetails عند الخطأ.
- كل entity مهم يحتوي Status وCreatedAtUtc وUpdatedAtUtc وRowVersion.
- كل عملية حساسة تسجل AuditLog مع before/after/reason/correlationId.
- كل صلاحية تطبق Permission + Scope وليس Permission فقط.

## حالة المعالجة
Design gaps are considered **closed for implementation planning**. أي تغيير لاحق يجب أن ينعكس في هذا الملف وملف spec.
