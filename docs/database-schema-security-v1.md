# MealMate — Database Schema & Regulated Security v1

> المرجع: `MealMate_Project_Blueprint_v1` + `docs/database-analysis-blueprint-v1.md`.
>
> القرارات المثبتة:
> - قاعدة البيانات: PostgreSQL + PostGIS.
> - العزل: Database per Country.
> - المستندات: S3-compatible object storage + KMS.
> - التشفير: Maximum Regulated.
> - البيانات المعروضة للمستخدمين: عربية وإنجليزية من أول التصميم.

---

## 1. Architecture Decisions

### 1.1 Database Layout

MealMate يستخدم نموذج عزل قوي:

- `control_plane`: قاعدة عالمية صغيرة لإدارة الدول والـtenants والمفاتيح والإعدادات العامة.
- `mealmate_{country_code}`: قاعدة مستقلة لكل دولة، مثل `mealmate_kw`, `mealmate_eg`, `mealmate_sa`.
- كل tenant DB يحتوي `country_id` كحاجز إضافي، لكن العزل الحقيقي على مستوى database.

### 1.2 PostgreSQL Schemas Inside Each Tenant DB

| Schema | Purpose |
|---|---|
| `iam` | users, profiles, RBAC, sessions |
| `security` | encryption refs, audit, document metadata |
| `geo` | countries copy, areas, service zones, PostGIS |
| `catalog` | programs, bundles, restaurants, meals, pricing |
| `subscription` | subscriptions, days, selection, freeze |
| `operation` | orders, confirmations, barcode, labels |
| `delivery` | drivers, assignments, tracking, safe contact |
| `support` | complaints, evidence, tickets |
| `finance` | payments, wallets, refunds, accounting, settlements |
| `marketing` | influencers, referrals, campaigns |
| `admin` | settings, notifications, reports, metrics |

### 1.3 ID, Time, Money, Language

| Rule | Decision |
|---|---|
| IDs | UUID لكل الجداول الرئيسية |
| High-volume IDs | `bigint generated always as identity` مسموح لـlocation/audit/event lines |
| Time | `timestamptz` UTC فقط |
| Date-only | `date` لأيام الاشتراك والتسوية |
| Money | `numeric(18,3)` + `currency_code char(3)` |
| Percent | `numeric(9,4)` كنسبة عشرية، مثال 0.1500 |
| Row version | `xmin` أو عمود `row_version bigint` حسب EF mapping |
| Language codes | `ar`, `en` فقط في v1 |

---

## 2. Arabic & English Data Policy

### 2.1 What Must Be Bilingual

أي محتوى تجاري أو ديناميكي يراه المستخدم يجب أن يكون عربي وإنجليزي:

- أسماء الدول والمناطق.
- أسماء البرامج والباقات.
- أسماء المطاعم المعروضة.
- أسماء الوجبات ووصفها والمكونات والتحذيرات.
- أسماء الحساسية والتفضيلات.
- قوالب الإشعارات.
- أسباب الحالات المعروضة للعميل/المطعم/المندوب.
- الفواتير والملصقات والباركود labels.
- campaign titles/descriptions.
- system settings labels التي تظهر في لوحة الأدمن.

### 2.2 What Is Not Translated

بيانات الأشخاص ليست محتوى مترجم:

- اسم العميل، رقم الهاتف، البريد، العنوان، الحساب البنكي، رقم الهوية.
- هذه تخزن كما أدخلها المستخدم، وتشفّر لو كانت PII.
- لا نعمل `full_name_ar/full_name_en` للعميل إلا لو المنتج طلب أسماء قانونية بلغتين لاحقًا.

### 2.3 Column Convention

في v1 نعتمد أعمدة واضحة وسريعة:

- `name_ar`, `name_en`
- `description_ar`, `description_en`
- `title_ar`, `title_en`
- `message_ar`, `message_en`
- `reason_ar`, `reason_en`

القواعد:

- الحقول الثنائية إلزامية قبل الاعتماد والنشر.
- `CHECK (length(trim(name_ar)) > 0 AND length(trim(name_en)) > 0)` للجداول التي تحتاج اسمًا منشورًا.
- أي content approval يفشل إذا كانت العربية أو الإنجليزية ناقصة.

### 2.4 Templates & Future Languages

قوالب الإشعارات والرسائل تستخدم جدول translations لأن عددها كبير وقابل للتوسع:

- `admin.notification_templates`
- `admin.notification_template_versions`
- `admin.notification_template_translations(locale_code = 'ar'|'en')`

أما catalog عالي القراءة مثل meals/programs/bundles فيستخدم أعمدة `*_ar/*_en` في v1.

---

## 3. Regulated Encryption Model

### 3.1 Data Classification

| Class | Examples | Protection |
|---|---|---|
| Public | أسماء برامج منشورة، وجبات منشورة | عادي + audit للتعديل |
| Internal | capacity, pricing rules, KPIs | RBAC + audit |
| Confidential | phone, email, address, bank, exact customer location | field encryption + blind index |
| Restricted | documents, raw payment events, phone exposure, KMS refs | envelope encryption + strict audit |

### 3.2 Field Encryption Columns

أي حقل مشفر يخزن بهذا النمط:

- `{field}_cipher bytea not null`
- `{field}_nonce bytea not null`
- `{field}_tag bytea not null`
- `{field}_key_id uuid not null`
- `{field}_key_version int not null`
- `{field}_alg text not null default 'AES-256-GCM'`

للبحث أو uniqueness:

- `{field}_blind_index bytea`
- HMAC-SHA-256 على value normalized بمفتاح BlindIndex منفصل في KMS.

### 3.3 Key Hierarchy

- KEK: داخل KMS/HSM ولا يخرج للتطبيق.
- DEK: لكل tenant أو لكل record عالي الحساسية، يلف بـKEK.
- Document DEK: لكل مستند.
- BlindIndex key: منفصل عن مفاتيح التشفير.

الجداول لا تخزن مفاتيح خام. تخزن `key_id`, `key_version`, `encrypted_dek`.

### 3.4 Sensitive Fields In v1

| Table | Fields |
|---|---|
| `iam.users` | email, phone, display name عند الحاجة |
| `iam.customer_profiles` | date of birth, gender عند الحاجة |
| `iam.driver_profiles` | license identifiers |
| `geo.customer_addresses` | address text, precise coordinates |
| `finance.customer_bank_accounts` | account holder, IBAN/account number |
| `finance.payment_provider_events` | raw provider payload |
| `security.secure_documents` | document number, OCR metadata |
| `delivery.phone_exposure_events` | exposed customer phone |
| `delivery.safe_contact_sessions` | masked call provider payload |

### 3.5 Payment PCI Rule

- لا نخزن card PAN أو CVV نهائيًا.
- نخزن فقط provider customer token/reference، transaction reference، last4/brand إن أتاحها provider بشكل PCI-safe.
- raw webhook payload مشفر.

---

## 4. Control Plane Schema

### `public.countries`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `code` | char(2) | unique, ISO country code |
| `name_ar` | text | required |
| `name_en` | text | required |
| `default_locale` | text | `ar` أو `en` |
| `currency_code` | char(3) | ISO currency |
| `time_zone_id` | text | IANA timezone |
| `is_active` | boolean | default true |
| `created_at_utc` | timestamptz | required |

### `public.tenant_databases`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | FK countries |
| `database_name` | text | unique |
| `connection_secret_ref` | text | secret manager ref |
| `status` | text | Provisioning/Active/Suspended/Archived |
| `schema_version` | text | current migration version |
| `created_at_utc` | timestamptz | required |

### `public.tenant_key_references`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | FK countries |
| `purpose` | text | FieldEncryption/DocumentEncryption/BlindIndex/Backup |
| `kms_key_id` | text | not raw key |
| `active_version` | int | required |
| `status` | text | Active/Rotating/Retired |
| `created_at_utc` | timestamptz | required |

---

## 5. Tenant Foundation Tables

### `security.encryption_key_references`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `purpose` | text | Field/Document/BlindIndex/Backup |
| `kms_key_id` | text | required |
| `key_version` | int | required |
| `status` | text | Active/Rotating/Retired |
| `created_at_utc` | timestamptz | required |

### `security.audit_logs`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `actor_user_id` | uuid | nullable for system |
| `action` | text | required |
| `entity_type` | text | required |
| `entity_id` | uuid | nullable |
| `country_id` | uuid | required |
| `old_value_json` | jsonb | encrypted if contains PII |
| `new_value_json` | jsonb | encrypted if contains PII |
| `reason` | text | required for sensitive actions |
| `correlation_id` | text | required |
| `ip_address_cipher` | bytea | encrypted |
| `user_agent` | text | nullable |
| `created_at_utc` | timestamptz | required |

Indexes:

- `(entity_type, entity_id, created_at_utc desc)`
- `(actor_user_id, created_at_utc desc)`
- `(correlation_id)`

### `security.data_access_audit`

يسجل قراءة/تصدير البيانات الحساسة، وليس التعديل فقط.

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `actor_user_id` | uuid | required |
| `access_type` | text | View/Download/Export/Decrypt |
| `entity_type` | text | required |
| `entity_id` | uuid | required |
| `field_group` | text | PII/Bank/Document/PhoneExposure |
| `purpose` | text | required |
| `correlation_id` | text | required |
| `created_at_utc` | timestamptz | required |

---

## 6. IAM, RBAC, Profiles

### `iam.users`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | required |
| `primary_user_type` | text | Customer/Admin/Restaurant/Driver/Influencer |
| `display_name_cipher` | bytea | encrypted |
| `display_name_*` | encryption metadata | nonce/tag/key/version/alg |
| `email_cipher` | bytea | encrypted nullable |
| `email_blind_index` | bytea | unique filtered |
| `phone_cipher` | bytea | encrypted nullable |
| `phone_blind_index` | bytea | unique filtered |
| `preferred_locale` | text | `ar` or `en`, default country |
| `status` | text | Registered/PhonePending/Active/Suspended/Closed |
| `created_at_utc` | timestamptz | required |
| `updated_at_utc` | timestamptz | required |

### `iam.user_credentials`

| Column | Type | Rules |
|---|---|---|
| `user_id` | uuid | PK/FK users |
| `password_hash` | text | nullable for external auth |
| `password_updated_at_utc` | timestamptz | nullable |
| `mfa_enabled` | boolean | default false |
| `failed_login_count` | int | default 0 |
| `locked_until_utc` | timestamptz | nullable |

### RBAC Tables

- `iam.roles(id, code, name_ar, name_en, scope_type, is_system)`
- `iam.permissions(id, code, name_ar, name_en, module_code, feature_code)`
- `iam.role_permissions(role_id, permission_id)`
- `iam.user_role_assignments(id, user_id, role_id, scope_type, scope_id, starts_at_utc, ends_at_utc)`
- `iam.user_scopes(id, user_id, scope_type, scope_id)`

Scope types:

- Global
- Country
- Area
- Restaurant
- Driver
- Campaign

### Profiles

- `iam.customer_profiles(user_id, default_address_id, allergy_completed, onboarding_completed_at_utc)`
- `iam.admin_profiles(user_id, admin_type, country_id nullable)`
- `iam.restaurant_users(user_id, restaurant_id, permission_level, status)`
- `iam.driver_profiles(user_id, driver_type, restaurant_id nullable, status, is_online)`
- `iam.influencer_profiles(user_id, status, public_code nullable)`

---

## 7. Documents & Verification

### `security.verification_requests`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | required |
| `owner_type` | text | Restaurant/Driver/Influencer/Admin |
| `owner_id` | uuid | required |
| `request_type` | text | Registration/Renewal/DocumentUpdate |
| `status` | text | Draft/Submitted/InReview/Approved/Rejected/Expired |
| `submitted_at_utc` | timestamptz | nullable |
| `reviewed_by_user_id` | uuid | nullable |
| `reviewed_at_utc` | timestamptz | nullable |
| `decision_reason_ar` | text | nullable |
| `decision_reason_en` | text | nullable |
| `created_at_utc` | timestamptz | required |

### `security.secure_documents`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | required |
| `verification_request_id` | uuid | FK nullable |
| `owner_type` | text | required |
| `owner_id` | uuid | required |
| `document_type` | text | required |
| `status` | text | Uploaded/PendingReview/Approved/Rejected/Expired/Revoked/Archived |
| `storage_bucket` | text | required |
| `storage_key` | text | unique |
| `content_type` | text | required |
| `size_bytes` | bigint | required |
| `sha256_checksum` | bytea | required |
| `encrypted_dek` | bytea | wrapped by KMS |
| `kms_key_id` | text | required |
| `key_version` | int | required |
| `retention_until_utc` | timestamptz | required |
| `uploaded_by_user_id` | uuid | required |
| `created_at_utc` | timestamptz | required |

### `security.document_access_audit`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `document_id` | uuid | FK secure_documents |
| `actor_user_id` | uuid | required |
| `action` | text | ViewMetadata/Download/Export/Review |
| `purpose` | text | required |
| `correlation_id` | text | required |
| `created_at_utc` | timestamptz | required |

Document download rules:

- No direct public URL.
- Backend checks RBAC + scope.
- Short-lived signed URL only after audit.
- Raw document object remains encrypted with document DEK + storage SSE-KMS.

---

## 8. Geography & Addresses

### `geo.areas`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | required |
| `name_ar` | text | required |
| `name_en` | text | required |
| `area_type` | text | Governorate/City/District/Zone |
| `parent_area_id` | uuid | nullable |
| `boundary` | geography(MultiPolygon, 4326) | nullable |
| `center_point` | geography(Point, 4326) | nullable |
| `is_active` | boolean | default true |

Indexes:

- GIST on `boundary`
- `(country_id, area_type, is_active)`

### `geo.customer_addresses`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `customer_user_id` | uuid | FK users |
| `area_id` | uuid | FK areas |
| `label` | text | Home/Work/etc. not necessarily bilingual |
| `address_text_cipher` | bytea | encrypted |
| `precise_location_cipher` | bytea | encrypted lat/long JSON |
| `public_area_hint_ar` | text | visible to restaurant |
| `public_area_hint_en` | text | visible to restaurant |
| `is_default` | boolean | default false |
| `created_at_utc` | timestamptz | required |

Restaurant sees `public_area_hint_ar/en`, not exact location.
Driver gets exact location only through authorized delivery API, not direct DB exposure.

---

## 9. Catalog, Restaurants, Meals

### `catalog.restaurants`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | required |
| `name_ar` | text | required |
| `name_en` | text | required |
| `description_ar` | text | nullable |
| `description_en` | text | nullable |
| `status` | text | Pending/Approved/Suspended/Rejected/Terminating/Closed |
| `rating_average` | numeric(4,2) | default 0 |
| `default_max_daily_boxes` | int | required |
| `is_busy` | boolean | default false |
| `created_at_utc` | timestamptz | required |

### `catalog.programs`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | nullable for global template |
| `code` | text | unique per country |
| `name_ar` | text | required |
| `name_en` | text | required |
| `description_ar` | text | required |
| `description_en` | text | required |
| `goal_type` | text | Fitness/LosingWeight/etc. |
| `is_active` | boolean | default true |

### `catalog.bundles`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | nullable |
| `code` | text | required |
| `name_ar` | text | required |
| `name_en` | text | required |
| `description_ar` | text | required |
| `description_en` | text | required |
| `meal_count` | int | required |
| `is_active` | boolean | default true |

### `catalog.meals`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `restaurant_id` | uuid | FK restaurants |
| `program_id` | uuid | FK programs |
| `bundle_id` | uuid | FK bundles nullable |
| `name_ar` | text | required |
| `name_en` | text | required |
| `description_ar` | text | required |
| `description_en` | text | required |
| `nutrition_notes_ar` | text | nullable |
| `nutrition_notes_en` | text | nullable |
| `calories` | numeric(8,2) | nullable |
| `protein_g` | numeric(8,2) | nullable |
| `carbs_g` | numeric(8,2) | nullable |
| `fat_g` | numeric(8,2) | nullable |
| `approval_status` | text | Draft/PendingApproval/Approved/Rejected/Archived |
| `is_available` | boolean | default true |
| `effective_from_utc` | timestamptz | required |
| `effective_to_utc` | timestamptz | nullable |

### `catalog.ingredients`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `country_id` | uuid | required |
| `name_ar` | text | required |
| `name_en` | text | required |
| `is_allergen` | boolean | default false |

### Join Tables

- `catalog.meal_ingredients(meal_id, ingredient_id, notes_ar, notes_en)`
- `catalog.allergens(id, name_ar, name_en, severity_default)`
- `catalog.meal_allergens(meal_id, allergen_id, warning_ar, warning_en)`
- `catalog.restaurant_service_areas(restaurant_id, area_id)`

Approval rule:

- meal cannot become `Approved` unless all required Arabic/English fields are present.

---

## 10. Pricing & Snapshots

### `catalog.restaurant_program_bundle_prices`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `restaurant_id` | uuid | FK |
| `program_id` | uuid | FK |
| `bundle_id` | uuid | FK |
| `price_26_days` | numeric(18,3) | required |
| `daily_price` | numeric(18,3) | stored snapshot |
| `currency_code` | char(3) | required |
| `status` | text | Draft/PendingApproval/Active/Superseded/Rejected |
| `effective_from_utc` | timestamptz | required |
| `effective_to_utc` | timestamptz | nullable |
| `created_by_user_id` | uuid | required |

Unique:

- one active price per `(restaurant_id, program_id, bundle_id)`.

### `catalog.restaurant_tier_snapshots`

Stores classification output:

- `restaurant_id`, `program_id`, `bundle_id`
- `tier`: Basic/Platinum/Elite
- `daily_price`, `mean_price`, `std_dev`, `lower_threshold`, `upper_threshold`
- `calculated_at_utc`
- `pricing_version_id`

### `subscription.subscription_pricing_snapshots`

Immutable snapshot when customer creates/renews/upgrades:

- `subscription_id`
- `program_id`, `bundle_id`, `tier`
- `duration_days`
- `base_daily_cost`
- `platform_commission_percent`
- `subscriber_discount_percent`
- `influencer_commission_percent`
- `gross_amount`, `discount_amount`, `paid_amount`
- `currency_code`
- `settings_version_id`
- `created_at_utc`

---

## 11. Subscriptions, Calendar, Orders

### `subscription.subscriptions`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `customer_user_id` | uuid | FK users |
| `program_id` | uuid | required |
| `bundle_id` | uuid | required |
| `tier` | text | Basic/Platinum/Elite |
| `duration_days` | int | required |
| `start_date` | date | required |
| `end_date` | date | required |
| `status` | text | Draft/PendingPayment/Active/Frozen/Cancelled/Expired |
| `created_at_utc` | timestamptz | required |

### `subscription.subscription_days`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `subscription_id` | uuid | FK |
| `service_date` | date | required |
| `status` | text | Open/CustomerSelected/AutoSelected/Locked72h/SentToRestaurant/Confirmed/ReplacementWindow/Preparing/Delivered/Frozen/Cancelled/Failed |
| `selected_restaurant_id` | uuid | nullable |
| `selected_meal_id` | uuid | nullable |
| `locked_at_utc` | timestamptz | nullable |
| `restaurant_confirmation_deadline_utc` | timestamptz | nullable |
| `replacement_window_ends_at_utc` | timestamptz | nullable |

Unique:

- `(subscription_id, service_date)`

### Histories

- `subscription.subscription_status_history`
- `subscription.subscription_day_status_history`
- `subscription.restaurant_selections`
- `subscription.meal_selections`
- `subscription.automatic_selection_runs`
- `subscription.automatic_selection_candidates`
- `subscription.freeze_requests`
- `subscription.freeze_days`

### `operation.orders`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `subscription_day_id` | uuid | FK |
| `customer_user_id` | uuid | FK users |
| `restaurant_id` | uuid | FK restaurants |
| `driver_user_id` | uuid | nullable |
| `status` | text | lifecycle status |
| `delivery_date` | date | required |
| `delivery_window_start_utc` | timestamptz | required |
| `delivery_window_end_utc` | timestamptz | required |
| `meal_snapshot_json` | jsonb | contains ar/en meal labels |
| `created_at_utc` | timestamptz | required |

Meal snapshot must include:

- `meal_name_ar`, `meal_name_en`
- `restaurant_name_ar`, `restaurant_name_en`
- ingredients/warnings in both languages.

---

## 12. Delivery & Privacy

### `delivery.driver_assignments`

- `id`, `order_id`, `driver_user_id`, `assigned_by_user_id`, `status`, `assigned_at_utc`.

### `delivery.driver_location_events`

| Column | Type | Rules |
|---|---|---|
| `id` | bigint identity | PK |
| `driver_user_id` | uuid | required |
| `order_id` | uuid | nullable |
| `location` | geography(Point, 4326) | restricted access |
| `speed_kph` | numeric(8,2) | nullable |
| `captured_at_utc` | timestamptz | required |

Retention:

- raw driver locations: 30 days.
- aggregated performance snapshots: retained 7 years if financial/operational reporting needs them.

### `delivery.safe_contact_sessions`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `order_id` | uuid | required |
| `driver_user_id` | uuid | required |
| `customer_user_id` | uuid | required |
| `provider_reference_cipher` | bytea | encrypted |
| `status` | text | Created/Connected/Failed/Expired |
| `started_at_utc` | timestamptz | required |

### `delivery.phone_exposure_events`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `order_id` | uuid | required |
| `driver_user_id` | uuid | required |
| `customer_user_id` | uuid | required |
| `exposed_phone_cipher` | bytea | encrypted |
| `reason_ar` | text | required |
| `reason_en` | text | required |
| `approved_by_user_id` | uuid | nullable/system |
| `attempt_count_before_exposure` | int | must be >= 2 |
| `admin_notified_at_utc` | timestamptz | required |
| `created_at_utc` | timestamptz | required |

Rule:

- no phone exposure without failed attempts + Hold/second attempt workflow + audit.

---

## 13. Complaints & Support

### `support.complaints`

- `id`, `customer_user_id`, `order_id`, `restaurant_id`
- `type_code`
- `description_cipher` if contains PII
- `status`
- `resolution_type`
- `created_at_utc`, `resolved_at_utc`

### Bilingual Classification

- `support.complaint_types(id, code, name_ar, name_en, description_ar, description_en)`
- `support.complaint_decision_reasons(id, code, reason_ar, reason_en)`

### Attachments

Complaint evidence photos use `security.secure_documents` with owner type `Complaint`.

---

## 14. Finance, Wallet, Accounting

### `finance.payments`

- `id`, `customer_user_id`, `subscription_id`
- `provider`, `provider_reference`
- `amount`, `currency_code`, `status`
- `idempotency_key` unique
- `paid_at_utc`

### `finance.payment_provider_events`

- raw provider webhook payload encrypted.
- unique provider event id.

### `finance.wallet_accounts`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `customer_user_id` | uuid | required |
| `wallet_type` | text | Cash/Promotional |
| `currency_code` | char(3) | required |
| `balance_cache` | numeric(18,3) | cache only |
| `status` | text | Active/Frozen/Closed |

### `finance.wallet_ledger_entries`

Append-only source of truth:

- `id`
- `wallet_account_id`
- `entry_type`: Credit/Debit/Refund/Compensation/Payment/Withdrawal
- `amount`
- `currency_code`
- `reference_type`, `reference_id`
- `idempotency_key` unique
- `created_at_utc`

No update/delete except technical correction through reversal entry.

### Accounting Tables

- `finance.chart_of_accounts`
- `finance.accounting_periods`
- `finance.business_events`
- `finance.journal_entries`
- `finance.journal_entry_lines`
- `finance.deferred_revenue_schedules`
- `finance.revenue_recognition_entries`
- `finance.settlements`
- `finance.settlement_items`

Business event first, journal later:

- `SubscriptionPaid`
- `OrderDelivered`
- `RefundApproved`
- `ComplaintResolved`
- `RestaurantPayoutApproved`
- `InfluencerCommissionEarned`
- `CampaignDiscountConsumed`

---

## 15. Restaurant Finance, Influencers, Campaigns

### Restaurant Finance

- `finance.restaurant_payables`
- `finance.restaurant_commission_snapshots`
- `finance.restaurant_invoice_periods`
- `finance.restaurant_invoices`
- `finance.restaurant_invoice_items`
- `finance.restaurant_payout_requests`
- `finance.restaurant_payouts`
- `finance.transfer_receipts`

Invoice/receipt generated files:

- stored as secure documents.
- generated PDF must include Arabic and English labels.

### Influencers

- `marketing.influencers`
- `marketing.influencer_codes`
- `marketing.referral_attributions`
- `marketing.influencer_commission_rules`
- `marketing.influencer_commissions`
- `marketing.influencer_withdrawal_requests`
- `marketing.influencer_payouts`

Public campaign/influencer labels use `name_ar/name_en` or `title_ar/title_en`.

### Campaigns

- `marketing.campaigns(title_ar, title_en, description_ar, description_en, status, dates...)`
- `marketing.campaign_discount_splits`
- `marketing.campaign_programs`
- `marketing.campaign_bundles`
- `marketing.campaign_restaurant_enrollments`
- `marketing.campaign_subscriber_caps`
- `marketing.campaign_accounting_events`

Campaign cannot launch if Arabic/English content is incomplete.

---

## 16. Notifications, Reports, Labels

### `admin.notification_templates`

- `id`, `code`, `channel`, `status`.

### `admin.notification_template_versions`

- `id`, `template_id`, `version`, `status`, `created_at_utc`.

### `admin.notification_template_translations`

| Column | Type | Rules |
|---|---|---|
| `id` | uuid | PK |
| `template_version_id` | uuid | FK |
| `locale_code` | text | `ar` or `en` |
| `subject` | text | nullable |
| `body` | text | required |

Unique:

- `(template_version_id, locale_code)`

### `admin.notification_messages`

Stores selected language at send time:

- `recipient_user_id`
- `locale_code`
- `subject_snapshot`
- `body_snapshot`
- `status`

### Labels & Invoices

- invoices and meal labels use bilingual snapshots at generation time.
- generated PDFs/labels are stored as `security.secure_documents`.
- order barcode display text includes Arabic and English meal/restaurant labels.

---

## 17. Critical Indexes

| Table | Index |
|---|---|
| `iam.users` | unique filtered `email_blind_index` |
| `iam.users` | unique filtered `phone_blind_index` |
| `iam.user_role_assignments` | `(user_id, scope_type, scope_id)` |
| `security.audit_logs` | `(entity_type, entity_id, created_at_utc desc)` |
| `security.data_access_audit` | `(actor_user_id, created_at_utc desc)` |
| `security.secure_documents` | `(owner_type, owner_id, status)` |
| `geo.areas` | GIST `boundary` |
| `catalog.meals` | `(restaurant_id, approval_status, is_available)` |
| `catalog.restaurant_program_bundle_prices` | unique active price |
| `subscription.subscription_days` | unique `(subscription_id, service_date)` |
| `operation.orders` | `(restaurant_id, delivery_date, status)` |
| `operation.orders` | `(driver_user_id, delivery_date, status)` |
| `delivery.driver_location_events` | GIST `location` |
| `delivery.driver_location_events` | `(driver_user_id, captured_at_utc desc)` |
| `finance.wallet_ledger_entries` | unique `idempotency_key` |
| `finance.business_events` | unique `event_key` |
| `finance.settlements` | unique `(party_type, party_id, period_from, period_to)` |

---

## 18. Retention Defaults

| Data | Default |
|---|---|
| Financial ledgers/journals | 7 years |
| Security/audit logs | 7 years |
| Driver raw location events | 30 days |
| Notification delivery logs | 180 days |
| Secure documents | country policy, default 7 years after relationship end |
| Expired signed URLs | max 5 minutes |
| Payment provider raw payloads | 2 years encrypted unless country policy differs |

Retention is stored in `security.retention_policies` per country and data type.

---

## 19. Build Order

1. Control plane + tenant resolver.
2. Tenant DB baseline schemas.
3. KMS abstraction + field encryption + blind indexes.
4. IAM/RBAC/audit.
5. Secure documents pipeline.
6. Geo/areas/PostGIS.
7. Catalog bilingual tables.
8. Pricing snapshots.
9. Subscriptions/calendar/orders.
10. Delivery privacy and phone exposure.
11. Wallet/accounting ledgers.
12. Campaigns/influencers/reports.

---

## 20. Acceptance Criteria

- No plaintext phone/email/bank/address/document number in DB.
- User-facing catalog data cannot be approved with Arabic missing or English missing.
- Driver cannot fetch customer name or phone through normal order APIs.
- Restaurant cannot fetch exact customer address or identity.
- Every document view/download/export creates audit.
- Every phone exposure creates audit + admin notification.
- Wallet balance can be rebuilt from ledger entries.
- Subscription price can be explained from immutable snapshots.
- Tenant admin cannot access another country database.
- Backups and object storage are encrypted with KMS-managed keys.

