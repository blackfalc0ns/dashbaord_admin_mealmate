# F005 — Feature Analysis

## Context
الميزة ضمن **M01 — إدارة الحسابات والوصول** وتؤثر على نطاق الموديول ووظائفه الأساسية.

## Business Analysis
### 1.1 عدم تحديد هيكل الأدمن
التوثيق لا يحدد أنواع الأدمن بوضوح:
- Super Admin.
- Country Admin.
- Operations Admin.
- Finance Admin.
- Support Admin.
- Read-only Auditor.

الأثر: قد يحصل مستخدم أدمن على صلاحيات أكبر من احتياجه الفعلي.

### 1.2 غياب حوكمة إضافة الأدمن
لا يوجد توضيح لمن يحق له إنشاء أدمن جديد أو تعديل صلاحياته.

الأثر: مخاطر داخلية عالية، خصوصًا في الصلاحيات المالية والاعتمادات.

### 1.3 لا يوجد maker-checker للعمليات الحساسة
بعض العمليات يجب ألا ينفذها شخص واحد منفردًا، مثل:
- إضافة Super Admin.
- منح صلاحيات مالية.
- تعطيل مستخدم إداري مهم.

الأثر: زيادة احتمالية الخطأ أو إساءة الاستخدام.

### 1.4 لا توجد سياسة مراجعة دورية للصلاحيات
لا يوجد Access Review كل فترة.

الأثر: صلاحيات قديمة تبقى فعالة بعد تغيير وظيفة الموظف.

## Logic Analysis
### 2.1 لا يوجد invitation flow
إدارة الأدمن تحتاج:
- دعوة بالبريد.
- صلاحية زمنية للدعوة.
- قبول الدعوة.
- إعداد كلمة المرور و2FA.

الأثر: إنشاء حسابات أدمن غير مكتملة أو غير آمنة.

### 2.2 منع self-privilege escalation غير موثق
لا يوجد نص يمنع الأدمن من رفع صلاحيات نفسه أو تعديل Scope الخاص به.

الأثر: خطر أمني كبير.

### 2.3 حالات الأدمن غير مفصلة
يجب وجود حالات:
- `Invited`
- `Active`
- `Suspended`
- `Revoked`
- `PasswordResetRequired`
- `MfaRequired`

الأثر: صعوبة إدارة lifecycle لمستخدمي الأدمن.

### 2.4 لا يوجد منطق واضح لتعطيل الحساب
عند تعطيل أدمن، يجب تحديد:
- هل تنتهي كل الجلسات فورًا؟
- هل تبقى audit logs؟
- ماذا عن المهام المفتوحة؟
- هل يتم نقل ownership؟

## Data / API / Security Analysis
### 3.1 2FA غير مذكور كإلزامي
الأدمن يجب أن يستخدم 2FA، خصوصًا للأدوار الحساسة.

### 3.2 APIs تحتاج حماية إضافية
عمليات مثل assign role وremove role يجب أن تحتاج:
- reason.
- actor permission.
- actor scope.
- audit.
- ربما approval ثانٍ.

### 3.3 لا يوجد session management للأدمن
ينقص:
- active sessions list.
- revoke all sessions.
- trusted devices.
- login history.

## Current Improvement Direction
1. **تعريف State Machine**
   - تحديد كل حالة مسموحة.
   - تحديد الانتقالات المسموحة والممنوعة.
   - ربط كل انتقال بصلاحية وسبب وAudit Log.

2. **تفصيل API Contract**
   - إضافة schemas لكل endpoint:
     - `GET /api/v1/admin_users_management`
     - `GET /api/v1/admin_users_management/{id}`
     - `POST /api/v1/admin_users_management`
     - `PUT /api/v1/admin_users_management/{id}`
     - `POST /api/v1/admin_users_management/{id}/actions/{action}`
   - توثيق status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
   - اعتماد `ProblemDetails` للأخطاء و`CorrelationId` للتتبع.

3. **تفصيل صلاحيات Role/Scope**
   - ربط كل شاشة وكل endpoint بصلاحية مثل `F005.View`, `F005.Create`, `F005.Update`, `F005.Override`.
   - تحديد Scope حسب الدولة والمنطقة والكيان المرتبط.

4. **تعريف نموذج البيانات**
   - تحديد الجداول/الـ collections.
   - تحديد العلاقات، الفهارس، unique constraints، وretention policy.
   - إضافة `RowVersion` أو optimistic concurrency.
