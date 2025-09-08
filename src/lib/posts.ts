import { Heading } from '@/features/post/domain/model/post';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];

  const tree = unified().use(remarkParse).parse(content);

  visit(tree, 'heading', node => {
    const text = node.children
      .filter(child => child.type === 'text')
      .map(child => child.value)
      .join('');

    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, '')
      .replace(/\s+/g, '-');

    headings.push({
      id,
      text,
      level: node.depth,
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
    .trim();
}
