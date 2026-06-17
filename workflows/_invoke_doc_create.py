"""Load doc_create payloads for MCP invocation."""
import json
import sys
from pathlib import Path

BASE = Path(__file__).parent / "_mcp_args"
ROLE = sys.argv[1] if len(sys.argv) > 1 else "driver"
args = json.loads((BASE / f"{ROLE}.json").read_text(encoding="utf-8"))
out = Path(__file__).parent / "_mcp_args" / f"{ROLE}_out.json"
out.write_text(json.dumps(args, ensure_ascii=False), encoding="utf-8")
print(str(out))
