import { PostDto } from '@/features/post/data/dto/postDto';
import { readdir, readFile } from 'fs/promises';
import matter from 'gray-matter';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src/posts');

async function fetchPostBySlugInner(slug: string): Promise<PostDto> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = await readFile(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: slug,
    title: data.title,
    date: data.date,
    content: content,
    tags: data.tags,
  };
}

export async function fetchAllPosts(): Promise<PostDto[]> {
  const files = await readdir(postsDirectory);

  const posts = await Promise.all(
    files
      .filter(file => file.endsWith('.mdx'))
      .map(async file => {
        try {
          const slug = file.replace(/\.mdx$/, '');
          return await fetchPostBySlugInner(slug);
        } catch (e) {
          console.error(`${file} 파싱 실패: `, e);
          return null;
        }
      })
  );

  return posts.filter(post => post !== null);
}

export async function fetchPostBySlug(slug: string): Promise<PostDto> {
  const posts = await fetchAllPosts();
  const post = posts.find(post => post.slug === slug);

  if (!post) throw new Error(`Post를 찾을 수 없습니다: ${slug}`);

  return post;
}
