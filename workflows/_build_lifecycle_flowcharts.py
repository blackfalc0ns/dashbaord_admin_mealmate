"""Generate detailed self-contained lifecycle flowcharts per role."""
import glob
import importlib.util
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(BASE, "00_index_overview.md")

_spec = importlib.util.spec_from_file_location(
    "screen_fc", os.path.join(BASE, "_build_screen_flowcharts.py")
)
screen_fc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(screen_fc)

ROLE_META = {
    "admin": ("الأدمن", "Super Admin / Country Admin — Angular", "لوحة"),
    "customer": ("العميل", "Flutter — تطبيق موبايل", "شاشة"),
    "restaurant": ("المطعم", "Angular — لوحة ويب", "لوحة"),
    "driver": ("المندوب", "Flutter — تطبيق توصيل", "شاشة"),
}

UI_WORD = {
    "admin": "لوحة",
    "customer": "شاشة",
    "restaurant": "لوحة",
    "driver": "شاشة",
}

from _lifecycle_phases import LIFECYCLES  # noqa: E402


def clean_f_refs(text: str) -> str:
    """Remove internal F01-style references from user-facing text."""
    text = re.sub(r"\s*\(F\d+(?:,\s*F\d+)*\)", "", text)
    text = re.sub(r"\s*\(F\d+–F\d+(?:,\s*F\d+–F\d+)*\)", "", text)
    text = re.sub(r"\bF\d+\b", "", text)
    text = re.sub(r"F\d+–F\d+", "", text)
    text = re.sub(r"\(\s*راجع\s*\)", "", text)
    text = re.sub(r"راجع\s*\(\s*\)", "", text)
    text = re.sub(r"\s{2,}", " ", text)
    text = re.sub(r"\(\s*\)", "", text)
    return text.strip(" .،;")


def phase_features(phase: dict, features_map: dict) -> list[dict]:
    out = []
    for fid in phase["feature_ids"]:
        if fid in features_map:
            out.append(features_map[fid])
        else:
            out.append(
                {
                    "fid": fid,
                    "title": "(غير متوفر لهذا الدور)",
                    "goal": "",
                    "screens": [],
                    "workflow_steps": [],
                    "exceptions": [],
                }
            )
    return out


def feature_titles_label(features: list[dict]) -> str:
    titles = [f["title"] for f in features if f["title"]]
    return " · ".join(titles) if titles else ""


def build_master_flowchart(lc: dict, features_map: dict) -> str:
    """Feature-level lifecycle with descriptive names (no F-codes)."""
    lines = ["```mermaid", "flowchart TB"]
    phase_last_nodes = []
    phase_first_nodes = []

    for ph in lc["phases"]:
        pid = ph["id"]
        feats = phase_features(ph, features_map)
        phase_title = screen_fc.mermaid_safe(ph["title"])
        lines.append(f'  subgraph {pid}["{phase_title}"]')
        feat_ids = []
        for i, feat in enumerate(feats):
            sid = f"{pid}_feat{i+1}"
            feat_ids.append(sid)
            label = screen_fc.mermaid_safe(feat["title"][:55])
            lines.append(f'    {sid}["{label}"]')
        for i in range(len(feat_ids) - 1):
            lines.append(f"    {feat_ids[i]} --> {feat_ids[i+1]}")
        lines.append("  end")
        if feat_ids:
            phase_first_nodes.append(feat_ids[0])
            phase_last_nodes.append(feat_ids[-1])

    for i in range(len(phase_last_nodes) - 1):
        lines.append(f"  {phase_last_nodes[i]} --> {phase_first_nodes[i+1]}")

    lf, lt, ll = lc.get("loop_from"), lc.get("loop_to"), lc.get("loop_label", "")
    if lf and lt and phase_last_nodes and phase_first_nodes:
        lf_idx = next((i for i, ph in enumerate(lc["phases"]) if ph["id"] == lf), None)
        lt_idx = next((i for i, ph in enumerate(lc["phases"]) if ph["id"] == lt), None)
        if lf_idx is not None and lt_idx is not None:
            lines.append(
                f"  {phase_last_nodes[lf_idx]} -->|{screen_fc.mermaid_safe(ll)}| "
                f"{phase_first_nodes[lt_idx]}"
            )

    lines.append("```")
    return "\n".join(lines)


def build_full_lifecycle_screen_flowchart(lc: dict, features_map: dict) -> str:
    """All screens chained across every phase — the detailed lifecycle path."""
    lines = ["```mermaid", "flowchart TD"]
    prev_last = None

    for ph in lc["phases"]:
        feats = phase_features(ph, features_map)
        pid = ph["id"]

        for feat in feats:
            screens = feat["screens"]
            if not screens:
                sid = f"{pid}_{feat['fid'].lower()}_x"
                label = screen_fc.mermaid_safe(feat["title"][:40])
                lines.append(f'  {sid}["{label}"]')
                if prev_last:
                    lines.append(f"  {prev_last} --> {sid}")
                prev_last = sid
                continue

            screen_ids = []
            for i, sc in enumerate(screens):
                sid = f"{pid}_{feat['fid'].lower()}_s{i+1}"
                screen_ids.append(sid)
                label = screen_fc.mermaid_safe(sc["name"][:50])
                lines.append(f'  {sid}["{label}"]')
            for i in range(len(screen_ids) - 1):
                lines.append(f"  {screen_ids[i]} --> {screen_ids[i+1]}")
            if prev_last and screen_ids:
                lines.append(f"  {prev_last} --> {screen_ids[0]}")
            prev_last = screen_ids[-1] if screen_ids else prev_last

    lines.append("```")
    return "\n".join(lines)


def build_master_detail_text(lc: dict, features_map: dict, ui_plural: str) -> str:
    """Numbered text breakdown for section 1 — no file codes."""
    parts = ["### تفاصيل دورة الحياة (نص)\n\n"]
    step_num = 1
    for i, ph in enumerate(lc["phases"], 1):
        feats = phase_features(ph, features_map)
        titles = feature_titles_label(feats)
        screen_count = sum(len(f["screens"]) for f in feats)
        parts.append(f"#### المرحلة {i}: **{ph['title']}**\n\n")
        if titles:
            parts.append(f"**الميزات:** {titles}\n\n")
        parts.append(f"**عدد {ui_plural}:** {screen_count}\n\n")
        parts.append("**الخطوات الرئيسية:**\n\n")
        for s in ph["summary"]:
            parts.append(f"{step_num}. {clean_f_refs(s)}\n")
            step_num += 1
        parts.append("\n**{0} في هذه المرحلة:**\n\n".format(ui_plural.capitalize()))
        for feat in feats:
            if not feat["screens"]:
                continue
            parts.append(f"- **{feat['title']}:** ")
            names = [sc["name"] for sc in feat["screens"]]
            parts.append(" → ".join(names) + "\n")
        parts.append("\n")
    return "".join(parts)


def parse_feature_full(path: str, ui_word: str) -> dict:
    feat = screen_fc.parse_feature(path, ui_word)
    with open(path, encoding="utf-8") as f:
        text = f.read()
    steps_raw = screen_fc.section(text, "خطوات الـ Workflow")
    steps = []
    for line in steps_raw.splitlines():
        line = line.strip()
        m = re.match(r"^\d+\.\s+(.+)$", line)
        if m:
            steps.append(m.group(1))
    exceptions = screen_fc.section(text, "الحالات والاستثناءات")
    exc_items = []
    for line in exceptions.splitlines():
        line = line.strip()
        if line.startswith("- "):
            exc_items.append(line[2:].strip())
    feat["workflow_steps"] = steps
    feat["exceptions"] = exc_items
    return feat


def load_role_features(role: str) -> dict[str, dict]:
    ui_word = UI_WORD[role]
    folder = os.path.join(BASE, role)
    out = {}
    for fp in glob.glob(os.path.join(folder, "F*.md")):
        feat = parse_feature_full(fp, ui_word)
        out[feat["fid"]] = feat
    return out


def build_phase_overview_flowchart(phase: dict, features: list[dict]) -> str:
    if not features:
        return "```mermaid\nflowchart TD\n  empty[لا توجد ميزات]\n```"

    pid = phase["id"]
    lines = ["```mermaid", "flowchart TD"]
    prev_last = None

    for feat in features:
        fid = feat["fid"].lower()
        screens = feat["screens"]
        if not screens:
            sid = f"{pid}_{fid}_empty"
            label = screen_fc.mermaid_safe(f"{feat['fid']} {feat['title'][:30]}")
            lines.append(f'  {sid}["{label}"]')
            if prev_last:
                lines.append(f"  {prev_last} --> {sid}")
            prev_last = sid
            continue

        feat_ids = []
        for i, sc in enumerate(screens):
            sid = f"{pid}_{fid}_s{i+1}"
            feat_ids.append(sid)
            label = screen_fc.mermaid_safe(sc["name"][:50])
            lines.append(f'  {sid}["{label}"]')
        for i in range(len(feat_ids) - 1):
            lines.append(f"  {feat_ids[i]} --> {feat_ids[i+1]}")
        if prev_last and feat_ids:
            lines.append(f"  {prev_last} --> {feat_ids[0]}")
        prev_last = feat_ids[-1] if feat_ids else prev_last

    lines.append("```")
    return "\n".join(lines)


def build_daily_loop(role: str) -> str | None:
    loops = {
        "customer": """```mermaid
flowchart LR
  cal[التقويم] --> pick[اختيار بوكس]
  pick --> h72{قبل 72h?}
  h72 -->|نعم| ok[مؤكد]
  h72 -->|لا| auto[اختيار تلقائي]
  ok --> deliver[توصيل]
  auto --> deliver
  deliver --> rate[تقييم]
  rate --> cal
```""",
        "restaurant": """```mermaid
flowchart LR
  orders[طلبات] --> print[طباعة فواتير/باركود]
  print --> prep[تحضير]
  prep --> hand[تسليم مندوب]
  hand --> orders
```""",
        "driver": """```mermaid
flowchart LR
  online[Online] --> pickup[استلام]
  pickup --> route[توصيل]
  route --> deliver[تسليم]
  deliver --> online
```""",
        "admin": """```mermaid
flowchart LR
  monitor[مراقبة] --> h72[قفل 72h]
  h72 --> dispatch[فواتير]
  dispatch --> support[شكاوى]
  support --> monitor
```""",
    }
    return loops.get(role)


def render_feature_block(feat: dict, ui_plural: str) -> str:
    parts = [
        f"#### **{feat['title']}**\n\n",
        f"**الهدف:** {feat['goal']}\n\n",
        "**Flowchart:**\n\n",
        screen_fc.mermaid_screen_flow(feat),
        "\n\n",
        f"**{ui_plural} — العنوان والمحتويات:**\n\n",
        screen_fc.render_screens_detail(feat["screens"]),
    ]
    if feat.get("workflow_steps"):
        parts.append("**خطوات Workflow:**\n\n")
        for i, step in enumerate(feat["workflow_steps"], 1):
            parts.append(f"{i}. {clean_f_refs(step)}\n")
        parts.append("\n")
    if feat.get("exceptions"):
        parts.append("**حالات واستثناءات:**\n\n")
        for i, ex in enumerate(feat["exceptions"][:8], 1):
            parts.append(f"{i}. {clean_f_refs(ex)}\n")
        parts.append("\n")
    return "".join(parts)


def load_shared_rules() -> str:
    with open(INDEX, encoding="utf-8") as f:
        index = f.read()
    m = re.search(r"(## 4\. القواعد المشتركة.*?)(?=\n---\n\n## 5\.)", index, re.S)
    if not m:
        return ""
    return m.group(1).strip()


def render_lifecycle_md(role: str, ar: str, platform: str, ui_plural: str) -> str:
    lc = LIFECYCLES[role]
    features_map = load_role_features(role)
    total_screens = 0
    total_features = 0

    parts = [
        f"# {ar} — Lifecycle Flowcharts (تفصيلي)\n\n",
        f"> **الدور:** {ar} | **المنصة:** {platform}\n\n",
        "> **ملف مستقل كامل** — دورة حياة + flowcharts + شاشات/لوحات + خطوات workflow + قواعد.\n\n",
        "> افتح **Preview** (`Ctrl+Shift+V`) لرؤية Mermaid.\n\n",
        "---\n\n",
        "## 1. دورة الحياة الكاملة\n\n",
        "### 1.1 خريطة الميزات (Flowchart)\n\n",
        build_master_flowchart(lc, features_map),
        "\n\n",
        "### 1.2 مسار الشاشات/اللوحات الكامل (Flowchart)\n\n",
        build_full_lifecycle_screen_flowchart(lc, features_map),
        "\n\n",
        build_master_detail_text(lc, features_map, ui_plural),
        "\n---\n\n",
    ]

    daily = build_daily_loop(role)
    if daily:
        parts.extend(["## 2. الحلقة التشغيلية\n\n", daily, "\n\n---\n\n"])

    parts.append("## 3. تفاصيل المراحل (Flowcharts + شاشات + Workflow)\n\n")

    for i, ph in enumerate(lc["phases"], 1):
        phase_feats = phase_features(ph, features_map)
        phase_screens = sum(len(f["screens"]) for f in phase_feats)
        total_screens += phase_screens
        total_features += len(phase_feats)
        titles = feature_titles_label(phase_feats)

        parts.append(
            f"### المرحلة {i}: **{ph['title']}** "
            f"— {len(phase_feats)} ميزة | {phase_screens} {ui_plural}\n\n"
        )
        if titles:
            parts.append(f"**الميزات:** {titles}\n\n")
        parts.append("#### ملخص المرحلة\n\n")
        for j, s in enumerate(ph["summary"], 1):
            parts.append(f"{j}. {clean_f_refs(s)}\n")
        parts.append("\n")
        parts.append("#### Flowchart شامل للمرحلة\n\n")
        parts.append(build_phase_overview_flowchart(ph, phase_feats))
        parts.append("\n\n#### تفاصيل كل ميزة\n\n")
        for feat in phase_feats:
            parts.append(render_feature_block(feat, ui_plural))
        parts.append("---\n\n")

    parts.append("## 4. معادلات أساسية\n\n")
    parts.append(
        "- **متوسط القروب (غير تراكمي):** Basic من Basic فقط | Platinum من Platinum فقط (بدون Basic) | Elite من Elite فقط\n"
        "- **متوسط البوكس** = متوسط القروب (لتصنيف الاشتراك) ÷ 26\n"
        "- **commission** = max − ((max−min)/25)×(days−1) · إذا days≥26 → min\n"
        "- **سعر العميل** = (متوسط البوكس × أيام) × (1 + commission/100)\n"
        "- **كوتا** = ⌈أيام ÷ عدد المطاعم المتاحة للاختيار⌉\n"
        "- **استرداد** = (سعر ÷ أيام) × (متبقي − 2)\n"
        "- **صافي المطعم** = سعر البوكس − (سعر × % عمولة)\n\n"
    )

    shared = load_shared_rules()
    if shared:
        parts.append("---\n\n## 5. القواعد المشتركة\n\n")
        parts.append(re.sub(r"^## 4\.[^\n]*\n+", "", shared, count=1))
        parts.append("\n\n")

    parts.append(
        f"> **إحصائيات:** {total_features} ميزة | {total_screens} {ui_plural}\n\n"
        "> `python workflows/_build_lifecycle_flowcharts.py`\n"
    )
    text = "".join(parts)
    text = re.sub(r"\bF\d+\b", "", text)
    text = re.sub(r"\(\s*راجع\s*\)", "", text)
    text = re.sub(r"  +", " ", text)
    return text


def main():
    for role, (ar, platform, ui_plural_word) in ROLE_META.items():
        ui_plural = "شاشات" if ui_plural_word == "شاشة" else "لوحات"
        text = render_lifecycle_md(role, ar, platform, ui_plural)
        out = os.path.join(BASE, role, "00_lifecycle_flowcharts.md")
        with open(out, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"{role}: {out} ({len(text):,} chars)")


if __name__ == "__main__":
    main()
