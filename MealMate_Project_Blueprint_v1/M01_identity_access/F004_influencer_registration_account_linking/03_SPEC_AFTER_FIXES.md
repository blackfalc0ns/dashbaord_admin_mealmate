# F004 — Spec After Fixes

## Purpose
تنفيذ **Influencer Registration & Account Linking** كميزة جاهزة للتطوير بعد معالجة نقاط الضعف والفجوات.

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

الحالات النهائية المقترحة للمؤثر:
- `Draft`: ملف المؤثر تم إنشاؤه ولم تكتمل بياناته.
- `Active`: المؤثر يستطيع استخدام اللينك والكود في الحملات.
- `Paused`: المؤثر أو الحملة متوقفة مؤقتا ولا يتم إنشاء Attribution جديد.
- `Suspended`: المؤثر موقوف بسبب قرار إداري أو شبهة احتيال.
- `BlockedForFraud`: المؤثر ممنوع من العمولات بسبب احتيال مثبت.
- `Closed`: تم إغلاق العلاقة مع المؤثر مع الاحتفاظ بالسجلات المالية.

## Influencer Promotion Model
المؤثر هو شخص عادي/مستخدم عادي ينشر لينك أو كود في بوست أو فيديو. هو ليس كيان شركة ولا يحتاج دورة اعتماد قانونية مثل المطعم أو المندوب. الأدمن هو المسؤول عن إنشاء وربط:
- اسم المؤثر.
- اللينك الترويجي.
- الكود الترويجي.
- نسبة العمولة على الاشتراكات القادمة من اللينك أو الكود.

يمكن ربط المؤثر بحساب مستخدم عادي موجود، أو إنشاء ملف ترويجي مستقل ثم ربطه بالمستخدم لاحقا. بيانات الدفع أو التحقق المالي مطلوبة فقط قبل صرف العمولة إذا احتاجتها سياسة المالية.

### Commission Rules
- `CommissionRate` يحددها الأدمن لكل مؤثر أو حملة.
- العمولة تحتسب عند نجاح دفع الاشتراك.
- لا يتم احتساب عمولة على مجرد زيارة اللينك أو التسجيل بدون اشتراك مدفوع.
- عند إنشاء العمولة يتم حفظ نسبة العمولة وقت الاشتراك في `AppliedCommissionRate`.
- تعديل نسبة المؤثر لاحقا يطبق على الاشتراكات الجديدة فقط.
- عند refund أو cancellation يتم عكس العمولة أو وضعها في حالة `Reversed` حسب سياسة المالية.

### Attribution Rules
- اللينك الترويجي ينشئ `ReferralAttribution` عند دخول العميل.
- الكود الترويجي يربط الاشتراك بالمؤثر عند استخدامه.
- إذا استخدم العميل لينك وكود لنفس المؤثر، يتم احتساب العمولة مرة واحدة.
- إذا تعارض اللينك مع الكود، تكون أولوية الكود المدخل يدويا لأنه يمثل نية مباشرة من العميل.
- يمنع self-referral واستخدام المؤثر لكوده على اشتراكاته الخاصة.

## API Contract
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/influencer_registration_account_linking` | List/search |
| GET | `/api/v1/influencer_registration_account_linking/{id}` | Details |
| POST | `/api/v1/influencer_registration_account_linking` | Create/request |
| PUT | `/api/v1/influencer_registration_account_linking/{id}` | Update |
| POST | `/api/v1/influencer_registration_account_linking/{id}/actions/{action}` | State transition |

Endpoints المتخصصة للمؤثر:
- `POST /api/v1/admin/influencers`
- `PUT /api/v1/admin/influencers/{id}`
- `POST /api/v1/admin/influencers/{id}/promotion-links`
- `POST /api/v1/admin/influencers/{id}/promotion-codes`
- `PUT /api/v1/admin/influencers/{id}/commission-rate`
- `POST /api/v1/admin/influencers/{id}/pause`
- `POST /api/v1/admin/influencers/{id}/suspend`
- `GET /api/v1/admin/influencers/{id}/performance`
- `GET /r/{promotionLinkSlug}`
- `POST /api/v1/subscriptions/apply-promotion-code`

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
- `InfluencerProfile`
  - `Id`
  - `UserId`
  - `DisplayName`
  - `ContactPhone`
  - `ContactEmail`
  - `SocialChannels`
  - `PayoutInfoStatus`
  - `Status`
  - `DefaultCommissionRate`
  - `CreatedByAdminId`
- `InfluencerPromotionLink`
  - `InfluencerId`
  - `Slug`
  - `TargetUrl`
  - `Status`
  - `StartAtUtc`
  - `EndAtUtc`
- `InfluencerPromotionCode`
  - `InfluencerId`
  - `Code`
  - `Status`
  - `StartAtUtc`
  - `EndAtUtc`
- `ReferralAttribution`
  - `InfluencerId`
  - `CustomerId`
  - `SubscriptionId`
  - `SourceType`
  - `SourceValue`
  - `AttributedAtUtc`
- `InfluencerCommission`
  - `InfluencerId`
  - `SubscriptionId`
  - `SubscriptionAmount`
  - `AppliedCommissionRate`
  - `CommissionAmount`
  - `Status`
  - `PaidAtUtc`

## Audit Events
يجب تسجيل:
- Create
- Update
- Approve
- Reject
- Suspend
- Override
- Export

أحداث إضافية للمؤثر:
- `InfluencerCreated`
- `InfluencerPromotionLinkCreated`
- `InfluencerPromotionCodeCreated`
- `InfluencerCommissionRateChanged`
- `ReferralAttributed`
- `SubscriptionCommissionCreated`
- `CommissionReversed`
- `InfluencerSuspended`

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
