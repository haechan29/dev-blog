import { LINE_BREAK_MARKER } from '@/lib/md';
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
  return (tree: Node) => {
    visit(tree, 'paragraph', (paragraph: Paragraph) => {
      const newChildren: PhrasingContent[] = [];
      paragraph.children.forEach(child => {
        if (child.type === 'text' && child.value.includes(LINE_BREAK_MARKER)) {
          const parts = child.value.split(LINE_BREAK_MARKER);
          parts.forEach((part, index) => {
            if (part) newChildren.push({ type: 'text', value: part });
            if (index < parts.length - 1) newChildren.push({ type: 'break' });
          });
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

function isDirectiveNode(node: Node): node is DirectiveNode {
  return (
    node.type === 'containerDirective' ||
    node.type === 'leafDirective' ||
    node.type === 'textDirective'
  );
}
