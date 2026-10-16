import { dirname, relative, resolve, sep } from "node:path";
import type { ImageMetadata } from "astro";

/**
 * 正文 frontmatter 的 `hero.image.file` 是相对正文文件书写的路径
 * （如 `../../../assets/img_x.png`）。这里把它解析成 Astro 构建期
 * 已知的图片资源，这样 hero 仍走 `astro:assets` 的响应式变体，
 * 而 frontmatter 保持原样、不必改写成 `import`。
 *
 * 解析是路径算术，不是命名约定：以「正文文件所在目录」为基准做
 * 规范化，再换算成项目根的绝对形式去查 `import.meta.glob` 的键。
 */
const assets = import.meta.glob<{ default: ImageMetadata }>("/src/assets/**/*", {
  eager: true,
});

const PROJECT_ROOT = process.cwd();

/** 解析封面图；路径缺失或指向不存在的资源时返回 undefined。 */
export function resolveHeroImage(
  file: string,
  entryFilePath: string | undefined,
): ImageMetadata | undefined {
  if (!entryFilePath) return undefined;

  const absolute = resolve(dirname(entryFilePath), file);
  const projectRelative = "/" + relative(PROJECT_ROOT, absolute).split(sep).join("/");

  return assets[projectRelative]?.default;
}
