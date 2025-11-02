import type { Element } from 'hast';
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective,
} from 'mdast-util-directive';
import { defaultSchema, type Options } from 'rehype-sanitize';
import type { Node, Parent } from 'unist';
import { visit } from 'unist-util-visit';

type HtmlElement = {
  name: string;
  properties: {
    className?: string;
    id?: string;
    style?: string;
  };
};

type DirectiveNode = ContainerDirective | LeafDirective | TextDirective;

const customElements: Record<string, HtmlElement> = {
  paged: { name: 'div', properties: { className: 'paged' } },
  caption: { name: 'div', properties: { className: 'caption' } },
  hidefullscreen: { name: 'div', properties: { className: 'hide-fullscreen' } },
};

export const schema: Options = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ['className', 'w-full', 'min-w-56 w-1/2'],
    ],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      ['className', 'image-container'],
      'data-original-caption',
    ],
  },
};

export function remarkCustomDirectives() {
  return (tree: Node) => {
    visit(tree, (node: Node, index?: number, parent?: Parent) => {
      if (!isDirectiveNode(node)) return;
      if (customElements[node.name]) {
        const { name, properties } = customElements[node.name];
        node.data = {
          hName: name,
          hProperties: properties,
        };
      } else if (node.name === 'img' && index !== undefined && parent) {
        remarkImage(node, index, parent);
      }
    });
  };
}

export function rehypeLink() {
  return (tree: Node) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && node.properties?.href) {
        const href = node.properties.href as string;
        if (href.startsWith('http') || href.startsWith('//')) {
          node.properties.rel = 'noopener noreferrer';
          node.properties.target = '_blank';
        }
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

function remarkImage(node: DirectiveNode, index: number, parent: Parent) {
  const { url, alt, size } = node.attributes || {};
  if (!url) return;

  const originalCaption = node.children
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

  const caption = node.children.map(child => {
    if (child.type === 'paragraph') {
      return {
        ...child,
        children: child.children.map(textNode => {
          if (textNode.type === 'text' && textNode.value) {
            return {
              ...textNode,
              value: textNode.value
                .replace(/\\#/g, '__ESCAPED_HASH__')
                .replace(/#/g, '')
                .replace(/__ESCAPED_HASH__/g, '#'),
            };
          }
          return textNode;
        }),
      };
    }
    return child;
  });

  const imageContainer = {
    type: 'imageContainer',
    data: {
      hProperties: {
        className: ['image-container'],
        'data-original-caption': originalCaption,
      },
    },
    children: [
      {
        type: 'image',
        url,
        alt: alt || '',
        data: {
          hProperties: {
            className: size === 'large' ? ['w-full'] : ['min-w-56 w-1/2'],
          },
        },
      },
      ...caption,
    ],
  };

  parent.children[index] = imageContainer;
}
