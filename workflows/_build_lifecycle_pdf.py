"""Convert lifecycle flowchart Markdown files to PDF with rendered Mermaid diagrams."""
from __future__ import annotations

import argparse
import os
import re
import sys
import tempfile
import time

BASE = os.path.dirname(os.path.abspath(__file__))

ROLES = ("customer", "admin", "restaurant", "driver")
MD_NAME = "00_lifecycle_flowcharts.md"

HTML_SHELL = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>{title}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <style>
    @page {{ size: A4; margin: 14mm; }}
    body {{
      font-family: "Segoe UI", Tahoma, "Noto Sans Arabic", Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.55;
      color: #111;
      direction: rtl;
      text-align: right;
      max-width: 100%;
    }}
    h1 {{ font-size: 20pt; border-bottom: 2px solid #333; padding-bottom: 6px; }}
    h2 {{ font-size: 15pt; margin-top: 22px; page-break-after: avoid; }}
    h3 {{ font-size: 13pt; margin-top: 16px; page-break-after: avoid; }}
    h4 {{ font-size: 11.5pt; margin-top: 12px; page-break-after: avoid; }}
    blockquote {{
      border-right: 4px solid #4a90d9;
      margin: 10px 0;
      padding: 6px 12px;
      background: #f7f9fc;
      color: #333;
    }}
    code {{
      font-family: Consolas, monospace;
      background: #f2f2f2;
      padding: 1px 4px;
      border-radius: 3px;
      direction: ltr;
      unicode-bidi: embed;
    }}
    pre:not(.mermaid) {{
      background: #f5f5f5;
      padding: 10px;
      border-radius: 6px;
      overflow-x: auto;
      direction: ltr;
      text-align: left;
    }}
    table {{
      border-collapse: collapse;
      width: 100%;
      margin: 10px 0;
      font-size: 10pt;
    }}
    th, td {{
      border: 1px solid #ccc;
      padding: 6px 8px;
    }}
    th {{ background: #eee; }}
    ol, ul {{ padding-right: 22px; }}
    .mermaid {{
      margin: 16px auto;
      text-align: center;
      page-break-inside: avoid;
      direction: ltr;
    }}
    hr {{ border: none; border-top: 1px solid #ddd; margin: 18px 0; }}
    strong {{ color: #000; }}
  </style>
</head>
<body>
{body}
<script>
  mermaid.initialize({{
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    flowchart: {{ useMaxWidth: true, htmlLabels: true }},
  }});
  (async () => {{
    const nodes = document.querySelectorAll(".mermaid");
    if (nodes.length) {{
      await mermaid.run({{ nodes }});
    }}
    document.body.setAttribute("data-mermaid-done", "1");
  }})();
</script>
</body>
</html>
"""


def md_to_html(md_text: str, title: str) -> str:
    import markdown

    parts: list[str] = []
    pattern = re.compile(r"```mermaid\s*\n(.*?)```", re.DOTALL)
    last = 0
    for match in pattern.finditer(md_text):
        before = md_text[last : match.start()]
        if before.strip():
            parts.append(markdown.markdown(before, extensions=["tables", "fenced_code", "nl2br"]))
        diagram = match.group(1).strip()
        parts.append(f'<pre class="mermaid">{diagram}</pre>')
        last = match.end()
    tail = md_text[last:]
    if tail.strip():
        parts.append(markdown.markdown(tail, extensions=["tables", "fenced_code", "nl2br"]))

    body = "\n".join(parts)
    return HTML_SHELL.format(title=title, body=body)


def count_mermaid(md_text: str) -> int:
    return len(re.findall(r"```mermaid", md_text))


def md_to_pdf(md_path: str, pdf_path: str, timeout_ms: int = 300_000) -> dict:
    from playwright.sync_api import sync_playwright

    with open(md_path, encoding="utf-8") as f:
        md_text = f.read()

    title = os.path.splitext(os.path.basename(md_path))[0]
    html = md_to_html(md_text, title)
    expected = count_mermaid(md_text)

    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as tmp:
        tmp.write(html)
        html_path = tmp.name

    try:
        with sync_playwright() as p:
            browser = None
            for channel in ("chrome", "msedge", None):
                try:
                    if channel:
                        browser = p.chromium.launch(channel=channel, headless=True)
                    else:
                        browser = p.chromium.launch(headless=True)
                    break
                except Exception:
                    browser = None
            if browser is None:
                raise RuntimeError(
                    "No browser available. Install Chrome/Edge or run: "
                    "python -m playwright install chromium"
                )
            page = browser.new_page()
            page.goto(f"file:///{html_path.replace(os.sep, '/')}", wait_until="networkidle")

            if expected:
                page.wait_for_function(
                    """(n) => {
                        if (document.body.getAttribute('data-mermaid-done') === '1') {
                            return document.querySelectorAll('.mermaid svg').length >= n;
                        }
                        return false;
                    }""",
                    arg=expected,
                    timeout=timeout_ms,
                )
            else:
                page.wait_for_timeout(1000)

            page.pdf(
                path=pdf_path,
                format="A4",
                print_background=True,
                margin={"top": "12mm", "right": "12mm", "bottom": "12mm", "left": "12mm"},
            )
            browser.close()
    finally:
        try:
            os.remove(html_path)
        except OSError:
            pass

    size = os.path.getsize(pdf_path) if os.path.isfile(pdf_path) else 0
    return {"md": md_path, "pdf": pdf_path, "size": size, "mermaid_count": expected}


def main() -> int:
    parser = argparse.ArgumentParser(description="Build lifecycle PDFs from Markdown")
    parser.add_argument("--role", choices=[*ROLES, "all"], default="all")
    parser.add_argument("--timeout", type=int, default=300, help="Timeout per file in seconds")
    args = parser.parse_args()

    roles = ROLES if args.role == "all" else (args.role,)
    results = []
    t0 = time.time()

    for role in roles:
        md_path = os.path.join(BASE, role, MD_NAME)
        pdf_path = os.path.join(BASE, role, f"00_lifecycle_flowcharts_{role}.pdf")
        if not os.path.isfile(md_path):
            print(f"SKIP {role}: missing {md_path}", file=sys.stderr)
            continue
        print(f"Converting {role}...")
        info = md_to_pdf(md_path, pdf_path, timeout_ms=args.timeout * 1000)
        results.append(info)
        print(f"  -> {info['pdf']} ({info['size']:,} bytes, {info['mermaid_count']} diagrams)")

    elapsed = time.time() - t0
    print(f"\nDone in {elapsed:.1f}s — {len(results)} PDF(s)")
    for r in results:
        ok = "OK" if r["size"] > 50_000 else "SMALL"
        print(f"  [{ok}] {r['pdf']}: {r['size']:,} bytes")
    return 0 if results else 1


if __name__ == "__main__":
    raise SystemExit(main())
