"""Load doc_create MCP args from invoke JSON files."""
import json
import sys
from pathlib import Path

BASE = Path(r"C:\Users\Abano\.cursor\projects\d-fullstack-project-MealMate\agent-tools")
name = sys.argv[1]
args = json.loads((BASE / f"invoke_{name}_doc.json").read_text(encoding="utf-8"))
out = BASE / f"mcp_out_{name}.json"
out.write_text(json.dumps(args, ensure_ascii=False), encoding="utf-8")
print(out)
print(len(args["content"]))
