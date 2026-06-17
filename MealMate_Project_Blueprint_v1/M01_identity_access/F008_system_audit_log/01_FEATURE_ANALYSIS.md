# F008 — Feature Analysis

## Context
الميزة ضمن **M01 — إدارة الحسابات والوصول** وتؤثر على نطاق الموديول ووظائفه الأساسية.

## Business Analysis
### 1.1 عدم تحديد ما يجب تدقيقه إلزاميًا
التوثيق يقول إن العمليات الحساسة تسجل، لكنه لا يحدد القائمة الرسمية.

أمثلة إلزامية:
- approve/reject restaurant.
- approve/reject driver.
- assign/remove role.
- document approve/reject.
- suspend/reactivate account.
- override business rule.

الأثر: بعض العمليات المهمة قد تمر بدون أثر تدقيقي.

### 1.2 لا توجد سياسة retention
لا يوجد تحديد لمدة حفظ audit logs.

الأثر: قد تحذف سجلات مطلوبة لتحقيق أو نزاع أو مراجعة مالية.

### 1.3 لا يوجد تعريف لاستخدام السجل في الدعم والتشغيل
Audit Log ليس فقط للأمن. يستخدم في:
- حل النزاعات.
- معرفة من اتخذ قرارًا.
- مراجعة أخطاء التشغيل.
- تتبع مشاكل العملاء والمطاعم.

الأثر: إذا صمم كجدول تقني فقط، لن يخدم فرق التشغيل.

### 1.4 لا توجد KPIs أو تقارير تدقيق
ينقص:
- عدد overrides.
- أكثر الأدمنز تنفيذًا لتغييرات حساسة.
- قرارات الرفض حسب السبب.
- تغييرات الصلاحيات.

## Logic Analysis
### 2.1 before/after غير محدد
التوثيق يذكر before/after، لكن لا يحدد الصيغة أو الحقول المستثناة.

الأثر: تخزين بيانات حساسة بالكامل أو تخزين بيانات غير كافية للتحقيق.

### 2.2 correlation غير مكتمل
يجب ربط كل logs بـ:
- Correlation ID.
- Request ID.
- Actor ID.
- Entity ID.
- Source IP/device.

الأثر: صعوبة تتبع عملية كاملة عبر عدة خدمات.

### 2.3 لا يوجد tamper protection
Audit Log يجب أن يكون append-only أو محميًا من التعديل.

الأثر: مستخدم بصلاحية عالية قد يعدل أو يحذف أثر العملية.

### 2.4 لا يوجد severity/action taxonomy
العمليات تحتاج تصنيفًا:
- `Security`
- `Approval`
- `Financial`
- `Permission`
- `Document`
- `Override`

الأثر: صعوبة البحث والتنبيه والتحليل.

## Data / API / Security Analysis
### 3.1 نموذج البيانات ناقص
ينقص:
- `AuditEvent`
- `AuditEventType`
- `ActorSnapshot`
- `EntitySnapshot`
- `CorrelationId`
- `RiskLevel`
- `Source`

### 3.2 صلاحيات عرض السجل غير محددة
ليس كل أدمن يجب أن يرى كل Audit Logs. يجب وجود Scope وmasking.

### 3.3 البحث والتصفية غير مفصلين
Audit بدون search قوي يصبح غير مفيد. المطلوب فلترة حسب:
- actor.
- entity.
- date range.
- event type.
- risk level.
- country/scope.

## Current Improvement Direction
1. **تعريف State Machine**
   - تحديد كل حالة مسموحة.
   - تحديد الانتقالات المسموحة والممنوعة.
   - ربط كل انتقال بصلاحية وسبب وAudit Log.

2. **تفصيل API Contract**
   - إضافة schemas لكل endpoint:
     - `GET /api/v1/system_audit_log`
     - `GET /api/v1/system_audit_log/{id}`
     - `POST /api/v1/system_audit_log`
     - `PUT /api/v1/system_audit_log/{id}`
     - `POST /api/v1/system_audit_log/{id}/actions/{action}`
   - توثيق status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
   - اعتماد `ProblemDetails` للأخطاء و`CorrelationId` للتتبع.

3. **تفصيل صلاحيات Role/Scope**
   - ربط كل شاشة وكل endpoint بصلاحية مثل `F008.View`, `F008.Create`, `F008.Update`, `F008.Override`.
   - تحديد Scope حسب الدولة والمنطقة والكيان المرتبط.

4. **تعريف نموذج البيانات**
   - تحديد الجداول/الـ collections.
   - تحديد العلاقات، الفهارس، unique constraints، وretention policy.
   - إضافة `RowVersion` أو optimistic concurrency.
