"""Load MealMate Miro upload JSON args and write per-item invoke payloads."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UPLOAD = ROOT / "workflows" / "_miro_upload"
OUT = Path(__file__).resolve().parent / "invoke_queue"

FRAME = {
    "customer": "3458764674636420986",
    "admin": "3458764674636420987",
    "restaurant": "3458764674636420988",
    "driver": "3458764674636420989",
}
BOARD = "https://miro.com/app/board/uXjVLG5SLN8=/"

DOC_OVERRIDES = {
    "admin_doc_1": {"x": 950, "y": 80},
    "admin_doc_2": {"x": 950, "y": 1200},
    "driver_doc": {"x": 950, "y": 80},
}


def load_args(path: Path) -> dict:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return payload["args"]


def main() -> None:
    OUT.mkdir(exist_ok=True)
    queue = []

    for role in ("customer", "admin", "restaurant", "driver"):
        args = load_args(UPLOAD / f"{role}_diagram.json")
        item = {
            "tool": "diagram_create",
            "label": f"{role}_diagram",
            "arguments": args,
        }
        queue.append(item)
        (OUT / f"diagram_{role}.json").write_text(
            json.dumps(item, ensure_ascii=False), encoding="utf-8"
        )

    doc_files = [
        "customer_doc",
        "admin_doc_1",
        "admin_doc_2",
        "restaurant_doc",
        "driver_doc",
    ]
    for name in doc_files:
        args = load_args(UPLOAD / f"{name}.json")
        if name in DOC_OVERRIDES:
            args.update(DOC_OVERRIDES[name])
        item = {"tool": "doc_create", "label": name, "arguments": args}
        queue.append(item)
        (OUT / f"doc_{name}.json").write_text(
            json.dumps(item, ensure_ascii=False), encoding="utf-8"
        )

    (OUT / "queue.json").write_text(json.dumps(queue, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(queue)} invoke payloads to {OUT}")
    for item in queue:
        args = item["arguments"]
        size = len(args.get("diagram_dsl") or args.get("content") or "")
        print(f"  {item['label']}: {item['tool']} payload_chars={size}")


if __name__ == "__main__":
    main()
