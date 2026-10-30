import type { NimbusIntegrationOptions } from "@cloudflare/nimbus-docs";

/**
 * 生成 Markdown 时站点自有 MDX 组件的转换器。
 *
 * Nimbus 的 `.md` / `llms-full.txt` 由 MDX 源码重新序列化；未登记的组件只
 * 保留子节点，自闭合组件（`<OpenUI />`）会整体消失。这里补上组件的语义，
 * 让「查看 Markdown」看到的面板源码与对话发言人仍然完整。
 */
type ComponentMap = NonNullable<
  NonNullable<NimbusIntegrationOptions["markdown"]>["componentMap"]
>;

/** 围栏长度取内容里最长反引号串 + 1，避免程序里的反引号提前闭合。 */
function fence(body: string, lang = "text"): string {
  const longest = (body.match(/`+/g) ?? []).reduce(
    (max, run) => Math.max(max, run.length),
    0,
  );
  const marker = "`".repeat(Math.max(3, longest + 1));
  return `${marker}${lang}\n${body}\n${marker}`;
}

function text(value: string | boolean | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

/** `program={`…`}` 在 AST 里是表达式源码，去掉外层模板字面量反引号。 */
function templateBody(value: string): string {
  const match = /^`([\s\S]*)`$/.exec(value.trim());
  return (match ? match[1] : value).trimEnd();
}

export const markdownComponents: ComponentMap = {
  OpenUI: {
    revision: "openui-v1",
    render: ({ attrs }) => {
      const title = text(attrs.title);
      const program = text(attrs.program);
      if (!program) return title ? `**${title}**` : "";
      const body = templateBody(program);
      return title ? `**${title}**\n\n${fence(body)}` : fence(body);
    },
  },
  ChatMessage: {
    revision: "chat-message-v1",
    render: ({ attrs, children }) => {
      const role = attrs.role === "assistant" ? "assistant" : "user";
      const name = text(attrs.name) ?? (role === "assistant" ? "Peri" : "你");
      return `**${name}**\n\n${children}`;
    },
  },
};
