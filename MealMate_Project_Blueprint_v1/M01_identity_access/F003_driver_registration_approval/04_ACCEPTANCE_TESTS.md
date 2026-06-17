# F003 — Acceptance Tests

## Acceptance Criteria
1. المستخدم بدون صلاحية لا يستطيع الوصول للميزة.
2. المستخدم بصلاحية صحيحة ونطاق خاطئ يتم منعه.
3. كل action حساس يسجل AuditLog.
4. كل خطأ validation يرجع رسالة واضحة ومترجمة.
5. تكرار نفس الطلب لا ينتج duplicate effect.
6. التحديث المتزامن لا يسبب فقدان بيانات.
7. كل انتقال حالة غير مسموح يتم رفضه.
8. الواجهة تعرض Loading/Empty/Error/Permission Denied.
9. المندوب لا يستطيع إرسال طلب الاعتماد بدون صورة شخصية واضحة.
10. الأدمن لا يستطيع اعتماد مندوب صورته الشخصية مرفوضة أو غير موجودة.
11. تغيير الصورة الشخصية بعد تفعيل المندوب يسجل Audit وقد يتطلب مراجعة جديدة.
12. ملفات الصور غير الصالحة أو كبيرة الحجم أو بصيغة غير مسموحة يتم رفضها برسالة واضحة.

## Given / When / Then
### Happy Path
Given مستخدم لديه الصلاحية والنطاق الصحيح  
When ينفذ العملية الأساسية للميزة  
Then يتم حفظ النتيجة وتحديث الحالة وتسجيل AuditLog

### Driver Registration With Profile Image
Given مندوب أدخل بياناته الأساسية ورفع الهوية ورخصة القيادة والصورة الشخصية  
When يرسل طلب التسجيل للمراجعة  
Then تتحول الحالة إلى `SubmittedForReview` ويتم تسجيل `DriverSubmittedForReview`

### Missing Profile Image
Given مندوب أكمل البيانات والمستندات بدون صورة شخصية  
When يحاول إرسال الطلب للمراجعة  
Then يرجع النظام 422 مع رسالة أن الصورة الشخصية مطلوبة ولا تتغير الحالة إلى `SubmittedForReview`

### Invalid Profile Image
Given مندوب يحاول رفع صورة بصيغة غير مسموحة أو ملف حجمه أكبر من الحد المسموح  
When يرفع الصورة  
Then يرجع النظام 422 مع ProblemDetails ولا يتم حفظ الملف كصورة معتمدة

### Admin Rejects Profile Image
Given طلب مندوب في حالة `SubmittedForReview` وصورته غير واضحة  
When الأدمن يرفض الصورة مع سبب  
Then تتحول الحالة إلى `NeedsChanges` ويتم حفظ `ProfileImageRejectionReason` وإرسال إشعار للمندوب

### Admin Approves Driver
Given طلب مندوب مكتمل ببيانات صحيحة ومستندات صالحة وصورة شخصية مقبولة  
When الأدمن يعتمد الطلب  
Then تتحول الحالة إلى `Approved` ثم يمكن تفعيل المندوب إلى `Active`

### Active Driver Updates Profile Image
Given مندوب حالته `Active`  
When يغير صورته الشخصية  
Then يتم حفظ الصورة الجديدة وتسجيل `DriverProfileImageUpdated` وقد تتحول الحالة إلى `ProfileImageReviewRequired` حسب سياسة التشغيل

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
