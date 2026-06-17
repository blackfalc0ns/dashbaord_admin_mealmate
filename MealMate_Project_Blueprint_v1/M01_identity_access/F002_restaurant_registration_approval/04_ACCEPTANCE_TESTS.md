# F002 — Acceptance Tests

## Acceptance Criteria
1. المطعم يستطيع إنشاء طلب تسجيل وإدخال بياناته.
2. لا يمكن إرسال الطلب للمراجعة قبل رفع المستندات المطلوبة.
3. المستندات المطلوبة تشمل: ترخيص الشركة، عقد التأسيس، بيانات المالك، السجل التجاري.
4. الأدمن يستطيع مراجعة البيانات والمستندات.
5. الأدمن يستطيع قبول الطلب أو رفضه أو طلب تعديلات.
6. رفض الطلب أو المستند يجب أن يحتوي سببًا واضحًا.
7. المطعم لا يصبح `Active` بمجرد التسجيل.
8. المطعم لا يصبح `Active` بمجرد رفع المستندات.
9. المطعم لا يصبح `Active` إلا بعد اعتماد الأدمن ثم اكتمال الإعداد التشغيلي.
10. كل قرار مراجعة يسجل AuditLog.

## Given / When / Then
### Create Draft Registration
Given مستخدم مطعم جديد  
When يدخل بيانات المطعم الأساسية  
Then يتم إنشاء طلب بحالة `Draft`  
And لا يظهر المطعم للعملاء

### Missing Documents
Given طلب تسجيل مطعم بحالة `Draft`  
And لم يرفع ترخيص الشركة أو عقد التأسيس أو بيانات المالك أو السجل التجاري  
When يحاول إرسال الطلب للمراجعة  
Then يمنع النظام الإرسال  
And يعرض قائمة المستندات الناقصة

### Submit For Review
Given طلب تسجيل مكتمل البيانات والمستندات  
When يضغط المطعم إرسال للمراجعة  
Then تنتقل الحالة إلى `SubmittedForReview`  
And يظهر الطلب في قائمة مراجعات الأدمن

### Admin Request Changes
Given طلب مطعم في حالة `SubmittedForReview`  
When يطلب الأدمن تعديل بيانات أو إعادة رفع مستند  
Then تنتقل الحالة إلى `NeedsChanges`  
And يظهر السبب للمطعم  
And لا يتم تفعيل المطعم

### Admin Reject
Given طلب مطعم في حالة `SubmittedForReview`  
When يرفض الأدمن الطلب مع سبب  
Then تنتقل الحالة إلى `Rejected`  
And يتم حفظ سبب الرفض  
And يتم تسجيل AuditLog

### Admin Approve
Given طلب مطعم مكتمل وكل المستندات مقبولة  
When يعتمد الأدمن الطلب  
Then تنتقل الحالة إلى `Approved`  
And ينتقل المطعم إلى `NeedsOperationalSetup`  
And لا يظهر للعملاء حتى يصبح `ReadyToGoLive` ثم `Active`

### Document Rejection
Given مستند مرفوع للمراجعة  
When يرفضه الأدمن بسبب عدم وضوح أو انتهاء صلاحية  
Then تصبح حالة المستند `Rejected`  
And يطلب النظام رفع نسخة جديدة  
And لا يمكن اعتماد الطلب

### Duplicate Commercial Register
Given يوجد مطعم بنفس رقم السجل التجاري  
When يحاول مطعم جديد التسجيل بنفس الرقم  
Then يرجع النظام خطأ `DuplicateCommercialRegister`  
And لا يسمح بإرسال الطلب

### Audit Verification
Given الأدمن قبل أو رفض طلب مطعم  
When يتم مراجعة AuditLog  
Then يظهر actor/action/entity/reason/correlationId
