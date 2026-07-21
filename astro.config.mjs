// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { visit } from 'unist-util-visit';

/** 将 mermaid 代码块直接转为 <pre class="mermaid">，绕过 ExpressiveCode */
function remarkMermaid() {
	return (tree) => {
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang === 'mermaid' && parent && typeof index === 'number') {
				parent.children[index] = {
					type: 'html',
					value: `<pre class="mermaid">${node.value}</pre>`,
				};
			}
		});
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://konghayao.github.io',
	base: '/peri-cool/',
	markdown: {
		remarkPlugins: [remarkMermaid],
	},
	integrations: [
		starlight({
			title: 'Peri',
			description: '更小、更快、任何模型——Rust 编写的编码助手',
			customCss: ['./src/styles/submerged.css'],
			components: {
				Header: './src/components/Header.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/konghayao/peri' },
			],
			sidebar: [
				{ slug: 'docs/get-started/introduction' },
				{
					label: 'Agent 编排',
					collapsed: false,
					items: [
						{
							label: 'ultracode 工作流',
							collapsed: true,
							items: [
								{ slug: 'docs/features/ultracode' },
								{ slug: 'docs/features/ultracode-primitives' },
								{ slug: 'docs/features/ultracode-scenarios' },
								{ slug: 'docs/features/ultracode-tui' },
							],
						},
						{
							label: 'Subagent',
							collapsed: true,
							items: [
								{ slug: 'docs/features/subagent' },
								{ slug: 'docs/features/subagent-builtin' },
								{ slug: 'docs/features/subagent-modes' },
								{ slug: 'docs/features/subagent-custom' },
								{ slug: 'docs/features/subagent-practices' },
							],
						},
						{ slug: 'docs/features/goal' },
					],
				},
				{
					label: 'Agent 能力',
					collapsed: false,
					items: [
						{ slug: 'docs/features/agent-selection-guide' },
						{ slug: 'docs/features/claude-md' },
						{ slug: 'docs/features/permissions' },
						{ slug: 'docs/features/hooks' },
						{ slug: 'docs/features/skills' },
						{ slug: 'docs/features/mcp' },
						{ slug: 'docs/features/tools' },
						{ slug: 'docs/features/theme' },
					],
				},
			],
			editLink: {
				baseUrl: 'https://github.com/konghayao/peri/edit/main/docs/',
			},
			head: [
				{
					tag: 'script',
					content: "!function(){var e=document.documentElement;e.dataset.theme='light';try{localStorage.setItem('starlight-theme','light')}catch(e){}}();",
				},
				{
					tag: 'link',
					attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				},
				{
					tag: 'link',
					attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
				},
				{
					tag: 'script',
					attrs: { src: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js' },
				},
				{
					tag: 'script',
					content: "(function r(){var b=document.querySelectorAll('pre.mermaid');if(!b.length)return;(function w(){typeof mermaid!=='undefined'?(mermaid.initialize({startOnLoad:!1,theme:'neutral'}),mermaid.run({querySelector:'pre.mermaid'})):setTimeout(w,200)})()})();",
				},
			],
		}),
	],
});
