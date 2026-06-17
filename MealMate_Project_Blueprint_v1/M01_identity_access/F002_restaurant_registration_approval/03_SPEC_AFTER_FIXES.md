# F002 — Spec After Fixes

## Purpose
تنفيذ **Restaurant Registration & Approval** كمسار تسجيل مطعم يعتمد على إدخال بيانات المطعم ورفع المستندات الرسمية، ثم مراجعة الأدمن قبل الاعتماد والتشغيل.

## Business Rule
- المطعم يستطيع إنشاء طلب تسجيل وإدخال بياناته.
- المطعم يرفع المستندات المطلوبة قبل إرسال الطلب للمراجعة.
- الأدمن يراجع البيانات والمستندات.
- المطعم لا يصبح `Active` ولا يظهر للعملاء قبل موافقة الأدمن.
- الموافقة القانونية/التجارية لا تعني الجاهزية التشغيلية تلقائيًا.
- بعد `Approved` ينتقل المطعم إلى إعداد التشغيل: القوائم، الأسعار، الطاقة، مناطق الخدمة.

## Required Restaurant Data
| Field | Required | Notes |
|---|---|---|
| RestaurantName | Yes | الاسم التجاري الظاهر |
| LegalCompanyName | Yes | اسم الشركة المالكة |
| CommercialRegistrationNumber | Yes | رقم السجل التجاري |
| CountryId | Yes | الدولة |
| RegionId | Yes | المنطقة |
| Address | Yes | عنوان المطعم أو الشركة |
| ContactPersonName | Yes | مسؤول التواصل |
| ContactPhone | Yes | هاتف مسؤول التواصل |
| ContactEmail | Optional | البريد |
| OwnerName | Yes | اسم المالك أو المفوض |
| OwnerNationalId | Conditional | حسب الدولة |
| ServiceRegions | Optional at registration | يمكن استكمالها قبل التشغيل |

## Required Documents
| Document | Required | Description |
|---|---|---|
| CompanyLicense | Yes | ترخيص الشركة أو ترخيص مزاولة النشاط |
| ArticlesOfAssociation | Yes | عقد التأسيس |
| OwnerInfoDocument | Yes | مستند بيانات المالك أو المفوض |
| CommercialRegister | Yes | السجل التجاري |
| OwnerIdentity | Conditional | هوية المالك حسب الدولة |
| TaxCertificate | Conditional | شهادة ضريبية إن كانت مطلوبة |
| AuthorizationLetter | Conditional | تفويض إذا مقدم الطلب ليس المالك |
| FoodLicense | Conditional | ترخيص غذائي/صحي حسب الدولة |

## State Machine
- `Draft`: الطلب بدأ ولم يكتمل.
- `PendingDocuments`: بيانات المطعم موجودة والمستندات ناقصة.
- `SubmittedForReview`: الطلب مكتمل وتم إرساله للأدمن.
- `NeedsChanges`: الأدمن طلب تعديل أو مستند بديل.
- `Rejected`: الطلب مرفوض مع سبب.
- `Approved`: الأدمن اعتمد المطعم من ناحية قانونية/تجارية.
- `NeedsOperationalSetup`: المطعم يحتاج إعداد القوائم والأسعار والطاقة والمناطق.
- `ReadyToGoLive`: جاهز للتفعيل.
- `Active`: المطعم يعمل ويظهر للعملاء.
- `Suspended`: موقوف مؤقتًا.
- `Terminated`: منتهي التعامل.

## API Contract
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/restaurants/registrations` | إنشاء طلب تسجيل مطعم |
| PUT | `/api/v1/restaurants/registrations/{id}` | تحديث بيانات الطلب قبل الإرسال |
| POST | `/api/v1/restaurants/registrations/{id}/documents` | رفع مستند |
| DELETE | `/api/v1/restaurants/registrations/{id}/documents/{documentId}` | حذف مستند قبل الإرسال فقط |
| POST | `/api/v1/restaurants/registrations/{id}/submit` | إرسال الطلب للمراجعة |
| GET | `/api/v1/admin/restaurants/registrations` | قائمة طلبات المطاعم للأدمن |
| GET | `/api/v1/admin/restaurants/registrations/{id}` | تفاصيل الطلب والمستندات |
| POST | `/api/v1/admin/restaurants/registrations/{id}/request-changes` | طلب تعديل أو مستندات بديلة |
| POST | `/api/v1/admin/restaurants/registrations/{id}/approve` | اعتماد المطعم |
| POST | `/api/v1/admin/restaurants/registrations/{id}/reject` | رفض الطلب |

## Validation Rules
- لا يمكن إرسال الطلب للمراجعة قبل اكتمال المستندات المطلوبة.
- لا يمكن اعتماد الطلب إذا كان أي مستند مطلوب حالته `Rejected` أو `Missing`.
- رقم السجل التجاري يجب ألا يكون مستخدمًا لمطعم Active أو Pending آخر.
- يجب حفظ سبب الرفض أو طلب التعديل.
- المستندات تقبل أنواع ملفات محددة وحجمًا محددًا.
- لا يمكن حذف مستند بعد إرسال الطلب للمراجعة؛ يمكن رفع نسخة جديدة فقط.

## Document Review
كل مستند له:
- DocumentType.
- Status: `Uploaded`, `UnderReview`, `Approved`, `Rejected`, `Expired`.
- Version.
- UploadedAtUtc.
- ReviewedBy.
- ReviewedAtUtc.
- RejectionReason.

## Required API Standards
- Authentication للوحة المطعم والأدمن.
- Authorization = Permission + Scope.
- Signed URLs للمستندات.
- Virus/file scanning عند الرفع.
- ProblemDetails للأخطاء.
- CorrelationId في كل request/response.
- Idempotency-Key لعمليات submit/approve/reject.

## Audit Events
يجب تسجيل:
- RestaurantRegistrationCreated
- RestaurantRegistrationUpdated
- RestaurantDocumentUploaded
- RestaurantDocumentApproved
- RestaurantDocumentRejected
- RestaurantRegistrationSubmitted
- RestaurantRegistrationChangesRequested
- RestaurantRegistrationApproved
- RestaurantRegistrationRejected

## UX States
الشاشات يجب أن تدعم:
- Draft progress.
- Missing documents.
- Upload progress.
- Submitted for review.
- Needs changes.
- Rejected with reason.
- Approved but setup required.

## KPIs
- Registration Completion Rate.
- Average Review Time.
- Missing Documents Rate.
- Rejection Rate.
- Resubmission Rate.
- Approval To Go-Live Time.
