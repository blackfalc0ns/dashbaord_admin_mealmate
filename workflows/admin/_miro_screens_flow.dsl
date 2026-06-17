graphdir TB
palette #fff6b6 #c6dcff #adf0c7

n1 لوحة المتطلبات / المدخلات flowchart-terminator 0
n2 طلبات التسجيل المعلّقة flowchart-process 0
n3 يفتح طلب المطعم flowchart-process 0
n4 اعتماد flowchart-process 0
n5 يفتح طلب السائق العام flowchart-process 0
n6 يدير حسابات العملاء flowchart-process 0
n7 نسيت كلمة المرور flowchart-terminator 0
c n1 - n2
c n2 - n3
c n3 - n4
c n4 - n5
c n5 - n6
c n6 - n7
n8 لوحة المتطلبات / المدخلات flowchart-terminator 0
n9 نموذج الاشتراك flowchart-process 0
n10 المدد- flowchart-process 0
n11 البرامج الغذائية- flowchart-process 0
n12 الباقات- flowchart-process 0
n13 المطعم (لتسعيرها) flowchart-process 0
n14 لوحة — خطوة 6 flowchart-terminator 0
c n8 - n9
c n9 - n10
c n10 - n11
c n11 - n12
c n12 - n13
c n13 - n14
c n7 - n8
n15 لوحة المتطلبات / المدخلات flowchart-terminator 0
n16 التصنيفات flowchart-process 0
n17 لوحة — خطوة 2 flowchart-process 0
n18 لوحة — خطوة 3 flowchart-process 0
n19 لوحة — خطوة 4 flowchart-process 0
n20 لوحة — خطوة 5 flowchart-terminator 0
c n15 - n16
c n16 - n17
c n17 - n18
c n18 - n19
c n19 - n20
c n14 - n15
n21 لوحة المتطلبات / المدخلات flowchart-terminator 0
n22 التحكم flowchart-process 0
n23 لوحة — خطوة 2 flowchart-process 0
n24 متوسط سعر القروب flowchart-process 0
n25 متوسط البوكس اليومي flowchart-process 0
n26 سعر اشتراك العميل flowchart-process 0
n27 لوحة — خطوة 6 flowchart-terminator 0
c n21 - n22
c n22 - n23
c n23 - n24
c n24 - n25
c n25 - n26
c n26 - n27
c n20 - n21
n28 لوحة المتطلبات / المدخلات flowchart-terminator 0
n29 يراقب الأدمن أن النظام يقفل التعديل تلقائيًا عند دخول اليوم في آخر نافذة 48 ساعة flowchart-process 0
n30 لوحة — خطوة 2 flowchart-process 0
n31 لوحة — خطوة 3 flowchart-process 0
n32 لوحة — خطوة 4 flowchart-process 0
n33 (تغيير بوكس/مطعم/إلغاء يوم) ويوثّق السبب flowchart-process 0
n34 لوحة — خطوة 6 flowchart-terminator 0
c n28 - n29
c n29 - n30
c n30 - n31
c n31 - n32
c n32 - n33
c n33 - n34
c n27 - n28
n35 لوحة المتطلبات / المدخلات flowchart-terminator 0
n36 يتأكد الأدمن من تفعيل قاعدة التشغيل flowchart-process 0
n37 الحد الأقصى لكل مطعم = أيام الاشتراك ÷ عدد المطاعم المتاحة في التصنيف (تقريب لأع flowchart-process 0
n38 لوحة — خطوة 3 flowchart-process 0
n39 Fallback- flowchart-process 0
n40 تجاوز الكوتا الذكي flowchart-process 0
n41 لوحة — خطوة 6 flowchart-terminator 0
c n35 - n36
c n36 - n37
c n37 - n38
c n38 - n39
c n39 - n40
c n40 - n41
c n34 - n35
n42 لوحة المتطلبات / المدخلات flowchart-terminator 0
n43 الطاقة flowchart-process 0
n44 Busy flowchart-process 0
n45 لوحة — خطوة 3 flowchart-process 0
n46 لوحة — خطوة 4 flowchart-process 0
n47 مرونة الكوتا flowchart-process 0
n48 لوحة — خطوة 6 flowchart-terminator 0
c n42 - n43
c n43 - n44
c n44 - n45
c n45 - n46
c n46 - n47
c n47 - n48
c n41 - n42
n49 لوحة المتطلبات / المدخلات flowchart-terminator 0
n50 لوحة — خطوة 1 flowchart-process 0
n51 مبلغ البوكس اليومي = مبلغ الاشتراك الكلي ÷ عدد أيام الاشتراك flowchart-process 0
n52 الأيام المتبقية = أيام الاشتراك − الأيام المُسلّمة − يومين flowchart-process 0
n53 المبلغ المسترد = مبلغ البوكس اليومي × الأيام المتبقية flowchart-process 0
n54 لوحة — خطوة 5 flowchart-process 0
n55 لوحة — خطوة 6 flowchart-terminator 0
c n49 - n50
c n50 - n51
c n51 - n52
c n52 - n53
c n53 - n54
c n54 - n55
c n48 - n49
n56 لوحة المتطلبات / المدخلات flowchart-terminator 0
n57 (مثال flowchart-process 0
n58 لوحة — خطوة 2 flowchart-process 0
n59 لوحة — خطوة 3 flowchart-process 0
n60 المشتركين المجمّدين مع تواريخ البداية والنهاية المتوقعة flowchart-process 0
n61 لوحة — خطوة 5 flowchart-process 0
n62 لوحة — خطوة 6 flowchart-terminator 0
c n56 - n57
c n57 - n58
c n58 - n59
c n59 - n60
c n60 - n61
c n61 - n62
c n55 - n56
n63 لوحة المتطلبات / المدخلات flowchart-terminator 0
n64 لوحة — خطوة 1 flowchart-process 0
n65 لوحة — خطوة 2 flowchart-process 0
n66 لوحة — خطوة 3 flowchart-process 0
n67 يراجع أن ملصق كل وجبة يتضمن flowchart-process 0
n68 لوحة — خطوة 5 flowchart-process 0
n69 لوحة — خطوة 6 flowchart-terminator 0
c n63 - n64
c n64 - n65
c n65 - n66
c n66 - n67
c n67 - n68
c n68 - n69
c n62 - n63
n70 لوحة المتطلبات / المدخلات flowchart-terminator 0
n71 الطلبات الحيّة وحالات كل طلب flowchart-process 0
n72 لوحة — خطوة 2 flowchart-process 0
n73 لوحة — خطوة 3 flowchart-process 0
n74 لوحة — خطوة 4 flowchart-process 0
n75 تم التسليم flowchart-process 0
n76 لوحة — خطوة 6 flowchart-terminator 0
c n70 - n71
c n71 - n72
c n72 - n73
c n73 - n74
c n74 - n75
c n75 - n76
c n69 - n70
n77 لوحة المتطلبات / المدخلات flowchart-terminator 0
n78 لوحة — خطوة 1 flowchart-process 0
n79 Hold flowchart-process 0
n80 لوحة — خطوة 3 flowchart-process 0
n81 يُشعر الأدمن flowchart-process 0
n82 لوحة — خطوة 5 flowchart-process 0
n83 لوحة — خطوة 6 flowchart-terminator 0
c n77 - n78
c n78 - n79
c n79 - n80
c n80 - n81
c n81 - n82
c n82 - n83
c n76 - n77
n84 لوحة المتطلبات / المدخلات flowchart-terminator 0
n85 الإحصائيات الكلية للتقييمات حسب المطعم/السائق/المنطقة flowchart-process 0
n86 لوحة — خطوة 2 flowchart-process 0
n87 لوحة — خطوة 3 flowchart-process 0
n88 لوحة — خطوة 4 flowchart-process 0
n89 لوحة — خطوة 5 flowchart-terminator 0
c n84 - n85
c n85 - n86
c n86 - n87
c n87 - n88
c n88 - n89
c n83 - n84
n90 لوحة المتطلبات / المدخلات flowchart-terminator 0
n91 لوحة — خطوة 1 flowchart-process 0
n92 لوحة — خطوة 2 flowchart-process 0
n93 استرداد مالي flowchart-process 0
n94 لوحة — خطوة 4 flowchart-process 0
n95 لوحة — خطوة 5 flowchart-process 0
n96 لوحة — خطوة 6 flowchart-terminator 0
c n90 - n91
c n91 - n92
c n92 - n93
c n93 - n94
c n94 - n95
c n95 - n96
c n89 - n90
n97 لوحة المتطلبات / المدخلات flowchart-terminator 0
n98 لوحة — خطوة 1 flowchart-process 0
n99 لوحة — خطوة 2 flowchart-process 0
n100 لوحة — خطوة 3 flowchart-process 0
n101 المكافآت للعميل (رصيد + طرق الكسب + سجل + استبدال) flowchart-process 0
n102 لوحة — خطوة 5 flowchart-process 0
n103 لوحة — خطوة 6 flowchart-terminator 0
c n97 - n98
c n98 - n99
c n99 - n100
c n100 - n101
c n101 - n102
c n102 - n103
c n96 - n97
n104 لوحة المتطلبات / المدخلات flowchart-terminator 0
n105 لوحة — خطوة 1 flowchart-process 0
n106 لوحة — خطوة 2 flowchart-process 0
n107 لوحة — خطوة 3 flowchart-process 0
n108 الدفع ويُطبَّق بشكل صحيح flowchart-process 0
n109 يتابع تقارير الاستخدام flowchart-process 0
n110 لوحة — خطوة 6 flowchart-terminator 0
c n104 - n105
c n105 - n106
c n106 - n107
c n107 - n108
c n108 - n109
c n109 - n110
c n103 - n104
n111 لوحة المتطلبات / المدخلات flowchart-terminator 0
n112 يتابع الأدمن لوحات العائلات flowchart-process 0
n113 لوحة — خطوة 2 flowchart-process 0
n114 لوحة — خطوة 3 flowchart-process 0
n115 يدعم عمليات الفصل flowchart-process 0
n116 لوحة — خطوة 5 flowchart-process 0
n117 لوحة — خطوة 6 flowchart-terminator 0
c n111 - n112
c n112 - n113
c n113 - n114
c n114 - n115
c n115 - n116
c n116 - n117
c n110 - n111
n118 لوحة المتطلبات / المدخلات flowchart-terminator 0
n119 لوحة — خطوة 1 flowchart-process 0
n120 لوحة — خطوة 2 flowchart-process 0
n121 لوحة — خطوة 3 flowchart-process 0
n122 لوحة — خطوة 4 flowchart-process 0
n123 لوحة — خطوة 5 flowchart-process 0
n124 لوحة — خطوة 6 flowchart-terminator 0
c n118 - n119
c n119 - n120
c n120 - n121
c n121 - n122
c n122 - n123
c n123 - n124
c n117 - n118
n125 لوحة المتطلبات / المدخلات flowchart-terminator 0
n126 لوحة — خطوة 1 flowchart-process 0
n127 لوحة — خطوة 2 flowchart-process 0
n128 لوحة — خطوة 3 flowchart-process 0
n129 يضبط ما يظهر للعميل flowchart-process 0
n130 لوحة — خطوة 5 flowchart-process 0
n131 لوحة — خطوة 6 flowchart-terminator 0
c n125 - n126
c n126 - n127
c n127 - n128
c n128 - n129
c n129 - n130
c n130 - n131
c n124 - n125
n132 لوحة المتطلبات / المدخلات flowchart-terminator 0
n133 لوحة — خطوة 1 flowchart-process 0
n134 لوحة — خطوة 2 flowchart-process 0
n135 لوحة — خطوة 3 flowchart-process 0
n136 لوحة — خطوة 4 flowchart-process 0
n137 لوحة — خطوة 5 flowchart-process 0
n138 لوحة — خطوة 6 flowchart-terminator 0
c n132 - n133
c n133 - n134
c n134 - n135
c n135 - n136
c n136 - n137
c n137 - n138
c n131 - n132
n139 لوحة المتطلبات / المدخلات flowchart-terminator 0
n140 لوحة — خطوة 1 flowchart-process 0
n141 لوحة — خطوة 2 flowchart-process 0
n142 موافقة الأدمن النهائية flowchart-process 0
n143 لوحة — خطوة 4 flowchart-process 0
n144 لوحة — خطوة 5 flowchart-process 0
n145 لوحة — خطوة 6 flowchart-terminator 0
c n139 - n140
c n140 - n141
c n141 - n142
c n142 - n143
c n143 - n144
c n144 - n145
c n138 - n139
n146 لوحة المتطلبات / المدخلات flowchart-terminator 0
n147 لوحة — خطوة 1 flowchart-process 0
n148 لوحة — خطوة 2 flowchart-process 0
n149 لوحة — خطوة 3 flowchart-process 0
n150 30 يومًا flowchart-process 0
n151 لوحة — خطوة 5 flowchart-process 0
n152 لوحة — خطوة 6 flowchart-terminator 0
c n146 - n147
c n147 - n148
c n148 - n149
c n149 - n150
c n150 - n151
c n151 - n152
c n145 - n146
n153 لوحة المتطلبات / المدخلات flowchart-terminator 0
n154 لوحة — خطوة 1 flowchart-process 0
n155 والمجدولة 30 يومًا على الأقل من تاريخ الطلب flowchart-process 0
n156 يخطط لمرحلة انتقالية flowchart-process 0
n157 لوحة — خطوة 4 flowchart-process 0
n158 المتاحة flowchart-process 0
n159 لوحة — خطوة 6 flowchart-terminator 0
c n153 - n154
c n154 - n155
c n155 - n156
c n156 - n157
c n157 - n158
c n158 - n159
c n152 - n153
n160 لوحة المتطلبات / المدخلات flowchart-terminator 0
n161 لوحة — خطوة 1 flowchart-process 0
n162 صافي مستحق البوكس = سعر البوكس المتفق عليه − (سعر البوكس × نسبة العمولة الدينامي flowchart-process 0
n163 إجمالي المستحقات = (صافي البوكس × عدد البوكسات المُسلّمة) − رسوم اشتراك المطعم ( flowchart-process 0
n164 لوحة — خطوة 4 flowchart-process 0
n165 لوحة — خطوة 5 flowchart-process 0
n166 يتابع تقارير flowchart-terminator 0
c n160 - n161
c n161 - n162
c n162 - n163
c n163 - n164
c n164 - n165
c n165 - n166
c n159 - n160
n167 لوحة المتطلبات / المدخلات flowchart-terminator 0
n168 المؤشرات الرئيسية ويختار الفترة الزمنية والنطاق flowchart-process 0
n169 لوحة — خطوة 2 flowchart-process 0
n170 لوحة — خطوة 3 flowchart-process 0
n171 لوحة — خطوة 4 flowchart-process 0
n172 يقارن أداء الدول/المناطق (للـ Super Admin flowchart-process 0
n173 لوحة — خطوة 6 flowchart-terminator 0
c n167 - n168
c n168 - n169
c n169 - n170
c n170 - n171
c n171 - n172
c n172 - n173
c n166 - n167
n174 لوحة المتطلبات / المدخلات flowchart-terminator 0
n175 Super Admin- flowchart-process 0
n176 Super Admin- flowchart-process 0
n177 Super Admin- flowchart-process 0
n178 Country Admin- flowchart-process 0
n179 يتأكد الطرفان من عزل البيانات flowchart-process 0
n180 Super Admin- flowchart-terminator 0
c n174 - n175
c n175 - n176
c n176 - n177
c n177 - n178
c n178 - n179
c n179 - n180
c n173 - n174
n181 لوحة المتطلبات / المدخلات flowchart-terminator 0
n182 الرئيسية flowchart-process 0
n183 لوحة — خطوة 2 flowchart-process 0
n184 لوحة — خطوة 3 flowchart-process 0
n185 لوحة — خطوة 4 flowchart-process 0
n186 لوحة — خطوة 5 flowchart-process 0
n187 لوحة — خطوة 6 flowchart-terminator 0
c n181 - n182
c n182 - n183
c n183 - n184
c n184 - n185
c n185 - n186
c n186 - n187
c n180 - n181
n188 لوحة المتطلبات / المدخلات flowchart-terminator 0
n189 لوحة — خطوة 1 flowchart-process 0
n190 لوحة — خطوة 2 flowchart-process 0
n191 عند صحته (راجع F06) ويوثّقه flowchart-process 0
n192 لوحة — خطوة 4 flowchart-process 0
n193 الجانبية والتذييل ويحدّثها flowchart-process 0
n194 لوحة — خطوة 6 flowchart-terminator 0
c n188 - n189
c n189 - n190
c n190 - n191
c n191 - n192
c n192 - n193
c n193 - n194
c n187 - n188
n195 لوحة المتطلبات / المدخلات flowchart-terminator 0
n196 لوحة — خطوة 1 flowchart-process 0
n197 يضبط ما يراه المطعم flowchart-process 0
n198 لوحة — خطوة 3 flowchart-process 0
n199 لوحة — خطوة 4 flowchart-process 0
n200 يتحقق من تطبيق معايير الأمان flowchart-process 0
n201 لوحة — خطوة 6 flowchart-terminator 0
c n195 - n196
c n196 - n197
c n197 - n198
c n198 - n199
c n199 - n200
c n200 - n201
c n194 - n195
cluster c1 "F01 التسجيل واعتماد الحسابات والدخول" n1 n2 n3 n4 n5 n6 n7
cluster c8 "F02 إدارة نموذج الاشتراك (المدد/البرامج/الباقات)" n8 n9 n10 n11 n12 n13 n14
cluster c15 "F03 إدارة تصنيف المطاعم (Basic/Platinum/Elite)" n15 n16 n17 n18 n19 n20
cluster c21 "F04 إدارة التسعير والعمولات الديناميكية" n21 n22 n23 n24 n25 n26 n27
cluster c28 "F06 قاعدة 48 ساعة واستثناءات الأدمن" n28 n29 n30 n31 n32 n33 n34
cluster c35 "F07 ضبط الاختيار التلقائي والتوزيع العادل" n35 n36 n37 n38 n39 n40 n41
cluster c42 "F08 مراقبة الطاقة الاستيعابية و Busy" n42 n43 n44 n45 n46 n47 n48
cluster c49 "F10 إدارة الإلغاء والاسترداد" n49 n50 n51 n52 n53 n54 n55
cluster c56 "F11 إدارة التجميد" n56 n57 n58 n59 n60 n61 n62
cluster c63 "F12 إعداد الفواتير والباركود والملصقات" n63 n64 n65 n66 n67 n68 n69
cluster c70 "F13 مراقبة التوصيل والتتبع" n70 n71 n72 n73 n74 n75 n76
cluster c77 "F14 متابعة الاتصال وحالة Hold" n77 n78 n79 n80 n81 n82 n83
cluster c84 "F15 متابعة التقييمات والإحصائيات" n84 n85 n86 n87 n88 n89
cluster c90 "F16 إدارة الشكاوى والمحفظة والتعويضات" n90 n91 n92 n93 n94 n95 n96
cluster c97 "F17 إدارة الولاء والمكافآت" n97 n98 n99 n100 n101 n102 n103
cluster c104 "F18 إدارة الإحالات والبرومو كود" n104 n105 n106 n107 n108 n109 n110
cluster c111 "F19 متابعة الاشتراك العائلي" n111 n112 n113 n114 n115 n116 n117
cluster c118 "F20 إدارة الإعلانات والمزايدات" n118 n119 n120 n121 n122 n123 n124
cluster c125 "F21 إدارة المناطق والتغطية" n125 n126 n127 n128 n129 n130 n131
cluster c132 "F22 مراجعة واعتماد وثائق المطاعم" n132 n133 n134 n135 n136 n137 n138
cluster c139 "F23 إدارة السائقين العامين والتحقق" n139 n140 n141 n142 n143 n144 n145
cluster c146 "F24 اعتماد القوائم والوجبات" n146 n147 n148 n149 n150 n151 n152
cluster c153 "F25 إدارة سياسة إنهاء التعاقد" n153 n154 n155 n156 n157 n158 n159
cluster c160 "F26 النظام المحاسبي والتسويات" n160 n161 n162 n163 n164 n165 n166
cluster c167 "F27 التقارير ومؤشرات الأداء KPI" n167 n168 n169 n170 n171 n172 n173
cluster c174 "F28 التوسع الدولي و Multi-Tenancy (Super Admin / " n174 n175 n176 n177 n178 n179 n180
cluster c181 "F29 إدارة تعدد اللغات" n181 n182 n183 n184 n185 n186 n187
cluster c188 "F30 إدارة قنوات التواصل (واتساب/سوشيال)" n188 n189 n190 n191 n192 n193 n194
cluster c195 "F31 سياسات حماية الخصوصية" n195 n196 n197 n198 n199 n200 n201