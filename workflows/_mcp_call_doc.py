"""Load doc_create args and write invoke payload for MCP."""
import json
import sys
from pathlib import Path

role = sys.argv[1]
src = Path(__file__).parent.parent / "agent-tools" / f"mcp_args_{role}.json"
args = json.loads(src.read_text(encoding="utf-8"))
out = Path(__file__).parent.parent / "agent-tools" / f"result_{role}_doc.json"
payload = {"tool": "doc_create", "args": args}
out.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
print(f"READY:{role}:{len(args['content'])}")
