import { describe, expect, test } from 'bun:test';
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Post } from './content';
import {
	getFeaturedPost,
	getPostTopic,
	postCategories,
	postsByTopic,
	resolveFeaturedPost,
	sortPosts,
} from './content';

function post(id: string, date?: Date): Post {
	return {
		id,
		data: { title: id, description: id, date },
	} as Post;
}

describe('sortPosts', () => {
	test('sorts dated posts newest first and undated posts last', () => {
		const posts = [
			post('engineering/undated'),
			post('engineering/older', new Date('2026-08-01T00:00:00Z')),
			post('engineering/newer', new Date('2026-08-12T00:00:00Z')),
		];

		expect(sortPosts(posts).map(({ id }) => id)).toEqual([
			'engineering/newer',
			'engineering/older',
			'engineering/undated',
		]);
	});

	test('uses descending id order when dates are equal or both absent', () => {
		const sameDate = new Date('2026-08-12T00:00:00Z');
		const posts = [
			post('engineering/a'),
			post('engineering/b'),
			post('engineering/c', sameDate),
			post('engineering/d', sameDate),
		];

		expect(sortPosts(posts).map(({ id }) => id)).toEqual([
			'engineering/d',
			'engineering/c',
			'engineering/b',
			'engineering/a',
		]);
	});
});

describe('featured posts', () => {
	test('uses one unique representative per category', () => {
		const ids = postCategories.map(({ featuredPost }) => featuredPost);
		expect(new Set(ids).size).toBe(postCategories.length);
	});

	test('rejects a missing representative', () => {
		expect(() => getFeaturedPost([], 'engineering')).toThrow('代表文章不存在');
	});

	test('keeps the category page available while featured content is synchronizing', () => {
		const fallback = post('research/existing', new Date('2026-08-12T00:00:00Z'));
		expect(resolveFeaturedPost([fallback], 'research')).toBe(fallback);
	});

	test('matches collection ids with or without an mdx extension', () => {
		const featured = post('research/long-session-study.mdx');
		expect(resolveFeaturedPost([featured], 'research')).toBe(featured);
	});
});

describe('post topics', () => {
	test('assigns every configured post to exactly one topic', () => {
		const configuredPosts = postCategories.flatMap((category) =>
			category.topics.flatMap((topic) => topic.posts),
		);
		const postsRoot = join(import.meta.dir, '..', 'content', 'posts');
		const diskPosts = postCategories.flatMap((category) =>
			readdirSync(join(postsRoot, category.id))
				.filter((file) => file.endsWith('.mdx'))
				.map((file) => relative(postsRoot, join(postsRoot, category.id, file)).replace(/\.mdx$/, '')),
		);

		expect(new Set(configuredPosts).size).toBe(configuredPosts.length);
		expect([...configuredPosts].sort()).toEqual(diskPosts.sort());
		for (const category of postCategories) {
			for (const topic of category.topics) expect(topic.posts.length).toBeGreaterThan(0);
		}
		for (const id of configuredPosts) expect(getPostTopic(post(id)).id).toBeTruthy();
	});

	test('rejects an unclassified post', () => {
		expect(() => getPostTopic(post('engineering/not-classified'))).toThrow(
			'应恰好属于一个主题',
		);
	});

	test('preserves topic order and sorts posts inside each topic', () => {
		const posts = [
			post('product/provider-first-success', new Date('2026-08-13T00:00:00Z')),
			post('product/where-peri-fits', new Date('2026-08-12T00:00:00Z')),
			post('product/demo-introducing-peri', new Date('2026-08-01T00:00:00Z')),
			post('product/rewind-boundaries', new Date('2026-08-13T00:00:00Z')),
			post('product/queued-input-and-cancel', new Date('2026-08-12T00:00:00Z')),
			post('product/ask-user-vs-approval', new Date('2026-08-11T00:00:00Z')),
		];

		const groups = postsByTopic(posts, 'product');
		expect(groups.map(({ topic }) => topic.id)).toEqual(['getting-started', 'task-control']);
		expect(groups[0].posts.map(({ id }) => id)).toEqual([
			'product/provider-first-success',
			'product/where-peri-fits',
			'product/demo-introducing-peri',
		]);
	});
});
