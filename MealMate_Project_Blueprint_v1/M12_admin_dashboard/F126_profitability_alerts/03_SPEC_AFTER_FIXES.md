# F126 — Spec After Fixes

## Purpose
تنفيذ **Profitability Alerts** كميزة جاهزة للتطوير بعد معالجة نقاط الضعف والفجوات.

## Restaurant Outlier Profitability Alert
هذا التنبيه يضيف حماية ربحية فقط على الخوارزمية الحالية، ولا يغير التصنيف أو نظام اللمت أو محرك التسعير.

### Inputs
| Input | Description |
|---|---|
| Restaurant Daily Price | سعر المطعم اليومي داخل نفس البرنامج والباقة |
| Mean | متوسط أسعار المطاعم اليومية لنفس البرنامج والباقة |
| Standard Deviation | الانحراف المعياري لنفس مجموعة المطاعم |
| Commission | عمولة المطعم المستخدمة في التسوية |
| Customer Daily Price | سعر العميل اليومي الناتج من محرك التسعير الحالي |

### Calculations
```text
Net Restaurant Cost = Restaurant Daily Price × (1 - Commission)
Expected Profit = Customer Daily Price - Net Restaurant Cost
Minimum Profit = 0.500 KD
```

### Trigger Rule
```text
IF Restaurant Price > Mean + 1 SD
AND Expected Profit < 0.500 KD
THEN Flag Restaurant
```

### Allowed Admin Actions
الأدمن يستطيع معالجة التنبيه بأحد الخيارات التالية فقط:
- Keep Restaurant
- Move To Higher Classification
- Exclude Restaurant

كل إجراء يحتاج سببًا إلزاميًا، ويسجل `before/after/reason/correlationId` في AuditLog.

### Explicit Non-Changes
- Classification remains `Mean + Standard Deviation` as currently defined.
- Limit System remains unchanged.
- Pricing Engine remains `Average Price × Margin%`.
- لا يتم تعديل أي بند آخر في الخوارزمية بسبب هذا التنبيه.

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
| GET | `/api/v1/profitability_alerts` | List/search |
| GET | `/api/v1/profitability_alerts/{id}` | Details |
| POST | `/api/v1/profitability_alerts` | Create/request |
| PUT | `/api/v1/profitability_alerts/{id}` | Update |
| POST | `/api/v1/profitability_alerts/{id}/actions/{action}` | State transition |

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
