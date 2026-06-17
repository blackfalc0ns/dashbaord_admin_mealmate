# MealMate — Database Schema Draft

> الغرض: مسودة أولية للجداول والعلاقات قبل تنفيذ EF Core migrations.

---

## 1. Conventions

| القاعدة | التفاصيل |
|---------|----------|
| IDs | `Guid` مبدئياً لكل الجداول الرئيسية |
| الوقت | UTC: `CreatedAtUtc`, `UpdatedAtUtc` |
| الحذف | Soft delete للكيانات التشغيلية، ممنوع حذف التاريخ المالي |
| المال | `decimal(18,3)` أو حسب العملة |
| النسب | `decimal(9,4)` كنسبة مئوية واضحة |
| Audit | إلزامي للمال، الصلاحيات، والاستثناءات |

---

## 2. Identity And Access

### `Users`

| الحقل | النوع | ملاحظات |
|-------|------|---------|
| Id | Guid | PK |
| FullName | string | |
| Email | string | unique nullable حسب طريقة التسجيل |
| Phone | string | unique nullable |
| PasswordHash | string | لا تخزين password |
| Role | enum | Customer/Admin/Restaurant/Driver |
| CountryId | Guid? | نطاق Country Admin |
| IsActive | bool | |
| CreatedAtUtc | DateTime | |

### `AdminProfiles`

- UserId
- AdminType: SuperAdmin / CountryAdmin
- CountryId nullable

### `CustomerProfiles`

- UserId
- DefaultAddressId
- AllergyCompleted
- WalletId

### `RestaurantUsers`

- UserId
- RestaurantId
- PermissionLevel

### `DriverProfiles`

- UserId
- DriverType: Platform / Restaurant
- RestaurantId nullable
- VehicleInfo
- LicenseDocumentId
- IsOnline

---

## 3. Geography

### `Countries`

- Id
- NameAr
- NameEn
- CurrencyCode
- TimeZoneId
- IsActive

### `Areas`

- Id
- CountryId
- NameAr
- NameEn
- Polygon/GeoJson nullable
- IsActive

### `RestaurantServiceAreas`

- RestaurantId
- AreaId

---

## 4. Restaurants

### `Restaurants`

| الحقل | ملاحظات |
|-------|---------|
| Id | PK |
| NameAr / NameEn | |
| CountryId | |
| Status | Pending/Approved/Suspended/Rejected |
| RatingAverage | |
| IsBusy | عام أو مشتق |
| MaxDailyBoxes | الطاقة الافتراضية |
| CreatedAtUtc | |

### `RestaurantDocuments`

- Id
- RestaurantId
- DocumentType
- FileUrl / StorageKey
- ExpiryDate
- Status
- ReviewedByAdminId

### `RestaurantCapacities`

- Id
- RestaurantId
- Date
- MaxBoxes
- UsedBoxes
- IsBusy

---

## 5. Programs, Bundles, Menus

### `Programs`

- Id
- NameAr / NameEn
- GoalType
- IsActive

### `Bundles`

- Id
- NameAr / NameEn
- MealCount
- Description
- IsActive

### `RestaurantProgramBundlePrices`

| الحقل | ملاحظات |
|-------|---------|
| Id | PK |
| RestaurantId | |
| ProgramId | |
| BundleId | |
| Price26Days | decimal |
| DailyPrice | computed or stored snapshot |
| EffectiveFromUtc | |
| IsActive | |

### `Meals`

- Id
- RestaurantId
- ProgramId
- BundleId nullable
- NameAr / NameEn
- DescriptionAr / DescriptionEn
- Calories
- Protein
- Carbs
- Fat
- IsAvailable

### `MealIngredients`

- MealId
- IngredientName
- IsAllergen

---

## 6. Classification And Pricing

### `RestaurantTierSnapshots`

- Id
- RestaurantId
- ProgramId
- BundleId
- Tier: Basic/Platinum/Elite
- DailyPrice
- Mean
- StdDev
- LowerThreshold
- UpperThreshold
- CalculatedAtUtc

### `PricingSettings`

- Id
- CountryId
- MaxCommissionPercent
- MinCommissionPercent
- SubscriberDiscountPercent
- InfluencerCommissionPercent
- RestaurantFixedCommissionPercent
- CancellationMinFeePercent
- CancellationMaxFeePercent
- OperationalDeductionDays
- UpdatedByAdminId
- UpdatedAtUtc

---

## 7. Subscriptions And Calendar

### `Subscriptions`

| الحقل | ملاحظات |
|-------|---------|
| Id | PK |
| CustomerId | |
| ProgramId | |
| BundleId | |
| Tier | |
| DurationDays | |
| StartDate | |
| EndDate | |
| Status | Active/Frozen/Cancelled/Expired |
| OriginalPrice | snapshot |
| PaidAmount | snapshot |
| CommissionPercent | snapshot |
| CreatedAtUtc | |

### `SubscriptionDays`

- Id
- SubscriptionId
- ServiceDate
- Status: Open/Locked/AwaitingRestaurantConfirmation/ReplacementWindow/Preparing/Delivered/Frozen/Cancelled
- SelectedRestaurantId nullable
- SelectedMealId nullable
- LockedAtUtc nullable
- RestaurantConfirmationDeadlineUtc nullable
- ReplacementWindowEndsAtUtc nullable

### `Orders`

- Id
- SubscriptionDayId
- CustomerId
- RestaurantId
- DriverId nullable
- Status
- DeliveryDate
- DeliveryWindow
- ConfirmedAtUtc nullable
- ConfirmationDeadlineUtc
- PreparedAtUtc nullable
- PickedUpAtUtc nullable
- DeliveredAtUtc nullable

### `OrderStatusHistory`

- Id
- OrderId
- FromStatus
- ToStatus
- ChangedByUserId nullable
- Reason
- CreatedAtUtc

---

## 8. Payments, Wallet, Refunds

### `Payments`

- Id
- CustomerId
- SubscriptionId
- Provider
- ProviderReference
- Amount
- Currency
- Status
- IdempotencyKey
- PaidAtUtc

### `Wallets`

- Id
- CustomerId
- Balance
- Currency

### `WalletTransactions`

- Id
- WalletId
- Type: Credit/Debit/Refund/Compensation/Payment
- Amount
- ReferenceType
- ReferenceId
- CreatedAtUtc

### `Refunds`

- Id
- SubscriptionId
- CustomerId
- PaymentId
- UsedDays
- OperationalDeductionDays
- RemainingDays
- RefundableAmount
- CancellationFeePercent
- CancellationFeeAmount
- FinalRefundAmount
- Status
- CreatedAtUtc

---

## 9. Complaints

### `Complaints`

- Id
- CustomerId
- OrderId
- RestaurantId
- Type
- Description
- Status
- ResolutionType
- CompensationAmount
- DeductFromRestaurantAmount
- CreatedAtUtc
- ResolvedAtUtc

### `ComplaintAttachments`

- Id
- ComplaintId
- StorageKey
- ContentType
- CreatedAtUtc

---

## 10. Invoices, Labels, Barcodes

### `Invoices`

- Id
- OrderId nullable
- SubscriptionId nullable
- InvoiceNumber
- Type: Customer/Restaurant/Settlement
- Amount
- Currency
- PdfStorageKey
- CreatedAtUtc

### `OrderBarcodes`

- Id
- OrderId
- BarcodeValue
- Status: Generated/Printed/PickupScanned/DeliveryScanned
- CreatedAtUtc

### `MealLabels`

- Id
- OrderId
- MealId
- LabelStorageKey
- PrintedAtUtc nullable

---

## 11. Delivery

### `DriverAssignments`

- Id
- OrderId
- DriverId
- AssignedAtUtc
- Status

### `DeliveryLocations`

- Id
- OrderId
- DriverId
- Latitude
- Longitude
- CapturedAtUtc

> ملاحظة: لا تخزن نقاط زائدة بلا داعي. استخدم throttling واحتفاظ محدود حسب السياسة.

---

## 12. Settlements

### `RestaurantSettlements`

- Id
- RestaurantId
- PeriodFrom
- PeriodTo
- DeliveredBoxesCount
- GrossBoxAmount
- RestaurantCommissionPercent
- RestaurantCommissionAmount
- ComplaintDeductions
- SubscriptionFees
- NetPayable
- Status
- ApprovedByAdminId
- ApprovedAtUtc

### `SettlementItems`

- Id
- SettlementId
- OrderId
- BoxPrice
- CommissionAmount
- DeductionAmount
- NetAmount

---

## 13. Audit

### `AuditLogs`

- Id
- ActorUserId
- Action
- EntityType
- EntityId
- OldValueJson nullable
- NewValueJson nullable
- Reason nullable
- IpAddress nullable
- CreatedAtUtc

Required for:

- Admin exceptions.
- Price/commission changes.
- Refunds/wallet changes.
- Settlement approvals.
- Phone exposure.
- Role/permission changes.

---

## 14. Important Indexes

| الجدول | الفهارس |
|--------|---------|
| Users | Email, Phone, Role, CountryId |
| Restaurants | CountryId, Status |
| Orders | RestaurantId+DeliveryDate, CustomerId, DriverId, Status, ConfirmationDeadlineUtc |
| SubscriptionDays | SubscriptionId+ServiceDate, Status |
| Payments | ProviderReference, IdempotencyKey, Status |
| Refunds | SubscriptionId, CustomerId, Status |
| Settlements | RestaurantId+PeriodFrom+PeriodTo |
| AuditLogs | ActorUserId, EntityType+EntityId, CreatedAtUtc |

---

## 15. MVP Tables

ابدأ بهذه الجداول أولاً:

1. Users / profiles / roles.
2. Countries / Areas.
3. Restaurants / RestaurantDocuments.
4. Programs / Bundles / Prices / Meals.
5. Subscriptions / SubscriptionDays / Orders.
6. Payments / Wallets / Refunds.
7. Complaints.
8. Invoices / Barcodes.
9. Settlements.
10. AuditLogs.
