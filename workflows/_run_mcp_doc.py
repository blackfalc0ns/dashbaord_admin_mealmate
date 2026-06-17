"""Invoke doc_create via Cursor MCP by loading args JSON file."""
import json
import subprocess
import sys
from pathlib import Path

args_path = Path(sys.argv[1])
args = json.loads(args_path.read_text(encoding="utf-8"))
payload = {
    "server": "plugin-miro-miro",
    "toolName": "doc_create",
    "arguments": args,
}
out = Path(sys.argv[2])
out.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
print(f"payload_written:{out}:{len(args.get('content', ''))}")
