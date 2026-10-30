import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import nimbus, { defineConfig as defineNimbusConfig } from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";
import { mermaidFences } from "./src/lib/mermaid-fences";
import { postCategories } from "./src/lib/content";

const nimbusConfig = defineNimbusConfig({
  site: "https://konghayao.github.io",
  title: "Peri",
  description: "Rust 编写的终端 AI 编码助手",
  locale: "zh-CN",
  github: "https://github.com/konghayao/peri",
  socialImageAlt: "Peri 文档预览",
  rendering: { collections: { docs: "build", posts: "build" } },
  sidebar: {
    items: [
      { label: "文档总览", link: "/docs/" },
      {
        label: "开始使用",
        collapsed: false,
        items: [
          { label: "Peri 概述", link: "/docs/get-started/introduction/" },
          { label: "安装、升级与卸载", link: "/docs/get-started/installation/" },
          { label: "在 TUI 中快速上手", link: "/docs/get-started/quickstart/" },
          { label: "Termux 安装", link: "/docs/get-started/termux-install/" },
        ],
      },
      {
        label: "使用指南",
        collapsed: false,
        items: [
          { label: "在 TUI 中连接模型服务", link: "/docs/guides/providers/" },
          { label: "管理会话", link: "/docs/guides/sessions/" },
          { label: "TUI 导航", link: "/docs/guides/tui-navigation/" },
          { label: "非交互模式", link: "/docs/guides/non-interactive/" },
          { label: "插件管理", link: "/docs/guides/plugins/" },
        ],
      },
      {
        label: "日常开发",
        collapsed: false,
        items: [
          { label: "探索陌生代码库", link: "/docs/features/explore-codebase/" },
          { label: "实现新功能", link: "/docs/features/implement-feature/" },
          { label: "安全重构", link: "/docs/features/refactor-code/" },
          { label: "审查代码变更", link: "/docs/features/code-review/" },
          { label: "定位并修复 Bug", link: "/docs/features/fix-bugs/" },
          { label: "编写测试", link: "/docs/features/write-tests/" },
        ],
      },
      {
        label: "任务编排",
        collapsed: false,
        items: [
          { label: "并行执行多任务", link: "/docs/features/parallel-work/" },
          { label: "Ultracode 编排模式图解", link: "/docs/features/ultracode-workflow/" },
          { label: "ultracode 使用建议", link: "/docs/features/ultracode-usage/" },
          { label: "Ultra-ADLC：超大规模完整交付", link: "/docs/features/ultra-adlc/" },
          { label: "管理长任务", link: "/docs/features/long-running-tasks/" },
          { label: "定时任务", link: "/docs/features/cron/" },
        ],
      },
      {
        label: "模型与配置",
        collapsed: false,
        items: [
          { label: "模型档位", link: "/docs/features/model-profiles/" },
          { label: "选型指南", link: "/docs/features/agent-selection-guide/" },
          { label: "降低 API 费用", link: "/docs/features/model-strategy/" },
          { label: "主题", link: "/docs/features/theme/" },
        ],
      },
      {
        label: "Agent 能力",
        collapsed: false,
        items: [
          { label: "Skills", link: "/docs/features/skills/" },
          { label: "工具系统", link: "/docs/features/tools/" },
          { label: "MCP", link: "/docs/features/mcp/" },
          { label: "Hooks", link: "/docs/features/hooks/" },
          { label: "权限系统", link: "/docs/features/permissions/" },
          { label: "系统提示词与能力裁剪（Meta Harness）", link: "/docs/features/meta-harness/" },
          { label: "图片输入", link: "/docs/features/image-input/" },
          { label: "回答里的界面（OpenUI）", link: "/docs/features/openui/" },
          { label: "上下文工程", link: "/docs/features/context-engineering/" },
          { label: "最佳实践", link: "/docs/features/best-practices/" },
        ],
      },
      {
        label: "技能与规范",
        collapsed: false,
        items: [
          { label: "项目指引文件", link: "/docs/features/claude-md/" },
          { label: "CLAUDE.md", link: "/docs/features/polish-claude-md/" },
          { label: "Superpowers 工作流", link: "/docs/features/superpowers/" },
          { label: "Claude 官方插件", link: "/docs/features/claude-official-plugins/" },
          { label: "mattpocock/skills", link: "/docs/features/mattpocock-skills/" },
          { label: "OpenSpec", link: "/docs/features/openspec/" },
        ],
      },
      {
        label: "参考与安全",
        collapsed: true,
        items: [
          { label: "命令参考", link: "/docs/features/cli-reference/" },
          { label: "Settings 参考", link: "/docs/reference/settings/" },
          { label: "键盘操作", link: "/docs/reference/keyboard-shortcuts/" },
          { label: "凭据与权限边界", link: "/docs/security/secrets-and-permissions/" },
          { label: "故障排除", link: "/docs/troubleshooting/" },
        ],
      },
      {
        label: "开发与历史",
        collapsed: true,
        items: [
          { label: "开发者入口", link: "/docs/developer/" },
          { label: "架构总览", link: "/docs/developer/architecture/" },
          { label: "3.0 分层重构", link: "/docs/history/3-0-refactor/" },
          { label: "可验证工程里程碑", link: "/docs/history/milestones/" },
        ],
      },
      // 顶栏章节：Nimbus 只把「跨 collection 的 section」当作标签，子目录不算。
      // 这里让 posts collection 按分类各挂一个 section——章节 href 用 prefix，
      // 条目仍来自同一个 collection，文章 URL 不受影响。
      // 这些 section 只服务顶栏；文档侧栏由 src/pages/[...slug].astro 的
      // SidebarTransform 摘掉，避免把整棵文章树塞进文档导航。
      ...postCategories.map((category) => ({
        label: category.label,
        autogenerate: { collection: "posts", prefix: `/posts/${category.id}` },
        collapsed: true,
      })),
    ],
  },
});

export default defineConfig({
  site: "https://konghayao.github.io",
  base: "/peri-cool/",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    resolve: { dedupe: ["react", "react-dom"] },
    // 同一包的两个 subpath 若被分别预打包，会各持一份 canvas/hooks 模块，
    // 主题桥与 Renderer 读到不同的 store。让 Vite 直接走源码，共享同一模块图。
    optimizeDeps: {
      exclude: ["@peri-code/sdk", "@openuidev/react-lang", "@openuidev/lang-core"],
    },
    // SDK 的 OpenUI 出口直接发布 .tsx 源码；SSR 阶段必须交给 Vite 编译，
    // 不能让 Node 按原生 ESM 外置加载（Node 不解析 JSX）。
    ssr: {
      noExternal: ["@peri-code/sdk", "@openuidev/react-lang", "@openuidev/lang-core"],
    },
  },
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [react(), nimbus(nimbusConfig, {
    rules: {
      "nimbus/frontmatter-shape": "error",
      "nimbus/internal-link": "error",
    },
    markdown: {
      hastPlugins: [tableScroll(), mermaidFences()],
      features: { headingAttributes: true },
    },
  })],
});
