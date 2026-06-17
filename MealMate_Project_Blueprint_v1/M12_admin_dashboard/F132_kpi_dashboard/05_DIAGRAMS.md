# F132 — Diagrams

> الرسومات بصيغة Mermaid ويمكن عرضها في GitHub أو أي محرر Markdown يدعم Mermaid.

## 1. Functional Flow
```mermaid
flowchart TD
    Start(("Start F132 KPI Dashboard"))
    S1["فتح الصفحة."]
    S2["تطبيق RBAC/Scope."]
    S3["عرض KPIs والبيانات."]
    S4["تنفيذ إجراء."]
    S5["تحديث النتيجة."]
    S6["تسجيل الإجراء."]
    Done(("Done"))
    Start --> S1
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
    S5 --> S6
    S6 --> Done
```

## 2. Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor User as User / Actor
    participant UI as Web or Mobile UI
    participant API as F132 API
    participant Auth as Auth + Scope
    participant Domain as Domain Service
    participant DB as Database
    participant Audit as Audit Log
    participant Notify as Notifications

    User->>UI: Open KPI Dashboard
    UI->>API: Request /api/v1/kpi_dashboard
    API->>Auth: Validate token, permission, scope
    Auth-->>API: Authorized
    API->>Domain: Execute business rules
    Domain->>DB: Read/write F132 data
    DB-->>Domain: Persisted state
    Domain->>Audit: Save before/after/reason
    Domain->>Notify: Send relevant notification
    Domain-->>API: Result
    API-->>UI: Success or ProblemDetails
    UI-->>User: Updated screen state
```

## 3. State Diagram
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: submit
    Pending --> Approved: approve
    Pending --> Rejected: reject
    Approved --> Active: activate
    Active --> Paused: pause/suspend
    Paused --> Active: resume
    Active --> Completed: complete
    Rejected --> Draft: revise
    Completed --> Archived: archive
    Archived --> [*]
```

## 4. Data Relationship Draft
```mermaid
classDiagram
    class F132_Entity {
      +Id
      +Status
      +CountryId
      +CreatedAtUtc
      +UpdatedAtUtc
      +RowVersion
    }
    class User {
      +Id
      +Role
      +Scope
    }
    class AuditLog {
      +Action
      +Before
      +After
      +Reason
      +CorrelationId
    }
    class NotificationLog {
      +Channel
      +Template
      +Status
    }
    User --> F132_Entity : creates/updates
    F132_Entity --> AuditLog : records
    F132_Entity --> NotificationLog : triggers
```
