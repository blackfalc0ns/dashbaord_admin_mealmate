"""Read consolidated flow MD files for Miro doc_create upload."""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
BOARD = "https://miro.com/app/board/uXjVLG5SLN8=/"
roles = [
    ("driver", 0, 27000),
    ("restaurant", 900, 27000),
    ("customer", 1800, 27000),
    ("admin", 2700, 27000),
]
for role, x, y in roles:
    path = os.path.join(BASE, role, "00_complete_flow_detailed.md")
    with open(path, encoding="utf-8") as f:
        content = f.read()
    out = os.path.join(BASE, f"_miro_payload_{role}.json")
    payload = {
        "content": content,
        "miro_url": BOARD,
        "x": x,
        "y": y,
        "invocation_source": "skill",
    }
    with open(out, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    print(f"{role}: {len(content):,} chars -> {out}")
