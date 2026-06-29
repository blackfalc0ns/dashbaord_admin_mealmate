# MealMate — Database Analysis From Project Blueprint v1

> المرجع الأساسي: `MealMate_Project_Blueprint_v1`، مع مراعاة `docs/architecture-blueprint.md` و`workflows/00_accounting_requirements.md`.
>
> الهدف: تحويل الـ132 feature إلى تصميم قاعدة بيانات قابل للتنفيذ بـ EF Core، مع فصل الدومينات، ضبط العلاقات، حفظ الـsnapshots، وحماية المال والخصوصية والـaudit.

---

## 1. الخلاصة التنفيذية

MealMate ليس CRUD عادي. هو نظام اشتراكات وتشغيل يومي ومحاسبة، لذلك قاعدة البيانات يجب أن تتبني 5 مبادئ من البداية:

1. **State-machine first**: أي كيان له دورة حياة يحتاج جدول history/transition واضح.
2. **Snapshot-first pricing**: أي سعر أو عمولة أو خصم يُحفظ وقت إنشاء الاشتراك/الطلب ولا يتغير بأثر رجعي.
3. **Ledger-first finance**: المحافظ والمستحقات والمحاسبة append-only قدر الإمكان؛ لا نعتمد على تحديث balance فقط.
4. **Audit-first admin actions**: أي اعتماد، رفض، override، إظهار رقم، تعديل سعر، refund، payout، أو صلاحية لازم يتسجل.
5. **Privacy by role**: المطعم والسائق لا يأخذان بيانات العميل الحساسة إلا بالحد الأدنى، والاستثناءات موثقة.

المسودة الحالية `docs/database-schema-draft.md` تصلح كنواة، لكنها تحتاج توسيع في:

- RBAC الحقيقي: `Roles`, `Permissions`, `RolePermissions`, `UserRoleAssignments`, `Scopes`.
- الوثائق والاعتمادات كـgeneric verification workflow.
- price/version snapshots.
- calendar/order state histories.
- financial events, journal entries, settlement ledgers.
- notifications/outbox/background jobs.
- campaigns/influencers.
- reporting/KPI materialized views أو read models.

---

## 2. حدود قاعدة البيانات المقترحة

### Operational DB

تضم الجداول الأساسية للتطبيق:

- المستخدمين، المطاعم، السائقين، العملاء، المؤثرين.
- البرامج، الباقات، الوجبات، الأسعار.
- الاشتراكات، التقويم، الطلبات، التوصيل.
- الشكاوى، الدعم، الإشعارات.
- المدفوعات، المحافظ، الاستردادات، التسويات.

### Reporting / Read Models

يفضل أن تكون داخل نفس قاعدة البيانات في البداية كـviews/materialized tables، ثم تفصل لاحقًا إذا كبر الحجم:

- dashboard metrics.
- KPI snapshots.
- profitability alerts.
- financial reports.
- restaurant/driver performance.

### Files

لا نخزن الملفات نفسها في DB. نخزن metadata فقط:

- `StorageKey`
- `FileName`
- `ContentType`
- `SizeBytes`
- `Checksum`
- `UploadedByUserId`
- `CreatedAtUtc`

---

## 3. Conventions

| الموضوع | القرار المقترح |
|---|---|
| Primary keys | `Guid` للجداول الرئيسية، و`bigint` اختياري للجداول عالية الحجم مثل logs/location/events |
| الوقت | كل التخزين UTC، والعرض حسب country timezone |
| العملة | `decimal(18,3)` مع `CurrencyCode` |
| النسب | `decimal(9,4)` كنسبة عشرية أو مئوية موحدة في الكود |
| الحذف | soft delete للكيانات التشغيلية، ممنوع حذف السجلات المالية والتاريخية |
| التزامن | `RowVersion` للكيانات التي تتعدل كثيرًا: wallet, capacity, settings, campaign, subscription |
| التعدد اللغوي | أعمدة `NameAr/NameEn` في البداية، وجدول ترجمة لاحقًا إذا زادت اللغات |
| idempotency | جدول مستقل أو عمود `IdempotencyKey` في عمليات الدفع/المحفظة/الأوامر الحساسة |
| correlation | `CorrelationId` في audit/events/jobs/payments |

---

## 4. Domain Map

| Blueprint Module | Database Domain | ملاحظات |
|---|---|---|
| M01 Identity & Access | Identity, RBAC, Documents, Audit | أساس كل الصلاحيات والاعتمادات |
| M02 Programs & Subscriptions | Catalog, Pricing, Subscription | يحتاج snapshots/versioning |
| M03 Calendar & Meals | Calendar, Selection, Freeze | قلب تجربة العميل اليومية |
| M04 Restaurant Operations | Restaurant, Menu, Capacity, Handover | مرتبط بقاعدة 72h والباركود |
| M05 Driver & Delivery | Driver, Assignment, Tracking, Safe Contact | حفظ مواقع محدود وسياسة retention |
| M06 Complaints & Support | Complaints, Evidence, Decisions, Tickets | ينتج تعويضات وخصومات مالية |
| M07 Central Accounting | Accounting, Journal, Revenue, Tax, Settlement | مصدر الحقيقة المالي |
| M08 Customer Finance | Wallet, Refund, Withdrawal, Bank Details | ledger append-only |
| M09 Restaurant Finance | Payables, Invoices, Payouts, Statements | snapshot لكل بند |
| M10 Influencers | Attribution, Codes, Commissions, Payouts | eligibility قبل الصرف |
| M11 Campaigns | Campaigns, Enrollment, Caps, Discount Splits | أثر مالي وتشغيلي |
| M12 Admin Dashboard | Settings, Metrics, Alerts, Reports, Notifications | read models + actions audited |

---

## 5. Core Tables By Domain

### 5.1 Identity, Access, Approval

**الجداول الأساسية**

- `Users`
- `UserCredentials`
- `UserSessions` أو refresh tokens
- `CustomerProfiles`
- `AdminProfiles`
- `RestaurantUsers`
- `DriverProfiles`
- `InfluencerProfiles`
- `Roles`
- `Permissions`
- `RolePermissions`
- `UserRoleAssignments`
- `Scopes`
- `UserScopes`
- `VerificationRequests`
- `VerificationDocuments`
- `VerificationDecisions`
- `AuditLogs`

**ملاحظات تصميم**

- لا نكتفي بعمود `Role` داخل `Users`. ممكن وجود `PrimaryUserType` للسرعة، لكن RBAC الحقيقي في جداول منفصلة.
- `VerificationRequests` generic تكفي مطعم/سائق/مؤثر/وثيقة، بدل تكرار workflow الاعتماد.
- `AuditLogs` يجب أن يدعم: actor, action, entity, before/after JSON, reason, IP, user agent, correlation id.

**حالات مهمة**

- AccountStatus: `Registered`, `PhonePending`, `Active`, `Suspended`, `Closed`.
- VerificationStatus: `Draft`, `Submitted`, `UnderReview`, `Approved`, `Rejected`, `Expired`, `ResubmissionRequired`.

---

### 5.2 Geography & Market Setup

- `Countries`
- `Areas`
- `AreaPolygons`
- `Currencies`
- `CountrySettings`
- `ServiceZones`
- `RestaurantServiceAreas`
- `DriverServiceAreas`

**قرار مهم**

لو PostgreSQL: استخدم PostGIS. لو SQL Server: استخدم `geography`. ولو عايزين بداية أبسط، خزّن `GeoJson` مع أعمدة center lat/long وفهارس عادية، ثم نرقّي لاحقًا.

---

### 5.3 Restaurants, Menus, Meals

- `Restaurants`
- `RestaurantStatusHistory`
- `RestaurantDocuments`
- `RestaurantMenus`
- `Meals`
- `MealTranslations` اختياري لاحقًا
- `MealIngredients`
- `Ingredients`
- `Allergens`
- `MealAllergens`
- `MealAvailability`
- `MealApprovalRequests`
- `RestaurantContractEvents`

**قواعد مهمة**

- الوجبة لها `ApprovalStatus`؛ لا تظهر للعميل قبل اعتماد الأدمن.
- إلغاء وجبة أو خروج مطعم لا يؤثر على اختيارات/طلبات مقفولة؛ نحتاج `EffectiveFromUtc/EffectiveToUtc`.
- المحتوى الغذائي والمكونات snapshot في الطلب عند القفل.

---

### 5.4 Programs, Bundles, Pricing, Classification

- `Programs`
- `Bundles`
- `ProgramBundles`
- `RestaurantProgramBundlePrices`
- `RestaurantPriceVersions`
- `RestaurantTierSnapshots`
- `PricingSettings`
- `PricingRuleVersions`
- `SubscriptionPriceQuotes`
- `DiscountCodes`
- `DiscountRedemptions`
- `ReferralCodes`

**جداول snapshot ضرورية**

- `SubscriptionPricingSnapshot`
- `OrderMealPricingSnapshot`
- `RestaurantPayableSnapshot`

**لماذا؟**

لأن الـBlueprint يؤكد أن:

- السعر الجديد يطبق على الاشتراكات الجديدة فقط.
- تصنيف المطعم يتغير ديناميكيًا.
- سعر العميل لا يحسب تراكميًا رغم أن الوصول تراكمي.
- العمولة والاسترداد والإنذار المبكر تعتمد على إعدادات وقت القرار.

---

### 5.5 Subscriptions, Calendar, Selection

- `Subscriptions`
- `SubscriptionMembers` للاشتراك العائلي
- `SubscriptionStatusHistory`
- `SubscriptionDays`
- `SubscriptionDayStatusHistory`
- `RestaurantSelections`
- `MealSelections`
- `AutomaticSelectionRuns`
- `AutomaticSelectionCandidates`
- `CustomerAllergies`
- `CustomerDislikes`
- `CustomerPreferences`
- `SubscriptionFreezeRequests`
- `SubscriptionFreezeDays`
- `MealChangeRequests`

**حالات `SubscriptionDay` المقترحة**

`Open`, `AutoSelected`, `CustomerSelected`, `Locked72h`, `SentToRestaurant`, `ConfirmedByRestaurant`, `ReplacementRequired`, `ReplacementWindowOpen`, `Preparing`, `OutForDelivery`, `Delivered`, `Frozen`, `Cancelled`, `Failed`.

**قواعد تصميم**

- بعد قفل 72 ساعة لا يتم تعديل اليوم مباشرة؛ أي تغيير يكون override/event.
- `AutomaticSelectionRuns` يحفظ سبب الاختيار: حساسية، منطقة، tier، capacity، diversification limit.
- freeze لا يمس الماضي ولا يعدل ledger المالي مباشرة؛ ينتج business event.

---

### 5.6 Orders, 72h Flow, Barcodes

- `Orders`
- `OrderStatusHistory`
- `RestaurantConfirmations`
- `ReplacementWindows`
- `OrderExceptions`
- `Invoices`
- `OrderBarcodes`
- `BarcodeScanEvents`
- `MealLabels`
- `OrderPreparationEvents`

**حالات `Order` المقترحة**

`Created`, `AwaitingRestaurantConfirmation`, `RestaurantConfirmed`, `RestaurantRejected`, `ReplacementPending`, `Preparing`, `ReadyForPickup`, `AssignedToDriver`, `PickedUp`, `OnTheWay`, `Hold`, `SecondAttemptScheduled`, `Delivered`, `DeliveryFailed`, `Cancelled`.

**قواعد مهمة**

- كل barcode scan له event مستقل: pickup/delivery, actor, timestamp, device id, location اختياري.
- `RestaurantConfirmations` له deadline 24h داخل نافذة 72h.
- `ReplacementWindows` له start/end وسبب.

---

### 5.7 Driver & Delivery

- `Drivers`
- `DriverDocuments`
- `DriverVehicles`
- `DriverAvailabilitySessions`
- `DriverLocations`
- `DriverAssignments`
- `DriverAssignmentHistory`
- `DeliveryAttempts`
- `DeliveryHoldCases`
- `SafeContactSessions`
- `PhoneExposureEvents`
- `DriverRatings`
- `DriverPerformanceDailySnapshots`

**خصوصية**

- السائق يرى موقع العميل فقط، وليس الاسم/الرقم.
- إظهار رقم العميل استثناء موثق في `PhoneExposureEvents` و`AuditLogs`.
- `DriverLocations` جدول عالي الحجم؛ يحتاج retention policy وفهارس على `DriverId, CapturedAtUtc`.

---

### 5.8 Complaints & Support

- `Complaints`
- `ComplaintAttachments`
- `ComplaintClassifications`
- `ComplaintResponses`
- `ComplaintResponsibilityDecisions`
- `ComplaintResolutionActions`
- `CustomerCompensations`
- `RestaurantDeductions`
- `SupportTickets`
- `SupportTicketMessages`

**أثر مالي**

قرار الشكوى لا يعدل المحفظة أو مستحق المطعم مباشرة. القرار ينتج:

- `CustomerCompensationRequested`
- `RestaurantDeductionRequested`
- ثم M07/M08/M09 تنفذ ledger/journal entries.

---

### 5.9 Customer Finance

- `Payments`
- `PaymentAttempts`
- `PaymentProviderEvents`
- `Wallets`
- `WalletLedgerEntries`
- `WalletBalanceSnapshots`
- `Refunds`
- `RefundCalculations`
- `CancellationRequests`
- `CancellationFeeSnapshots`
- `CustomerWithdrawalRequests`
- `CustomerBankAccounts`

**قاعدة ذهبية**

`Wallets.Balance` cache فقط. مصدر الحقيقة هو `WalletLedgerEntries`.

**أنواع محافظ**

- Cash wallet
- Promotional wallet

يفضل إما:

- صفين في `Wallets` لكل عميل بنوع مختلف، أو
- جدول `WalletAccounts`.

الأفضل: `WalletAccounts` عشان التوسع.

---

### 5.10 Central Accounting

- `ChartOfAccounts`
- `AccountingPeriods`
- `FinancialSettings`
- `BusinessEvents`
- `JournalEntries`
- `JournalEntryLines`
- `DeferredRevenueSchedules`
- `RevenueRecognitionEntries`
- `TaxRates`
- `TaxTransactions`
- `OperatingExpenses`
- `Settlements`
- `SettlementItems`
- `FinancialAuditTrail`

**قرار معماري**

أي أثر مالي يبدأ بـ `BusinessEvents`:

- SubscriptionPaid
- OrderDelivered
- ComplaintResolved
- RefundApproved
- RestaurantPayoutApproved
- InfluencerCommissionEarned
- CampaignDiscountConsumed

ثم job/handler يولد `JournalEntries`.

---

### 5.11 Restaurant Finance

- `RestaurantPayables`
- `RestaurantCommissionSnapshots`
- `RestaurantInvoicePeriods`
- `RestaurantInvoices`
- `RestaurantInvoiceItems`
- `RestaurantPayoutRequests`
- `RestaurantPayouts`
- `TransferReceipts`
- `RestaurantAccountStatements`

**قواعد مهمة**

- payable لكل order delivered، مع snapshot للسعر والعمولة.
- complaint deduction بند منفصل وليس تعديل على payable الأصلي.
- الفاتورة الشهرية تمثل period مقفلة.

---

### 5.12 Influencers

- `Influencers`
- `InfluencerCodes`
- `ReferralAttributions`
- `InfluencerCommissionRules`
- `InfluencerCommissions`
- `InfluencerCommissionAdjustments`
- `InfluencerWithdrawalRequests`
- `InfluencerPayouts`
- `InfluencerPayoutItems`

**حالات العمولة**

`Pending`, `Eligible`, `BlockedByCancellation`, `Approved`, `Payable`, `Paid`, `Reversed`.

---

### 5.13 Campaigns

- `Campaigns`
- `CampaignStatusHistory`
- `CampaignDiscountSplits`
- `CampaignPrograms`
- `CampaignBundles`
- `CampaignRestaurantEnrollments`
- `CampaignRestaurantCapacities`
- `CampaignSubscriberCaps`
- `CampaignSubscriptions`
- `CampaignAccountingEvents`
- `CampaignReportsSnapshots`

**حالات campaign**

`Draft`, `EnrollmentOpen`, `UnderReview`, `Approved`, `Launched`, `Paused`, `Completed`, `Cancelled`.

---

### 5.14 Admin, Settings, Notifications, Reports

- `SystemSettings`
- `SystemSettingVersions`
- `NotificationTemplates`
- `NotificationMessages`
- `NotificationDeliveries`
- `OutboxMessages`
- `BackgroundJobs`
- `OperationalAlerts`
- `ProfitabilityAlerts`
- `ReportDefinitions`
- `ReportRuns`
- `MetricSnapshots`
- `DashboardWidgets`

**قرار مهم**

كل إعداد له version، لأن إعدادات التسعير والعمولة والمدة والخصومات تؤثر ماليًا.

---

## 6. أهم العلاقات

| العلاقة | النوع |
|---|---|
| User -> CustomerProfile/AdminProfile/DriverProfile/InfluencerProfile | 1:0..1 |
| User -> UserRoleAssignments -> Roles | many-to-many |
| Role -> RolePermissions -> Permissions | many-to-many |
| Restaurant -> RestaurantUsers -> Users | many-to-many |
| Restaurant -> Meals | 1:N |
| Program + Bundle + Restaurant -> RestaurantProgramBundlePrices | unique per active version |
| Subscription -> SubscriptionDays | 1:N |
| SubscriptionDay -> Order | غالبًا 1:0..1 |
| Order -> OrderStatusHistory | 1:N |
| Order -> DriverAssignments | 1:N history |
| Complaint -> ComplaintDecision -> Compensation/Deduction | 1:1 ثم events مالية |
| WalletAccount -> WalletLedgerEntries | 1:N append-only |
| BusinessEvent -> JournalEntry | 1:0..1 أو 1:N |
| Settlement -> SettlementItems | 1:N |
| Campaign -> RestaurantEnrollments | 1:N |

---

## 7. Critical Indexes

| الجدول | الفهارس |
|---|---|
| `Users` | unique filtered `Email`, unique filtered `Phone`, `PrimaryUserType`, `Status` |
| `AuditLogs` | `EntityType, EntityId`, `ActorUserId`, `CreatedAtUtc`, `CorrelationId` |
| `Restaurants` | `CountryId, Status`, `Tier`, `IsBusy` |
| `Meals` | `RestaurantId, ApprovalStatus, IsAvailable` |
| `RestaurantProgramBundlePrices` | unique active `RestaurantId, ProgramId, BundleId, EffectiveFromUtc` |
| `Subscriptions` | `CustomerId, Status`, `StartDate, EndDate` |
| `SubscriptionDays` | unique `SubscriptionId, ServiceDate`, `Status, ServiceDate` |
| `Orders` | `RestaurantId, DeliveryDate`, `DriverId, DeliveryDate`, `Status`, `ConfirmationDeadlineUtc` |
| `DriverLocations` | `DriverId, CapturedAtUtc desc`, optional geo index |
| `Payments` | unique `ProviderReference`, unique `IdempotencyKey`, `Status` |
| `WalletLedgerEntries` | `WalletAccountId, CreatedAtUtc`, unique `IdempotencyKey` |
| `BusinessEvents` | unique `EventKey`, `EventType, OccurredAtUtc`, `ProcessingStatus` |
| `JournalEntryLines` | `AccountId, PostedAtUtc` |
| `Settlements` | unique `PartyType, PartyId, PeriodFrom, PeriodTo` |
| `Notifications` | `RecipientUserId, CreatedAtUtc`, `Status` |

---

## 8. MVP Database Cut

### Phase 1 — Foundation

- Identity/RBAC/Audit.
- Countries/Areas.
- Restaurants + verification.
- Programs/Bundles/Meals.
- Restaurant pricing + classification snapshots.

### Phase 2 — Subscription Engine

- subscription creation.
- price quote/snapshot.
- payment skeleton.
- calendar generation.
- customer/restaurant/meal selection.
- allergies/preferences.

### Phase 3 — 72h Operations

- subscription day locks.
- orders.
- restaurant confirmation.
- replacement window.
- capacity/busy.
- barcodes/labels.

### Phase 4 — Delivery

- driver profiles/documents.
- assignments.
- barcode scans.
- tracking.
- hold/second attempt.
- safe contact.

### Phase 5 — Finance

- wallet ledger.
- refunds/cancellations.
- business events.
- journal entries.
- restaurant payables/settlements.
- influencer commissions.

### Phase 6 — Growth & Admin Intelligence

- campaigns.
- reports.
- KPI snapshots.
- profitability alerts.
- notification center.

---

## 9. Open Decisions Before EF Migrations

1. PostgreSQL + PostGIS أم SQL Server geography؟
2. هل سنستخدم ASP.NET Identity كاملًا أم identity custom خفيف؟
3. هل `AuditLogs.OldValueJson/NewValueJson` يكفي في البداية أم نحتاج event sourcing جزئي؟
4. ما retention policy للمواقع والـnotification delivery logs؟
5. هل المدفوعات ستكون provider واحد في MVP أم multi-provider من البداية؟
6. هل المحاسبة double-entry مطلوبة في MVP، أم BusinessEvents + ledgers أولًا ثم journal؟
7. هل لغة المحتوى ستبقى Ar/En فقط أم جدول translations من البداية؟

---

## 10. توصية التنفيذ التالية

الخطوة التالية العملية: إنشاء `database-schema-v1.md` أو ERD أولي من هذا التحليل، ثم تحويله إلى:

1. EF Core entities.
2. Fluent configurations.
3. initial migration.
4. seed data للـroles/permissions/programs/bundles/settings.
5. اختبارات constraints لأهم القواعد: unique active price، wallet ledger idempotency، order state transition، RBAC scope.

