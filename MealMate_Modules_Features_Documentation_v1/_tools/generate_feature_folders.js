const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const generatedAt = "2026-06-15";

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const normalized = content.replace(/\r+\n/g, "\n").replace(/\r/g, "\n");
  fs.writeFileSync(file, normalized.replace(/\n/g, "\r\n"), "utf8");
}

function listModuleDirs() {
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^M\d{2}_/.test(entry.name))
    .map((entry) => path.join(root, entry.name))
    .sort();
}

function featureFiles(moduleDir) {
  return fs
    .readdirSync(moduleDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^F\d{3}_.+\.md$/.test(entry.name))
    .map((entry) => path.join(moduleDir, entry.name))
    .sort();
}

function section(markdown, headingPart) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => /^##\s+/.test(line) && line.includes(headingPart));
  if (start === -1) return "";
  const body = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) break;
    body.push(lines[index]);
  }
  return body.join("\n").trim();
}

function compactLines(text, limit = 8) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("|---"))
    .slice(0, limit);
}

function firstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function secondHeading(markdown) {
  const match = markdown.match(/^##\s+([^\n#].+)$/m);
  return match ? match[1].trim() : "";
}

function field(markdown, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\|\\s*${escaped}\\s*\\|\\s*([^|]+?)\\s*\\|`);
  const match = markdown.match(re);
  return match ? match[1].replace(/`/g, "").trim() : "";
}

function moduleTitle(moduleDir) {
  const readme = path.join(moduleDir, "README.md");
  if (!fs.existsSync(readme)) return path.basename(moduleDir);
  const h1 = firstHeading(read(readme));
  return h1 || path.basename(moduleDir);
}

function mdList(lines, fallback = "- يحتاج استكمال.") {
  const clean = lines.filter(Boolean);
  return clean.length ? clean.join("\n") : fallback;
}

function slugToEndpoint(slug) {
  return slug
    .replace(/^F\d{3}_/, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function mermaidSafe(text) {
  return text.replace(/"/g, "'").replace(/\|/g, "/");
}

function buildReadme(meta) {
  const summary = compactLines(section(meta.markdown, "الملخص التنفيذي"), 4);
  const goals = compactLines(section(meta.markdown, "الهدف التجاري"), 8);
  const users = compactLines(section(meta.markdown, "المستخدمون"), 8);
  const scenario = compactLines(section(meta.markdown, "السيناريو الرئيسي"), 10);
  const rules = compactLines(section(meta.markdown, "قواعد العمل"), 10);
  const data = compactLines(section(meta.markdown, "البيانات"), 10);
  const apis = compactLines(section(meta.markdown, "APIs"), 10);

  return `# ${meta.id} — ${meta.arTitle}

## ${meta.enTitle}

> هذا الفولدر هو مساحة العمل التفصيلية للميزة. الملف الأصلي محفوظ كمرجع في: [${meta.sourceName}](../${meta.sourceName}).

## بطاقة سريعة
| البند | القيمة |
|---|---|
| Feature ID | \`${meta.id}\` |
| Module | ${meta.moduleName} |
| Source Type | ${meta.type || "غير محدد"} |
| Status | ${meta.status || "غير محدد"} |
| Generated | ${generatedAt} |

## الشرح المختصر
${mdList(summary)}

## الهدف
${mdList(goals)}

## المستخدمون والأطراف
${mdList(users)}

## السيناريو الرئيسي
${mdList(scenario)}

## قواعد العمل الأساسية
${mdList(rules)}

## البيانات والتكامل
### البيانات
${mdList(data)}

### APIs
${mdList(apis)}

## ملفات الفولدر
- [01_weaknesses.md](01_weaknesses.md): نقاط الضعف والمخاطر الحالية.
- [02_proposed_improvements.md](02_proposed_improvements.md): التحسينات المقترحة وخطة النضج.
- [03_diagrams.md](03_diagrams.md): Flowchart وSequence وState وData diagrams بصيغة Mermaid.
`;
}

function buildWeaknesses(meta) {
  const openDecisions = compactLines(section(meta.markdown, "قرارات مفتوحة"), 10);
  const edgeCases = compactLines(section(meta.markdown, "Edge Cases"), 10);
  const apis = compactLines(section(meta.markdown, "APIs"), 10);
  const data = compactLines(section(meta.markdown, "البيانات"), 10);

  return `# ${meta.id} — نقاط الضعف

## ملخص التقييم
التوثيق الحالي يعطي إطارًا جيدًا للميزة، لكنه ما زال أقرب إلى Draft قابل للمراجعة. أهم فجوة هي تحويل القواعد العامة إلى تفاصيل تنفيذ قابلة للاختبار والتسليم.

## نقاط الضعف الرئيسية
1. **تفاصيل API غير مكتملة**
   - الموجود حاليًا يحدد أسماء endpoints فقط، بدون request/response schema أو status codes أو validation errors.
   - endpoints الحالية:
${mdList(apis, "   - لا توجد endpoints موثقة بوضوح.")}

2. **نموذج البيانات يحتاج علاقات وقيود**
   - الكيانات مذكورة كأسماء، لكن العلاقات، المفاتيح، الفهارس، وقيود الحذف/الأرشفة غير محددة.
   - البيانات المذكورة:
${mdList(data, "   - لا توجد كيانات بيانات محددة.")}

3. **الحالات عامة أكثر من اللازم**
   - حالات مثل \`Pending\` و\`Active / Approved\` و\`Completed / Archived\` تحتاج State Machine واضحة تمنع الانتقالات الخاطئة.

4. **معايير القبول تحتاج صياغة قابلة للتنفيذ**
   - المعايير الحالية مفيدة، لكنها تحتاج Given/When/Then وسيناريوهات محددة لكل Role وScope.

5. **التعامل مع Edge Cases يحتاج قرارات**
   - الحالات الاستثنائية المذكورة:
${mdList(edgeCases, "   - لا توجد Edge Cases موثقة بوضوح.")}

6. **الأثر المالي والتدقيق يحتاجان Events واضحة**
   - أي أثر مالي يجب أن ينتج Business Event واضح، مع idempotency وربط محاسبي لا يسمح بتعديل الأرصدة يدويًا.

7. **الـ SLA والـ Ownership غير محسومين**
   - يجب تحديد من يملك القرار، من يعتمد الاستثناء، وما زمن الاستجابة المتوقع.

## القرارات المفتوحة
${mdList(openDecisions, "- لا توجد قرارات مفتوحة موثقة داخل الملف، لكن يلزم مراجعة Decision Log العام.")}

## أثر الضعف على التنفيذ
- زيادة احتمالية اختلاف تنفيذ الواجهة عن الـ Backend.
- صعوبة كتابة اختبارات دقيقة قبل التطوير.
- احتمالية ظهور استثناءات تشغيلية غير مغطاة بعد الإطلاق.
- صعوبة مراجعة الأثر المالي أو التدقيقي عند حدوث نزاع.
`;
}

function buildImprovements(meta) {
  const endpoint = slugToEndpoint(meta.slug);

  return `# ${meta.id} — التحسينات المقترحة

## الهدف من التحسين
تحويل الميزة من توثيق Product Draft إلى مواصفة تنفيذ احترافية تربط الواجهة، الـ Backend، البيانات، الصلاحيات، الاختبارات، والتشغيل.

## تحسينات P0 قبل التطوير
1. **تعريف State Machine**
   - تحديد كل حالة مسموحة.
   - تحديد الانتقالات المسموحة والممنوعة.
   - ربط كل انتقال بصلاحية وسبب وAudit Log.

2. **تفصيل API Contract**
   - إضافة schemas لكل endpoint:
     - \`GET /api/v1/${endpoint}\`
     - \`GET /api/v1/${endpoint}/{id}\`
     - \`POST /api/v1/${endpoint}\`
     - \`PUT /api/v1/${endpoint}/{id}\`
     - \`POST /api/v1/${endpoint}/{id}/actions/{action}\`
   - توثيق status codes: \`200\`, \`201\`, \`400\`, \`401\`, \`403\`, \`404\`, \`409\`, \`422\`, \`500\`.
   - اعتماد \`ProblemDetails\` للأخطاء و\`CorrelationId\` للتتبع.

3. **تفصيل صلاحيات Role/Scope**
   - ربط كل شاشة وكل endpoint بصلاحية مثل \`${meta.id}.View\`, \`${meta.id}.Create\`, \`${meta.id}.Update\`, \`${meta.id}.Override\`.
   - تحديد Scope حسب الدولة والمنطقة والكيان المرتبط.

4. **تعريف نموذج البيانات**
   - تحديد الجداول/الـ collections.
   - تحديد العلاقات، الفهارس، unique constraints، وretention policy.
   - إضافة \`RowVersion\` أو optimistic concurrency.

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
`;
}

function buildDiagrams(meta) {
  const endpoint = slugToEndpoint(meta.slug);
  const title = mermaidSafe(`${meta.id} ${meta.enTitle}`);
  const scenario = compactLines(section(meta.markdown, "السيناريو الرئيسي"), 6)
    .map((line) => line.replace(/^\d+\.\s*/, "").replace(/^-\s*/, ""))
    .filter(Boolean);
  const steps = scenario.length
    ? scenario
    : ["Open feature", "Load data and permissions", "Validate business rules", "Submit action", "Persist result", "Notify parties"];

  const flowNodes = steps
    .map((step, index) => `    S${index + 1}["${mermaidSafe(step)}"]`)
    .join("\n");
  const flowLinks = steps
    .slice(1)
    .map((_, index) => `    S${index + 1} --> S${index + 2}`)
    .join("\n");

  return `# ${meta.id} — Diagrams

> الرسومات بصيغة Mermaid ويمكن عرضها في GitHub أو أي محرر Markdown يدعم Mermaid.

## 1. Functional Flow
\`\`\`mermaid
flowchart TD
    Start(("Start ${title}"))
${flowNodes}
    Done(("Done"))
    Start --> S1
${flowLinks}
    S${steps.length} --> Done
\`\`\`

## 2. Sequence Diagram
\`\`\`mermaid
sequenceDiagram
    autonumber
    actor User as User / Actor
    participant UI as Web or Mobile UI
    participant API as ${meta.id} API
    participant Auth as Auth + Scope
    participant Domain as Domain Service
    participant DB as Database
    participant Audit as Audit Log
    participant Notify as Notifications

    User->>UI: Open ${mermaidSafe(meta.enTitle)}
    UI->>API: Request /api/v1/${endpoint}
    API->>Auth: Validate token, permission, scope
    Auth-->>API: Authorized
    API->>Domain: Execute business rules
    Domain->>DB: Read/write ${meta.id} data
    DB-->>Domain: Persisted state
    Domain->>Audit: Save before/after/reason
    Domain->>Notify: Send relevant notification
    Domain-->>API: Result
    API-->>UI: Success or ProblemDetails
    UI-->>User: Updated screen state
\`\`\`

## 3. State Diagram
\`\`\`mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: submit
    Pending --> Approved: approve
    Pending --> Rejected: reject
    Approved --> Active: activate
    Active --> Paused: pause/suspend
    Paused --> Active: resume
    Active --> Completed: complete
    Rejected --> Draft: revise
    Completed --> Archived: archive
    Archived --> [*]
\`\`\`

## 4. Data Relationship Draft
\`\`\`mermaid
classDiagram
    class ${meta.id}_Entity {
      +Id
      +Status
      +CountryId
      +CreatedAtUtc
      +UpdatedAtUtc
      +RowVersion
    }
    class User {
      +Id
      +Role
      +Scope
    }
    class AuditLog {
      +Action
      +Before
      +After
      +Reason
      +CorrelationId
    }
    class NotificationLog {
      +Channel
      +Template
      +Status
    }
    User --> ${meta.id}_Entity : creates/updates
    ${meta.id}_Entity --> AuditLog : records
    ${meta.id}_Entity --> NotificationLog : triggers
\`\`\`
`;
}

function parseFeature(file, moduleDir) {
  const markdown = read(file);
  const sourceName = path.basename(file);
  const slug = sourceName.replace(/\.md$/, "");
  const idMatch = sourceName.match(/^(F\d{3})_/);
  const id = idMatch ? idMatch[1] : field(markdown, "Feature ID") || slug;
  const h1 = firstHeading(markdown);
  const arTitle = h1.replace(/^F\d{3}\s*[—-]\s*/, "").trim() || slug;
  const enTitle = secondHeading(markdown) || slug.replace(/^F\d{3}_/, "").replace(/_/g, " ");

  return {
    id,
    slug,
    sourceName,
    markdown,
    arTitle,
    enTitle,
    type: field(markdown, "النوع"),
    status: field(markdown, "الحالة"),
    moduleName: moduleTitle(moduleDir),
  };
}

function generate() {
  const indexRows = [];
  for (const moduleDir of listModuleDirs()) {
    const moduleName = moduleTitle(moduleDir);
    const moduleRows = [];
    for (const file of featureFiles(moduleDir)) {
      const meta = parseFeature(file, moduleDir);
      const featureDir = path.join(moduleDir, meta.slug);
      write(path.join(featureDir, "README.md"), buildReadme(meta));
      write(path.join(featureDir, "01_weaknesses.md"), buildWeaknesses(meta));
      write(path.join(featureDir, "02_proposed_improvements.md"), buildImprovements(meta));
      write(path.join(featureDir, "03_diagrams.md"), buildDiagrams(meta));

      const moduleRel = path.relative(root, featureDir).replace(/\\/g, "/");
      indexRows.push(`| ${meta.id} | ${moduleName} | ${meta.enTitle} | [Folder](${moduleRel}/README.md) |`);
      moduleRows.push(`| ${meta.id} | ${meta.enTitle} | [Folder](${meta.slug}/README.md) | [Source](${meta.sourceName}) |`);
    }

    write(
      path.join(moduleDir, "FEATURE_FOLDERS_INDEX.md"),
      `# ${moduleName} — Feature Folders Index

| ID | Feature | Folder | Source |
|---|---|---|---|
${moduleRows.join("\n")}
`
    );
  }

  write(
    path.join(root, "FEATURE_FOLDERS_INDEX.md"),
    `# MealMate Feature Folders Index

تم توليد فولدر احترافي لكل Feature مع شرح، نقاط ضعف، تحسينات مقترحة، وDiagrams.

| ID | Module | Feature | Folder |
|---|---|---|---|
${indexRows.join("\n")}
`
  );

  console.log(`Generated ${indexRows.length} feature folders.`);
}

generate();
