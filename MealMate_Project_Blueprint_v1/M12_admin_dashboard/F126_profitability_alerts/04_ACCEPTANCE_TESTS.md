# F126 — Acceptance Tests

## Acceptance Criteria
1. المستخدم بدون صلاحية لا يستطيع الوصول للميزة.
2. المستخدم بصلاحية صحيحة ونطاق خاطئ يتم منعه.
3. كل action حساس يسجل AuditLog.
4. كل خطأ validation يرجع رسالة واضحة ومترجمة.
5. تكرار نفس الطلب لا ينتج duplicate effect.
6. التحديث المتزامن لا يسبب فقدان بيانات.
7. كل انتقال حالة غير مسموح يتم رفضه.
8. الواجهة تعرض Loading/Empty/Error/Permission Denied.
9. يظهر تنبيه ربحية فقط عندما يكون `Restaurant Price > Mean + 1 SD` و`Expected Profit < 0.500 KD`.
10. لا يقوم التنبيه بتعديل التصنيف أو اللمت أو سعر العميل تلقائيًا.

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

### Restaurant Outlier Profitability Flag
Given مطعم سعره اليومي أعلى من `Mean + 1 SD`  
And `Expected Profit = Customer Daily Price - (Restaurant Daily Price × (1 - Commission))` أقل من `0.500 KD`  
When يعمل النظام فحص تنبيهات الربحية  
Then يتم وضع علامة مراجعة على المطعم

### No Flag For Profitable Outlier
Given مطعم سعره اليومي أعلى من `Mean + 1 SD`  
And `Expected Profit` يساوي أو يزيد عن `0.500 KD`  
When يعمل النظام فحص تنبيهات الربحية  
Then لا يتم إنشاء تنبيه ربحية

### Admin Resolution Options
Given مطعم عليه تنبيه ربحية  
When يراجعه الأدمن  
Then يسمح النظام فقط بالإجراءات `Keep Restaurant` أو `Move To Higher Classification` أو `Exclude Restaurant` مع سبب إلزامي

### Pricing And Limit Not Mutated
Given تم إنشاء تنبيه ربحية لمطعم  
When يحفظ الأدمن قرار المراجعة  
Then لا يتم تعديل `Pricing Engine` أو `Limit System` تلقائيًا بسبب التنبيه
