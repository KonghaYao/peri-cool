import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { postCategories } from '../src/lib/content.ts';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const base = '/peri-cool/';

function walk(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);
		return entry.isDirectory() ? walk(path) : [path];
	});
}

function htmlTarget(pathname) {
	const local = pathname.slice(base.length);
	const file = join(dist, local);
	if (extname(file)) return file;
	return join(file, 'index.html');
}

const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));
const failures = [];
const reachablePosts = new Map();

for (const file of htmlFiles) {
	const html = readFileSync(file, 'utf8');
	const source = relative(dist, file);
	const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));

	for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
		const value = match[1].replaceAll('&amp;', '&');
		if (value.startsWith('/') && !value.startsWith(base)) {
			failures.push(`${source}: root-relative URL misses base ${value}`);
			continue;
		}
		if (!value.startsWith(base)) continue;
		const url = new URL(value, 'https://example.invalid');
		const target = htmlTarget(url.pathname);
		if (!existsSync(target)) {
			failures.push(`${source}: missing ${url.pathname}`);
			continue;
		}
		if (url.hash && target.endsWith('.html')) {
			const targetHtml = target === file ? html : readFileSync(target, 'utf8');
			const targetIds = target === file
				? ids
				: new Set([...targetHtml.matchAll(/\sid="([^"]+)"/g)].map((item) => item[1]));
			const fragment = decodeURIComponent(url.hash.slice(1));
			if (!targetIds.has(fragment)) failures.push(`${source}: missing fragment ${value}`);
		}
		const post = url.pathname.match(/^\/peri-cool\/posts\/(engineering|product|research|news)\/[^/]+\/$/);
		if (post && (source === 'index.html' || source.endsWith('/index.html'))) {
			const key = url.pathname;
			reachablePosts.set(key, (reachablePosts.get(key) ?? 0) + 1);
		}
	}

	for (const match of html.matchAll(/href="(https:\/\/github\.com\/[^\"]+\/edit\/[^\"]+)"/g)) {
		if (!match[1].startsWith('https://github.com/KonghaYao/peri-cool/edit/main/src/content/docs/')) {
			failures.push(`${source}: unexpected edit link ${match[1]}`);
		}
	}
}

const postFiles = walk(join(root, 'src/content/posts')).filter((file) => file.endsWith('.mdx'));
for (const file of postFiles) {
	const id = relative(join(root, 'src/content/posts'), file).replace(/\.mdx$/, '');
	const route = `${base}posts/${id}/`;
	if (!reachablePosts.has(route)) failures.push(`unreachable post: ${route}`);
}

for (const categoryMetadata of postCategories) {
	const category = categoryMetadata.id;
	const page = readFileSync(join(dist, 'posts', category, 'index.html'), 'utf8');
	const overview = readFileSync(join(dist, 'posts', 'index.html'), 'utf8');
	const topics = [...page.matchAll(/<section[^>]+id="topic-([^"]+)"[^>]+data-topic="\1"/g)]
		.map((match) => match[1]);
	const expectedTopics = categoryMetadata.topics.map((topic) => topic.id);
	if (JSON.stringify(topics) !== JSON.stringify(expectedTopics)) {
		failures.push(`${category} topic order ${JSON.stringify(topics)} != ${JSON.stringify(expectedTopics)}`);
	}
	for (const topic of categoryMetadata.topics) {
		if (topic.posts.length === 0) failures.push(`${category}/${topic.id} topic is empty`);
	}
	for (const topic of topics) {
		const anchor = `${base}posts/${category}/#topic-${topic}`;
		if (!overview.includes(`href="${anchor}"`)) {
			failures.push(`posts index misses topic link ${anchor}`);
		}
	}
	for (const file of postFiles.filter((item) => relative(join(root, 'src/content/posts'), item).startsWith(`${category}/`))) {
		const id = relative(join(root, 'src/content/posts'), file).replace(/\.mdx$/, '');
		const marker = `data-post="${id}"`;
		const count = page.split(marker).length - 1;
		if (count !== 1) failures.push(`${category} index contains ${marker} ${count} times`);
	}
}

if (!existsSync(join(dist, 'sitemap-index.xml'))) failures.push('missing sitemap-index.xml');
if (!existsSync(join(dist, 'pagefind', 'pagefind.js'))) failures.push('missing Pagefind index');

if (failures.length) {
	console.error(failures.join('\n'));
	process.exit(1);
}

console.log(`site check passed: ${htmlFiles.length} HTML pages, ${postFiles.length} posts`);
