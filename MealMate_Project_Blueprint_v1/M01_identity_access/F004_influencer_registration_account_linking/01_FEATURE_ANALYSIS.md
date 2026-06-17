# F004 — Feature Analysis

## Context
الميزة ضمن **M01 — إدارة الحسابات والوصول** وتؤثر على نطاق الموديول ووظائفه الأساسية.

## Business Analysis
### 1.1 عدم وضوح نموذج المؤثر
التوثيق لا يحدد هل المؤثر:
- عميل عادي له كود.
- شريك تسويقي مستقل.
- حساب يحتاج اعتماد أدمن.
- له عمولة ثابتة أو متغيرة.

الأثر: صعوبة الربط مع M10 Influencers ومحاسبة العمولات.

### 1.2 عدم تحديد شروط استحقاق العمولة
لا يوجد ربط واضح بين التسجيل وشروط العمولة:
- متى يبدأ احتساب العمولة؟
- هل لازم العميل يدفع أول اشتراك؟
- ماذا يحدث عند إلغاء الاشتراك؟
- هل self-referral ممنوع؟

الأثر: استغلال أكواد الإحالة أو نزاعات مالية مع المؤثرين.

### 1.3 لا توجد سياسة قبول أو رفض للمؤثر
هل كل مستخدم يستطيع أن يصبح مؤثرًا؟ أم يحتاج موافقة؟ هل هناك مستويات مؤثرين؟

الأثر: تضخم غير منضبط في الأكواد والحملات.

### 1.4 غياب KPIs تجارية
ينقص:
- conversion per influencer.
- active influencer rate.
- fraud referral rate.
- commission cost per acquired customer.

الأثر: صعوبة معرفة هل برنامج المؤثرين مربح أم مكلف.

## Logic Analysis
### 2.1 منطق الربط غير واضح
لا يوجد تحديد لـ:
- هل الكود يربط مرة واحدة فقط؟
- هل يمكن تغيير المؤثر المرتبط بالعميل؟
- ماذا يحدث لو العميل أدخل كود بعد الاشتراك؟
- هل يمكن ربط أكثر من كود؟

الأثر: نتائج عمولات متضاربة.

### 2.2 منع الاحتيال غير مفصل
ينقص منطق منع:
- self-referral.
- نفس الجهاز ينشئ حسابات متعددة.
- نفس رقم الهاتف يستخدم عروض متعددة.
- المؤثر يربط أقاربه أو حسابات وهمية بشكل غير مشروع.

### 2.3 State Machine غير موجودة
المؤثر يحتاج حالات مثل:
- `PendingApproval`
- `Active`
- `Suspended`
- `BlockedForFraud`
- `Closed`

الأثر: صعوبة إيقاف مؤثر مشبوه بدون حذف سجله.

### 2.4 الربط مع M10 غير محدد
F004 يجب أن ينتج events تستخدمها موديولات المؤثرين:
- `InfluencerLinked`
- `ReferralCodeUsed`
- `CommissionEligibilityStarted`

الأثر: لاحقًا سيحتاج الفريق إعادة بناء الربط المالي من البداية.

## Data / API / Security Analysis
### 3.1 نموذج البيانات ناقص
ينقص:
- `InfluencerProfile`
- `InfluencerCode`
- `InfluencerCustomerLink`
- `ReferralAttribution`
- `FraudFlag`

### 3.2 uniqueness غير مفصل
يجب تحديد أن `InfluencerCode` unique وغير قابل لإعادة الاستخدام بعد الحذف بسهولة.

### 3.3 APIs غير كافية
المطلوب:
- create influencer profile.
- generate code.
- link customer to code.
- unlink with reason.
- suspend influencer.

## Current Improvement Direction
## Corrected Influencer Business Model
المؤثر في MealMate هو شخص عادي/مستخدم عادي يقوم بالترويج للمشروع من خلال محتوى خارجي مثل بوست، فيديو، ستوري، أو حملة. المؤثر ليس شركة ولا يحتاج دورة اعتماد معقدة؛ هو حساب شخصي يتم ربطه بملف ترويجي بسيط. المؤثر لا ينشئ الكود أو اللينك بنفسه؛ الأدمن هو المسؤول عن إنشاء ملف المؤثر وربط اسم المؤثر باللينك الترويجي والكود الترويجي ونسبة العمولة.

### Business View
- الأدمن ينشئ `InfluencerProfile` بسيط باسم المؤثر وبيانات التواصل وقنواته التسويقية.
- يمكن ربط `InfluencerProfile` بحساب مستخدم عادي موجود بالفعل، أو إنشاؤه كملف ترويجي مستقل ثم ربطه لاحقا بمستخدم.
- لا يحتاج المؤثر إلى مستندات شركة أو اعتماد قانوني مثل المطعم أو المندوب، إلا إذا قررت الإدارة طلب بيانات دفع أو تحقق مالي قبل صرف العمولة.
- الأدمن ينشئ للمؤثر:
  - `PromotionLink`: لينك يستخدمه المؤثر في البوست أو الفيديو.
  - `PromotionCode`: كود ترويجي يمكن للمستخدم إدخاله يدويا عند الاشتراك.
  - `CommissionRate`: نسبة العمولة على الاشتراكات القادمة من خلال اللينك أو الكود.
- نسبة العمولة يحددها الأدمن لكل مؤثر، وقد تختلف حسب قوة المؤثر أو الحملة أو مدة الاتفاق.
- العمولة تحتسب على الاشتراكات المدفوعة فقط، وليس على مجرد زيارة اللينك أو تسجيل حساب بدون اشتراك.
- يجب حفظ تاريخ بداية ونهاية الحملة حتى لا تستمر عمولات قديمة بدون قصد.

### Attribution View
- إذا دخل العميل من لينك المؤثر، يتم حفظ `ReferralAttribution` قبل الاشتراك.
- إذا أدخل العميل كود المؤثر عند الاشتراك، يتم ربط الاشتراك بنفس المؤثر.
- إذا استخدم العميل اللينك والكود معا لنفس المؤثر، يتم احتساب Attribution مرة واحدة فقط.
- إذا كان اللينك لمؤثر والكود لمؤثر آخر، يجب تطبيق قاعدة واضحة يحددها المنتج، والاقتراح الأفضل: الكود المدخل يدويا له أولوية لأنه نية مباشرة من العميل.
- يجب منع self-referral ومنع استخدام المؤثر لكوده على اشتراكاته الخاصة.

### Commission View
- العمولة تحتسب عند نجاح دفع الاشتراك وليس عند إنشاء الحساب.
- `CommissionRate` تحفظ كنسبة وقت إنشاء الاشتراك حتى لا تتغير العمولات القديمة إذا عدل الأدمن نسبة المؤثر لاحقا.
- عند إلغاء الاشتراك أو عمل refund، يتم عكس العمولة أو وضعها في حالة `Reversed` حسب سياسة المالية.
- يجب وجود تقرير للأدمن يوضح: اسم المؤثر، عدد الزيارات، عدد الاشتراكات، قيمة الاشتراكات، نسبة العمولة، العمولة المستحقة، العمولة المدفوعة، والمعلّقة.

### Data / API / Security View
- كيانات مطلوبة:
  - `InfluencerProfile`
  - `InfluencerPromotionLink`
  - `InfluencerPromotionCode`
  - `ReferralAttribution`
  - `InfluencerCommission`
  - `InfluencerCampaign`
- صلاحيات مهمة:
- الأدمن فقط ينشئ أو يوقف اللينك والكود.
- الأدمن فقط يحدد أو يعدل نسبة العمولة.
- تعديل نسبة العمولة لا يغير الاشتراكات القديمة إلا بقرار مالي واضح وAudit.
- أحداث مطلوبة:
  - `InfluencerCreated`
  - `InfluencerPromotionLinkCreated`
  - `InfluencerPromotionCodeCreated`
  - `ReferralAttributed`
  - `SubscriptionCommissionCreated`
  - `CommissionReversed`

1. **تعريف State Machine**
   - تحديد كل حالة مسموحة.
   - تحديد الانتقالات المسموحة والممنوعة.
   - ربط كل انتقال بصلاحية وسبب وAudit Log.

2. **تفصيل API Contract**
   - إضافة schemas لكل endpoint:
     - `GET /api/v1/influencer_registration_account_linking`
     - `GET /api/v1/influencer_registration_account_linking/{id}`
     - `POST /api/v1/influencer_registration_account_linking`
     - `PUT /api/v1/influencer_registration_account_linking/{id}`
     - `POST /api/v1/influencer_registration_account_linking/{id}/actions/{action}`
   - توثيق status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
   - اعتماد `ProblemDetails` للأخطاء و`CorrelationId` للتتبع.

3. **تفصيل صلاحيات Role/Scope**
   - ربط كل شاشة وكل endpoint بصلاحية مثل `F004.View`, `F004.Create`, `F004.Update`, `F004.Override`.
   - تحديد Scope حسب الدولة والمنطقة والكيان المرتبط.

4. **تعريف نموذج البيانات**
   - تحديد الجداول/الـ collections.
   - تحديد العلاقات، الفهارس، unique constraints، وretention policy.
   - إضافة `RowVersion` أو optimistic concurrency.
