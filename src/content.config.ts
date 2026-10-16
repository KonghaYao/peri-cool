import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsCollection, partialsCollection } from "@cloudflare/nimbus-docs/content";

// 旧站（Astro + Starlight）约定每篇正文用 `hero.image.file` 声明封面图，
// 路径相对正文文件书写（如 `../../../assets/img_x.png`）。
// Nimbus 未建模这个键，默认会被 strictFrontmatter 判为错误，所以这里显式声明。
//
// 用 `schemaFields` 而不是 `defineSchema` + `ctx.image()`：后者能返回
// ImageMetadata，但它的声明返回类型是宽松交集，会让 `entry.data` 丢掉
// 字段级类型，而 `lib/content.ts` 的治理逻辑依赖 `post.data.date` 是 Date。
// 图片路径改由 `src/lib/hero-image.ts` 在渲染期解析。
const hero = z
  .object({
    image: z.object({ file: z.string(), alt: z.string() }),
  })
  .optional();

// docs 与 posts 都是「页面集合」：Nimbus 的页面索引、llms.txt、
// 备用 Markdown 版本与 sitemap 都会遍历它们。
//
// 文章保持单一 collection：Nimbus 要求 collection 名等于 URL 挂载段，
// 按分类拆 collection 会把文章 URL 从 `/posts/<分类>/<文章>` 改成
// `/posts-<分类>/…`。顶栏章节改用共享 collection 的多个 section 实现，
// 见 astro.config.ts 的 sidebar.items。
export const collections = {
  docs: defineCollection(
    docsCollection({
      schemaFields: {
        hero,
        audience: z.literal("human").optional(),
      },
    }),
  ),

  posts: defineCollection(
    docsCollection({
      base: "posts",
      schemaFields: {
        hero,
        date: z.coerce.date().optional(),
      },
    }),
  ),

  partials: defineCollection(partialsCollection()),
};
