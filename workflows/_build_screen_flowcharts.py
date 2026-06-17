"""Generate per-role Mermaid flowcharts in Markdown files."""
import glob
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))

ROLE_META = {
    "admin": ("الأدمن", "Angular — لوحة ويب", "لوحة"),
    "customer": ("العميل", "Flutter — تطبيق موبايل", "شاشة"),
    "restaurant": ("المطعم", "Angular — لوحة ويب", "لوحة"),
    "driver": ("المندوب", "Flutter — تطبيق توصيل", "شاشة"),
}

SCREEN_SECTIONS = (
    "الشاشات والعناصر",
    "لوحات الويب والعناصر",
    "الواجهات والعناصر",
)


def section(text: str, name: str) -> str:
    m = re.search(rf"## {re.escape(name)}\n(.*?)(?=\n## |\Z)", text, re.S)
    return m.group(1).strip() if m else ""


def short_title(full: str) -> str:
    t = full.replace("# ", "").strip()
    t = re.sub(r"^[^:]+:\s*", "", t, count=1)
    t = re.sub(r"^F\d+\s*:\s*", "", t)
    return t.strip()


def _clean_label(text: str) -> str:
    text = text.strip().strip("*").strip()
    return text.rstrip(":：").strip()


def _truncate_label(text: str, limit: int = 72) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= limit:
        return text
    cut = text[: limit - 1].rsplit(" ", 1)[0]
    return (cut or text[: limit - 1]).rstrip("،,;؛") + "…"


# Leading clauses to strip from plain Arabic workflow steps (admin/restaurant).
_STEP_VERB = (
    r"تأكد|عرّف|ضبط|راقب|تابع|حفظ|عدّل|راجع|تحقق|تخذ|منح|عيّن|خصّص|أضف|فعّل|عطّل|يلغي|حدد|يدير|فتح|نشئ"
    r"|ختار|ستقبل|دخل|غير|ضيف|حسب|ُظهر|عرض|طبع|سلّم|بلّغ"
)
_STEP_ACTOR = r"الأدمن|المطعم|العميل|المندوب|النظام|Super Admin|Country Admin"
_STEP_PREFIX = re.compile(
    rf"^(?:"
    rf"(?:ي(?:{_STEP_VERB}))\s+(?:أن\s+)?(?:فقط\s+)?(?:{_STEP_ACTOR})\s+"
    rf"|يتأكد\s+أن\s+(?:{_STEP_ACTOR})\s+"
    rf"|(?:ي(?:{_STEP_VERB}))\s+"
    rf"|(?:{_STEP_ACTOR})\s+"
    rf"|فتح\s+(?:شاشة\s+|قسم\s+)?"
    rf"|أو\s+"
    rf"|عند\s+"
    rf"|النظام\s+"
    rf")+",
    re.UNICODE,
)


def infer_step_label(step: str) -> str:
    """Derive a short panel/screen title from a plain workflow step sentence."""
    s = re.sub(r"\([^)]*\)", "", step)
    s = re.sub(r"\s+", " ", s).strip()
    first = re.split(r"[،,؛;]", s, maxsplit=1)[0].strip()

    cleaned = first
    for _ in range(8):
        nxt = _STEP_PREFIX.sub("", cleaned, count=1).strip()
        if nxt == cleaned or not nxt:
            break
        cleaned = nxt

    if len(cleaned) < 4:
        cleaned = first

    for sep in (" التي ", " التي ي", " لت", " بحيث ", " داخل ", " مع ", " → ", " بناءً "):
        idx = cleaned.find(sep)
        if idx > 12:
            cleaned = cleaned[:idx].strip()
            break

    cleaned = re.sub(r"^(?:فقط\s+)", "", cleaned)
    cleaned = re.sub(r"\s+و(?:يفعّلها|يُظهر|يحسب|يعيد|يمنع)\b.*$", "", cleaned).strip()
    if cleaned.startswith("المطعم ل"):
        cleaned = "إظهار " + cleaned
    elif cleaned.startswith("لعملاء"):
        cleaned = "إظهار المطعم " + cleaned
    cleaned = cleaned.strip(" .،,;؛")
    return _truncate_label(cleaned or first)


def extract_screen_name(step: str) -> tuple[str | None, bool]:
    """Return (label, explicit) — explicit=True when taken from marked UI references."""
    patterns = [
        r"«([^»]+)»",
        r'"([^"]+)"',
        r"(?:قسم|صفحة|قائمة|تبويب|لوحة|شاشة)\s+«([^»]+)»",
        r"صفحة\s+([^،.:]+)",
        r"قائمة\s+([^،.:]+)",
        r"تبويب\s+([^،.:]+)",
        r"لوحة\s+([^،.:]+)",
        r"شاشة\s+([^،.:]+)",
        r"\*\*([^*]+)\*\*",
    ]
    for pat in patterns:
        m = re.search(pat, step)
        if m:
            label = _clean_label(m.group(1).strip())
            if 2 < len(label) < 90:
                return label[:90], True

    if "：" in step or ":" in step:
        head = _clean_label(re.split(r"[:：]", step, maxsplit=1)[0])
        if 4 < len(head) < 90:
            return head, True

    inferred = infer_step_label(step)
    if 4 < len(inferred) < 90:
        return inferred, False
    return None, False


def split_items(text: str) -> list[str]:
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    text = re.sub(r"^\*\*\s*", "", text.strip())
    if not text:
        return []
    parts = re.split(r"[؛;]|(?:\s*،\s*)|(?:,\s*)|(?:\s*\+\s*)", text)
    out = [p.strip(" .") for p in parts if p.strip(" .")]
    return out[:12] if len(out) > 1 else ([text.strip(" .")] if text.strip(" .") else [])


def infer_screens(steps: list[str], prereq: str, ui_word: str) -> list[dict]:
    screens = []
    if prereq:
        inputs = []
        for line in prereq.splitlines():
            line = line.strip()
            if line.startswith("- "):
                inputs.append(line[2:].strip())
        if inputs:
            screens.append(
                {
                    "name": f"{ui_word} المتطلبات / المدخلات",
                    "items": inputs,
                    "inferred": True,
                }
            )

    for i, step in enumerate(steps, 1):
        name, explicit = extract_screen_name(step)
        if not name:
            name = f"{ui_word} — خطوة {i}"
        body = step
        if explicit and name in step:
            body = step.replace(f"«{name}»", "").replace(f'"{name}"', "")
            body = re.sub(r"\*\*" + re.escape(name) + r"\*\*", "", body)
            body = re.sub(r"\*\*" + re.escape(name) + r":\*\*", "", body)
            if "：" in step or ":" in step:
                body = re.split(r"[:：]", body, maxsplit=1)[-1].strip()
        items = split_items(body) if body else [step]
        if len(items) == 1 and len(items[0]) > 120:
            items = [step]
        screens.append({"name": name, "items": items, "inferred": True})
    return screens


def parse_screens_block(raw: str) -> list[dict]:
    screens = []
    for line in raw.splitlines():
        line = line.strip()
        if not line.startswith("- "):
            continue
        body = line[2:].strip()
        name, rest = body, ""
        m = re.match(r"\*\*(.+?)\*\*\s*[:：]\s*(.*)", body, re.S)
        if m:
            name, rest = m.group(1).strip(), m.group(2).strip()
        elif re.search(r"[:：]", body):
            parts = re.split(r"[:：]", body, maxsplit=1)
            name = parts[0].strip().strip("*").strip()
            rest = parts[1].strip() if len(parts) > 1 else ""
        items = split_items(rest) if rest else []
        screens.append({"name": name, "items": items, "inferred": False})
    return screens


def parse_feature(path: str, ui_word: str) -> dict:
    with open(path, encoding="utf-8") as f:
        text = f.read()

    title_m = re.search(r"^# (.+)$", text, re.M)
    title = title_m.group(1).strip() if title_m else os.path.basename(path)
    fid_m = re.search(r"(F\d+)", os.path.basename(path))
    fid = fid_m.group(1) if fid_m else "?"

    goal = section(text, "الهدف")
    prereq = section(text, "المتطلبات المسبقة / المدخلات")
    steps_raw = section(text, "خطوات الـ Workflow")

    steps = []
    for line in steps_raw.splitlines():
        line = line.strip()
        m = re.match(r"^\d+\.\s+(.+)$", line)
        if m:
            steps.append(m.group(1))

    screens_raw = ""
    for sec in ("الشاشات والعناصر", "لوحات الويب والعناصr", "الواجهات والعناصr"):
        screens_raw = section(text, sec.replace("r", "ر"))
        if screens_raw:
            break

    screens = parse_screens_block(screens_raw) if screens_raw else infer_screens(steps, prereq, ui_word)

    return {
        "fid": fid,
        "title": short_title(title),
        "goal": goal,
        "screens": screens,
        "has_explicit_screens": bool(screens_raw),
    }


def mermaid_safe(text: str) -> str:
    text = re.sub(r"\*\*([^*]+)\*\*", r"\1", text)
    return text.replace('"', "'").replace("[", "(").replace("]", ")").strip()


def mermaid_screen_flow(feature: dict) -> str:
    screens = feature["screens"]
    if not screens:
        return "```mermaid\nflowchart TD\n  empty[لا توجد شاشات]\n```"

    fid = feature["fid"].lower()
    lines = ["```mermaid", "flowchart TD"]
    ids = []
    for i, sc in enumerate(screens):
        sid = f"{fid}_s{i+1}"
        ids.append(sid)
        label = mermaid_safe(sc["name"])
        lines.append(f'  {sid}["{label}"]')

    for i in range(len(ids) - 1):
        lines.append(f"  {ids[i]} --> {ids[i+1]}")

    lines.append("```")
    return "\n".join(lines)


def mermaid_master_flow(features: list[dict]) -> str:
    if not features:
        return ""
    lines = ["```mermaid", "flowchart LR"]
    ids = []
    for feat in features:
        fid = feat["fid"].lower()
        sid = f"{fid}_feat"
        ids.append(sid)
        label = f"{feat['fid']} {mermaid_safe(feat['title'])[:40]}"
        lines.append(f'  {sid}["{label}"]')

    for i in range(len(ids) - 1):
        lines.append(f"  {ids[i]} --> {ids[i+1]}")

    lines.append("```")
    return "\n".join(lines)


def render_screens_detail(screens: list[dict]) -> str:
    parts = []
    for sc in screens:
        tag = " _(مستنتجة)_" if sc.get("inferred") else ""
        name = sc["name"].strip().strip("*").strip()
        parts.append(f"#### **{name}**{tag}\n\n")
        items = sc.get("items") or []
        if items:
            for i, it in enumerate(items, 1):
                parts.append(f"{i}. {it}\n")
        else:
            parts.append("_لا توجد عناصر._\n")
        parts.append("\n")
    return "".join(parts)


def render_feature_md(feature: dict, ui_plural: str) -> str:
    parts = [
        f"## {feature['fid']} — {feature['title']}\n\n",
        f"**الهدف:** {feature['goal']}\n\n",
        "### Flowchart\n\n",
        mermaid_screen_flow(feature),
        "\n\n",
        f"### {ui_plural} — العنوان والمحتويات\n\n",
        render_screens_detail(feature["screens"]),
        "---\n\n",
    ]
    return "".join(parts)


def main():
    for role, (ar, platform, ui_word) in ROLE_META.items():
        folder = os.path.join(BASE, role)
        files = sorted(
            glob.glob(os.path.join(folder, "F*.md")),
            key=lambda p: int(re.search(r"F(\d+)", os.path.basename(p)).group(1)),
        )
        features = [parse_feature(fp, ui_word) for fp in files]
        total_screens = sum(len(f["screens"]) for f in features)
        ui_plural = "شاشات" if ui_word == "شاشة" else "لوحات"

        md_parts = [
            f"# {ar} — Flowcharts (Mermaid MD)\n\n",
            f"> **الدور:** {ar} | **المنصة:** {platform}\n\n",
            f"> ملف Markdown فيه **Mermaid flowcharts** — يفتح في GitHub / Cursor / VS Code Preview.\n\n",
            "---\n\n",
            "## الفلو الكامل للميزات\n\n",
            mermaid_master_flow(features),
            "\n\n---\n\n",
            "## فهرس\n\n",
        ]
        for feat in features:
            md_parts.append(
                f"- [{feat['fid']} — {feat['title']}](#{feat['fid'].lower()}--{re.sub(r'[^a-z0-9]+', '-', feat['title'].lower())[:50]}) "
                f"({len(feat['screens'])} {ui_word})\n"
            )

        md_parts.append(f"\n---\n\n# الميزات ({len(features)} | {total_screens} {ui_plural})\n\n")
        for feat in features:
            md_parts.append(render_feature_md(feat, ui_plural))

        md_text = "".join(md_parts)
        out = os.path.join(folder, "00_flowcharts.md")
        with open(out, "w", encoding="utf-8") as f:
            f.write(md_text)

        # نسخة متوافقة مع الاسم القديم
        legacy = os.path.join(folder, "00_screens_flowcharts.md")
        with open(legacy, "w", encoding="utf-8") as f:
            f.write(md_text)

        print(f"{role}: {out} ({len(md_text):,} chars, {total_screens} screens)")


if __name__ == "__main__":
    main()
