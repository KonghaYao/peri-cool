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
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/konghayao/peri' },
			],
			sidebar: [
				{
					label: '指南',
					items: [
						{ label: '快速上手', slug: 'guides/getting-started' },
						{ label: '为什么选择 Peri', slug: 'guides/why-peri' },
					],
				},
				{
					label: '功能',
					items: [
						{ label: 'ultracode 工作流', slug: 'guides/ultracode' },
						{ label: '/theme 主题', slug: 'guides/theme' },
						{ label: '/goal 长任务', slug: 'guides/goal' },
					],
				},
				{
					label: '参考',
					items: [
						{ label: '架构设计', slug: 'reference/architecture' },
					],
				},
			],
			editLink: {
				baseUrl: 'https://github.com/konghayao/peri/edit/main/docs/',
			},
			head: [
				// 在 Starlight 主题检测之前强制亮色模式
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
