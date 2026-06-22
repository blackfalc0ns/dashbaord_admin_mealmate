# F013 — Spec After Fixes

## Purpose
تنفيذ **Customer Subscription Pricing** كميزة جاهزة للتطوير بعد معالجة نقاط الضعف والفجوات.

## Pricing Engine Guardrail
محرك التسعير لا يتغير بسبب إضافة تنبيه الربحية. تبقى قاعدة التسعير الحالية:

```text
Customer Daily Price = Average Price × Margin%
```

يستخدم تنبيه الربحية `Customer Daily Price` الناتج من هذه القاعدة لحساب:

```text
Net Restaurant Cost = Restaurant Daily Price × (1 - Commission)
Expected Profit = Customer Daily Price - Net Restaurant Cost
Minimum Profit = 0.500 KD
```

إذا كان `Restaurant Price > Mean + 1 SD` و`Expected Profit < 0.500 KD` يتم فقط إرسال المطعم للمراجعة في تنبيهات الربحية، ولا يتم تعديل سعر العميل أو متوسط التصنيف تلقائيًا.

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
| GET | `/api/v1/customer_subscription_pricing` | List/search |
| GET | `/api/v1/customer_subscription_pricing/{id}` | Details |
| POST | `/api/v1/customer_subscription_pricing` | Create/request |
| PUT | `/api/v1/customer_subscription_pricing/{id}` | Update |
| POST | `/api/v1/customer_subscription_pricing/{id}/actions/{action}` | State transition |

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
