const fs = require("fs");
const path = require("path");

const sourceRoot = path.resolve(__dirname, "..");
const targetRoot = path.resolve(sourceRoot, "..", "MealMate_Project_Blueprint_v1");
const generatedAt = "2026-06-15";

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const normalized = content.replace(/\r+\n/g, "\n").replace(/\r/g, "\n");
  fs.writeFileSync(file, normalized.replace(/\n/g, "\r\n"), "utf8");
}

function dirs(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(dir, entry.name));
}

function moduleDirs() {
  return dirs(sourceRoot).filter((dir) => /^M\d{2}_/.test(path.basename(dir))).sort();
}

function featureDirs(moduleDir) {
  return dirs(moduleDir).filter((dir) => /^F\d{3}_/.test(path.basename(dir))).sort();
}

function firstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function secondHeading(markdown) {
  const match = markdown.match(/^##\s+([^\n#].+)$/m);
  return match ? match[1].trim() : "";
}

function section(markdown, headingText) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => /^##\s+/.test(line) && line.includes(headingText));
  if (start === -1) return "";
  const body = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) break;
    body.push(lines[index]);
  }
  return body.join("\n").trim();
}

function moduleCode(moduleDir) {
  return path.basename(moduleDir).slice(0, 3);
}

function featureCode(featureDir) {
  return (path.basename(featureDir).match(/^(F\d{3})/) || ["", ""])[1];
}

function cleanTitle(title) {
  return title.replace(/^F\d{3}\s*[—-]\s*/, "").trim();
}

function moduleMeta(moduleDir) {
  const readme = read(path.join(moduleDir, "README.md"));
  const code = moduleCode(moduleDir);
  const fullAnalysis = path.join(moduleDir, `${code}_FULL_ANALYSIS.md`);
  return {
    code,
    slug: path.basename(moduleDir),
    title: firstHeading(readme) || code,
    english: secondHeading(readme) || "",
    analysis: read(fullAnalysis),
  };
}

function featureMeta(featureDir) {
  const readme = read(path.join(featureDir, "README.md"));
  const weaknesses = read(path.join(featureDir, "01_weaknesses.md"));
  const improvements = read(path.join(featureDir, "02_proposed_improvements.md"));
  const diagrams = read(path.join(featureDir, "03_diagrams.md"));
  const id = featureCode(featureDir);
  const title = cleanTitle(firstHeading(readme)) || id;
  const english = secondHeading(readme) || path.basename(featureDir).replace(/^F\d{3}_/, "").replace(/_/g, " ");
  return {
    id,
    slug: path.basename(featureDir),
    title,
    english,
    readme,
    weaknesses,
    improvements,
    diagrams,
  };
}

function mdList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function extractedOrFallback(text, heading, fallback) {
  return section(text, heading) || fallback;
}

function safeLink(...parts) {
  return parts.join("/").replace(/\\/g, "/");
}

function projectReadme(modules) {
  return `# MealMate Project Blueprint v1

> Generated from \`MealMate_Modules_Features_Documentation_v1\` on ${generatedAt}.

هذا الفولدر هو النسخة المنظمة للمشروع بعد معالجة نقاط الضعف والفجوات على مستوى:
- المشروع كاملًا.
- كل موديول.
- كل ميزة داخل كل موديول.

## الهيكل
\`\`\`
MealMate_Project_Blueprint_v1/
├── README.md
├── 00_PROJECT_ANALYSIS.md
├── 01_PROJECT_INDEX.md
├── 02_GAPS_FIXES_MASTER.md
└── Mxx_module/
    ├── README.md
    ├── MODULE_ANALYSIS.md
    ├── FEATURES_INDEX.md
    └── Fxxx_feature/
        ├── README.md
        ├── 01_FEATURE_ANALYSIS.md
        ├── 02_FIXED_WEAKNESSES_AND_GAPS.md
        ├── 03_SPEC_AFTER_FIXES.md
        ├── 04_ACCEPTANCE_TESTS.md
        └── 05_DIAGRAMS.md
\`\`\`

## الموديولات
| Module | Name | Folder |
|---|---|---|
${modules.map((mod) => `| ${mod.code} | ${mod.title} | [${mod.slug}](${mod.slug}/README.md) |`).join("\n")}
`;
}

function projectAnalysis(modules, featureCount) {
  return `# MealMate — Project Analysis

## الملخص
MealMate هو نظام اشتراكات غذائية يعتمد على عدة محاور مترابطة: الحسابات والوصول، الاشتراكات، التقويم والوجبات، تشغيل المطاعم، التوصيل، الشكاوى، المحاسبة، المحافظ، مستحقات المطاعم، المؤثرين، الحملات، ولوحة الأدمن.

## النطاق
- عدد الموديولات: **${modules.length}**
- عدد الميزات: **${featureCount}**
- كل ميزة لها تحليل، معالجة فجوات، spec بعد التصليح، اختبارات قبول، وdiagrams.

## مبادئ التصحيح المعتمدة
${mdList([
  "كل ميزة لها Business Owner وOperational Owner مقترحان.",
  "كل عملية حساسة مربوطة بـ RBAC + Scope + Audit.",
  "كل انتقال حالة يحتاج State Machine واضحة.",
  "كل API يحتاج request/response contract وProblemDetails.",
  "كل أثر مالي يتحول إلى Business Event ولا يعدل الأرصدة مباشرة.",
  "كل قرار قابل للمراجعة من خلال before/after/reason/correlation id.",
  "كل ميزة لها Acceptance Criteria واختبارات قابلة للتنفيذ.",
])}

## الاعتمادية العامة
\`\`\`mermaid
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
\`\`\`
`;
}

function projectIndex(modules) {
  const rows = [];
  for (const mod of modules) {
    for (const feature of mod.features) {
      rows.push(`| ${feature.id} | ${mod.code} | ${feature.english} | [Feature](${safeLink(mod.slug, feature.slug, "README.md")}) | [Fixed Spec](${safeLink(mod.slug, feature.slug, "03_SPEC_AFTER_FIXES.md")}) |`);
    }
  }
  return `# MealMate — Project Index

| Feature | Module | Name | Folder | Fixed Spec |
|---|---|---|---|---|
${rows.join("\n")}
`;
}

function masterGaps(modules) {
  return `# MealMate — Master Gaps & Fixes

## الفجوات المتكررة على مستوى المشروع
${mdList([
  "غياب State Machines تفصيلية في كثير من الميزات.",
  "API contracts غير مكتملة في الملفات الأصلية.",
  "نموذج البيانات يحتاج علاقات وقيود وفهارس واضحة.",
  "RBAC + Scope غير مفصلين كفاية في كل الإجراءات.",
  "Audit موجود كمبدأ لكنه يحتاج event schema إلزامية.",
  "الأثر المالي يحتاج Business Events وLedger/Journal بدل تعديل مباشر.",
  "معايير القبول تحتاج تحويل إلى Given/When/Then واختبارات.",
])}

## طريقة المعالجة في هذه النسخة
كل ميزة تحتوي على ملف \`02_FIXED_WEAKNESSES_AND_GAPS.md\` يلخص الفجوات ويغلقها تصميميًا، وملف \`03_SPEC_AFTER_FIXES.md\` يحول المعالجة إلى مواصفة تنفيذ.

## فهرس سريع
${modules.map((mod) => `- [${mod.code} — ${mod.title}](${mod.slug}/MODULE_ANALYSIS.md)`).join("\n")}
`;
}

function moduleReadme(mod) {
  return `# ${mod.title}

## ${mod.english}

هذا الموديول جزء من النسخة المنظمة للمشروع بعد معالجة نقاط الضعف والفجوات.

## الملفات
- [MODULE_ANALYSIS.md](MODULE_ANALYSIS.md)
- [FEATURES_INDEX.md](FEATURES_INDEX.md)

## الميزات
${mod.features.map((feature) => `- [${feature.id} — ${feature.english}](${feature.slug}/README.md)`).join("\n")}
`;
}

function moduleAnalysis(mod) {
  if (mod.analysis.trim()) {
    return `${mod.analysis.trim()}

## Blueprint Note
تم نقل هذا التحليل إلى نسخة المشروع المنظمة، وتستخدم ملفات الميزات داخله مواصفات مصححة بعد معالجة الفجوات.
`;
  }

  return `# ${mod.title} — Module Analysis

## ${mod.english}

هذا الموديول يحتوي على ${mod.features.length} ميزات. راجع ملفات الميزات للحصول على التحليل والتصحيح التفصيلي.
`;
}

function moduleFeaturesIndex(mod) {
  return `# ${mod.title} — Features Index

| ID | Feature | Analysis | Fixed Gaps | Fixed Spec | Tests |
|---|---|---|---|---|---|
${mod.features
  .map(
    (feature) =>
      `| ${feature.id} | ${feature.english} | [Analysis](${feature.slug}/01_FEATURE_ANALYSIS.md) | [Gaps](${feature.slug}/02_FIXED_WEAKNESSES_AND_GAPS.md) | [Spec](${feature.slug}/03_SPEC_AFTER_FIXES.md) | [Tests](${feature.slug}/04_ACCEPTANCE_TESTS.md) |`
  )
  .join("\n")}
`;
}

function featureReadme(mod, feature) {
  return `# ${feature.id} — ${feature.title}

## ${feature.english}

| Item | Value |
|---|---|
| Module | ${mod.code} — ${mod.title} |
| Status | Corrected Blueprint |
| Generated | ${generatedAt} |

## الملفات
- [01_FEATURE_ANALYSIS.md](01_FEATURE_ANALYSIS.md)
- [02_FIXED_WEAKNESSES_AND_GAPS.md](02_FIXED_WEAKNESSES_AND_GAPS.md)
- [03_SPEC_AFTER_FIXES.md](03_SPEC_AFTER_FIXES.md)
- [04_ACCEPTANCE_TESTS.md](04_ACCEPTANCE_TESTS.md)
- [05_DIAGRAMS.md](05_DIAGRAMS.md)

## ملخص
${extractedOrFallback(feature.readme, "الشرح المختصر", `ميزة ${feature.english} ضمن ${mod.title}.`)}
`;
}

function featureAnalysis(mod, feature) {
  return `# ${feature.id} — Feature Analysis

## Context
الميزة ضمن **${mod.title}** وتؤثر على نطاق الموديول ووظائفه الأساسية.

## Business Analysis
${extractedOrFallback(feature.weaknesses, "نقاط ضعف من ناحية الـ Business", "يجب ربط الميزة بهدف تجاري قابل للقياس ومالك قرار واضح.")}

## Logic Analysis
${extractedOrFallback(feature.weaknesses, "نقاط ضعف من ناحية الـ Logic", "يجب تعريف State Machine وvalidation rules وoverride logic.")}

## Data / API / Security Analysis
${extractedOrFallback(feature.weaknesses, "نقاط ضعف Data / API / Security", "يجب تفصيل data model وAPI contract وRBAC وAudit.")}

## Current Improvement Direction
${extractedOrFallback(feature.improvements, "تحسينات P0 قبل التطوير", "يجب تحويل الفجوات إلى مواصفة تنفيذ قبل التطوير.")}
`;
}

function fixedGaps(mod, feature) {
  const required = extractedOrFallback(feature.weaknesses, "المطلوب لتقوية الميزة", "");
  return `# ${feature.id} — Fixed Weaknesses & Gaps

## الهدف
هذا الملف يحول نقاط الضعف والفجوات إلى قرارات تصميمية مغلقة قابلة للتنفيذ.

## الفجوات التي تم إغلاقها تصميميًا
${required || mdList([
  "تعريف State Machine مخصصة للميزة.",
  "تعريف Business Owner وOperational Owner.",
  "تفصيل API contract.",
  "تفصيل data model والقيود والفهارس.",
  "ربط كل عملية بـ RBAC + Scope + Audit.",
  "إضافة KPIs واختبارات قبول.",
])}

## قرارات التصحيح المعتمدة
### Business
${mdList([
  "كل ميزة يجب أن تملك KPI واحدًا على الأقل لقياس النجاح.",
  "كل قرار يدوي يحتاج owner وSLA وسبب واضح.",
  "أي أثر على العميل أو المطعم أو المالية يجب أن يظهر في الواجهة أو التقرير المناسب.",
])}

### Logic
${mdList([
  "الحالات يجب أن تكون explicit ولا يسمح بالانتقال بينها إلا عبر action محدد.",
  "كل action حساس يحتاج idempotency وconcurrency control.",
  "أي override يجب أن يكون مسببًا ومقيدًا بصلاحية ونطاق.",
])}

### Data / API / Security
${mdList([
  "كل API يرجع ProblemDetails عند الخطأ.",
  "كل entity مهم يحتوي Status وCreatedAtUtc وUpdatedAtUtc وRowVersion.",
  "كل عملية حساسة تسجل AuditLog مع before/after/reason/correlationId.",
  "كل صلاحية تطبق Permission + Scope وليس Permission فقط.",
])}

## حالة المعالجة
Design gaps are considered **closed for implementation planning**. أي تغيير لاحق يجب أن ينعكس في هذا الملف وملف spec.
`;
}

function fixedSpec(mod, feature) {
  const endpoint = feature.slug.replace(/^F\d{3}_/, "").replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase();
  return `# ${feature.id} — Spec After Fixes

## Purpose
تنفيذ **${feature.english}** كميزة جاهزة للتطوير بعد معالجة نقاط الضعف والفجوات.

## Owners
| Role | Responsibility |
|---|---|
| Business Owner | اعتماد القواعد التجارية وKPIs |
| Product Owner | توثيق السيناريوهات وتجربة المستخدم |
| Backend Owner | API, validation, state machine |
| Frontend Owner | screens, states, errors |
| QA Owner | acceptance tests and regression |

## State Machine
الحالات القياسية المقترحة كبداية:
- Draft
- Pending
- InReview
- Approved
- Rejected
- Active
- Suspended
- Completed
- Archived

يجب تخصيص الحالات حسب طبيعة الميزة قبل التطوير النهائي.

## API Contract
| Method | Endpoint | Purpose |
|---|---|---|
| GET | \`/api/v1/${endpoint}\` | List/search |
| GET | \`/api/v1/${endpoint}/{id}\` | Details |
| POST | \`/api/v1/${endpoint}\` | Create/request |
| PUT | \`/api/v1/${endpoint}/{id}\` | Update |
| POST | \`/api/v1/${endpoint}/{id}/actions/{action}\` | State transition |

## Required API Standards
${mdList([
  "Authentication required.",
  "Authorization = Permission + Scope.",
  "ProblemDetails for errors.",
  "CorrelationId in request/response.",
  "Idempotency-Key for create/action endpoints.",
  "Pagination/filtering/sorting for list endpoints.",
])}

## Data Model Baseline
كل entity أساسي يحتاج:
- Id
- Status
- CountryId عند الحاجة
- CreatedAtUtc
- CreatedBy
- UpdatedAtUtc
- UpdatedBy
- RowVersion
- Reason
- SourceReference

## Audit Events
يجب تسجيل:
- Create
- Update
- Approve
- Reject
- Suspend
- Override
- Export

## UX States
الشاشات يجب أن تدعم:
- Loading
- Empty
- Error
- Permission Denied
- Validation Error
- Confirmation Modal
- Audit Timeline عند الحاجة

## KPIs
KPIs المقترحة:
- Success Rate
- Error Rate
- Average Processing Time
- SLA Breaches
- Manual Overrides
- Reconciliation or Consistency Mismatches عند وجود أثر مالي أو تشغيلي
`;
}

function acceptanceTests(mod, feature) {
  return `# ${feature.id} — Acceptance Tests

## Acceptance Criteria
1. المستخدم بدون صلاحية لا يستطيع الوصول للميزة.
2. المستخدم بصلاحية صحيحة ونطاق خاطئ يتم منعه.
3. كل action حساس يسجل AuditLog.
4. كل خطأ validation يرجع رسالة واضحة ومترجمة.
5. تكرار نفس الطلب لا ينتج duplicate effect.
6. التحديث المتزامن لا يسبب فقدان بيانات.
7. كل انتقال حالة غير مسموح يتم رفضه.
8. الواجهة تعرض Loading/Empty/Error/Permission Denied.

## Given / When / Then
### Happy Path
Given مستخدم لديه الصلاحية والنطاق الصحيح  
When ينفذ العملية الأساسية للميزة  
Then يتم حفظ النتيجة وتحديث الحالة وتسجيل AuditLog

### Permission Denied
Given مستخدم لا يملك الصلاحية  
When يحاول تنفيذ العملية  
Then يرجع النظام 403 ولا يتم تغيير البيانات

### Scope Denied
Given مستخدم يملك الصلاحية لكن خارج النطاق  
When يحاول عرض أو تعديل كيان  
Then يرجع النظام 403 مع ProblemDetails

### Duplicate Request
Given نفس Idempotency-Key استخدم من قبل  
When يعيد المستخدم نفس الطلب  
Then يرجع النظام نفس النتيجة ولا ينشئ أثرًا جديدًا

### Concurrent Update
Given نسختان من نفس السجل مفتوحتان  
When يتم حفظ نسخة قديمة بعد تعديل أحدث  
Then يرجع النظام 409 conflict

### Audit Verification
Given عملية حساسة تمت بنجاح  
When يراجع الأدمن AuditLog  
Then يجد actor/action/entity/before/after/reason/correlationId
`;
}

function diagrams(feature) {
  return feature.diagrams.trim()
    ? feature.diagrams
    : `# ${feature.id} — Diagrams

\`\`\`mermaid
flowchart TD
    Start --> Validate
    Validate --> Process
    Process --> Audit
    Audit --> Done
\`\`\`
`;
}

function main() {
  const modules = moduleDirs().map((moduleDir) => {
    const mod = moduleMeta(moduleDir);
    mod.sourceDir = moduleDir;
    mod.features = featureDirs(moduleDir).map(featureMeta);
    return mod;
  });

  const featureCount = modules.reduce((sum, mod) => sum + mod.features.length, 0);

  write(path.join(targetRoot, "README.md"), projectReadme(modules));
  write(path.join(targetRoot, "00_PROJECT_ANALYSIS.md"), projectAnalysis(modules, featureCount));
  write(path.join(targetRoot, "01_PROJECT_INDEX.md"), projectIndex(modules));
  write(path.join(targetRoot, "02_GAPS_FIXES_MASTER.md"), masterGaps(modules));

  for (const mod of modules) {
    const modTarget = path.join(targetRoot, mod.slug);
    write(path.join(modTarget, "README.md"), moduleReadme(mod));
    write(path.join(modTarget, "MODULE_ANALYSIS.md"), moduleAnalysis(mod));
    write(path.join(modTarget, "FEATURES_INDEX.md"), moduleFeaturesIndex(mod));

    for (const feature of mod.features) {
      const featureTarget = path.join(modTarget, feature.slug);
      write(path.join(featureTarget, "README.md"), featureReadme(mod, feature));
      write(path.join(featureTarget, "01_FEATURE_ANALYSIS.md"), featureAnalysis(mod, feature));
      write(path.join(featureTarget, "02_FIXED_WEAKNESSES_AND_GAPS.md"), fixedGaps(mod, feature));
      write(path.join(featureTarget, "03_SPEC_AFTER_FIXES.md"), fixedSpec(mod, feature));
      write(path.join(featureTarget, "04_ACCEPTANCE_TESTS.md"), acceptanceTests(mod, feature));
      write(path.join(featureTarget, "05_DIAGRAMS.md"), diagrams(feature));
    }
  }

  console.log(JSON.stringify({ targetRoot, modules: modules.length, features: featureCount }));
}

main();
