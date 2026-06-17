"""Load doc_create args from mcp_args JSON and print result path marker."""
import json
import sys
from pathlib import Path

args_path = Path(sys.argv[1])
args = json.loads(args_path.read_text(encoding="utf-8"))
out = Path(sys.argv[2])
out.write_text(json.dumps(args, ensure_ascii=False), encoding="utf-8")
print(f"ARGS_READY:{out}:{len(args.get('content', ''))}")
