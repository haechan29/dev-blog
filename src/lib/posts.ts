import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { Heading, Post } from '@/features/post/domain/post';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

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

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  
  const tree = unified()
    .use(remarkParse)
    .parse(content);

  visit(tree, 'heading', (node) => {
    const text = node.children
      .filter((child: any) => child.type === 'text')
      .map((child: any) => child.value)
      .join('');
    
    const id = text.toLowerCase()
      .replace(/[^\w\s가-힣]/g, '')
      .replace(/\s+/g, '-');

    headings.push({
      id,
      text,
      level: node.depth
    });
  });

  return headings;
}

export function extractPlainText(content: string): string {
  return content
    .replace(/^---[\s\S]*?---/m, '') // frontmatter 제거
    .replace(/<section[\s\S]*?<\/section>/g, '') // section 태그와 내용 모두 제거
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/`[^`]*`/g, '') // 인라인 코드 제거
    .replace(/<[^>]*>/g, '') // JSX 태그 제거
    .replace(/^#{1,6}\s+.*$/gm, '') // 마크다운 헤딩 라인 전체 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // **굵게** 제거
    .replace(/\*(.*?)\*/g, '$1') // *기울임* 제거
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 링크 제거
    .replace(/\n+/g, ' ') // 개행 제거
    .trim()
    .substring(0, 150) + '...'; // 150자로 제한
}