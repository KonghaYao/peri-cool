// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://peri.pages.dev',
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
						{ slug: 'docs/get-started/why-peri' },
					],
				},
				{
					label: '功能',
					collapsed: false,
					items: [
						{ slug: 'docs/features/ultracode' },
						{ slug: 'docs/features/subagent' },
						{ slug: 'docs/features/skills' },
						{ slug: 'docs/features/tools' },
						{ slug: 'docs/features/theme' },
						{ slug: 'docs/features/goal' },
					],
				},
				{
					label: '参考',
					collapsed: true,
					items: [
						{ slug: 'docs/reference/architecture' },
						{ slug: 'docs/reference/config' },
					],
				},
				{
					label: '其他',
					collapsed: true,
					items: [
						{ slug: 'docs/community/contributing' },
						{ slug: 'docs/developer' },
					],
				},
			],
			editLink: {
				baseUrl: 'https://github.com/konghayao/peri/edit/main/docs/',
			},
			head: [
				{
					tag: 'script',
					content: `!function(){var e=document.documentElement;e.dataset.theme='light';try{localStorage.setItem('starlight-theme','light')}catch(e){}}();`,
				},
				{
					tag: 'link',
					attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				},
				{
					tag: 'link',
					attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
				},
			],
		}),
	],
});
