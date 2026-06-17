graphdir TB
palette #fff6b6 #c6dcff #adf0c7

n1 Splash / Login flowchart-terminator 0
n2 شاشة التسجيل/الوثائق flowchart-process 0
n3 شاشة حالة الحساب flowchart-process 0
n4 أزرار كبيرة وخط واضح يناسب الاستخدام أثناء القيادة. flowchart-terminator 0
c n1 - n2
c n2 - n3
c n3 - n4
n5 استلام من المطعم flowchart-terminator 0
n6 شاشة الماسح flowchart-process 0
n7 تسليم الطلب flowchart-process 0
n8 أزرار كبيرة وتغذية راجعة فورية تناسب العمل السريع. flowchart-terminator 0
c n5 - n6
c n6 - n7
c n7 - n8
c n4 - n5
n9 الرئيسية flowchart-terminator 0
n10 قائمة الطلبات flowchart-process 0
n11 الخريطة إلى العميل flowchart-process 0
n12 أزرار الإجراء (Driver Action Button) flowchart-terminator 0
c n9 - n10
c n10 - n11
c n11 - n12
c n8 - n9
n13 الخريطة إلى العميل flowchart-terminator 0
n14 الاتصال داخل التطبيق flowchart-process 0
n15 Hold — العميل غير متاح flowchart-process 0
n16 محاولة ثانية flowchart-process 0
n17 إظهار رقم العميل flowchart-terminator 0
c n13 - n14
c n14 - n15
c n15 - n16
c n16 - n17
c n12 - n13
n18 الإحصائيات flowchart-terminator 0
n19 بطاقة ملخص بسيطة وغير مزدحمة تناسب نظرة سريعة. flowchart-process 0
n20 لا تظهر هوية العميل المُقيّم (مجهول بالنسبة للمندوب). flowchart-terminator 0
c n18 - n19
c n19 - n20
c n17 - n18
n21 قائمة الطلبات flowchart-terminator 0
n22 الخريطة flowchart-process 0
n23 مؤشر للمنطقة/النطاق الحالي في الرئيسية. flowchart-terminator 0
c n21 - n22
c n22 - n23
c n20 - n21
n24 الحساب والوثائق flowchart-terminator 0
n25 شارات الحالة flowchart-process 0
n26 تنبيهات انتهاء الوثائق إن وُجدت. flowchart-terminator 0
c n24 - n25
c n25 - n26
c n23 - n24
n27 الإحصائيات flowchart-terminator 0
n28 تصميم بسيط ومباشر غير مزدحم يناسب نظرة سريعة. flowchart-process 0
n29 اختيار فترة زمنية (يومي/أسبوعي/شهري) إن أُتيح. flowchart-terminator 0
c n27 - n28
c n28 - n29
c n26 - n27
n30 الإعدادات/الحساب flowchart-terminator 0
n31 إعادة ضبط الاتجاه (RTL للعربية، LTR للإنجليزية) لكل الشاشات. flowchart-process 0
n32 أزرار الإجراء والحالات (تم الاستلام، في الطريق، Hold، تم التسليم) مترجمة بوضوح. flowchart-terminator 0
c n30 - n31
c n31 - n32
c n29 - n30
n33 تفاصيل الطلب flowchart-terminator 0
n34 الاتصال داخل التطبيق flowchart-process 0
n35 إظهار رقم العميل flowchart-terminator 0
c n33 - n34
c n34 - n35
c n32 - n33
cluster c1 "F01 تسجيل المندوب والدخول والتفعيل" n1 n2 n3 n4
cluster c5 "F12 مسح الباركود عند الاستلام والتسليم" n5 n6 n7 n8
cluster c9 "F13 استلام وتوصيل الطلب والتتبع اللحظي" n9 n10 n11 n12
cluster c13 "F14 الاتصال عند 3 كم وحالة Hold والمحاولة الثانية" n13 n14 n15 n16 n17
cluster c18 "F15 تقييم الطلب ورؤية تقييم المندوب" n18 n19 n20
cluster c21 "F21 استقبال الطلبات حسب النطاق الجغرافي" n21 n22 n23
cluster c24 "F23 بيانات المندوب والوثائق والتحقق" n24 n25 n26
cluster c27 "F27 إحصائيات وأداء المندوب" n27 n28 n29
cluster c30 "F29 لغة تطبيق المندوب" n30 n31 n32
cluster c33 "F31 خصوصية بيانات العميل تجاه المندوب" n33 n34 n35