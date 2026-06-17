"""Prepare Miro upload payloads (JSON) for diagrams and docs."""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
BOARD = "https://miro.com/app/board/uXjVLG5SLN8=/"
FRAMES = {
    "customer": "3458764674636420986",
    "admin": "3458764674636420987",
    "restaurant": "3458764674636420988",
    "driver": "3458764674636420989",
}
TITLES = {
    "customer": "★ العميل — Flowchart الشاشات",
    "admin": "★ الأدمن — Flowchart اللوحات",
    "restaurant": "★ المطعm — Flowchart اللوحات",
    "driver": "★ المندوب — Flowchart الشاشات",
}

out_dir = os.path.join(BASE, "_miro_upload")
os.makedirs(out_dir, exist_ok=True)

for role, frame_id in FRAMES.items():
    dsl_path = os.path.join(BASE, role, "_miro_screens_flow.dsl")
    with open(dsl_path, encoding="utf-8") as f:
        dsl = f.read()
    payload = {
        "tool": "diagram_create",
        "args": {
            "diagram_dsl": dsl,
            "diagram_type": "flowchart",
            "title": TITLES[role],
            "miro_url": f"{BOARD}?moveToWidget={frame_id}",
            "x": 80,
            "y": 350,
            "invocation_source": "skill",
        },
    }
    with open(os.path.join(out_dir, f"{role}_diagram.json"), "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    print(f"diagram {role}: {len(dsl):,} chars")

for role, frame_id in FRAMES.items():
    md_path = os.path.join(BASE, role, "00_screens_flowcharts.md")
    with open(md_path, encoding="utf-8") as f:
        content = f.read()
    chunks = [content] if len(content) <= 78000 else [content[:78000], content[78000:]]
    for i, chunk in enumerate(chunks):
        suffix = "" if len(chunks) == 1 else f" ({i+1}/{len(chunks)})"
        payload = {
            "tool": "doc_create",
            "args": {
                "content": chunk,
                "miro_url": f"{BOARD}?moveToWidget={frame_id}",
                "x": 900,
                "y": 80,
                "invocation_source": "skill",
            },
            "title_suffix": suffix,
        }
        name = f"{role}_doc" + (f"_{i+1}" if len(chunks) > 1 else "")
        with open(os.path.join(out_dir, f"{name}.json"), "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False)
        print(f"doc {name}: {len(chunk):,} chars")
