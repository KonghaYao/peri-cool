// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { visit } from 'unist-util-visit';

/** 将 mermaid 代码块直接转为 <pre class="mermaid">，绕过 ExpressiveCode */
function remarkMermaid() {
	return (tree) => {
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang === 'mermaid' && parent && typeof index === 'number') {
				const diagram = node.value
					.replaceAll('&', '&amp;')
					.replaceAll('<', '&lt;')
					.replaceAll('>', '&gt;');
				parent.children[index] = {
					type: 'html',
					value: `<div class="peri-mermaid"><pre class="mermaid">${diagram}</pre></div>`,
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
			description: 'Rust 编写的终端 AI 编码助手',
			customCss: ['./src/styles/submerged.css'],
			components: {
				Header: './src/components/Header.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/konghayao/peri' },
			],
			sidebar: [
				{ slug: 'docs' },
				{
					label: '开始使用',
					collapsed: false,
					items: [
						{ slug: 'docs/get-started/introduction' },
						{ slug: 'docs/get-started/installation' },
						{ slug: 'docs/get-started/quickstart' },
						{ slug: 'docs/get-started/termux-install' },
					],
				},
				{
					label: '使用指南',
					collapsed: false,
					items: [
						{ slug: 'docs/guides/providers' },
						{ slug: 'docs/guides/sessions' },
						{ slug: 'docs/guides/tui-navigation' },
						{ slug: 'docs/guides/non-interactive' },
						{ slug: 'docs/guides/plugins' },
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
						{ slug: 'docs/features/ultracode-workflow' },
						{ slug: 'docs/features/ultracode-usage' },
						{ slug: 'docs/features/ultra-adlc' },
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
						{ slug: 'docs/features/meta-harness' },
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
				{
					label: '参考与安全',
					collapsed: true,
					items: [
						{ slug: 'docs/features/cli-reference' },
						{ slug: 'docs/reference/settings' },
						{ slug: 'docs/reference/keyboard-shortcuts' },
						{ slug: 'docs/security/secrets-and-permissions' },
						{ slug: 'docs/troubleshooting' },
					],
				},
				{
					label: '开发与历史',
					collapsed: true,
					items: [
						{ slug: 'docs/developer' },
						{ slug: 'docs/developer/architecture' },
						{ slug: 'docs/history/3-0-refactor' },
						{ slug: 'docs/history/milestones' },
					],
				},
			],
			editLink: {
				baseUrl: 'https://github.com/KonghaYao/peri-cool/edit/main/',
			},
			head: [
				{
					tag: 'script',
					attrs: { src: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js', defer: true },
				},
				{
					tag: 'script',
					content: "document.addEventListener('DOMContentLoaded',function(){if(typeof mermaid==='undefined')return;mermaid.initialize({startOnLoad:!1,theme:'base',themeVariables:{primaryColor:'#f6d7c8',primaryTextColor:'#241a17',primaryBorderColor:'#c96f4b',lineColor:'#8c5a48',secondaryColor:'#d9eaf2',tertiaryColor:'#e6e1f3',mainBkg:'#f6d7c8',nodeBorder:'#c96f4b',clusterBkg:'#fff7f2',clusterBorder:'#d9a58e',fontFamily:'Songti SC, Noto Serif CJK SC, sans-serif'}});mermaid.run({querySelector:'pre.mermaid'});});"
				},
			],
		}),
	],
});
