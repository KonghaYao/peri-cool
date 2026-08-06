/**
 * 图片压缩脚本：在 pre-commit 时压缩 staged 的图片。
 *
 * 只处理已暂存（staged）的图片，压缩后若变小则覆盖原文件并重新 git add，
 * 保证提交进仓库的是压缩版本。不处理 gif（会丢动画帧）和 svg（是文本）。
 *
 * 用法：
 *   bun run compress:images        # 压缩 staged 图片（hook 调用）
 *   bun run compress:images --all  # 压缩仓库内全部图片（手动全量压缩）
 */
import { execSync } from 'node:child_process';
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import sharp from 'sharp';

// 小于该字节数的图片跳过，不值得压缩
const MIN_SIZE = 10 * 1024;

// 各格式压缩参数（有损，视觉质量优先）
const PRESETS = {
  '.png':  (img) => img.png({ palette: true, quality: 85, effort: 9 }),
  '.jpg':  (img) => img.jpeg({ quality: 80, mozjpeg: true }),
  '.jpeg': (img) => img.jpeg({ quality: 80, mozjpeg: true }),
  '.webp': (img) => img.webp({ quality: 80 }),
  '.avif': (img) => img.avif({ quality: 50 }),
};

const IMAGE_EXTS = new Set(Object.keys(PRESETS));

function fmtBytes(n) {
  return n >= 1024 * 1024
    ? `${(n / 1024 / 1024).toFixed(2)}MB`
    : `${Math.max(1, Math.round(n / 1024))}KB`;
}

function fmtPct(before, after) {
  return `${Math.round((1 - after / before) * 100)}%`;
}

/** 返回待处理文件列表：默认 staged，--all 时扫描全部 */ 
function listTargets(all) {
  if (all) {
    const roots = ['public', 'src'];
    const files = [];
    const walk = (dir) => {
      for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        const st = statSync(p);
        if (st.isDirectory()) walk(p);
        else if (IMAGE_EXTS.has(extname(p))) files.push(p);
      }
    };
    for (const root of roots) {
      try { walk(root); } catch { /* 目录不存在则跳过 */ }
    }
    return files;
  }
  return execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
    .split('\n')
    .map((f) => f.trim())
    .filter((f) => f && IMAGE_EXTS.has(extname(f)));
}

async function compressOne(file) {
  const before = statSync(file).size;
  if (before < MIN_SIZE) return null;

  const ext = extname(file);
  let buffer = await PRESETS[ext](sharp(file)).toBuffer();

  // PNG 量化失效（反而变大）时退回无损 deflate 压缩
  if (ext === '.png' && buffer.length >= before) {
    const lossless = await sharp(file).png({ compressionLevel: 9, palette: false }).toBuffer();
    if (lossless.length < buffer.length) buffer = lossless;
  }

  if (buffer.length >= before) return null; // 没变小就不动

  writeFileSync(file, buffer);
  execSync(`git add "${file}"`, { stdio: 'inherit' });
  return { before, after: buffer.length };
}

const all = process.argv.includes('--all');
const targets = listTargets(all);

if (targets.length === 0) {
  console.log(`没有需要处理的图片（${all ? '全量扫描' : 'staged'}）。`);
  process.exit(0);
}

console.log(`压缩 ${targets.length} 个图片…`);
let totalBefore = 0;
let totalAfter = 0;
let done = 0;

for (const file of targets) {
  try {
    const result = await compressOne(file);
    if (result) {
      done++;
      totalBefore += result.before;
      totalAfter += result.after;
      console.log(
        `  ${file.padEnd(52)} ${fmtBytes(result.before)} → ${fmtBytes(result.after)}  (-${fmtPct(result.before, result.after)})`,
      );
    }
  } catch (err) {
    console.warn(`  ⚠ ${file} 压缩失败，已跳过：${err.message}`);
  }
}

if (done > 0) {
  console.log(`完成：${done} 个图片，共 ${fmtBytes(totalBefore)} → ${fmtBytes(totalAfter)}（-${fmtPct(totalBefore, totalAfter)}）`);
} else {
  console.log('没有图片需要压缩（都已达标或已是最优）。');
}
