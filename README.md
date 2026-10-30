# Peri Cool

Peri 的官方文档与文章站点，基于 Astro 和 Nimbus 构建。站点内容使用简体中文，以可核验的产品行为、工程记录和研究数据为事实基础。

## 内容结构

```text
src/content/docs/docs/    用户文档与参考手册
src/content/posts/        工程、产品、研究与动态文章
src/pages/                首页、文章索引与文章路由
src/components/           Nimbus 自定义组件
src/styles/               全局主题
public/                   静态图表与公开资源
```

文档和文章分开管理：

- 文档回答“如何完成一个任务”，并收录配置和命令参考。
- 文章记录设计背景、工程权衡、数据研究和已发生的项目变化。

## 本地开发

需要 Bun。

```bash
bun install
bun run dev
```

默认开发服务地址由 Astro 在终端输出。

## 检查

```bash
bun test
bun run check:site
git diff --check
```

`check:site` 会先构建站点，再检查站内链接、图片、锚点、`/peri-cool/` base、文章索引可达性、Pagefind、sitemap 和编辑链接。

## 添加文档

1. 在 `src/content/docs/docs/` 的合适主题下新建 `.mdx` 文件。
2. 添加 `title` 和 `description` frontmatter。
3. 在 `astro.config.ts` 的 sidebar 中放入对应 slug。
4. 内部链接使用不带 base 的逻辑绝对路径，例如 `/docs/get-started/quickstart/`。Nimbus 构建时会补上 `/peri-cool/`。
5. 若新增可路由的自定义集合，必须把 collection 写入 `nimbusConfig.rendering.collections`；当前 `docs` 与 `posts` 已列出。

## 添加文章

1. 在 `src/content/posts/<category>/` 下新建 `.mdx` 文件。
2. `category` 必须是 `engineering`、`product`、`research` 或 `news`。
3. 添加 `title`、`description` 和 `date` frontmatter。
4. 文章会按 `date DESC, id DESC` 自动出现在总览、分类索引和文章侧边栏，不需要维护 slug 清单。

## 内容原则

- 只写代码、契约测试、正式设计记录或可追溯数据能支持的事实。
- 在 Peri 主仓库中同步时，先读 `docs/design/README.md`；权威设计用于校正机制，不原样复制内部过程材料。
- 命令、默认值、生命周期和精确数字在发布前核验事实源。
- 功能有局限时直接说明，不使用绝对兼容或无条件承诺。
- 研究文章需写明样本、时间窗口、口径、局限和可复现性等级。
