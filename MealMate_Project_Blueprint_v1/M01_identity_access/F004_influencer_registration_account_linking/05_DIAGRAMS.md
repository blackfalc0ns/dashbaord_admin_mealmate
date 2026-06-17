# F004 — Diagrams

> الرسومات بصيغة Mermaid ويمكن عرضها في GitHub أو أي محرر Markdown يدعم Mermaid.

## 1. Functional Flow
```mermaid
flowchart TD
    Start(("Start Influencer Promotion Setup"))
    A1["الأدمن يربط شخص عادي/مستخدم عادي كمؤثر"]
    A2["الأدمن يحدد نسبة العمولة"]
    A3["الأدمن ينشئ لينك ترويجي"]
    A4["الأدمن ينشئ كود ترويجي"]
    I1["المؤثر ينشر اللينك أو الكود في بوست/فيديو"]
    C1{"مصدر العميل؟"}
    L1["دخول من اللينك"]
    K1["إدخال الكود عند الاشتراك"]
    AT["إنشاء ReferralAttribution"]
    Pay{"اشتراك مدفوع؟"}
    NoCom["لا توجد عمولة"]
    Com["إنشاء InfluencerCommission"]
    Report["تقرير أداء وعمولات للأدمن"]
    Start --> A1 --> A2 --> A3 --> A4 --> I1 --> C1
    C1 -- "لينك" --> L1 --> AT
    C1 -- "كود" --> K1 --> AT
    AT --> Pay
    Pay -- "لا" --> NoCom
    Pay -- "نعم" --> Com --> Report
```

## 2. Sequence Diagram
```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin
    actor Influencer as Influencer
    actor Customer as Customer
    participant UI as Admin Panel / App
    participant API as Influencer API
    participant Auth as Auth + Scope
    participant Domain as Influencer Domain
    participant Sub as Subscription Service
    participant DB as Database
    participant Audit as Audit Log

    Admin->>UI: Link normal user as influencer
    UI->>API: POST /api/v1/admin/influencers
    API->>Auth: Validate token, permission, scope
    Auth-->>API: Authorized
    API->>Domain: Create profile, link, code, commission rate
    Domain->>DB: Save influencer promotion setup
    Domain->>Audit: Save create events
    Influencer->>Customer: Publish link/code in post or video
    Customer->>API: Open /r/{promotionLinkSlug} or apply code
    API->>Domain: Resolve active influencer attribution
    Domain->>DB: Save ReferralAttribution
    Customer->>Sub: Pay subscription
    Sub->>Domain: SubscriptionPaid event
    Domain->>DB: Create InfluencerCommission with applied rate
    Domain->>Audit: SubscriptionCommissionCreated
    API-->>UI: Success or ProblemDetails
```

## 3. State Diagram
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Active: admin activates
    Active --> Paused: pause campaign
    Paused --> Active: resume campaign
    Active --> Suspended: admin suspends
    Suspended --> Active: reactivate
    Active --> BlockedForFraud: fraud confirmed
    Suspended --> BlockedForFraud: fraud confirmed
    Active --> Closed: end relationship
    Paused --> Closed: end relationship
    BlockedForFraud --> Closed: close after settlement
    Closed --> [*]
```

## 4. Data Relationship Draft
```mermaid
classDiagram
    class InfluencerProfile {
      +Id
      +DisplayName
      +ContactPhone
      +ContactEmail
      +DefaultCommissionRate
      +Status
      +CreatedAtUtc
      +UpdatedAtUtc
      +RowVersion
    }
    class InfluencerPromotionLink {
      +Id
      +InfluencerId
      +Slug
      +TargetUrl
      +Status
      +StartAtUtc
      +EndAtUtc
    }
    class InfluencerPromotionCode {
      +Id
      +InfluencerId
      +Code
      +Status
      +StartAtUtc
      +EndAtUtc
    }
    class ReferralAttribution {
      +Id
      +InfluencerId
      +CustomerId
      +SubscriptionId
      +SourceType
      +SourceValue
      +AttributedAtUtc
    }
    class InfluencerCommission {
      +Id
      +InfluencerId
      +SubscriptionId
      +AppliedCommissionRate
      +CommissionAmount
      +Status
    }
    class AuditLog {
      +Action
      +Before
      +After
      +Reason
      +CorrelationId
    }
    InfluencerProfile --> InfluencerPromotionLink : owns
    InfluencerProfile --> InfluencerPromotionCode : owns
    InfluencerProfile --> ReferralAttribution : receives
    ReferralAttribution --> InfluencerCommission : creates after paid subscription
    InfluencerProfile --> AuditLog : records
```
