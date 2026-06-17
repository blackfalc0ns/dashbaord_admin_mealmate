# F123 — Spec After Fixes

## Purpose
تنفيذ **Hold Cases Monitoring** كميزة جاهزة للتطوير بعد معالجة نقاط الضعف والفجوات.

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
| GET | `/api/v1/hold_cases_monitoring` | List/search |
| GET | `/api/v1/hold_cases_monitoring/{id}` | Details |
| POST | `/api/v1/hold_cases_monitoring` | Create/request |
| PUT | `/api/v1/hold_cases_monitoring/{id}` | Update |
| POST | `/api/v1/hold_cases_monitoring/{id}/actions/{action}` | State transition |

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
