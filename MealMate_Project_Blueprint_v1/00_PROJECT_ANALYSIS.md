# MealMate — Project Analysis

## الملخص
MealMate هو نظام اشتراكات غذائية يعتمد على عدة محاور مترابطة: الحسابات والوصول، الاشتراكات، التقويم والوجبات، تشغيل المطاعم، التوصيل، الشكاوى، المحاسبة، المحافظ، مستحقات المطاعم، المؤثرين، الحملات، ولوحة الأدمن.

## النطاق
- عدد الموديولات: **12**
- عدد الميزات: **132**
- كل ميزة لها تحليل، معالجة فجوات، spec بعد التصليح، اختبارات قبول، وdiagrams.

## مبادئ التصحيح المعتمدة
- كل ميزة لها Business Owner وOperational Owner مقترحان.
- كل عملية حساسة مربوطة بـ RBAC + Scope + Audit.
- كل انتقال حالة يحتاج State Machine واضحة.
- كل API يحتاج request/response contract وProblemDetails.
- كل أثر مالي يتحول إلى Business Event ولا يعدل الأرصدة مباشرة.
- كل قرار قابل للمراجعة من خلال before/after/reason/correlation id.
- كل ميزة لها Acceptance Criteria واختبارات قابلة للتنفيذ.

## الاعتمادية العامة
```mermaid
flowchart TD
    M01["M01 Identity & Access"]
    M02["M02 Programs & Subscriptions"]
    M03["M03 Calendar & Meals"]
    M04["M04 Restaurant Operations"]
    M05["M05 Driver & Delivery"]
    M06["M06 Complaints & Support"]
    M07["M07 Central Accounting"]
    M08["M08 Customer Finance"]
    M09["M09 Restaurant Finance"]
    M10["M10 Influencers"]
    M11["M11 Collaborative Campaigns"]
    M12["M12 Admin Dashboard"]

    M01 --> M02
    M01 --> M04
    M01 --> M05
    M02 --> M03
    M03 --> M04
    M04 --> M05
    M05 --> M06
    M06 --> M07
    M02 --> M07
    M08 --> M07
    M09 --> M07
    M10 --> M07
    M11 --> M07
    M12 --> M01
    M12 --> M07
```
