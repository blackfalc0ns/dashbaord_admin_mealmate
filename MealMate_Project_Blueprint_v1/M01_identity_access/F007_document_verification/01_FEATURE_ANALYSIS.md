# F007 — Feature Analysis

## Context
الميزة ضمن **M01 — إدارة الحسابات والوصول** وتؤثر على نطاق الموديول ووظائفه الأساسية.

## Business Analysis
### 1.1 عدم تحديد أنواع الوثائق حسب الحساب
التوثيق لا يفرق بين وثائق:
- المطعم.
- السائق.
- المؤثر.
- الأدمن أو الشركة.

الأثر: نفس workflow قد يستخدم لوثائق مختلفة تمامًا، مما يسبب نقصًا في التحقق.

### 1.2 عدم تحديد متطلبات الوثائق حسب الدولة
الوثائق المطلوبة تختلف حسب البلد. لا يوجد policy يربط الوثيقة بالدولة.

الأثر: اعتماد غير قانوني في بعض الدول أو طلب وثائق غير لازمة في دول أخرى.

### 1.3 لا يوجد SLA للمراجعة
لا يوجد زمن محدد لمراجعة الوثائق أو طلب الاستكمال.

الأثر: تعطيل onboarding للمطاعم والسائقين.

### 1.4 لا يوجد تعريف لتأثير رفض الوثيقة
رفض وثيقة قد يعني:
- بقاء الحساب Pending.
- تعليق حساب Active.
- منع استلام الطلبات.
- طلب إعادة رفع.

الأثر: قرارات تشغيلية غير واضحة.

## Logic Analysis
### 2.1 State Machine ناقصة
الوثيقة تحتاج حالات:
- `Required`
- `Uploaded`
- `PendingReview`
- `Approved`
- `Rejected`
- `Expired`
- `ResubmissionRequired`

الأثر: صعوبة تحديد هل الكيان جاهز للاعتماد أم لا.

### 2.2 لا يوجد versioning للوثائق
عند إعادة رفع وثيقة، يجب حفظ النسخة القديمة وعدم حذفها.

الأثر: فقدان تاريخ مهم عند النزاع أو المراجعة.

### 2.3 انتهاء الصلاحية غير مفصل
بعض الوثائق لها تاريخ انتهاء. لا يوجد:
- expiry date.
- إشعار قبل الانتهاء.
- تعليق تلقائي.
- grace period.

الأثر: استمرار تشغيل كيان بوثائق منتهية.

### 2.4 الرفض لا يحتوي تصنيفًا واضحًا
أسباب الرفض يجب أن تكون structured:
- unreadable.
- expired.
- wrong document type.
- mismatch data.
- suspected fraud.

الأثر: صعوبة التحليل وتحسين جودة الرفع.

## Data / API / Security Analysis
### 3.1 تخزين الملفات غير موثق
ينقص:
- storage provider.
- encryption.
- access signed URLs.
- virus scanning.
- max file size.
- allowed extensions.

### 3.2 الخصوصية عالية المخاطر
الوثائق تحتوي بيانات حساسة. يجب تحديد من يرى الملف كاملًا ومن يرى metadata فقط.

### 3.3 APIs تحتاج فصل واضح
المطلوب:
- request required document.
- upload document.
- approve.
- reject.
- replace.
- mark expired.

## Current Improvement Direction
1. **تعريف State Machine**
   - تحديد كل حالة مسموحة.
   - تحديد الانتقالات المسموحة والممنوعة.
   - ربط كل انتقال بصلاحية وسبب وAudit Log.

2. **تفصيل API Contract**
   - إضافة schemas لكل endpoint:
     - `GET /api/v1/document_verification`
     - `GET /api/v1/document_verification/{id}`
     - `POST /api/v1/document_verification`
     - `PUT /api/v1/document_verification/{id}`
     - `POST /api/v1/document_verification/{id}/actions/{action}`
   - توثيق status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
   - اعتماد `ProblemDetails` للأخطاء و`CorrelationId` للتتبع.

3. **تفصيل صلاحيات Role/Scope**
   - ربط كل شاشة وكل endpoint بصلاحية مثل `F007.View`, `F007.Create`, `F007.Update`, `F007.Override`.
   - تحديد Scope حسب الدولة والمنطقة والكيان المرتبط.

4. **تعريف نموذج البيانات**
   - تحديد الجداول/الـ collections.
   - تحديد العلاقات، الفهارس، unique constraints، وretention policy.
   - إضافة `RowVersion` أو optimistic concurrency.
