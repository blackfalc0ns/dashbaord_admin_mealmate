# F003 — Diagrams

> الرسومات بصيغة Mermaid ويمكن عرضها في GitHub أو أي محرر Markdown يدعم Mermaid.

## 1. Functional Flow
```mermaid
flowchart TD
    Start(("Start Driver Registration"))
    D1["إدخال بيانات المندوب الأساسية"]
    D2["رفع الهوية ورخصة القيادة ومستندات وسيلة النقل"]
    D3["رفع الصورة الشخصية للمندوب"]
    V1{"البيانات والمستندات والصورة مكتملة؟"}
    R1["الحالة: PendingDocuments"]
    S1["إرسال الطلب لمراجعة الأدمن"]
    A1["الأدمن يراجع البيانات والمستندات والصورة"]
    A2{"قرار الأدمن"}
    N1["NeedsChanges مع سبب واضح"]
    X1["Rejected"]
    P1["Approved"]
    O1["استكمال إعدادات التشغيل والمنطقة"]
    Active["Active - يستطيع استقبال الطلبات"]
    Start --> D1 --> D2 --> D3 --> V1
    V1 -- "لا" --> R1
    V1 -- "نعم" --> S1 --> A1 --> A2
    A2 -- "طلب تعديل" --> N1 --> D1
    A2 -- "رفض" --> X1
    A2 -- "اعتماد" --> P1 --> O1 --> Active
```

## 2. Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Driver as Driver
    participant UI as Mobile App
    participant API as Driver Registration API
    participant Auth as Auth + Scope
    participant Media as Secure Media Storage
    participant Domain as Driver Registration Service
    participant DB as Database
    actor Admin as Admin
    participant Audit as Audit Log
    participant Notify as Notifications

    Driver->>UI: Enter driver data
    UI->>API: POST /api/v1/drivers/registrations
    API->>Auth: Validate token, permission, scope
    Auth-->>API: Authorized
    API->>Domain: Create draft registration
    Domain->>DB: Save Draft
    Driver->>UI: Upload documents + profile image
    UI->>API: POST documents/profile-image
    API->>Media: Store files securely
    Media-->>API: Storage keys
    API->>Domain: Validate required files
    Domain->>DB: Save PendingDocuments or ready state
    Driver->>UI: Submit for review
    UI->>API: POST /submit
    API->>Domain: Check data, documents, profile image
    Domain->>DB: Set SubmittedForReview
    Domain->>Audit: DriverSubmittedForReview
    Admin->>API: Approve / Reject / Request changes
    API->>Domain: Apply admin decision
    Domain->>DB: Update driver status
    Domain->>Audit: Save decision and reason
    Domain->>Notify: Notify driver
    API-->>UI: Success or ProblemDetails
```

## 3. State Diagram
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> PendingDocuments: save incomplete data
    PendingDocuments --> SubmittedForReview: required data + documents + profile image complete
    SubmittedForReview --> NeedsChanges: admin requests changes
    NeedsChanges --> PendingDocuments: driver edits data/files
    SubmittedForReview --> Rejected: admin rejects
    SubmittedForReview --> Approved: admin approves
    Approved --> Active: operational setup complete
    Active --> ProfileImageReviewRequired: driver updates profile image
    ProfileImageReviewRequired --> Active: admin approves image
    ProfileImageReviewRequired --> NeedsChanges: admin rejects image
    Active --> ExpiredDocuments: required document expired
    ExpiredDocuments --> PendingDocuments: upload renewed document
    Active --> Suspended: admin suspends
    Suspended --> Active: admin reactivates
    Rejected --> [*]
```

## 4. Data Relationship Draft
```mermaid
classDiagram
    class DriverProfile {
      +Id
      +UserId
      +FullName
      +PhoneNumber
      +CountryId
      +RegionId
      +VehicleType
      +VehiclePlateNumber
      +ProfileImageUrl
      +ProfileImageStorageKey
      +ProfileImageStatus
      +Status
      +CreatedAtUtc
      +UpdatedAtUtc
      +RowVersion
    }
    class DriverDocument {
      +Id
      +DriverId
      +DocumentType
      +StorageKey
      +ExpiryDate
      +ReviewStatus
      +RejectionReason
    }
    class DriverApprovalDecision {
      +Id
      +DriverId
      +Decision
      +Reason
      +ReviewedBy
      +ReviewedAtUtc
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
    DriverProfile --> DriverDocument : owns
    DriverProfile --> DriverApprovalDecision : reviewed by
    DriverProfile --> AuditLog : records
    DriverProfile --> NotificationLog : triggers
```
