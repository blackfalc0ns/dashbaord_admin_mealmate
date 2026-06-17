# F009 — Acceptance Tests

## Acceptance Criteria
1. المستخدم بدون صلاحية لا يستطيع الوصول للميزة.
2. المستخدم بصلاحية صحيحة ونطاق خاطئ يتم منعه.
3. كل action حساس يسجل AuditLog.
4. كل خطأ validation يرجع رسالة واضحة ومترجمة.
5. تكرار نفس الطلب لا ينتج duplicate effect.
6. التحديث المتزامن لا يسبب فقدان بيانات.
7. كل انتقال حالة غير مسموح يتم رفضه.
8. الواجهة تعرض Loading/Empty/Error/Permission Denied.
9. السعر النهائي يحفظ في `SubscriptionSnapshot` وقت الشراء.
10. تغيير الأسعار لاحقا لا يؤثر على الاشتراكات القديمة.
11. حالات الاشتراك تفرق بين `Draft`, `PendingPayment`, `Active`, `Upgraded`, `Renewed`, `Cancelled`, و`Expired`.
12. الخصم يطبق مرة واحدة وبترتيب واضح مع السعر الأساسي والتصنيف والعملة.
13. الترقية والتجديد يدعمان `Idempotency-Key` ولا ينتجان تحصيل أو تحديث مكرر.
14. كل قرار تسعير يمكن تفسيره من خلال `PricingRuleVersion` و`SubscriptionSnapshot`.
15. محتوى الباقة يحفظ وقت الاشتراك، بما يشمل عدد وقائمة المطاعم المتاحة.
16. إضافة مطعم جديد للباقة بعد اشتراك العميل لا تظهر في اشتراك العميل القديم تلقائيا.

## Given / When / Then
### Happy Path
Given مستخدم لديه الصلاحية والنطاق الصحيح  
When ينفذ العملية الأساسية للميزة  
Then يتم حفظ النتيجة وتحديث الحالة وتسجيل AuditLog

### Price Snapshot At Purchase
Given عميل اختار برنامج غذائي وباقة وسعرها الحالي 100  
When يدفع الاشتراك بنجاح  
Then يتم إنشاء `SubscriptionSnapshot` يحتوي `BasePrice=100` و`FinalAmount` و`PricingRuleVersion`

### Package Restaurants Snapshot At Purchase
Given باقة تحتوي 20 مطعم وقت اختيار العميل لها  
When يدفع العميل الاشتراك بنجاح  
Then يتم إنشاء `SubscriptionSnapshot` يحتوي `RestaurantCount=20` و`IncludedRestaurantIds` للمطاعم العشرين

### New Restaurant Does Not Affect Old Subscription
Given عميل لديه اشتراك نشط محفوظ في snapshot يحتوي 20 مطعم  
When الأدمن يضيف مطعما جديدا لنفس الباقة بعد وقت الاشتراك  
Then يظل اشتراك العميل يعرض 20 مطعم فقط ولا يظهر المطعم الجديد تلقائيا

### New Subscription Gets Latest Package Content
Given الأدمن أضاف مطعما جديدا للباقة فأصبحت تحتوي 21 مطعم  
When عميل جديد يشترك في نفس الباقة  
Then يتم إنشاء snapshot جديدة تحتوي `RestaurantCount=21`

### Old Subscription Not Affected By Price Change
Given اشتراك قديم لديه `SubscriptionSnapshot` بسعر 100  
When الأدمن يغير سعر نفس الباقة إلى 120  
Then يظل الاشتراك القديم بسعر 100 وتستخدم الباقة الجديدة سعر 120 للاشتراكات الجديدة فقط

### Subscription Lifecycle
Given عميل بدأ اشتراكا جديدا  
When ينشئ النظام طلب الدفع  
Then تكون الحالة `PendingPayment`  
When يتم تأكيد الدفع  
Then تتحول الحالة إلى `Active`

### Discount Applied Once
Given باقة لها خصم مدة وكود خصم صالح  
When يتم حساب السعر  
Then يطبق النظام الخصومات بالترتيب المحدد ولا يكرر نفس الخصم مرتين

### Upgrade Idempotency
Given اشتراك `Active` وطلب ترقية يحمل `Idempotency-Key` محدد  
When يتكرر نفس الطلب مرتين بسبب إعادة المحاولة  
Then يتم تنفيذ الترقية مرة واحدة ويرجع النظام نفس النتيجة في الطلب الثاني

### Renewal Idempotency
Given اشتراك `Active` وطلب تجديد يحمل `Idempotency-Key` محدد  
When يتكرر نفس الطلب مرتين  
Then يتم إنشاء تجديد واحد فقط ولا يتم تحصيل العميل مرتين

### Explainable Pricing Decision
Given اشتراك تم دفعه بنجاح  
When يراجع الأدمن تفاصيل السعر  
Then يستطيع رؤية `SubscriptionSnapshot`, `PricingRuleVersion`, `PackageContentVersion`, المطاعم المحفوظة، الخصومات المطبقة، العملة، والوقت الذي تم فيه الحساب

### Invalid State Transition
Given اشتراك حالته `Expired`  
When يحاول العميل تنفيذ upgrade مباشر  
Then يرجع النظام 409 أو 422 مع ProblemDetails يوضح أن الحالة لا تسمح بالترقية

### Permission Denied
Given مستخدم لا يملك الصلاحية  
When يحاول تنفيذ العملية  
Then يرجع النظام 403 ولا يتم تغيير البيانات

### Scope Denied
Given مستخدم يملك الصلاحية لكن خارج النطاق  
When يحاول عرض أو تعديل كيان  
Then يرجع النظام 403 مع ProblemDetails

### Duplicate Request
Given نفس Idempotency-Key استخدم من قبل  
When يعيد المستخدم نفس الطلب  
Then يرجع النظام نفس النتيجة ولا ينشئ أثرًا جديدًا

### Concurrent Update
Given نسختان من نفس السجل مفتوحتان  
When يتم حفظ نسخة قديمة بعد تعديل أحدث  
Then يرجع النظام 409 conflict

### Audit Verification
Given عملية حساسة تمت بنجاح  
When يراجع الأدمن AuditLog  
Then يجد actor/action/entity/before/after/reason/correlationId
