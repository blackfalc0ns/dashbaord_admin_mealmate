"""Load doc_create args for a role and write MCP result placeholder."""
import json
import sys
from pathlib import Path

role = sys.argv[1]
base = Path(__file__).parent / "_mcp_args"
args = json.loads((base / f"{role}_call.json").read_text(encoding="utf-8"))
out = Path(__file__).parent / "_mcp_results"
out.mkdir(exist_ok=True)
(out / f"{role}_args.json").write_text(json.dumps(args, ensure_ascii=False), encoding="utf-8")
print(json.dumps({"role": role, "content_len": len(args["content"]), "x": args["x"], "y": args["y"]}))
