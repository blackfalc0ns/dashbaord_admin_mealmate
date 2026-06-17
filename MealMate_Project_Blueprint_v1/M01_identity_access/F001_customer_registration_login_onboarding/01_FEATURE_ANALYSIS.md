# F001 — Feature Analysis

## Context
الميزة ضمن **M01 — إدارة الحسابات والوصول**، وهي أول نقطة دخول للعميل إلى MealMate.

## Business Analysis
### التسجيل يجب أن يكون سريعًا
العميل لا يحتاج مراجعة مثل المطعم أو السائق. أي انتظار أو Approval في تسجيل العميل سيقلل التحويل ويخلق إحساسًا أن التطبيق بطيء من أول لحظة.

القرار:
- العميل يسجل ويدخل فورًا.
- لا يوجد Pending Review.
- لا يوجد Admin Approval.
- لا يوجد انتظار قبل استخدام التطبيق.

### Onboarding منفصل عن التسجيل
الـ Onboarding هدفه شرح قيمة MealMate، وليس تعطيل إنشاء الحساب. يمكن للعميل تخطيه أو إكماله بسرعة.

### الصورة الشخصية
حساب المستخدم يدعم صورة شخصية تظهر في الملف الشخصي وتجربة التطبيق.

القرار:
- الصورة الشخصية اختيارية أثناء التسجيل.
- يمكن رفعها أو تغييرها لاحقًا من صفحة الملف الشخصي.
- عدم وجود صورة لا يمنع التسجيل أو دخول التطبيق.
- يظهر placeholder افتراضي إذا لم يرفع المستخدم صورة.

### التحقق لا يمنع الدخول العام
OTP أو Email Verification مهم للأمان، لكنه لا يجب أن يمنع دخول التطبيق العام. يستخدم فقط لحماية العمليات الحساسة مثل الدفع أو المحفظة أو تغيير رقم الهاتف.

### KPIs المطلوبة
- Registration Completion Rate.
- Time to Register.
- First App Entry Rate.
- First Subscription Conversion Rate.
- OTP Verification Rate.
- Duplicate Registration Attempts.

## Logic Analysis
### State Machine مناسبة للعميل
الحالات الصحيحة:
- `Guest`
- `Active`
- `VerificationPending`
- `Verified`
- `Suspended`
- `Closed`

الحالات غير المناسبة لتسجيل العميل:
- `Approved`
- `Rejected`

هذه الحالات مناسبة للمطعم أو السائق، وليست للعميل.

### منع التكرار
يجب منع إنشاء أكثر من حساب بنفس:
- Phone.
- Email.
- Social Provider ID عند تفعيل social login.

### الجلسات
بعد التسجيل الناجح:
- يصدر النظام access token.
- يصدر refresh token عند الحاجة.
- يحدث `LastLoginAtUtc`.
- يدخل العميل التطبيق مباشرة.

### نسيان كلمة المرور
إعادة تعيين كلمة المرور يجب أن تكون OTP/email based مع rate limiting وexpiry.

## Data / API / Security Analysis
### APIs المناسبة
- `POST /api/v1/auth/register/customer`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

### بيانات التسجيل
الحد الأدنى:
- FullName.
- Phone أو Email.
- Password.
- CountryId.
- RegionId عند الحاجة.
- Language.
- ProfileImage اختياري.

### بيانات الصورة الشخصية
- تقبل JPG وPNG وWebP.
- تحفظ في storage منفصل كـ `ProfileImageStorageKey` أو `ProfileImageUrl`.
- لا تحفظ كـ binary داخل جدول المستخدم.
- يمكن حذفها أو تغييرها لاحقًا.
- يتم استخدام صورة افتراضية عند عدم وجود صورة.

### سياسات الأمان
- Password policy.
- Rate limiting.
- OTP expiry.
- Brute force protection.
- Device/session tracking.
- Account suspension عند الاشتباه.
- فحص ملف الصورة من حيث النوع والحجم قبل الحفظ.

## Current Improvement Direction
1. اعتماد instant registration.
2. إزالة approval/review من حساب العميل.
3. فصل التحقق عن الدخول العام.
4. تقييد العمليات الحساسة فقط عند عدم التوثيق.
5. استخدام APIs قصيرة وواضحة.
6. قياس سرعة التسجيل والتحويل للاشتراك.
