# F003 — Spec After Fixes

## Purpose
تنفيذ **Driver Registration & Approval** كميزة جاهزة للتطوير بعد معالجة نقاط الضعف والفجوات.

## Owners
| Role | Responsibility |
|---|---|
| Business Owner | اعتماد القواعد التجارية وKPIs |
| Product Owner | توثيق السيناريوهات وتجربة المستخدم |
| Backend Owner | API, validation, state machine |
| Frontend Owner | screens, states, errors |
| QA Owner | acceptance tests and regression |

## State Machine
الحالات القياسية المقترحة كبداية:
- Draft
- Pending
- InReview
- Approved
- Rejected
- Active
- Suspended
- Completed
- Archived

يجب تخصيص الحالات حسب طبيعة الميزة قبل التطوير النهائي.

الحالات النهائية المقترحة للمندوب:
- `Draft`: المندوب بدأ التسجيل ولم يكمل البيانات.
- `PendingDocuments`: توجد بيانات أو مستندات أو صورة شخصية ناقصة.
- `SubmittedForReview`: البيانات والمستندات والصورة الشخصية مكتملة وجاهزة لمراجعة الأدمن.
- `NeedsChanges`: الأدمن طلب تعديل بيانات أو مستند أو صورة شخصية.
- `Rejected`: تم رفض الطلب بسبب واضح.
- `Approved`: تم اعتماد المندوب إداريا.
- `Active`: المندوب يستطيع استقبال الطلبات بعد استكمال إعدادات التشغيل.
- `ProfileImageReviewRequired`: المندوب نشط لكنه غيّر الصورة الشخصية وتحتاج مراجعة.
- `Suspended`: المندوب موقوف مؤقتا.
- `ExpiredDocuments`: مستند مهم انتهت صلاحيته.

## Driver Registration Requirements
### Required Driver Data
- الاسم الكامل.
- رقم الهاتف.
- الدولة والمنطقة ونطاق العمل.
- نوع وسيلة النقل.
- رقم اللوحة عند الحاجة.
- بيانات الهوية حسب الدولة.
- صورة شخصية واضحة للمندوب.

### Required Documents
- هوية المندوب.
- رخصة القيادة.
- مستند وسيلة النقل عند الحاجة.
- أي تصريح تشغيل محلي إذا كان مطلوبا حسب الدولة.

### Driver Profile Image Rules
- الصورة الشخصية مطلوبة قبل إرسال الطلب إلى مراجعة الأدمن.
- يجب أن تكون واضحة، أمامية، وتظهر وجه المندوب بدون قص أو تشويش.
- لا يتم اعتماد المندوب إذا كانت الصورة ناقصة أو مرفوضة.
- إذا تم تغيير الصورة بعد التفعيل، يتم تسجيل التغيير وقد يدخل الحساب حالة `ProfileImageReviewRequired` إلى أن يراجعها الأدمن.
- الصورة تخزن في media storage آمن، ولا يتم كشف رابط عام دائم لها.

## API Contract
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/driver_registration_approval` | List/search |
| GET | `/api/v1/driver_registration_approval/{id}` | Details |
| POST | `/api/v1/driver_registration_approval` | Create/request |
| PUT | `/api/v1/driver_registration_approval/{id}` | Update |
| POST | `/api/v1/driver_registration_approval/{id}/actions/{action}` | State transition |

Endpoints المتخصصة للمندوب:
- `POST /api/v1/drivers/registrations`
- `PUT /api/v1/drivers/registrations/{id}`
- `POST /api/v1/drivers/registrations/{id}/documents`
- `POST /api/v1/drivers/registrations/{id}/profile-image`
- `POST /api/v1/drivers/registrations/{id}/submit`
- `POST /api/v1/admin/drivers/registrations/{id}/approve`
- `POST /api/v1/admin/drivers/registrations/{id}/reject`
- `POST /api/v1/admin/drivers/registrations/{id}/request-changes`

## Required API Standards
- Authentication required.
- Authorization = Permission + Scope.
- ProblemDetails for errors.
- CorrelationId in request/response.
- Idempotency-Key for create/action endpoints.
- Pagination/filtering/sorting for list endpoints.

## Data Model Baseline
كل entity أساسي يحتاج:
- Id
- Status
- CountryId عند الحاجة
- CreatedAtUtc
- CreatedBy
- UpdatedAtUtc
- UpdatedBy
- RowVersion
- Reason
- SourceReference

كيانات وحقول مطلوبة للمندوب:
- `DriverProfile`
  - `UserId`
  - `FullName`
  - `PhoneNumber`
  - `CountryId`
  - `RegionId`
  - `VehicleType`
  - `VehiclePlateNumber`
  - `ProfileImageUrl`
  - `ProfileImageStorageKey`
  - `ProfileImageStatus`
  - `Status`
- `DriverDocument`
  - `DriverId`
  - `DocumentType`
  - `StorageKey`
  - `ExpiryDate`
  - `ReviewStatus`
  - `RejectionReason`
- `DriverApprovalDecision`
  - `DriverId`
  - `Decision`
  - `Reason`
  - `ReviewedBy`
  - `ReviewedAtUtc`

## Audit Events
يجب تسجيل:
- Create
- Update
- Approve
- Reject
- Suspend
- Override
- Export

أحداث إضافية للمندوب:
- `DriverProfileImageUploaded`
- `DriverProfileImageUpdated`
- `DriverProfileImageApproved`
- `DriverProfileImageRejected`
- `DriverSubmittedForReview`
- `DriverApproved`
- `DriverRejected`
- `DriverSuspended`

## UX States
الشاشات يجب أن تدعم:
- Loading
- Empty
- Error
- Permission Denied
- Validation Error
- Confirmation Modal
- Audit Timeline عند الحاجة

## KPIs
KPIs المقترحة:
- Success Rate
- Error Rate
- Average Processing Time
- SLA Breaches
- Manual Overrides
- Reconciliation or Consistency Mismatches عند وجود أثر مالي أو تشغيلي
