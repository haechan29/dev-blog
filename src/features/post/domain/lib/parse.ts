import Heading from '@/features/post/domain/model/heading';
import { remarkBgm, remarkDialogue, remarkImg } from '@/lib/md/remark';
import GithubSlugger from 'github-slugger';
import { Node, Parent, Root } from 'mdast';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import remarkIns from 'remark-ins';
import remarkParse from 'remark-parse';
import remarkSupersub from 'remark-supersub';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const slugger = new GithubSlugger();

const textProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm, { singleTilde: false })
  .use(remarkIns)
  .use(remarkSupersub)
  .use(remarkDirective)
  .use(remarkImg)
  .use(remarkBgm)
  .use(remarkDialogue)
  .use(remarkFilter);

export function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];

  slugger.reset();
  const tree = unified().use(remarkParse).parse(content);

  visit(tree, 'heading', node => {
    const text = node.children
      .filter(child => child.type === 'text')
      .map(child => child.value)
      .join('');

    const id = slugger.slug(text);

    headings.push({
      id,
      text,
      level: node.depth,
    });
  });

  return headings;
}
export function extractPlainText(content: string): string {
  const tree = textProcessor.parse(content);
  const transformed = textProcessor.runSync(tree);
  return extractText(transformed);
}

function remarkFilter() {
  return (tree: Root) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (
        node.type === 'heading' ||
        node.type === 'table' ||
        node.type === 'imageWithCaption' ||
        node.type === 'bgm'
      ) {
        if (parent && index !== undefined) {
          parent.children.splice(index, 1);
          return index;
        }
      }
    });
  };
}

function extractText(node: Node): string {
  if ('value' in node && typeof node.value === 'string') {
    return node.value;
  }

  if ('children' in node && Array.isArray(node.children)) {
    const texts = node.children.map(child => extractText(child));

    if (
      node.type === 'root' ||
      node.type === 'blockquote' ||
      node.type === 'list'
    ) {
      return texts.join('\n');
    }

    return texts.join('');
  }

  return '';
}
