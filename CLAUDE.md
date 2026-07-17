# Peri Cool — Blog / Docs Site

Peri 的官方文档与博客站点，基于 Astro + Starlight 构建。

## 风格原则

- **语言**：全部中文。Markdown 内容、注释、commit message 都用简体中文。
- **语气**：程序员对程序员。技术说明型，不是营销型。诚实、直接、不浮夸。如果某个功能有局限，直接说，不用"但是"圆回来。
- **内容**：讲清楚是什么、怎么用、有什么限制。用示例说明，不堆形容词。
- **代码优先**：能用代码块说明的不用段落。

## 用户定位与内容视角

**读者是 Peri 的使用者**，不是 Peri 的开发者。他们想知道"我怎么做 X"，不是"Peri 内部怎么实现 Y"。

关键认知：
- **Peri 的功能是给 Agent 用的，不是给用户手写的。** 比如 ultracode 工作流——用户不需要写 JavaScript 脚本，只需要对 Peri 说"帮我并行审查这几个文件"，Peri 自己生成并执行工作流脚本。
- **所有文章从任务出发**：用户想解决什么问题 → 怎么对 Peri 说 → Peri 做了什么 → 结果是什么。不介绍"你可以用 agent() 原语"这种面向 Peri 开发者的内容。
- **区分"用户操作"和"Agent 操作"**：`/theme`、`/goal`、`/model` 是用户直接输入的命令。ultracode、子代理、compact 是 Peri 在后台自动用的能力。写清楚各自的触发方式。
- **示例对话 > 技术参数**：展示用户和 Peri 之间的真实对话片段，胜过列一页配置项表格。

## 项目结构

```
src/
  pages/index.astro          # 自定义首页（澄海天光主题）
  styles/submerged.css       # 全局主题 CSS
  content/docs/
    guides/                  # 指南类文章
      getting-started.mdx    # 快速上手
      why-peri.mdx           # 为什么选择 Peri
      ultracode.mdx          # ultracode 工作流
      theme.mdx              # /theme 主题
      goal.mdx               # /goal 长任务
    reference/               # 参考文档
      architecture.md        # 架构设计
astro.config.mjs             # Starlight 配置 + sidebar + head scripts
```

## 主题系统

### 澄海天光 · Submerged Light

- 背景：暖沙白 `#faf7f2`
- 强调色：浅海青 `#5ba4bc` / 深海墨 `#1a3a4a`
- 字体：Display → Fraunces | Body → Figtree | Mono → SF Mono / Fira Code
- 仅亮色模式。深色模式通过 CSS 强制覆盖为亮色。

### Starlight 颜色注意

Starlight 的变量命名反直觉：
- `--sl-color-black` = 背景色（暗色模式=黑底，亮色模式=浅底）
- `--sl-color-white` = 文字色（暗色模式=白字，亮色模式=深字）
- `--sl-color-gray-1..6` = 文字深→背景浅的渐变

覆盖时三个状态必须同时设置：`:root`、`:root[data-theme='light']`、`:root[data-theme='dark']`。  
CSS 文件在 `@layer` 外加载，利用无层优先于层的规则覆盖 Starlight 内置样式。

### 首页

`src/pages/index.astro` 是独立 Astro 页面，不走 Starlight 布局。自定义了 caustic 光斑动画、噪点纹理、有机形状卡片。修改首页改这个文件。内页（blog 文章）走 Starlight 的 MDX 渲染 + 侧边栏布局。

## 开发

```bash
bun run dev      # 启动开发服务器
bun run build    # 构建
bun run preview  # 预览构建产物
```

## 添加新页面

1. 在 `src/content/docs/guides/` 下创建 `.mdx` 文件
2. 在 `astro.config.mjs` 的 sidebar 中添加条目
3. frontmatter 必须包含 `title` 和 `description`

## 内容规范

- 使用 Starlight 内置组件：`Aside`（提示框）、`Tabs/TabItem`（标签页）、`Card/CardGrid`（卡片）、`FileTree`（文件树）
- MDX 中 `<` 开头的文本会被当 JSX 解析。代码块内的没事，但表格/段落中写 `<0.5s` 这种要转义或用反引号包起来
- 外部链接用完整 URL，内部链接用绝对路径如 `/guides/getting-started/`
- 文章末尾可以放"下一步"小节，链接到相关页面
