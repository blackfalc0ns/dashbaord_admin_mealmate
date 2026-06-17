# F108 — Feature Analysis

## Context
الميزة ضمن **M11 — الحملات التشاركية** وتؤثر على نطاق الموديول ووظائفه الأساسية.

## Business Analysis
### 1.1 الهدف التجاري يحتاج ربطًا بنتيجة قابلة للقياس
التوثيق الحالي يشرح الإطار العام للميزة، لكنه لا يحدد بدقة ما النتيجة التجارية التي تثبت نجاحها داخل MealMate.

أمثلة مؤشرات يجب تعريفها:
- معدل نجاح العملية.
- معدل الفشل أو الرفض.
- زمن إكمال العملية.
- عدد الحالات التي تحتاج تدخل يدوي.
- أثر الميزة على الربحية أو رضا المستخدم عند وجود أثر مباشر.

### 1.2 خصوصية الميزة داخل الموديول غير كافية
الميزة تؤثر على النمو والربحية والطاقة في نفس الوقت، لذلك تحتاج قواعد أهلية وسقف وتكلفة واضحة.

### 1.3 قواعد الموديول التجارية تحتاج تفصيلًا
داخل M11 — الحملات التشاركية توجد نقاط Business مؤثرة:
- الحملة التشاركية تمس العميل والمطعم والمنصة في نفس الوقت، وأي ضعف في توزيع الخصم يؤثر على الربحية.
- غياب قواعد انضمام المطاعم والطاقة قد يؤدي إلى حملة ناجحة تسويقيًا وفاشلة تشغيليًا.
- سقف المشتركين يجب أن يرتبط بالطاقة والميزانية وليس رقمًا يدويًا فقط.
- غياب KPIs مثل campaign ROI، capacity utilization، discount burn، وrestaurant participation يقلل فاعلية الحملات.

### 1.4 غياب Ownership وSLA
لا يوجد تحديد واضح لـ:
- مالك القرار التجاري.
- مالك التشغيل اليومي.
- زمن الاستجابة المتوقع.
- متى يتم التصعيد للأدمن أو المالية أو الدعم.

الأثر: نفس الحالة قد يتم التعامل معها بطرق مختلفة حسب الموظف أو الدولة.

## Logic Analysis
### 2.1 State Machine غير كافية
الحالات العامة مثل `Draft`, `Pending`, `Active`, `Rejected` لا تكفي وحدها. الميزة تحتاج حالات انتقال دقيقة تمنع القفز من مرحلة لأخرى بدون تحقق.

المطلوب تحديد:
- الحالة الابتدائية.
- الحالات المسموحة.
- الانتقالات المسموحة والممنوعة.
- من يملك كل انتقال.
- هل الانتقال يحتاج سببًا أو وثيقة أو approval.

### 2.2 ترتيب القواعد غير واضح
تحتاج lifecycle للحملة وتقييم أثر أي تعديل على المشتركين والمطاعم والخصم.

قواعد الموديول التي تحتاج ضبطًا:
- الحملة تحتاج lifecycle واضح: draft, enrollment, review, approved, launched, paused, completed.
- توزيع الخصم يجب أن ينتج أثرًا ماليًا واضحًا على المنصة والمطعم.
- زيادة سقف المشتركين يجب أن تعيد فحص الطاقة والميزانية.
- إيقاف الحملة يجب أن يحدد أثره على المشتركين الحاليين والجدد.

### 2.3 منطق الـ Override غير محدد
لا يكفي قول إن الأدمن يستطيع override. يجب تحديد:
- متى يسمح بالـ override؟
- ما الصلاحية المطلوبة؟
- هل يحتاج موافقة ثانية؟
- ما السبب الإلزامي؟
- هل ينتج أثرًا ماليًا أو تشغيليًا؟

### 2.4 التزامن والتكرار غير مغطى بشكل كافٍ
أي عملية يمكن تنفيذها مرتين أو من مستخدمين مختلفين تحتاج:
- Idempotency-Key.
- optimistic concurrency / RowVersion.
- منع duplicate requests.
- نتيجة واضحة عند تكرار نفس الطلب.

## Data / API / Security Analysis
### 3.1 نموذج البيانات يحتاج تفصيلًا
الكيانات المتوقعة في هذا السياق تشمل:
- `Campaign`
- `CampaignDiscountSplit`
- `CampaignBundle`
- `CampaignEnrollment`
- `CampaignCapacity`
- `SubscriberCap`
- `CampaignAccounting`

بالنسبة لهذه الميزة تحديدًا:
- يلزم snapshot للحملة، discount split، capacity allocation، وfinancial impact.

### 3.2 API Contract غير مكتمل
ينقص في التوثيق:
- request schema.
- response schema.
- validation rules.
- status codes.
- ProblemDetails للأخطاء.
- pagination/filtering/sorting عند القوائم.
- correlation id في كل request.

### 3.3 الصلاحيات والنطاق غير كافيين
كل API يجب أن يحدد:
- permission code.
- scope المطلوب.
- هل المستخدم يرى بياناته فقط أم بيانات دولة/منطقة/كيان.
- هل يوجد masking للبيانات الحساسة.

### 3.4 Audit غير مفصل
كل عملية حساسة يجب أن تسجل:
- actor.
- action.
- entity.
- before/after.
- reason.
- source/channel.
- correlation id.

## Current Improvement Direction
1. **تعريف State Machine**
   - تحديد كل حالة مسموحة.
   - تحديد الانتقالات المسموحة والممنوعة.
   - ربط كل انتقال بصلاحية وسبب وAudit Log.

2. **تفصيل API Contract**
   - إضافة schemas لكل endpoint:
     - `GET /api/v1/restaurant_campaign_enrollment`
     - `GET /api/v1/restaurant_campaign_enrollment/{id}`
     - `POST /api/v1/restaurant_campaign_enrollment`
     - `PUT /api/v1/restaurant_campaign_enrollment/{id}`
     - `POST /api/v1/restaurant_campaign_enrollment/{id}/actions/{action}`
   - توثيق status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
   - اعتماد `ProblemDetails` للأخطاء و`CorrelationId` للتتبع.

3. **تفصيل صلاحيات Role/Scope**
   - ربط كل شاشة وكل endpoint بصلاحية مثل `F108.View`, `F108.Create`, `F108.Update`, `F108.Override`.
   - تحديد Scope حسب الدولة والمنطقة والكيان المرتبط.

4. **تعريف نموذج البيانات**
   - تحديد الجداول/الـ collections.
   - تحديد العلاقات، الفهارس، unique constraints، وretention policy.
   - إضافة `RowVersion` أو optimistic concurrency.
