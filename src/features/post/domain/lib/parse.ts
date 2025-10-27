import Heading from '@/features/post/domain/model/heading';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
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
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/`[^`]*`/g, '') // remove inline code
    .replace(/^#{1,6}\s+.*$/gm, '') // remove heading markers
    .replace(/^\s*[-*+]\s+/gm, '') // remove unordered list markers
    .replace(/^\s*\d+\.\s+/gm, '') // remove ordered list markers
    .replace(/^\s*>\s*(.*)/gm, '$1') // remove blockquote markers and keep content
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold formatting
    .replace(/__(.*?)__/g, '$1') // remove bold formatting (underscore)
    .replace(/\*(.*?)\*/g, '$1') // remove italic formatting
    .replace(/_(.*?)_/g, '$1') // remove italic formatting (underscore)
    .replace(/~~(.*?)~~/g, '$1') // remove strikethrough formatting
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links and keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // remove images completely
    .replace(/^\s*\|.*\|$/gm, '') // remove table rows
    .replace(/^\s*[-:|\s]*$/gm, '') // remove table separators
    .replace(/^\s*---+\s*$/gm, '') // remove horizontal rules
    .replace(/[ \t]+/g, ' ') // remove multiple spaces and tabs only
    .replace(/\n+/g, '\n') // reduce multiple newlines to single newline
    .trim();
}
