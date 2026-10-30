# Peri Cool — Blog / Docs Site

Peri 的官方文档与博客站点，基于 Astro + Nimbus（`@cloudflare/nimbus-docs`）构建。站点特定说明另见 `AGENT.md`。

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
- **结构化表达**：读者中包含阅读障碍用户。连续内容优先用有序列表组织，一个列表项只讲一件事；长段落拆成编号步骤或短句；表格用于并列口径，不替代叙述；段落之间用标题分隔，不写整屏无分段的散文。
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
- 上游设计改名、合并或删除时，检查 `developer/`、`history/`、engineering 文章和站内链接；完成前运行 `bun test` 与 `bun run build`。

## 项目结构

```
src/
  components.ts               # MDX 全局组件注册（无需 import 即可在 .mdx 中使用）
  components/                 # AgentDirective、Header、Render + ui/<组件>/
  layouts/                    # BaseLayout（NimbusHead）、DocsLayout（侧栏/目录/面包屑）
  pages/
    index.astro               # 首页路由（内容来自 content/docs/index.mdx）
    posts/[...slug].astro     # 单篇博客文章页
    posts/index.astro         # 文章列表页；[category]/index.astro 分类页
    [...slug].astro           # 文档页
    [...slug]/index.md.ts     # 每页的 Markdown 版本（agent 友好）
    [...slug]/index.mdx.ts    # 每页的源 MDX
    llms.txt.ts               # 全站索引；llms-full.txt.ts 全文
    og/[...slug].ts           # 每页 OG 卡片；404.astro、robots.txt.ts
  styles/
    globals.css               # 设计令牌（--nb-*）与全局样式
    prose.css                 # 正文排版
    mermaid.css               # 图表容器、全屏与加载骨架
  content/
    docs/
      index.mdx               # 首页内容（sidebar:false + tableOfContents:false）
      docs/                   # 文档正文
        get-started/          # 安装与快速上手
        guides/               # TUI、Provider、Session、Plugin 等使用指南
        features/             # 任务与能力说明
        reference/            # Settings 与键盘参考
        security/             # 权限与凭据边界
        troubleshooting/      # 故障排除
        developer/            # 开发者入口与现行架构
        history/              # 明确标注证据边界的工程历史
    partials/                 # 可复用片段，用 <Render file="..." /> 引用
    posts/                    # 博客内容（目录即分类）
      engineering/            # 工程实践
      product/                # 产品介绍
      research/               # 研究分析
      news/                   # 版本动态
  content.config.ts           # 内容集合配置（docs + posts + partials 三个 collection）
  lib/                        # content.ts（分类与主题）、post-sidebar.ts、hero-image.ts、mermaid-fences.ts
astro.config.ts               # Nimbus 配置 + sidebar + markdown 规则
nimbus.json                   # 记录已核对过的 Nimbus 包版本
```

仿照 [Claude Code 文档](https://docs.anthropic.com) 的目录结构——博客和文档物理分离，各自内部按专题分类。

## 主题系统

### 令牌与字体

- 语义变量统一走 `--nb-*` 命名空间，定义在 `src/styles/globals.css`：`--nb-border`、`--nb-muted-foreground`、`--nb-content-max`、`--nb-h1-size`、`--nb-shadow-sm` 等
- 字体：界面与标题 → Inter Variable，等宽 → JetBrains Mono Variable，均由 `@fontsource-variable/*` 引入并映射到 `--nb-font-sans` / `--nb-font-mono`
- 明暗双主题：暗色由 `[data-mode="dark"]` 切换（不是 Starlight 的 `[data-theme]`），页面内切换入口是 `ThemeToggle`
- 组件样式读取令牌，不写死像素；Tailwind 保留名（`font-sans`、`text-base` 等）在 `globals.css` 里刻意避开，避免与令牌冲突

### 组件层

- 组件放在 `src/components/ui/<组件名>/`，MDX 全局注册表是 `src/components.ts`（`Aside`、`Card/CardGrid`、`CodeGroup`、`FileTree`、`LinkCard`、`PackageManagers`、`Steps/Step`、`Tabs/TabItem`、`Render`）
- 页面级外壳在 `src/layouts/`：`BaseLayout`（head、主题、mermaid 脚本）、`DocsLayout`（侧栏/目录/面包屑/PageActions）

### 首页

首页是内容页 `src/content/docs/index.mdx`（`sidebar: false` + `tableOfContents: false`），不是独立 Astro 页面；`src/pages/index.astro` 只负责路由。

### 历史遗留

`src/styles/submerged.css` 是 Starlight 时代的主题文件，当前没有任何引用，仅作历史保留。

## 开发

```bash
bun run dev      # 启动开发服务器
bun run build    # 构建
bun run preview  # 预览构建产物
```

## 添加新文档页

1. 在 `src/content/docs/docs/<专题>/` 下创建 `.mdx` 文件
2. 在 `astro.config.ts` 的 `nimbusConfig.sidebar.items` 对应分组中添加条目
3. frontmatter 必须包含 `title` 和 `description`

## 添加新博客

1. 在 `src/content/posts/<category>/` 下创建 `.mdx` 文件，**目录即分类**
2. category 可选值：`engineering`（工程实践）、`product`（产品介绍）、`research`（研究分析）、`news`（版本动态）
3. `title` 是 schema 硬性必填；`description`、`date`、`hero.image.file`（相对该 mdx 文件的图片路径，如 `../../../assets/img_xxx.png`）与 `hero.image.alt` 是站点约定，现有文章全部具备
4. 在 `src/lib/content.ts` 的 `postCategories` 中登记主题归属：文章 id 必须加入对应分类某个 `topics[].posts`，否则 `bun test` 失败、侧边栏不显示
5. 自动出现在 `/posts/` 索引、分类页与文章侧栏，无需手动编辑路由
6. 文风按上文"分类文风限制"执行，research 类最严格

## 侧边栏规范

站点两套侧边栏，层级统一为两层（分组 → 页面）：

| 侧边栏 | 数据源 | 层级 |
| --- | --- | --- |
| 文档 | `astro.config.ts` 的 `nimbusConfig.sidebar.items` | 分组 → 页面 |
| 文章 | `src/lib/content.ts` 的 `postSidebar()`，经 `src/lib/post-sidebar.ts` 的 `toNimbusSidebar()` 转成 Nimbus 侧栏项 | 主题 → 文章 |

- 文章侧边栏是 **主题 → 文章** 两层。分类（engineering / product / research / news）只是内容归属，**不参与侧边栏层级**；主题（核心执行、状态与事件……）对应文档侧边栏的分组
- `postSidebar()` 是文章侧边栏的**唯一构造源**：列表页 `postSidebar(posts)`，分类页/单篇页 `postSidebar(posts, category)`，再由 `toNimbusSidebar()` 转换。禁止在页面内手写 sidebar 对象
- 主题及其文章归属登记在 `lib/content.ts` 的 `postCategories[].topics[]`，归属完整性由 `bun test` 自动校验（每篇文章恰好一个主题）

## 内容规范

- 正文可用组件在 `src/components.ts` 注册，无需 import：`Aside`（提示框）、`Tabs/TabItem`（标签页）、`Card/CardGrid`（卡片）、`LinkCard`、`FileTree`、`Steps/Step`、`CodeGroup`、`PackageManagers`、`Render`
- MDX 中 `<` 开头的文本会被当 JSX 解析。代码块内的没事，但表格/段落中写 `<0.5s` 这种要转义或用反引号包起来
- 外部链接用完整 URL；内部链接写**不带 base 前缀**的站内绝对路径，如 `/docs/get-started/quickstart/`、`/posts/engineering/agent-loop/`，渲染时由框架加 `/peri-cool` 前缀
- 文章末尾可以放"下一步"小节，链接到相关页面
