#!/usr/bin/env python3
"""
Đồng bộ data/grammar.html vào grammar-data.json cho tab Ngữ pháp của NOX.
Usage:
    python3 build_grammar_data.py [src] [dst]
"""
import html
import json
import re
import sys

src = sys.argv[1] if len(sys.argv) > 1 else "data/grammar.html"
dst = sys.argv[2] if len(sys.argv) > 2 else "grammar-data.json"

with open(src, "r", encoding="utf-8") as f:
    text = f.read()

sections = re.findall(r'<section\s+id=[\"\']u(\d+)[\"\'][^>]*>([\s\S]*?)</section>', text, re.I)
assert sections, f"Không tìm thấy unit nào trong {src}"

units = []
stats = {"strike_pairs": 0, "stray_bold": 0, "merged_em": 0}

for num_str, body in sections:
    num = int(num_str)
    h2_match = re.search(r'<h2[^>]*>([\s\S]*?)</h2>', body, re.I)
    assert h2_match, f"Thiếu <h2> ở Unit {num}"
    raw_title = html.unescape(re.sub(r'<[^>]+>', '', h2_match.group(1))).strip()
    clean_title = re.sub(r'^(?:Unit\s*\d+\s*[.:]\s*|\s*)', '', raw_title, flags=re.I).strip()
    
    body_content = body[:h2_match.start()] + body[h2_match.end():]

    body_content, n = re.subn(r'~~(.+?)~~', r'<del>\1</del>', body_content, flags=re.S)
    stats["strike_pairs"] += n

    stats["stray_bold"] += body_content.count("**")
    body_content = body_content.replace("**", "")

    while "</em><em>" in body_content:
        stats["merged_em"] += body_content.count("</em><em>")
        body_content = body_content.replace("</em><em>", "")

    body_content = body_content.replace('class="tw"', 'class="grammar-table-wrap"')
    body_content = re.sub(r'(?<!<div class=[\"\']grammar-table-wrap[\"\']>)<table>', '<div class="grammar-table-wrap"><table>', body_content)
    body_content = re.sub(r'</table>(?!</div>)', '</table></div>', body_content)

    body_content = re.sub(r'\s+', ' ', body_content).strip()
    body_content = re.sub(r'(?:\s*<hr\s*/?>)+\s*$', '', body_content)

    units.append({
        "id": f"u{num}",
        "num": num,
        "title": clean_title,
        "html": body_content
    })

nums = [u["num"] for u in units]
assert nums == sorted(nums) and len(set(nums)) == len(nums), "Unit IDs bị lỗi thứ tự hoặc trùng lặp"

data = {"version": 1, "units": units}
with open(dst, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

total = sum(len(u["html"]) for u in units)
print(f"Thành công: {len(units)} unit (Unit {nums[0]}–{nums[-1]}), {total:,} ký tự HTML -> {dst}")
print(f"Đã xử lý: {stats['strike_pairs']} cặp gạch bỏ, {stats['stray_bold']} dấu ** lẻ, {stats['merged_em']} thẻ <em> liền kề.")
