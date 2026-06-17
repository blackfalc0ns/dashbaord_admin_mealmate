"""Load doc_create args from workflow upload JSON files."""
import json
import sys
from pathlib import Path

UPLOAD = Path(__file__).parent / "_miro_upload"
name = sys.argv[1]
payload = json.loads((UPLOAD / f"{name}_doc.json").read_text(encoding="utf-8"))
args = payload["args"]
out = Path(__file__).parent.parent / "agent-tools" / f"mcp_args_{name}.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps(args, ensure_ascii=False), encoding="utf-8")
print(out)
print(len(args["content"]))
