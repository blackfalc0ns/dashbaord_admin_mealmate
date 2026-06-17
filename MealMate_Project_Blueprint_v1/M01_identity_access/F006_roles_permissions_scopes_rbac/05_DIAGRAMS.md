# F006 — Diagrams

> الرسومات بصيغة Mermaid ويمكن عرضها في GitHub أو أي محرر Markdown يدعم Mermaid.

## 1. Functional Flow
```mermaid
flowchart TD
    Start(("Start F006 Roles, Permissions & Scopes (RBAC)"))
    S1["بدء الطلب."]
    S2["التحقق من الهوية والحالة."]
    S3["تطبيق الصلاحية والنطاق."]
    S4["حفظ النتيجة."]
    S5["إرسال إشعار وتسجيل التدقيق."]
    Done(("Done"))
    Start --> S1
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
    S5 --> Done
```

## 2. Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor User as User / Actor
    participant UI as Web or Mobile UI
    participant API as F006 API
    participant Auth as Auth + Scope
    participant Domain as Domain Service
    participant DB as Database
    participant Audit as Audit Log
    participant Notify as Notifications

    User->>UI: Open Roles, Permissions & Scopes (RBAC)
    UI->>API: Request /api/v1/roles_permissions_scopes_rbac
    API->>Auth: Validate token, permission, scope
    Auth-->>API: Authorized
    API->>Domain: Execute business rules
    Domain->>DB: Read/write F006 data
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
    class F006_Entity {
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
    User --> F006_Entity : creates/updates
    F006_Entity --> AuditLog : records
    F006_Entity --> NotificationLog : triggers
```
