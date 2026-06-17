# F109 — Diagrams

> الرسومات بصيغة Mermaid ويمكن عرضها في GitHub أو أي محرر Markdown يدعم Mermaid.

## 1. Functional Flow
```mermaid
flowchart TD
    Start(("Start F109 Restaurant Campaign Capacity"))
    S1["إنشاء/فتح الحملة."]
    S2["التحقق من الحالة والفترة."]
    S3["تطبيق الخصم والطاقة."]
    S4["جمع الموافقات."]
    S5["حفظ Snapshot."]
    S6["تحديث التقارير."]
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
    participant API as F109 API
    participant Auth as Auth + Scope
    participant Domain as Domain Service
    participant DB as Database
    participant Audit as Audit Log
    participant Notify as Notifications

    User->>UI: Open Restaurant Campaign Capacity
    UI->>API: Request /api/v1/restaurant_campaign_capacity
    API->>Auth: Validate token, permission, scope
    Auth-->>API: Authorized
    API->>Domain: Execute business rules
    Domain->>DB: Read/write F109 data
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
    class F109_Entity {
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
    User --> F109_Entity : creates/updates
    F109_Entity --> AuditLog : records
    F109_Entity --> NotificationLog : triggers
```
