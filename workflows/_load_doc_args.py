"""Load doc_create args from _miro_upload JSON for MCP invocation."""
import json
import sys
from pathlib import Path

role = sys.argv[1]
src = Path(__file__).parent / "_miro_upload" / f"{role}_doc.json"
payload = json.loads(src.read_text(encoding="utf-8"))
args = payload["args"]
out = Path(__file__).parent.parent / "agent-tools" / f"mcp_args_{role}.json"
out.write_text(json.dumps(args, ensure_ascii=False), encoding="utf-8")
print(json.dumps({"content_len": len(args["content"]), "miro_url": args["miro_url"], "x": args["x"], "y": args["y"]}))
