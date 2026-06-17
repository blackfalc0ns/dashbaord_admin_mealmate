# F009 — Diagrams

> الرسومات بصيغة Mermaid ويمكن عرضها في GitHub أو أي محرر Markdown يدعم Mermaid.

## 1. Functional Flow
```mermaid
flowchart TD
    Start(("Start F009 Nutrition Programs Management"))
    S1["اختيار البرنامج/الباقة"]
    S2["تحميل السعر الحالي ومحتوى الباقة الحالي"]
    S3["حساب السعر والخصومات والتصنيف"]
    S4["عرض Preview للعميل"]
    S5["الدفع بنجاح"]
    S6["حفظ SubscriptionSnapshot: السعر + عدد/قائمة المطاعم"]
    S7["تفعيل الاشتراك من الـ snapshot"]
    Done(("Done"))
    Start --> S1
    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
    S5 --> S6
    S6 --> S7
    S7 --> Done
```

## 2. Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer
    participant UI as Mobile App
    participant API as Subscription API
    participant Auth as Auth + Scope
    participant Pricing as Pricing Service
    participant Package as Package Content Service
    participant Domain as Subscription Domain
    participant DB as Database
    participant Audit as Audit Log

    Customer->>UI: Select program and package
    UI->>API: POST /api/v1/subscriptions/preview-price
    API->>Auth: Validate token, permission, scope
    Auth-->>API: Authorized
    API->>Pricing: Calculate price with PricingRuleVersion
    API->>Package: Get current restaurant list for package
    Pricing-->>API: Price preview
    Package-->>API: RestaurantCount + IncludedRestaurantIds
    API-->>UI: Preview price and package content
    Customer->>UI: Pay subscription
    UI->>API: POST /api/v1/subscriptions
    API->>Domain: Create subscription with idempotency key
    Domain->>DB: Save SubscriptionSnapshot
    Domain->>Audit: SubscriptionSnapshotCreated
    API-->>UI: Active subscription from saved snapshot
```

## 3. State Diagram
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> PendingPayment: start payment
    PendingPayment --> Active: payment succeeded and snapshot saved
    PendingPayment --> Cancelled: payment failed or abandoned
    Active --> Upgraded: upgrade succeeded with new snapshot
    Active --> Renewed: renewal succeeded with new snapshot
    Active --> Cancelled: customer/admin cancellation
    Active --> Expired: end date reached without renewal
    Upgraded --> Active: upgraded subscription active
    Renewed --> Active: renewed period active
    Cancelled --> [*]
    Expired --> [*]
```

## 4. Data Relationship Draft
```mermaid
classDiagram
    class Subscription {
      +Id
      +CustomerId
      +ProgramId
      +BundleId
      +Status
      +StartAtUtc
      +EndAtUtc
      +CurrentSnapshotId
      +RowVersion
    }
    class SubscriptionSnapshot {
      +Id
      +SubscriptionId
      +ProgramId
      +BundleId
      +Duration
      +RestaurantCount
      +IncludedRestaurantIds
      +IncludedRestaurantBranchIds
      +PackageContentVersion
      +BasePrice
      +Currency
      +AppliedDiscounts
      +FinalAmount
      +PricingRuleVersion
      +CalculatedAtUtc
    }
    class PricingRule {
      +Id
      +Version
      +BasePrice
      +Currency
      +EffectiveFromUtc
      +EffectiveToUtc
    }
    class PackageContentVersion {
      +Id
      +BundleId
      +RestaurantCount
      +RestaurantIds
      +EffectiveFromUtc
      +EffectiveToUtc
    }
    class Restaurant {
      +Id
      +Name
      +Status
    }
    class AuditLog {
      +Action
      +Before
      +After
      +Reason
      +CorrelationId
      +CreatedAtUtc
    }
    Subscription --> SubscriptionSnapshot : uses saved snapshot
    SubscriptionSnapshot --> PricingRule : references version
    SubscriptionSnapshot --> PackageContentVersion : references content version
    PackageContentVersion --> Restaurant : includes at purchase time
    Subscription --> AuditLog : records
```
