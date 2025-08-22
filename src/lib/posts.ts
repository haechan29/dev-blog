import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Post } from '@/features/post/domain/post';

const postsDirectory = path.join(process.cwd(), 'src/posts');

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return new Post(
    slug,
    data.title,
    data.date,
    content,
    data.tags
  )
}

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      return getPostBySlug(slug);
    })
  return posts.sort((a, b) => a.date > b.date ? -1 : 1);
}