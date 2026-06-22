# F012 — Acceptance Tests

## Acceptance Criteria
1. المستخدم بدون صلاحية لا يستطيع الوصول للميزة.
2. المستخدم بصلاحية صحيحة ونطاق خاطئ يتم منعه.
3. كل action حساس يسجل AuditLog.
4. كل خطأ validation يرجع رسالة واضحة ومترجمة.
5. تكرار نفس الطلب لا ينتج duplicate effect.
6. التحديث المتزامن لا يسبب فقدان بيانات.
7. كل انتقال حالة غير مسموح يتم رفضه.
8. الواجهة تعرض Loading/Empty/Error/Permission Denied.
9. التصنيف يظل معتمدًا على `Mean + Standard Deviation` ولا يتحول إلى تصنيف يدوي.
10. قاعدة Outlier Profitability تضيف علامة مراجعة فقط ولا تعدل التصنيف تلقائيًا.

## Given / When / Then
### Happy Path
Given مستخدم لديه الصلاحية والنطاق الصحيح  
When ينفذ العملية الأساسية للميزة  
Then يتم حفظ النتيجة وتحديث الحالة وتسجيل AuditLog

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

### Classification Remains Statistical
Given تم إضافة مطعم أو تعديل سعره داخل برنامج وباقة  
When يعيد النظام حساب التصنيف  
Then يستخدم النظام قواعد `Mean + Standard Deviation` الحالية كما هي

### Outlier Flag Does Not Reclassify Automatically
Given مطعم يحقق شرط `Restaurant Price > Mean + 1 SD`  
And `Expected Profit < 0.500 KD`  
When يتم إنشاء علامة مراجعة  
Then لا يتغير تصنيف المطعم تلقائيًا إلا إذا اختار الأدمن `Move To Higher Classification` مع سبب وAuditLog
