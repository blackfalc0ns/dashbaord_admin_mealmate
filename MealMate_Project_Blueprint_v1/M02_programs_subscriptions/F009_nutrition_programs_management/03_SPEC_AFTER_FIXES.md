# F009 — Spec After Fixes

## Purpose
تنفيذ **Nutrition Programs Management** كميزة جاهزة للتطوير بعد معالجة نقاط الضعف والفجوات.

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

الحالات النهائية المقترحة للاشتراك:
- `Draft`: تم اختيار البرنامج/الباقة ولم يبدأ الدفع.
- `PendingPayment`: تم إنشاء طلب دفع والاشتراك ينتظر تأكيد الدفع.
- `Active`: الاشتراك مدفوع وساري.
- `Upgraded`: تم ترقية الاشتراك إلى برنامج أو باقة أعلى.
- `Renewed`: تم تجديد الاشتراك لفترة جديدة.
- `Cancelled`: تم إلغاء الاشتراك حسب سياسة الإلغاء.
- `Expired`: انتهت مدة الاشتراك بدون تجديد.

انتقالات أساسية:
- `Draft` إلى `PendingPayment` عند بدء الدفع.
- `PendingPayment` إلى `Active` عند نجاح الدفع.
- `PendingPayment` إلى `Cancelled` عند فشل/إلغاء الدفع بعد انتهاء المهلة.
- `Active` إلى `Upgraded` عند نجاح ترقية مدفوعة.
- `Active` إلى `Renewed` عند نجاح التجديد.
- `Active` إلى `Cancelled` عند إلغاء الاشتراك.
- `Active` إلى `Expired` عند انتهاء المدة بدون تجديد.

## Pricing & Snapshot Rules
- يجب حفظ `SubscriptionSnapshot` وقت الشراء حتى لا تتأثر الاشتراكات القديمة بتغيير الأسعار أو محتوى الباقة لاحقا.
- كل اشتراك مدفوع يجب أن يحتوي نسخة من السعر الأساسي، التصنيف، الخصومات، العملة، مدة الاشتراك، البرنامج/الباقة، وعدد وقائمة المطاعم وقت الشراء.
- لا يتم إعادة حساب اشتراك قديم باستخدام قواعد التسعير الحالية.
- كل قرار تسعير يجب أن يكون قابلا للتفسير من خلال `PricingRuleVersion` و`SubscriptionSnapshot`.
- إذا كانت الباقة تحتوي 20 مطعم وقت اشتراك العميل، يتم حفظ `RestaurantCount=20` و`IncludedRestaurantIds` داخل snapshot. أي مطعم يضاف للباقة بعد ذلك لا يظهر في اشتراك هذا العميل تلقائيا.

### Package Content Snapshot Rules
- واجهة اشتراك العميل تعرض المطاعم من `SubscriptionSnapshot.IncludedRestaurantIds` وليس من تعريف الباقة الحالي.
- إضافة مطعم جديد لباقة نشطة تؤثر على الاشتراكات الجديدة فقط.
- التجديد أو الترقية يمكن أن ينشئ snapshot جديدة تحتوي محتوى الباقة الأحدث حسب قواعد المنتج.
- حذف مطعم من النظام يجب أن يعالج تشغيله بسياسة واضحة: إخفاء المطعم غير المتاح مع الاحتفاظ بأثره في snapshot، أو استبداله بقرار إداري مسجل.

### Pricing Calculation Order
1. تحميل السعر الأساسي للبرنامج/الباقة.
2. تطبيق التصنيف السعري حسب الدولة/العملة/نوع العميل.
3. تطبيق خصم الباقة أو مدة الاشتراك إن وجد.
4. تطبيق كود الخصم أو الإحالة مرة واحدة إذا كان مؤهلا.
5. تطبيق الضرائب أو الرسوم إن وجدت.
6. حفظ النتيجة النهائية داخل `SubscriptionSnapshot`.

### Idempotency Rules
- إنشاء الاشتراك المدفوع، الترقية، والتجديد يجب أن يدعموا `Idempotency-Key`.
- عند تكرار نفس الطلب بنفس المفتاح يرجع النظام نفس النتيجة بدون تحصيل جديد أو تحديث ثان.
- لا يسمح بتنفيذ ترقية أو تجديد على اشتراك في حالة `PendingPayment`, `Cancelled`, أو `Expired` إلا عبر action واضح.

## API Contract
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/nutrition_programs_management` | List/search |
| GET | `/api/v1/nutrition_programs_management/{id}` | Details |
| POST | `/api/v1/nutrition_programs_management` | Create/request |
| PUT | `/api/v1/nutrition_programs_management/{id}` | Update |
| POST | `/api/v1/nutrition_programs_management/{id}/actions/{action}` | State transition |

Endpoints متخصصة:
- `POST /api/v1/subscriptions/preview-price`
- `POST /api/v1/subscriptions`
- `POST /api/v1/subscriptions/{id}/upgrade`
- `POST /api/v1/subscriptions/{id}/renew`
- `POST /api/v1/subscriptions/{id}/cancel`
- `GET /api/v1/subscriptions/{id}/snapshot`

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

كيانات وحقول مطلوبة:
- `Subscription`
  - `Id`
  - `CustomerId`
  - `ProgramId`
  - `BundleId`
  - `Status`
  - `StartAtUtc`
  - `EndAtUtc`
  - `CurrentSnapshotId`
  - `RowVersion`
- `SubscriptionSnapshot`
  - `SubscriptionId`
  - `ProgramId`
  - `BundleId`
  - `Duration`
  - `RestaurantCount`
  - `IncludedRestaurantIds`
  - `IncludedRestaurantBranchIds`
  - `PackageContentVersion`
  - `BasePrice`
  - `PricingCategory`
  - `Currency`
  - `AppliedDiscounts`
  - `TaxAmount`
  - `FinalAmount`
  - `PricingRuleVersion`
  - `TaxRuleVersion`
  - `CalculatedAtUtc`
- `PackageContentVersion`
  - `Id`
  - `ProgramId`
  - `BundleId`
  - `RestaurantCount`
  - `RestaurantIds`
  - `EffectiveFromUtc`
  - `EffectiveToUtc`
- `PricingRule`
  - `Id`
  - `Version`
  - `ProgramId`
  - `BundleId`
  - `CountryId`
  - `Currency`
  - `BasePrice`
  - `EffectiveFromUtc`
  - `EffectiveToUtc`
- `SubscriptionOperation`
  - `SubscriptionId`
  - `OperationType`
  - `IdempotencyKey`
  - `Status`
  - `ResultReferenceId`

## Audit Events
يجب تسجيل:
- Create
- Update
- Approve
- Reject
- Suspend
- Override
- Export

أحداث إضافية:
- `SubscriptionPricePreviewed`
- `SubscriptionSnapshotCreated`
- `SubscriptionPaymentSucceeded`
- `SubscriptionUpgraded`
- `SubscriptionRenewed`
- `SubscriptionCancelled`
- `PricingRuleVersionChanged`

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
