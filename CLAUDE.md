# Peri Cool — Blog / Docs Site

Peri 的官方文档与博客站点，基于 Astro + Starlight 构建。

## 风格原则

- **语言**：全部中文。Markdown 内容、注释、commit message 都用简体中文。
- **语气**：程序员对程序员。技术说明型，不是营销型。诚实、直接、不浮夸。如果某个功能有局限，直接说，不用"但是"圆回来。
- **内容**：讲清楚是什么、怎么用、有什么限制。用示例说明，不堆形容词。
- **代码优先**：能用代码块说明的不用段落。

## 分类文风限制

博客按分类执行不同的文风标准。通用底线先于一切分类。

### 通用底线（所有分类）

- **数字纪律**：正文数字必须来自素材且可溯源；素材没有的写"没有实测数据"，禁止估算补数。
- **营销词黑名单**（出现即视为违规）：实锤、烧钱、玄学、段子、解剖、吃掉、黑洞、大户、神级、杀手锏、震撼、重磅、暴涨、无敌，以及"最"加程度副词的滥用（"最好""最强""极致"）。
- **诚实优先**：功能或结论有局限，直接说，不用"但是"圆回来。
- **标点**：不机械替换半角/全角标点，与所在文件已有风格一致；代码块内一律半角。
- MDX 规范（`<` 转义、Aside、链接）见下文"内容规范"。

### research（研究分析）— 研究员规格

定位是高级研究员写研究报告，对象是数据，不是产品。最严格的一类。

- **标题**：陈述句、信息密度高。允许"X 的统计指纹：N 条消息中的 M 类检测规则"；禁止疑问句（"你的 Agent 在空转吗"）、禁止比喻化名词（"最后一公里""大户"）。
- **语气**：克制、中性、陈述式。不用第二人称推销（"你会明白""你只要"），用"结论是""数据显示"。
- **结构**：数据底稿（样本、窗口、口径）→ 发现 → 归因 → 验证 → 局限。
- **数据纪律**：每个数字标注口径（"估算""抽样所见""单点数据"）；归因结论必须有证据链，推断明确写"这是推断"；局限单独成段或用 Aside（如"诚实边界"）。
- **禁词**（research 特有）：烧钱、白跑、话术、最狠、滚雪球、"讽刺的是"、"顺带一提"。

### engineering（工程实践）— 方法论规格

定位是排查方法与使用建议。

- **语气**：技术说明型，允许适度口语（"别慌""重跑就是"可保留），但不渲染、不夸张。
- **结构**：现象 → 排查 → 归因 → 修复/规避 → 适用边界。
- **边界**：修复效果没有实测就写"没有实测过修复后的数字"；演示示例必须标注"演示示例，不是真实会话"。
- **禁词**（engineering 特有）：解剖、吃掉、黑洞、定罪、玄学。

### product（产品介绍）— 诚实规格

- **语气**：诚实直接。功能有局限直接说。
- **禁词**：惊艳、强大、无与伦比、业界领先、革命性、全新一代。
- **对比**：只写事实差异，不写优劣评价。
- **示例对话 > 参数表**：展示用户与 Peri 的真实对话片段，胜过列一页配置项表格。

### news（版本动态）— 记录规格

- **语气**：变更记录的事实陈述，零宣传腔。不写"我们很高兴地宣布"。
- **结构**：每条变更标注 新增/修复/变更/移除。
- **数字**：版本号、日期、数字必须精确，禁止约化。

## 用户定位与内容视角

**读者是 Peri 的使用者**，不是 Peri 的开发者。他们想知道"我怎么做 X"，不是"Peri 内部怎么实现 Y"。

关键认知：
- **Peri 的功能是给 Agent 用的，不是给用户手写的。** 比如 ultracode 工作流——用户不需要写 JavaScript 脚本，只需要对 Peri 说"帮我并行审查这几个文件"，Peri 自己生成并执行工作流脚本。
- **所有文章从任务出发**：用户想解决什么问题 → 怎么对 Peri 说 → Peri 做了什么 → 结果是什么。不介绍"你可以用 agent() 原语"这种面向 Peri 开发者的内容。
- **区分确定性命令、Skill 和 Agent 操作**：`/theme`、`/model` 是界面入口，`/compact`、`/clear` 是 core command；`/goal`、`/ultracode`、`/ultra-adlc` 通过 Skill/命令路由进入 Agent；SubAgent 与 Workflow 通常由 Agent 调用。写清楚触发入口，不把所有 `/xxx` 都描述成同一种机制。
- **示例对话 > 技术参数**：展示用户和 Peri 之间的真实对话片段，胜过列一页配置项表格。

## 上游事实源与同步

`peri-cool` 位于 Peri 主仓库的子模块中。同步产品行为时，优先级为：代码与契约测试 >
`docs/standards/` > 模块 `CLAUDE.md` > `docs/design/` > active spec > history。

- `docs/design/README.md` 是权威设计索引；先确认文档状态，再转译到站点。
- 用户文档回答“怎么完成任务、会看到什么、有什么限制”，不复制内部 crate inventory、固定源码行号或实施批次。
- engineering 文章可以解释机制与取舍，但当前机制必须服从现行设计；过程叙述应明确为历史，不能冒充现状。
- 调查、迁移计划、完成清单和未采纳 proposal 不同步为产品文档。
- 上游设计改名、合并或删除时，检查 `developer/`、`history/`、engineering 文章和站内链接；完成前运行 `bun test` 与 `bun run check:site`。

## 项目结构

```
src/
  pages/
    index.astro               # 自定义首页（澄海天光主题，含最新文章列表）
    posts/
      [...slug].astro         # 单篇博客文章页
  styles/submerged.css        # 全局主题 CSS
  content/
    docs/docs/                # 文档内容（Starlight 渲染）
      get-started/            # 安装与快速上手
      guides/                 # TUI、Provider、Session、Plugin 等使用指南
      features/               # 任务与能力说明
      reference/              # Settings 与键盘参考
      security/               # 权限与凭据边界
      troubleshooting/        # 故障排除
      developer/              # 开发者入口与现行架构
      history/                # 明确标注证据边界的工程历史
    posts/                    # 博客内容（独立 Astro collection，目录即分类）
      engineering/            # 工程实践
      product/                # 产品介绍
      research/               # 研究分析
      news/                   # 版本动态
  content.config.ts           # 内容集合配置（docs + blog 两个 collection）
astro.config.mjs              # Starlight 配置 + sidebar + head scripts
```

仿照 [Claude Code 文档](https://docs.anthropic.com) 的目录结构——博客和文档物理分离，各自内部按专题分类。

## 主题系统

### Anthropic Ivory（仿 anthropic.com）

- 亮色 ivory：背景 `#faf9f5`，正文 `#141413`，次级文字 `#30302e`/`#5e5d59`，发丝线 `#d1cfc5`
- 暗色 slate：背景 `#141413`，正文 `#faf9f5`，次级文字 `#b0aea5`/`#87867f`，发丝线 `#30302e`
- 点缀色：陶土 `#d97757`（分类标签、eyebrow）
- 字体：标题/UI → Geist | 正文 → Source Serif 4（衬线）| Mono → JetBrains Mono
- 风格：极简留白、发丝线分隔、无阴影无卡片描边、正文链接始终下划线
- 明暗双主题：Starlight 页面通过 `data-theme` 切换，首页（独立页面）通过 `prefers-color-scheme` 跟随系统
- 语义变量：`--peri-bg` / `--peri-fg` / `--peri-muted` / `--peri-hairline` / `--peri-clay` 等，首页与内页共用

### Starlight 颜色注意

Starlight 的变量命名反直觉：
- `--sl-color-black` = 背景色（暗色模式=黑底，亮色模式=浅底）
- `--sl-color-white` = 文字色（暗色模式=白字，亮色模式=深字）
- `--sl-color-gray-1..6` = 文字深→背景浅的渐变

覆盖时三个状态必须同时设置：`:root`、`:root[data-theme='light']`、`:root[data-theme='dark']`。  
CSS 文件在 `@layer` 外加载，利用无层优先于层的规则覆盖 Starlight 内置样式。

### 首页

`src/pages/index.astro` 是独立 Astro 页面，不走 Starlight 布局，但会 `import '../styles/submerged.css'` 复用主题变量。结构：极简导航 + 居中 hero + 平铺数字条 + 最新文章列表（发丝线行分隔）+ 无边框特性三列 + CTA。修改首页改这个文件。内页（blog 文章）走 Starlight 的 MDX 渲染 + 侧边栏布局。

## 开发

```bash
bun run dev      # 启动开发服务器
bun run build    # 构建
bun run preview  # 预览构建产物
```

## 添加新文档页

1. 在 `src/content/docs/docs/<专题>/` 下创建 `.mdx` 文件
2. 在 `astro.config.mjs` 的 sidebar 对应 section 中添加条目
3. frontmatter 必须包含 `title` 和 `description`

## 添加新博客

1. 在 `src/content/posts/<category>/` 下创建 `.mdx` 文件，**目录即分类**
2. category 可选值：`engineering`（工程实践）、`product`（产品介绍）、`research`（研究分析）、`news`（版本动态）
3. frontmatter 必填 `title`、`description`；`hero` 必填：`image.file`（相对该 mdx 文件的图片路径，如 `../../../assets/img_xxx.png`）与 `alt`
4. 在 `src/lib/content.ts` 的 `postCategories` 中登记主题归属：文章 id 必须加入对应分类某个 `topics[].posts`，否则 `bun test` 失败、侧边栏不显示
5. 自动出现在首页最新文章与 `/posts/` 路由，无需手动编辑路由
6. 文风按上文"分类文风限制"执行，research 类最严格

## 侧边栏规范

站点两套侧边栏，层级统一为两层（分组 → 页面）：

| 侧边栏 | 数据源 | 层级 |
| --- | --- | --- |
| 文档 | `astro.config.mjs` 的 `sidebar` 数组 | 分组 → 页面 |
| 文章 | `src/lib/content.ts` 的 `postSidebar()` | 主题 → 文章 |

- 文章侧边栏是 **主题 → 文章** 两层。分类（engineering / product / research / news）只是内容归属，**不参与侧边栏层级**；主题（核心执行、状态与事件……）对应文档侧边栏的分组
- `postSidebar()` 是文章侧边栏的**唯一构造源**：列表页 `postSidebar(posts)`，分类页/单篇页 `postSidebar(posts, category)`。禁止在页面内手写 sidebar 对象
- 主题及其文章归属登记在 `lib/content.ts` 的 `postCategories[].topics[]`，归属完整性由 `bun test` 自动校验（每篇文章恰好一个主题）

## 内容规范

- 使用 Starlight 内置组件：`Aside`（提示框）、`Tabs/TabItem`（标签页）、`Card/CardGrid`（卡片）、`FileTree`（文件树）
- MDX 中 `<` 开头的文本会被当 JSX 解析。代码块内的没事，但表格/段落中写 `<0.5s` 这种要转义或用反引号包起来
- 外部链接用完整 URL，内部链接用带 base 的绝对路径，如 `/peri-cool/docs/get-started/quickstart/`、`/peri-cool/posts/engineering/agent-loop/`
- 文章末尾可以放"下一步"小节，链接到相关页面
