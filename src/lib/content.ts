import type { CollectionEntry } from 'astro:content';

export const postCategories = [
	{
		id: 'engineering',
		label: '工程',
		description: '从真实问题出发，解释 Peri 怎样诊断、取舍、恢复并验证。',
		promise: '这里不只拆解内部模块，也记录一次任务为什么会失败、怎样恢复，以及工程判断如何落到可验证结果。',
		boundary: '实现细节必须服务于问题与决策；没有测试或源码证据时，不把推测写成机制事实。',
		featuredPost: 'engineering/recovering-long-running-tasks',
		topics: [
			{
				id: 'execution',
				label: '核心执行',
				description: '模型请求、执行循环与提示词怎样形成一次可重复的 Agent 回合。',
				posts: [
					'engineering/agent-loop',
					'engineering/provider-stream-consistency',
					'engineering/system-prompt',
					'engineering/prompt-cache-determinism',
				],
			},
			{
				id: 'state-events',
				label: '状态与事件',
				description: '会话历史、压缩恢复与事件身份怎样跨轮次保持一致。',
				posts: [
					'engineering/transcript-atomic-commit',
					'engineering/compact-projection-recovery',
					'engineering/event-identity',
					'engineering/recovering-long-running-tasks',
				],
			},
			{
				id: 'collaboration',
				label: '协作与协议',
				description: '协议边界、子代理与工作流怎样组织多个执行者。',
				posts: [
					'engineering/acp-positioning',
					'engineering/multi-agent',
					'engineering/subagent-design',
					'engineering/workflow-design',
				],
			},
			{
				id: 'interface-extensions',
				label: '界面与扩展',
				description: '终端渲染和生命周期扩展怎样保持可观察、可验证。',
				posts: [
					'engineering/streaming-markdown-cache',
					'engineering/hook-system',
				],
			},
		],
	},
	{
		id: 'product',
		label: '产品',
		description: '从 TUI 中的真实任务出发，说明 Peri 适合做什么以及何时不该用。',
		promise: '这里回答使用者最直接的问题：我该怎样把任务交给 Peri，我会在界面里看到什么，怎样判断它真的做完了。',
		boundary: '不以功能清单替代使用场景，不以内部实现替代产品体验，也不回避权限、验证和不可逆操作的边界。',
		featuredPost: 'product/where-peri-fits',
		topics: [
			{
				id: 'getting-started',
				label: '认识与开始',
				description: '先理解 Peri 适合什么任务，再完成第一次真实模型请求。',
				posts: [
					'product/demo-introducing-peri',
					'product/where-peri-fits',
					'product/provider-first-success',
				],
			},
			{
				id: 'task-control',
				label: '任务控制',
				description: '在 TUI 中处理决策、审批、追加输入、中断与回退。',
				posts: [
					'product/ask-user-vs-approval',
					'product/queued-input-and-cancel',
					'product/rewind-boundaries',
				],
			},
		],
	},
	{
		id: 'research',
		label: '研究',
		description: '用明确样本、口径、反证和局限研究 Agent 的实际行为。',
		promise: '这里把运行数据转成可以检查的结论，同时区分直接观察、机制推演与尚未验证的问题。',
		boundary: '每个数字都要有分母与窗口；观察性数据不升级为因果，私人会话只允许不可关联的聚合结果。',
		featuredPost: 'research/long-session-study',
		topics: [
			{
				id: 'long-running-agents',
				label: '长任务行为',
				description: '观察超长会话、上下文压缩与子代理调度的共同形态。',
				posts: [
					'research/long-session-study',
					'research/subagent-dispatch-phases',
				],
			},
			{
				id: 'tool-efficiency',
				label: '工具效能',
				description: '用调用数据衡量工具成本、浪费模式与修复后的变化。',
				posts: [
					'research/tool-token-consumption',
					'research/tool-behavior-fix-evidence',
				],
			},
			{
				id: 'resource-baselines',
				label: '资源基线',
				description: '记录特定环境下的资源快照，并明确外推边界。',
				posts: ['research/sandbox-memory-usage'],
			},
		],
	},
	{
		id: 'news',
		label: '动态',
		description: '按证据窗口记录已经发生的产品与项目变化。',
		promise: '这里是一份时间账本，说明什么新增了、什么修复了、什么改变了，以及使用者是否需要行动。',
		boundary: '文章日期、Git tag、代码提交与公众发布日期分别表述；项目更新不冒充正式发布说明。',
		featuredPost: 'news/2026-08-13-project-updates',
		topics: [
			{
				id: 'project-updates',
				label: '项目更新',
				description: '按证据窗口汇总用户可见的新增、修复与行动提示。',
				posts: [
					'news/2026-08-01-weekly-updates',
					'news/2026-08-13-project-updates',
				],
			},
			{
				id: 'version-retrospectives',
				label: '版本回顾',
				description: '用 tag、提交与设计记录回看一个版本阶段的工程方向。',
				posts: ['news/demo-v2-release'],
			},
		],
	},
] as const;

export type PostCategory = (typeof postCategories)[number]['id'];
export type Post = CollectionEntry<'posts'>;
export type PostTopic = (typeof postCategories)[number]['topics'][number];

const categoryById = new Map(postCategories.map((category) => [category.id, category]));

export function getPostCategoryId(post: Pick<Post, 'id'>): PostCategory {
	const category = post.id.split('/')[0];
	if (!categoryById.has(category as PostCategory)) {
		throw new Error(`文章 ${post.id} 使用了未知分类“${category}”`);
	}
	return category as PostCategory;
}

export function getPostCategory(category: string) {
	const metadata = categoryById.get(category as PostCategory);
	if (!metadata) {
		throw new Error(`未知文章分类“${category}”`);
	}
	return metadata;
}

export function sortPosts(posts: Post[]): Post[] {
	for (const post of posts) getPostCategoryId(post);

	return [...posts].sort((left, right) => {
		const leftDate = left.data.date?.getTime() ?? Number.NEGATIVE_INFINITY;
		const rightDate = right.data.date?.getTime() ?? Number.NEGATIVE_INFINITY;
		const dateOrder = rightDate - leftDate;
		return dateOrder || right.id.localeCompare(left.id);
	});
}

export function postsInCategory(posts: Post[], category: PostCategory): Post[] {
	return sortPosts(posts).filter((post) => getPostCategoryId(post) === category);
}

function postIdWithoutExtension(id: string): string {
	return id.replace(/\.mdx$/, '');
}

export function getPostTopics(category: PostCategory): readonly PostTopic[] {
	return getPostCategory(category).topics;
}

export function getPostTopic(post: Pick<Post, 'id'>): PostTopic {
	const category = getPostCategoryId(post);
	const normalizedId = postIdWithoutExtension(post.id);
	const matches = getPostTopics(category).filter((topic) =>
		(topic.posts as readonly string[]).includes(normalizedId),
	);
	if (matches.length !== 1) {
		throw new Error(
			`文章 ${post.id} 应恰好属于一个主题，当前匹配 ${matches.length} 个`,
		);
	}
	return matches[0];
}

export function postsByTopic(posts: Post[], category: PostCategory) {
	const categoryPosts = postsInCategory(posts, category);
	for (const post of categoryPosts) getPostTopic(post);

	const actualIds = new Set(categoryPosts.map((post) => postIdWithoutExtension(post.id)));
	for (const topic of getPostTopics(category)) {
		if (topic.posts.length === 0) {
			throw new Error(`主题“${topic.label}”不能为空`);
		}
		for (const configuredId of topic.posts) {
			if (!actualIds.has(configuredId)) {
				throw new Error(`主题“${topic.label}”引用了不存在的文章：${configuredId}`);
			}
		}
	}

	return getPostTopics(category).map((topic) => ({
		topic,
		posts: categoryPosts.filter((post) => getPostTopic(post).id === topic.id),
	}));
}

export function getFeaturedPost(posts: Post[], category: PostCategory): Post {
	const metadata = getPostCategory(category);
	const post = posts.find(
		(entry) => postIdWithoutExtension(entry.id) === metadata.featuredPost,
	);
	if (!post) throw new Error(`栏目“${metadata.label}”的代表文章不存在：${metadata.featuredPost}`);
	if (getPostCategoryId(post) !== category) {
		throw new Error(`代表文章 ${post.id} 不属于栏目“${metadata.label}”`);
	}
	return post;
}

/**
 * 页面渲染使用的宽容解析。
 *
 * Astro dev 在新增 MDX 与依赖它的元数据同时热更新时，collection 可能短暂返回
 * 上一次同步结果。此时栏目页退回当前分类的最新文章，下一次内容同步后自动恢复
 * featured；严格缺失检查仍由 getFeaturedPost 和站点测试承担。
 */
export function resolveFeaturedPost(posts: Post[], category: PostCategory): Post {
	try {
		return getFeaturedPost(posts, category);
	} catch (error) {
		const fallback = sortPosts(posts)[0];
		if (fallback) return fallback;
		throw error;
	}
}

export function postPath(post: Pick<Post, 'id'>): string {
	return `posts/${post.id.replace(/\.mdx$/, '')}/`;
}

type SidebarGroup = {
	label: string;
	items: { label: string; link: string }[];
};

/** 文章侧边栏：主题 → 文章（两层），与文档侧边栏（分组 → 页面）层级一致。
 * 分类（工程/产品等）是内容归属，不参与侧边栏层级。
 * 传 category 只返回该分类下的主题（文章页/分类页用），不传返回全部分类主题（列表页用）。 */
export function postSidebar(posts: Post[], category?: PostCategory): SidebarGroup[] {
	const categories = category ? [getPostCategory(category)] : postCategories;
	return categories.flatMap((c) =>
		postsByTopic(posts, c.id).map(({ topic, posts: topicPosts }) => ({
			label: topic.label,
			items: topicPosts.map((post) => ({
				label: post.data.title,
				link: `/${postPath(post)}`,
			})),
		})),
	);
}
