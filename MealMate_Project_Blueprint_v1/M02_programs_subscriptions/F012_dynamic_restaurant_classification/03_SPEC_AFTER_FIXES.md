# F012 — Spec After Fixes

## Purpose
تنفيذ **Dynamic Restaurant Classification** كميزة جاهزة للتطوير بعد معالجة نقاط الضعف والفجوات.

## Profit Protection Addendum
هذه الإضافة لا تغير خوارزمية التصنيف الحالية. يظل التصنيف معتمدًا على `Mean + Standard Deviation` كما هو موثق، وتضاف فقط طبقة فحص ربحية بعد حساب التصنيف.

### الحسابات الإضافية
| البند | المعادلة | الغرض |
|---|---|---|
| Net Restaurant Cost | `Restaurant Daily Price × (1 - Commission)` | حساب التكلفة الصافية للمطعم بعد عمولة المطعم |
| Expected Profit | `Customer Daily Price - Net Restaurant Cost` | قياس هامش الربح المتوقع لليوم الواحد |
| Minimum Profit | `0.500 KD` | الحد الأدنى المقبول لحماية ربحية MealMate |

### Outlier Rule
يتم وضع علامة مراجعة على المطعم فقط عند تحقق الشرطين معًا:

```text
IF Restaurant Price > Mean + 1 SD
AND Expected Profit < 0.500 KD
THEN Flag Restaurant
```

### Admin Action
عند ظهور العلامة، يختار الأدمن إجراءً واحدًا مع سبب إلزامي وAuditLog:
- Keep Restaurant
- Move To Higher Classification
- Exclude Restaurant

### قواعد لا تتغير
- التصنيف الأساسي يظل كما هو ولا يتحول إلى تصنيف يدوي.
- Limit System يبقى كما هو.
- Pricing Engine يبقى كما هو: `Average Price × Margin%`.
- لا يتم تعديل أي بند آخر في الخوارزمية الحالية بسبب هذا الملحق.

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

## API Contract
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/dynamic_restaurant_classification` | List/search |
| GET | `/api/v1/dynamic_restaurant_classification/{id}` | Details |
| POST | `/api/v1/dynamic_restaurant_classification` | Create/request |
| PUT | `/api/v1/dynamic_restaurant_classification/{id}` | Update |
| POST | `/api/v1/dynamic_restaurant_classification/{id}/actions/{action}` | State transition |

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

## Audit Events
يجب تسجيل:
- Create
- Update
- Approve
- Reject
- Suspend
- Override
- Export

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
