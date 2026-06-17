# F001 — Acceptance Tests

## Acceptance Criteria
1. العميل يستطيع إنشاء حساب والدخول للتطبيق مباشرة بدون مراجعة أدمن.
2. التسجيل الناجح يرجع token/session في نفس الطلب.
3. الحساب الجديد تكون حالته `Active` أو `Active + VerificationPending`، وليس `PendingReview`.
4. عدم توثيق الهاتف/البريد لا يمنع دخول التطبيق العام.
5. يمكن تقييد العمليات الحساسة فقط إذا كان الحساب غير موثق.
6. لا يسمح بتكرار نفس الهاتف أو البريد.
7. التسجيل المتكرر بنفس Idempotency-Key لا ينشئ حسابًا ثانيًا.
8. رسائل validation واضحة ومترجمة.
9. محاولات OTP وتسجيل الدخول عليها rate limit.
10. كل تسجيل ودخول وفشل دخول يسجل AuditLog مناسب.
11. الصورة الشخصية اختيارية ولا تمنع التسجيل.
12. يستطيع العميل رفع أو تغيير أو حذف الصورة الشخصية لاحقًا.

## Given / When / Then
### Register And Enter App Immediately
Given عميل جديد لديه هاتف أو بريد غير مستخدم  
When يرسل بيانات التسجيل الصحيحة  
Then يتم إنشاء الحساب بحالة `Active`  
And يرجع النظام token/session  
And ينتقل العميل مباشرة إلى التطبيق

### No Admin Approval
Given عميل سجل حسابًا جديدًا  
When يتم حفظ الحساب  
Then لا يتم إنشاء حالة `PendingReview`  
And لا يحتاج الحساب إلى `Approve`  
And لا يظهر في قائمة approvals الخاصة بالأدمن

### Optional Verification
Given عميل سجل ودخل التطبيق وحالته `VerificationPending`  
When يفتح التطبيق  
Then يستطيع التصفح وبدء رحلة الاشتراك  
And تظهر له دعوة لتوثيق الهاتف أو البريد بدون تعطيل التجربة

### Register Without Profile Image
Given عميل جديد لم يرفع صورة شخصية  
When يرسل بيانات التسجيل الصحيحة  
Then يتم إنشاء الحساب بنجاح  
And يدخل التطبيق مباشرة  
And يظهر له placeholder افتراضي

### Register With Profile Image
Given عميل جديد يرفع صورة شخصية بصيغة مدعومة  
When يرسل بيانات التسجيل الصحيحة  
Then يتم إنشاء الحساب بنجاح  
And تحفظ الصورة كـ profile image  
And تظهر في الملف الشخصي

### Invalid Profile Image
Given عميل يرفع ملفًا غير مدعوم كصورة شخصية  
When يحاول حفظ الصورة  
Then يرجع النظام خطأ validation واضح  
And لا يفشل إنشاء الحساب إذا كانت الصورة اختيارية أثناء التسجيل

### Update Profile Image
Given عميل لديه حساب Active  
When يرفع صورة شخصية جديدة من صفحة الملف الشخصي  
Then يتم استبدال الصورة القديمة  
And يتم تسجيل AuditLog مناسب

### Sensitive Action Requires Verification
Given عميل غير موثق  
When يحاول تنفيذ عملية حساسة مثل الدفع أو تعديل الهاتف  
Then يطلب النظام التوثيق أولًا  
And لا يخرج العميل من التطبيق

### Duplicate Account
Given يوجد حساب بنفس الهاتف أو البريد  
When يحاول العميل التسجيل بنفس البيانات  
Then يرجع النظام خطأ واضح `DuplicateAccount`  
And لا ينشئ حسابًا جديدًا

### Idempotent Registration
Given طلب تسجيل تم تنفيذه بنجاح باستخدام Idempotency-Key  
When يعاد إرسال نفس الطلب بنفس المفتاح  
Then يرجع النظام نفس نتيجة التسجيل  
And لا ينشئ حسابًا ثانيًا

### Login Success
Given عميل لديه حساب Active  
When يدخل بيانات صحيحة  
Then يرجع النظام token/session  
And يحدث `LastLoginAtUtc`

### Suspended Account
Given حساب عميل حالته `Suspended`  
When يحاول تسجيل الدخول  
Then يمنع النظام الدخول  
And يعرض سببًا مناسبًا أو قناة تواصل مع الدعم

### Audit Verification
Given عملية تسجيل أو دخول تمت  
When يراجع الأدمن AuditLog  
Then يجد actor/action/entity/status/correlationId
