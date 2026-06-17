# F108 — التحسينات المقترحة

## الهدف من التحسين
تحويل الميزة من توثيق Product Draft إلى مواصفة تنفيذ احترافية تربط الواجهة، الـ Backend، البيانات، الصلاحيات، الاختبارات، والتشغيل.

## تحسينات P0 قبل التطوير
1. **تعريف State Machine**
   - تحديد كل حالة مسموحة.
   - تحديد الانتقالات المسموحة والممنوعة.
   - ربط كل انتقال بصلاحية وسبب وAudit Log.

2. **تفصيل API Contract**
   - إضافة schemas لكل endpoint:
     - `GET /api/v1/restaurant_campaign_enrollment`
     - `GET /api/v1/restaurant_campaign_enrollment/{id}`
     - `POST /api/v1/restaurant_campaign_enrollment`
     - `PUT /api/v1/restaurant_campaign_enrollment/{id}`
     - `POST /api/v1/restaurant_campaign_enrollment/{id}/actions/{action}`
   - توثيق status codes: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
   - اعتماد `ProblemDetails` للأخطاء و`CorrelationId` للتتبع.

3. **تفصيل صلاحيات Role/Scope**
   - ربط كل شاشة وكل endpoint بصلاحية مثل `F108.View`, `F108.Create`, `F108.Update`, `F108.Override`.
   - تحديد Scope حسب الدولة والمنطقة والكيان المرتبط.

4. **تعريف نموذج البيانات**
   - تحديد الجداول/الـ collections.
   - تحديد العلاقات، الفهارس، unique constraints، وretention policy.
   - إضافة `RowVersion` أو optimistic concurrency.

## تحسينات P1 لجودة المنتج
1. **Acceptance Criteria بصيغة Given/When/Then**
   - Happy Path.
   - Permission Denied.
   - Invalid State.
   - Duplicate Request.
   - Concurrent Update.
   - External Service Failure.

2. **UX States**
   - Loading.
   - Empty.
   - Error.
   - Permission Denied.
   - Confirmation Modal.
   - Audit Timeline.

3. **Observability**
   - Metrics: Success Rate, Error Rate, Average Processing Time, SLA Breaches.
   - Logs: actor, action, entity id, before/after, reason.
   - Alerts عند ارتفاع failures أو manual overrides.

## تحسينات P2 بعد الإطلاق
1. **تقارير تشغيلية**
   - معدل الاستخدام.
   - أسباب الرفض أو الفشل.
   - أكثر الحالات التي تحتاج Override.

2. **تحسينات Automation**
   - اقتراحات ذكية للقرار التالي.
   - تنبيه مبكر عند اقتراب SLA.
   - Auto-retry للعمليات الآمنة مع idempotency.

## Definition of Ready
- كل API له contract واضح.
- كل حالة لها انتقالات محددة.
- كل صلاحية لها Role/Scope واضح.
- كل أثر مالي له Business Event.
- كل Edge Case له expected behavior.

## Definition of Done
- اختبارات Unit وIntegration وPermission مكتوبة.
- Audit Log يعمل لكل عملية حساسة.
- الواجهة تعرض كل حالات Loading/Empty/Error.
- التقارير أو الـ logs تسمح بتتبع العملية end-to-end.
- التوثيق محدث بعد التنفيذ.
