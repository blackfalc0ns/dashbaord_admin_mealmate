# F004 — Acceptance Tests

## Acceptance Criteria
1. المستخدم بدون صلاحية لا يستطيع الوصول للميزة.
2. المستخدم بصلاحية صحيحة ونطاق خاطئ يتم منعه.
3. كل action حساس يسجل AuditLog.
4. كل خطأ validation يرجع رسالة واضحة ومترجمة.
5. تكرار نفس الطلب لا ينتج duplicate effect.
6. التحديث المتزامن لا يسبب فقدان بيانات.
7. كل انتقال حالة غير مسموح يتم رفضه.
8. الواجهة تعرض Loading/Empty/Error/Permission Denied.
9. الأدمن فقط يستطيع إنشاء لينك أو كود ترويجي للمؤثر.
10. الأدمن فقط يستطيع تحديد أو تعديل نسبة عمولة المؤثر.
11. الاشتراك المدفوع القادم من لينك المؤثر أو كوده ينشئ عمولة واحدة فقط.
12. زيارة اللينك بدون اشتراك مدفوع لا تنشئ عمولة.
13. استخدام المؤثر لكوده على اشتراكه الشخصي يتم رفضه كـ self-referral.
14. تعديل نسبة العمولة لا يغير العمولات المحسوبة على اشتراكات قديمة.

## Given / When / Then
### Happy Path
Given مستخدم لديه الصلاحية والنطاق الصحيح  
When ينفذ العملية الأساسية للميزة  
Then يتم حفظ النتيجة وتحديث الحالة وتسجيل AuditLog

### Admin Creates Influencer Promotion Setup
Given أدمن لديه صلاحية `F004.Create`  
When يربط شخص عادي/مستخدم عادي كـ مؤثر ويحدد لينك ترويجي وكود ترويجي ونسبة عمولة  
Then يتم حفظ `InfluencerProfile` و`InfluencerPromotionLink` و`InfluencerPromotionCode` وتسجيل AuditLog

### Subscription From Promotion Link
Given مؤثر Active لديه لينك ترويجي فعال ونسبة عمولة 10%  
When عميل يدخل من اللينك ثم يدفع اشتراك  
Then يتم إنشاء `ReferralAttribution` و`InfluencerCommission` بنسبة 10%

### Subscription From Promotion Code
Given مؤثر Active لديه كود ترويجي فعال  
When عميل يدفع اشتراك ويدخل كود المؤثر  
Then يتم ربط الاشتراك بالمؤثر وإنشاء عمولة واحدة

### Same Influencer Link And Code
Given العميل دخل من لينك مؤثر ثم أدخل كود نفس المؤثر عند الاشتراك  
When يتم الدفع بنجاح  
Then يتم احتساب عمولة واحدة فقط لنفس المؤثر

### Conflicting Link And Code
Given العميل دخل من لينك مؤثر A ثم أدخل كود مؤثر B  
When يتم الدفع بنجاح  
Then يتم ربط الاشتراك بمؤثر B لأن الكود المدخل يدويا له أولوية

### Visit Without Paid Subscription
Given عميل دخل من لينك مؤثر  
When لم يكمل اشتراكا مدفوعا  
Then لا يتم إنشاء `InfluencerCommission`

### Self Referral Blocked
Given مؤثر يحاول استخدام كوده على اشتراكه الشخصي  
When يتم تطبيق الكود  
Then يرجع النظام 422 ولا يتم إنشاء Attribution أو Commission

### Commission Rate Change
Given مؤثر لديه اشتراك قديم محسوب بنسبة 10%  
When الأدمن يغير نسبة العمولة إلى 15%  
Then الاشتراكات القديمة تظل بنسبة 10% والاشتراكات الجديدة تستخدم 15%

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
