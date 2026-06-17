const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedAt = "2026-06-15";

const modules = {
  M02: {
    folder: "M02_programs_subscriptions",
    title: "M02 — البرامج والاشتراكات",
    english: "Programs & Subscriptions",
    summary: "هذا الموديول يحوّل MealMate من تطبيق طلبات إلى منتج اشتراكات غذائية. هو مسؤول عن البرامج، الباقات، التصنيف، التسعير، إنشاء الاشتراك، التجديد، الترقية، العروض، والإحالات.",
    business: [
      "الهدف التجاري الأساسي هو بناء عروض اشتراك واضحة وقابلة للبيع والتجديد بدون نزاعات سعرية.",
      "أي غموض في العلاقة بين البرنامج والباقة والتصنيف والسعر سيؤثر مباشرة على conversion والربحية.",
      "العروض والإحالات والاشتراك العائلي يجب أن تكون مربوطة بسقف خصم وقواعد أهلية حتى لا تتحول إلى تكلفة نمو غير منضبطة.",
      "التسعير يجب أن يحفظ snapshot وقت الشراء حتى لا تتأثر الاشتراكات القديمة بتغيير الأسعار لاحقًا.",
    ],
    logic: [
      "Subscription lifecycle يجب أن يفرق بين Draft, PendingPayment, Active, Upgraded, Renewed, Cancelled, Expired.",
      "منطق الخصم يجب أن يطبق مرة واحدة وبترتيب واضح مع السعر الأساسي والتصنيف والعملة.",
      "الترقية والتجديد يجب أن يدعما idempotency حتى لا يتم تحصيل أو تحديث الاشتراك مرتين.",
      "كل قرار تسعير يجب أن يكون قابلًا لإعادة التفسير من خلال PricingRuleVersion وSubscriptionSnapshot.",
    ],
    data: ["Program", "Bundle", "Subscription", "PricingRule", "DiscountCode", "ReferralCode", "SubscriptionSnapshot", "PaymentIntent"],
    dependencies: ["M03 Calendar & Meals", "M07 Central Accounting", "M08 Customer Finance", "M10 Influencers"],
    risks: ["نزاعات أسعار", "خصومات غير مربحة", "تجديدات خاطئة", "اشتراكات بدون snapshot مالي"],
    priority: ["F013", "F014", "F018", "F016", "F017", "F015", "F009", "F010", "F011", "F012"],
  },
  M03: {
    folder: "M03_calendar_meals",
    title: "M03 — التقويم والوجبات",
    english: "Calendar & Meals",
    summary: "هذا الموديول هو قلب تجربة العميل اليومية. هو مسؤول عن تقويم الاشتراك، اختيار المطعم والوجبة، قفل 72 ساعة، الاختيار التلقائي، الحساسية، التفضيلات، والتجميد.",
    business: [
      "القيمة التي يشتريها العميل هي انتظام الوجبات وسهولة الاختيار، وليس مجرد قائمة طعام.",
      "قاعدة 72 ساعة يجب شرحها تجاريًا بوضوح حتى لا يشعر العميل أن النظام يمنعه تعسفيًا.",
      "الحساسية والتفضيلات عنصر ثقة، وأي خطأ فيها قد يكون خطرًا صحيًا وليس مجرد UX issue.",
      "التجميد والتغيير يجب أن يوازنا بين مرونة العميل واستقرار تشغيل المطاعم.",
    ],
    logic: [
      "يجب تخزين كل مواعيد القفل UTC وعرضها حسب timezone الدولة.",
      "الاختيار التلقائي يحتاج ترتيب أولويات: سلامة الحساسية، نطاق المنطقة، التصنيف، الطاقة، التنويع، ثم fallback.",
      "CalendarDay يجب أن يصبح immutable بعد القفل إلا عبر override موثق.",
      "Freeze وMeal Change يجب أن ينتجا transitions لا تعدل التاريخ الماضي.",
    ],
    data: ["SubscriptionCalendar", "CalendarDay", "MealSelection", "RestaurantSelection", "Allergy", "Preference", "FreezeRequest"],
    dependencies: ["M02 Programs & Subscriptions", "M04 Restaurant Operations", "M05 Delivery", "M08 Customer Finance"],
    risks: ["اختيار وجبة غير مناسبة", "تغيير بعد القفل", "تعارض timezone", "تجميد يؤثر على المحاسبة"],
    priority: ["F019", "F022", "F020", "F021", "F023", "F025", "F024", "F026", "F027"],
  },
  M04: {
    folder: "M04_restaurant_operations",
    title: "M04 — المطاعم والتشغيل",
    english: "Restaurant Operations",
    summary: "هذا الموديول يدير جاهزية المطعم وتشغيله اليومي: القوائم، الأسعار، المناطق، الطاقة، الطلبات اليومية، تأكيد 72 ساعة، الفواتير والباركود، التسليم للسائق، تقييمات المطعم، وإنهاء التعاقد.",
    business: [
      "المطعم ليس مجرد مورد، بل شريك تشغيل يومي داخل نموذج اشتراكات يحتاج التزامًا بالطاقة والجودة والمواعيد.",
      "اعتماد المطعم لا يكفي؛ يجب وجود Operational Readiness قبل الظهور في تقويم العملاء.",
      "الطاقة وحالة Busy يجب أن تمنع قبول طلبات لا يستطيع المطعم تنفيذها.",
      "تقييم المطعم وإنهاء التعاقد يجب أن يعتمدا على بيانات أداء موثقة وليس قرارات منفصلة.",
    ],
    logic: [
      "Menu وPriceList وCapacityRule تحتاج versioning حتى لا تتغير الطلبات المقفولة.",
      "Restaurant Daily Orders يجب أن ترتبط بقفل 72 ساعة والتأكيد خلال SLA واضح.",
      "Handover to Driver يجب أن يعتمد barcode/event حتى لا يحدث تسليم خاطئ.",
      "Busy automation يجب أن يكون قابلًا للتفسير ويقبل override موثقًا.",
    ],
    data: ["Restaurant", "Menu", "Meal", "PriceList", "ServiceRegion", "CapacityRule", "DailyOrder", "HandoverEvent"],
    dependencies: ["M01 Identity", "M03 Calendar", "M05 Delivery", "M09 Restaurant Finance"],
    risks: ["مطعم غير جاهز يظهر للعملاء", "طلبات فوق الطاقة", "أسعار غير متزامنة", "تسليم خاطئ للسائق"],
    priority: ["F028", "F029", "F030", "F031", "F032", "F034", "F033", "F035", "F036", "F037", "F038", "F039"],
  },
  M05: {
    folder: "M05_driver_delivery",
    title: "M05 — السائق والتوصيل",
    english: "Driver & Delivery",
    summary: "هذا الموديول مسؤول عن ملف السائق، نطاق استلام الطلبات، إسناد الطلب، المسح بالباركود، التتبع اللحظي، الاتصال الآمن، الـ hold، المحاولة الثانية، تأكيد التسليم، والتقييم.",
    business: [
      "التوصيل هو آخر نقطة في تجربة العميل، وفشله يجعل كل الموديولات السابقة تبدو فاشلة.",
      "نطاق السائق وعلاقته بالمطعم أو المنصة يجب أن يكون واضحًا قبل الإسناد.",
      "الاتصال الآمن وقاعدة 3 كم تؤثر على الخصوصية والثقة.",
      "المحاولة الثانية والـ hold تحتاج سياسة واضحة حتى لا تتحول إلى نزاعات دعم.",
    ],
    logic: [
      "DeliveryTask يحتاج lifecycle واضح من assignment إلى pickup إلى in-transit إلى delivered أو failed.",
      "Barcode scan يجب أن يمنع استلام أو تسليم الطلب الخطأ.",
      "Tracking يجب أن يحدّث الحالة بدون كشف بيانات أكثر من اللازم.",
      "Second attempt وHold يجب أن يحددا من يملك القرار وما أثره على العميل والمطعم.",
    ],
    data: ["DriverProfile", "DriverRegion", "DeliveryTask", "BarcodeScan", "TrackingEvent", "DeliveryAttempt", "DriverRating"],
    dependencies: ["M01 Identity", "M04 Restaurant Operations", "M06 Complaints", "M12 Admin Dashboard"],
    risks: ["تسليم خاطئ", "تسريب بيانات العميل", "إسناد خارج النطاق", "فشل تتبع أو تأكيد"],
    priority: ["F040", "F041", "F042", "F043", "F044", "F049", "F047", "F048", "F045", "F046", "F050", "F051"],
  },
  M06: {
    folder: "M06_complaints_support",
    title: "M06 — الشكاوى والدعم",
    english: "Complaints & Support",
    summary: "هذا الموديول يدير الشكاوى من لحظة الإنشاء وحتى القرار والتعويض أو الخصم. يشمل الأدلة، التصنيف، مراجعة الأدمن، رد المطعم، تحديد المسؤولية، تعويض العميل، خصم المطعم، اليوم المجاني، وتذاكر الدعم.",
    business: [
      "الشكاوى هي آلية حفظ الثقة بين العميل والمطعم والمنصة.",
      "سياسة التعويض والخصم يجب أن تكون عادلة وقابلة للتفسير.",
      "تصنيف الشكاوى يجب أن يوحد قرارات الدعم ويكشف المطاعم أو المناطق كثيرة المشاكل.",
      "التعويض والخصم يؤثران على المحاسبة ولا يجب التعامل معهما كتعليقات دعم فقط.",
    ],
    logic: [
      "Complaint lifecycle يجب أن يفرق بين Open, EvidenceSubmitted, UnderReview, RestaurantResponded, DecisionMade, Compensated, Closed.",
      "قرار المسؤولية يجب أن يكون immutable بعد الاعتماد إلا override.",
      "الأدلة يجب أن ترتبط بالشكوى ولا تحذف بعد القرار.",
      "كل تعويض أو خصم يجب أن ينتج business event للمحاسبة.",
    ],
    data: ["Complaint", "ComplaintEvidence", "ComplaintClassification", "ResponsibilityDecision", "Compensation", "Deduction", "SupportTicket"],
    dependencies: ["M03 Calendar", "M04 Restaurants", "M05 Delivery", "M07 Accounting", "M08 Customer Finance", "M09 Restaurant Finance"],
    risks: ["تعويض غير عادل", "خصم غير موثق", "ضياع أدلة", "قرارات دعم متضاربة"],
    priority: ["F052", "F053", "F054", "F055", "F056", "F057", "F058", "F059", "F060", "F061"],
  },
  M07: {
    folder: "M07_central_accounting",
    title: "M07 — النظام المالي والمحاسبي المركزي",
    english: "Central Accounting",
    summary: "هذا الموديول هو مصدر الحقيقة المالي في MealMate. يشمل شجرة الحسابات، الإعدادات المالية، القيود التلقائية، الإيراد المؤجل، الاعتراف اليومي بالإيراد، مستحقات المطاعم والمؤثرين، بوابات الدفع، الضرائب، المصروفات، التسويات، التقارير، والتدقيق المالي.",
    business: [
      "أي رقم مالي في المنصة يجب أن يكون قابلًا للتفسير من خلال قيود وأحداث واضحة.",
      "الإيراد المؤجل والاعتراف اليومي مهمان جدًا لأن MealMate نموذج اشتراكات وليس بيعًا لحظيًا فقط.",
      "تعدد الدول والعملات والضرائب يجب أن يكون جزءًا من التصميم وليس إضافة لاحقة.",
      "التقارير المالية يجب أن تعتمد على إقفالات وsnapshots لا حسابات متغيرة في لحظة العرض.",
    ],
    logic: [
      "كل financial event يجب أن ينتج JournalEntry بنظام double-entry.",
      "لا يسمح بحذف حركة مالية؛ التصحيح يكون بقيد عكسي.",
      "Revenue recognition يجب أن يعتمد على أيام الخدمة الفعلية وحالة الاشتراك.",
      "Payables وsettlements تحتاج reconciliation قبل الدفع.",
    ],
    data: ["ChartOfAccount", "FinancialSetting", "JournalEntry", "LedgerEntry", "RevenueRecognition", "Payable", "TaxRule", "Settlement"],
    dependencies: ["M02 Subscriptions", "M06 Complaints", "M08 Customer Finance", "M09 Restaurant Finance", "M10 Influencers", "M11 Campaigns"],
    risks: ["فروقات مالية", "اعتراف إيراد خاطئ", "ضرائب غير صحيحة", "تعديل أرصدة بدون أثر"],
    priority: ["F062", "F063", "F064", "F065", "F066", "F067", "F068", "F069", "F070", "F072", "F073", "F074", "F071"],
  },
  M08: {
    folder: "M08_customer_finance",
    title: "M08 — النظام المالي للعميل",
    english: "Customer Finance",
    summary: "هذا الموديول يدير محفظة العميل النقدية والترويجية، سجل الحركات، الدفع من المحفظة، الإلغاء، الاسترداد، رسوم الإلغاء، طلبات السحب، البيانات البنكية، وسجل المدفوعات والاستردادات.",
    business: [
      "محفظة العميل تمس الثقة مباشرة، وأي خطأ صغير قد يتحول إلى نزاع كبير.",
      "الرصيد النقدي والترويجي يجب أن يكونا منفصلين في الاستخدام والاسترداد.",
      "سياسة الإلغاء والاسترداد يجب أن تكون واضحة قبل الدفع.",
      "السحب والبيانات البنكية يحتاجان حوكمة وخصوصية عالية.",
    ],
    logic: [
      "Wallet ledger يجب أن يكون append-only.",
      "استخدام الرصيد يحتاج priority policy بين cash وpromo.",
      "Refund calculation يجب أن يعتمد على snapshot الاشتراك والأيام المستخدمة.",
      "Withdrawal request يحتاج حالات approval/payment/rejection واضحة.",
    ],
    data: ["CustomerWallet", "WalletLedger", "WalletTransaction", "Refund", "CancellationFee", "WithdrawalRequest", "BankDetail"],
    dependencies: ["M02 Subscriptions", "M03 Calendar", "M07 Accounting", "M12 Admin Dashboard"],
    risks: ["رصيد خاطئ", "استرداد زائد", "استخدام خاطئ للرصيد الترويجي", "تسريب بيانات بنكية"],
    priority: ["F075", "F076", "F077", "F078", "F079", "F080", "F081", "F082", "F083", "F084"],
  },
  M09: {
    folder: "M09_restaurant_finance",
    title: "M09 — النظام المالي للمطعم",
    english: "Restaurant Finance",
    summary: "هذا الموديول يدير مستحقات المطاعم: حساب مستحق الوجبة، العمولة، خصومات الشكاوى، الفاتورة الشهرية، الدفعات الجزئية، السداد، إيصال التحويل، كشف الحساب، والتقارير المالية.",
    business: [
      "ثقة المطاعم تعتمد على وضوح المستحقات والخصومات والدفعات.",
      "العمولة يجب أن تكون قابلة للتفسير لكل وجبة أو اشتراك.",
      "خصومات الشكاوى يجب أن ترتبط بقرار مسؤولية واضح.",
      "الفاتورة الشهرية يجب أن تمنع النزاع من خلال تفصيل كل بند.",
    ],
    logic: [
      "Meal payable يجب أن يعتمد على snapshot وقت الطلب.",
      "Commission calculation يجب أن تكون versioned.",
      "Partial payouts تحتاج reconciliation واضح.",
      "Account statement يجب أن يعرض فترة مقفلة وليس أرقامًا متغيرة.",
    ],
    data: ["MealPayable", "RestaurantCommission", "ComplaintDeduction", "RestaurantInvoice", "RestaurantPayout", "TransferReceipt", "AccountStatement"],
    dependencies: ["M04 Restaurant Operations", "M06 Complaints", "M07 Accounting"],
    risks: ["نزاعات مستحقات", "خصومات غير مبررة", "دفعات مكررة", "كشف حساب غير مطابق"],
    priority: ["F085", "F086", "F088", "F090", "F092", "F087", "F089", "F091", "F093"],
  },
  M10: {
    folder: "M10_influencers",
    title: "M10 — نظام المؤثرين",
    english: "Influencers",
    summary: "هذا الموديول يدير نظام المؤثرين: ربط المؤثر بالعميل، الأكواد، احتساب العمولة، شروط الاستحقاق، أثر الإلغاء، لوحة الأرباح، طلبات السحب، الموافقة على السحب، وسجل المدفوعات.",
    business: [
      "المؤثرون قناة نمو، لكنها قد تتحول إلى تكلفة عالية بدون attribution وشروط استحقاق دقيقة.",
      "العمولة يجب أن ترتبط بقيمة حقيقية مثل دفع العميل أو استمرار الاشتراك.",
      "أثر الإلغاء على العمولة يجب أن يكون واضحًا قبل الصرف.",
      "لوحة أرباح المؤثر يجب أن تفرق بين رصيد تقديري ورصيد قابل للسحب.",
    ],
    logic: [
      "Influencer code يجب أن يكون unique وله lifecycle.",
      "Commission eligibility يجب أن يمر بشروط واضحة.",
      "Cancellation impact يجب أن يوقف أو يعكس العمولة قبل الصرف.",
      "Withdrawal يجب أن يعتمد على available balance فقط.",
    ],
    data: ["Influencer", "InfluencerCode", "ReferralAttribution", "Commission", "EligibilityRule", "WithdrawalRequest", "InfluencerPayout"],
    dependencies: ["M01 Identity", "M02 Subscriptions", "M07 Accounting"],
    risks: ["self-referral", "عمولات غير مستحقة", "نزاعات مؤثرين", "سحب رصيد غير مؤكد"],
    priority: ["F094", "F095", "F097", "F096", "F098", "F099", "F100", "F101", "F102"],
  },
  M11: {
    folder: "M11_collaborative_campaigns",
    title: "M11 — الحملات التشاركية",
    english: "Collaborative Campaigns",
    summary: "هذا الموديول يدير الحملات التشاركية بين MealMate والمطاعم: إنشاء الحملة، توزيع الخصم، البرامج والباقات، انضمام المطاعم، الطاقة، سقف المشتركين، المراجعة، الاعتماد، الإطلاق، الإيقاف، الحسابات، والتقارير.",
    business: [
      "الحملات تمس النمو والربحية والطاقة التشغيلية في نفس الوقت.",
      "توزيع الخصم يجب أن يحدد من يتحمل التكلفة: المنصة، المطعم، أو الاثنين.",
      "سقف المشتركين يجب أن يرتبط بالطاقة والميزانية وليس رقمًا يدويًا فقط.",
      "انضمام المطاعم للحملة يجب أن يراجع جاهزيتها وقدرتها قبل الإطلاق.",
    ],
    logic: [
      "Campaign lifecycle يجب أن يمر بـ Draft, EnrollmentOpen, UnderReview, Approved, Launched, Paused, Completed.",
      "زيادة السقف يجب أن تعيد فحص الطاقة والميزانية.",
      "إيقاف الحملة يجب أن يحدد أثره على العملاء الحاليين والجدد.",
      "Campaign accounting يجب أن ينتج events واضحة للمحاسبة.",
    ],
    data: ["Campaign", "CampaignDiscountSplit", "CampaignBundle", "RestaurantEnrollment", "CampaignCapacity", "SubscriberCap", "CampaignAccounting"],
    dependencies: ["M02 Subscriptions", "M04 Restaurants", "M07 Accounting", "M09 Restaurant Finance", "M12 Admin Dashboard"],
    risks: ["حملة غير مربحة", "طاقة غير كافية", "خصم غير محسوب", "إطلاق قبل جاهزية المطاعم"],
    priority: ["F103", "F104", "F105", "F106", "F107", "F108", "F109", "F110", "F111", "F112", "F113", "F114", "F115", "F116", "F117"],
  },
  M12: {
    folder: "M12_admin_dashboard",
    title: "M12 — لوحة تحكم الأدمن",
    english: "Admin Dashboard",
    summary: "هذا الموديول هو مركز التحكم والمراقبة: نظرة عامة، الاعتمادات، العمليات، حالات 72 ساعة وBusy وHold، الشكاوى، المالية، تنبيهات الربحية، التقارير، الإعدادات، الصلاحيات، سجلات التدقيق، الإشعارات، وKPIs.",
    business: [
      "لوحة الأدمن يجب أن تحول البيانات إلى قرارات، لا مجرد عرض أرقام.",
      "كل dashboard metric يحتاج owner وتعريف حساب ومصدر بيانات.",
      "الإعدادات والصلاحيات أخطر أجزاء اللوحة وتحتاج حوكمة ومراجعة.",
      "التنبيهات يجب أن تكون قابلة للتنفيذ ولها SLA ومسؤول.",
    ],
    logic: [
      "كل widget يحتاج refresh policy وتعريف calculation.",
      "أي action من الداشبورد يجب أن يمر عبر RBAC وAudit.",
      "Approvals وmonitoring يجب أن ترتبط بالموديولات الأصلية لا نسخ بيانات منفصلة.",
      "Reports يجب أن تفرق بين operational real-time وfinancial closed periods.",
    ],
    data: ["DashboardWidget", "ApprovalQueue", "OperationalMetric", "FinanceMetric", "Alert", "ReportDefinition", "SystemSetting", "AuditView"],
    dependencies: ["All Modules", "M01 RBAC", "M07 Accounting", "M08/M09 Finance", "M06 Support"],
    risks: ["أرقام مضللة", "إعدادات خطرة بلا audit", "صلاحيات زائدة", "تنبيهات كثيرة بلا مسؤولية"],
    priority: ["F118", "F119", "F120", "F121", "F122", "F123", "F124", "F125", "F126", "F127", "F128", "F129", "F130", "F131", "F132"],
  },
};

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

function featureFiles(moduleDir) {
  return fs
    .readdirSync(moduleDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^F\d{3}_.+\.md$/.test(entry.name))
    .map((entry) => path.join(moduleDir, entry.name))
    .sort();
}

function featureRows(moduleDir) {
  return featureFiles(moduleDir).map((file) => {
    const md = read(file);
    const id = (path.basename(file).match(/^(F\d{3})/) || ["", ""])[1];
    const ar = firstHeading(md).replace(/^F\d{3}\s*[—-]\s*/, "").trim();
    const en = secondHeading(md);
    const folder = path.basename(file, ".md");
    return { id, ar, en, folder };
  });
}

function list(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function table(rows) {
  return rows.map((row) => `| ${row.id} | ${row.en} | ${row.ar} | [Folder](${row.folder}/README.md) |`).join("\n");
}

function mermaid(rows) {
  const featureNodes = rows.map((row) => `    ${row.id}["${row.id} ${row.en.replace(/"/g, "'")}"]`).join("\n");
  const links = rows.map((row) => `    Core --> ${row.id}`).join("\n");
  return `flowchart TD
    Core["${rows.length} Features"]
${featureNodes}
${links}`;
}

function analysisContent(mod, rows) {
  return `# ${mod.title} — التحليل الكامل

## ${mod.english}

> Generated: ${generatedAt}

## 1. الملخص التنفيذي
${mod.summary}

## 2. نطاق الموديول
عدد الميزات داخل الموديول: **${rows.length}**.

| ID | English | Arabic | Folder |
|---|---|---|---|
${table(rows)}

## 3. التحليل من ناحية Business
${list(mod.business)}

## 4. التحليل من ناحية Logic / منطق التشغيل
${list(mod.logic)}

## 5. البيانات الأساسية المقترحة
${list(mod.data.map((item) => `\`${item}\``))}

## 6. الاعتماد على الموديولات الأخرى
${list(mod.dependencies)}

## 7. أهم المخاطر
${list(mod.risks)}

## 8. ترتيب التنفيذ المقترح
${list(mod.priority.map((item, index) => `${index + 1}. ${item}`))}

## 9. Mermaid Overview
\`\`\`mermaid
${mermaid(rows)}
\`\`\`

## 10. نقاط الضعف التفصيلية
راجع فهرس نقاط الضعف داخل الموديول:

[WEAKNESSES_INDEX.md](WEAKNESSES_INDEX.md)

## 11. توصية التنفيذ
ابدأ بالميزات التي تمسك القواعد والبيانات الأساسية، ثم انتقل للواجهات والحالات الاستثنائية. لا تبدأ تنفيذ واجهة نهائية قبل تثبيت state machine وAPI contract وdata model لكل ميزة حرجة.
`;
}

function ensureReadmeLink(moduleDir, analysisName) {
  const readme = path.join(moduleDir, "README.md");
  if (!fs.existsSync(readme)) return;
  const content = read(readme);
  if (content.includes(analysisName)) return;
  const marker = "## القواعد المشتركة";
  const block = `## التحليل الكامل\n- [${analysisName}](${analysisName})\n\n`;
  const next = content.includes(marker) ? content.replace(marker, `${block}${marker}`) : `${content.trim()}\n\n${block}`;
  write(readme, next);
}

function main() {
  const indexRows = [];
  for (const [code, mod] of Object.entries(modules)) {
    const moduleDir = path.join(root, mod.folder);
    if (!fs.existsSync(moduleDir)) continue;
    const rows = featureRows(moduleDir);
    const analysisName = `${code}_FULL_ANALYSIS.md`;
    write(path.join(moduleDir, analysisName), analysisContent(mod, rows));
    ensureReadmeLink(moduleDir, analysisName);
    indexRows.push(`| ${code} | ${mod.title} | [${analysisName}](${mod.folder}/${analysisName}) |`);
  }

  const m01 = path.join(root, "M01_identity_access", "M01_FULL_ANALYSIS.md");
  const allRows = [`| M01 | M01 — إدارة الحسابات والوصول | [M01_FULL_ANALYSIS.md](M01_identity_access/M01_FULL_ANALYSIS.md) |`, ...indexRows];
  write(
    path.join(root, "ALL_MODULES_FULL_ANALYSIS_INDEX.md"),
    `# MealMate — All Modules Full Analysis Index

| Module | Name | Full Analysis |
|---|---|---|
${allRows.join("\n")}
`
  );

  console.log(`Generated ${indexRows.length} module analyses. M01 exists: ${fs.existsSync(m01)}`);
}

main();
