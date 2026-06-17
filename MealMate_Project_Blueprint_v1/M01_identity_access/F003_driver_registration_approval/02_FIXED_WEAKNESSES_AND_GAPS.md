# F003 — Fixed Weaknesses & Gaps

## الهدف
هذا الملف يحول نقاط الضعف والفجوات إلى قرارات تصميمية مغلقة قابلة للتنفيذ.

## الفجوات التي تم إغلاقها تصميميًا
- تعريف driver eligibility rules.
- ربط الوثائق بتاريخ انتهاء.
- إضافة الصورة الشخصية للمندوب كمتطلب اعتماد أساسي.
- إضافة Driver State Machine.
- تحديد scope جغرافي واضح.
- ربط الميزة بسياسات الخصوصية والتتبع.
- إضافة audit لكل قرار اعتماد أو تعليق.

## قرارات التصحيح المعتمدة
### Business
- كل ميزة يجب أن تملك KPI واحدًا على الأقل لقياس النجاح.
- كل قرار يدوي يحتاج owner وSLA وسبب واضح.
- أي أثر على العميل أو المطعم أو المالية يجب أن يظهر في الواجهة أو التقرير المناسب.
- لا يتم تفعيل المندوب قبل مراجعة صورته الشخصية مع مستندات الهوية والقيادة، لأن الصورة عنصر ثقة وتشغيل وليس مجرد بيانات ملف شخصي.

### Logic
- الحالات يجب أن تكون explicit ولا يسمح بالانتقال بينها إلا عبر action محدد.
- كل action حساس يحتاج idempotency وconcurrency control.
- أي override يجب أن يكون مسببًا ومقيدًا بصلاحية ونطاق.
- حالة `SubmittedForReview` تتطلب اكتمال البيانات والمستندات والصورة الشخصية، وحالة `NeedsChanges` تستخدم عند رفض الصورة أو أي مستند.

### Data / API / Security
- كل API يرجع ProblemDetails عند الخطأ.
- كل entity مهم يحتوي Status وCreatedAtUtc وUpdatedAtUtc وRowVersion.
- كل عملية حساسة تسجل AuditLog مع before/after/reason/correlationId.
- كل صلاحية تطبق Permission + Scope وليس Permission فقط.
- صورة المندوب تحفظ في storage آمن عبر `ProfileImageStorageKey`، وتراجع حالتها عبر `ProfileImageStatus`، ولا تعرض كرابط عام دائم.

## حالة المعالجة
Design gaps are considered **closed for implementation planning**. أي تغيير لاحق يجب أن ينعكس في هذا الملف وملف spec.
