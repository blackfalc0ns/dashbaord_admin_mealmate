# F042 — Diagrams

> الرسومات بصيغة Mermaid ويمكن عرضها في GitHub أو أي محرر Markdown يدعم Mermaid.

## 1. Functional Flow
```mermaid
flowchart TD
    Start(("Start F042 Driver Order Assignment"))
    S1["فتح الطلب المسند."]
    S2["التحقق من الحالة والنطاق."]
    S3["تسجيل الموقع/التحقق."]
    S4["تغيير الحالة."]
    S5["بث التحديث."]
    S6["فتح Hold عند الفشل."]
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
    participant API as F042 API
    participant Auth as Auth + Scope
    participant Domain as Domain Service
    participant DB as Database
    participant Audit as Audit Log
    participant Notify as Notifications

    User->>UI: Open Driver Order Assignment
    UI->>API: Request /api/v1/driver_order_assignment
    API->>Auth: Validate token, permission, scope
    Auth-->>API: Authorized
    API->>Domain: Execute business rules
    Domain->>DB: Read/write F042 data
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
    class F042_Entity {
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
    User --> F042_Entity : creates/updates
    F042_Entity --> AuditLog : records
    F042_Entity --> NotificationLog : triggers
```
