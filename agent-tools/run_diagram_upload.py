"""Print diagram_create arguments JSON for MCP (exact args from workflow JSON)."""
import json
import sys
from pathlib import Path

role = sys.argv[1]
src = Path(__file__).resolve().parent.parent / "workflows" / "_miro_upload" / f"{role}_diagram.json"
payload = json.loads(src.read_text(encoding="utf-8"))
sys.stdout.reconfigure(encoding="utf-8")
print(json.dumps(payload["args"], ensure_ascii=False))
