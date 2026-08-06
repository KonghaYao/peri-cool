// 研究流水线：挖掘 Peri 智能体数据/结构研究素材 → 定题 → 定大纲 → 初审 → 全稿 → 审查修改
// 产出：4 篇博客文章写入 peri-cool/src/content/posts/<category>/
// 数据交换全部走文件（workflow agent 上下文互相隔离）

export const meta = {
  name: 'research-mine-and-write',
  description: '从 Peri 代码库挖掘 agent 数据研究素材，经定题/大纲/初审/全稿/审查修改流水线产出 4 篇博客文章',
}

// ---- 常量 ----
const ROOT = '/Users/konghayao/code/ai/perihelion'
const MINE_DIR = `${ROOT}/.tmp/research-mine`
const TOPICS_JSON = `${ROOT}/.tmp/research-topics.json`
const OUTLINES_DIR = `${ROOT}/.tmp/research-outlines`
const POSTS_DIR = `${ROOT}/peri-cool/src/content/posts`

// ---- 共享写作规范（各阶段提示词统一引用）----
const STYLE_RULES = `
## 站点写作规范（必须遵守）
- 全部简体中文，程序员对程序员语气：诚实、直接、不浮夸。功能有局限就直说，不用"但是"圆回来。
- 读者是 Peri 的使用者，不是 Peri 的开发者。文章从用户任务出发：想解决什么问题 → 怎么对 Peri 说 → Peri 做了什么 → 结果是什么。不写面向 Peri 开发者内部实现的内容。
- 示例对话 > 技术参数：能展示真实对话/真实数据说明的，不用列配置表。
- 代码优先：能用代码块说明的不用段落。
- 正文避免中文全角冒号（：）和中文引号（""''），用英文标点或自然表达。
- 段落 2-4 句，不写单句悬空段。
- 技术术语首次出现带英文，如"子代理（SubAgent）"。
- MDX 中可用 Aside 组件（import { Aside } from '@astrojs/starlight/components'），可用 mermaid 图、代码块。
- MDX 中表格/段落里写 "<0.5s" 这类内容必须用反引号包起来（\`<0.5s\`），否则会被当 JSX。
- 外部链接用完整 URL，内部链接用绝对路径。
- 事实纪律：文章里每一个数字、路径、功能描述都必须来自素材文件，禁止编造。素材里没有的数据，直接写"我们没有测过"或"目前没有公开数据"，不编。
- 篇幅 1500-3500 字。
- frontmatter 参考现有文章：title + description 必填，description 一句话说清文章价值。
`

// ---- 阶段 0：挖掘（3 路并行）----
const MINE_DEFECT = `
## 任务
你是研究素材挖掘 agent。目标：从 Peri 项目的 agent 缺陷分析研究（agent-defect-analyzer）中挖出有价值的研究主题素材，写一份挖掘报告。

## 素材路径（全部要读，先读 README 和 docs 再读源码）
- ${ROOT}/side-projects/agent-defect-analyzer/README.md
- ${ROOT}/side-projects/agent-defect-analyzer/docs/2026-06-01-defect-analysis.md
- ${ROOT}/side-projects/agent-defect-analyzer/docs/2026-06-01-agent-quality-improvements-design.md
- ${ROOT}/side-projects/agent-defect-analyzer/docs/metrics-spec.md
- ${ROOT}/side-projects/agent-defect-analyzer/docs/report-2026-06-17.md
- ${ROOT}/side-projects/agent-defect-analyzer/docs/wander-report-2026-08-02-v2.md
- ${ROOT}/side-projects/agent-defect-analyzer/src/metrics/*.ts（9 个指标模块：data_health, edit_quality, feature_adoption, resource_consumption, search_hygiene, session_efficiency, subagent_collab, tool_reliability, web_fetch_errors）
- ${ROOT}/side-projects/agent-defect-analyzer/src/wander.ts、src/data/loader.ts

## 已有文章（快速浏览 frontmatter 和开头，避免选题重复）
- ${POSTS_DIR}/engineering/subagent-design.mdx
- ${POSTS_DIR}/engineering/system-prompt.mdx
- ${POSTS_DIR}/engineering/multi-agent.mdx
- ${POSTS_DIR}/engineering/agent-loop.mdx
- ${POSTS_DIR}/engineering/workflow-design.mdx

## 挖掘报告格式（写到 ${MINE_DIR}/defect-analyzer.md，用 Write 创建）
\`\`\`
# 挖掘报告：agent 缺陷分析研究
## 素材盘点
逐份文档列出：核心问题、关键数据点/发现、方法（怎么做的分析）、局限（哪些结论不可靠）
## 候选研究主题（3-5 个）
每个主题给出：
- 标题（一句话，吸引程序员）
- 核心问题（这篇文章回答什么问题）
- 数据证据（素材里有哪些真实数据支撑，具体到数字/文件名）
- 用户价值（Peri 用户看完能获得什么）
- 可写性评估（素材够不够、故事线清不清楚，A/B/C 级）
- 推荐分类（engineering / research / product / news）
## 风险提示
哪些素材数据不足、哪些结论有争议、写作时容易踩什么坑
\`\`\`

## 评判标准
有价值的主题 = 有真实数据支撑 + 对 Peri 用户有实用启发 + 与已有 5 篇文章不重复 + 有清晰故事线。
记住：文章读者是 Peri 使用者（想用 Peri 做事的程序员），不是 Peri 开发者。
`

const MINE_WORKFLOW = `
## 任务
你是研究素材挖掘 agent。目标：从 Peri 项目真实的多 agent 工作流运行数据中挖出有价值的研究主题素材，写一份挖掘报告。

## 素材路径
- ${ROOT}/.claude/workflows/*.mjs（30+ 个真实工作流脚本，浏览 8-12 个代表性脚本：peri-3.0-refactor、full-code-review、i18n-kit-migration、issue-resolution、v2-arch、compact-slices、agent-capability-docs 等，总结它们的编排模式）
- ${ROOT}/.claude/workflow-scripts/*.mjs（同上，抽样）
- ${ROOT}/.claude/workflow-runs/（51 次真实运行记录。每个目录有 script.js / state.json / journal.jsonl。抽样 8-10 个：看 state.json 的 phases、agent 数、结果摘要；journal.jsonl 看事件结构。注意文件可能较大，用 Grep/head 抽样，不要全读）
- ${ROOT}/.claude/autonomy/runs.json（151KB，自主运行统计，用 Grep 抽关键字段）

## 已有文章（快速浏览 frontmatter 和开头，避免选题重复）
- ${POSTS_DIR}/engineering/workflow-design.mdx（讲工作流设计理念，注意不要重复这个主题）
- ${POSTS_DIR}/engineering/multi-agent.mdx
- ${POSTS_DIR}/engineering/agent-loop.mdx

## 挖掘报告格式（写到 ${MINE_DIR}/workflow-data.md，用 Write 创建）
\`\`\`
# 挖掘报告：多 agent 工作流运行数据
## 素材盘点
- 工作流脚本模式：常见的编排结构（parallel/pipeline/phase 怎么用）、规模（多少 agent）
- 运行数据：抽样运行里能看到的 agent 数量、阶段数、耗时量级、成功/失败情况
- 失败模式：journal/state 里暴露的失败（agent 返回 null、阶段失败、重试）
## 候选研究主题（3-5 个）
每个主题给出：
- 标题（一句话，吸引程序员）
- 核心问题
- 数据证据（具体到文件/数字）
- 用户价值（Peri 用户看完能获得什么）
- 可写性评估（A/B/C 级）
- 推荐分类（engineering / research / product / news）
## 风险提示
哪些数据拿不准、哪些运行记录不完整、写的时候怎么避免过度推断
\`\`\`

## 评判标准
有价值的主题 = 有真实数据支撑 + 对 Peri 用户有实用启发 + 与已有文章不重复 + 有清晰故事线。
注意：用户在 ultracode 里不需要手写脚本，所以主题应侧重"多 agent 协作的真实收益/代价/坑"，而不是"怎么写 workflow 脚本"。
`

const MINE_PERF = `
## 任务
你是研究素材挖掘 agent。目标：从 Peri 项目的性能诊断与 TUI/运行时观测研究中挖出有价值的研究主题素材，写一份挖掘报告。

## 素材路径
- ${ROOT}/perf-scan-report-20260802-112852.md（性能诊断报告：3 个并发 agent 时 CPU 50% 的成因解剖，必须精读）
- ${ROOT}/TUI-STYLE.md、${ROOT}/TUI-TOOLCALL.md、${ROOT}/TUI-PAGE.md（TUI 设计文档，浏览关键结构）
- ${ROOT}/.tmp/agent-tui.2026-08-02 ~ 05（4 个目录，看里面有什么数据，抽样）
- ${ROOT}/spec/（issues、reviews、changes 子目录，浏览结构）
- ${ROOT}/.langfuse/logs/（error.log、langfuse.log，Grep 看有没有有价值的错误模式统计）

## 已有文章（快速浏览 frontmatter 和开头，避免选题重复）
- ${POSTS_DIR}/engineering/agent-loop.mdx
- ${POSTS_DIR}/engineering/workflow-design.mdx

## 挖掘报告格式（写到 ${MINE_DIR}/perf-tui.md，用 Write 创建）
\`\`\`
# 挖掘报告：性能与运行时观测
## 素材盘点
- 性能诊断报告的核心发现：问题成因链、每条路径的数据（频率、成本）、修复建议、方法论（怎么诊断的）
- TUI 文档/观测数据里值得讲的东西
- spec 里与 agent 运行质量相关的 issue/review
## 候选研究主题（3-5 个）
每个主题给出：
- 标题（一句话，吸引程序员）
- 核心问题
- 数据证据（具体到数字/文件名）
- 用户价值（Peri 用户看完能获得什么，比如怎么避免类似性能问题、怎么诊断自己的长任务）
- 可写性评估（A/B/C 级）
- 推荐分类（engineering / research / product / news）
## 风险提示
哪些数据拿不准、性能数字在什么条件下测的（不能脱离条件引用）
\`\`\`

## 评判标准
有价值的主题 = 有真实数据支撑 + 对 Peri 用户有实用启发 + 与已有文章不重复 + 有清晰故事线。
注意：性能报告的方法论（怎么定位问题）和结论（渲染风暴/心跳/日志三条路径）同样有价值，可以挖成"如何诊断 agent 工具卡顿/高 CPU"这类用户向主题。
`

// ---- 阶段 1：定题 ----
const TOPIC_SELECT = `
## 任务
你是主编。目标：从三份挖掘报告中选出 4 个最有价值的研究主题，确定题目、分类、核心卖点，输出选题清单 JSON。

## 输入
读取三份挖掘报告（用 Read 全读）：
- ${MINE_DIR}/defect-analyzer.md
- ${MINE_DIR}/workflow-data.md
- ${MINE_DIR}/perf-tui.md

同时快速浏览已有文章 frontmatter（避免重复）：
- ${POSTS_DIR}/engineering/ 下所有 .mdx 的 frontmatter（Grep "title:" 即可）

## 选题要求
1. 选 4 个主题，尽量覆盖不同素材域（如：defect-analyzer 数据研究、工作流运行数据、性能诊断，至少 3 个域）。
2. 每个主题必须满足：真实数据支撑 + 用户价值清晰 + 与已有文章不重复 + 故事线完整。
3. 分类从 engineering / research / product / news 里选（对应 posts 目录）。
4. slug 用英文 kebab-case（如 agent-defect-data-lessons）。
5. description 一句话说清文章价值（会用作 frontmatter）。

## 输出
用 Write 写 ${TOPICS_JSON}，格式（严格 JSON 数组，4 个对象）：
\`\`\`json
[
  {
    "id": "t1",
    "title": "文章标题",
    "category": "engineering",
    "slug": "english-kebab-slug",
    "description": "一句话价值描述（frontmatter description 用）",
    "value": "为什么选这个主题，价值主张",
    "coreQuestion": "文章要回答的核心问题",
    "materials": ["素材文件绝对路径（文章可引用的）"],
    "keyPoints": ["核心论点/章节要点 4-6 个"],
    "audience": "目标读者",
    "differences": "与已有哪篇文章不同、差异化在哪"
  }
]
\`\`\`
JSON 必须合法（不要注释、不要尾逗号）。
`

// ---- 阶段 2：定大纲 ----
function outlinePrompt(n) {
  return `
## 任务
你是文章架构师。目标：为主题 t${n} 撰写详细大纲。

## 输入
1. 用 Read 读 ${TOPICS_JSON}，用 Grep/Read 找到 id 为 "t${n}" 的对象（JSON 数组第 ${n} 个），拿到完整字段。
2. 用 Read 读 materials 字段列出的素材文件（重点素材精读，其余浏览），确认每个关键点的素材支撑。

## 大纲要求（写到 ${OUTLINES_DIR}/t${n}.md，用 Write 创建）
\`\`\`
# 大纲：<标题>
## 定位
- 一句话主张（这篇文章证明/传达什么）
- 目标读者与读完收获
- 与素材的对应关系（哪个素材支撑哪个主张）
## 章节结构
逐章列出：
- 章节标题
- 要点（2-4 个 bullet）
- 素材证据（具体数据/文件路径，标注"待核实"的）
- 预计篇幅（字）
## 开篇 hook
前 3 段怎么抓人（真实场景/真实数据/真实对话，选一个）
## 数据核实清单
正文要用的所有数字、路径，逐一列出待核实项
## frontmatter 草案
title / description（description 一句话）
\`\`\`

${STYLE_RULES}
大纲用中文写。章节 4-7 章，总篇幅 1500-3500 字。
`
}

// ---- 阶段 3：初审 ----
function reviewPrompt(n) {
  return `
## 任务
你是资深编辑。目标：初审主题 t${n} 的大纲，给出修改意见。

## 输入
1. 用 Read 读 ${TOPICS_JSON}，找到 id 为 "t${n}" 的主题对象。
2. 用 Read 读大纲 ${OUTLINES_DIR}/t${n}.md。
3. 用 Read 读 materials 里的关键素材，抽查大纲里引用的数据是否真实存在、是否被曲解。

## 初审要点
- 主张是否站得住：每个核心论点有没有素材支撑？有没有过度推断？
- 数据准确性：抽查 3-5 个具体数字/路径，确认与素材一致。
- 结构：章节顺序是否顺、有没有重复/空洞章节、故事线是否完整。
- 用户视角：是不是在讲用户能用的东西，还是变成了内部实现说明？
- 差异化：与已有文章是否重叠。
- 开篇是否抓人。

## 输出（写到 ${OUTLINES_DIR}/t${n}.review.md，用 Write 创建）
\`\`\`
# 初审意见：<标题>
## 结论
通过 / 修改后通过 / 重写
## 问题清单（按严重程度排序）
每条：问题描述 + 位置 + 具体修改建议
## 需要补充/删除的内容
## 定稿大纲要点
最终章节结构（可直接执行的版本）
\`\`\`
问题要具体可执行，不要空话。如果大纲没问题就明确说通过，不要为了找问题而找问题。
`
}

// ---- 阶段 4：全稿 ----
function draftPrompt(n) {
  return `
## 任务
你是撰稿人。目标：为主题 t${n} 撰写完整文章（MDX），写入 Peri 文档站博客目录。

## 输入
1. 用 Read 读 ${TOPICS_JSON}，找到 id 为 "t${n}" 的主题对象（含 title/category/slug/description/keyPoints）。
2. 用 Read 读大纲 ${OUTLINES_DIR}/t${n}.md 和初审意见 ${OUTLINES_DIR}/t${n}.review.md。
3. 用 Read 精读 materials 里的素材文件，核实每个要引用的数据。引用前必须确认数字真实存在，找不到就删掉该说法。

## 写作要求
- 输出文件路径：${POSTS_DIR}/<category>/<slug>.mdx（用主题对象里的 category 和 slug）
- frontmatter：
\`\`\`mdx
---
title: <标题>
description: <一句话价值>
---
\`\`\`
- 开头 import：\`import { Aside } from '@astrojs/starlight/components';\`
- 正文必须体现真实数据：把素材里的关键数字、真实案例写进去，具体到数字和场景，这是文章与空谈文章的区分点。
- 从用户任务出发：先讲用户遇到的问题/场景，再讲结论，最后给可操作建议。
- 文章末尾加"下一步"小节，内部链接指向相关页面（如 /docs/get-started/quickstart/ 或已有文章路径）。

${STYLE_RULES}
写完用 Write 创建文件。返回一句话确认写好的文件路径。
`
}

// ---- 阶段 5：审查修改 ----
function finalPrompt(n) {
  return `
## 任务
你是终审编辑。目标：审查并修改主题 t${n} 的成稿，确保事实准确、风格合规、结构完整。

## 输入
1. 用 Read 读 ${TOPICS_JSON}，找到 id 为 "t${n}" 的主题对象，确定文章路径：${POSTS_DIR}/<category>/<slug>.mdx
2. 用 Read 读该文章全文。
3. 用 Read 读初审意见 ${OUTLINES_DIR}/t${n}.review.md，核对初审问题是否全部落实。
4. 用 Read/Grep 抽查 materials 里的素材，逐条事实核查文章中的数字、路径、功能描述。

## 审查清单（逐项执行）
1. 事实核查：文章每个数字/路径/功能描述与素材核对，不一致的直接改。素材里没有支撑的说法删掉或改写为"我们没有测过"。
2. 风格合规：中文全角冒号（：）/中文引号（""''）全文检索并替换；段落是否 2-4 句；是否程序员语气、诚实直接。
3. 结构：开篇是否抓人、章节是否顺、结尾是否有"下一步"。
4. 用户视角：有没有变成内部实现说明，跑偏的要改回用户视角。
5. frontmatter：title/description 是否符合规范。
6. MDX 合法性：\`<\` 开头文本是否转义、import 是否正确、Aside 用法是否正确。

## 修改方式
发现问题直接用 Edit 修改文章文件。全部改完后写总结（写到 ${OUTLINES_DIR}/t${n}.final.md）：
\`\`\`
# 终审报告：<标题>
## 修改摘要
逐条列出：问题 → 修改内容 → 状态（已改/无需改）
## 事实核查结果
核对了哪些数字，与素材是否一致
## 遗留问题
改不了/拿不准的
\`\`\`
`
}

// ---- 执行 ----
phase('挖掘')
const mineResults = await parallel([
  () => agent(MINE_DEFECT, { label: 'mine:defect-analyzer', allowedTools: ['Read', 'Grep', 'Glob', 'Write', 'Bash'] }),
  () => agent(MINE_WORKFLOW, { label: 'mine:workflow-data', allowedTools: ['Read', 'Grep', 'Glob', 'Write', 'Bash'] }),
  () => agent(MINE_PERF, { label: 'mine:perf-tui', allowedTools: ['Read', 'Grep', 'Glob', 'Write', 'Bash'] }),
])

phase('定题')
await agent(TOPIC_SELECT, { label: 'topic-selection', allowedTools: ['Read', 'Grep', 'Write'] })

phase('定大纲')
const outlineResults = await parallel([1, 2, 3, 4].map((n) => () => agent(outlinePrompt(n), { label: `outline:t${n}`, allowedTools: ['Read', 'Grep', 'Write'] })))

phase('初审')
const reviewResults = await parallel([1, 2, 3, 4].map((n) => () => agent(reviewPrompt(n), { label: `review:t${n}`, allowedTools: ['Read', 'Grep', 'Write'] })))

phase('全稿')
const draftResults = await parallel([1, 2, 3, 4].map((n) => () => agent(draftPrompt(n), { label: `draft:t${n}`, allowedTools: ['Read', 'Grep', 'Write'] })))

phase('审查修改')
const finalResults = await parallel([1, 2, 3, 4].map((n) => () => agent(finalPrompt(n), { label: `final:t${n}`, allowedTools: ['Read', 'Grep', 'Edit', 'Write'] })))

return {
  mine: mineResults.map((r) => r !== null),
  outlines: outlineResults.map((r) => r !== null),
  reviews: reviewResults.map((r) => r !== null),
  drafts: draftResults.map((r) => r !== null),
  finals: finalResults.map((r) => r !== null),
}
