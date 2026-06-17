const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedAt = "2026-06-15";

const modules = {
  M02: {
    name: "M02 — البرامج والاشتراكات",
    domain: "تصميم البرامج والباقات وتسعير الاشتراك وتجديده وترقيته وربطه بالعروض والإحالات",
    business: [
      "عدم وضوح العلاقة بين البرنامج الغذائي، الباقة، مدة الاشتراك، والتصنيف السعري قد يؤدي إلى باقات مربكة للعميل وصعبة البيع.",
      "غياب قواعد واضحة لتغيير الأسعار والترقية والتجديد قد يخلق نزاعات مع العملاء والمطاعم عند اختلاف السعر أثناء مدة الاشتراك.",
      "العروض والإحالات والاشتراك العائلي قد تؤثر على الربحية إذا لم ترتبط بسقف خصم وقواعد أهلية واضحة.",
      "عدم وجود KPIs تجارية دقيقة مثل conversion rate، renewal rate، upgrade rate، وdiscount cost يجعل تحسين المنتج بعد الإطلاق صعبًا.",
    ],
    logic: [
      "منطق lifecycle للاشتراك غير كافٍ إذا بقي في حالات عامة مثل Active وPending فقط.",
      "تداخل التسعير مع التصنيف والخصومات يحتاج ترتيب حسابات واضح حتى لا تختلف نتائج Backend عن الواجهة.",
      "الترقية أو التجديد أو استخدام promo code يحتاج idempotency حتى لا يتكرر الخصم أو التحديث.",
      "غياب snapshot للسعر والقواعد وقت الشراء يجعل إعادة الحساب لاحقًا خطرة وغير عادلة.",
    ],
    data: ["Subscription", "Program", "Bundle", "PricingRule", "DiscountCode", "ReferralCode", "SubscriptionSnapshot"],
  },
  M03: {
    name: "M03 — التقويم والوجبات",
    domain: "إنشاء تقويم الاشتراك، اختيار المطعم والوجبة، قاعدة 72 ساعة، الاختيار التلقائي، الحساسية، والتجميد",
    business: [
      "أي غموض في التقويم ينعكس مباشرة على تجربة العميل اليومية، لأن العميل يشتري انتظامًا وليس وجبة واحدة فقط.",
      "قواعد 72 ساعة والتجميد والتغيير تحتاج صياغة تجارية واضحة حتى لا يشعر العميل أن النظام يقيّده بشكل غير مفهوم.",
      "الاختيار التلقائي قد يضر الثقة إذا اختار وجبات لا تناسب التفضيلات أو الحساسية أو مستوى الاشتراك.",
      "غياب KPIs مثل completion rate، manual selection rate، auto-selection override، وfreeze usage يقلل القدرة على تحسين التجربة.",
    ],
    logic: [
      "التعامل مع الوقت يجب أن يكون صارمًا: UTC للتخزين، timezone للعرض، وقواعد واضحة قبل وبعد deadline.",
      "تداخل الحساسية والتفضيلات والطاقة والـ limit يحتاج ترتيب أولويات واضح عند التعارض.",
      "تغيير وجبة أو تجميد يوم يجب أن ينتج state transition واضح ولا يعدّل التاريخ الماضي.",
      "الاختيار التلقائي يحتاج fallback مضبوط يمنع اختيار غير آمن صحيًا أو خارج نطاق العميل.",
    ],
    data: ["SubscriptionCalendar", "CalendarDay", "MealSelection", "RestaurantSelection", "Preference", "Allergy", "FreezeRequest"],
  },
  M04: {
    name: "M04 — المطاعم والتشغيل",
    domain: "تشغيل المطاعم، القوائم، الأسعار، المناطق، الطاقة، الطلبات اليومية، الفواتير، التسليم، وتقييم المطعم",
    business: [
      "المطعم جزء من سلسلة تشغيل يومية، وأي نقص في بياناته يؤثر على الطلبات والتوصيل ورضا العملاء.",
      "غياب قواعد واضحة للطاقة والسعر والمناطق قد يؤدي إلى قبول طلبات لا يستطيع المطعم تنفيذها.",
      "عدم فصل readiness عن approval قد يجعل مطعمًا معتمدًا يظهر للعملاء قبل اكتمال القوائم أو الأسعار.",
      "غياب KPIs مثل on-time confirmation، rejection rate، busy frequency، وhandover success يقلل السيطرة التشغيلية.",
    ],
    logic: [
      "قوائم الوجبات والأسعار والطاقة يجب أن تكون versioned حتى لا تتغير طلبات مستقبلية بعد اعتمادها.",
      "حالة Busy والقدرة اليومية تحتاج قواعد تلقائية ومراجعة يدوية موثقة.",
      "تأكيد طلبات 72 ساعة والتسليم للسائق يحتاج lifecycle واضح يمنع الفجوات بين المطعم والتوصيل.",
      "التقييمات والإنهاء التعاقدي يجب أن تعتمد على سجل موثق وليس قرارات منفصلة.",
    ],
    data: ["Restaurant", "Menu", "Meal", "PriceList", "CapacityRule", "DailyOrder", "Invoice", "HandoverEvent"],
  },
  M05: {
    name: "M05 — السائق والتوصيل",
    domain: "ملف السائق، نطاق الاستلام، إسناد الطلب، المسح بالباركود، التتبع، الاتصال الآمن، محاولات التسليم، والتقييم",
    business: [
      "التوصيل هو نقطة الثقة النهائية بين MealMate والعميل، وأي ضعف فيه يظهر كفشل تجربة كامل حتى لو كانت الوجبة جيدة.",
      "عدم وضوح نموذج السائق ونطاقه يؤثر على تكلفة التشغيل وسرعة التوصيل.",
      "قواعد الاتصال والـ hold والمحاولة الثانية تحتاج سياسة واضحة حتى لا تتحول إلى نزاعات مع العملاء.",
      "غياب KPIs مثل pickup success، delivery SLA، failed delivery، وdriver rating يجعل تحسين الشبكة صعبًا.",
    ],
    logic: [
      "إسناد الطلب يحتاج قواعد أولوية: المسافة، التوفر، المطعم، المنطقة، وحالة السائق.",
      "الباركود يجب أن يمنع تسليم طلب خاطئ أو تأكيد بدون وجود فعلي.",
      "التتبع والاتصال الآمن يجب أن يحترما الخصوصية ولا يكشفا بيانات العميل قبل الوقت المناسب.",
      "حالات hold والمحاولة الثانية والتأكيد النهائي تحتاج state machine لا تسمح بالقفز بين المراحل.",
    ],
    data: ["Driver", "DriverLocation", "DeliveryTask", "BarcodeScan", "TrackingEvent", "DeliveryAttempt", "DriverRating"],
  },
  M06: {
    name: "M06 — الشكاوى والدعم",
    domain: "إنشاء الشكاوى، الأدلة، التصنيف، مراجعة الأدمن، رد المطعم، تحديد المسؤولية، التعويض، والخصومات",
    business: [
      "الشكاوى تؤثر مباشرة على الثقة والاحتفاظ بالعملاء والعلاقة مع المطاعم.",
      "غياب سياسة واضحة للتعويض والخصم قد يخلق قرارات غير عادلة أو مكلفة.",
      "تصنيف الشكاوى والمسؤولية يجب أن يكون موحدًا حتى لا تختلف النتائج بين موظفي الدعم.",
      "غياب KPIs مثل resolution time، compensation cost، repeated complaints، وrestaurant fault rate يضعف إدارة الجودة.",
    ],
    logic: [
      "كل شكوى تحتاج lifecycle واضح من الإنشاء حتى الإغلاق، مع منع تعديل القرار بعد الاعتماد إلا عبر override.",
      "الأدلة المصورة تحتاج قواعد صلاحية وحفظ وخصوصية.",
      "تحديد المسؤولية يجب أن ينتج business event واضح للتعويض أو الخصم.",
      "التعويض المجاني أو المالي يجب أن يرتبط بالمحاسبة ولا يعدل الأرصدة مباشرة.",
    ],
    data: ["Complaint", "ComplaintEvidence", "ComplaintClassification", "ResponsibilityDecision", "Compensation", "Deduction"],
  },
  M07: {
    name: "M07 — النظام المالي والمحاسبي المركزي",
    domain: "شجرة الحسابات، الإعدادات المالية، القيود التلقائية، الإيراد المؤجل، الاعتراف بالإيراد، المستحقات، الضرائب، التقارير، والتدقيق المالي",
    business: [
      "هذا الموديول هو مصدر الحقيقة المالي، وأي غموض فيه يؤثر على الربحية والتقارير والمراجعة.",
      "عدم فصل الأحداث التشغيلية عن القيود المحاسبية قد يؤدي إلى تعديل أرصدة بدون أثر قابل للتدقيق.",
      "غياب سياسة واضحة للضرائب والعملات وتعدد الدول يجعل التوسع الدولي خطرًا.",
      "غياب reconciliation KPIs يجعل اكتشاف الفروقات المالية متأخرًا.",
    ],
    logic: [
      "كل حركة مالية يجب أن تنتج double-entry journal entry أو event قابل للتحويل لقيد.",
      "الإيراد المؤجل والاعتراف اليومي يحتاجان قواعد زمنية لا تتأثر بتغيير الاشتراك لاحقًا.",
      "العكس المالي يجب أن يكون بقيد عكسي وليس حذفًا أو تعديلًا مباشرًا.",
      "التقارير يجب أن تعتمد على snapshots وإقفالات لا على حسابات حية متغيرة.",
    ],
    data: ["ChartOfAccount", "FinancialSetting", "JournalEntry", "LedgerEntry", "RevenueRecognition", "Payable", "TaxRule"],
  },
  M08: {
    name: "M08 — النظام المالي للعميل",
    domain: "محفظة العميل النقدية والترويجية، سجل الحركات، الدفع من المحفظة، الإلغاء، الاسترداد، رسوم الإلغاء، السحب، والبيانات البنكية",
    business: [
      "محفظة العميل عالية الحساسية لأنها تمس أموال العميل وثقته.",
      "عدم فصل الرصيد النقدي عن الرصيد الترويجي قد يسبب استردادات أو استخدامات غير صحيحة.",
      "قواعد الإلغاء والاسترداد يجب أن تكون مفهومة للعميل قبل الدفع وليس بعد النزاع.",
      "غياب KPIs مثل refund rate، wallet usage، failed withdrawals، وcancellation fee disputes يضعف التحكم المالي.",
    ],
    logic: [
      "كل حركة محفظة يجب أن تكون ledger entry غير قابلة للحذف.",
      "الدفع من المحفظة يحتاج ترتيب أولوية واضح بين الرصيد النقدي والترويجي.",
      "الاسترداد والسحب يحتاجان idempotency ومراجعة حالة الاشتراك.",
      "البيانات البنكية تحتاج verification وmasking وصلاحيات محدودة.",
    ],
    data: ["CustomerWallet", "WalletLedger", "WalletTransaction", "Refund", "CancellationFee", "WithdrawalRequest", "BankDetail"],
  },
  M09: {
    name: "M09 — النظام المالي للمطعم",
    domain: "حساب مستحق الوجبة، عمولة المطعم، خصومات الشكاوى، الفاتورة الشهرية، الدفعات، التحويل، كشف الحساب، وتقارير المطعم المالية",
    business: [
      "مستحقات المطاعم تؤثر على علاقة الشركاء وثقة المطعم في المنصة.",
      "عدم وضوح العمولة والخصومات قد يؤدي إلى اعتراضات مالية متكررة.",
      "الفاتورة الشهرية يجب أن تشرح كل وجبة وخصم ودفعة بشكل قابل للمراجعة.",
      "غياب KPIs مثل payout accuracy، invoice disputes، commission variance، وdeduction rate يضعف إدارة الشراكات.",
    ],
    logic: [
      "حساب مستحق الوجبة يجب أن يعتمد على snapshot وقت تنفيذ الطلب وليس السعر الحالي.",
      "خصومات الشكاوى يجب أن ترتبط بقرار مسؤولية موثق من M06.",
      "الدفعات الجزئية والتحويلات تحتاج reconciliation واضح.",
      "كشف الحساب يجب ألا يعرض أرقامًا حية قابلة للتغير بعد الإقفال.",
    ],
    data: ["RestaurantPayable", "MealPayable", "RestaurantCommission", "RestaurantInvoice", "Payout", "TransferReceipt", "AccountStatement"],
  },
  M10: {
    name: "M10 — نظام المؤثرين",
    domain: "ربط المؤثر، الكود، احتساب العمولة، شروط الاستحقاق، أثر الإلغاء، لوحة الأرباح، طلبات السحب، وسجل المدفوعات",
    business: [
      "نظام المؤثرين قد يكون قناة نمو قوية أو مصدر خسائر إذا لم تضبط شروط الاستحقاق.",
      "غياب attribution rules واضحة يؤدي إلى نزاعات بين المؤثرين والمنصة.",
      "العمولات يجب أن ترتبط بدفع فعلي واحتفاظ العميل وليس مجرد تسجيل.",
      "غياب KPIs مثل CAC by influencer، commission ROI، fraud rate، وactive influencer revenue يجعل البرنامج غير قابل للإدارة.",
    ],
    logic: [
      "كود المؤثر يحتاج uniqueness وlifecycle واضح.",
      "احتساب العمولة يجب أن ينتظر تحقق شروط الاستحقاق وإلغاء أثر الإلغاءات.",
      "طلبات السحب تحتاج رصيد مستحق قابل للصرف لا رصيد تقديري.",
      "كل تعديل عمولة يجب أن يسجل audit وfinancial event.",
    ],
    data: ["Influencer", "InfluencerCode", "ReferralAttribution", "Commission", "EligibilityRule", "WithdrawalRequest", "InfluencerPayout"],
  },
  M11: {
    name: "M11 — الحملات التشاركية",
    domain: "إنشاء الحملات، توزيع الخصم، البرامج والباقات، انضمام المطاعم، الطاقة، سقف المشتركين، المراجعة، الإطلاق، الإيقاف، الحسابات، والتقارير",
    business: [
      "الحملة التشاركية تمس العميل والمطعم والمنصة في نفس الوقت، وأي ضعف في توزيع الخصم يؤثر على الربحية.",
      "غياب قواعد انضمام المطاعم والطاقة قد يؤدي إلى حملة ناجحة تسويقيًا وفاشلة تشغيليًا.",
      "سقف المشتركين يجب أن يرتبط بالطاقة والميزانية وليس رقمًا يدويًا فقط.",
      "غياب KPIs مثل campaign ROI، capacity utilization، discount burn، وrestaurant participation يقلل فاعلية الحملات.",
    ],
    logic: [
      "الحملة تحتاج lifecycle واضح: draft, enrollment, review, approved, launched, paused, completed.",
      "توزيع الخصم يجب أن ينتج أثرًا ماليًا واضحًا على المنصة والمطعم.",
      "زيادة سقف المشتركين يجب أن تعيد فحص الطاقة والميزانية.",
      "إيقاف الحملة يجب أن يحدد أثره على المشتركين الحاليين والجدد.",
    ],
    data: ["Campaign", "CampaignDiscountSplit", "CampaignBundle", "CampaignEnrollment", "CampaignCapacity", "SubscriberCap", "CampaignAccounting"],
  },
  M12: {
    name: "M12 — لوحة تحكم الأدمن",
    domain: "لوحات الأدمن، الاعتمادات، العمليات، الشكاوى، المالية، التنبيهات، التقارير، الإعدادات، الصلاحيات، سجلات التدقيق، الإشعارات، وKPIs",
    business: [
      "لوحة الأدمن هي مركز التحكم، وأي غموض فيها ينعكس على كل فرق التشغيل والمالية والدعم.",
      "الداشبورد بدون تعريف واضح للـ KPIs قد يعرض أرقامًا كثيرة بلا قرارات.",
      "إعدادات النظام والصلاحيات من أخطر مناطق المنتج وتحتاج حوكمة ومراجعة.",
      "غياب ownership لكل widget أو تقرير يجعل مسؤولية الأرقام غير واضحة.",
    ],
    logic: [
      "كل widget يحتاج مصدر بيانات وتعريف calculation وrefresh rate.",
      "عمليات الاعتماد والمراقبة يجب أن ترتبط مباشرة بالـ modules الأصلية لا بنسخ بيانات منفصلة.",
      "التنبيهات يجب أن تملك severity وowner وSLA وإلا ستتحول لضوضاء.",
      "أي إجراء من الداشبورد يجب أن يمر عبر RBAC وAudit.",
    ],
    data: ["DashboardWidget", "ApprovalQueue", "OperationalMetric", "FinanceMetric", "Alert", "ReportDefinition", "SystemSetting"],
  },
};

const featureSpecific = [
  {
    test: /pricing|price|commission|payable|invoice|payout|refund|wallet|tax|revenue|financial|accounting|payment|settlement|fee|withdrawal|journal|ledger|deferred|expense|statement|gateway|cash|promotional/i,
    label: "Financial Logic",
    business: "الميزة لها أثر مالي مباشر، وأي غموض في طريقة الحساب أو وقت تثبيت السعر قد يؤدي إلى نزاعات مالية أو فروقات في التسويات.",
    logic: "يجب منع تعديل الأرصدة مباشرة، والاعتماد على events وledger/journal entries مع idempotency وreversal واضح.",
    data: "يلزم snapshot للأرقام المؤثرة، currency code، rounding policy، وربط واضح بقيود أو حركات مالية.",
  },
  {
    test: /subscription|program|bundle|tier|renewal|promo|referral|discount|classification/i,
    label: "Subscription & Commercial Packaging",
    business: "الميزة تؤثر على قرار الشراء وتجديد الاشتراك وربحية الباقة، لذلك أي غموض في الأسعار أو الأهلية أو مدة الاشتراك قد يتحول إلى نزاع مع العميل أو المطعم.",
    logic: "تحتاج قواعد واضحة لإنشاء الاشتراك، تثبيت السعر، تطبيق الخصم، الترقية، التجديد، ومنع إعادة الحساب العشوائي بعد الدفع.",
    data: "يلزم SubscriptionSnapshot يحتوي البرنامج، الباقة، المدة، السعر، الخصومات، التصنيف، العملة، والقواعد المطبقة وقت الشراء.",
  },
  {
    test: /approval|verification|document|registration|onboarding/i,
    label: "Approval & Verification",
    business: "الميزة تمثل بوابة قبول كيان جديد أو اعتماده، لذلك ضعف معايير القبول يؤدي إلى قرارات غير موحدة ومخاطر تشغيلية.",
    logic: "تحتاج state machine تفصل بين المسودة، الرفع، المراجعة، الاستكمال، الرفض، الاعتماد، والتفعيل.",
    data: "يلزم حفظ reviewer, reason, decision timestamp, document version, وbefore/after لكل قرار.",
  },
  {
    test: /calendar|selection|meal|freeze|lock|72|automatic|diversification|allergies|preferences/i,
    label: "Calendar & Meal Rules",
    business: "الميزة تؤثر على تجربة العميل اليومية، لذلك أي قرار غير مفهوم أو اختيار غير مناسب يقلل الثقة في الاشتراك.",
    logic: "تحتاج ترتيب أولويات واضح بين الوقت، الحساسية، التفضيلات، الطاقة، التصنيف، والـ fallback.",
    data: "يلزم تخزين اختيار اليوم كـ immutable decision بعد القفل مع سبب الاختيار ومصدره manual/automatic.",
  },
  {
    test: /capacity|busy|handover|order|tracking|delivery|driver|barcode|pickup|confirmation|attempt|contact|range/i,
    label: "Operations & Delivery",
    business: "الميزة مرتبطة بالتنفيذ اليومي وسرعة الخدمة، وأي نقص فيها يظهر كفشل مباشر أمام العميل.",
    logic: "تحتاج lifecycle تشغيلي يمنع القفز بين الحالات ويحدد المسؤول عن كل انتقال.",
    data: "يلزم event log لحالة الطلب أو التسليم، مع timestamps وactor وlocation عند الحاجة.",
  },
  {
    test: /complaint|compensation|deduction|support|ticket|responsibility|evidence/i,
    label: "Support & Disputes",
    business: "الميزة تتحكم في رضا العميل وتكلفة التعويض وعدالة الخصم على المطعم.",
    logic: "تحتاج workflow قرار مسؤولية واضح وممنوع تعديله بعد الاعتماد إلا عبر override موثق.",
    data: "يلزم ربط الشكوى بالأدلة والقرار والتعويض أو الخصم الناتج عنها.",
  },
  {
    test: /role|permission|audit|log|setting|admin|dashboard|kpi|report|notification|alert/i,
    label: "Governance & Admin",
    business: "الميزة تؤثر على الحوكمة واتخاذ القرار، لذلك ضعف التعريف قد يفتح صلاحيات زائدة أو قرارات تشغيلية خاطئة.",
    logic: "تحتاج RBAC وScope وAudit في كل إجراء، مع تعريف واضح لمن يملك القرار.",
    data: "يلزم تعريف مصدر كل رقم أو إجراء، وpolicy version، وcorrelation id عند التنفيذ.",
  },
  {
    test: /campaign|discount|subscriber|enrollment|launch|pause/i,
    label: "Campaign Lifecycle",
    business: "الميزة تؤثر على النمو والربحية والطاقة في نفس الوقت، لذلك تحتاج قواعد أهلية وسقف وتكلفة واضحة.",
    logic: "تحتاج lifecycle للحملة وتقييم أثر أي تعديل على المشتركين والمطاعم والخصم.",
    data: "يلزم snapshot للحملة، discount split، capacity allocation، وfinancial impact.",
  },
  {
    test: /influencer|referral|code|commission/i,
    label: "Influencer Attribution",
    business: "الميزة قد تخلق تكلفة اكتساب كبيرة إذا لم تضبط attribution وشروط الاستحقاق.",
    logic: "تحتاج منع self-referral، وتحديد متى يصبح العميل مؤهلًا للعمولة ومتى تلغى العمولة.",
    data: "يلزم حفظ source code, linked customer, eligibility status, cancellation impact، وسجل الصرف.",
  },
];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  const normalized = content.replace(/\r+\n/g, "\n").replace(/\r/g, "\n");
  fs.writeFileSync(file, normalized.replace(/\n/g, "\r\n"), "utf8");
}

function firstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function secondHeading(markdown) {
  const match = markdown.match(/^##\s+([^\n#].+)$/m);
  return match ? match[1].trim() : "";
}

function moduleCode(moduleDir) {
  return path.basename(moduleDir).slice(0, 3);
}

function moduleDirs() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^M\d{2}_/.test(entry.name) && !entry.name.startsWith("M01_"))
    .map((entry) => path.join(root, entry.name))
    .sort();
}

function featureDirs(moduleDir) {
  return fs
    .readdirSync(moduleDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^F\d{3}_/.test(entry.name))
    .map((entry) => path.join(moduleDir, entry.name))
    .sort();
}

function sourceFileFor(featureDir) {
  const base = path.basename(featureDir);
  const candidate = path.join(path.dirname(featureDir), `${base}.md`);
  return fs.existsSync(candidate) ? candidate : null;
}

function featureMeta(featureDir) {
  const source = sourceFileFor(featureDir);
  const markdown = source ? read(source) : "";
  const slug = path.basename(featureDir);
  const id = (slug.match(/^(F\d{3})/) || [slug, slug])[1];
  const h1 = firstHeading(markdown);
  const arTitle = h1.replace(/^F\d{3}\s*[—-]\s*/, "").trim() || slug;
  const enTitle = secondHeading(markdown) || slug.replace(/^F\d{3}_/, "").replace(/_/g, " ");
  return { id, slug, arTitle, enTitle, sourceName: source ? path.basename(source) : "" };
}

function focusFor(meta) {
  return (
    featureSpecific.find((item) => item.test.test(`${meta.enTitle} ${meta.slug} ${meta.arTitle}`)) || {
      label: "General Product Logic",
      business: "الميزة تحتاج تعريفًا تجاريًا أدق حتى لا تتحول إلى تنفيذ عام لا يخدم هدفها الحقيقي.",
      logic: "تحتاج state machine وvalidation وownership واضح لكل انتقال.",
      data: "يلزم schema واضح، audit، idempotency، وصلاحيات مرتبطة بالنطاق.",
    }
  );
}

function bulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function buildWeakness(meta, mod, focus) {
  return `# ${meta.id} — نقاط الضعف التفصيلية

## الميزة
**${meta.enTitle}**  
الميزة جزء من **${mod.name}**، ومجالها الأساسي: ${mod.domain}.

> تم تحديث هذا التحليل تلقائيًا بتاريخ ${generatedAt} ليكون أكثر تفصيلًا من ناحية Business وLogic وData/API/Security.

## 1. نقاط ضعف من ناحية الـ Business
### 1.1 الهدف التجاري يحتاج ربطًا بنتيجة قابلة للقياس
التوثيق الحالي يشرح الإطار العام للميزة، لكنه لا يحدد بدقة ما النتيجة التجارية التي تثبت نجاحها داخل MealMate.

أمثلة مؤشرات يجب تعريفها:
- معدل نجاح العملية.
- معدل الفشل أو الرفض.
- زمن إكمال العملية.
- عدد الحالات التي تحتاج تدخل يدوي.
- أثر الميزة على الربحية أو رضا المستخدم عند وجود أثر مباشر.

### 1.2 خصوصية الميزة داخل الموديول غير كافية
${focus.business}

### 1.3 قواعد الموديول التجارية تحتاج تفصيلًا
داخل ${mod.name} توجد نقاط Business مؤثرة:
${bulletList(mod.business)}

### 1.4 غياب Ownership وSLA
لا يوجد تحديد واضح لـ:
- مالك القرار التجاري.
- مالك التشغيل اليومي.
- زمن الاستجابة المتوقع.
- متى يتم التصعيد للأدمن أو المالية أو الدعم.

الأثر: نفس الحالة قد يتم التعامل معها بطرق مختلفة حسب الموظف أو الدولة.

## 2. نقاط ضعف من ناحية الـ Logic / منطق التشغيل
### 2.1 State Machine غير كافية
الحالات العامة مثل \`Draft\`, \`Pending\`, \`Active\`, \`Rejected\` لا تكفي وحدها. الميزة تحتاج حالات انتقال دقيقة تمنع القفز من مرحلة لأخرى بدون تحقق.

المطلوب تحديد:
- الحالة الابتدائية.
- الحالات المسموحة.
- الانتقالات المسموحة والممنوعة.
- من يملك كل انتقال.
- هل الانتقال يحتاج سببًا أو وثيقة أو approval.

### 2.2 ترتيب القواعد غير واضح
${focus.logic}

قواعد الموديول التي تحتاج ضبطًا:
${bulletList(mod.logic)}

### 2.3 منطق الـ Override غير محدد
لا يكفي قول إن الأدمن يستطيع override. يجب تحديد:
- متى يسمح بالـ override؟
- ما الصلاحية المطلوبة؟
- هل يحتاج موافقة ثانية؟
- ما السبب الإلزامي؟
- هل ينتج أثرًا ماليًا أو تشغيليًا؟

### 2.4 التزامن والتكرار غير مغطى بشكل كافٍ
أي عملية يمكن تنفيذها مرتين أو من مستخدمين مختلفين تحتاج:
- Idempotency-Key.
- optimistic concurrency / RowVersion.
- منع duplicate requests.
- نتيجة واضحة عند تكرار نفس الطلب.

## 3. نقاط ضعف Data / API / Security
### 3.1 نموذج البيانات يحتاج تفصيلًا
الكيانات المتوقعة في هذا السياق تشمل:
${bulletList(mod.data.map((item) => `\`${item}\``))}

بالنسبة لهذه الميزة تحديدًا:
- ${focus.data}

### 3.2 API Contract غير مكتمل
ينقص في التوثيق:
- request schema.
- response schema.
- validation rules.
- status codes.
- ProblemDetails للأخطاء.
- pagination/filtering/sorting عند القوائم.
- correlation id في كل request.

### 3.3 الصلاحيات والنطاق غير كافيين
كل API يجب أن يحدد:
- permission code.
- scope المطلوب.
- هل المستخدم يرى بياناته فقط أم بيانات دولة/منطقة/كيان.
- هل يوجد masking للبيانات الحساسة.

### 3.4 Audit غير مفصل
كل عملية حساسة يجب أن تسجل:
- actor.
- action.
- entity.
- before/after.
- reason.
- source/channel.
- correlation id.

## 4. نقاط ضعف في الاختبار والقبول
معايير القبول الحالية تحتاج تحويل إلى سيناريوهات قابلة للتنفيذ:
- Given/When/Then لكل happy path.
- Permission denied.
- Scope denied.
- Invalid state.
- Duplicate request.
- Concurrent update.
- External service failure.
- Audit verification.
- Localization.

## 5. أثر نقاط الضعف
- اختلاف تنفيذ الواجهة عن الـ Backend.
- قرارات تشغيلية غير موحدة.
- صعوبة اختبار الميزة قبل التسليم.
- احتمالية ظهور نزاعات مالية أو تشغيلية حسب طبيعة الميزة.
- ضعف التتبع عند حدوث خطأ أو اعتراض.
- تكلفة إعادة بناء أعلى بعد بدء التطوير.

## 6. المطلوب لتقوية الميزة
1. كتابة state machine مخصصة للميزة.
2. تعريف business owner وoperational owner.
3. تفصيل API contract كامل.
4. تفصيل data model والقيود والفهارس.
5. ربط كل عملية بـ RBAC + Scope + Audit.
6. إضافة KPIs خاصة بالميزة.
7. تحويل معايير القبول إلى test scenarios.
8. تحديد أثر الميزة على الموديولات المرتبطة.
`;
}

function updateModuleIndex(moduleDir, rows, mod) {
  write(
    path.join(moduleDir, "WEAKNESSES_INDEX.md"),
    `# ${mod.name} — Weaknesses Index

| ID | Feature | Weaknesses |
|---|---|---|
${rows.join("\n")}
`
  );
}

function m01ManualRows() {
  const moduleDir = path.join(root, "M01_identity_access");
  const rows = featureDirs(moduleDir).map((featureDir) => {
    const meta = featureMeta(featureDir);
    return `| ${meta.id} | ${meta.enTitle} | [01_weaknesses.md](${meta.slug}/01_weaknesses.md) |`;
  });

  write(
    path.join(moduleDir, "WEAKNESSES_INDEX.md"),
    `# M01 — إدارة الحسابات والوصول — Weaknesses Index

| ID | Feature | Weaknesses |
|---|---|---|
${rows.join("\n")}
`
  );

  return featureDirs(moduleDir).map((featureDir) => {
    const meta = featureMeta(featureDir);
    const rel = path.relative(root, path.join(featureDir, "01_weaknesses.md")).replace(/\\/g, "/");
    return `| ${meta.id} | M01 — إدارة الحسابات والوصول | ${meta.enTitle} | [Weaknesses](${rel}) |`;
  });
}

function main() {
  const allRows = [...m01ManualRows()];
  let count = 0;
  for (const moduleDir of moduleDirs()) {
    const code = moduleCode(moduleDir);
    const mod = modules[code];
    if (!mod) continue;

    const moduleRows = [];
    for (const featureDir of featureDirs(moduleDir)) {
      const meta = featureMeta(featureDir);
      const focus = focusFor(meta);
      write(path.join(featureDir, "01_weaknesses.md"), buildWeakness(meta, mod, focus));
      moduleRows.push(`| ${meta.id} | ${meta.enTitle} | [01_weaknesses.md](${meta.slug}/01_weaknesses.md) |`);
      allRows.push(`| ${meta.id} | ${mod.name} | ${meta.enTitle} | [Weaknesses](${path.relative(root, path.join(featureDir, "01_weaknesses.md")).replace(/\\/g, "/")}) |`);
      count += 1;
    }
    updateModuleIndex(moduleDir, moduleRows, mod);
  }

  write(
    path.join(root, "ALL_MODULES_WEAKNESSES_INDEX.md"),
    `# MealMate — All Modules Weaknesses Index

هذا الفهرس يجمع ملفات نقاط الضعف التفصيلية لكل الميزات من M01 إلى M12.  
ملاحظة: ملفات M01 تم تفصيلها يدويًا، وباقي الموديولات تم توليدها بتفصيل موديول/ميزة.

| ID | Module | Feature | Weaknesses |
|---|---|---|---|
${allRows.join("\n")}
`
  );

  console.log(`Updated ${count} weakness files for M02-M12.`);
}

main();
