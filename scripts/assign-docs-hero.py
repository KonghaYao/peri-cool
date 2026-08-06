#!/usr/bin/env python3
"""为 docs 文档区 33 篇页面按 sidebar 分组写入 hero 配置（组内共用一张图）。"""
import re
from pathlib import Path

BASE = Path("src/content/docs/docs")

# 分组 → (图片文件, alt)
GROUPS = {
    "introduction": ("img_open_door_path_s49.png", "门与路"),
    "quickstart": ("img_open_door_path_s49.png", "门与路"),
    "termux-install": ("img_open_door_path_s49.png", "门与路"),
    "explore-codebase": ("img_lamp_and_workbench_s50.png", "台灯与工作台"),
    "implement-feature": ("img_lamp_and_workbench_s50.png", "台灯与工作台"),
    "refactor-code": ("img_lamp_and_workbench_s50.png", "台灯与工作台"),
    "code-review": ("img_lamp_and_workbench_s50.png", "台灯与工作台"),
    "fix-bugs": ("img_lamp_and_workbench_s50.png", "台灯与工作台"),
    "write-tests": ("img_lamp_and_workbench_s50.png", "台灯与工作台"),
    "parallel-work": ("img_gears_and_path_s51.png", "齿轮与轨道"),
    "ultracode-workflow": ("img_gears_and_path_s51.png", "齿轮与轨道"),
    "auto-devflow": ("img_gears_and_path_s51.png", "齿轮与轨道"),
    "long-running-tasks": ("img_gears_and_path_s51.png", "齿轮与轨道"),
    "cron": ("img_gears_and_path_s51.png", "齿轮与轨道"),
    "model-profiles": ("img_keys_and_star_s52.png", "钥匙与星"),
    "agent-selection-guide": ("img_keys_and_star_s52.png", "钥匙与星"),
    "model-strategy": ("img_keys_and_star_s52.png", "钥匙与星"),
    "theme": ("img_keys_and_star_s52.png", "钥匙与星"),
    "cli-reference": ("img_keys_and_star_s52.png", "钥匙与星"),
    "skills": ("img_toolbox_open_s53.png", "工具箱"),
    "tools": ("img_toolbox_open_s53.png", "工具箱"),
    "mcp": ("img_toolbox_open_s53.png", "工具箱"),
    "hooks": ("img_toolbox_open_s53.png", "工具箱"),
    "permissions": ("img_toolbox_open_s53.png", "工具箱"),
    "image-input": ("img_toolbox_open_s53.png", "工具箱"),
    "context-engineering": ("img_toolbox_open_s53.png", "工具箱"),
    "best-practices": ("img_toolbox_open_s53.png", "工具箱"),
    "claude-md": ("img_book_and_ruler_s54.png", "书与尺"),
    "polish-claude-md": ("img_book_and_ruler_s54.png", "书与尺"),
    "superpowers": ("img_book_and_ruler_s54.png", "书与尺"),
    "claude-official-plugins": ("img_book_and_ruler_s54.png", "书与尺"),
    "mattpocock-skills": ("img_book_and_ruler_s54.png", "书与尺"),
    "openspec": ("img_book_and_ruler_s54.png", "书与尺"),
}

def main():
    changed, skipped = [], []
    for f in sorted(BASE.rglob("*.mdx")):
        slug = f.stem
        if slug not in GROUPS:
            skipped.append(f.name)
            continue
        img, alt = GROUPS[slug]
        text = f.read_text(encoding="utf-8")
        if re.search(r"^hero:", text, re.M):
            skipped.append(f.name + " (已有 hero)")
            continue
        m = re.match(r"^(---\n)(.*?)(\n---\n)", text, re.S)
        if not m:
            skipped.append(f.name + " (无 frontmatter)")
            continue
        hero_block = (
            f"\nhero:\n"
            f"  image:\n"
            f"    file: ../../../../assets/{img}\n"
            f"    alt: {alt}"
        )
        new_text = m.group(1) + m.group(2) + hero_block + m.group(3) + text[m.end():]
        f.write_text(new_text, encoding="utf-8")
        changed.append(f.name)
    print(f"更新 {len(changed)} 篇")
    for c in changed:
        print("  +", c)
    if skipped:
        print(f"跳过 {len(skipped)} 篇: {', '.join(skipped)}")

if __name__ == "__main__":
    main()
