# F001 — Spec After Fixes

## Purpose
تنفيذ **Customer Registration, Login & Onboarding** كمسار دخول سريع للعميل داخل التطبيق.

القرار الأساسي: **العميل يسجل ويدخل التطبيق فورًا بدون مراجعة أدمن وبدون Approval**.  
أي تحقق مثل OTP أو Email Verification يكون خفيفًا ولا يمنع دخول التطبيق العام، لكنه قد يقيّد عمليات حساسة لاحقًا مثل الدفع، المحفظة، تغيير رقم الهاتف، أو السحب.

## Business Rule
- تسجيل العميل لا يحتاج مراجعة إدارية.
- لا توجد حالة `PendingReview` أو `Approved` للعميل.
- بعد نجاح التسجيل، يتم إنشاء الحساب بحالة `Active`.
- يدخل العميل مباشرة إلى التطبيق ويكمل تجربة الاشتراك.
- التحقق من الهاتف/البريد يمكن أن يحدث أثناء أو بعد التسجيل حسب السياسة، لكنه لا يخلق بطء أو انتظار موافقة.
- يمكن منع العمليات الحساسة فقط إذا كان الحساب غير موثق، وليس منع تصفح التطبيق أو بدء رحلة الاشتراك.

## Owners
| Role | Responsibility |
|---|---|
| Business Owner | اعتماد سياسة التسجيل السريع وقيود العمليات الحساسة |
| Product Owner | تقليل الاحتكاك في تجربة التسجيل والدخول |
| Backend Owner | إنشاء الحساب والجلسة فورًا مع حماية التكرار |
| Frontend Owner | تجربة تسجيل قصيرة وواضحة |
| QA Owner | اختبار الدخول الفوري ومنع التكرار والأمان |

## State Machine
حالات العميل المقترحة:
- `Guest`: مستخدم لم يسجل بعد.
- `Active`: تم التسجيل بنجاح ويمكنه دخول التطبيق.
- `VerificationPending`: الحساب نشط لكن الهاتف/البريد غير موثق بعد.
- `Verified`: الحساب نشط وموثق.
- `Suspended`: الحساب موقوف إداريًا أو أمنيًا.
- `Closed`: الحساب مغلق.

ملاحظات مهمة:
- `Active` لا تنتظر `Approved`.
- `VerificationPending` لا تعني حظر دخول التطبيق.
- `Suspended` فقط هي التي تمنع الدخول أو الاستخدام حسب سبب الإيقاف.

## API Contract
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/auth/register/customer` | إنشاء حساب عميل وإرجاع session/token مباشرة |
| POST | `/api/v1/auth/login` | تسجيل الدخول |
| POST | `/api/v1/auth/verify-otp` | توثيق الهاتف/البريد |
| POST | `/api/v1/auth/resend-otp` | إعادة إرسال كود التحقق |
| POST | `/api/v1/auth/refresh` | تجديد الجلسة |
| POST | `/api/v1/auth/logout` | تسجيل الخروج |
| POST | `/api/v1/auth/forgot-password` | طلب إعادة تعيين كلمة المرور |
| POST | `/api/v1/auth/reset-password` | تنفيذ إعادة تعيين كلمة المرور |
| POST | `/api/v1/customers/me/profile-image` | رفع أو تغيير الصورة الشخصية |
| DELETE | `/api/v1/customers/me/profile-image` | حذف الصورة الشخصية |

## Registration Response
عند نجاح التسجيل:
- يتم إنشاء `CustomerAccount`.
- يتم إنشاء session/token.
- يرجع النظام بيانات المستخدم الأساسية.
- يرجع `profileImageUrl` إذا رفع العميل صورة شخصية، أو `null` لاستخدام placeholder.
- يرجع `verificationStatus`.
- يرجع `nextStep` مثل `choose_subscription` أو `complete_profile`.

## Required API Standards
- التسجيل والدخول لا يحتاجان token مسبق.
- باقي العمليات تحتاج Authentication.
- العمليات الحساسة تحتاج Authorization حسب الحالة.
- منع تكرار الحساب بالهاتف أو البريد.
- استخدام Idempotency-Key في التسجيل.
- Rate limiting على التسجيل وOTP وتسجيل الدخول.
- ProblemDetails للأخطاء.
- CorrelationId في كل response.

## Data Model Baseline
`CustomerAccount` يحتاج:
- Id
- FullName
- Email
- Phone
- ProfileImageUrl
- ProfileImageStorageKey
- PasswordHash
- CountryId
- RegionId
- Language
- Status
- VerificationStatus
- CreatedAtUtc
- LastLoginAtUtc
- RowVersion

## Validation Rules
- الهاتف أو البريد يجب أن يكون فريدًا.
- كلمة المرور تطبق password policy.
- الدولة والمنطقة يجب أن تكونا مدعومتين.
- لا يسمح بإنشاء أكثر من حساب لنفس phone/email.
- referral أو influencer code اختياري ولا يعطل التسجيل إذا كان غير موجود.
- الصورة الشخصية اختيارية ولا تمنع التسجيل.
- الصورة يجب أن تكون JPG أو PNG أو WebP.
- يتم رفض أي ملف غير صوري أو يتجاوز الحجم المسموح.
- عند عدم وجود صورة يستخدم التطبيق placeholder افتراضي.

## Audit Events
يجب تسجيل:
- CustomerRegistered
- CustomerLoggedIn
- CustomerProfileImageUploaded
- CustomerProfileImageDeleted
- OtpSent
- OtpVerified
- LoginFailed
- PasswordResetRequested
- PasswordResetCompleted
- AccountSuspended

## UX States
الشاشات يجب أن تدعم:
- Loading قصير أثناء إنشاء الحساب.
- Validation Error.
- Duplicate Account.
- Optional Profile Image Upload.
- Default Avatar Placeholder.
- OTP Optional / Verify Later.
- Login Error.
- Suspended Account.

## KPIs
- Registration Completion Rate.
- Time to Register.
- Login Success Rate.
- OTP Verification Rate.
- Duplicate Registration Attempts.
- First Subscription Conversion Rate.
