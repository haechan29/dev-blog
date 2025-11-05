import type { Element } from 'hast';
import { Paragraph, PhrasingContent } from 'mdast';
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from 'mdast-util-directive';
import { defaultSchema, type Options } from 'rehype-sanitize';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;

export const schema: Options = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ['data-size', 'large', 'medium'],
      'data-caption',
    ],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      'data-bgm',
      'data-youtube-url',
      'data-start-time',
    ],
  },
};

export function remarkBreaks() {
  return (tree: Node, file: VFile) => {
    const source = String(file.value);
    const lineBreaks = findLineBreaks(source);
    let lineBreakIndex = 0;

    visit(tree, 'paragraph', (paragraph: Paragraph) => {
      const newChildren: PhrasingContent[] = [];
      paragraph.children.forEach(child => {
        if (child.type === 'text') {
          const nodeStart = child.position!.start.offset!;
          const nodeEnd = child.position!.end.offset!;
          const currentLineBreaks = [[nodeStart, 0]];

          while (lineBreakIndex < lineBreaks.length) {
            const [breakStart, breakCount] = lineBreaks[lineBreakIndex];
            if (breakStart > nodeEnd) break;
            if (breakStart >= nodeStart) {
              currentLineBreaks.push([breakStart, breakCount]);
            }
            lineBreakIndex++;
          }

          for (const [breakStart, breakCount] of currentLineBreaks) {
            const value = source.slice(nodeStart, breakStart);
            if (value) newChildren.push({ type: 'text', value });
            for (let i = 0; i < breakCount; i++) {
              newChildren.push({ type: 'break' });
            }
          }
          const [breakStart, breakCount] = currentLineBreaks.at(-1)!;
          const value = source.slice(breakStart + breakCount, nodeEnd);
          if (value) newChildren.push({ type: 'text', value });
        } else {
          newChildren.push(child);
        }
      });
      paragraph.children = newChildren;
    });
  };
}

export function remarkImg() {
  return (tree: Node) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;
      if (!isDirectiveNode(node) || node.name !== 'img') return;

      const { url, alt = '', size = 'medium' } = node.attributes || {};
      if (!url) return;

      const caption = node.children
        .filter(child => child.type === 'paragraph')
        .map(p =>
          p.children
            .map(child => {
              if (child.type === 'text') return child.value;
              if (child.type === 'break') return '\n';
              return '';
            })
            .join('')
        )
        .join('\n');

      const newNode = {
        type: 'image',
        url,
        alt,
        data: {
          hProperties: {
            'data-size': size,
            'data-caption': caption,
          },
        },
      };
      parent.children[index] = newNode;
    });
  };
}

export function remarkBgm() {
  return (tree: Node) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (index === undefined || !parent) return;
      if (!isDirectiveNode(node) || node.name !== 'bgm') return;

      const { youtubeUrl, startTime } = node.attributes || {};
      if (!youtubeUrl) return;

      const newNode = {
        type: 'bgm',
        data: {
          hProperties: {
            'data-bgm': '',
            'data-youtube-url': youtubeUrl,
            'data-start-time': startTime ?? '0',
          },
        },
      };

      parent.children[index] = newNode;
    });
  };
}

export function rehypeBgm() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'div' && 'data-bgm' in node.properties) {
        node.tagName = 'bgm';
      }
    });
  };
}

function findLineBreaks(str: string): [number, number][] {
  const result: [number, number][] = [];
  const regex = /\n+/g;
  let match;

  while ((match = regex.exec(str)) !== null) {
    const startIndex = match.index;
    const count = match[0].length;
    result.push([startIndex, count]);
  }

  return result;
}

function isDirectiveNode(node: Node): node is DirectiveNode {
  return (
    node.type === 'containerDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'textDirective'
  );
}
