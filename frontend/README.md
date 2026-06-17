# MealMate Frontend — Angular Dashboards

هيكل تطبيقات لوحات Angular لمنصة MealMate.

| التطبيق | المسار | الدور |
|---------|--------|-------|
| Admin Dashboard | `admin-dashboard/` | Super Admin / Country Admin |
| Restaurant Dashboard | `restaurant-dashboard/` | مطعم |

## البنية

```text
{app}/src/app/
├── core/           # Auth, API config, guards
├── shared/         # مكونات ونماذج مشتركة داخل التطبيق
└── features/
    ├── admin/      # ميزات لوحة الأدمن
    └── restaurant/ # ميزات لوحة المطعم
```

## F06 — قاعدة 72 ساعة

| التطبيق | الميزة | المسار |
|---------|--------|--------|
| Admin | إشراف، تأكيد المطعم، بديل، استثناءات | `features/admin/order-72h-rule/` |
| Restaurant | استلام، تأكيد 24h، تحضير −24h | `features/restaurant/order-72h-rule/` |

### تشغيل لوحة الأدمن

```bash
cd frontend/admin-dashboard
npm install
npm start
```

التصميم يستخدم **Tailwind CSS v4** + **[Zard UI](https://zardui.com/)** — الإعداد في `components.json` و `src/styles.css`.

```bash
# إضافة مكوّنات Zard لاحقاً
npx zard-cli add button card input checkbox -y
```
