# F006 — نقاط الضعف التفصيلية

## الميزة
**Roles, Permissions & Scopes (RBAC)**  
الميزة مسؤولة عن تحديد من يملك أي صلاحية، وعلى أي نطاق، وداخل أي دولة أو كيان.

## 1. نقاط ضعف من ناحية الـ Business
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

## 2. نقاط ضعف من ناحية الـ Logic / منطق التشغيل
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

## 3. نقاط ضعف Data / API / Security
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

## 4. أثر نقاط الضعف
- تسريب بيانات عبر الدول أو المناطق.
- تعطيل وظائف بسبب صلاحيات ناقصة.
- بقاء صلاحيات قديمة بعد تغيير role.
- صعوبة التحقيق في قرارات الوصول.
- إعادة بناء مكلفة لاحقًا.

## 5. المطلوب لتقوية الميزة
- إنشاء Permission Catalog كامل.
- تعريف Scope Model رسمي.
- تحديد authorization resolution algorithm.
- إضافة permission cache invalidation.
- منع تعديل system roles بدون ضوابط.
- بناء test matrix لكل الصلاحيات.

