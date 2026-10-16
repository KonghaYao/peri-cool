import type { NimbusIntegrationOptions } from "@cloudflare/nimbus-docs";

/**
 * Hast-plugin entry accepted by the Nimbus markdown pipeline. Derived from the
 * integration's own option type so this file doesn't have to depend on the
 * markdown processor package directly.
 */
type HastPluginInput = NonNullable<
  NonNullable<NimbusIntegrationOptions["markdown"]>["hastPlugins"]
>[number];

/**
 * The fence language Shiki reports. The property survives as the raw HTML name
 * it was written with, so check both spellings.
 */
function fenceLang(properties: Record<string, unknown>): string | undefined {
  const value =
    properties["data-nb-lang"] ??
    properties.dataNbLang ??
    properties["data-language"] ??
    properties.dataLanguage;
  return typeof value === "string" ? value : undefined;
}

/**
 * ```mermaid 围栏 → `<pre class="mermaid">`。
 *
 * 处理器默认把围栏交给 Shiki，产出的代码块外壳（语言标签、复制按钮、
 * astro-code 配色）对图表没有意义；而 `src/scripts/mermaid.ts` 只渲染
 * `pre.mermaid`。这一步在 Shiki 之后把整个 figure 换成裸 `<pre>`，
 * 图表源码原样保留在 DOM 里，等浏览器端渲染。
 */
export function mermaidFences(): HastPluginInput {
  return {
    name: "peri:mermaid-fences",
    element: {
      filter: ["figure"],
      visit(node, ctx) {
        const pre = (node.children ?? []).find(
          (child) => child.type === "element" && child.tagName === "pre",
        );
        // The narrowing inside the predicate doesn't carry to the result.
        if (!pre || pre.type !== "element") return;
        if (fenceLang(pre.properties ?? {}) !== "mermaid") return;
        return {
          type: "element",
          tagName: "pre",
          properties: { className: ["mermaid"] },
          children: [{ type: "text", value: ctx.textContent(pre).trimEnd() }],
        };
      },
    },
  };
}
