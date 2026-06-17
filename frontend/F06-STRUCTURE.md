# F06 — Angular Structure Map

## Admin Dashboard

```text
frontend/admin-dashboard/src/app/
├── app.routes.ts
├── core/
│   ├── api/admin-api-endpoints.ts
│   └── auth/admin-permissions.ts
├── shared/
│   ├── models/page-view-state.model.ts
│   └── components/
│       ├── page-state/
│       └── order-status-badge/
└── features/admin/order-72h-rule/
    ├── README.md
    ├── index.ts
    ├── order-72h-rule.routes.ts
    ├── order-72h-rule.spec.ts
    ├── guards/order-72h-permissions.guard.ts
    ├── models/
    │   ├── order-72h.enums.ts
    │   ├── admin-order-72h.model.ts
    │   ├── order-exception-request.model.ts
    │   ├── replacement-window.model.ts
    │   └── index.ts
    ├── data/order-72h-api.service.ts
    ├── state/order-72h.facade.ts
    ├── pages/
    │   ├── order-72h-monitor-page/
    │   ├── confirmation-overdue-page/
    │   ├── replacement-window-page/
    │   ├── preparation-24h-page/
    │   └── order-exception-page/
    └── components/
        ├── order-72h-table/
        ├── open-replacement-dialog/
        ├── manual-reassign-dialog/
        └── exception-form/
```

## Restaurant Dashboard

```text
frontend/restaurant-dashboard/src/app/
├── app.routes.ts
├── core/
│   ├── api/restaurant-api-endpoints.ts
│   └── auth/restaurant-context.ts
├── shared/
│   ├── models/page-view-state.model.ts
│   └── components/page-state/
└── features/restaurant/order-72h-rule/
    ├── README.md
    ├── index.ts
    ├── order-72h-rule.routes.ts
    ├── order-72h-rule.spec.ts
    ├── models/
    │   ├── restaurant-order-72h.enums.ts
    │   ├── restaurant-order-72h.model.ts
    │   ├── order-confirmation.model.ts
    │   └── index.ts
    ├── data/restaurant-order-72h-api.service.ts
    ├── state/restaurant-order-72h.facade.ts
    ├── pages/
    │   ├── pending-confirmation-page/
    │   ├── upcoming-24h-page/
    │   └── order-72h-detail-page/
    └── components/
        ├── confirmation-countdown/
        ├── preparation-order-list/
        └── confirm-order-dialog/
```

## الخطوة التالية

1. `ng new` لكل تطبيق أو monorepo Nx.
2. ربط `HttpClient` في `data/*-api.service.ts`.
3. تنفيذ `Facade` + Reactive Forms في الحوارات.
4. ربط `app.routes.ts` في `main.ts` / `app.config.ts`.
