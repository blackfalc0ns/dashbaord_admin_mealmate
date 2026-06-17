"""Emit doc_create arguments as JSON for one role (stdout, utf-8)."""
import json
import sys
from pathlib import Path

role = sys.argv[1]
args = json.loads(
    (Path(__file__).parent / "_mcp_args" / f"{role}.json").read_text(encoding="utf-8")
)
sys.stdout.buffer.write(json.dumps(args, ensure_ascii=False).encode("utf-8"))
