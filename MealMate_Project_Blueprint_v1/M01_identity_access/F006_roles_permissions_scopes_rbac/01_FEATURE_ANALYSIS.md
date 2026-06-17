# F006 — Feature Analysis

## Context
الميزة ضمن **M01 — إدارة الحسابات والوصول** وتؤثر على نطاق الموديول ووظائفه الأساسية.

## Business Analysis
### 1.1 عدم وجود Permission Catalog كامل
التوثيق يذكر صلاحيات عامة مثل `View`, `Create`, `Approve`, لكنه لا يقدم catalog كامل لكل موديولات MealMate.

الأثر: كل فريق قد يخترع صلاحياته بشكل مختلف، مما يسبب تضاربًا أمنيًا وتشغيليًا.

### 1.2 عدم ربط الصلاحيات بالمسؤوليات التجارية
لا يكفي تعريف الصلاحية تقنيًا. يجب ربطها بوظيفة فعلية:
- Operations يوافق على المطاعم والسائقين.
- Finance يرى التقارير المالية ولا يغير بيانات تشغيلية.
- Support يرى بيانات محدودة لحل الشكاوى.

الأثر: صلاحيات أكبر من الحاجة أو أقل من المطلوب.

### 1.3 لا يوجد نموذج واضح لتعدد الدول
MealMate يدعم multi-country. التوثيق لا يحدد الفرق بين:
- Global scope.
- Country scope.
- Region scope.
- Restaurant scope.
- Own account scope.

الأثر: أدمن دولة قد يرى أو يعدل بيانات دولة أخرى.

### 1.4 عدم وجود سياسة إدارة الصلاحيات
ينقص:
- من ينشئ role؟
- من يعدله؟
- هل توجد roles system لا تتغير؟
- هل يحتاج تعديل role إلى اعتماد؟

## Logic Analysis
### 2.1 Role + Permission بدون Scope خطر
التوثيق يذكر Scope، لكنه لا يشرح enforcement logic.

مثال: `F002.Approve` بدون Country Scope قد يسمح باعتماد أي مطعم في أي بلد.

### 2.2 لا يوجد resolution logic عند تعدد الأدوار
إذا كان المستخدم لديه أكثر من Role، يجب تحديد:
- هل الصلاحيات تتجمع؟
- هل يوجد deny override؟
- ماذا يحدث عند تعارض scopes؟

الأثر: نتائج authorization غير متوقعة.

### 2.3 لا يوجد caching/invalidation logic
الصلاحيات قد يتم تخزينها في token أو cache. التوثيق لا يحدد:
- متى يتم تحديث الصلاحيات؟
- هل تغيير role يبطل الجلسات؟
- هل token يحمل permissions أم يتم جلبها من السيرفر؟

الأثر: مستخدم قد يحتفظ بصلاحية بعد سحبها.

### 2.4 لا يوجد فصل بين system roles وcustom roles
يجب التمييز بين أدوار ثابتة وأدوار قابلة للتخصيص.

الأثر: تعديل role أساسي قد يكسر النظام كله.

## Data / API / Security Analysis
### 3.1 نموذج البيانات يحتاج تفصيل
ينقص:
- `Role`
- `Permission`
- `RolePermission`
- `UserRole`
- `ScopeAssignment`
- `PermissionDependency`
- `AccessPolicyVersion`

### 3.2 Audit لتغييرات الصلاحيات غير كافٍ
كل تغيير صلاحية يجب أن يسجل:
- من غير؟
- ماذا كان قبل وبعد؟
- السبب.
- هل تم بواسطة approval؟
- policy version.

### 3.3 لا توجد اختبارات authorization matrix
يجب بناء matrix tests لكل Role/Permission/Scope.

## Current Improvement Direction
1. **تعريف State Machine**
   - تحديد كل حالة مسموحة.
   - تحديد الانتقالات المسموحة والممنوعة.
   - ربط كل انتقال بصلاحية وسبب وAudit Log.

2. **تفصيل API Contract**
   - إضافة schemas لكل endpoint:
     - `GET /api/v1/roles_permissions_scopes_rbac`
     - `GET /api/v1/roles_permissions_scopes_rbac/{id}`
     - `POST /api/v1/roles_permissions_scopes_rbac`
     - `PUT /api/v1/roles_permissions_scopes_rbac/{id}`
     - `POST /api/v1/roles_permissions_scopes_rbac/{id}/actions/{action}`
   - توثيق status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
   - اعتماد `ProblemDetails` للأخطاء و`CorrelationId` للتتبع.

3. **تفصيل صلاحيات Role/Scope**
   - ربط كل شاشة وكل endpoint بصلاحية مثل `F006.View`, `F006.Create`, `F006.Update`, `F006.Override`.
   - تحديد Scope حسب الدولة والمنطقة والكيان المرتبط.

4. **تعريف نموذج البيانات**
   - تحديد الجداول/الـ collections.
   - تحديد العلاقات، الفهارس، unique constraints، وretention policy.
   - إضافة `RowVersion` أو optimistic concurrency.
