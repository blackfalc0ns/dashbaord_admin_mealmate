# F126 — تنبيهات الربحية

## Profitability Alerts

| Item | Value |
|---|---|
| Module | M12 — M12 — لوحة تحكم الأدمن |
| Status | Corrected Blueprint |
| Generated | 2026-06-15 |

## الملفات
- [01_FEATURE_ANALYSIS.md](01_FEATURE_ANALYSIS.md)
- [02_FIXED_WEAKNESSES_AND_GAPS.md](02_FIXED_WEAKNESSES_AND_GAPS.md)
- [03_SPEC_AFTER_FIXES.md](03_SPEC_AFTER_FIXES.md)
- [04_ACCEPTANCE_TESTS.md](04_ACCEPTANCE_TESTS.md)
- [05_DIAGRAMS.md](05_DIAGRAMS.md)

## ملخص
ميزة **تنبيهات الربحية** جزء من **لوحة تحكم الأدمن**. توثق هذه الصفحة السلوك التجاري والتشغيلي والتقني المطلوب، وتربط الواجهة والـBackend وقاعدة البيانات والصلاحيات والإشعارات والأثر المالي في مصدر واحد.

## إضافة الخوارزمية الحالية
تمت إضافة قاعدة حماية ربحية للمطاعم عالية السعر فقط:

```text
Net Restaurant Cost = Restaurant Daily Price × (1 - Commission)
Expected Profit = Customer Daily Price - Net Restaurant Cost
Minimum Profit = 0.500 KD
```

يظهر التنبيه عندما يكون `Restaurant Price > Mean + 1 SD` و`Expected Profit < 0.500 KD`. خيارات الأدمن: `Keep Restaurant` أو `Move To Higher Classification` أو `Exclude Restaurant`.

لا تغير هذه الإضافة التصنيف أو نظام اللمت أو محرك التسعير الحالي.
