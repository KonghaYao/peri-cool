import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			/* Starlight hero 配置（可选）：文章页启用内置 hero（大标题 + 头图），
			 * image.file 为相对该 mdx 文件的图片路径，如 ../../../assets/ant-and-mountain.png */
			hero: z
				.object({
					tagline: z.string().optional(),
					image: z
						.object({
							file: image(),
							alt: z.string().default(''),
						})
						.optional(),
				})
				.optional(),
		}),
});

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	posts,
};
