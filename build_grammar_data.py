#!/usr/bin/env python3
"""
Chuyển grammar.html (đã build sẵn) thành grammar-data.json cho tab "Ngữ pháp" của Nox.

    python3 build_grammar_data.py grammar.html grammar-data.json

Đây là cầu nối tạm. Khi có build.py + grammar_notes.md, nên cho build.py xuất thẳng
cùng định dạng JSON này (xem SCHEMA bên dưới) để khỏi phải đi vòng qua HTML.

SCHEMA:
{
  "version": 1,
  "units": [ { "id": "u1", "num": 1, "title": "Tổng quát về từ và câu", "html": "<h2>…" } ]
}
- "html" là nội dung unit, KHÔNG gồm thẻ <h1> (app tự vẽ tiêu đề).
- Mọi <table> được bọc trong <div class="grammar-table-wrap"> để cuộn ngang trên điện thoại.
"""
import html as htmlmod
import json
import re
import sys

src = sys.argv[1] if len(sys.argv) > 1 else "grammar.html"
dst = sys.argv[2] if len(sys.argv) > 2 else "grammar-data.json"

g = open(src, encoding="utf-8").read()
main = g[g.index("<main"): g.rindex("</main>")]

panels = re.findall(
    r'<div class="tab-panel[^"]*" id="tab\d+">(.*?)</div>(?=\s*<div class="tab-panel|\s*$)',
    main + "\n",
    re.S,
)
assert panels, "không tìm thấy unit nào trong " + src

TITLE_RE = re.compile(r"^\s*unit\s+(\d+)\s*[.:]\s*(.*)$", re.I)
stats = {"strike_pairs": 0, "stray_bold": 0, "merged_em": 0}

units = []
for raw in panels:
    m = re.match(r"\s*<h1>(.*?)</h1>(.*)$", raw, re.S)
    assert m, "unit không bắt đầu bằng <h1>: " + raw[:80]
    h1 = htmlmod.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()
    body = m.group(2)

    t = TITLE_RE.match(h1)
    assert t, "tiêu đề không đúng dạng 'Unit N: …': " + h1
    num, title = int(t.group(1)), t.group(2).strip()

    # ~~sai~~ (markdown gạch bỏ còn sót) -> <del>
    body, n = re.subn(r"~~(.+?)~~", r"<del>\1</del>", body, flags=re.S)
    stats["strike_pairs"] += n
    assert "~~" not in body, f"còn ~~ lẻ ở Unit {num}"

    # ** lẻ (không có cặp) còn sót từ bước chuyển markdown
    stats["stray_bold"] += body.count("**")
    body = body.replace("**", "")

    # <em>a </em><em>b</em> -> <em>a b</em> (hiển thị giống hệt, gọn hơn)
    while "</em><em>" in body:
        stats["merged_em"] += body.count("</em><em>")
        body = body.replace("</em><em>", "")

    # bọc bảng để cuộn ngang được trên màn hình nhỏ
    body = body.replace("<table>", '<div class="grammar-table-wrap"><table>')
    body = body.replace("</table>", "</table></div>")

    # gộp khoảng trắng (HTML hiển thị giống nhau; không có <pre>) -> tìm kiếm/ highlight ổn định
    body = re.sub(r"\s+", " ", body).strip()
    # bỏ <hr /> thừa ở cuối unit
    body = re.sub(r"(?:\s*<hr\s*/?>)+\s*$", "", body)

    units.append({"id": f"u{num}", "num": num, "title": title, "html": body})

nums = [u["num"] for u in units]
assert nums == sorted(nums) and len(set(nums)) == len(nums), "số unit không tăng dần/ bị trùng"

data = {"version": 1, "units": units}
with open(dst, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

total = sum(len(u["html"]) for u in units)
print(f"{len(units)} unit (Unit {nums[0]}–{nums[-1]}), {total:,} ký tự HTML -> {dst}")
print(f"đã sửa: {stats['strike_pairs']} cặp ~~gạch bỏ~~ -> <del>, "
      f"{stats['stray_bold']} dấu ** lẻ, gộp {stats['merged_em']} thẻ <em> liền kề")
