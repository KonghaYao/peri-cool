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
				{
					label: '开始使用',
					collapsed: false,
					items: [
						{ slug: 'docs/get-started/introduction' },
						{ slug: 'docs/get-started/quickstart' },
					],
				},
				{
					label: '日常开发',
					collapsed: false,
					items: [
						{ slug: 'docs/features/explore-codebase' },
						{ slug: 'docs/features/implement-feature' },
						{ slug: 'docs/features/refactor-code' },
						{ slug: 'docs/features/code-review' },
						{ slug: 'docs/features/fix-bugs' },
						{ slug: 'docs/features/write-tests' },
					],
				},
				{
					label: '任务编排',
					collapsed: false,
					items: [
						{ slug: 'docs/features/parallel-work' },
						{ slug: 'docs/features/long-running-tasks' },
						{ slug: 'docs/features/cron' },
					],
				},
				{
					label: '模型与配置',
					collapsed: false,
					items: [
						{ slug: 'docs/features/model-profiles' },
						{ slug: 'docs/features/agent-selection-guide' },
						{ slug: 'docs/features/model-strategy' },
						{ slug: 'docs/features/theme' },
						{ slug: 'docs/features/cli-reference' },
					],
				},
				{
					label: 'Agent 能力',
					collapsed: false,
					items: [
						{ slug: 'docs/features/skills' },
						{ slug: 'docs/features/tools' },
						{ slug: 'docs/features/mcp' },
						{ slug: 'docs/features/hooks' },
						{ slug: 'docs/features/permissions' },
						{ slug: 'docs/features/image-input' },
						{ slug: 'docs/features/context-engineering' },
						{ slug: 'docs/features/best-practices' },
					],
				},
				{
					label: '技能与规范',
					collapsed: false,
					items: [
						{ slug: 'docs/features/claude-md' },
						{ slug: 'docs/features/polish-claude-md' },
						{ slug: 'docs/features/superpowers' },
						{ slug: 'docs/features/claude-official-plugins' },
						{ slug: 'docs/features/mattpocock-skills' },
						{ slug: 'docs/features/openspec' },
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
					attrs: { src: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js', defer: true },
				},
				{
					tag: 'script',
					content: "document.addEventListener('DOMContentLoaded',function(){var b=document.querySelectorAll('pre.mermaid');if(!b.length)return;mermaid.initialize({startOnLoad:!1,theme:'neutral'});mermaid.run({querySelector:'pre.mermaid'});});",
				},
			],
		}),
	],
});
